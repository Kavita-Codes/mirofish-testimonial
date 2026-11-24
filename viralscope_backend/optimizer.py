from typing import Dict, Any, List

class AIOptimizer:
    """
    Generates actionable optimization recommendations for Instagram Reels,
    tailored to maximize 100k-1M+ viral distribution.
    """

    @staticmethod
    def generate_optimizations(
        reel_data: Dict[str, Any],
        video_metrics: Dict[str, Any],
        ai_analysis: Dict[str, Any],
        campaign_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        hook = reel_data.get('hook', '')
        caption = reel_data.get('caption', '')
        topic = reel_data.get('topic', '')
        hashtags = reel_data.get('hashtags', '')
        duration = video_metrics.get('duration', 15.0)
        target_audience = campaign_context.get('target_audience', 'General')
        niche = campaign_context.get('niche', 'Social Media')

        # 1. Improved Opening Hooks
        improved_hooks = [
            {
                "type": "Negative / Common Mistake Hook (Highest Virality)",
                "hook_text": f"Stop scrolling if you're a {target_audience} — you're doing this completely wrong.",
                "rationale": "Negative hooks trigger cognitive loss aversion and stop the scroll 2.4x faster than positive advice."
            },
            {
                "type": "Curiosity Gap / Inverted Payoff",
                "hook_text": f"The exact reason why {topic.lower()} is changing everything (and nobody talks about it).",
                "rationale": "Leaves an unanswered question that demands watching until the final 3 seconds."
            },
            {
                "type": "Identity Validation / Peer Share Hook",
                "hook_text": f"If you've ever dealt with this, you need to hear this right now.",
                "rationale": "Triggers immediate self-identification, priming the viewer to send to a friend via DM."
            }
        ]

        # 2. Optimized Caption
        optimized_caption = f"""Stop making this common mistake 👇

Most {target_audience} waste hours because they skip this exact step. Here is what actually works:

1️⃣ The Setup: Focus on the core bottleneck first.
2️⃣ The Execution: Implement the 80/20 rule without overcomplicating.
3️⃣ The Secret: Test this for 48 hours and watch the results.

💬 Save this checklist for later so you have it when you need it!
👉 Send this to someone who needs to see this today.
"""

        # 3. Categorized Hashtags
        tags_list = [t.strip('#') for t in hashtags.replace(',', ' ').split() if t.strip()]
        broad_tags = [f"#{niche.replace(' ', '')}", "#ViralReels", "#InstagramTips", "#ExplorePage"]
        niche_tags = [f"#{topic.replace(' ', '')}", f"#{target_audience.replace(' ', '')}Tips", "#CreatorEconomy", "#StudentHacks"]
        community_tags = ["#DailyGrowth", "#LearnOnInstagram", "#SaveForLater", "#RelatableContent"]

        # 4. Video Duration & Pacing
        target_duration = 7.0 if duration <= 12.0 else (12.0 if duration <= 25.0 else 18.0)
        editing_suggestions = [
            f"Trim current duration from {duration}s down to {target_duration}s to maximize completion rate (>100% loop).",
            "Cut the first 0.8 seconds of dead air before speech starts.",
            "Add high-contrast bold subtitles in the center screen 'safe zone' (300px above bottom UI).",
            "Insert a dynamic visual pattern interrupt (zoom cut or B-roll flash) at second 1.8.",
            "End on an abrupt mid-sentence cut that loops cleanly back into the opening hook sentence."
        ]

        # 5. Call to Action (CTA) Improvements
        cta_improvements = [
            {
                "goal": "DM Shares (Highest Algorithmic Weight)",
                "cta_text": "Tag your study partner / Send this to your work bestie.",
                "placement": "Spoken at 80% mark + on-screen text."
            },
            {
                "goal": "Saves (High Discovery Weight)",
                "cta_text": "Save this reel so you don't lose the framework.",
                "placement": "First line of caption + closing frame."
            },
            {
                "goal": "Comment Debate (Friction / Algorithm Trigger)",
                "cta_text": "Agree or disagree? Drop your hot take below.",
                "placement": "Pinned comment."
            }
        ]

        # 6. Target Audience Recommendations
        audience_recommendations = [
            f"Primary Focus: {target_audience} aged 18–28 active on Instagram between 6 PM – 9 PM local time.",
            "Tone of Voice: Conversational, empathetic, slightly humorous, zero corporate fluff.",
            "Visual Aesthetic: High contrast, warm natural lighting, dynamic handheld or stabilized tracking shot."
        ]

        return {
            "improved_hooks": improved_hooks,
            "optimized_caption": optimized_caption,
            "hashtag_strategy": {
                "broad": broad_tags[:4],
                "niche": niche_tags[:4],
                "community": community_tags[:4]
            },
            "suggested_duration_seconds": target_duration,
            "editing_suggestions": editing_suggestions,
            "cta_improvements": cta_improvements,
            "audience_recommendations": audience_recommendations
        }

ai_optimizer = AIOptimizer()
