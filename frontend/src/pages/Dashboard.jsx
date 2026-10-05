import React from 'react';
import { 
  ShieldAlert, 
  Layers, 
  Activity, 
  Database, 
  Target, 
  Award, 
  Compass, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Cpu,
  BarChart3
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import FlowDiagram from '../components/FlowDiagram';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function Dashboard({ stats, setActiveTab }) {
  const attackBreakdown = stats?.attack_type_breakdown 
    ? Object.entries(stats.attack_type_breakdown).map(([name, count]) => ({
        name,
        count,
        pct: ((count / (stats?.total_records || 150000)) * 100).toFixed(1)
      }))
    : [];

  const BAR_COLORS = {
    "Normal": "#10B981",
    "DDoS": "#EF4444",
    "Port_Scan": "#F59E0B",
    "Brute_Force": "#8B5CF6",
    "Web_Attack": "#EC4899",
    "Data_Exfiltration": "#06B6D4",
    "Botnet": "#6366F1"
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative rounded-2xl p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-10 -top-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>CYBERSECURITY INTELLIGENCE OPERATIONS</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            CYBERLENS
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 mt-1">
            AI-Based Network Behavior Intelligence
          </h2>

          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
            "Detect known threats. Discover hidden network behavior."
            A unified comparative platform contrasting Supervised Threat Classification with Unsupervised Behavioral Clustering on the exact same 150,000+ network flows.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('comparison')}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center space-x-2 transition-all"
            >
              <span>Explore Comparison Matrix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('classification')}
              className="px-5 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center space-x-2 transition-all"
            >
              <span>Test Attack Sandbox</span>
            </button>
            <button
              onClick={() => setActiveTab('clustering')}
              className="px-5 py-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center space-x-2 transition-all"
            >
              <span>View Latent Clusters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Large Hero Paradigm Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Classification Hero Card */}
        <div 
          onClick={() => setActiveTab('classification')}
          className="soc-card p-6 border border-emerald-500/30 hover:border-emerald-500/60 bg-gradient-to-b from-emerald-950/20 to-slate-900/40 cursor-pointer transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
              Supervised Learning
            </span>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-white mt-4 font-mono">
            CLASSIFICATION
          </h3>
          <p className="text-sm font-semibold text-emerald-300 mt-1">
            "Is this network activity NORMAL or an ATTACK?"
          </p>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Learns decision boundaries from known ground truth labels. Evaluates tabular telemetry through Random Forest ensembles to detect known threats with high precision.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Model:</span>
              <strong className="text-white">Random Forest (100 trees)</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Accuracy:</span>
              <strong className="text-emerald-400 text-sm">96.77%</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">F1 Score:</span>
              <strong className="text-emerald-400 text-sm">96.50%</strong>
            </div>
          </div>
        </div>

        {/* Clustering Hero Card */}
        <div 
          onClick={() => setActiveTab('clustering')}
          className="soc-card p-6 border border-purple-500/30 hover:border-purple-500/60 bg-gradient-to-b from-purple-950/20 to-slate-900/40 cursor-pointer transition-all duration-300 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-widest text-purple-400 font-bold px-2.5 py-0.5 rounded bg-purple-950 border border-purple-800">
              Unsupervised Learning
            </span>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-white mt-4 font-mono">
            CLUSTERING
          </h3>
          <p className="text-sm font-semibold text-purple-300 mt-1">
            "What types of network behavior exist?"
          </p>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Zero attack labels used during training. Groups traffic into 5 behavioral archetypes based on high-dimensional feature proximity, allowing zero-day behavioral patterns to emerge.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">Model:</span>
              <strong className="text-white">K-Means ($K=5$)</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Silhouette:</span>
              <strong className="text-purple-400 text-sm">0.3722</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Clusters Discovered:</span>
              <strong className="text-purple-400 text-sm">5 Patterns</strong>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div>
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Operational ML Telemetry KPIs</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <KpiCard title="Dataset Size" value="150,000" subtitle="Synthetic Flows" icon={Database} color="cyan" />
          <KpiCard title="Total Features" value="42" subtitle="37 Numerical" icon={Cpu} color="cyan" />
          <KpiCard title="Attack Rate" value="46.0%" subtitle="69,000 Flows" icon={Target} color="rose" />
          <KpiCard title="RF Accuracy" value="96.77%" subtitle="Holdout 20%" icon={Award} color="emerald" badge="Realistic" />
          <KpiCard title="RF F1 Score" value="96.50%" subtitle="Harmonic Mean" icon={Award} color="emerald" />
          <KpiCard title="ROC-AUC" value="0.9635" subtitle="True Discrim." icon={TrendingUp} color="emerald" />
          <KpiCard title="Clusters (K)" value="5" subtitle="Discovered" icon={Layers} color="purple" badge="K=5" />
          <KpiCard title="Silhouette" value="0.3722" subtitle="Cluster Cohesion" icon={Compass} color="purple" />
        </div>
      </div>

      {/* Prominent Conceptual Flow Diagram */}
      <FlowDiagram />

      {/* Dataset Composition Distribution */}
      <div className="soc-card p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>Full Dataset Category Distribution (150,000 Flows)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Balanced cyber threat taxonomy generated according to real-world intrusion statistics.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            54% Normal / 46% Attack
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attackBreakdown} margin={{ top: 10, right: 20, bottom: 25, left: 10 }}>
              <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(val, name, item) => [`${val.toLocaleString()} flows (${item.payload.pct}%)`, "Volume"]}
                contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {attackBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[entry.name] || "#06B6D4"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
