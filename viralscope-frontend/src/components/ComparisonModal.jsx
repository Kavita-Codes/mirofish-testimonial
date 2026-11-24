import React from 'react';
import { X } from 'lucide-react';

export default function ComparisonModal({ reels, selectedIds, onClose }) {
  const compareReels = reels.filter(r => selectedIds.includes(r.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Side-by-Side Comparison ({compareReels.length} Reels)
            </h2>
            <p className="text-xs text-slate-500">Compare hook clarity, virality scores, and audience retention</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Side by side columns */}
        <div className="p-5 overflow-y-auto">
          <div className={`grid grid-cols-1 md:grid-cols-${compareReels.length} gap-4`}>
            {compareReels.map((reel) => {
              const sc = reel.scorecard || {};
              const sim = reel.simulation || {};
              const metrics = reel.video_metrics || {};
              const ai = reel.ai_analysis || {};

              return (
                <div key={reel.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{reel.topic}</h3>
                    <div className="px-2 py-0.5 rounded bg-white text-indigo-700 border border-slate-200 text-xs font-bold shadow-xs">
                      {sc.total_score || 0} / 100
                    </div>
                  </div>

                  {/* Hook */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Opening Hook</span>
                    <p className="text-xs font-semibold text-slate-900">
                      "{reel.hook}"
                    </p>
                  </div>

                  {/* Metrics */}
                  <div className="p-3 rounded-lg bg-white border border-slate-200 text-xs space-y-1 shadow-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Predicted Reach:</span>
                      <strong className="text-slate-900">{sc.reach_prediction || '50k - 100k'}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Retention Rate:</span>
                      <strong className="text-emerald-700">{sim.aggregate_retention_rate || 0}%</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>DM Share Rate:</span>
                      <strong className="text-emerald-700">{sim.simulated_shares_rate || 0}%</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Cuts per Minute:</span>
                      <span className="text-slate-700">{metrics.cuts_per_minute || 0}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Duration:</span>
                      <span className="text-slate-700">{metrics.duration || 0}s</span>
                    </div>
                  </div>

                  {/* Strength */}
                  <div className="text-xs text-slate-700 bg-emerald-50 p-2.5 rounded border border-emerald-100">
                    <strong className="block text-[10px] uppercase font-bold text-emerald-800 mb-0.5">Primary Strength:</strong>
                    {ai.primary_strength || 'Strong hook.'}
                  </div>

                  {/* Risk */}
                  <div className="text-xs text-slate-700 bg-amber-50 p-2.5 rounded border border-amber-100">
                    <strong className="block text-[10px] uppercase font-bold text-amber-800 mb-0.5">Drop-off Risk:</strong>
                    {ai.primary_bottleneck || 'Trim first 1.5s.'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
