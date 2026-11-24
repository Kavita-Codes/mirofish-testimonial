import os
import cv2
import numpy as np
from typing import Dict, Any, List
from .config import Config

SEED_REELS_DATA = [
    {
        "id": "reel_01",
        "topic": "Relatable college life",
        "hook": "Every college student has experienced this!",
        "caption": "Tag your college friend who does this every single semester 💀👇\n\nDrop a comment if your sleep schedule is completely ruined during midterms!\n\n#CollegeLife #StudentLife #Relatable #CollegeMemes #HostelLife",
        "hashtags": "#CollegeLife #StudentLife #Relatable #HostelDiaries",
        "description": "Humorous depiction of the panic before morning lectures and surviving on iced coffee and instant noodles.",
        "color_theme": (30, 40, 180),  # Crimson / Warm Red
        "duration_sec": 8.0
    },
    {
        "id": "reel_02",
        "topic": "AI tools for students",
        "hook": "These AI tools can save you hours!",
        "caption": "Save this list for later so you don't lose it! 📌\n\n1. Perplexity AI - research with cited sources\n2. Gamma App - automated presentations in 60s\n3. Notion AI - lecture notes organized effortlessly\n\nTag a classmate who needs to see this!\n\n#AITools #StudentTips #Technology #Productivity #StudyHacks",
        "hashtags": "#AITools #StudentTips #Technology #Productivity #CollegeHacks",
        "description": "High-value tech listicle showcasing top 3 student productivity AI tools with seamless screen demonstration.",
        "color_theme": (180, 80, 20),  # Blue / Tech Cyan
        "duration_sec": 11.0
    },
    {
        "id": "reel_03",
        "topic": "Emotional storytelling",
        "hook": "Sometimes the smallest moments matter most.",
        "caption": "Share this with someone special today ❤️\n\nLife moves so fast that we often forget to appreciate the simple conversations that shaped who we are today.\n\n#Storytelling #Emotions #Life #Gratitude #Friendship",
        "hashtags": "#Storytelling #Emotions #Life #Mindfulness #Inspiration",
        "description": "Slow-paced emotional narrative exploring human connection, nostalgic moments, and gratitude.",
        "color_theme": (60, 120, 60),  # Sage Green
        "duration_sec": 24.0
    },
    {
        "id": "reel_04",
        "topic": "LinkedIn Job Search Myth",
        "hook": "Stop applying to 100 jobs on LinkedIn like this!",
        "caption": "You are wasting your time with the 'Easy Apply' button.\n\nHere is the 3-step networking framework that landed my clients interviews in 14 days:\n1. Find the 2nd-degree hiring manager\n2. Send a 45-word value proposition\n3. Include a 1-page sample audit\n\nSave this for your next job hunt! 💼\n\n#CareerAdvice #JobSearch #LinkedInTips #Hiring #CareerGrowth",
        "hashtags": "#CareerAdvice #JobSearch #LinkedInTips #Productivity",
        "description": "Punchy career advice warning applicants against spamming resumes, revealing high-conversion DM outreach.",
        "color_theme": (140, 60, 20),  # Corporate Slate
        "duration_sec": 14.0
    },
    {
        "id": "reel_05",
        "topic": "Financial hack for 20-somethings",
        "hook": "The money rule nobody teaches you in your 20s",
        "caption": "Save this before your next salary hits your account! 💰\n\nThe 50-30-20 rule is outdated for Gen Z. Here is the revised inflation-adjusted wealth blueprint.\n\nSend this to a friend who is trying to start investing!\n\n#FinanceTips #MoneyHacks #Investing #PersonalFinance #WealthBuilding",
        "hashtags": "#FinanceTips #MoneyHacks #Investing #GenZFinance",
        "description": "Personal finance breakdown showing simple automated investment math and lifestyle inflation traps.",
        "color_theme": (30, 150, 40),  # Emerald Green
        "duration_sec": 13.0
    },
    {
        "id": "reel_06",
        "topic": "Viral Instagram growth myth",
        "hook": "Why posting 3 Reels a day is destroying your reach",
        "caption": "Instagram does NOT reward spamming anymore.\n\nIn 2026, the algorithm optimizes for DM share velocity and rewatch loops, not upload frequency. Focus on 4 high-retention Reels a week instead of 21 mediocre ones.\n\nShare this with a creator who needs to hear this! 🚀\n\n#InstagramGrowth #ReelsTips #Algorithm #SocialMediaTips #CreatorEconomy",
        "hashtags": "#InstagramGrowth #ReelsTips #Algorithm #CreatorTips",
        "description": "Counter-intuitive social media advice debunking high-volume posting and breaking down true viral mechanics.",
        "color_theme": (120, 20, 140),  # Purple / Indigo
        "duration_sec": 10.0
    },
    {
        "id": "reel_07",
        "topic": "Morning routine reality vs expectation",
        "hook": "What 5 AM morning routines actually look like",
        "caption": "Expectation: Green juice, meditation, 5 mile run.\nReality: Hitting snooze 6 times and staring at the ceiling in existential dread.\n\nSend this to your friend who swore they'd wake up early tomorrow 😂⏰\n\n#MorningRoutine #Comedy #ExpectationVsReality #Relatable #FunnyReels",
        "hashtags": "#MorningRoutine #Comedy #ExpectationVsReality #Humor",
        "description": "Split-screen comedic parody comparing aesthetic influencer morning vlogs with chaotic everyday reality.",
        "color_theme": (20, 100, 160),  # Ocean Blue
        "duration_sec": 9.0
    },
    {
        "id": "reel_08",
        "topic": "Must-have free Chrome extensions",
        "hook": "3 secret websites that feel illegal to know",
        "caption": "Bookmark this list right now before you forget! 💻\n\nThese free web tools will literally automate half of your daily research tasks.\n\nComment 'LINK' and I'll send the full curated directory to your DMs!\n\n#TechHacks #Websites #FreeTools #LifeHacks #Productivity",
        "hashtags": "#TechHacks #Websites #FreeTools #ProductivityHacks",
        "description": "Rapid-fire visual tool roundup displaying browser tabs and live interface interactions.",
        "color_theme": (160, 80, 20),  # Teal
        "duration_sec": 12.0
    },
    {
        "id": "reel_09",
        "topic": "Fitness mindset shift",
        "hook": "You're not lazy, your workout plan is just boring",
        "caption": "Consistency comes from enjoyment, not punishment.\n\nIf you hate the treadmill, don't force it. Try calisthenics, swimming, or boxing.\n\nShare this with your gym bro! 💪\n\n#FitnessMotivation #GymTips #Health #WorkoutMotivation #FitnessJourney",
        "hashtags": "#FitnessMotivation #GymTips #Health #Discipline",
        "description": "High-energy gym footage paired with an empowering reframing of exercise motivation.",
        "color_theme": (30, 30, 160),  # Electric Orange/Red
        "duration_sec": 16.0
    },
    {
        "id": "reel_10",
        "topic": "Late night motivation punchline",
        "hook": "The hard truth about achieving your goals",
        "caption": "Nobody is coming to save you. Nobody is going to do the pushups for you.\n\nTake responsibility today and build the life you promised yourself.\n\nDrop a 🔥 if you needed this reminder tonight!\n\n#Mindset #Motivation #Discipline #SelfImprovement #Focus",
        "hashtags": "#Mindset #Motivation #Discipline #Inspiration",
        "description": "Dark cinematic monologue with dramatic audio beat drop emphasizing personal accountability.",
        "color_theme": (20, 20, 30),  # Midnight Noir
        "duration_sec": 19.0
    }
]

