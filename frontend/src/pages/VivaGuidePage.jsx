import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function VivaGuidePage() {
  const [openIdx, setOpenIdx] = useState(0);

  const vivaQuestions = [
    {
      q: "Q1. What is classification?",
      a: "Classification is a supervised machine learning task where an algorithm learns from labeled training examples to predict which discrete category or class (e.g. Normal vs Attack) new, unseen input data belongs to."
    },
    {
      q: "Q2. What is clustering?",
      a: "Clustering is an unsupervised machine learning technique that groups unlabeled data points together based on their inherent statistical similarities and spatial distance in high-dimensional feature space without using any pre-assigned target labels."
    },
    {
      q: "Q3. Why is classification considered supervised learning?",
      a: "Because it requires a 'teacher' signal during training in the form of ground-truth target labels (y). The algorithm iteratively compares its predictions against these true labels and updates its internal parameters to minimize classification error."
    },
    {
      q: "Q4. Why is clustering considered unsupervised learning?",
      a: "Because it receives zero target labels during model training. There is no teacher signal or error correction; the algorithm independently discovers natural topological clusters and geometric structures purely from input feature vectors (X)."
    },
    {
      q: "Q5. Why did you choose Random Forest for threat classification?",
      a: "Random Forest handles mixed continuous and categorical network telemetry effectively, captures complex non-linear feature interactions without feature scaling distortion, is robust against heavy outliers, and provides interpretable feature importances."
    },
    {
      q: "Q6. Why did you choose K-Means for network behavior clustering?",
      a: "K-Means scales linearly (O(K·N·D)), allowing rapid clustering of 150,000+ flows. Its centroid vectors provide concrete, interpretable operational fingerprints (e.g., mean packet count, port count) that can be translated directly into firewall rules."
    },
    {
      q: "Q7. Why can't you use 'attack_type' or 'is_attack' during clustering?",
      a: "Including target labels during clustering would constitute severe data leakage and defeat the fundamental premise of unsupervised learning. The goal of clustering is to test whether behavioral patterns emerge autonomously from network telemetry alone."
    },
    {
      q: "Q8. What is the Silhouette Score and what does it measure?",
      a: "The Silhouette Score (ranging from -1 to +1) measures cluster cohesion (how close a point is to points in its own cluster) versus cluster separation (how distant it is from points in the nearest neighboring cluster). Scores above 0.35 indicate meaningful geometric clustering."
    },
    {
      q: "Q9. What is overfitting, and how did you prevent it?",
      a: "Overfitting occurs when a model memorizes idiosyncrasies or noise in the training set rather than learning generalizable patterns. We prevented it using an 80/20 holdout test split, limiting tree depth, requiring minimum leaf samples, and bagging 100 decorrelated trees."
    },
    {
      q: "Q10. What is the fundamental difference between prediction and pattern discovery?",
      a: "Prediction asks: 'Which known class does this flow belong to?' (Supervised). Pattern discovery asks: 'What natural groupings and behavioral archetypes exist across the data?' (Unsupervised, enabling detection of novel and zero-day anomalies)."
    },
    {
      q: "Q11. Why did you evaluate K from 2 to 7, and why was K=5 chosen?",
      a: "We calculated the Silhouette Score across K=2 through 7. While K=2 and K=3 yielded coarse geometric clusters, K=5 achieved the optimal balance of cohesion (0.3722) and domain interpretability, cleanly isolating Flooding, Scanning, Brute Force, Exfiltration, and Benign Baseline."
    },
    {
      q: "Q12. What does a False Positive mean in cybersecurity ML?",
      a: "A False Positive occurs when benign, legitimate network activity (such as an automated backup or internal network vulnerability scan) is mistakenly classified as a malicious attack, causing operational disruption and alert fatigue for SOC analysts."
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-mono mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>VIVA VOCE & ORAL DEFENSE PREPARATION</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
          CyberLens Viva Defense Guide
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl mx-auto">
          Comprehensive, crisp, high-scoring answers to the most common academic and technical viva examination questions on Supervised vs Unsupervised ML.
        </p>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3">
        {vivaQuestions.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`soc-card border transition-all duration-200 overflow-hidden ${
                isOpen ? "border-cyan-500/50 bg-slate-900/90" : "border-slate-800 hover:border-slate-700 bg-slate-900/50"
              }`}
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between space-x-3"
              >
                <div className="flex items-center space-x-3">
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                    isOpen ? "bg-cyan-500 text-black" : "bg-slate-800 text-slate-300"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-bold text-sm sm:text-base text-white">
                    {item.q}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 font-sans">
                  <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-200">
                    {item.a}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
