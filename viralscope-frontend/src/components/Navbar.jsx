import React from 'react';
import { Sparkles, Plus, BarChart2, ArrowRight } from 'lucide-react';

export default function Navbar({ onOpenNewCampaign, onSeedCampaign, activeView, setActiveView, isSeeding }) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-slate-900 tracking-tight">
              ViralScope
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              AI Predictor
            </span>
          </div>
        </div>

        {/* Action Buttons (Clean & Minimal) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onSeedCampaign}
            disabled={isSeeding}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 transition-colors shadow-xs disabled:opacity-50"
            title="Load sample 10-Reels test campaign"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isSeeding ? 'Loading...' : 'Load Sample Test'}</span>
          </button>

          {activeView === 'landing' ? (
            <button
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition-colors shadow-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={onOpenNewCampaign}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-xs font-semibold text-white transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Campaign</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
