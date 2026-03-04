import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash, Eye, Activity } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { useData } from '../context/DataContext';
import jsPDF from 'jspdf';

export function Donors() {
  const { donors, donations, addDonor, updateDonor, deleteDonor, getDonorTotal } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentDonor, setCurrentDonor] = useState(null);

  const filteredDonors = donors.filter(donor => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || donor.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleViewProfile = (donor) => {
    setCurrentDonor(donor);
    setIsProfileOpen(true);
  };

  const handleAddDonor = () => {
    setCurrentDonor(null);
    setIsModalOpen(true);
  };

  const handleEditDonor = (donor) => {
    setCurrentDonor(donor);
    setIsModalOpen(true);
  };

  const handleDeleteDonor = (id) => {
    if (confirm('Are you sure you want to delete this donor?')) {
      deleteDonor(id);
    }
  };

  const handleDownloadSummary = () => {
    if (!currentDonor) return;

    const donorDonations = donations.filter(d => d.donor === currentDonor.name);
    const totalAmount = donorDonations.reduce((sum, d) => sum + d.amount, 0);

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Donor Contribution Summary', 105, 20, { align: 'center' });

    doc.setFontSize(11);
    doc.text(`Name: ${currentDonor.name}`, 20, 35);
    doc.text(`Email: ${currentDonor.email}`, 20, 42);
    doc.text(`Donor Type: ${currentDonor.type}`, 20, 49);
    doc.text(`Primary Program: ${currentDonor.program}`, 20, 56);

    doc.setFontSize(12);
    doc.text(`Total Contributed: ₱${totalAmount.toLocaleString()}`, 20, 70);

    doc.setFontSize(11);
    doc.text('Donation History (All Recorded Donations)', 20, 85);

    let y = 95;
    const lineHeight = 7;

    if (donorDonations.length === 0) {
      doc.text('No donation history found.', 20, y);
    } else {
      donorDonations.forEach((donation, index) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        const line = `${index + 1}. ${donation.date} • ${donation.campaign} • ${donation.channel} • ₱${donation.amount.toLocaleString()} (${donation.status})`;
        doc.text(line, 20, y);
        y += lineHeight;
      });
    }

    const fileSafeName = currentDonor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    doc.save(`${fileSafeName}-donation-summary.pdf`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newDonor = {
      id: currentDonor ? currentDonor.id : undefined,
      name: formData.get('name'),
      email: formData.get('email'),
      type: formData.get('type'),
      program: formData.get('program'),
      status: formData.get('status'),
    };

    if (currentDonor) {
      updateDonor(newDonor);
    } else {
      addDonor(newDonor);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donor Management</h1>
          <p className="text-sm text-gray-500">Manage and track your donor relationships.</p>
        </div>
        <Button onClick={handleAddDonor}>
          <Plus className="h-4 w-4 mr-2" />
          Add Donor
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search donors..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { label: 'All Types', value: 'All' },
                  { label: 'Individual', value: 'Individual' },
                  { label: 'Corporate', value: 'Corporate' },
                  { label: 'Organization', value: 'Organization' },
                ]}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Donated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                          {donor.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{donor.name}</div>
                          <div className="text-sm text-gray-500">{donor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{donor.program}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₱{getDonorTotal(donor.name).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={donor.status === 'Active' ? 'success' : 'secondary'}>
                        {donor.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          className="text-gray-400 hover:text-primary-600"
                          onClick={() => handleViewProfile(donor)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-primary-600"
                          onClick={() => handleEditDonor(donor)}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteDonor(donor.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentDonor ? 'Edit Donor' : 'Add New Donor'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <Input name="name" defaultValue={currentDonor?.name} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <Input name="email" type="email" defaultValue={currentDonor?.email} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Donor Type</label>
              <Select
                name="type"
                defaultValue={currentDonor?.type || 'Individual'}
                options={[
                  { label: 'Individual', value: 'Individual' },
                  { label: 'Corporate', value: 'Corporate' },
                  { label: 'Organization', value: 'Organization' },
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select
                name="status"
                defaultValue={currentDonor?.status || 'Active'}
                options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' },
                ]}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Program</label>
            <Input name="program" defaultValue={currentDonor?.program} required />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Donor</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        title="Donor Profile"
      >
        {currentDonor && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
                {currentDonor.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{currentDonor.name}</h3>
                <p className="text-gray-500">{currentDonor.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Total Contributed</p>
                <p className="text-lg font-bold text-primary-700">₱{getDonorTotal(currentDonor.name).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Donor Type</p>
                <p className="text-lg font-bold text-gray-900">{currentDonor.type}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-primary-600" />
                Donation History
              </h4>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {donations
                  .filter(d => d.donor === currentDonor.name)
                  .map((donation) => (
                    <div key={donation.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{donation.campaign}</p>
                        <p className="text-xs text-gray-500">{donation.date} • {donation.channel}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₱{donation.amount.toLocaleString()}</p>
                        <Badge variant={donation.status === 'Completed' ? 'success' : 'secondary'} className="text-[10px] px-1.5">
                          {donation.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                {donations.filter(d => d.donor === currentDonor.name).length === 0 && (
                  <p className="text-sm text-gray-500 italic text-center py-4">No donation history found.</p>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <Button variant="secondary" onClick={handleDownloadSummary}>
                Download Summary (PDF)
              </Button>
              <Button onClick={() => setIsProfileOpen(false)}>Close Profile</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
