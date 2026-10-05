import React from 'react';
import { Network, ShieldCheck, Cpu, ArrowDown, Sparkles, Binary, Compass } from 'lucide-react';

export default function FlowDiagram() {
  return (
    <div className="soc-card p-6 border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90">
      <div className="text-center mb-6">
        <span className="text-[11px] font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 inline-flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Core Conceptual Architecture</span>
        </span>
        <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
          Unified Network Behavior Intelligence Pipeline
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-1">
          Evaluating Supervised Threat Detection vs Unsupervised Behavioral Pattern Discovery across the exact same 150,000 network flows.
        </p>
      </div>

      {/* Diagram Node Tree */}
      <div className="flex flex-col items-center">
        {/* Top Node: Network Traffic */}
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2.5 px-6 py-3 rounded-xl bg-slate-800 border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
            <Network className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-sm font-bold text-white font-mono">NETWORK TRAFFIC DATASET</div>
              <div className="text-[11px] text-slate-400">150,000 Flows • 42 Numerical & Behavioral Features</div>
            </div>
          </div>
          <ArrowDown className="w-5 h-5 text-slate-500 my-1 animate-bounce" />
        </div>

        {/* Fork Splitter */}
        <div className="w-full max-w-4xl relative">
          {/* Horizontal Split Line */}
          <div className="hidden md:block absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-emerald-500 via-slate-600 to-purple-500"></div>

          {/* Two Branches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Left Branch: Supervised Classification */}
            <div className="soc-card p-5 border border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/60 transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold text-sm text-emerald-300 uppercase tracking-wider font-mono">1. CLASSIFICATION</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-700/50">
                  SUPERVISED ML
                </span>
              </div>

              <div className="space-y-3 mt-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Primary Core Question:</span>
                  <span className="font-semibold text-emerald-300 text-sm">"Is this network flow NORMAL or an ATTACK?"</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Ground Truth Dependency:</span>
                  <span className="font-mono text-slate-200">Requires Ground Truth Labels (<code className="text-emerald-400">is_attack</code>)</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Core Algorithms:</span>
                  <span className="font-mono text-slate-200 font-bold">Random Forest (Primary) + Logistic Regression</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Output Target:</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">0: Normal</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">1: Attack</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                  <span className="text-emerald-400 block text-[11px] font-semibold">Evaluation Criteria:</span>
                  <span className="font-mono text-emerald-200 text-xs">Accuracy (96.8%) • Precision • Recall • F1 • ROC-AUC (0.96)</span>
                </div>
              </div>
            </div>

            {/* Right Branch: Unsupervised Clustering */}
            <div className="soc-card p-5 border border-purple-500/30 bg-purple-950/10 hover:border-purple-500/60 transition-all">
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
                <div className="flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-purple-400" />
                  <span className="font-bold text-sm text-purple-300 uppercase tracking-wider font-mono">2. CLUSTERING</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 border border-purple-700/50">
                  UNSUPERVISED ML
                </span>
              </div>

              <div className="space-y-3 mt-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Primary Core Question:</span>
                  <span className="font-semibold text-purple-300 text-sm">"What types of behavioral patterns exist?"</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Ground Truth Dependency:</span>
                  <span className="font-mono text-slate-200"><strong className="text-purple-400">ZERO Labels Used</strong> (Target strictly removed)</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Core Algorithms:</span>
                  <span className="font-mono text-slate-200 font-bold">K-Means ($K=2..7$ Silhouette Evaluation, Optimal $K=5$)</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Discovered Profiles:</span>
                  <div className="flex flex-wrap gap-1 mt-1 text-[10px] font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Baseline</span>
                    <span className="px-1.5 py-0.5 rounded bg-red-900/40 text-red-300 border border-red-800/40">Flooding</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-800/40">Recon</span>
                    <span className="px-1.5 py-0.5 rounded bg-purple-900/40 text-purple-300 border border-purple-800/40">BruteForce</span>
                    <span className="px-1.5 py-0.5 rounded bg-cyan-900/40 text-cyan-300 border border-cyan-800/40">Exfil</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/30">
                  <span className="text-purple-400 block text-[11px] font-semibold">Evaluation Criteria:</span>
                  <span className="font-mono text-purple-200 text-xs">Silhouette Score (0.372) • Inertia • Centroid Distance • Cluster Profiles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
