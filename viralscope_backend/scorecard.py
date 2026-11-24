from typing import Dict, Any, List, Optional

DEFAULT_CRITERIA_WEIGHTS = {
    "hook_strength": 20,
    "retention_potential": 15,
    "shareability": 15,
    "emotional_appeal": 10,
    "originality": 10,
    "caption_quality": 10,
    "audience_relevance": 10,
    "cta_effectiveness": 5,
    "visual_storytelling": 5
}

class ViralityScorecard:
    """
    Transparent, configurable 100-Point Virality Scorecard engine.
    Calculates weighted virality score, categorizes viral tiers, and
    provides explanatory rationale for every metric.
    """

    @staticmethod
    def calculate_score(
        ai_analysis: Dict[str, Any],
        simulation_data: Dict[str, Any],
        video_metrics: Dict[str, Any],
        custom_weights: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        weights = custom_weights if custom_weights else DEFAULT_CRITERIA_WEIGHTS

        # Normalize weights so they sum to 100
        total_weight = sum(weights.values()) or 100.0
        normalized_weights = {k: (v / total_weight) * 100.0 for k, v in weights.items()}

        # Extract base 0-100 metrics
        hook_val = float(ai_analysis.get('first_3s_hook', {}).get('score', 75))
        retention_val = float(simulation_data.get('aggregate_retention_rate', 75))
        share_val = float(simulation_data.get('simulated_shares_rate', 35)) * 1.5 + float(ai_analysis.get('cta_effectiveness', {}).get('score', 70)) * 0.4
        share_val = min(max(share_val, 30.0), 98.0)

        emotion_val = float(ai_analysis.get('emotional_appeal', {}).get('score', 75))
        orig_val = float(ai_analysis.get('content_originality', {}).get('score', 75))
        caption_val = float(ai_analysis.get('caption_quality', {}).get('score', 70))
        audience_val = float(ai_analysis.get('audience_relevance', {}).get('score', 80))
        cta_val = float(ai_analysis.get('cta_effectiveness', {}).get('score', 65))
        visual_val = float(ai_analysis.get('visual_quality', {}).get('score', 80)) * 0.6 + float(ai_analysis.get('video_structure', {}).get('score', 75)) * 0.4

        metric_values = {
            "hook_strength": hook_val,
            "retention_potential": retention_val,
            "shareability": share_val,
            "emotional_appeal": emotion_val,
            "originality": orig_val,
            "caption_quality": caption_val,
            "audience_relevance": audience_val,
            "cta_effectiveness": cta_val,
            "visual_storytelling": visual_val
        }

        # Calculate weighted contributions
        breakdown = {}
        total_weighted_score = 0.0

        for criterion, raw_val in metric_values.items():
            max_pts = normalized_weights.get(criterion, 10.0)
            awarded_pts = round((raw_val / 100.0) * max_pts, 2)
            total_weighted_score += awarded_pts

            breakdown[criterion] = {
                "metric_name": criterion.replace('_', ' ').title(),
                "raw_score_100": round(raw_val, 1),
                "max_points": round(max_pts, 1),
                "awarded_points": awarded_pts,
                "percentage": round(raw_val, 1),
                "explanation": ViralityScorecard._get_explanation(criterion, raw_val)
            }

        final_score = round(total_weighted_score, 1)

        # Classify virality tier
        if final_score >= 85.0:
            viral_tier = "Viral Breakout Candidate (100k – 1M+ Views)"
            tier_class = "viral-breakout"
            reach_prediction = "100,000 to 1,000,000+ views"
            recommendation = "Exceptional virality probability. Publish during peak audience hours and actively pin top comments."
        elif final_score >= 75.0:
            viral_tier = "High Niche Reach (50k – 100k Views)"
            tier_class = "high-niche"
            reach_prediction = "50,000 to 100,000 views"
            recommendation = "Strong niche candidate. Minor hook and pacing adjustments could push it into mass Explore reach."
        elif final_score >= 60.0:
            viral_tier = "Moderate Reach (15k – 50k Views)"
            tier_class = "moderate-reach"
            reach_prediction = "15,000 to 50,000 views"
            recommendation = "Average organic engagement. Needs a stronger opening curiosity gap and DM share trigger."
        else:
            viral_tier = "Low Discovery (<15k Views)"
            tier_class = "low-reach"
            reach_prediction = "Under 15,000 views (stuck in initial seed pool)"
            recommendation = "High drop-off risk in the first 2 seconds. Rework the opening hook and tighten video duration."

        return {
            "total_score": final_score,
            "max_possible": 100.0,
            "viral_tier": viral_tier,
            "tier_class": tier_class,
            "reach_prediction": reach_prediction,
            "recommendation": recommendation,
            "weights_used": normalized_weights,
            "breakdown": breakdown
        }

    @staticmethod
    def _get_explanation(criterion: str, val: float) -> str:
        explanations = {
            "hook_strength": f"Score {round(val, 1)}%: Evaluates first 1.5s scroll-stopping power, negative/curiosity phrasing, and visual contrast.",
            "retention_potential": f"Score {round(val, 1)}%: Evaluates predicted viewer watch duration and seamless looping probability.",
            "shareability": f"Score {round(val, 1)}%: Evaluates psychological triggers for sending via Instagram DM (the #1 viral ranking factor).",
            "emotional_appeal": f"Score {round(val, 1)}%: Evaluates intensity of emotional resonance (relatability, humor, inspiration, validation).",
            "originality": f"Score {round(val, 1)}%: Assesses freshness of angle vs oversaturated tropes in the niche.",
            "caption_quality": f"Score {round(val, 1)}%: Evaluates caption hook, scannable formatting, and synergy with video rewatch loops.",
            "audience_relevance": f"Score {round(val, 1)}%: Measures precision of fit with specified audience persona pain points.",
            "cta_effectiveness": f"Score {round(val, 1)}%: Assesses whether the prompt provokes high-value algorithm actions (DM shares/saves).",
            "visual_storytelling": f"Score {round(val, 1)}%: Evaluates 9:16 vertical immersion, lighting contrast, and scene progression."
        }
        return explanations.get(criterion, f"Performance score: {round(val, 1)}%")

virality_scorecard = ViralityScorecard()
