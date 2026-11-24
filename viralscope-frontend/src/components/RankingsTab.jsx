import React, { useState } from 'react';
import { Trophy, Layers } from 'lucide-react';

export default function RankingsTab({ reels, onOpenComparison }) {
  const rankedReels = [...reels].sort((a, b) => 
    (b.scorecard?.total_score || 0) - (a.scorecard?.total_score || 0)
  );

  const top3 = rankedReels.slice(0, 3);
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  const toggleCompare = (id) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], id];
      }
      return [...prev, id];
    });
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Podium Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Top 3 Recommended Reels</span>
            </h2>
            <p className="text-xs text-slate-500">Highest algorithmic probability of crossing 100k to 1M+ views</p>
          </div>

          {selectedForCompare.length >= 2 && (
            <button
              onClick={() => onOpenComparison(selectedForCompare)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Layers className="w-4 h-4" />
              <span>Compare Selected ({selectedForCompare.length})</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((reel, idx) => {
            const sc = reel.scorecard || {};
            const score = sc.total_score || 0;
            const rank = idx + 1;

            return (
              <div 
                key={reel.id}
                className="rounded-xl p-5 bg-white border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                    rank === 1 ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    rank === 2 ? 'bg-slate-100 text-slate-800 border-slate-200' :
                    'bg-orange-50 text-orange-800 border-orange-200'
                  }`}>
                    Rank #{rank}
                  </span>
                  <div className="text-xl font-bold text-slate-900">
                    {score} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-0.5">{reel.topic}</h3>
                  <p className="text-xs text-slate-600 italic">"{reel.hook}"</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Predicted Reach:</span>
                    <strong className="text-slate-900">{sc.reach_prediction || '50k - 100k'}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Audience Retention:</span>
                    <strong className="text-slate-900">{reel.simulation?.aggregate_retention_rate || 0}%</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>DM Share Rate:</span>
                    <strong className="text-emerald-700">{reel.simulation?.simulated_shares_rate || 0}%</strong>
                  </div>
                </div>

                <div className="text-xs text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  <strong className="block text-[10px] uppercase font-bold text-emerald-800 mb-0.5">Strength:</strong>
                  {reel.ai_analysis?.primary_strength || 'Strong hook and audience relevance.'}
                </div>

                <button
                  onClick={() => toggleCompare(reel.id)}
                  className={`w-full py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    selectedForCompare.includes(reel.id)
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  {selectedForCompare.includes(reel.id) ? 'Selected ✓' : '+ Compare'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Rankings Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Full Ranking Table</h3>
            <p className="text-xs text-slate-500">Ordered by total 100-point virality score</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-6">Topic & Hook</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-center">Retention</th>
                <th className="py-3 px-4 text-center">DM Shares</th>
                <th className="py-3 px-4">Virality Tier</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankedReels.map((reel, idx) => {
                const rank = idx + 1;
                const sc = reel.scorecard || {};
                const score = sc.total_score || 0;
                const isSelected = selectedForCompare.includes(reel.id);

                return (
                  <tr key={reel.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-xs text-slate-900">
                      #{rank}
                    </td>
                    <td className="py-3 px-6">
                      <div className="font-bold text-slate-900 text-xs">{reel.topic}</div>
                      <div className="text-slate-500 text-xs italic truncate max-w-sm">"{reel.hook}"</div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-sm text-slate-900">
                      {score}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-700">
                      {reel.simulation?.aggregate_retention_rate || 0}%
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-emerald-700">
                      {reel.simulation?.simulated_shares_rate || 0}%
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        score >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        score >= 75 ? 'bg-amber-50 text-amber-800 border-amber-200' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {sc.viral_tier || 'Candidate'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleCompare(reel.id)}
                        className={`px-2.5 py-1 rounded text-xs font-semibold border transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                        }`}
                      >
                        {isSelected ? 'Selected ✓' : '+ Compare'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
