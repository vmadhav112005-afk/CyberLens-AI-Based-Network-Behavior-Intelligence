import React from 'react';
import { 
  GitCompare, 
  ShieldAlert, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles,
  Zap,
  Target,
  Compass,
  FileCheck
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
      aspect: "Guiding Investigative Question",
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
      classification: "Discrete Class (Normal vs Attack) + Prob.",
      clustering: "Cluster ID (0 to 4) + Centroid Distance",
      highlight: false
    },
    {
      aspect: "Primary Evaluation Metrics",
      classification: "Accuracy (96.8%), Precision, Recall, F1, ROC-AUC",
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
      aspect: "Vulnerability / Blind Spot",
      classification: "Fails on unknown Zero-Day attacks with no prior labels",
      clustering: "Sensitive to scaling & outliers; clusters lack semantic names without human interpretation",
      highlight: true
    },
    {
      aspect: "SOC Cybersecurity Role",
      classification: "Real-time Firewall / IDS Threat Filtering",
      clustering: "Threat Hunting, Baseline Profiling, Zero-Day Discovery",
      highlight: false
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono mb-3">
          <GitCompare className="w-3.5 h-3.5" />
          <span>SCIENTIFIC METHODOLOGY BENCHMARK</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
          Classification vs Clustering
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-3xl">
          A definitive comparative analysis of Supervised and Unsupervised learning paradigms evaluated on the <strong className="text-white">exact same 150,000 network flows</strong>. Essential for viva examination defense.
        </p>
      </div>

      {/* Visual Workflow Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Classification Workflow Card */}
        <div className="soc-card p-6 border border-emerald-500/30 bg-emerald-950/10">
          <div className="flex items-center space-x-2 pb-3 border-b border-emerald-500/20">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-emerald-300 font-mono">
              CLASSIFICATION PIPELINE (Supervised)
            </h3>
          </div>

          <div className="my-6 flex flex-col items-center space-y-3 font-mono text-xs">
            <div className="w-full text-center py-2.5 px-4 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-300 font-bold shadow-md">
              KNOWN LABELS + TELEMETRY (80% Train Set)
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 rotate-90" />
            <div className="w-full text-center py-2.5 px-4 rounded-lg bg-emerald-950/60 border border-emerald-600 text-white font-bold">
              SUPERVISED RANDOM FOREST (100 Trees)
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 rotate-90" />
            <div className="w-full text-center py-2.5 px-4 rounded-lg bg-slate-900 border border-emerald-500/40 text-emerald-400 font-bold shadow-md">
              DISCRETE VERDICT: NORMAL (0) or ATTACK (1)
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Key Mechanism:</strong> The algorithm explicitly observes which feature combinations produce attacks in training. It minimizes classification error (Cross-Entropy / Gini impurity) to output high-accuracy predictions on new traffic.
          </p>
        </div>

        {/* Clustering Workflow Card */}
        <div className="soc-card p-6 border border-purple-500/30 bg-purple-950/10">
          <div className="flex items-center space-x-2 pb-3 border-b border-purple-500/20">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base text-purple-300 font-mono">
              CLUSTERING PIPELINE (Unsupervised)
            </h3>
          </div>

          <div className="my-6 flex flex-col items-center space-y-3 font-mono text-xs">
            <div className="w-full text-center py-2.5 px-4 rounded-lg bg-slate-900 border border-purple-500/40 text-purple-300 font-bold shadow-md">
              RAW UNLABELED NETWORK TELEMETRY (Zero Labels)
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400 rotate-90" />
            <div className="w-full text-center py-2.5 px-4 rounded-lg bg-purple-950/60 border border-purple-600 text-white font-bold">
              UNSUPERVISED K-MEANS ($K=5$ Centroids)
            </div>
            <ArrowRight className="w-4 h-4 text-purple-400 rotate-90" />
            <div className="w-full text-center py-2.5 px-4 rounded-lg bg-slate-900 border border-purple-500/40 text-purple-400 font-bold shadow-md">
              DISCOVERED BEHAVIORAL GROUPS & CENTROIDS
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Key Mechanism:</strong> The algorithm receives no teacher signal. It measures Euclidean distance in 37-dimensional standardized space to find geometric clusters. Security labels are used ONLY post-hoc by human analysts to profile the clusters.
          </p>
        </div>
      </div>

      {/* Structured Comparison Table */}
      <div className="soc-card p-6 border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <GitCompare className="w-5 h-5 text-cyan-400" />
              <span>Comprehensive Scientific Comparison Matrix</span>
            </h3>
            <p className="text-xs text-slate-400">
              Direct comparison across mathematical foundations, evaluation metrics, and operational SOC utility.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            Viva Examination Ready
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-900/80 text-slate-300">
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-slate-400 w-1/4">Evaluation Aspect</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-emerald-400 w-3/8">Supervised Classification</th>
                <th className="py-3 px-4 font-bold uppercase tracking-wider text-purple-400 w-3/8">Unsupervised Clustering</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {comparisonData.map((row, idx) => (
                <tr 
                  key={idx} 
                  className={`hover:bg-slate-800/40 transition-colors ${row.highlight ? "bg-slate-900/30" : ""}`}
                >
                  <td className="py-3.5 px-4 font-bold text-slate-200 flex items-center space-x-2">
                    {row.highlight && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
                    <span>{row.aspect}</span>
                  </td>
                  <td className="py-3.5 px-4 text-emerald-300 font-sans font-medium">
                    {row.classification}
                  </td>
                  <td className="py-3.5 px-4 text-purple-300 font-sans font-medium">
                    {row.clustering}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Synergy in Modern SOC Operations */}
      <div className="soc-card p-6 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/20">
        <h3 className="text-base font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Operational Synergy: How Modern SOCs Combine Both Paradigms</span>
        </h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1 font-mono">Stage 1: Real-Time Triage</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Supervised Classification (Random Forest)</strong> runs at line-rate on the perimeter firewall. It instantly blocks 96.8% of known attack signatures (DDoS floods, brute-force sweeps, known C2).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1 font-mono">Stage 2: Threat Hunting</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Unsupervised Clustering (K-Means)</strong> clusters the traffic that passed inspection. Threat hunters examine outlier clusters to uncover stealthy zero-day exfiltration and evasive beaconing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1 font-mono">Stage 3: Continuous Retraining</span>
            <p className="text-xs text-slate-400 leading-relaxed">
              When human analysts confirm a newly discovered behavioral cluster is malicious, it is labeled and fed back into the supervised training pipeline, completing the AI intelligence feedback loop.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
