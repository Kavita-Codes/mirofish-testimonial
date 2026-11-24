import os
import cv2
import base64
import numpy as np
from typing import Dict, Any, List, Optional
from .config import Config

class VideoProcessor:
    """
    Performs real computer vision video analysis on uploaded Instagram Reels.
    Extracts keyframes at critical narrative timestamps, measures editing cuts,
    detects pacing, luminance, contrast, and prepares base64 frames for Gemini Vision.
    """

    @staticmethod
    def process_video(video_path: str, reel_id: str) -> Dict[str, Any]:
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file not found at {video_path}")

        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Could not open video file: {video_path}")

        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)) or 0
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or 0
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 0

        duration = round(total_frames / fps, 2) if total_frames and fps else 0.0
        aspect_ratio = round(width / height, 3) if height > 0 else 0.0
        is_vertical_9_16 = 0.50 <= aspect_ratio <= 0.62

        # Create output directory for extracted keyframes
        reel_frames_dir = os.path.join(Config.FRAMES_FOLDER, reel_id)
        os.makedirs(reel_frames_dir, exist_ok=True)

        # Target timestamps to sample:
        # Hook: 0.5s, 1.5s, 2.5s
        # Body: 35%, 65% of duration
        # CTA: 95% of duration
        sample_targets = []
        if duration >= 3.0:
            sample_targets = [
                ("hook_0_5s", 0.5),
                ("hook_1_5s", 1.5),
                ("hook_2_5s", 2.5),
                ("mid_body_1", duration * 0.35),
                ("mid_body_2", duration * 0.65),
                ("cta_ending", max(duration * 0.95, duration - 1.0))
            ]
        elif duration > 0:
            sample_targets = [
                ("hook_start", 0.2),
                ("hook_mid", duration * 0.5),
                ("cta_ending", max(duration * 0.9, 0.1))
            ]
        else:
            sample_targets = [("sample", 0.0)]

        extracted_frames = []
        luminance_scores = []
        contrast_scores = []

        for label, timestamp in sample_targets:
            target_frame_num = int(min(timestamp * fps, total_frames - 1)) if total_frames > 0 else 0
            cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame_num)
            ret, frame = cap.read()
            if not ret or frame is None:
                continue

            # Compute luminance & contrast
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            lum = float(np.mean(gray))
            con = float(np.std(gray))
            luminance_scores.append(lum)
            contrast_scores.append(con)

            # Save full/preview frame
            frame_filename = f"{label}.jpg"
            frame_path = os.path.join(reel_frames_dir, frame_filename)
            cv2.imwrite(frame_path, frame, [cv2.IMWRITE_JPEG_QUALITY, 85])

            # Generate base64 thumbnail for AI vision API
            # Resize thumbnail for API transport efficiency (width 480 or height 854)
            h, w = frame.shape[:2]
            scale = min(480 / w, 854 / h) if w > 480 or h > 854 else 1.0
            if scale < 1.0:
                resized = cv2.resize(frame, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
            else:
                resized = frame

            _, buffer = cv2.imencode('.jpg', resized, [cv2.IMWRITE_JPEG_QUALITY, 80])
            b64_str = base64.b64encode(buffer).decode('utf-8')

            extracted_frames.append({
                "label": label,
                "timestamp": round(timestamp, 2),
                "frame_path": frame_path,
                "relative_url": f"/api/frames/{reel_id}/{frame_filename}",
                "base64": b64_str,
                "luminance": round(lum, 1),
                "contrast": round(con, 1)
            })

        # Scene cut / Motion pacing analysis
        # Sample frames every 0.5s to estimate cut density
        cut_count = 0
        motion_scores = []
        if total_frames > int(fps):
            step_frames = int(max(fps * 0.5, 1))
            prev_gray = None
            sample_count = 0
            for f_idx in range(0, total_frames, step_frames):
                if sample_count > 60:  # limit sampling to 30 seconds for speed
                    break
                cap.set(cv2.CAP_PROP_POS_FRAMES, f_idx)
                ret, frame = cap.read()
                if not ret:
                    break
                gray_small = cv2.resize(cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY), (120, 213))
                if prev_gray is not None:
                    diff = cv2.absdiff(gray_small, prev_gray)
                    mean_diff = float(np.mean(diff))
                    motion_scores.append(mean_diff)
                    if mean_diff > 35.0:  # Significant visual scene change / cut threshold
                        cut_count += 1
                prev_gray = gray_small
                sample_count += 1

        cap.release()

        avg_luminance = round(float(np.mean(luminance_scores)), 1) if luminance_scores else 128.0
        avg_contrast = round(float(np.mean(contrast_scores)), 1) if contrast_scores else 50.0
        avg_motion = round(float(np.mean(motion_scores)), 1) if motion_scores else 15.0
        estimated_cuts_per_minute = round((cut_count / (duration / 60.0)), 1) if duration > 3 else 0.0

        # Assess visual metrics based on real calculations
        lighting_grade = "Optimal" if 85 <= avg_luminance <= 180 else ("Under-exposed (Dark)" if avg_luminance < 85 else "Over-exposed (Washed out)")
        pacing_grade = "Fast / High Energy" if estimated_cuts_per_minute > 20 else ("Moderate / Balanced" if estimated_cuts_per_minute > 8 else "Slow / Monologue")

        return {
            "duration": duration,
            "width": width,
            "height": height,
            "fps": round(fps, 1),
            "total_frames": total_frames,
            "aspect_ratio": aspect_ratio,
            "is_vertical_9_16": is_vertical_9_16,
            "extracted_frames_count": len(extracted_frames),
            "extracted_frames": extracted_frames,
            "avg_luminance": avg_luminance,
            "avg_contrast": avg_contrast,
            "lighting_grade": lighting_grade,
            "cut_count": cut_count,
            "cuts_per_minute": estimated_cuts_per_minute,
            "pacing_grade": pacing_grade,
            "avg_motion_energy": avg_motion
        }
