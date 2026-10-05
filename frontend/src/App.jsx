import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ClassificationPage from './pages/ClassificationPage';
import ClusteringPage from './pages/ClusteringPage';
import ComparisonPage from './pages/ComparisonPage';
import DatasetExplorer from './pages/DatasetExplorer';

import { 
  fetchHealth, 
  fetchStats, 
  fetchClassificationMetrics, 
  fetchClusteringMetrics,
  fetchPcaPoints 
} from './services/api';
import { Shield, AlertCircle } from 'lucide-react';

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
      </main>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-slate-800 bg-[#070A11] mt-12 py-5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300 font-mono tracking-wider">CYBERLENS</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">AI-Based Network Behavior Intelligence</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Supervised Classification vs. Unsupervised Clustering on 150,000 Flows
          </div>
        </div>
      </footer>
    </div>
  );
}
