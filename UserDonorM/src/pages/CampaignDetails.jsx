import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Target, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const campaignData = {
  id: 1,
  title: 'School Supplies 2024',
  description: 'Providing essential school supplies to 500 students in rural areas. This campaign aims to ensure every child has the tools they need to learn effectively.',
  raised: 150000,
  target: 250000,
  donors: 120,
  daysLeft: 15,
  status: 'Active',
  updates: [
    { date: 'Oct 20, 2024', title: 'First batch distributed', content: 'We have successfully distributed supplies to 100 students.' },
    { date: 'Oct 15, 2024', title: 'Campaign halfway mark', content: 'We reached 50% of our goal! Thank you donors.' },
  ]
};

const donationTrend = [
  { name: 'Week 1', amount: 20000 },
  { name: 'Week 2', amount: 45000 },
  { name: 'Week 3', amount: 30000 },
  { name: 'Week 4', amount: 55000 },
];

export function CampaignDetails() {
  const { id } = useParams();
  

  React.useEffect(() => {
    console.log('Campaign ID:', id);
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/campaigns">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{campaignData.title}</h1>
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          {campaignData.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About this Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{campaignData.description}</p>
              
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                 <div>
                    <p className="text-2xl font-bold text-gray-900">₱{campaignData.raised.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 uppercase">Raised</p>
                 </div>
                 <div>
                    <p className="text-2xl font-bold text-gray-900">₱{campaignData.target.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 uppercase">Goal</p>
                 </div>
                 <div>
                    <p className="text-2xl font-bold text-gray-900">{campaignData.donors}</p>
                    <p className="text-xs text-gray-500 uppercase">Donors</p>
                 </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Progress</span>
                  <span className="font-medium text-gray-700">{Math.round((campaignData.raised / campaignData.target) * 100)}%</span>
                </div>
                <ProgressBar value={campaignData.raised} max={campaignData.target} className="h-4" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donation Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={donationTrend}>
                    <defs>
                      <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTrend)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignData.updates.map((update, idx) => (
                  <div key={idx} className="border-l-2 border-primary-200 pl-4 py-1">
                    <p className="text-sm text-gray-500">{update.date}</p>
                    <h4 className="text-base font-medium text-gray-900">{update.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{update.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Edit Campaign</Button>
              <Button variant="secondary" className="w-full">View Donors</Button>
              <Button variant="secondary" className="w-full">Export Report</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" /> Days Left
                </div>
                <span className="font-semibold text-gray-900">{campaignData.daysLeft}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="h-4 w-4 mr-2" /> Target Achievement
                </div>
                <span className="font-semibold text-gray-900">60%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 mr-2" /> Avg. Donation
                </div>
                <span className="font-semibold text-gray-900">₱1,250</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
