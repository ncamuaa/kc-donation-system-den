import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

const DataContext = createContext(null);

const API_URL = 'http://localhost:5001';

const initialCampaigns = [
  { id: 1, title: 'School Supplies 2024', target: 250000, endDate: '2024-12-31', description: 'Providing essential school supplies to students in underserved communities across the Philippines.', status: 'Active' },
  { id: 2, title: 'Teacher Training Program', target: 300000, endDate: '2025-03-31', description: 'Supporting training for public school teachers in digital and blended learning.', status: 'Active' },
  { id: 3, title: 'Learning Kits for Kids', target: 500000, endDate: '2025-06-30', description: 'Delivering learning kits and educational content to remote communities.', status: 'Planned' },
];

const nextId = (items) =>
  items.reduce((max, item) => (item.id > max ? item.id : max), 0) + 1;

export function DataProvider({ children }) {
  const [donors, setDonors] = useState([]);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [donations, setDonations] = useState([]);

  // ─── AUTH STATE ───────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) ?? null; }
    catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') ?? null);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // ─── FETCH DONATIONS (only if logged in) ─────────────────────────────────
  useEffect(() => {
    if (!token || !user) {
      setDonations([]);
      return;
    }
    const fetchDonations = async () => {
      try {
        const endpoint = user.role === 'admin'
          ? `${API_URL}/api/donations`
          : `${API_URL}/api/donations/mine`;
        const res = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setDonations(await res.json());
      } catch (err) {
        console.error('Failed to fetch donations:', err);
      }
    };
    fetchDonations();
  }, [token, user]);

  const value = useMemo(() => {

    // ─── AUTH ───────────────────────────────────────────────────────────────

    const login = async (email, password) => {
      setAuthError('');
      setAuthLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/users/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) { setAuthError(data.message || 'Login failed'); return false; }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return true;
      } catch {
        setAuthError('Unable to connect to server. Please try again.');
        return false;
      } finally {
        setAuthLoading(false);
      }
    };

    const register = async (name, email, password) => {
      setAuthError('');
      setAuthLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setAuthError(data.message || data.errors?.[0]?.msg || 'Registration failed');
          return false;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return true;
      } catch {
        setAuthError('Unable to connect to server. Please try again.');
        return false;
      } finally {
        setAuthLoading(false);
      }
    };

    const logout = async () => {
      await fetch(`${API_URL}/api/users/logout`, { method: 'POST' }).catch(() => {});
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    };

    // ─── DONORS ─────────────────────────────────────────────────────────────

    const getDonorTotal = (name) =>
      donations.filter((d) => d.donor === name && typeof d.amount === 'number')
        .reduce((sum, d) => sum + d.amount, 0);

    const addDonor = (donor) =>
      setDonors((prev) => [{ ...donor, id: donor.id ?? nextId(prev) }, ...prev]);

    const updateDonor = (updated) =>
      setDonors((prev) => prev.map((d) => d.id === updated.id ? { ...d, ...updated } : d));

    const deleteDonor = (id) =>
      setDonors((prev) => prev.filter((d) => d.id !== id));

    // ─── CAMPAIGNS ──────────────────────────────────────────────────────────

    const getCampaignRaised = (title) =>
      donations.filter((d) => d.campaign === title && d.status === 'Completed' && typeof d.amount === 'number')
        .reduce((sum, d) => sum + d.amount, 0);

    const addCampaign = (campaign) =>
      setCampaigns((prev) => [{ ...campaign, id: campaign.id ?? nextId(prev) }, ...prev]);

    const updateCampaign = (updated) =>
      setCampaigns((prev) => prev.map((c) => c.id === updated.id ? { ...c, ...updated } : c));

    const deleteCampaign = (id) =>
      setCampaigns((prev) => prev.filter((c) => c.id !== id));

    // ─── DONATIONS ──────────────────────────────────────────────────────────

    const addDonation = async (donation) => {
      try {
        // send token if logged in, otherwise donate anonymously
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API_URL}/api/donations`, {
          method: 'POST',
          headers,
          body: JSON.stringify(donation),
        });
        const data = await res.json();
        if (res.ok) setDonations((prev) => [data, ...prev]);
        return res.ok ? data : null;
      } catch (err) {
        console.error('Add donation error:', err);
        return null;
      }
    };

    const updateDonation = async (updated) => {
      try {
        const res = await fetch(`${API_URL}/api/donations/${updated.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(updated),
        });
        const data = await res.json();
        if (res.ok) setDonations((prev) => prev.map((d) => (d.id === updated.id ? data : d)));
      } catch (err) {
        console.error('Update donation error:', err);
      }
    };

    const deleteDonation = async (id) => {
      try {
        const res = await fetch(`${API_URL}/api/donations/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setDonations((prev) => prev.filter((d) => d.id !== id));
      } catch (err) {
        console.error('Delete donation error:', err);
      }
    };

    return {
      // auth
      user,
      token,
      authError,
      authLoading,
      isAuthenticated: !!token,
      login,
      register,
      logout,
      // donors
      donors,
      getDonorTotal,
      addDonor,
      updateDonor,
      deleteDonor,
      // campaigns
      campaigns,
      getCampaignRaised,
      addCampaign,
      updateCampaign,
      deleteCampaign,
      // donations
      donations,
      addDonation,
      updateDonation,
      deleteDonation,
    };
  }, [user, token, authError, authLoading, donors, campaigns, donations]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
}