import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Database, 
  Target, 
  Award, 
  ArrowRight,
  TrendingUp,
  BarChart3,
  Zap,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import KpiCard from '../components/KpiCard';

export default function Dashboard({ stats, setActiveTab }) {
  const totalRecords = stats?.total_records || 150000;
  const attackBreakdown = stats?.attack_type_breakdown 
    ? Object.entries(stats.attack_type_breakdown).map(([name, count]) => ({
        name,
        count,
        pct: parseFloat(((count / totalRecords) * 100).toFixed(1))
      }))
    : [
        { name: "Normal", count: 81000, pct: 54.0 },
        { name: "DDoS", count: 21000, pct: 14.0 },
        { name: "Port_Scan", count: 13500, pct: 9.0 },
        { name: "Brute_Force", count: 12000, pct: 8.0 },
        { name: "Web_Attack", count: 7500, pct: 5.0 },
        { name: "Data_Exfiltration", count: 7500, pct: 5.0 },
        { name: "Botnet", count: 7500, pct: 5.0 },
      ];

  const BAR_COLORS = {
    "Normal": "#10B981",
    "DDoS": "#6366F1",
    "Port_Scan": "#F43F5E",
    "Brute_Force": "#A855F7",
    "Web_Attack": "#F59E0B",
    "Data_Exfiltration": "#38BDF8",
    "Botnet": "#EC4899"
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 4 Sleek KPI Cards (Concept 3 Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Telemetry Flows" 
          value="150,000" 
          subtitle="42 Tabular Features" 
          icon={Database} 
          color="cyan" 
          badge="100% Ingested"
        />
        <KpiCard 
          title="Malicious Threats" 
          value="69,000" 
          subtitle="46.0% Total Traffic" 
          icon={Target} 
          color="rose" 
          badge="6 Threat Vectors"
        />
        <KpiCard 
          title="Detection Accuracy" 
          value="96.8%" 
          subtitle="Random Forest Model" 
          icon={Award} 
          color="emerald" 
          badge="ROC 0.988"
        />
        <KpiCard 
          title="Latent Clusters" 
          value="K = 5" 
          subtitle="Silhouette Score 0.372" 
          icon={Layers} 
          color="purple" 
          badge="Unsupervised"
        />
      </div>

      {/* Main Grid: Attack Distribution (Horizontal Bars) & Clean Model Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Attack Distribution (Concept 3 Horizontal Bar Style) */}
        <div className="lg:col-span-6 soc-card p-6 border border-[#1E293B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                  <span>Attack Distribution</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  150,000 network flows categorized across behavioral types
                </p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                54% Normal · 46% Attack
              </span>
            </div>

            {/* Horizontal progress bars */}
            <div className="space-y-3.5">
              {attackBreakdown.map((item) => {
                const color = BAR_COLORS[item.name] || "#38BDF8";
                return (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-300 flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                        <span>{item.name.replace("_", " ")}</span>
                      </span>
                      <div className="flex items-center space-x-2 font-mono text-[11px]">
                        <span className="text-slate-400">{item.count.toLocaleString()} flows</span>
                        <span className="font-bold text-white">{item.pct}%</span>
                      </div>
                    </div>
                    {/* Progress Track */}
                    <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${item.pct}%`, 
                          backgroundColor: color 
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400">
            <span>Realistic overlap injected: ~3.5%</span>
            <button 
              onClick={() => setActiveTab('dataset')}
              className="text-sky-400 hover:text-sky-300 font-medium flex items-center space-x-1"
            >
              <span>Explore dataset table</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Clean Model Comparison (Concept 3 Style) */}
        <div className="lg:col-span-6 soc-card p-6 border border-[#1E293B] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Clean Model Comparison</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Supervised detection vs unsupervised discovery benchmark
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('comparison')}
                className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-sky-400 hover:text-sky-300 border border-slate-700 transition-colors flex items-center space-x-1"
              >
                <span>Full Matrix</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Side-by-Side Model Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Threat Classification Model */}
              <div className="p-4 rounded-xl bg-[#0D1322] border border-[#1E293B] hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">Random Forest</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      Best
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Threat Detection</span>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Accuracy</span>
                      <span className="font-mono font-bold text-emerald-400">96.8%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Precision</span>
                      <span className="font-mono font-bold text-slate-200">96.2%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Recall</span>
                      <span className="font-mono font-bold text-slate-200">96.8%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">ROC-AUC</span>
                      <span className="font-mono font-bold text-sky-400">0.988</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('classification')}
                  className="mt-4 w-full py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-colors flex items-center justify-center space-x-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Test Threat Sandbox</span>
                </button>
              </div>

              {/* Clustering Model */}
              <div className="p-4 rounded-xl bg-[#0D1322] border border-[#1E293B] hover:border-indigo-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white font-mono">K-Means ($K=5$)</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                      Fastest
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Behavior Discovery</span>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Optimal K</span>
                      <span className="font-mono font-bold text-indigo-400">5 Clusters</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Silhouette</span>
                      <span className="font-mono font-bold text-slate-200">0.3722</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800/60">
                      <span className="text-slate-400">Labels Used</span>
                      <span className="font-mono font-bold text-emerald-400">0 (Zero)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Inference Time</span>
                      <span className="font-mono font-bold text-slate-200">&lt; 2 ms</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('clustering')}
                  className="mt-4 w-full py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-medium transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>View 2D Clusters</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400">
            <span>Evaluating on exact same 150k dataset</span>
            <span className="text-emerald-400 font-mono flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Models Loaded & Ready</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Interactive Flow Inspection Preview Banner (Concept 3 Style) */}
      <div className="soc-card p-6 border border-[#1E293B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E293B]">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Database className="w-4 h-4 text-sky-400" />
              <span>Interactive Flow Inspection Preview</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live telemetry feed with instantaneous anomaly flags and multi-feature packet headers
            </p>
          </div>
          <button
            onClick={() => setActiveTab('dataset')}
            className="px-4 py-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-medium flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
          >
            <span>Open Dataset Explorer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mini Preview Rows */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">Flow ID</th>
                <th className="py-2.5 px-3">Source IP</th>
                <th className="py-2.5 px-3">Destination IP</th>
                <th className="py-2.5 px-3">Protocol</th>
                <th className="py-2.5 px-3">Port</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Cluster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-3 text-sky-400 font-semibold">FLOW-00042</td>
                <td className="py-2.5 px-3 text-slate-300">192.168.1.105</td>
                <td className="py-2.5 px-3 text-slate-300">10.0.0.1</td>
                <td className="py-2.5 px-3 text-slate-400">TCP</td>
                <td className="py-2.5 px-3 text-slate-400">80</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Normal (0)
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-400">Cluster 4: Benign</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-3 text-sky-400 font-semibold">FLOW-00189</td>
                <td className="py-2.5 px-3 text-slate-300">172.16.0.45</td>
                <td className="py-2.5 px-3 text-slate-300">10.0.0.50</td>
                <td className="py-2.5 px-3 text-slate-400">TCP</td>
                <td className="py-2.5 px-3 text-slate-400">443</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    Attack (1) · DDoS
                  </span>
                </td>
                <td className="py-2.5 px-3 text-indigo-400">Cluster 0: Flooding</td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-3 text-sky-400 font-semibold">FLOW-00312</td>
                <td className="py-2.5 px-3 text-slate-300">192.168.1.22</td>
                <td className="py-2.5 px-3 text-slate-300">10.0.0.22</td>
                <td className="py-2.5 px-3 text-slate-400">TCP</td>
                <td className="py-2.5 px-3 text-slate-400">22</td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    Attack (1) · Brute Force
                  </span>
                </td>
                <td className="py-2.5 px-3 text-purple-400">Cluster 2: Brute Force</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
