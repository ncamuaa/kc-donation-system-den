import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, Users, DollarSign, Megaphone, Activity, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useData } from '../context/DataContext';

export function Dashboard() {
  const { donations, donors, campaigns, getCampaignRaised } = useData();

 
  const completedDonations = donations.filter(d => d.status === 'Completed');
  const totalDonations = completedDonations.reduce((sum, d) => sum + d.amount, 0);
  const totalDonors = donors.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'Active').length;
  const avgDonation = completedDonations.length > 0 ? totalDonations / completedDonations.length : 0;

  
  const stats = [
    { 
      title: 'Total Donations', 
      value: `₱${totalDonations.toLocaleString()}`, 
      change: '+12.5%', 
      trend: 'up', 
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    { 
      title: 'Total Donors', 
      value: totalDonors.toString(), 
      change: '+5.2%', 
      trend: 'up', 
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    { 
      title: 'Active Campaigns', 
      value: activeCampaigns.toString(), 
      change: '+1', 
      trend: 'up', 
      icon: Megaphone,
      color: 'bg-yellow-100 text-yellow-600'
    },
    { 
      title: 'Avg. Donation', 
      value: `₱${Math.round(avgDonation).toLocaleString()}`, 
      change: '+2.4%', 
      trend: 'up', 
      icon: Activity,
      color: 'bg-purple-100 text-purple-600'
    },
  ];

  
  const campaignChartData = campaigns.slice(0, 5).map(c => ({
    name: c.title.length > 15 ? c.title.substring(0, 15) + '...' : c.title, 
    raised: getCampaignRaised(c.title),
    target: c.target
  }));

  
  const channels = [...new Set(donations.map(d => d.channel))];
  const channelData = channels.map(channel => ({
    name: channel,
    value: donations.filter(d => d.channel === channel).length
  }));

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 
  const donationTrendData = monthNames.map((month, index) => {
    const monthDonations = donations.filter(d => {
      const dDate = new Date(d.date);
      return dDate.getMonth() === index && d.status === 'Completed';
    });
    const amount = monthDonations.reduce((sum, d) => sum + d.amount, 0);
    return { name: month, amount };
  });

 
  const donorTypes = [...new Set(donors.map(d => d.type))];
  const segmentationData = donorTypes.map(type => ({
    name: type,
    value: donors.filter(d => d.type === type).length
  }));

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
                  <span className={`ml-2 text-sm font-medium flex items-center ${
                    item.trend === 'up' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {item.trend === 'up' ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                    {item.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       
        <Card>
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={donationTrendData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `₱${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`₱${value.toLocaleString()}`, 'Amount']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

       
        <Card>
          <CardHeader>
            <CardTitle>Top Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignChartData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#374151', fontSize: 12, fontWeight: 500}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                    formatter={(value) => [`₱${value.toLocaleString()}`, 'Raised']}
                  />
                  <Bar dataKey="raised" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Donations</CardTitle>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                  {donations.slice(0, 5).map((donation) => (
                    <tr key={donation.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="font-medium text-gray-900">{donation.donor}</div>
                        <div className="text-xs text-gray-500">{donation.date}</div>
                      </td>
                      <td className="py-4 text-sm text-gray-600">{donation.campaign}</td>
                      <td className="py-4 font-semibold text-gray-900">₱{donation.amount.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          donation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          donation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {donation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

       
        <Card>
          <CardHeader>
            <CardTitle>Donor Segmentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={segmentationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {segmentationData.map((entry, index) => (
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
                  <span className="font-medium text-gray-900">{entry.value} Donors</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Donation Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {channelData.map((entry) => (
              <div key={entry.name} className="p-4 bg-gray-50 rounded-lg text-center">
                <div className="text-xs text-gray-500 mb-1">{entry.name}</div>
                <div className="text-xl font-bold text-gray-900">{entry.value}</div>
                <div className="text-[10px] text-gray-400">Transactions</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
