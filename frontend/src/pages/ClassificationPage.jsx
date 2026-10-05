import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Award, 
  TrendingUp, 
  HelpCircle, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  BarChart2, 
  Activity,
  Zap
} from 'lucide-react';
import ConfusionMatrix from '../components/ConfusionMatrix';
import AttackSandbox from '../components/AttackSandbox';
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

export default function ClassificationPage({ metrics }) {
  const [activeCurveTab, setActiveCurveTab] = useState("roc"); // 'roc' or 'pr'

  const rf = metrics?.primary_model || {
    model_name: "Random Forest Classifier",
    accuracy: 0.9677,
    precision: 0.9619,
    recall: 0.9680,
    f1_score: 0.9650,
    roc_auc: 0.9635,
    training_time_sec: 10.9
  };

  const lr = metrics?.baseline_model || {
    model_name: "Logistic Regression (Baseline)",
    accuracy: 0.9627,
    f1_score: 0.9593,
    roc_auc: 0.9685
  };

  const rocData = metrics?.roc_curve || [];
  const prData = metrics?.pr_curve || [];
  const topFeatures = metrics?.top_features || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SUPERVISED MACHINE LEARNING</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
          Network Threat Classification
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-3xl">
          Supervised learning solves the fundamental security inquiry: <strong className="text-emerald-300 font-mono">"Is this network activity NORMAL or an ATTACK?"</strong> By learning decision boundaries from 120,000 ground-truth labeled training flows, the model predicts threats with high empirical precision.
        </p>

        {/* Model summary badges */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Accuracy</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{(rf.accuracy * 100).toFixed(2)}%</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Precision</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{(rf.precision * 100).toFixed(2)}%</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Recall (Sensitivity)</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{(rf.recall * 100).toFixed(2)}%</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">F1 Score</span>
            <span className="text-xl font-bold font-mono text-emerald-400">{(rf.f1_score * 100).toFixed(2)}%</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">ROC-AUC</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{rf.roc_auc.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Why Classification & Why Random Forest Deep-Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="soc-card p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Problem Statement & Why Classification?</span>
          </h3>
          <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              In contemporary Security Operations Centers (SOCs), millions of packets flow through firewalls every minute. Security analysts cannot inspect each session manually.
            </p>
            <p>
              <strong>Supervised Classification</strong> enables automated triage. Because historical traffic data contains confirmed incident logs with verified ground truth (<code className="text-emerald-400 font-mono">0 = Normal</code>, <code className="text-rose-400 font-mono">1 = Attack</code>), the algorithm maps statistical flow features directly into categorical verdicts.
            </p>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-slate-400">
              <strong className="text-white block mb-1">Supervised Learning Paradigm:</strong>
              Training Dataset D = {"{(x_i, y_i)}"} for i=1..N, where x_i ∈ ℝ³⁷ and y_i ∈ {"{0, 1}"}.
            </div>
          </div>
        </div>

        <div className="soc-card p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Why Random Forest Classifier?</span>
          </h3>
          <div className="mt-4 space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <ul className="space-y-2.5">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Handles Mixed Non-Linear Topology:</strong> Cyber threats rely on multi-variable conjunctions (e.g. high byte rate AND destination port 80). Decision trees naturally segment hierarchical decision spaces.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Robustness to Extreme Outliers:</strong> Packet rates span from 0.1 to 65,000 pkts/s. Tree splits are rank-invariant and immune to heavy-tailed scale distortions.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Ensemble Bagging:</strong> Combining 100 decorrelated trees with bootstrap aggregation mitigates individual tree overfitting and guarantees consistent test generalization.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confusion Matrix & ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <ConfusionMatrix matrix={metrics?.confusion_matrix} />

        {/* ROC / PR Curve Chart */}
        <div className="soc-card p-6 border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <h4 className="text-base font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>Model Diagnostic Curves</span>
              </h4>
              <p className="text-xs text-slate-400">
                Evaluation across all probability decision thresholds.
              </p>
            </div>

            <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-0.5 text-xs font-mono">
              <button
                onClick={() => setActiveCurveTab("roc")}
                className={`px-3 py-1 rounded transition-all ${activeCurveTab === "roc" ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
              >
                ROC (AUC: {rf.roc_auc.toFixed(4)})
              </button>
              <button
                onClick={() => setActiveCurveTab("pr")}
                className={`px-3 py-1 rounded transition-all ${activeCurveTab === "pr" ? "bg-cyan-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
              >
                Precision-Recall
              </button>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeCurveTab === "roc" ? (
                <LineChart data={rocData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <XAxis 
                    dataKey="fpr" 
                    stroke="#64748B" 
                    fontSize={11} 
                    tickLine={false}
                    label={{ value: 'False Positive Rate (FPR)', position: 'bottom', offset: 5, fill: '#94A3B8', fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="#64748B" 
                    fontSize={11} 
                    tickLine={false}
                    domain={[0, 1]}
                    label={{ value: 'True Positive Rate (Recall)', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }}
                  />
                  <Tooltip 
                    formatter={(val, name) => [val, name === "tpr" ? "True Positive Rate" : "FPR"]}
                    contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
                  />
                  <Line type="monotone" dataKey="tpr" stroke="#06B6D4" strokeWidth={2.5} dot={false} name="ROC" />
                </LineChart>
              ) : (
                <LineChart data={prData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <XAxis 
                    dataKey="recall" 
                    stroke="#64748B" 
                    fontSize={11} 
                    tickLine={false}
                    label={{ value: 'Recall', position: 'bottom', offset: 5, fill: '#94A3B8', fontSize: 11 }}
                  />
                  <YAxis 
                    stroke="#64748B" 
                    fontSize={11} 
                    tickLine={false}
                    domain={[0.8, 1.0]}
                    label={{ value: 'Precision', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }}
                  />
                  <Tooltip 
                    formatter={(val) => [val, "Precision"]}
                    contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
                  />
                  <Line type="monotone" dataKey="precision" stroke="#10B981" strokeWidth={2.5} dot={false} name="PR" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Feature Importance Bar Chart */}
      <div className="soc-card p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 mb-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              <span>Gini Feature Importance Ranking (Top 10 Features)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Mean decrease in tree node impurity across all 100 Random Forest estimators.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
            Derived from 120k Train Flows
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topFeatures.slice(0, 10)} layout="vertical" margin={{ top: 5, right: 30, left: 140, bottom: 5 }}>
              <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} domain={[0, 'dataMax + 0.05']} />
              <YAxis dataKey="feature" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip 
                formatter={(val) => [val.toFixed(4), "Importance"]}
                contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "8px", fontSize: "12px", fontFamily: "monospace" }}
              />
              <Bar dataKey="importance" fill="#8B5CF6" radius={[0, 4, 4, 0]}>
                {topFeatures.slice(0, 10).map((_, index) => (
                  <Cell key={`feat-${index}`} fill={index === 0 ? "#06B6D4" : index < 3 ? "#3B82F6" : "#8B5CF6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive Sandbox Section */}
      <AttackSandbox />
    </div>
  );
}
