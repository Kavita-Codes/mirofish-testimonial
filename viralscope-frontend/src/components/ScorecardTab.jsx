import React, { useState } from 'react';
import { Sliders, RefreshCw, Info } from 'lucide-react';

export default function ScorecardTab({ campaign, reels, onRecalculateWeights }) {
  const defaultWeights = campaign?.weights || {
    hook_strength: 20,
    retention_potential: 15,
    shareability: 15,
    emotional_appeal: 10,
    originality: 10,
    caption_quality: 10,
    audience_relevance: 10,
    cta_effectiveness: 5,
    visual_storytelling: 5
  };

  const [weights, setWeights] = useState(defaultWeights);
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const totalWeight = Object.values(weights).reduce((a, b) => a + Number(b), 0);

  const handleSliderChange = (key, value) => {
    setWeights(prev => ({
      ...prev,
      [key]: Number(value)
    }));
  };

  const handleApplyWeights = async () => {
    setIsUpdating(true);
    try {
      await onRecalculateWeights(weights);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const resetToDefaults = () => {
    const defaults = {
      hook_strength: 20,
      retention_potential: 15,
      shareability: 15,
      emotional_appeal: 10,
      originality: 10,
      caption_quality: 10,
      audience_relevance: 10,
      cta_effectiveness: 5,
      visual_storytelling: 5
    };
    setWeights(defaults);
  };

  const sampleReel = reels.find(r => r.scorecard) || reels[0] || {};
  const breakdown = sampleReel.scorecard?.breakdown || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>100-Point Scorecard Weights</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust weights to emphasize specific metrics (e.g., shareability vs hook strength).
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={resetToDefaults}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors shadow-xs"
            >
              Reset Defaults
            </button>
            <button
              onClick={handleApplyWeights}
              disabled={isUpdating}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
              <span>{isUpdating ? 'Recalculating...' : saveSuccess ? 'Saved ✓' : 'Apply Weights'}</span>
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'hook_strength', label: 'Hook Strength (0–3s)', desc: 'Initial scroll-stopping impact.' },
            { key: 'retention_potential', label: 'Retention Potential', desc: 'Watch time and rewatch loops.' },
            { key: 'shareability', label: 'Shareability (DMs)', desc: 'Direct message sends (explore rank driver).' },
            { key: 'emotional_appeal', label: 'Emotional Appeal', desc: 'Relatability, humor, or validation.' },
            { key: 'originality', label: 'Originality', desc: 'Distinct perspective vs cliches.' },
            { key: 'caption_quality', label: 'Caption Quality', desc: 'Scannability while video loops.' },
            { key: 'audience_relevance', label: 'Audience Relevance', desc: 'Fit with target demographic.' },
            { key: 'cta_effectiveness', label: 'CTA Effectiveness', desc: 'Prompts shares and saves.' },
            { key: 'visual_storytelling', label: 'Visual Quality & Cuts', desc: '9:16 vertical framing and cuts/sec.' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">{label}</span>
                <span className="font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">
                  {weights[key]} pts
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={weights[key] || 0}
                onChange={(e) => handleSliderChange(key, e.target.value)}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Weights automatically normalize to 100 points. (Current sum: <strong className="text-slate-900">{totalWeight}</strong>)</span>
        </div>
      </div>

      {/* Explanatory Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Evaluation Logic</h3>
          <p className="text-xs text-slate-500">Metric breakdown and rationale used for all Reels</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Metric</th>
                <th className="py-3 px-4 text-center">Weight</th>
                <th className="py-3 px-4">Evaluation Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(breakdown).map(([criterion, data]) => (
                <tr key={criterion} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-6 font-semibold text-slate-900">
                    {data.metric_name}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-indigo-700">
                    {data.max_points} pts
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {data.explanation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
