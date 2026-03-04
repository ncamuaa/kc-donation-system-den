import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Download, Calendar, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { Input } from '../components/ui/Input';

const donorSegmentationData = [
  { name: 'Individual', value: 400 },
  { name: 'Corporate', value: 300 },
  { name: 'Government', value: 100 },
  { name: 'Organization', value: 200 },
];

const COLORS = ['#3b82f6', '#eab308', '#22c55e', '#ef4444'];

const revenueForecastData = [
  { name: 'Nov', actual: 4000, forecast: 4200 },
  { name: 'Dec', actual: 3000, forecast: 3500 },
  { name: 'Jan', actual: 2000, forecast: 2500 },
  { name: 'Feb', actual: 2780, forecast: 3000 },
  { name: 'Mar', actual: 1890, forecast: 2200 },
  { name: 'Apr', actual: 2390, forecast: 2600 },
  { name: 'May', forecast: 3200 },
  { name: 'Jun', forecast: 3500 },
];

const donorBehaviorData = [
  { name: 'Q1', retention: 85, new: 120 },
  { name: 'Q2', retention: 88, new: 130 },
  { name: 'Q3', retention: 82, new: 110 },
  { name: 'Q4', retention: 90, new: 150 },
];

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500">Deep dive into your donor and campaign data.</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="secondary">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
             <div className="flex items-center space-x-2">
               <Calendar className="h-4 w-4 text-gray-500" />
               <span className="text-sm font-medium text-gray-700">Date Range:</span>
             </div>
             <Input type="date" className="w-auto" />
             <span className="text-gray-500">-</span>
             <Input type="date" className="w-auto" />
             
             <div className="flex items-center space-x-2 ml-4">
               <Filter className="h-4 w-4 text-gray-500" />
               <span className="text-sm font-medium text-gray-700">Campaign:</span>
             </div>
             <Select className="w-48">
               <option value="All">All Campaigns</option>
               <option value="School Supplies">School Supplies</option>
             </Select>
             
             <Button>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Donor Segmentation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donorSegmentationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {donorSegmentationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-6 mt-4">
              {donorSegmentationData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-sm text-gray-600">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Forecast vs Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueForecastData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="forecast" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Forecast" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="actual" stackId="2" stroke="#3b82f6" fill="#3b82f6" name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Donor Behavior Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={donorBehaviorData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="retention" stroke="#3b82f6" name="Retention Rate (%)" />
                  <Line yAxisId="right" type="monotone" dataKey="new" stroke="#eab308" name="New Donors" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
