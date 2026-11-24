import React, { useState } from 'react';
import { 
  ArrowRight, Sparkles, CheckCircle2, Play, Users, BarChart3, 
  Video, Sliders, ShieldCheck, FileText, ChevronDown, ChevronUp, 
  MessageSquare, Layers, Eye, Scissors, Clock, Award
} from 'lucide-react';

export default function LandingPage({ onOpenDashboard, onSeedCampaign, isSeeding }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const personas = [
    {
      name: "Maya Lin",
      role: "Gen Z Trend Scout (19)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces",
      trigger: "Ironic humor, relatable college moments, trending audio",
      behavior: "Skips monologues in <1.5s; shares relatable clips directly to Instagram group DMs."
    },
    {
      name: "Rohan Patel",
      role: "College Undergrad (21)",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=faces",
      trigger: "Study hacks, free AI productivity tools, exam stress",
      behavior: "Tags friends in comments and shares utility posts to classmates."
    },
    {
      name: "Priya Sharma",
      role: "Growth Marketer (27)",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces",
      trigger: "Actionable frameworks, career productivity, tech workflows",
      behavior: "High save rate; bookmarks checklists to Instagram saved collections."
    },
    {
      name: "Leo Cruz",
      role: "Reel Creator & Editor (25)",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces",
      trigger: "Fast cut rhythm (>14 cuts/min), safe zone text, loop audio",
      behavior: "Critiques lighting and text overlays; comments on technical execution."
    }
  ];

  const faqs = [
    {
      q: "Does ViralScope require my Instagram account password or login?",
      a: "No. ViralScope is a 100% pre-publish testing laboratory. You upload your draft videos and captions directly into ViralScope before publishing publicly to Instagram."
    },
    {
      q: "How does the computer vision video processing work?",
      a: "ViralScope uses OpenCV to extract actual keyframes at 0.5s, 1.5s, and 2.5s (the critical hook window), as well as mid-video and ending CTA frames. It calculates true visual luminance, contrast, 9:16 vertical compliance, and cuts per minute."
    },
    {
      q: "What is the MiroFish Audience Swarm Simulation?",
      a: "MiroFish is a multi-agent prediction engine. It simulates how 7 distinct audience personas (Gen Z, College Students, Young Professionals, Casual Scrollers, Entertainment Lovers, Educational Consumers, and Creators) behave when encountering your Reel. It predicts exact drop-off timestamps, rewatch loops, and direct message shareability."
    },
    {
      q: "Why do you emphasize DM Shares over Likes?",
      a: "The Instagram Reels algorithm in 2026 weights direct message shares 3x higher than likes for Explore distribution. Content that people send to friends ('this is so you' or 'save this tool') receives massive non-follower reach."
    },
    {
      q: "Can I adjust the scorecard weights?",
      a: "Yes. The 100-Point Scorecard allows full weight customization. You can adjust the emphasis on Hook Strength, Shareability, Retention, Emotion, or Originality, and all 10 Reels recalculate live."
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="pt-6 sm:pt-12 text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Powered by MiroFish Swarm Intelligence & Gemini Vision</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Know Which Reel Hits <span className="text-indigo-600">100k+ Views</span> Before You Publish
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Upload up to 10 draft Instagram Reels. Our computer vision engine analyzes your 0–3s hook drop-off, simulates reactions across 7 calibrated audience personas, and predicts your viral winner.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenDashboard}
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm flex items-center gap-2 transition-colors shadow-sm"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onSeedCampaign}
            disabled={isSeeding}
            className="px-6 py-3 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm flex items-center gap-2 transition-colors shadow-xs disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{isSeeding ? 'Loading Sample...' : 'Try 10-Reel Sample Test'}</span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>OpenCV 0–3s Keyframe Inspection</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>7 Persona Swarm Simulation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>100-Point Scorecard</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>PDF Virality Audit Reports</span>
          </div>
        </div>

        {/* Live Interactive Hero Snapshot */}
        <div className="pt-8 text-left">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Predicted #1 Winner (100k – 1M+ Candidate)
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Relatable College Life: Midterms Reality
                </h3>
                <p className="text-xs text-slate-500 italic">"Every college student has experienced this!"</p>
              </div>

              <div className="flex items-baseline gap-1 bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg shadow-xs">
                <span className="text-xl font-bold">91.4</span>
                <span className="text-xs opacity-90">/ 100 pts</span>
              </div>
            </div>

            {/* Simulated Persona Comments Snippet */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <strong className="text-slate-800">Maya (Gen Z, 19)</strong>
                  <span className="text-[10px] text-emerald-700 font-semibold ml-auto">Shared to DM 🚀</span>
                </div>
                <p className="text-slate-600 italic">"Sent to the group chat immediately 😭 literally us during midterms"</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <strong className="text-slate-800">Rohan (Student, 21)</strong>
                  <span className="text-[10px] text-blue-700 font-semibold ml-auto">Tagged Friends 💬</span>
                </div>
                <p className="text-slate-600 italic">"DMed to my hostel group. We literally talked about this yesterday!"</p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <strong className="text-slate-800">Leo (Creator, 25)</strong>
                  <span className="text-[10px] text-purple-700 font-semibold ml-auto">Watched 2x Loops 🔄</span>
                </div>
                <p className="text-slate-600 italic">"Seamless loop audio at 8.2s keeps completion rate over 101%."</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span>Audience Retention: <strong className="text-slate-800">101.7%</strong></span>
              <span>Predicted DM Share Rate: <strong className="text-emerald-700">42.9%</strong></span>
              <span>Cuts: <strong className="text-slate-800">18 cuts/min</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM & SOLUTION */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Why 85% of Instagram Reels Flop Under 1,000 Views
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            The algorithm doesn't care about upload frequency. It evaluates two brutal metrics: 0–3s hook drop-off and DM shares.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* The Old Way */}
          <div className="bg-white border border-rose-200 rounded-xl p-6 space-y-4 shadow-sm">
            <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">The Old Way (Post & Hope)</span>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>You post random Reels without knowing where viewers drop off in the first 2 seconds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>Content gets stuck in the 200–500 view seed testing pool with zero diagnostic feedback.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>CTAs ask for generic 'likes' which the algorithm weights 3x lower than DM shares.</span>
              </li>
            </ul>
          </div>

          {/* The ViralScope Way */}
          <div className="bg-white border border-emerald-200 rounded-xl p-6 space-y-4 shadow-sm">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">The ViralScope Way (Predict & Win)</span>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Test 10 unpublished drafts simultaneously before making any content public.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>7 MiroFish personas reveal exact drop-off seconds, rewatch loops, and sharing likelihood.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Publish only the single verified 100k–1M+ candidate backed by transparent 100-point data.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (4 STEPS) */}
      <section id="how-it-works" className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How ViralScope AI Works
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            From 10 raw unpublished video drafts to a ranked virality roadmap in four steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900">Batch Upload</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload up to 10 unpublished Reels with draft video clips, opening hooks, and captions.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900">OpenCV Vision</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Computer vision samples keyframes at 0.5s, 1.5s, and 2.5s, measuring cut density, lighting, and aspect ratio.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900">MiroFish Swarm</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              7 calibrated personas simulate watch time, retention curves, drop-off friction, and DM shares.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-sm flex items-center justify-center">
              4
            </div>
            <h3 className="text-sm font-bold text-slate-900">Rank & Optimize</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transparent 100-point scorecards rank your #1 candidate with hook rewrites and loop captions.
            </p>
          </div>
        </div>
      </section>

      {/* 4. MEET THE 7 SWARM PERSONAS */}
      <section id="personas" className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Meet the MiroFish Swarm Personas
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Simulating genuine psychological decision-making across distinct Instagram demographics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {personas.map((p, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-sm">
              <div className="flex items-center gap-3">
                <img 
                  src={p.avatar} 
                  alt={p.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{p.name}</h4>
                  <p className="text-[11px] text-indigo-600 font-medium">{p.role}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Engaged By:</span>
                  <p className="text-slate-700">{p.trigger}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Behavior:</span>
                  <p className="text-slate-600">{p.behavior}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 100-POINT SCORECARD EXPLANATION */}
      <section id="scorecard" className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Algorithmic Transparency</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                The 100-Point Virality Scorecard
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Configurable weights aligned with Instagram's 2026 explore and recommendation signals.
              </p>
            </div>
            <button
              onClick={onOpenDashboard}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm self-start md:self-auto"
            >
              Test Your Scorecard in Dashboard
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-6 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-indigo-700">20 Points</div>
              <div className="font-semibold text-slate-900 mt-0.5">Hook Strength</div>
              <div className="text-[11px] text-slate-500 mt-0.5">0–3s curiosity gap</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-indigo-700">15 Points</div>
              <div className="font-semibold text-slate-900 mt-0.5">Retention Potential</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Rewatch loops &gt;100%</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-emerald-700">15 Points</div>
              <div className="font-semibold text-slate-900 mt-0.5">Shareability (DMs)</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Top viral ranking driver</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-indigo-700">10 Points</div>
              <div className="font-semibold text-slate-900 mt-0.5">Emotional Appeal</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Relatability & humor</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-indigo-700">10 Points</div>
              <div className="font-semibold text-slate-900 mt-0.5">Originality</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Fresh angle vs tropes</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-indigo-700">10 Points</div>
              <div className="font-semibold text-slate-900 mt-0.5">Caption Quality</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Loop reading synergy</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-indigo-700">10 Points</div>
              <div className="font-semibold text-slate-900 mt-0.5">Audience Relevance</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Target persona fit</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-indigo-700">5 Points</div>
              <div className="font-semibold text-slate-900 mt-0.5">CTA Effectiveness</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Triggers saves/DMs</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <div className="font-bold text-indigo-700">5 Points</div>
              <div className="font-semibold text-slate-900 mt-0.5">Visual Storytelling</div>
              <div className="text-[11px] text-slate-500 mt-0.5">9:16 vertical & cuts</div>
            </div>

            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
              <div className="font-bold text-indigo-700">100 Total</div>
              <div className="font-semibold text-slate-900 mt-0.5">Total Score</div>
              <div className="text-[11px] text-slate-600 mt-0.5">100k–1M+ prediction</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to know about pre-publish virality testing.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => toggleFaq(i)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION BANNER */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Stop Guessing. Start Predicting Virality.
          </h2>
          <p className="text-slate-600 text-sm max-w-lg mx-auto leading-relaxed">
            Upload your 10 unpublished draft Reels now. Identify the #1 candidate with 100k–1M+ potential before your audience sees it.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenDashboard}
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors shadow-sm"
            >
              <span>Start Analyzing in Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
