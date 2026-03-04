import React, { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
  ArrowUpRight, Users, DollarSign, Megaphone, Activity, Clock, ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { donations, donors, campaigns } = useData();
  const navigate = useNavigate();

  const parseDateSafe = (val) => {
    if (!val) return null;
    const d = new Date(val);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const normalizeStatus = (s) => {
    const v = String(s || '').trim().toLowerCase();
    if (v === 'done' || v === 'complete' || v === 'completed') return 'Completed';
    if (v === 'inactive') return 'Inactive';
    if (v === 'active') return 'Active';
    return s || 'Active';
  };

  // ─── DONOR (SPONSORSHIP) STATS ────────────────────────────────────────────
  const completedSponsors = useMemo(
    () => donors.filter((r) => normalizeStatus(r.status) === 'Completed'),
    [donors]
  );

  const totalSponsorAmount = useMemo(
    () => donors.reduce((sum, r) => sum + Number(r.amount || 0), 0),
    [donors]
  );

  // ─── DONATION (ONLINE) STATS ──────────────────────────────────────────────
  const completedDonations = useMemo(
    () => donations.filter((d) => d.status === 'Completed'),
    [donations]
  );

  const totalDonationsRaised = useMemo(
    () => completedDonations.reduce((sum, d) => sum + Number(d.amount || 0), 0),
    [completedDonations]
  );

  const activeCampaigns = useMemo(
    () => donors.filter((d) => normalizeStatus(d.status) === 'Active').length,
    [donors]
  );

  const avgDonation = useMemo(
    () => completedDonations.length > 0 ? totalDonationsRaised / completedDonations.length : 0,
    [completedDonations, totalDonationsRaised]
  );

  const stats = [
    {
      title: 'Total Sponsorship Amount',
      value: `₱${totalSponsorAmount.toLocaleString()}`,
      change: `${donors.length} records`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Online Donations',
      value: `₱${totalDonationsRaised.toLocaleString()}`,
      change: `${completedDonations.length} completed`,
      icon: Activity,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Active Sponsorships',
      value: activeCampaigns.toString(),
      change: 'ongoing',
      icon: Megaphone,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: 'Avg. Online Donation',
      value: `₱${Math.round(avgDonation).toLocaleString()}`,
      change: 'per donation',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
  ];

  // ─── DONATION TREND by month ──────────────────────────────────────────────
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const donationTrendData = useMemo(() => {
    return monthNames.map((month, index) => {
      const amount = completedDonations
        .filter((d) => { const dt = parseDateSafe(d.date); return dt && dt.getMonth() === index; })
        .reduce((sum, d) => sum + Number(d.amount || 0), 0);
      return { name: month, amount };
    });
  }, [completedDonations]);

  // ─── TOP CAMPAIGNS by online donations ───────────────────────────────────
  const campaignChartData = useMemo(() => {
    const map = new Map();
    completedDonations.forEach((d) => {
      const key = d.campaign || 'Unknown';
      map.set(key, (map.get(key) || 0) + Number(d.amount || 0));
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, raised]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        raised,
      }));
  }, [completedDonations]);

  // ─── DONOR SEGMENTATION by type ──────────────────────────────────────────
  const segmentationData = useMemo(() => {
    const map = new Map();
    donors.forEach((d) => {
      const t = d.type || 'Unknown';
      map.set(t, (map.get(t) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [donors]);

  // ─── ONLINE DONATION CHANNEL BREAKDOWN ───────────────────────────────────
  const channelData = useMemo(() => {
    const map = new Map();
    donations.forEach((d) => {
      const label = d.channel || 'Unknown';
      map.set(label, (map.get(label) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [donations]);

  // ─── RECENT SPONSORSHIP RECORDS ──────────────────────────────────────────
  const recentRecords = useMemo(() => {
    return [...donors]
      .sort((a, b) => {
        const da = parseDateSafe(a.deliveryDate)?.getTime() || 0;
        const db = parseDateSafe(b.deliveryDate)?.getTime() || 0;
        return db - da;
      })
      .slice(0, 5);
  }, [donors]);

  // ─── RECENT ONLINE DONATIONS ─────────────────────────────────────────────
  const recentDonations = useMemo(() => {
    return [...donations]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [donations]);

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <Clock className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.title}>
            <CardContent className="flex items-center p-6">
              <div className={`p-3 rounded-full ${item.color} mr-4`}>
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{item.title}</p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                  <span className="ml-2 text-sm font-medium flex items-center text-green-600">
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    {item.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Online Donation Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Online Donation Trends (by Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={donationTrendData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(v) => `₱${v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    formatter={(value) => [`₱${Number(value || 0).toLocaleString()}`, 'Amount']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Top Campaigns (by Online Donations)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignChartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} />
                  <Tooltip
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    formatter={(value) => [`₱${Number(value || 0).toLocaleString()}`, 'Raised']}
                  />
                  <Bar dataKey="raised" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sponsorship Records */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Sponsorship Records</CardTitle>
            <button
              onClick={() => navigate('/donors')}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-sm font-semibold text-gray-600">Sponsor</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Project</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <div className="font-medium text-gray-900">{r.sponsor || '-'}</div>
                      <div className="text-xs text-gray-500">{r.deliveryDate ? new Date(r.deliveryDate).toISOString().split('T')[0] : '-'}</div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{r.project || '-'}</td>
                    <td className="py-3 font-semibold text-gray-900">₱{Number(r.amount || 0).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        normalizeStatus(r.status) === 'Completed' ? 'bg-green-100 text-green-800' :
                        normalizeStatus(r.status) === 'Active' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {normalizeStatus(r.status)}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentRecords.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-sm text-gray-500">No sponsorship records yet.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Recent Online Donations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Online Donations</CardTitle>
            <button
              onClick={() => navigate('/donations')}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </CardHeader>
          <CardContent>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-sm font-semibold text-gray-600">Donor</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Campaign</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Amount</th>
                  <th className="pb-3 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3">
                      <div className="font-medium text-gray-900">{d.donor}</div>
                      <div className="text-xs text-gray-500">{d.date}</div>
                    </td>
                    <td className="py-3 text-sm text-gray-600">{d.campaign}</td>
                    <td className="py-3 font-semibold text-gray-900">₱{Number(d.amount || 0).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        d.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        d.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentDonations.length === 0 && (
                  <tr><td colSpan={4} className="py-8 text-center text-sm text-gray-500">No online donations yet.</td></tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donor Segmentation */}
        <Card>
          <CardHeader>
            <CardTitle>Sponsor Segmentation (Type)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={segmentationData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {segmentationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {segmentationData.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-gray-600">{entry.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Online Donation Channels */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Online Donations by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {channelData.length > 0 ? channelData.map((entry) => (
                <div key={entry.name} className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-xs text-gray-500 mb-1">{entry.name}</div>
                  <div className="text-xl font-bold text-gray-900">{entry.value}</div>
                  <div className="text-[10px] text-gray-400">Donations</div>
                </div>
              )) : (
                <p className="text-sm text-gray-500 col-span-3">No channel data yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}