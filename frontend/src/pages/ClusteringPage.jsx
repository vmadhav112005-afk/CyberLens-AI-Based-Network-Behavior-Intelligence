import React, { useState } from 'react';
import { 
  Layers, 
  Compass, 
  BarChart2, 
  Database,
  CheckCircle2
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
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner (Concept 3 Style) */}
      <div className="rounded-2xl p-6 sm:p-7 bg-[#111827] border border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>UNSUPERVISED BEHAVIORAL DISCOVERY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Latent Behavior Pattern Clustering
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            K-Means partitions 150,000 network flows into 5 behavioral archetypes with zero ground-truth attack labels.
          </p>
        </div>

        {/* 4 Sleek Badges */}
        <div className="flex flex-wrap items-center gap-2 font-mono">
          <div className="px-3 py-2 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">Optimal K</span>
            <span className="text-base font-bold text-indigo-400">K = {optK}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">Silhouette Score</span>
            <span className="text-base font-bold text-white">{bestSil.toFixed(4)}</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">Labels Used</span>
            <span className="text-base font-bold text-emerald-400">0 (Zero)</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">Total Flows</span>
            <span className="text-base font-bold text-sky-400">150,000</span>
          </div>
        </div>
      </div>

      {/* Silhouette & Inertia Analysis Chart */}
      <div className="soc-card p-6 border border-[#1E293B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E293B] mb-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              <span>K Evaluation & Silhouette Analysis (K=2 to K=7)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Evaluating cluster cohesion and separation across varying K centroid counts
            </p>
          </div>

          <div className="flex rounded-lg bg-[#0D1322] border border-[#1E293B] p-0.5 text-xs font-mono">
            <button
              onClick={() => setActiveKChart("silhouette")}
              className={`px-3 py-1 rounded transition-all ${activeKChart === "silhouette" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
            >
              Silhouette Score (Cohesion)
            </button>
            <button
              onClick={() => setActiveKChart("inertia")}
              className={`px-3 py-1 rounded transition-all ${activeKChart === "inertia" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
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
                  label={{ value: 'Silhouette Score', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(val) => [val.toFixed(4), "Silhouette Score"]}
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="silhouette_score" 
                  stroke="#818CF8" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: "#6366F1", stroke: "#818CF8" }}
                  name="Silhouette" 
                />
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
                  label={{ value: 'Inertia (WCSS)', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }}
                />
                <Tooltip 
                  formatter={(val) => [val.toLocaleString(), "Inertia"]}
                  contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="inertia" 
                  stroke="#F59E0B" 
                  strokeWidth={2.5} 
                  dot={{ r: 4, fill: "#D97706", stroke: "#F59E0B" }}
                  name="Inertia" 
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Discovered Cluster Profiles Grid */}
      <div className="soc-card p-6 border border-[#1E293B]">
        <div className="pb-3 border-b border-[#1E293B] mb-4">
          <h4 className="text-base font-bold text-white flex items-center space-x-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <span>Discovered Behavioral Archetypes (K=5 Profiles)</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical centroid fingerprints discovered without ground-truth labels
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {profiles.map((p) => {
            const colors = [
              { border: "border-sky-500/30", badge: "bg-sky-500/10 text-sky-400", name: "Cluster 0: Flooding" },
              { border: "border-rose-500/30", badge: "bg-rose-500/10 text-rose-400", name: "Cluster 1: Scanning" },
              { border: "border-purple-500/30", badge: "bg-purple-500/10 text-purple-400", name: "Cluster 2: Brute Force" },
              { border: "border-amber-500/30", badge: "bg-amber-500/10 text-amber-400", name: "Cluster 3: Exfiltration" },
              { border: "border-emerald-500/30", badge: "bg-emerald-500/10 text-emerald-400", name: "Cluster 4: Benign Baseline" }
            ];
            const theme = colors[p.cluster_id % 5];

            return (
              <div 
                key={p.cluster_id} 
                className={`p-4 rounded-xl bg-[#0D1322] border ${theme.border} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">Cluster {p.cluster_id}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${theme.badge}`}>
                      {p.flow_count?.toLocaleString()} flows
                    </span>
                  </div>
                  <h5 className="text-sm font-semibold text-white mt-1.5">{p.cluster_name}</h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {p.behavioral_description || p.security_label_interpretation}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Packet Rate:</span>
                    <span className="text-slate-200">{Math.round(p.centroid?.packet_rate || 0)} pkts/s</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Byte Count:</span>
                    <span className="text-slate-200">{Math.round(p.centroid?.byte_count || 0).toLocaleString()} B</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Unique Ports:</span>
                    <span className="text-slate-200">{Math.round(p.centroid?.unique_destination_ports || 1)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2D PCA Latent Space Scatter Plot */}
      <PcaScatterPlot 
        points={pcaData?.points} 
        varianceExplained={pcaData?.variance_explained} 
      />

      {/* Interactive Behavioral Sandbox */}
      <BehaviorExplorer />
    </div>
  );
}
