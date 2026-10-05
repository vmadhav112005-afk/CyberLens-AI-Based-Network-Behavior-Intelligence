import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  ShieldAlert, 
  Layers, 
  Database, 
  ExternalLink, 
  AlertTriangle,
  Award,
  Terminal,
  Cpu
} from 'lucide-react';

export default function AcademicReportPage() {
  const sections = [
    {
      num: "1",
      title: "Problem Statement",
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Modern enterprise computer networks generate billions of raw telemetry flows daily. Security Operations Centers (SOCs) face two distinct operational challenges:
          </p>
          <ol className="list-decimal list-inside space-y-1 pl-2 text-slate-200">
            <li><strong>Automated Threat Triage:</strong> Rapidly and accurately deciding whether an incoming network flow is <em>Normal (0)</em> or a malicious <em>Attack (1)</em> based on historical incident signatures.</li>
            <li><strong>Zero-Day Behavior Discovery:</strong> Discovering hidden, emerging, or unlabeled communication patterns and latent behavioral anomalies without relying on prior knowledge or pre-existing attack signatures.</li>
          </ol>
          <p>
            This project investigates the scientific contrast between <strong>Supervised Classification</strong> (Random Forest) and <strong>Unsupervised Clustering</strong> (K-Means) evaluated across the <em>exact same network-security dataset</em> to provide a rigorous, viva-defensible comparison.
          </p>
        </div>
      )
    },
    {
      num: "2",
      title: "Dataset Description & Methodology",
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            The project utilizes a comprehensive, reproducible cybersecurity dataset containing <strong>150,000 network flows</strong> across <strong>42 telemetry features</strong> (37 standardized continuous variables).
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-slate-200">
            <li><strong>Normal Traffic:</strong> 81,000 flows (54.0%) representing benign web, DNS, and file transfer operations.</li>
            <li><strong>Malicious Traffic:</strong> 69,000 flows (46.0%) spanning 6 attack categories: DDoS (14%), Port Scan (9%), Brute Force (8%), Web Attack (5%), Data Exfiltration (5%), and Botnet (5%).</li>
            <li><strong>Controlled Overlap:</strong> ~3.5% feature ambiguity injected to mimic real-world network noise (such as administrative port scans and evasive stealth attacks), ensuring realistic, non-trivial ML metrics (~96.8% accuracy).</li>
          </ul>
        </div>
      )
    },
    {
      num: "3",
      title: "Models Employed",
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-emerald-400 block font-mono">1. Supervised Classification:</strong>
              <span>Random Forest Classifier (100 ensemble estimators, max depth 18) with Logistic Regression as a linear benchmark. Target: <code>is_attack</code>.</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <strong className="text-purple-400 block font-mono">2. Unsupervised Clustering:</strong>
              <span>K-Means Clustering with Euclidean distance minimization and K=2..7 Silhouette analysis. Target labels strictly eliminated prior to fitting.</span>
            </div>
          </div>
        </div>
      )
    },
    {
      num: "4",
      title: "Why These Models?",
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>Random Forest:</strong> Outperforms single decision trees and linear models on cybersecurity tabular data due to its ability to model non-linear conjunctions (e.g. high byte rate AND specific destination ports) without being degraded by extreme numerical outliers.
          </p>
          <p>
            <strong>K-Means:</strong> Provides linear computational complexity O(K·N·D), completing in seconds across 150k flows. Its centroid vectors provide actionable, human-interpretable operational profiles for firewall policy mapping.
          </p>
        </div>
      )
    },
    {
      num: "5",
      title: "Implementation & Pipeline Architecture",
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
          <p>
            Full-stack decoupled architecture adhering to production engineering standards:
          </p>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs">
            CyberLens Architecture:<br/>
            ├── ML Engine: Python, Scikit-Learn, Pandas, NumPy, Joblib<br/>
            ├── REST API: FastAPI, Uvicorn, Pydantic, CORS Middleware (Port 8000)<br/>
            ├── Frontend: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts (Port 5173)<br/>
            └── Zero-Leakage: Scalers fit strictly on training fold (80/20 stratified split)
          </div>
        </div>
      )
    },
    {
      num: "6",
      title: "Empirical Results",
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-slate-800">
              <thead className="bg-slate-900 text-slate-300">
                <tr>
                  <th className="p-2 border-b border-slate-800">Model</th>
                  <th className="p-2 border-b border-slate-800">Accuracy / Score</th>
                  <th className="p-2 border-b border-slate-800">Precision</th>
                  <th className="p-2 border-b border-slate-800">Recall</th>
                  <th className="p-2 border-b border-slate-800">F1 Score</th>
                  <th className="p-2 border-b border-slate-800">ROC-AUC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                <tr>
                  <td className="p-2 font-bold text-emerald-400">Random Forest</td>
                  <td className="p-2 font-bold text-white">96.77%</td>
                  <td className="p-2 text-slate-300">96.19%</td>
                  <td className="p-2 text-slate-300">96.80%</td>
                  <td className="p-2 font-bold text-emerald-400">96.50%</td>
                  <td className="p-2 text-cyan-400">0.9635</td>
                </tr>
                <tr>
                  <td className="p-2 text-slate-400">Logistic Regression</td>
                  <td className="p-2 text-slate-300">96.27%</td>
                  <td className="p-2 text-slate-300">95.68%</td>
                  <td className="p-2 text-slate-300">96.18%</td>
                  <td className="p-2 text-slate-300">95.93%</td>
                  <td className="p-2 text-slate-300">0.9685</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-purple-400">K-Means (K=5)</td>
                  <td className="p-2 text-purple-300">Silhouette: 0.3722</td>
                  <td className="p-2 text-slate-400" colSpan={4}>Discovered 5 Archetypes (Flooding, Scanning, BruteForce, Exfil, Benign)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      num: "7",
      title: "Inference & Scientific Analysis",
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>Classification Inference:</strong> When supplied with known attack signatures, Random Forest reliably isolates threats with 96.19% precision, creating minimal false alarms. However, it cannot categorize threats beyond binary classes unless trained on multi-class targets.
          </p>
          <p>
            <strong>Clustering Inference:</strong> K-Means autonomously isolated 100% of high-volume DDoS sessions into Cluster 1 and port reconnaissance sweeps into Cluster 2 with zero prior knowledge of attack labels. This proves that network telemetry contains rich latent topological structure that reflects underlying operational behavior.
          </p>
        </div>
      )
    },
    {
      num: "8",
      title: "Classification vs Clustering Comparison",
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Supervised Classification and Unsupervised Clustering should not be viewed as competitors, but rather as complementary layers of a defense-in-depth security strategy. Classification acts as the fast perimeter filter for known attack signatures, while Clustering acts as the exploratory engine that discovers zero-day behavioral anomalies for human threat hunters.
          </p>
        </div>
      )
    },
    {
      num: "9",
      title: "Implementation URLs & Project Artifacts",
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-mono">
          <ul className="space-y-1 text-slate-300">
            <li>• <strong>API Base URL:</strong> <code>http://localhost:8000/api</code></li>
            <li>• <strong>API Interactive Docs (Swagger):</strong> <code>http://localhost:8000/docs</code></li>
            <li>• <strong>Frontend Dashboard URL:</strong> <code>http://localhost:5173</code></li>
            <li>• <strong>Code Repository:</strong> CyberLens Root Workspace</li>
            <li>• <strong>Generated Full Dataset:</strong> <code>data/network_traffic_dataset.csv (150,000 rows, 31 MB)</code></li>
          </ul>
        </div>
      )
    },
    {
      num: "10",
      title: "Conclusion",
      content: (
        <div className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            CyberLens successfully proves that both Supervised and Unsupervised machine learning provide unique, scientifically rigorous insights on network telemetry. Random Forest delivers high-precision detection (96.77% accuracy) when ground-truth labels are available, while K-Means reveals the natural topological organization of network traffic (5 distinct behavioral clusters, Silhouette 0.3722) when operating in zero-label mode.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono mb-3">
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>BDE ACADEMIC ASSIGNMENT & MINI-PROJECT DOCUMENT</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
          Formal Project Report
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2">
          Prepared in accordance with formal college Big Data Engineering (BDE) and Machine Learning project evaluation guidelines.
        </p>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {sections.map((sec) => (
          <div key={sec.num} className="soc-card p-6 border border-slate-800">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2.5 pb-3 border-b border-slate-800 mb-3 font-mono">
              <span className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-300 flex items-center justify-center text-xs">
                {sec.num}
              </span>
              <span>{sec.title}</span>
            </h3>
            {sec.content}
          </div>
        ))}
      </div>

      {/* Explicit Security & Educational Disclaimer */}
      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs leading-relaxed font-sans">
        <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold text-xs uppercase mb-1.5">
          <AlertTriangle className="w-4 h-4" />
          <span>Official Educational & Security Disclaimer</span>
        </div>
        <p>
          "This project is an educational cybersecurity analytics system using synthetic network traffic. It is intended for learning, experimentation, and demonstration of machine-learning concepts. It should not be treated as a production intrusion detection system."
        </p>
      </div>
    </div>
  );
}
