import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CampaignDetail from './components/CampaignDetail';
import NewCampaignModal from './components/NewCampaignModal';
import Footer from './components/Footer';
import { api } from './api';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'dashboard' | 'campaign'
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadInitialData = async () => {
    try {
      const [statsData, campsData] = await Promise.all([
        api.getStats().catch(() => ({})),
        api.getCampaigns().catch(() => [])
      ]);
      setStats(statsData);
      setCampaigns(campsData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadCampaign = async (id) => {
    try {
      const data = await api.getCampaign(id);
      setCampaign(data);
      setSelectedCampaignId(id);
      setActiveView('campaign');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      showToast('Failed to load campaign: ' + e.message, 'error');
    }
  };

  const handleSeedCampaign = async () => {
    setIsSeeding(true);
    try {
      const res = await api.seedTestCampaign();
      showToast('10-Reel Test Campaign loaded and analysed successfully!');
      await loadInitialData();
      if (res.campaign?.id) {
        await loadCampaign(res.campaign.id);
      } else {
        setActiveView('dashboard');
      }
    } catch (e) {
      showToast('Failed to seed campaign: ' + e.message, 'error');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleCampaignCreated = async (id) => {
    setShowNewCampaignModal(false);
    showToast('Campaign created! Upload your draft Reels now.');
    await loadInitialData();
    await loadCampaign(id);
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      await api.deleteCampaign(id);
      showToast('Campaign deleted.');
      await loadInitialData();
      if (selectedCampaignId === id) {
        setActiveView('dashboard');
        setSelectedCampaignId(null);
      }
    } catch (e) {
      showToast('Failed to delete campaign: ' + e.message, 'error');
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedCampaignId) return;
    setIsAnalyzing(true);
    try {
      await api.analyzeCampaign(selectedCampaignId);
      showToast('Analysis & MiroFish audience simulation completed!');
      await loadCampaign(selectedCampaignId);
      await loadInitialData();
    } catch (e) {
      showToast('Analysis failed: ' + e.message, 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRecalculateWeights = async (weights) => {
    if (!selectedCampaignId) return;
    await api.recalculateScorecard(selectedCampaignId, weights);
    showToast('Scorecard recalculated with custom weights!');
    await loadCampaign(selectedCampaignId);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-slate-200 shadow-xl text-xs font-semibold animate-slide-up">
          {toast.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          )}
          <span className="text-slate-800">{toast.message}</span>
        </div>
      )}

      {/* Navbar with full routing */}
      <Navbar
        onOpenNewCampaign={() => setShowNewCampaignModal(true)}
        onSeedCampaign={handleSeedCampaign}
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          if (v === 'dashboard') loadInitialData();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isSeeding={isSeeding}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-24 text-slate-500 text-sm">
            Connecting to ViralScope AI & MiroFish Swarm...
          </div>
        ) : activeView === 'landing' ? (
          <LandingPage
            onOpenDashboard={() => {
              setActiveView('dashboard');
              loadInitialData();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSeedCampaign={handleSeedCampaign}
            isSeeding={isSeeding}
          />
        ) : activeView === 'dashboard' ? (
          <Dashboard
            stats={stats}
            campaigns={campaigns}
            onSelectCampaign={loadCampaign}
            onOpenNewCampaign={() => setShowNewCampaignModal(true)}
            onSeedCampaign={handleSeedCampaign}
            onDeleteCampaign={handleDeleteCampaign}
            isSeeding={isSeeding}
          />
        ) : campaign ? (
          <CampaignDetail
            campaign={campaign}
            onBack={() => {
              setActiveView('dashboard');
              loadInitialData();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAnalyze={handleRunAnalysis}
            onRecalculateWeights={handleRecalculateWeights}
            onRefreshCampaign={() => loadCampaign(selectedCampaignId)}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          <div className="text-center py-12 text-slate-500">Campaign not found.</div>
        )}
      </main>

      {/* Professional SaaS Footer */}
      <Footer 
        onNavigate={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />

      {/* New Campaign Modal */}
      {showNewCampaignModal && (
        <NewCampaignModal
          onCampaignCreated={handleCampaignCreated}
          onSeedInstead={() => {
            setShowNewCampaignModal(false);
            handleSeedCampaign();
          }}
          onClose={() => setShowNewCampaignModal(false)}
        />
      )}
    </div>
  );
}
