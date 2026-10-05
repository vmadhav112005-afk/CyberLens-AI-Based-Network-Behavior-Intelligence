import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  AlertTriangle, 
  HelpCircle, 
  BarChart3, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { fetchFeatureImportance } from '../services/api';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell 
} from 'recharts';

export default function ModelInsightsPage() {
  const [featureData, setFeatureData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchFeatureImportance();
        setFeatureData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const topFeatures = featureData?.top_features || [];

  const FEATURE_EXPLANATIONS = {
    packet_rate: "Distinguishes volumetric DDoS and flooding attacks that transmit hundreds of packets per second from low-frequency benign surfing.",
    unique_destination_ports: "Crucial indicator of reconnaissance sweeps and Nmap port scanning where a single IP probes dozens of ports sequentially.",
    failed_login_attempts: "Deterministic signature of brute-force password spraying and SSH/RDP credential stuffing campaigns.",
    data_exfiltration_score: "Measures disproportionate outbound bytes over long durations, identifying unauthorized data exfiltration.",
    connection_count: "Flags resource exhaustion attacks and distributed botnet synchronizations.",
    flow_duration: "Separates brief reconnaissance pings from persistent backdoor channels and prolonged data extraction.",
    byte_rate: "Complements packet rate by measuring network bandwidth consumption during exfiltration or volumetric flooding.",
    syn_count: "Primary marker for TCP SYN flooding attacks that attempt to exhaust server backlog queues without completing three-way handshakes.",
    http_requests: "Differentiates application-layer HTTP attacks (e.g. SQLi, directory brute-force) from transport-layer flooding."
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-mono mb-2">
          <Cpu className="w-3.5 h-3.5" />
          <span>MODEL INTERPRETABILITY & EXPLAINABLE AI (XAI)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Network Feature Importance & Behavioral Drivers
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
          Deconstructing the empirical Gini impurity reductions that drove Random Forest threat decisions across 120,000 training flows.
        </p>
      </div>

      {/* Critical Scientific Causality Disclaimer Box */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 block font-mono text-xs uppercase tracking-wider mb-1">
            Important Scientific Methodology Notice: Correlation vs. Causation
          </strong>
          <p className="text-slate-300 text-xs leading-relaxed">
            "Important features are not automatically proof of causation. They indicate which variables the model relied on most to minimize tree impurity." A high Gini score means the feature provides strong statistical discrimination within the training topology, not that it is inherently malicious in isolation.
          </p>
        </div>
      </div>

      {/* Feature Importance Bar Chart */}
      <div className="soc-card p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>Top 12 Predictive Features (Gini Importance)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Mean Gini impurity reduction calculated across all 100 ensemble decision trees.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            Ensemble Trees
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={topFeatures.slice(0, 12)} 
              layout="vertical" 
              margin={{ top: 5, right: 30, left: 160, bottom: 5 }}
            >
              <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis dataKey="feature" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip 
                formatter={(val) => [val.toFixed(4), "Importance"]}
                contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
              />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {topFeatures.slice(0, 12).map((_, index) => (
                  <Cell 
                    key={`bar-${index}`} 
                    fill={index === 0 ? "#06B6D4" : index < 3 ? "#3B82F6" : index < 6 ? "#8B5CF6" : "#6366F1"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Cyber Defense Interpretability Grid */}
      <div>
        <h3 className="text-base font-bold text-white mb-3 flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Cybersecurity Domain Rationale for Top Features</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topFeatures.slice(0, 9).map((feat, idx) => (
            <div key={feat.feature} className="soc-card p-4 border border-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                  Rank #{feat.rank}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {(feat.importance * 100).toFixed(2)}% Weight
                </span>
              </div>

              <h4 className="text-sm font-bold text-white mt-2 font-mono">
                {feat.feature}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {FEATURE_EXPLANATIONS[feat.feature] || 
                  "Provides essential boundary separation by capturing multivariate traffic anomalies and flow dynamics."}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
