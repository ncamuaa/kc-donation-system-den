import React, { useState } from 'react';
import { Mail, Send, Plus, Settings, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

const templates = [
  { id: 1, name: 'Donation Thank You', subject: 'Thank you for your generous donation!', lastEdited: '2 days ago' },
  { id: 2, name: 'Campaign Update', subject: 'Update on [Campaign Name]', lastEdited: '1 week ago' },
  { id: 3, name: 'Welcome New Donor', subject: 'Welcome to the Knowledge Channel family', lastEdited: '3 weeks ago' },
  { id: 4, name: 'Year-End Appeal', subject: 'Help us finish the year strong', lastEdited: '1 month ago' },
];

const workflows = [
  { id: 1, name: 'New Donor Welcome Series', trigger: 'New Donor Added', status: 'Active', steps: 3 },
  { id: 2, name: 'Donation Receipt', trigger: 'Donation Received', status: 'Active', steps: 1 },
  { id: 3, name: 'Lapsed Donor Re-engagement', trigger: 'No Donation > 6 months', status: 'Paused', steps: 2 },
];

const history = [
  { id: 1, recipient: 'Mckhale Janry R Natividad', template: 'Donation Thank You', date: 'Oct 24, 2024 10:30 AM', status: 'Sent' },
  { id: 2, recipient: 'John Deniell Soliman', template: 'Campaign Update', date: 'Oct 23, 2024 2:15 PM', status: 'Sent' },
  { id: 3, recipient: 'Francis Bartlett Jr', template: 'Welcome New Donor', date: 'Oct 23, 2024 9:00 AM', status: 'Opened' },
  { id: 4, recipient: 'Nicole Camua', template: 'Year-End Appeal', date: 'Oct 22, 2024 4:45 PM', status: 'Bounced' },
];

export function Communications() {
  const [activeTab, setActiveTab] = useState('templates');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-sm text-gray-500">Manage email templates, automation, and communication history.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('templates')}
            className={`${
              activeTab === 'templates'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Mail className="h-4 w-4 mr-2" />
            Templates
          </button>
          <button
            onClick={() => setActiveTab('automation')}
            className={`${
              activeTab === 'automation'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Automation
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`${
              activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Clock className="h-4 w-4 mr-2" />
            History
          </button>
        </nav>
      </div>

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="group-hover:text-primary-600 transition-colors">{template.name}</span>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-gray-500 uppercase font-semibold">Subject</span>
                    <p className="text-sm text-gray-700">{template.subject}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-4">
                    <span>Last edited: {template.lastEdited}</span>
                    <Mail className="h-3 w-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="border-dashed border-2 bg-gray-50 flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="text-center">
              <Plus className="h-8 w-8 mx-auto text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">Create new template</span>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${workflow.status === 'Active' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <Settings className={`h-6 w-6 ${workflow.status === 'Active' ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{workflow.name}</h3>
                    <p className="text-sm text-gray-500">Trigger: {workflow.trigger} • {workflow.steps} steps</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={workflow.status === 'Active' ? 'success' : 'secondary'}>
                    {workflow.status}
                  </Badge>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardContent className="p-0">
             <div className="p-4 border-b flex justify-between items-center">
                <Input placeholder="Search history..." className="max-w-xs" />
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Export Logs
                </Button>
             </div>
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {history.map((log) => (
                   <tr key={log.id}>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.recipient}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.template}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.date}</td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                         ${log.status === 'Sent' ? 'bg-green-100 text-green-800' : 
                           log.status === 'Opened' ? 'bg-blue-100 text-blue-800' : 
                           'bg-red-100 text-red-800'}`}>
                         {log.status === 'Sent' && <CheckCircle className="h-3 w-3 mr-1" />}
                         {log.status === 'Bounced' && <AlertCircle className="h-3 w-3 mr-1" />}
                         {log.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
