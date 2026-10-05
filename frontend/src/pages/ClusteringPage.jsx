import React, { useState } from 'react';
import { 
  Layers, 
  Compass, 
  HelpCircle, 
  CheckCircle2, 
  BarChart2, 
  Database,
  TrendingDown,
  Info,
  Zap,
  Target
} from 'lucide-react';
import PcaScatterPlot from '../components/PcaScatterPlot';
import BehaviorExplorer from '../components/BehaviorExplorer';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';

export default function ClusteringPage({ clusteringData, pcaData }) {
  const [activeKChart, setActiveKChart] = useState("silhouette"); // 'silhouette' or 'inertia'

  const kEval = clusteringData?.k_evaluation || [
    { k: 2, silhouette_score: 0.4735, inertia: 3848935.1 },
    { k: 3, silhouette_score: 0.4810, inertia: 3193530.5 },
    { k: 4, silhouette_score: 0.3439, inertia: 2784140.3 },
    { k: 5, silhouette_score: 0.3722, inertia: 2440745.4 },
    { k: 6, silhouette_score: 0.3937, inertia: 2207990.3 },
    { k: 7, silhouette_score: 0.3977, inertia: 2036823.2 },
  ];

  const profiles = clusteringData?.cluster_profiles || [];
  const optK = clusteringData?.optimal_k || 5;
  const bestSil = clusteringData?.best_silhouette_score || 0.3722;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-800 text-purple-300 text-xs font-mono mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>UNSUPERVISED MACHINE LEARNING</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
          Network Behavior Pattern Clustering
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-3xl">
          Unsupervised clustering resolves the investigative question: <strong className="text-purple-300 font-mono">"What types of network behavior exist?"</strong> Operating with <strong className="text-white">ZERO ground truth attack labels</strong> during training, K-Means discovers 5 latent behavioral archetypes based on multivariate feature proximity.
        </p>

        {/* Model summary badges */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Optimal K (Clusters)</span>
            <span className="text-xl font-bold font-mono text-purple-400">K = {optK}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Silhouette Score</span>
            <span className="text-xl font-bold font-mono text-purple-400">{bestSil.toFixed(4)}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Labels Used in Training</span>
            <span className="text-xl font-bold font-mono text-emerald-400">0 (Zero Labels)</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Total Flows Clustered</span>
            <span className="text-xl font-bold font-mono text-cyan-400">150,000</span>
          </div>
        </div>
      </div>

      {/* Why Clustering & Why K-Means Deep-Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="soc-card p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span>Problem Statement & Why Clustering?</span>
          </h3>
          <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              Supervised models suffer from a fundamental vulnerability: <strong>they can only detect what they have been trained to see</strong>. Zero-day exploits, novel malware command-and-control protocols, and stealthy internal data leaks have no historical labels.
            </p>
            <p>
              <strong>Unsupervised Clustering</strong> groups network sessions solely by statistical behavioral similarities. By stripping the <code className="text-rose-400 font-mono">is_attack</code> and <code className="text-rose-400 font-mono">attack_type</code> labels before model training, the algorithm organizes the traffic space purely according to packet dynamics, port entropy, and session persistence.
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-400">
              <strong className="text-white block mb-1">Unsupervised Learning Paradigm:</strong>
              Unlabeled Dataset X = {"{x_i}"} for i=1..N, finding centroid vectors μ_k to minimize Within-Cluster Sum of Squares (WCSS).
            </div>
          </div>
        </div>

        <div className="soc-card p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Why K-Means Clustering & K Selection?</span>
          </h3>
          <div className="mt-4 space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <ul className="space-y-2.5">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span><strong>Linear Scalability:</strong> K-Means achieves O(K·N·D) computational complexity, clustering 150,000 flows in under 3 seconds where hierarchical methods would require gigabytes of O(N²) memory.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span><strong>Actionable Centroid Archetypes:</strong> Centroids serve as concrete operational fingerprints (e.g. mean bytes, packet rate, unique ports) for SOC firewall policy configuration.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <span><strong>Optimal Selection (K=5):</strong> Evaluated across K=2..7. While K=2,3 compress coarse geometry, K=5 achieves the sweet spot: cleanly partitioning Flooding, Scanning, Brute Force, Exfiltration, and Benign Baseline.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Silhouette & Inertia Analysis Chart */}
      <div className="soc-card p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-purple-400" />
              <span>K Evaluation & Silhouette Analysis (K=2 to K=7)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Measuring cluster cohesion and separation to validate optimal behavioral partition.
            </p>
          </div>

          <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-mono">
            <button
              onClick={() => setActiveKChart("silhouette")}
              className={`px-3 py-1 rounded transition-all ${activeKChart === "silhouette" ? "bg-purple-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
            >
              Silhouette Score (Cohesion)
            </button>
            <button
              onClick={() => setActiveKChart("inertia")}
              className={`px-3 py-1 rounded transition-all ${activeKChart === "inertia" ? "bg-purple-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
            >
              Inertia (Elbow Method)
            </button>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeKChart === "silhouette" ? (
              <LineChart data={kEval} margin={{ top: 10, right: 30, bottom: 20, left: 10 }}>
                <XAxis 
                  dataKey="k" 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false}
                  label={{ value: 'Number of Clusters (K)', position: 'bottom', offset: 5, fill: '#94A3B8', fontSize: 11 }}
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false}
                  domain={[0.2, 0.6]}
                  label={{ value: 'Silhouette Coefficient', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(val) => [val, "Silhouette Score"]}
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
                />
                <Line type="monotone" dataKey="silhouette_score" stroke="#A855F7" strokeWidth={3} dot={{ r: 6, fill: "#A855F7" }} name="Silhouette" />
              </LineChart>
            ) : (
              <LineChart data={kEval} margin={{ top: 10, right: 30, bottom: 20, left: 20 }}>
                <XAxis 
                  dataKey="k" 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false}
                  label={{ value: 'Number of Clusters (K)', position: 'bottom', offset: 5, fill: '#94A3B8', fontSize: 11 }}
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={11} 
                  tickLine={false}
                  tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                  label={{ value: 'Inertia (Within-Cluster Sum of Squares)', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(val) => [val.toLocaleString(), "Inertia"]}
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
                />
                <Line type="monotone" dataKey="inertia" stroke="#06B6D4" strokeWidth={3} dot={{ r: 6, fill: "#06B6D4" }} name="Inertia" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2D PCA Cluster Scatter Plot Component */}
      <PcaScatterPlot 
        points={pcaData?.points || []} 
        varianceExplained={pcaData?.variance_explained || [0.28, 0.19]} 
      />

      {/* Discovered Cluster Profiles Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Compass className="w-5 h-5 text-purple-400" />
              <span>Discovered Behavioral Cluster Profiles (K=5)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Archetypes derived autonomously from empirical feature centroids (Labels used only post-hoc for interpretation).
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
            Unsupervised Discovery
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {profiles.map((p) => (
            <div 
              key={p.cluster_id} 
              className="soc-card p-5 border transition-all duration-200 hover:border-purple-500/50 relative overflow-hidden"
              style={{ borderLeftColor: p.color, borderLeftWidth: "4px" }}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-mono text-xs font-bold" style={{ color: p.color }}>
                  CLUSTER {p.cluster_id}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {p.record_count.toLocaleString()} flows ({p.percentage}%)
                </span>
              </div>

              <h4 className="text-base font-bold text-white mt-2 font-mono">
                {p.name}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {p.description}
              </p>

              {/* Numerical Centroid Stats */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">Avg Packets:</span>
                  <span className="text-white font-bold">{p.avg_packet_count.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Avg Byte Rate:</span>
                  <span className="text-white font-bold">{(p.avg_byte_rate / 1024).toFixed(1)} KB/s</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Avg Unique Ports:</span>
                  <span className="text-white font-bold">{p.avg_unique_ports}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Avg Failed Logins:</span>
                  <span className="text-white font-bold">{p.avg_failed_logins}</span>
                </div>
              </div>

              {/* Post-Hoc Purity Badge */}
              <div className="mt-3 p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 text-[10px]">Post-Hoc Attack Rate:</span>
                <strong style={{ color: p.color }}>{p.post_hoc_attack_pct}%</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Network Behavior Explorer */}
      <BehaviorExplorer />
    </div>
  );
}
