import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Edit, Trash, Eye, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { useData } from '../context/DataContext';
import jsPDF from 'jspdf';
import { useLocation } from 'react-router-dom';

const PAGE_SIZE = 10;

export function Donors() {
  const { donors, donations, addDonor, updateDonor, deleteDonor, getDonorTotal } = useData();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentDonor, setCurrentDonor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const formatDate = (val) => {
    if (!val) return '-';
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return String(val).slice(0, 10);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Auto-open Record Details when coming from notification bell
  useEffect(() => {
    const openDonorId = location.state?.openDonorId;
    if (!openDonorId) return;
    const found = (donors || []).find((d) => String(d.id) === String(openDonorId));
    if (found) {
      setCurrentDonor(found);
      setIsProfileOpen(true);
    }
  }, [location.state, donors]);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter]);

  const normalizeStatus = (s) => {
    const v = String(s || '').trim().toLowerCase();
    if (v === 'done' || v === 'complete' || v === 'completed') return 'Completed';
    if (v === 'inactive') return 'Inactive';
    if (v === 'active') return 'Active';
    return s || 'Active';
  };

  const statusBadgeVariant = (status) => {
    const s = normalizeStatus(status);
    if (s === 'Active') return 'success';
    if (s === 'Completed') return 'success';
    return 'secondary';
  };

  const filteredDonors = donors.filter((row) => {
    const s = searchTerm.toLowerCase();
    const matchesSearch =
      (row.project || '').toLowerCase().includes(s) ||
      (row.description || '').toLowerCase().includes(s) ||
      (row.sponsor || '').toLowerCase().includes(s) ||
      String(row.deliveryDate || '').toLowerCase().includes(s) ||
      String(row.dueDate || '').toLowerCase().includes(s) ||
      String(row.units ?? '').toLowerCase().includes(s) ||
      String(row.amount ?? '').toLowerCase().includes(s) ||
      String(row.type || '').toLowerCase().includes(s) ||
      String(row.status || '').toLowerCase().includes(s);
    const matchesType = typeFilter === 'All' || row.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredDonors.length / PAGE_SIZE));
  const paginatedDonors = filteredDonors.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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
    if (confirm('Are you sure you want to delete this record?')) {
      deleteDonor(id);
    }
  };

  const handleDownloadSummary = () => {
    if (!currentDonor) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Sponsorship Record Summary', 105, 20, { align: 'center' });
    doc.setFontSize(11);
    doc.text(`Project: ${currentDonor.project || '-'}`, 20, 35);
    doc.text(`Sponsor: ${currentDonor.sponsor || '-'}`, 20, 42);
    doc.text(`Email: ${currentDonor.email || '-'}`, 20, 49);
    doc.text(`Type: ${currentDonor.type || '-'}`, 20, 56);
    doc.text(`Units (Schools/PMLs): ${currentDonor.units ?? '-'}`, 20, 63);
    doc.text(`Delivery Date: ${formatDate(currentDonor.deliveryDate)}`, 20, 70);
    doc.text(`Due Date: ${formatDate(currentDonor.dueDate)}`, 20, 77);
    doc.setFontSize(12);
    doc.text(`Amount: ₱${Number(currentDonor.amount || 0).toLocaleString()}`, 20, 91);
    doc.setFontSize(11);
    doc.text('Project Description:', 20, 106);
    const desc = String(currentDonor.description || '-');
    const lines = doc.splitTextToSize(desc, 170);
    doc.text(lines, 20, 114);
    const fileSafeName = String(currentDonor.project || currentDonor.sponsor || 'record')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');
    doc.save(`${fileSafeName}-record-summary.pdf`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newDonor = {
      id: currentDonor ? currentDonor.id : undefined,
      project: formData.get('project'),
      description: formData.get('description'),
      units: Number(formData.get('units') || 0),
      deliveryDate: formData.get('deliveryDate') || null,
      dueDate: formData.get('dueDate') || null,
      sponsor: formData.get('sponsor'),
      amount: Number(formData.get('amount') || 0),
      type: formData.get('type'),
      status: normalizeStatus(formData.get('status')),
      email: formData.get('email') || null,
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
          <h1 className="text-2xl font-bold text-gray-900">Sponsorship Records</h1>
          <p className="text-sm text-gray-500">Track projects, sponsors, and amounts.</p>
        </div>
        <Button onClick={handleAddDonor}>
          <Plus className="h-4 w-4 mr-2" />
          Add Record
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search project, sponsor, description..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. of Schools / PMLs</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Sponsor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-between">
                      <span>Status</span>
                      <span>Action</span>
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedDonors.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.project}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{row.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.units ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(row.deliveryDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(row.dueDate)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 w-40 break-words whitespace-normal">{row.sponsor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      ₱{Number(row.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-between gap-4">
                        <Badge variant={statusBadgeVariant(row.status)}>{normalizeStatus(row.status)}</Badge>
                        <div className="flex items-center space-x-2">
                          <button className="text-gray-400 hover:text-primary-600" onClick={() => handleViewProfile(row)}>
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-primary-600" onClick={() => handleEditDonor(row)}>
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-600" onClick={() => handleDeleteDonor(row.id)}>
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedDonors.length === 0 && (
                  <tr>
                    <td className="px-6 py-10 text-center text-sm text-gray-500" colSpan={9}>
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {filteredDonors.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredDonors.length)} of {filteredDonors.length} records
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">…</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                        currentPage === item
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentDonor ? 'Edit Record' : 'Add New Record'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
            <Input name="project" defaultValue={currentDonor?.project} placeholder="e.g. 1ACCESS" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input name="email" type="email" defaultValue={currentDonor?.email || ''} placeholder="e.g. sponsor@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Description</label>
            <Input name="description" defaultValue={currentDonor?.description} placeholder="e.g. KTV in Lian Batangas..." required />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">No. of Schools / PMLs</label>
              <Input name="units" type="number" defaultValue={currentDonor?.units ?? 0} placeholder="e.g. 1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
              <Input name="deliveryDate" type="date" defaultValue={formatDate(currentDonor?.deliveryDate) === '-' ? '' : formatDate(currentDonor?.deliveryDate)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <Input name="dueDate" type="date" defaultValue={formatDate(currentDonor?.dueDate) === '-' ? '' : formatDate(currentDonor?.dueDate)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sponsor</label>
            <Input name="sponsor" defaultValue={currentDonor?.sponsor} placeholder="e.g. EMAR CORP." required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <Input name="amount" type="number" defaultValue={currentDonor?.amount ?? 0} placeholder="e.g. 150000" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <Select
              name="status"
              defaultValue={normalizeStatus(currentDonor?.status || 'Active')}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Done', value: 'Done' },
              ]}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Record</Button>
          </div>
        </form>
      </Modal>

      {/* Profile/Details Modal */}
      <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} title="Record Details">
        {currentDonor && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold">
                {(currentDonor.sponsor || '?').charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{currentDonor.sponsor}</h3>
                <p className="text-gray-500">{currentDonor.project}</p>
                <p className="text-sm text-gray-400">{currentDonor.email || ''}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Amount</p>
                <p className="text-lg font-bold text-primary-700">₱{Number(currentDonor.amount || 0).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Status</p>
                <p className="text-lg font-bold text-gray-900">{normalizeStatus(currentDonor.status)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Type</p>
                <p className="text-base font-bold text-gray-900">{currentDonor.type}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Units (Schools/PMLs)</p>
                <p className="text-base font-bold text-gray-900">{currentDonor.units ?? '-'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Delivery Date</p>
                <p className="text-base font-bold text-gray-900">{formatDate(currentDonor.deliveryDate)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Due Date</p>
                <p className="text-base font-bold text-gray-900">{formatDate(currentDonor.dueDate)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Project</p>
                <p className="text-base font-bold text-gray-900">{currentDonor.project ?? '-'}</p>
              </div>
              <div className="col-span-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-500 uppercase font-semibold">Project Description</p>
                <p className="text-sm font-medium text-gray-800">{currentDonor.description ?? '-'}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <Button variant="secondary" onClick={handleDownloadSummary}>Download Summary (PDF)</Button>
              <Button onClick={() => setIsProfileOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}