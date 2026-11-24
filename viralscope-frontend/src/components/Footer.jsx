import React from 'react';
import { BarChart2, ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <BarChart2 className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">ViralScope</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pre-publish Instagram Reel virality analyzer & audience simulation powered by MiroFish Swarm Intelligence and Gemini Vision.
            </p>
            <div className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} ViralScope AI. All rights reserved.
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Platform</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 transition-colors">
                  Campaign Dashboard
                </button>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-indigo-600 transition-colors">
                  Core Features
                </a>
              </li>
              <li>
                <a href="#personas" className="hover:text-indigo-600 transition-colors">
                  7 Swarm Personas
                </a>
              </li>
              <li>
                <a href="#scorecard" className="hover:text-indigo-600 transition-colors">
                  100-Point Scorecard
                </a>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Engine Stack</h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              <li className="flex items-center gap-1">
                <span>MiroFish Multi-Agent Engine</span>
              </li>
              <li>OpenCV Keyframe Sampling</li>
              <li>Gemini 2.5 Multi-Modal Vision</li>
              <li>MongoDB Resilient Storage</li>
              <li>ReportLab PDF Generator</li>
            </ul>
          </div>

          {/* Methodology & Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Methodology</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Simulated results model organic psychological decision-making across calibrated personas to optimize pre-publish retention loops and DM shareability.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Pre-publish (No login needed)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
