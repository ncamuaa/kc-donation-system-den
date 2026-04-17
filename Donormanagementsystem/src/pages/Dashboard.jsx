import React, { useMemo, useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  ArrowUpRight, Users, Activity, Clock, ChevronRight, CheckCircle, Send, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#f97316', '#06b6d4'];

const normalizeStatus = (s) => {
  const v = String(s || '').trim().toLowerCase();
  if (v === 'done' || v === 'complete' || v === 'completed') return 'Completed';
  if (v === 'inactive') return 'Inactive';
  if (v === 'active') return 'Active';
  return s || 'Active';
};

const parseDateSafe = (val) => {
  if (!val) return null;
  const d = new Date(val);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatDate = (val) => {
  if (!val) return '-';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return String(val).slice(0, 10);
  return d.toISOString().split('T')[0];
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function Dashboard() {
  const { donors } = useData();
  const navigate = useNavigate();
  const { user } = useAuth();

  // ── Due date notification state ───────────────────────────────────────────
  const [dueNotif, setDueNotif] = useState({ open: false, donors: [] });

  // ── Due date notification effect ──────────────────────────────────────────
  useEffect(() => {
    if (!donors || donors.length === 0) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dueSoon = donors.filter((d) => {
      if (!d.dueDate) return false;
      const due = new Date(d.dueDate);
      due.setHours(0, 0, 0, 0);
      return (
        due.getTime() <= tomorrow.getTime() &&
        normalizeStatus(d.status) !== 'Completed'
      );
    });

    if (dueSoon.length === 0) return;

    const notifKey = `due-notif-${today.toISOString().split('T')[0]}`;
    if (sessionStorage.getItem(notifKey)) return;
    sessionStorage.setItem(notifKey, '1');

    setTimeout(() => setDueNotif({ open: true, donors: dueSoon }), 800);
  }, [donors]);

  // ── Due notif email handler ───────────────────────────────────────────────
  const handleDueNotifEmail = () => {
    const lines = dueNotif.donors.map((d) =>
      `• ${d.sponsor} — ${d.project} | Due: ${formatDate(d.dueDate)} | Amount: PHP ${Number(d.amount || 0).toLocaleString()}`
    ).join('\n');
    const subject = encodeURIComponent(`⚠️ ${dueNotif.donors.length} Sponsorship Record(s) Due Soon`);
    const body = encodeURIComponent(
      `Good day,\n\nThe following sponsorship records are due today or tomorrow:\n\n${lines}\n\nPlease take the necessary action.\n\n— Knowledge Channel Foundation System`
    );
    window.open(`mailto:${user?.email || ''}?subject=${subject}&body=${body}`, '_blank');
    setDueNotif({ open: false, donors: [] });
  };

  // ── Current year filter ────────────────────────────────────────────────────
  const currentYear = new Date().getFullYear();

  const currentYearDonors = useMemo(
    () => donors.filter((d) => {
      const dt = parseDateSafe(d.deliveryDate);
      return dt && dt.getFullYear() === currentYear;
    }),
    [donors, currentYear]
  );

  // ── Stats (current year only) ──────────────────────────────────────────────
  const totalAmount = useMemo(
    () => currentYearDonors.reduce((sum, d) => sum + Number(d.amount || 0), 0),
    [currentYearDonors]
  );

  const activeCount = useMemo(
    () => currentYearDonors.filter((d) => normalizeStatus(d.status) === 'Active').length,
    [currentYearDonors]
  );

  const completedCount = useMemo(
    () => currentYearDonors.filter((d) => normalizeStatus(d.status) === 'Completed').length,
    [currentYearDonors]
  );

  const inactiveCount = useMemo(
    () => currentYearDonors.filter((d) => normalizeStatus(d.status) === 'Inactive').length,
    [currentYearDonors]
  );

  const stats = [
    {
      title: 'Total Sponsorship Amount',
      value: `₱${totalAmount.toLocaleString()}`,
      change: `${currentYearDonors.length} records in ${currentYear}`,
      icon: () => <span className="text-lg font-bold leading-none">₱</span>,
      color: 'bg-green-50 text-green-600',
      border: 'border-l-4 border-l-green-500',
    },
    {
      title: 'Active Sponsorships',
      value: activeCount.toString(),
      change: 'currently ongoing',
      icon: Activity,
      color: 'bg-blue-50 text-blue-600',
      border: 'border-l-4 border-l-blue-500',
    },
    {
      title: 'Inactive Sponsorships',
      value: inactiveCount.toString(),
      change: 'not currently active',
      icon: Users,
      color: 'bg-amber-50 text-amber-600',
      border: 'border-l-4 border-l-amber-500',
    },
    {
      title: 'Completed Sponsorships',
      value: completedCount.toString(),
      change: 'fully delivered',
      icon: CheckCircle,
      color: 'bg-purple-50 text-purple-600',
      border: 'border-l-4 border-l-purple-500',
    },
  ];

  // ── Monthly trend by deliveryDate (current year only) ─────────────────────
  const monthlyTrendData = useMemo(() =>
    MONTHS.map((name, i) => ({
      name,
      amount: currentYearDonors
        .filter((d) => { const dt = parseDateSafe(d.deliveryDate); return dt && dt.getMonth() === i; })
        .reduce((sum, d) => sum + Number(d.amount || 0), 0),
    })),
    [currentYearDonors]
  );

  // ── Amount by program (current year only) ─────────────────────────────────
  const byProgramData = useMemo(() => {
    const map = new Map();
    currentYearDonors.forEach((d) => {
      const key = d.project || 'Unknown';
      map.set(key, (map.get(key) || 0) + Number(d.amount || 0));
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, amount]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '…' : name,
        amount,
      }));
  }, [currentYearDonors]);

  // ── By sponsor type / source of funds (current year only) ─────────────────
  const byTypeData = useMemo(() => {
    const map = new Map();
    currentYearDonors.forEach((d) => {
      const t = d.type || 'Unknown';
      map.set(t, (map.get(t) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [currentYearDonors]);

  // ── By status breakdown (current year only) ───────────────────────────────
  const byStatusData = useMemo(() => {
    const map = new Map();
    currentYearDonors.forEach((d) => {
      const s = normalizeStatus(d.status);
      map.set(s, (map.get(s) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [currentYearDonors]);

  // ── Recent records (current year only) ────────────────────────────────────
  const recentRecords = useMemo(() =>
    [...currentYearDonors]
      .sort((a, b) => {
        const da = parseDateSafe(a.deliveryDate)?.getTime() || 0;
        const db = parseDateSafe(b.deliveryDate)?.getTime() || 0;
        return db - da;
      })
      .slice(0, 6),
    [currentYearDonors]
  );

  return (
    <div className="space-y-6 px-1">

      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">{currentYear} sponsorship records at a glance.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm whitespace-nowrap">
          <Clock className="h-4 w-4 shrink-0" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.title} className={`overflow-hidden ${item.border}`}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">
                    {item.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1.5 truncate">{item.value}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 mt-1">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {item.change}
                  </span>
                </div>
                <div className={`p-2.5 rounded-xl ${item.color} shrink-0 ml-3`}>
                  <item.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Monthly Sponsorship Trend */}
        <Card>
          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-base font-semibold text-gray-800">
              Sponsorship Amount by Month (Payment Date)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-5">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrendData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} dy={8} />
                  <YAxis
                    axisLine={false} tickLine={false}
                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                    tickFormatter={(v) => `₱${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`}
                    width={52}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(v) => [`₱${Number(v).toLocaleString()}`, 'Amount']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAmt)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Amount by Program */}
        <Card>
          <CardHeader className="pb-2 pt-5 px-6">
            <CardTitle className="text-base font-semibold text-gray-800">
              Top Programs by Sponsorship Amount
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-5">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byProgramData} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name" type="category" axisLine={false} tickLine={false}
                    tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} width={90}
                  />
                  <Tooltip
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(v) => [`₱${Number(v).toLocaleString()}`, 'Amount']}
                  />
                  <Bar dataKey="amount" fill="#10b981" radius={[0, 6, 6, 0]} barSize={22} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* By Sponsor Type */}
        <Card className="flex flex-col">
          <CardHeader className="pt-5 pb-2 px-6">
            <CardTitle className="text-base font-semibold text-gray-800">By Source of Funds</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-5 flex-1 flex flex-col">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={byTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value">
                    {byTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-2">
              {byTypeData.map((entry, i) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-600 truncate">{entry.name}</span>
                  </div>
                  <span className="font-semibold text-gray-900 ml-2">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* By Status */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader className="pt-5 pb-2 px-6">
            <CardTitle className="text-base font-semibold text-gray-800">Sponsorship Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-5 flex-1">
            <div className="grid grid-cols-3 gap-3 mb-5">
              {byStatusData.map((s, i) => (
                <div key={s.name} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center gap-1">
                  <div className="w-2 h-2 rounded-full mb-1"
                    style={{ backgroundColor: s.name === 'Active' ? '#3b82f6' : s.name === 'Completed' ? '#22c55e' : '#9ca3af' }} />
                  <div className="text-xs font-medium text-gray-500">{s.name}</div>
                  <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wide">records</div>
                </div>
              ))}
            </div>
            {/* Mini bar chart */}
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byStatusData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={48}>
                    {byStatusData.map((s, i) => (
                      <Cell key={i} fill={s.name === 'Active' ? '#3b82f6' : s.name === 'Completed' ? '#22c55e' : '#9ca3af'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Records Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pt-5 pb-3 px-6">
          <CardTitle className="text-base font-semibold text-gray-800">Recent Sponsorship Records</CardTitle>
          <button
            onClick={() => navigate('/donors')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-0.5 shrink-0"
          >
            View all <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </CardHeader>
        <CardContent className="px-6 pb-5">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                {['Sponsor', 'Program', 'Type', 'Amount', 'Payment Date', 'Due Date', 'Status'].map((h) => (
                  <th key={h} className="pb-2.5 pr-4 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentRecords.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-sm text-gray-900 truncate max-w-[140px]">{r.sponsor || '—'}</div>
                    {r.email && <div className="text-xs text-gray-400 truncate max-w-[140px]">{r.email}</div>}
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-600 truncate max-w-[120px]">{r.project || '—'}</td>
                  <td className="py-3 pr-4 text-sm text-gray-500 whitespace-nowrap">{r.type || '—'}</td>
                  <td className="py-3 pr-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                    ₱{Number(r.amount || 0).toLocaleString()}
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-500 whitespace-nowrap">
                    {r.deliveryDate ? new Date(r.deliveryDate).toISOString().split('T')[0] : '—'}
                  </td>
                  <td className="py-3 pr-4 text-sm text-gray-500 whitespace-nowrap">
                    {r.dueDate ? new Date(r.dueDate).toISOString().split('T')[0] : '—'}
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      normalizeStatus(r.status) === 'Completed' ? 'bg-green-100 text-green-700' :
                      normalizeStatus(r.status) === 'Active'    ? 'bg-blue-100 text-blue-700' :
                                                                   'bg-gray-100 text-gray-600'
                    }`}>
                      {normalizeStatus(r.status)}
                    </span>
                  </td>
                </tr>
              ))}
              {recentRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-gray-400">
                    No sponsorship records for {currentYear} yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ── Due Date Notification Modal ── */}
      {dueNotif.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDueNotif({ open: false, donors: [] })}
          />
          {/* Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-amber-500 px-6 py-5 text-center relative">
              <button
                onClick={() => setDueNotif({ open: false, donors: [] })}
                className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="text-4xl mb-2">⚠️</div>
              <h2 className="text-xl font-bold text-white">Due Date Alert</h2>
              <p className="text-amber-100 text-sm mt-1">
                {dueNotif.donors.length} record{dueNotif.donors.length !== 1 ? 's' : ''} due soon or overdue
              </p>
            </div>
            {/* Body */}
            <div className="px-6 py-4 max-h-64 overflow-y-auto space-y-3">
              {dueNotif.donors.map((d) => (
                <div key={d.id} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-bold shrink-0">
                    {(d.sponsor || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{d.sponsor}</p>
                    <p className="text-xs text-gray-500 truncate">{d.project}</p>
                    <p className="text-xs text-amber-600 font-semibold mt-0.5">
                      Due: {formatDate(d.dueDate)} · PHP {Number(d.amount || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setDueNotif({ open: false, donors: [] })}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Dismiss
              </button>
              <button
                onClick={handleDueNotifEmail}
                className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" /> Send Email
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}