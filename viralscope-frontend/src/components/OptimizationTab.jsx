import React, { useState } from 'react';
import { Sparkles, Copy, Check, Scissors, Hash, Lightbulb } from 'lucide-react';

export default function OptimizationTab({ reels }) {
  const [selectedReelId, setSelectedReelId] = useState(reels[0]?.id || '');
  const [copiedKey, setCopiedKey] = useState(null);

  const selectedReel = reels.find(r => r.id === selectedReelId) || reels[0] || {};
  const opt = selectedReel.optimizations || {};
  const hooks = opt.improved_hooks || [];
  const tags = opt.hashtag_strategy || {};

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Reel Optimization</span>
          </h2>
          <p className="text-xs text-slate-500">
            Suggested hook rewrites, pacing adjustments, and high-conversion captions.
          </p>
        </div>

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

      {/* 3 Improved Hooks */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>3 Hook Rewrites to Test</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {hooks.map((h, i) => (
            <div key={i} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                  {h.type}
                </span>
                <p className="text-xs font-bold text-slate-900">
                  "{h.hook_text}"
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  {h.rationale}
                </p>
              </div>

              <button
                onClick={() => handleCopy(h.hook_text, `hook_${i}`)}
                className="w-full py-1.5 rounded-lg bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors border border-slate-200 shadow-xs"
              >
                {copiedKey === `hook_${i}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === `hook_${i}` ? 'Copied' : 'Copy Hook'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Optimized Caption & Hashtags */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Caption */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Suggested Caption</h3>
              <p className="text-xs text-slate-500">Structured for reading while video loops</p>
            </div>
            <button
              onClick={() => handleCopy(opt.optimized_caption || '', 'caption')}
              className="px-2.5 py-1 rounded bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 border border-slate-200 shadow-xs"
            >
              {copiedKey === 'caption' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'caption' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-line">
            {opt.optimized_caption || 'No caption available.'}
          </div>
        </div>

        {/* Hashtags & Pacing */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Hash className="w-4 h-4 text-indigo-600" />
              <span>Hashtags by Tier</span>
            </h3>
            <div className="space-y-2 text-xs mt-3">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Broad</span>
                <div className="flex flex-wrap gap-1 text-indigo-700 font-medium">
                  {tags.broad?.map((t, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-white border border-slate-200">{t}</span>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Niche</span>
                <div className="flex flex-wrap gap-1 text-emerald-700 font-medium">
                  {tags.niche?.map((t, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-white border border-slate-200">{t}</span>
                  ))}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Community</span>
                <div className="flex flex-wrap gap-1 text-slate-700 font-medium">
                  {tags.community?.map((t, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-white border border-slate-200">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <Scissors className="w-3.5 h-3.5 text-emerald-600" />
              <span>Editing Target</span>
            </h4>
            <div className="text-xs text-slate-600">
              Suggested Target Duration: <strong className="text-slate-900">{opt.suggested_duration_seconds || 11}s</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
