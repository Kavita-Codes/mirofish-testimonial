import React from 'react';
import { 
  Plus, Sparkles, Video, Users, Award, Eye, 
  Trash2, Layers
} from 'lucide-react';

export default function Dashboard({ 
  stats, 
  campaigns, 
  onSelectCampaign, 
  onOpenNewCampaign, 
  onSeedCampaign, 
  onDeleteCampaign,
  isSeeding 
}) {
  const highestReel = stats?.highest_scoring_reel;

  return (
    <div className="space-y-8 pb-12">
      {/* Clean Minimal Header in Light Theme */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
              <span>Pre-Publish Virality Testing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Instagram Reel Virality Analyzer
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Upload up to 10 draft Reels before posting publicly. Analyze hook drop-off, test editing cuts, simulate reactions across 7 audience personas, and rank your content for maximum reach.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewCampaign}
              className="px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Campaign</span>
            </button>

            <button
              onClick={onSeedCampaign}
              disabled={isSeeding}
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-medium text-xs flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isSeeding ? 'Loading...' : 'Load Sample 10-Reels'}</span>
            </button>
          </div>
        </div>

        {/* 3-Step Simple Guide for New Users */}
        <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-6 h-6 rounded-full bg-white text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-200 shadow-xs">
              1
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Upload 10 Draft Reels</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Add video clips, opening hooks, and captions</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-6 h-6 rounded-full bg-white text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-200 shadow-xs">
              2
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">AI & Swarm Simulation</div>
              <div className="text-[11px] text-slate-500 mt-0.5">OpenCV frame check + 7 MiroFish personas</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="w-6 h-6 rounded-full bg-white text-slate-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-slate-200 shadow-xs">
              3
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Rank & Publish Winner</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Pick the highest-scoring candidate for release</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Campaigns</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats?.total_campaigns || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Active test sets</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Reels Analysed</span>
            <Video className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats?.total_reels_analysed || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Videos processed with CV</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Swarm Simulations</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats?.completed_simulations || 0}</div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">7 MiroFish personas run</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Top Reel Score</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          {highestReel ? (
            <div>
              <div className="text-2xl font-bold text-emerald-600">{highestReel.score} / 100</div>
              <div className="text-xs text-slate-600 truncate mt-1 font-medium">{highestReel.topic}</div>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold text-slate-400">-</div>
              <div className="text-xs text-slate-400 mt-1">Awaiting analysis</div>
            </div>
          )}
        </div>
      </div>

      {/* Campaigns Directory */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Campaigns</h2>
            <p className="text-xs text-slate-500">Select a campaign to inspect scores, audience feedback, and rankings</p>
          </div>
          <button
            onClick={onOpenNewCampaign}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
          >
            <span>+ New Campaign</span>
          </button>
        </div>

        {campaigns && campaigns.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                onClick={() => onSelectCampaign(camp.id)}
                className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                      {camp.name}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      camp.status === 'completed' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {camp.status === 'completed' ? 'Analysed' : 'Draft'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>Niche: <span className="text-slate-700 font-medium">{camp.niche}</span></span>
                    <span>•</span>
                    <span>Audience: <span className="text-slate-700 font-medium">{camp.target_audience}</span></span>
                    <span>•</span>
                    <span>{camp.reels_count || 0} of 10 Reels</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  {camp.average_virality_score > 0 && (
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">{camp.average_virality_score} / 100</div>
                      <div className="text-[10px] text-slate-500">Average Score</div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCampaign(camp.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Open</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCampaign(camp.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">No campaigns found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Create your first campaign or load the pre-built 10-Reel test suite to see the analysis in action.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={onSeedCampaign}
                disabled={isSeeding}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 mx-auto transition-colors shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isSeeding ? 'Loading...' : 'Load Sample 10-Reels'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
