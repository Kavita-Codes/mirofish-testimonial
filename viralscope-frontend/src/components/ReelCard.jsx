import React, { useState } from 'react';
import { 
  Flame, Clock, Scissors, Sparkles, AlertTriangle, 
  CheckCircle2, ChevronDown, ChevronUp, Copy, Check
} from 'lucide-react';

export default function ReelCard({ reel, rank, onSelectForCompare, isSelectedForCompare }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const scorecard = reel.scorecard || {};
  const totalScore = scorecard.total_score || 0;
  const metrics = reel.video_metrics || {};
  const ai = reel.ai_analysis || {};
  const sim = reel.simulation || {};
  const frames = metrics.extracted_frames || [];

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(reel.caption || '');
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const getScoreBadge = (score) => {
    if (score >= 85) return 'bg-emerald-600 text-white';
    if (score >= 75) return 'bg-amber-600 text-white';
    if (score >= 60) return 'bg-indigo-600 text-white';
    return 'bg-rose-600 text-white';
  };

  return (
    <div className={`bg-white border ${isSelectedForCompare ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200'} rounded-xl overflow-hidden shadow-xs transition-all`}>
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {rank && (
            <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
              #{rank}
            </div>
          )}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>{reel.topic || 'Untitled Reel'}</span>
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{metrics.duration || 0}s duration</span>
              <span>•</span>
              <span>{metrics.cuts_per_minute || 0} cuts/min</span>
              <span>•</span>
              <span className={metrics.is_vertical_9_16 ? 'text-emerald-700 font-medium' : 'text-amber-700 font-medium'}>
                {metrics.is_vertical_9_16 ? '9:16 Vertical' : 'Standard Ratio'}
              </span>
            </div>
          </div>
        </div>

        {/* Virality Score Badge */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {onSelectForCompare && (
            <button
              onClick={() => onSelectForCompare(reel.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                isSelectedForCompare 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
              }`}
            >
              {isSelectedForCompare ? 'Selected ✓' : '+ Compare'}
            </button>
          )}

          <div className="flex items-center gap-2">
            <div className={`px-2.5 py-1 rounded-lg ${getScoreBadge(totalScore)} font-bold text-xs flex items-center gap-1.5 shadow-xs`}>
              <Flame className="w-3.5 h-3.5" />
              <span>{totalScore} / 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Hook Highlight */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Opening Hook (0 – 3s Window)
            </span>
            {ai.first_3s_hook && (
              <span className="text-xs font-bold text-slate-600">
                Score: <strong className="text-indigo-600">{ai.first_3s_hook.score}/100</strong>
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-900">
            "{reel.hook || 'No hook text'}"
          </p>
          {ai.first_3s_hook?.critique && (
            <p className="text-xs text-slate-600 mt-1">
              {ai.first_3s_hook.critique}
            </p>
          )}
        </div>

        {/* Extracted Computer Vision Keyframes */}
        {frames.length > 0 && (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Sampled Keyframes
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {frames.map((f, i) => (
                <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 aspect-[9/16] shadow-xs">
                  <img
                    src={f.relative_url}
                    alt={f.label}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-1.5 text-[9px] text-white font-medium">
                    <span className="truncate">{f.label.replace('_', ' ')}</span>
                    <span className="text-slate-200">{f.timestamp}s</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Predicted Reach</div>
            <div className="text-slate-900 font-bold truncate text-xs mt-0.5">
              {scorecard.reach_prediction || '50k - 100k views'}
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Audience Retention</div>
            <div className="text-slate-900 font-bold text-xs mt-0.5">
              {sim.aggregate_retention_rate || 0}%
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-slate-500 text-[10px] uppercase font-bold">DM Share Rate</div>
            <div className="text-emerald-700 font-bold text-xs mt-0.5">
              {sim.simulated_shares_rate || 0}%
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Lighting Quality</div>
            <div className="text-slate-900 font-bold text-xs mt-0.5 truncate">
              {metrics.lighting_grade || 'Optimal'}
            </div>
          </div>
        </div>

        {/* Expandable 10-Dimension Analysis */}
        {isExpanded && (
          <div className="pt-3 border-t border-slate-100 space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                AI Multimodal Content Analysis
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: 'First 3s Hook', data: ai.first_3s_hook },
                  { label: 'Video Structure', data: ai.video_structure },
                  { label: 'Visual Quality & Framing', data: ai.visual_quality },
                  { label: 'Editing Pace & Cuts', data: ai.editing_pace },
                  { label: 'Audio & Subtitles', data: ai.audio_subtitles },
                  { label: 'Caption Quality', data: ai.caption_quality },
                  { label: 'CTA Effectiveness', data: ai.cta_effectiveness },
                  { label: 'Content Originality', data: ai.content_originality },
                  { label: 'Emotional Appeal', data: ai.emotional_appeal },
                  { label: 'Audience Relevance', data: ai.audience_relevance },
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-bold text-slate-800">{item.label}</span>
                      <span className={`text-xs font-bold ${
                        (item.data?.score || 0) >= 85 ? 'text-emerald-700' :
                        (item.data?.score || 0) >= 70 ? 'text-indigo-600' : 'text-amber-700'
                      }`}>
                        {item.data?.score || 0}/100
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {item.data?.critique || item.data?.verdict || 'Evaluation recorded.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Caption & Hashtags */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Draft Caption</span>
                <button
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
                >
                  {copiedCaption ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCaption ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-800 whitespace-pre-line font-mono bg-white p-2.5 rounded border border-slate-200">
                {reel.caption}
              </p>
              {reel.hashtags && (
                <div className="text-xs text-indigo-600 mt-2 font-medium">
                  {reel.hashtags}
                </div>
              )}
            </div>

            {/* Strengths & Bottlenecks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                <strong className="block text-[10px] uppercase font-bold text-emerald-800 mb-1">
                  Primary Strength
                </strong>
                {ai.primary_strength || 'Strong hook and audience relevance.'}
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900">
                <strong className="block text-[10px] uppercase font-bold text-amber-800 mb-1">
                  Key Drop-Off Risk
                </strong>
                {ai.primary_bottleneck || 'Trim first 1.5s for faster delivery.'}
              </div>
            </div>
          </div>
        )}

        {/* Toggle Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
        >
          <span>{isExpanded ? 'Hide Deep Analysis' : 'Show 10 AI Dimensions & Details'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
