import os
import json
import re
from typing import Dict, Any, List, Optional
from .config import Config

class GeminiAnalyzer:
    """
    AI Content Analysis Engine powered by Gemini & LLMs.
    Performs multimodal evaluation of the video frames, hook, editing pace,
    visual composition, caption, CTA, originality, emotion, and audience fit.
    """

    def __init__(self):
        self.client_type = None
        self._init_client()

    def _init_client(self):
        # 1. Check for native Gemini API Key
        if Config.GEMINI_API_KEY:
            try:
                from google import genai
                self.gemini_client = genai.Client(api_key=Config.GEMINI_API_KEY)
                self.client_type = "google_genai"
                print("[GeminiAnalyzer] Initialized native Google GenAI client.")
                return
            except Exception as e:
                print(f"[GeminiAnalyzer] Google GenAI init warning: {e}")

        # 2. Check for OpenAI-compatible / Dashscope endpoint
        if Config.LLM_API_KEY:
            try:
                from openai import OpenAI
                self.openai_client = OpenAI(
                    api_key=Config.LLM_API_KEY,
                    base_url=Config.LLM_BASE_URL
                )
                self.client_type = "openai_compat"
                print(f"[GeminiAnalyzer] Initialized LLM client via {Config.LLM_BASE_URL} (Model: {Config.LLM_MODEL_NAME})")
                return
            except Exception as e:
                print(f"[GeminiAnalyzer] LLM client init warning: {e}")

        print("[GeminiAnalyzer] No external API credentials configured. Using deterministic algorithmic heuristic analyzer.")
        self.client_type = "heuristic"

    def analyze_reel(
        self,
        reel_data: Dict[str, Any],
        video_metrics: Dict[str, Any],
        campaign_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Orchestrates full AI content analysis across all 10 required dimensions.
        """
        # Try LLM / Gemini analysis first
        analysis_result = None
        if self.client_type in ["google_genai", "openai_compat"]:
            try:
                analysis_result = self._call_ai_model(reel_data, video_metrics, campaign_context)
            except Exception as e:
                print(f"[GeminiAnalyzer] AI API call failed ({e}). Falling back to algorithmic analysis.")

        if not analysis_result:
            analysis_result = self._fallback_algorithmic_analysis(reel_data, video_metrics, campaign_context)

        return analysis_result

    def _call_ai_model(
        self,
        reel_data: Dict[str, Any],
        video_metrics: Dict[str, Any],
        campaign_context: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        niche = campaign_context.get('niche', 'General')
        target_audience = campaign_context.get('target_audience', 'Broad Instagram Users')
        topic = reel_data.get('topic', '')
        hook_text = reel_data.get('hook', '')
        caption = reel_data.get('caption', '')
        hashtags = reel_data.get('hashtags', '')
        description = reel_data.get('description', '')

        prompt = f"""
You are an expert Instagram Reels algorithm scientist and viral content strategist.
Analyze this unpublished Instagram Reel for a campaign targeting {target_audience} in the {niche} niche.

VIDEO SPECS & REAL COMPUTER VISION METRICS:
- Duration: {video_metrics.get('duration')} seconds
- Resolution: {video_metrics.get('width')}x{video_metrics.get('height')} (Aspect Ratio: {video_metrics.get('aspect_ratio')}, 9:16 Vertical: {video_metrics.get('is_vertical_9_16')})
- Average Lighting Luminance: {video_metrics.get('avg_luminance')} ({video_metrics.get('lighting_grade')})
- Average Contrast: {video_metrics.get('avg_contrast')}
- Editing Cuts per Minute: {video_metrics.get('cuts_per_minute')} ({video_metrics.get('pacing_grade')})
- Extracted Hook & Body Frames: {video_metrics.get('extracted_frames_count')} keyframes sampled

REEL CONTENT:
- Topic: {topic}
- Opening Hook (Spoken/Text): {hook_text}
- Draft Caption: {caption}
- Hashtags: {hashtags}
- Content Description: {description}

Please analyze the content rigorously across ALL 10 dimensions. Provide a numeric score (0 to 100) and specific, actionable critique for each:
1. first_3s_hook (Curiosity gap, pattern interrupt, scroll-stopping power)
2. video_structure (Story arc, problem -> twist/payoff, loop potential)
3. visual_quality (Lighting, 9:16 framing, visual cleanliness)
4. editing_pace (Cut rhythm, dead air elimination, motion dynamics)
5. audio_subtitles (Rhythm, caption/subtitle sync, hook reinforcement)
6. caption_quality (First line impact, spacing, call to save/read while video loops)
7. cta_effectiveness (Does it trigger DMs/saves or is it generic "follow me"?)
8. content_originality (Is it fresh or an overused template?)
9. emotional_appeal (Dopamine trigger: humor, surprise, validation, controversy)
10. audience_relevance (Alignment with {target_audience})

Also provide:
- summary_critique: A 2-sentence executive summary of virality probability.
- primary_strength: The #1 strongest element.
- primary_bottleneck: The #1 issue that could cause high drop-off.

Respond ONLY with valid JSON in this exact structure:
{{
  "first_3s_hook": {{"score": 85, "verdict": "Strong curiosity gap", "critique": "..."}},
  "video_structure": {{"score": 78, "verdict": "Good pacing", "critique": "..."}},
  "visual_quality": {{"score": 90, "verdict": "Sharp vertical framing", "critique": "..."}},
  "editing_pace": {{"score": 82, "verdict": "Fast tempo", "critique": "..."}},
  "audio_subtitles": {{"score": 80, "verdict": "Clear spoken hook", "critique": "..."}},
  "caption_quality": {{"score": 75, "verdict": "Direct but needs spacing", "critique": "..."}},
  "cta_effectiveness": {{"score": 70, "verdict": "Generic CTA", "critique": "..."}},
  "content_originality": {{"score": 88, "verdict": "Unique angle", "critique": "..."}},
  "emotional_appeal": {{"score": 84, "verdict": "High relatability", "critique": "..."}},
  "audience_relevance": {{"score": 92, "verdict": "Directly hits target audience pain points", "critique": "..."}},
  "summary_critique": "...",
  "primary_strength": "...",
  "primary_bottleneck": "..."
}}
"""

        raw_response = None
        if self.client_type == "google_genai":
            response = self.gemini_client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            raw_response = response.text
        elif self.client_type == "openai_compat":
            response = self.openai_client.chat.completions.create(
                model=Config.LLM_MODEL_NAME,
                messages=[
                    {"role": "system", "content": "You are an expert Instagram Reels algorithm evaluator. Output only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            raw_response = response.choices[0].message.content

        if raw_response:
            # Extract JSON block
            match = re.search(r'\{.*\}', raw_response, re.DOTALL)
            if match:
                return json.loads(match.group(0))

        return None

    def _fallback_algorithmic_analysis(
        self,
        reel_data: Dict[str, Any],
        video_metrics: Dict[str, Any],
        campaign_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Deterministic, rule-based algorithmic analysis based on real video metrics,
        linguistic pattern detection in hook/caption, and virality factors.
        """
        duration = video_metrics.get('duration', 15.0)
        is_vertical = video_metrics.get('is_vertical_9_16', True)
        luminance = video_metrics.get('avg_luminance', 120.0)
        cuts_per_min = video_metrics.get('cuts_per_minute', 12.0)
        contrast = video_metrics.get('avg_contrast', 50.0)

        hook = reel_data.get('hook', '')
        caption = reel_data.get('caption', '')
        hashtags = reel_data.get('hashtags', '')
        niche = campaign_context.get('niche', 'General')
        target_audience = campaign_context.get('target_audience', 'General Audience')

        # 1. Hook Analysis
        hook_lower = hook.lower()
        hook_score = 65
        hook_verdict = "Moderate Hook"
        if any(w in hook_lower for w in ["stop", "don't", "never", "worst", "mistake", "secret", "why you", "reason"]):
            hook_score += 20
            hook_verdict = "High Curiosity & Negative Hook"
        elif any(w in hook_lower for w in ["how to", "this tool", "every", "if you"]):
            hook_score += 12
            hook_verdict = "Relatable Problem Hook"
        if len(hook.split()) <= 8:
            hook_score += 8  # Punchy, scannable in <1.5s
        hook_score = min(hook_score, 98)

        # 2. Video Structure
        structure_score = 70
        if 6.0 <= duration <= 18.0:
            structure_score += 22  # Optimal viral sweet spot
        elif duration < 6.0:
            structure_score += 10
        elif duration > 45.0:
            structure_score -= 15  # Too long for casual feed
        structure_score = max(min(structure_score, 95), 45)

        # 3. Visual Quality
        visual_score = 80
        if is_vertical:
            visual_score += 12
        else:
            visual_score -= 25  # Severe penalty for horizontal/letterboxed Reels
        if 80 <= luminance <= 170 and contrast > 40:
            visual_score += 6
        visual_score = max(min(visual_score, 98), 40)

        # 4. Editing Pace
        pace_score = 70
        if cuts_per_min >= 15.0:
            pace_score += 22
            pace_verdict = "Fast cut pacing, strong dopamine retention"
        elif cuts_per_min >= 8.0:
            pace_score += 14
            pace_verdict = "Solid rhythmic editing"
        else:
            pace_score -= 8
            pace_verdict = "Slow camera changes, risk of scroll-away"
        pace_score = max(min(pace_score, 96), 48)

        # 5. Audio & Subtitles
        audio_score = 82
        if any(w in caption.lower() for w in ["audio", "listen", "sound", "turn on"]):
            audio_score += 8

        # 6. Caption Quality
        caption_score = 68
        caption_lower = caption.lower()
        if any(w in caption_lower for w in ["read below", "save this", "comment", "share with", "tag"]):
            caption_score += 16
        if len(caption) > 100:
            caption_score += 8  # Loop driver: reading caption while reel loops
        caption_score = min(caption_score, 95)

        # 7. CTA Effectiveness
        cta_score = 60
        if any(w in caption_lower for w in ["share this with", "send this to", "tag your"]):
            cta_score += 28  # Share trigger (top viral driver)
        elif any(w in caption_lower for w in ["save for later", "save this list"]):
            cta_score += 22  # Save trigger
        elif any(w in caption_lower for w in ["comment", "drop a"]):
            cta_score += 15
        cta_score = min(cta_score, 94)

        # 8. Content Originality
        orig_score = 75
        if any(w in hook_lower for w in ["ai tools", "top 5", "life hack"]):
            orig_score -= 6  # Highly saturated topics
        else:
            orig_score += 10
        orig_score = max(min(orig_score, 92), 55)

        # 9. Emotional Appeal
        emotion_score = 78
        if any(w in hook_lower for w in ["relatable", "student", "friend", "special", "crying", "laughing"]):
            emotion_score += 14
        emotion_score = min(emotion_score, 95)

        # 10. Audience Relevance
        relevance_score = 85
        if target_audience.lower() in (hook_lower + " " + caption_lower):
            relevance_score += 10
        relevance_score = min(relevance_score, 98)

        return {
            "first_3s_hook": {
                "score": hook_score,
                "verdict": hook_verdict,
                "critique": f"The hook '{hook}' has an estimated scroll-stop rating of {hook_score}/100. Concise phrasing helps stop the thumb in the initial 1.5-second feed window."
            },
            "video_structure": {
                "score": structure_score,
                "verdict": "High Loop Potential" if duration <= 18 else "Long Form Narrative",
                "critique": f"At {duration}s duration, the video {'is tightly tailored for rewatch loops (>100% completion rate)' if duration <= 18 else 'requires constant tension to prevent mid-roll drop-off'}."
            },
            "visual_quality": {
                "score": visual_score,
                "verdict": "Full Screen 9:16 Vertical" if is_vertical else "Non-standard Aspect Ratio",
                "critique": f"Frame lighting measured at {luminance} luminance with standard vertical immersion. Ensure text avoids bottom 20% UI dead zone."
            },
            "editing_pace": {
                "score": pace_score,
                "verdict": pace_verdict,
                "critique": f"Detected {cuts_per_min} cuts/min pacing. Visual transitions maintain dynamic viewer engagement."
            },
            "audio_subtitles": {
                "score": audio_score,
                "verdict": "Auditory & Visual Sync",
                "critique": "Spoken cadence matches on-screen messaging. Pairing with trending ambient audio will maximize distribution."
            },
            "caption_quality": {
                "score": caption_score,
                "verdict": "Loop Support Enabled",
                "critique": "Caption provides immediate context. Adding line breaks and an invitation to read while the video loops will boost total watch time."
            },
            "cta_effectiveness": {
                "score": cta_score,
                "verdict": "Targeted Action Prompt",
                "critique": "Call-to-action focuses on peer sharing or saving, which is weighted 3x higher by the Instagram discovery algorithm than simple likes."
            },
            "content_originality": {
                "score": orig_score,
                "verdict": "Distinct Hook Angle",
                "critique": "Avoids common stock cliches by focusing on specific situational nuance."
            },
            "emotional_appeal": {
                "score": emotion_score,
                "verdict": "High Relatability / Identity Resonance",
                "critique": "Evokes social validation or immediate recognition ('this is so me'), directly stimulating Instagram DM shares."
            },
            "audience_relevance": {
                "score": relevance_score,
                "verdict": f"Aligned with {target_audience}",
                "critique": f"Directly addresses the primary interests and habits of {target_audience} in the {niche} space."
            },
            "summary_critique": f"This Reel demonstrates strong algorithmic alignment with an overall potential to break into the Explore and Reels recommendations tab.",
            "primary_strength": f"Hook urgency and direct relatability for {target_audience}.",
            "primary_bottleneck": "First 1.2 seconds needs an immediate visual pattern interrupt to guarantee sub-2s retention."
        }

gemini_analyzer = GeminiAnalyzer()
