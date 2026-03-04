import React, { useState } from 'react';
import { Plus, Search, Filter, CreditCard, Edit2, Trash2, Repeat, Clock, Bell } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Card, CardContent } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { useData } from '../context/DataContext';

export function Donations() {
  const { donations, campaigns, donors, addDonation, updateDonation, deleteDonation, user } = useData();
  const isAdmin = user?.role === 'admin';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [currentDonation, setCurrentDonation] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [campaignFilter, setCampaignFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const overduePending = donations.filter(donation => {
    if (donation.status !== 'Pending') return false;
    const parsedDate = new Date(donation.date);
    if (Number.isNaN(parsedDate.getTime())) return false;
    return parsedDate < new Date();
  });

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.campaign.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || donation.type === typeFilter;
    const matchesCampaign = campaignFilter === 'All' || donation.campaign === campaignFilter;
    const matchesDate = !dateFilter || donation.date === new Date(dateFilter).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    let matchesTab = true;
    if (activeTab === 'Recurring') matchesTab = donation.type === 'Recurring';
    if (activeTab === 'Pending') matchesTab = donation.status === 'Pending';
    return matchesSearch && matchesType && matchesCampaign && matchesDate && matchesTab;
  });

  const handleShowReceipt = (donation) => {
    setSelectedDonation(donation);
    setIsReceiptOpen(true);
  };

  const handleEditDonation = (donation) => {
    setCurrentDonation(donation);
    setIsModalOpen(true);
  };

  const handleDeleteDonation = (id) => {
    if (confirm('Are you sure you want to delete this donation record?')) {
      deleteDonation(id);
    }
  };

  const handleExport = () => {
    alert('Exporting filtered donations to CSV...');
  };

  const handleSendReminder = (donation) => {
    alert(`Notification sent for pending donation of ₱${donation.amount.toLocaleString()} from ${donation.donor}.`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const donationData = {
      id: currentDonation ? currentDonation.id : undefined,
      donor: formData.get('donor'),
      amount: formData.get('amount'),
      type: formData.get('type'),
      campaign: formData.get('campaign'),
      channel: formData.get('channel'),
      status: formData.get('status') || 'Completed',
      notes: formData.get('notes'),
      date: currentDonation ? currentDonation.date : undefined,
    };
    if (currentDonation) {
      updateDonation(donationData);
    } else {
      addDonation(donationData);
    }
    setIsModalOpen(false);
    setCurrentDonation(null);
    e.target.reset();
  };

  const tabs = [
    { id: 'All', label: 'All Donations', icon: CreditCard },
    { id: 'Recurring', label: 'Recurring', icon: Repeat },
    { id: 'Pending', label: 'Pending', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donation Tracking</h1>
          <p className="text-sm text-gray-500">Monitor and manage incoming donations.</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Notifications — visible to all */}
          <Button variant="secondary" onClick={() => setIsNotificationOpen(true)}>
            <Bell className="h-4 w-4 mr-2" />
            {overduePending.length > 0 ? `${overduePending.length} Pending Alerts` : 'Notifications'}
          </Button>
          {/* Add Donation — admin only */}
          {isAdmin && (
            <Button onClick={() => { setCurrentDonation(null); setIsModalOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Donation
            </Button>
          )}
        </div>
      </div>

      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by donor or project..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="w-32">
                <Select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  options={[
                    { label: 'All Types', value: 'All' },
                    { label: 'One-time', value: 'One-time' },
                    { label: 'Recurring', value: 'Recurring' },
                  ]}
                />
              </div>
              <div className="w-40">
                <Select
                  value={campaignFilter}
                  onChange={(e) => setCampaignFilter(e.target.value)}
                  options={[
                    { label: 'All Projects', value: 'All' },
                    ...campaigns.map(c => ({ label: c.title, value: c.title }))
                  ]}
                />
              </div>
              <div className="w-40">
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              <Button variant="secondary" onClick={handleExport}>
                <Filter className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proj</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  {/* Actions column — admin only */}
                  {isAdmin && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonations.length > 0 ? (
                  filteredDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-gray-50 group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{donation.donor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₱{donation.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          donation.type === 'Recurring' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {donation.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.campaign}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-400" />
                        {donation.channel}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donation.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={
                          donation.status === 'Completed' ? 'success' :
                          donation.status === 'Pending' ? 'warning' : 'danger'
                        }>
                          {donation.status}
                        </Badge>
                      </td>
                      {/* Edit/Delete — admin only */}
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleShowReceipt(donation)}
                              className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                              title="View Receipt"
                            >
                              <CreditCard className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditDonation(donation)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDonation(donation.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={isAdmin ? 8 : 7} className="px-6 py-10 text-center text-gray-500">
                      No donations found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal — admin only */}
      {isAdmin && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setCurrentDonation(null); }}
          title={currentDonation ? 'Edit Donation' : 'Record New Donation'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Donor</label>
              <Select
                name="donor"
                required
                defaultValue={currentDonation?.donor}
                options={[
                  { label: 'Select Donor', value: '' },
                  ...donors.map(donor => ({ label: donor.name, value: donor.name }))
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">₱</span>
                  <Input type="number" name="amount" className="pl-7" placeholder="0.00" required min="1" defaultValue={currentDonation?.amount} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Payment Channel</label>
                <Select
                  name="channel"
                  defaultValue={currentDonation?.channel}
                  options={[
                    { label: 'Bank Transfer', value: 'Bank Transfer' },
                    { label: 'GCash', value: 'GCash' },
                    { label: 'Credit Card', value: 'Credit Card' },
                    { label: 'PayPal', value: 'PayPal' },
                    { label: 'Cash', value: 'Cash' },
                  ]}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Project</label>
                <Select
                  name="campaign"
                  required
                  defaultValue={currentDonation?.campaign}
                  options={[
                    { label: 'Select Project', value: '' },
                    ...campaigns.map(c => ({ label: c.title, value: c.title }))
                  ]}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Donation Type</label>
                <Select
                  name="type"
                  defaultValue={currentDonation?.type || 'One-time'}
                  options={[
                    { label: 'One-time', value: 'One-time' },
                    { label: 'Recurring', value: 'Recurring' },
                  ]}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select
                name="status"
                defaultValue={currentDonation?.status || 'Completed'}
                options={[
                  { label: 'Completed', value: 'Completed' },
                  { label: 'Pending', value: 'Pending' },
                  { label: 'Failed', value: 'Failed' },
                ]}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
              <textarea
                name="notes"
                defaultValue={currentDonation?.notes}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px]"
                placeholder="Any additional information..."
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" type="button" onClick={() => { setIsModalOpen(false); setCurrentDonation(null); }}>Cancel</Button>
              <Button type="submit">{currentDonation ? 'Update Donation' : 'Record Donation'}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Receipt Modal — visible to all */}
      <Modal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title="Donation Receipt"
      >
        {selectedDonation && (
          <div className="space-y-6 p-2">
            <div className="text-center border-b pb-6">
              <h3 className="text-2xl font-bold text-primary-700">Official Receipt</h3>
              <p className="text-sm text-gray-500">Knowledge Channel Foundation, Inc.</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between"><span className="text-gray-500">Receipt No:</span><span className="font-mono font-medium">#{selectedDonation.id}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-medium">{selectedDonation.date}</span></div>
              <div className="flex justify-between border-t pt-4"><span className="text-gray-500">Donor Name:</span><span className="font-bold text-gray-900">{selectedDonation.donor}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Project:</span><span className="font-medium">{selectedDonation.campaign}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment Channel:</span><span className="font-medium">{selectedDonation.channel}</span></div>
              <div className="flex justify-between text-lg border-t pt-4"><span className="font-bold text-gray-900">Total Amount:</span><span className="font-bold text-primary-700 text-xl">₱{selectedDonation.amount.toLocaleString()}</span></div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-xs text-gray-500 italic text-center">
              Thank you for your generous contribution to Knowledge Channel Foundation. Your support helps us provide quality education to every Filipino child.
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => window.print()}>Print Receipt</Button>
              <Button onClick={() => setIsReceiptOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Notifications Modal — visible to all */}
      <Modal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        title="Pending Donation Notifications"
      >
        <div className="space-y-4">
          {overduePending.length === 0 ? (
            <p className="text-sm text-gray-500">There are currently no overdue pending donations.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Donor</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    {isAdmin && <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {overduePending.map((donation) => (
                    <tr key={donation.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{donation.donor}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{donation.campaign}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{donation.date}</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">₱{donation.amount.toLocaleString()}</td>
                      {isAdmin && (
                        <td className="px-4 py-2 text-right">
                          <Button size="sm" onClick={() => handleSendReminder(donation)}>Send Notification</Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-end pt-2">
            <Button variant="secondary" onClick={() => setIsNotificationOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}