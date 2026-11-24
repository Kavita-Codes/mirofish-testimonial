// API Client for ViralScope AI Backend
const API_BASE = '/api';

export const api = {
  // Stats & Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  },

  // Campaigns
  async getCampaigns() {
    const res = await fetch(`${API_BASE}/campaigns`);
    return res.json();
  },
  async createCampaign(data) {
    const res = await fetch(`${API_BASE}/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async getCampaign(id) {
    const res = await fetch(`${API_BASE}/campaigns/${id}`);
    return res.json();
  },
  async deleteCampaign(id) {
    const res = await fetch(`${API_BASE}/campaigns/${id}`, {
      method: 'DELETE',
    });
    return res.json();
  },

  // Reels
  async addReel(campaignId, formData) {
    const res = await fetch(`${API_BASE}/campaigns/${campaignId}/reels`, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },

  // Pipeline
  async analyzeCampaign(campaignId) {
    const res = await fetch(`${API_BASE}/campaigns/${campaignId}/analyze`, {
      method: 'POST',
    });
    return res.json();
  },
  async recalculateScorecard(campaignId, weights) {
    const res = await fetch(`${API_BASE}/campaigns/${campaignId}/scorecard/recalculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weights }),
    });
    return res.json();
  },
  async getRankings(campaignId) {
    const res = await fetch(`${API_BASE}/campaigns/${campaignId}/ranking`);
    return res.json();
  },

  // Seed Campaign
  async seedTestCampaign() {
    const res = await fetch(`${API_BASE}/seed-campaign`, {
      method: 'POST',
    });
    return res.json();
  },

  // Reports
  getMarkdownReportUrl(campaignId) {
    return `${API_BASE}/campaigns/${campaignId}/report/markdown`;
  },
  getPdfReportUrl(campaignId) {
    return `${API_BASE}/campaigns/${campaignId}/report/pdf`;
  },
};
