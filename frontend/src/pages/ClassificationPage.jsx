import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  BarChart2, 
  CheckCircle2,
  Sliders,
  Zap,
  Target
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

  const rocData = metrics?.roc_curve || [];
  const prData = metrics?.pr_curve || [];
  const topFeatures = metrics?.top_features || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner (Concept 3 Style) */}
      <div className="rounded-2xl p-6 sm:p-7 bg-[#111827] border border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SUPERVISED THREAT DETECTION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Threat Classification Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            100-tree Random Forest ensemble evaluated on 30,000 holdout flows to classify traffic as Normal (0) or Attack (1).
          </p>
        </div>

        {/* 5 Sleek Metric Badges */}
        <div className="flex flex-wrap items-center gap-2 font-mono">
          <div className="px-3 py-2 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">Accuracy</span>
            <span className="text-base font-bold text-emerald-400">{(rf.accuracy * 100).toFixed(2)}%</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">Precision</span>
            <span className="text-base font-bold text-white">{(rf.precision * 100).toFixed(2)}%</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">Recall</span>
            <span className="text-base font-bold text-white">{(rf.recall * 100).toFixed(2)}%</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">F1 Score</span>
            <span className="text-base font-bold text-white">{(rf.f1_score * 100).toFixed(2)}%</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-[#0D1322] border border-[#1E293B]">
            <span className="text-[10px] text-slate-400 uppercase block">ROC-AUC</span>
            <span className="text-base font-bold text-sky-400">{rf.roc_auc.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Confusion Matrix & ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix */}
        <ConfusionMatrix matrix={metrics?.confusion_matrix} />

        {/* ROC / PR Curve Chart */}
        <div className="soc-card p-6 border border-[#1E293B]">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B] mb-4">
            <div>
              <h4 className="text-base font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-sky-400" />
                <span>Model Diagnostic Curves</span>
              </h4>
              <p className="text-xs text-slate-400">
                Evaluation across all probability decision thresholds
              </p>
            </div>

            <div className="flex rounded-lg bg-[#0D1322] border border-[#1E293B] p-0.5 text-xs font-mono">
              <button
                onClick={() => setActiveCurveTab("roc")}
                className={`px-3 py-1 rounded transition-all ${activeCurveTab === "roc" ? "bg-sky-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
              >
                ROC (AUC: {rf.roc_auc.toFixed(4)})
              </button>
              <button
                onClick={() => setActiveCurveTab("pr")}
                className={`px-3 py-1 rounded transition-all ${activeCurveTab === "pr" ? "bg-sky-600 text-white font-bold" : "text-slate-400 hover:text-white"}`}
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
                  <Line type="monotone" dataKey="tpr" stroke="#38BDF8" strokeWidth={2.5} dot={false} name="ROC" />
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
      <div className="soc-card p-6 border border-[#1E293B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E293B] mb-4">
          <div>
            <h4 className="text-base font-bold text-white flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-indigo-400" />
              <span>Gini Feature Importance Ranking (Top 10 Features)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Mean decrease in tree node impurity across all 100 Random Forest estimators
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
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
              <Bar dataKey="importance" fill="#6366F1" radius={[0, 4, 4, 0]}>
                {topFeatures.slice(0, 10).map((_, index) => (
                  <Cell key={`feat-${index}`} fill={index === 0 ? "#38BDF8" : index < 3 ? "#6366F1" : "#A855F7"} />
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
