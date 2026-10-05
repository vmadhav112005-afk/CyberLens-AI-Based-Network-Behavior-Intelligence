import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ClassificationPage from './pages/ClassificationPage';
import ClusteringPage from './pages/ClusteringPage';
import ComparisonPage from './pages/ComparisonPage';
import DatasetExplorer from './pages/DatasetExplorer';
import ModelInsightsPage from './pages/ModelInsightsPage';
import VivaGuidePage from './pages/VivaGuidePage';
import AcademicReportPage from './pages/AcademicReportPage';

import { 
  fetchHealth, 
  fetchStats, 
  fetchClassificationMetrics, 
  fetchClusteringMetrics,
  fetchPcaPoints 
} from './services/api';
import { Shield, ExternalLink, Terminal, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendOnline, setBackendOnline] = useState(false);
  const [stats, setStats] = useState(null);
  const [classificationMetrics, setClassificationMetrics] = useState(null);
  const [clusteringMetrics, setClusteringMetrics] = useState(null);
  const [pcaData, setPcaData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const health = await fetchHealth();
        setBackendOnline(health.status === 'healthy');

        const [s, cls, clu, pca] = await Promise.all([
          fetchStats(),
          fetchClassificationMetrics(),
          fetchClusteringMetrics(),
          fetchPcaPoints()
        ]);

        setStats(s);
        setClassificationMetrics(cls);
        setClusteringMetrics(clu);
        setPcaData(pca);
      } catch (err) {
        console.warn("Backend not yet connected:", err);
        setBackendOnline(false);
      } finally {
        setLoading(false);
      }
    }

    init();
    const interval = setInterval(init, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        backendStatus={backendOnline} 
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!backendOnline && (
          <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>FastAPI Backend Offline:</strong> Start the Python API server on <code>localhost:8000</code> to enable live model inference and dataset queries.
              </span>
            </div>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-amber-900/60 border border-amber-700">
              Run: uvicorn backend.main:app
            </span>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <Dashboard stats={stats} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'classification' && (
          <ClassificationPage metrics={classificationMetrics} />
        )}

        {activeTab === 'clustering' && (
          <ClusteringPage clusteringData={clusteringMetrics} pcaData={pcaData} />
        )}

        {activeTab === 'comparison' && (
          <ComparisonPage />
        )}

        {activeTab === 'dataset' && (
          <DatasetExplorer />
        )}

        {activeTab === 'insights' && (
          <ModelInsightsPage />
        )}

        {activeTab === 'viva' && (
          <VivaGuidePage />
        )}

        {activeTab === 'report' && (
          <AcademicReportPage />
        )}
      </main>

      {/* Modern SOC Footer */}
      <footer className="border-t border-slate-800 bg-[#070A11] mt-12 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="font-bold text-white font-mono tracking-wider">CYBERLENS</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">AI-Based Network Behavior Intelligence</span>
            </div>

            <div className="flex items-center space-x-4 font-mono text-[11px]">
              <span className="text-slate-400">Random Forest: <strong className="text-emerald-400">96.77% Acc</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">K-Means: <strong className="text-purple-400">K=5 Clusters</strong></span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Dataset: <strong className="text-cyan-400">150,000 Flows</strong></span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/60 text-center sm:text-left text-[11px] text-slate-400 leading-relaxed font-sans">
            "This project is an educational cybersecurity analytics system using synthetic network traffic. It is intended for learning, experimentation, and demonstration of machine-learning concepts. It should not be treated as a production intrusion detection system."
          </div>
        </div>
      </footer>
    </div>
  );
}
