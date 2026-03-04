import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Trophy, Globe, Heart, Megaphone, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Select } from '../components/ui/Select';
import { useData } from '../context/DataContext';

export function Campaigns() {
  const { campaigns, getCampaignRaised, addCampaign, updateCampaign, deleteCampaign } = useData();
  const [activeTab, setActiveTab] = useState('Campaigns');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = campaigns.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCampaign = (e, campaign) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentCampaign(campaign);
    setIsModalOpen(true);
  };

  const handleDeleteCampaign = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this campaign?')) {
      deleteCampaign(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const campaignData = {
      id: currentCampaign ? currentCampaign.id : undefined,
      title: formData.get('title'),
      target: parseFloat(formData.get('target')),
      endDate: formData.get('endDate'),
      description: formData.get('description'),
      status: formData.get('status') || 'Active'
    };

    if (currentCampaign) {
      updateCampaign(campaignData);
    } else {
      addCampaign(campaignData);
    }

    setIsModalOpen(false);
    setCurrentCampaign(null);
    e.target.reset();
  };

  const tabs = [
    { id: 'Campaigns', label: 'Projects', icon: Megaphone },
    { id: 'Events', label: 'Campaign', icon: Trophy },
    { id: 'Grants', label: 'Grants', icon: Globe },
    { id: 'CauseMarketing', label: 'Cause Marketing', icon: Heart },
  ];

  const events = [
    { id: 1, title: 'Annual Charity Gala', date: 'Dec 15, 2024', time: '7:00 PM', goal: 1500000, status: 'Upcoming', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', description: 'A formal evening to celebrate our donors and raise funds for the 2025 Education Fund.' },
    { id: 2, title: 'Tech for Teachers Fun Run', date: 'Feb 20, 2025', time: '6:00 AM', goal: 500000, status: 'Planning', image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800', description: 'Community run to support laptop provisions for public school teachers.' }
  ];

  const grants = [
    { id: 1, title: 'Digital Literacy Grant', org: 'UNESCO Manila', status: 'Under Review', amount: 2500000, deadline: 'Nov 30, 2024', propId: 'PR-2024-001' },
    { id: 2, title: 'STEM Education Fund', org: 'ADB Foundation', status: 'Approved', amount: 5000000, deadline: 'Dec 15, 2024', propId: 'PR-2024-012' },
    { id: 3, title: 'Teacher Wellness Initiative', org: 'Department of Health', status: 'Drafting', amount: 850000, deadline: 'Jan 10, 2025', propId: 'PR-2024-015' }
  ];

  const handleEditEvent = (event) => {
    // Logic for editing event
    alert(`Editing event: ${event.title}`);
  };

  const handleEditGrant = (grant) => {
    // Logic for editing grant
    alert(`Editing grant: ${grant.title}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Campaigns':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="relative group">
                <Link to={`/campaigns/${campaign.id}`} className="block h-full">
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant={campaign.status === 'Active' ? 'success' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {campaign.endDate}
                        </span>
                      </div>
                      <CardTitle className="mt-2 text-xl group-hover:text-primary-600 transition-colors pr-8">
                        {campaign.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {campaign.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-900">₱{getCampaignRaised(campaign.title).toLocaleString()}</span>
                          <span className="text-gray-500">of ₱{campaign.target.toLocaleString()}</span>
                        </div>
                        <ProgressBar value={getCampaignRaised(campaign.title)} max={campaign.target} />
                        <div className="flex justify-end text-xs text-gray-500">
                          {Math.round((getCampaignRaised(campaign.title) / campaign.target) * 100)}% Funded
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <div className="absolute top-12 right-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleEditCampaign(e, campaign)}
                    className="p-1.5 bg-white shadow-sm border rounded-md text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button 
                    onClick={(e) => handleDeleteCampaign(e, campaign.id)}
                    className="p-1.5 bg-white shadow-sm border rounded-md text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {filteredCampaigns.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No campaigns found.
              </div>
            )}
          </div>
        );
      case 'Events':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map(event => (
              <Card key={event.id} className="overflow-hidden group relative">
                <div className="h-48 bg-gray-200 relative">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  <Badge className="absolute top-4 left-4" variant={event.status === 'Upcoming' ? 'success' : 'secondary'}>{event.status}</Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {event.date}</span>
                    <span>{event.time}</span>
                  </div>
                  <CardTitle className="mt-2 text-xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Goal:</span>
                      <span className="ml-2 font-bold text-gray-900">₱{event.goal.toLocaleString()}</span>
                    </div>
                    <Button variant="outline" size="sm">Register / Tickets</Button>
                  </div>
                </CardContent>
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditEvent(event)} className="p-1.5 bg-white shadow-sm border rounded-md text-blue-600 hover:bg-blue-50">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => alert('Delete event')} className="p-1.5 bg-white shadow-sm border rounded-md text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        );
      case 'Grants':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Grant Pipeline</h3>
              <Badge variant="outline" className="font-normal text-gray-500">{grants.length} Active Proposals</Badge>
            </div>
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grant Opportunity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {grants.map(grant => (
                      <tr key={grant.id} className="hover:bg-gray-50 group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{grant.title}</div>
                          <div className="text-xs text-gray-500">Proposal ID: {grant.propId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grant.org}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={grant.status === 'Approved' ? 'success' : grant.status === 'Under Review' ? 'warning' : 'secondary'}>
                            {grant.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₱{grant.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grant.deadline}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditGrant(grant)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => alert('Delete grant')} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        );
      case 'CauseMarketing':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                    <Heart className="h-6 w-6" />
                  </div>
                  <CardTitle>Shop for Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Partner retailers donate 1% of sales to our literacy programs. Simple integration for e-commerce and POS systems.</p>
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Raised YTD:</span>
                      <span className="font-bold text-gray-900">₱245,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Active Partners:</span>
                      <span className="font-bold text-primary-600">12 Brands</span>
                    </div>
                    <Button variant="outline" className="w-full mt-2">Partner Details</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                    <Globe className="h-6 w-6" />
                  </div>
                  <CardTitle>Digital Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">Social media awareness campaign reaching 1M+ viewers. Sponsored by corporate partners to increase brand visibility.</p>
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Impressions:</span>
                      <span className="font-bold text-gray-900">1.8M</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Engagement Rate:</span>
                      <span className="font-bold text-purple-600">4.2%</span>
                    </div>
                    <Button variant="outline" className="w-full mt-2">View Analytics</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-md transition-shadow border-dashed border-2 flex flex-center items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 min-h-[250px]">
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mx-auto mb-4">
                    <Plus className="h-6 w-6" />
                  </div>
                  <h4 className="font-medium text-gray-900">New Partnership</h4>
                  <p className="text-xs text-gray-500 mt-1">Start a new cause-related marketing initiative</p>
                </div>
              </Card>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fundraising & Projects</h1>
          <p className="text-sm text-gray-500">Strategic planning and management of all revenue streams.</p>
        </div>
        <Button onClick={() => { setCurrentCampaign(null); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Create New {tabs.find((tab) => tab.id === activeTab)?.label || activeTab}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex p-1 bg-gray-100 rounded-lg space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon className={`h-4 w-4 mr-2 ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={`Search ${activeTab.toLowerCase()}...`} 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6">
        {renderTabContent()}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setCurrentCampaign(null); }}
        title={currentCampaign ? `Edit ${activeTab.slice(0, -1)}` : `Create New ${activeTab.slice(0, -1)}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input 
              name="title" 
              required 
              placeholder={`Enter ${activeTab.toLowerCase()} title...`} 
              defaultValue={currentCampaign?.title}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₱</span>
                <Input 
                  name="target" 
                  type="number" 
                  className="pl-7" 
                  placeholder="0.00" 
                  required 
                  min="1" 
                  defaultValue={currentCampaign?.target}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <Input 
                name="endDate" 
                type="date" 
                required 
                defaultValue={currentCampaign?.endDate}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select 
              name="status" 
              defaultValue={currentCampaign?.status || 'Active'}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Paused', value: 'Paused' },
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              required
              defaultValue={currentCampaign?.description}
              className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
              placeholder="Describe the goals and impact..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => { setIsModalOpen(false); setCurrentCampaign(null); }}>Cancel</Button>
            <Button type="submit">{currentCampaign ? "Update" : "Create"} {activeTab.slice(0, -1)}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
