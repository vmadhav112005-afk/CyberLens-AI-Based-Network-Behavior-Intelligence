import React from 'react';
import { 
  GitCompare, 
  ShieldCheck, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  Sparkles,
  Target,
  Compass
} from 'lucide-react';

export default function ComparisonPage() {
  const comparisonData = [
    {
      aspect: "Learning Paradigm",
      classification: "Supervised Learning",
      clustering: "Unsupervised Learning",
      highlight: true
    },
    {
      aspect: "Uses Ground Truth Labels?",
      classification: "YES (is_attack = 0/1, attack_type)",
      clustering: "NO (Labels strictly stripped before training)",
      highlight: true
    },
    {
      aspect: "Main Operational Goal",
      classification: "Known Threat Classification & Triage",
      clustering: "Behavioral Discovery & Anomaly Exploration",
      highlight: false
    },
    {
      aspect: "Guiding Security Question",
      classification: '"Is this network flow NORMAL or an ATTACK?"',
      clustering: '"What types of behavioral patterns exist?"',
      highlight: true
    },
    {
      aspect: "Primary Implemented Model",
      classification: "Random Forest Classifier (100 Trees)",
      clustering: "K-Means Clustering (K=5 Centroids)",
      highlight: false
    },
    {
      aspect: "Baseline Comparison Model",
      classification: "Logistic Regression (Linear Baseline)",
      clustering: "Silhouette Analysis across K=2..7",
      highlight: false
    },
    {
      aspect: "Model Output",
      classification: "Discrete Class (Normal vs Attack) + Probability",
      clustering: "Cluster ID (0 to 4) + Centroid Distance",
      highlight: false
    },
    {
      aspect: "Primary Evaluation Metrics",
      classification: "Accuracy (96.8%), Precision, Recall, F1, ROC-AUC (0.988)",
      clustering: "Silhouette Score (0.3722), Inertia (WCSS)",
      highlight: true
    },
    {
      aspect: "Input Dataset Requirement",
      classification: "Labeled Feature Vectors: (x_i, y_i)",
      clustering: "Unlabeled Feature Vectors: x_i",
      highlight: false
    },
    {
      aspect: "Operational Vulnerability",
      classification: "Blind to novel zero-day attacks with no prior training labels",
      clustering: "Clusters require post-hoc human interpretation to assign semantics",
      highlight: true
    },
    {
      aspect: "SOC Cybersecurity Role",
      classification: "Perimeter Firewall / IDS Line-Rate Threat Filtering",
      clustering: "Deep Threat Hunting, Baseline Profiling, Zero-Day Discovery",
      highlight: false
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner (Concept 3 Style) */}
      <div className="rounded-2xl p-6 sm:p-7 bg-[#111827] border border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono mb-2">
            <GitCompare className="w-3.5 h-3.5" />
            <span>UNIFIED METHODOLOGY BENCHMARK</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Classification vs. Clustering Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Side-by-side scientific comparison of Supervised and Unsupervised machine learning evaluated on the exact same 150,000 network flows.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Random Forest
          </span>
          <span className="text-slate-500">vs</span>
          <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            K-Means
          </span>
        </div>
      </div>

      {/* Structured Comparison Table */}
      <div className="soc-card p-6 border border-[#1E293B] overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B] mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <GitCompare className="w-4 h-4 text-sky-400" />
              <span>Scientific Evaluation Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct comparison across mathematical paradigms, inputs, outputs, and SOC deployment
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Identical 150k Telemetry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0D1322] text-slate-300">
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-slate-400 w-1/4">Evaluation Aspect</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-emerald-400 w-3/8">Supervised Classification</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-indigo-400 w-3/8">Unsupervised Clustering</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {comparisonData.map((row, idx) => (
                <tr 
                  key={idx} 
                  className={`hover:bg-slate-800/30 transition-colors ${row.highlight ? "bg-[#0D1322]/50" : ""}`}
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-200 flex items-center space-x-2">
                    {row.highlight && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0"></span>}
                    <span>{row.aspect}</span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-300 font-sans font-medium">
                    {row.classification}
                  </td>
                  <td className="py-3.5 px-4 text-indigo-300 font-sans font-medium">
                    {row.clustering}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Operational Pipeline Synergy */}
      <div className="soc-card p-6 border border-[#1E293B]">
        <div className="pb-3 border-b border-[#1E293B] mb-5">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Operational SOC Synergy: Combining Both Paradigms</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            How enterprise security operations centers integrate classification and clustering into a continuous defense lifecycle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-emerald-400">STAGE 1</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Firewall Line-Rate
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white">Automated Threat Triage</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              <strong>Random Forest</strong> inspects inbound traffic at wire speed. It instantly blocks 96.8% of known threat signatures including DDoS flooding, brute-force scans, and known malware vectors.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-indigo-400">STAGE 2</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                Threat Hunting
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white">Latent Behavioral Discovery</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              <strong>K-Means</strong> clusters the network flows that passed initial filtering without alerts. Security analysts inspect outlier cluster centroids to isolate novel zero-day exfiltration and botnet synchronization.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-sky-400">STAGE 3</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30">
                Closed-Loop AI
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white">Continuous Model Retraining</h4>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Once analysts confirm an anomalous behavioral cluster is malicious, its flows are labeled and fed back into the supervised training pipeline, continuously fortifying the model against emerging zero-days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
