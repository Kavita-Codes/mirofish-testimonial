import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Play, Trophy, Sliders, Users, 
  Sparkles, FileText, Video, Layers
} from 'lucide-react';
import ReelCard from './ReelCard';
import ScorecardTab from './ScorecardTab';
import SimulationTab from './SimulationTab';
import RankingsTab from './RankingsTab';
import OptimizationTab from './OptimizationTab';
import AddReelModal from './AddReelModal';
import ComparisonModal from './ComparisonModal';
import ReportModal from './ReportModal';

export default function CampaignDetail({ 
  campaign, 
  onBack, 
  onAnalyze, 
  onRecalculateWeights, 
  onRefreshCampaign,
  isAnalyzing 
}) {
  const [activeTab, setActiveTab] = useState('reels');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [compareIds, setCompareIds] = useState([]);

  const reels = campaign.reels || [];
  const reelsCount = reels.length;

  const handleOpenComparison = (ids) => {
    setCompareIds(ids);
    setShowCompareModal(true);
  };

  const handleToggleCompare = (id) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return [prev[1], prev[2], id];
      return [...prev, id];
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {campaign.name}
              </h1>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                campaign.status === 'completed'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {campaign.status === 'completed' ? 'Analysed' : 'Draft'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span>Niche: <strong className="text-slate-700 font-medium">{campaign.niche}</strong></span>
              <span>•</span>
              <span>Target: <strong className="text-slate-700 font-medium">{campaign.target_audience}</strong></span>
              <span>•</span>
              <span>Reels: <strong className="text-slate-700 font-medium">{reelsCount} of 10</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {reelsCount < 10 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>Add Reel ({reelsCount}/10)</span>
              </button>
            )}

            <button
              onClick={onAnalyze}
              disabled={isAnalyzing || reelsCount === 0}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Play className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Run Analysis'}</span>
            </button>

            <button
              onClick={() => setShowReportModal(true)}
              disabled={reelsCount === 0}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-px overflow-x-auto">
        {[
          { id: 'reels', label: `10 Reels (${reelsCount})`, icon: Video },
          { id: 'rankings', label: 'Rankings & Compare', icon: Trophy },
          { id: 'simulation', label: 'Audience Simulation (7 Personas)', icon: Users },
          { id: 'scorecard', label: '100-Point Scorecard', icon: Sliders },
          { id: 'optimizations', label: 'AI Optimizations', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold whitespace-nowrap rounded-t-lg transition-colors border-b-2 ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 bg-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Compare selected trigger pill */}
      {compareIds.length >= 2 && activeTab !== 'rankings' && (
        <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-between">
          <span className="text-xs text-indigo-800 font-medium">
            {compareIds.length} Reels selected for comparison.
          </span>
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
          >
            Open Side-by-Side Comparison
          </button>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'reels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Reels & Video Analysis</h2>
              <p className="text-xs text-slate-500">
                Keyframe sampling at 0.5s, 1.5s, 2.5s hook windows, cuts per minute, and lighting.
              </p>
            </div>
            {reelsCount < 10 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Reel ({reelsCount}/10)</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {reels.map((reel, idx) => (
              <ReelCard
                key={reel.id}
                reel={reel}
                rank={idx + 1}
                onSelectForCompare={handleToggleCompare}
                isSelectedForCompare={compareIds.includes(reel.id)}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'rankings' && (
        <RankingsTab 
          reels={reels} 
          onOpenComparison={handleOpenComparison} 
        />
      )}

      {activeTab === 'simulation' && (
        <SimulationTab 
          reels={reels} 
        />
      )}

      {activeTab === 'scorecard' && (
        <ScorecardTab
          campaign={campaign}
          reels={reels}
          onRecalculateWeights={onRecalculateWeights}
        />
      )}

      {activeTab === 'optimizations' && (
        <OptimizationTab 
          reels={reels} 
        />
      )}

      {/* Modals */}
      {showAddModal && (
        <AddReelModal
          campaignId={campaign.id}
          currentReelsCount={reelsCount}
          onReelAdded={() => onRefreshCampaign()}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showCompareModal && (
        <ComparisonModal
          reels={reels}
          selectedIds={compareIds}
          onClose={() => setShowCompareModal(false)}
        />
      )}

      {showReportModal && (
        <ReportModal
          campaign={campaign}
          reels={reels}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