def generate_synthetic_reel_video(
    output_path: str,
    title: str,
    hook_text: str,
    color_theme: tuple,
    duration_sec: float = 10.0,
    width: int = 720,
    height: int = 1280,
    fps: int = 24
) -> str:
    """
    Generates a genuine 9:16 vertical MP4 video file with OpenCV.
    Renders dynamic motion, animated text banners, visual pattern interrupts,
    and safe-zone indicators so real video processing works seamlessly.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    total_frames = int(duration_sec * fps)

    # Use 'mp4v' or 'XVID' codec for cross-platform MP4 generation
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    if not out.isOpened():
        # Fallback to alternate fourcc if needed
        fourcc = cv2.VideoWriter_fourcc(*'avc1')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

    b_base, g_base, r_base = color_theme

    for f_idx in range(total_frames):
        current_time = f_idx / fps
        progress = f_idx / total_frames

        # Dynamic animated background with gradient and subtle motion
        frame = np.zeros((height, width, 3), dtype=np.uint8)
        motion_offset = int(np.sin(current_time * 2.5) * 20.0)

        # Draw vertical gradient
        for y in range(0, height, 8):
            factor = (y / height) * 0.7 + 0.3
            b = min(int((b_base + motion_offset) * factor), 255)
            g = min(int((g_base + motion_offset) * factor), 255)
            r = min(int((r_base + motion_offset) * factor), 255)
            frame[y:y+8, :] = (b, g, r)

        # 1. Pattern Interrupt at 1.8s (flash / quick pulse to stop thumb)
        if 1.6 <= current_time <= 2.0:
            flash_intensity = int(abs(np.sin((current_time - 1.6) * 7.5)) * 90)
            frame = cv2.add(frame, np.full_like(frame, flash_intensity))

        # 2. Instagram Safe Zone Guide (middle of screen)
        # Top banner: Category & Topic
        cv2.rectangle(frame, (40, 160), (width - 40, 230), (20, 20, 20), -1)
        cv2.putText(frame, f"VIRALSCOPE AI | {title.upper()}", (60, 205),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2, cv2.LINE_AA)

        # 3. Hook Overlay (First 3 seconds: high-impact bold box)
        if current_time <= 3.5:
            pulse = int(np.sin(current_time * 6.0) * 8.0)
            cv2.rectangle(frame, (30 - pulse, 450 - pulse), (width - 30 + pulse, 640 + pulse), (0, 0, 0), -1)
            cv2.rectangle(frame, (30 - pulse, 450 - pulse), (width - 30 + pulse, 640 + pulse), (0, 220, 255), 4)

            # Wrap hook text
            words = hook_text.split()
            line1 = " ".join(words[:4])
            line2 = " ".join(words[4:]) if len(words) > 4 else ""
            cv2.putText(frame, line1, (50, 520), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 3, cv2.LINE_AA)
            if line2:
                cv2.putText(frame, line2, (50, 590), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 0), 3, cv2.LINE_AA)
        else:
            # Body content representation
            cv2.putText(frame, "KEY REEL TAKEAWAY", (60, 520), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (200, 255, 200), 2, cv2.LINE_AA)
            cv2.putText(frame, "Watch until end for payoff", (60, 580), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2, cv2.LINE_AA)

        # 4. Countdown / Progress Bar at bottom
        bar_width = int((width - 80) * progress)
        cv2.rectangle(frame, (40, height - 140), (width - 40, height - 125), (40, 40, 40), -1)
        cv2.rectangle(frame, (40, height - 140), (40 + bar_width, height - 125), (0, 255, 128), -1)

        # Timestamp display
        time_str = f"{current_time:.1f}s / {duration_sec:.1f}s"
        cv2.putText(frame, time_str, (width - 220, height - 90), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1, cv2.LINE_AA)

        out.write(frame)

    out.release()
    return output_path

def ensure_seed_videos() -> Dict[str, str]:
    """Ensures all 10 synthetic Reel video files exist on disk for instant analysis."""
    Config.ensure_directories()
    generated_paths = {}

    for reel in SEED_REELS_DATA:
        r_id = reel["id"]
        v_path = os.path.join(Config.SAMPLE_VIDEOS_FOLDER, f"{r_id}.mp4")
        if not os.path.exists(v_path) or os.path.getsize(v_path) < 1000:
            generate_synthetic_reel_video(
                output_path=v_path,
                title=reel["topic"],
                hook_text=reel["hook"],
                color_theme=reel["color_theme"],
                duration_sec=reel["duration_sec"]
            )
        generated_paths[r_id] = v_path

    return generated_paths
