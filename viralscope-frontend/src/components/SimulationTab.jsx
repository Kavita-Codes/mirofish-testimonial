import React, { useState } from 'react';
import { 
  Users, MessageSquare, TrendingDown
} from 'lucide-react';

export default function SimulationTab({ reels }) {
  const [selectedReelId, setSelectedReelId] = useState(reels[0]?.id || '');
  const selectedReel = reels.find(r => r.id === selectedReelId) || reels[0] || {};
  const simulation = selectedReel.simulation || {};
  const personaReactions = simulation.persona_reactions || [];
  const retentionCurve = simulation.retention_curve || [];
  const groupDiscussion = simulation.group_discussion || [];

  const getActionBadge = (action) => {
    switch (action) {
      case 'SHARE_DM':
        return { label: 'Shared to DM', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'SAVE':
        return { label: 'Saved Collection', bg: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'WATCH_LOOP':
        return { label: 'Watched & Looped', bg: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'COMMENT':
        return { label: 'Commented', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'SKIP_EARLY':
        return { label: 'Early Drop-off', bg: 'bg-rose-50 text-rose-700 border-rose-200' };
      default:
        return { label: 'Liked', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Simulated results powered by MiroFish Swarm Intelligence</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Audience Behavioral Simulation (7 Personas)
            </h2>
            <p className="text-xs text-slate-500">
              Evaluates individual persona drop-off points, sharing decisions, and reactions.
            </p>
          </div>

          {/* Reel Selector */}
          <div className="flex items-center gap-2.5">
            <label className="text-xs font-semibold text-slate-500">Reel:</label>
            <select
              value={selectedReelId}
              onChange={(e) => setSelectedReelId(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              {reels.map((r, i) => (
                <option key={r.id} value={r.id}>
                  #{i + 1} {r.topic} ({r.scorecard?.total_score || 0} pts)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Aggregate Simulation Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-slate-500">Avg Retention</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {simulation.aggregate_retention_rate || 0}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Watched before drop-off</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-emerald-600">DM Share Rate</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {simulation.simulated_shares_rate || 0}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Direct message send probability</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-blue-600">Save Rate</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">
            {simulation.simulated_saves_rate || 0}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Saved for reference</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-purple-600">Loop Rate</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">
            {simulation.simulated_loop_rate || 0}%
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Rewatched full video</div>
        </div>
      </div>

      {/* Retention Curve */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
          <TrendingDown className="w-4 h-4 text-indigo-600" />
          <span>Audience Retention Curve Across Time</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Drop-off percentage by second into the Reel.
        </p>

        <div className="space-y-2.5">
          {retentionCurve.map((point, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">
                  {point.second === 0 ? '0s (Hook Start)' : `${point.second}s`}
                </span>
                <span className="font-bold text-slate-900">
                  {point.retention_percentage}% retained
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded overflow-hidden">
                <div 
                  className={`h-full rounded ${
                    point.retention_percentage >= 80 ? 'bg-emerald-500' :
                    point.retention_percentage >= 60 ? 'bg-indigo-600' :
                    'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(point.retention_percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 Individual Persona Reaction Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-600" />
          <span>Reactions by Persona</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {personaReactions.map((persona) => {
            const badge = getActionBadge(persona.action);
            return (
              <div 
                key={persona.persona_id}
                className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={persona.avatar} 
                      alt={persona.persona_name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{persona.persona_name}</h4>
                      <p className="text-[11px] text-slate-500">{persona.role}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.bg}`}>
                    {badge.label}
                  </span>
                </div>

                {/* Simulated Comment Box */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  "{persona.simulated_comment}"
                </div>

                {/* Watch Duration & Resonance */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <span>Watched: <strong className="text-slate-800">{persona.drop_off_second}s</strong> ({persona.watch_percentage}%)</span>
                  <span>Resonance: <strong className="text-indigo-600">{persona.resonance_score}/100</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Group Discussion */}
      {groupDiscussion.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Simulated Group Discussion</span>
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Simulated discussion between personas evaluating hook strength and friction.
          </p>

          <div className="space-y-2.5">
            {groupDiscussion.map((msg, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <img 
                  src={msg.avatar} 
                  alt={msg.persona_name} 
                  className="w-7 h-7 rounded-full object-cover border border-slate-200 flex-shrink-0"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">{msg.persona_name} <span className="text-[10px] font-normal text-slate-500">({msg.role})</span></div>
                  <p className="text-xs text-slate-700 mt-1">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
