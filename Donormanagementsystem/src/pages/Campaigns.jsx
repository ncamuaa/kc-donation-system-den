import React, { useMemo, useRef, useState } from 'react';
import { Plus, Search, Calendar, Trophy, Globe, Heart, Megaphone, Edit2, Trash2, Upload } from 'lucide-react';
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
  const {
    campaigns, getCampaignRaised, addCampaign, updateCampaign, deleteCampaign,
    events, addEvent, updateEvent, deleteEvent,
    grants, addGrant, updateGrant, deleteGrant,
    causeMarketing, addCauseMarketing, updateCauseMarketing, deleteCauseMarketing,
  } = useData();

  const [activeTab, setActiveTab] = useState('Projects');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState(null);
  const [currentGrant, setCurrentGrant] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentCM, setCurrentCM] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const singularLabel =
    activeTab === 'Projects' ? 'Project' :
    activeTab === 'Campaign' ? 'Campaign' :
    activeTab === 'Grants' ? 'Grant' :
    'Cause Marketing';

  const tabs = [
    { id: 'Projects', label: 'Projects', icon: Megaphone },
    { id: 'Campaign', label: 'Campaign', icon: Trophy },
    { id: 'Grants', label: 'Grants', icon: Globe },
    { id: 'CauseMarketing', label: 'Cause Marketing', icon: Heart },
  ];

  const filteredCampaigns = useMemo(() => {
    const list = campaigns || [];
    const q = searchTerm.toLowerCase();
    return list.filter(c =>
      String(c.title || '').toLowerCase().includes(q) ||
      String(c.description || '').toLowerCase().includes(q)
    );
  }, [campaigns, searchTerm]);

  const totalTarget = useMemo(
    () => (campaigns || []).reduce((sum, c) => sum + Number(c.target || 0), 0),
    [campaigns]
  );
  const totalRaised = useMemo(
    () => (campaigns || []).reduce((sum, c) => sum + Number(getCampaignRaised(c.title) || 0), 0),
    [campaigns, getCampaignRaised]
  );
  const activeCount = useMemo(
    () => (campaigns || []).filter(c => c.status === 'Active').length,
    [campaigns]
  );
  const completedCount = useMemo(
    () => (campaigns || []).filter(c => c.status === 'Completed').length,
    [campaigns]
  );

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCampaign(null);
    setCurrentGrant(null);
    setCurrentEvent(null);
    setCurrentCM(null);
    setImagePreview(null);
  };

  const handleOpenCreate = () => {
    closeModal();
    setIsModalOpen(true);
  };

  // ── Projects ──
  const handleEditProject = (e, project) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentCampaign(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteCampaign(id);
    }
  };

  // ── Grants ──
  const handleEditGrant = (grant) => { setCurrentGrant(grant); setIsModalOpen(true); };
  const handleDeleteGrant = async (id) => {
    if (confirm('Are you sure you want to delete this grant?')) await deleteGrant(id);
  };

  // ── Events ──
  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setImagePreview(event.image || null);
    setIsModalOpen(true);
  };
  const handleDeleteEvent = async (id) => {
    if (confirm('Are you sure you want to delete this campaign event?')) await deleteEvent(id);
  };

  // ── Cause Marketing ──
  const handleEditCM = (cm) => { setCurrentCM(cm); setIsModalOpen(true); };
  const handleDeleteCM = async (id) => {
    if (confirm('Are you sure you want to delete this cause marketing entry?')) await deleteCauseMarketing(id);
  };

  // ── Image preview handler ──
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ── Form Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (activeTab === 'Projects') {
      const projectData = {
        id: currentCampaign?.id,
        title: formData.get('title'),
        target: parseFloat(formData.get('target') || '0'),
        endDate: formData.get('endDate'),
        description: formData.get('description'),
        status: formData.get('status') || 'Active',
      };
      if (currentCampaign) await updateCampaign(projectData);
      else await addCampaign(projectData);
    }

    if (activeTab === 'Grants') {
      const grantData = {
        id: currentGrant?.id,
        title: formData.get('title'),
        org: formData.get('org'),
        status: formData.get('status') || 'Under Review',
        amount: parseFloat(formData.get('amount') || '0'),
        deadline: formData.get('deadline'),
        propId: formData.get('propId'),
      };
      if (currentGrant) await updateGrant(grantData);
      else await addGrant(grantData);
    }

    if (activeTab === 'Campaign') {
      // Build payload — pass the File object directly for FormData in DataContext
      const imageFile = fileInputRef.current?.files[0] || null;
      const eventData = {
        id: currentEvent?.id,
        title: formData.get('title'),
        date: formData.get('date'),
        time: formData.get('time'),
        goal: parseFloat(formData.get('goal') || '0'),
        status: formData.get('status') || 'Upcoming',
        description: formData.get('description'),
        ...(imageFile && { image: imageFile }),
      };
      if (currentEvent) await updateEvent(eventData);
      else await addEvent(eventData);
    }

    if (activeTab === 'CauseMarketing') {
      const cmData = {
        id: currentCM?.id,
        title: formData.get('title'),
        status: formData.get('status') || 'Active',
        description: formData.get('description'),
        raisedYtd: parseFloat(formData.get('raisedYtd') || '0'),
        activePartners: parseInt(formData.get('activePartners') || '0'),
      };
      if (currentCM) await updateCauseMarketing(cmData);
      else await addCauseMarketing(cmData);
    }

    closeModal();
    e.target.reset();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Projects':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map((project) => (
              <div key={project.id} className="relative group">
                <Link to={`/campaigns/${project.id}`} className="block h-full">
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <Badge variant={project.status === 'Active' ? 'success' : 'secondary'}>
                          {project.status}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {project.endDate}
                        </span>
                      </div>
                      <CardTitle className="mt-2 text-xl group-hover:text-primary-600 transition-colors pr-8">
                        {project.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-900">
                            ₱{Number(getCampaignRaised(project.title) || 0).toLocaleString()}
                          </span>
                          <span className="text-gray-500">of ₱{Number(project.target || 0).toLocaleString()}</span>
                        </div>
                        <ProgressBar value={Number(getCampaignRaised(project.title) || 0)} max={Number(project.target || 0)} />
                        <div className="flex justify-end text-xs text-gray-500">
                          {Number(project.target || 0)
                            ? Math.round((Number(getCampaignRaised(project.title) || 0) / Number(project.target || 0)) * 100)
                            : 0}% Funded
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                <div className="absolute top-12 right-6 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => handleEditProject(e, project)} className="p-1.5 bg-white shadow-sm border rounded-md text-blue-600 hover:bg-blue-50">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={(e) => handleDeleteProject(e, project.id)} className="p-1.5 bg-white shadow-sm border rounded-md text-red-600 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {filteredCampaigns.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">No projects found.</div>
            )}
          </div>
        );

      case 'Campaign':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(events || []).length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">No campaign events yet.</div>
            )}
            {(events || []).map((event) => (
              <Card key={event.id} className="overflow-hidden group relative">
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={event.image || 'https://via.placeholder.com/800x400?text=Campaign'}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4" variant={event.status === 'Upcoming' ? 'success' : 'secondary'}>
                    {event.status}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> {event.date}</span>
                    <span>{event.time || '-'}</span>
                  </div>
                  <CardTitle className="mt-2 text-xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                  <div className="flex items-center justify-between border-t pt-4">
                    <div className="text-sm">
                      <span className="text-gray-500">Goal:</span>
                      <span className="ml-2 font-bold text-gray-900">₱{Number(event.goal || 0).toLocaleString()}</span>
                    </div>
                    <Button variant="outline" size="sm">Register / Tickets</Button>
                  </div>
                </CardContent>
                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditEvent(event)} className="p-1.5 bg-white shadow-sm border rounded-md text-blue-600 hover:bg-blue-50">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDeleteEvent(event.id)} className="p-1.5 bg-white shadow-sm border rounded-md text-red-600 hover:bg-red-50">
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
              <Badge variant="outline" className="font-normal text-gray-500">
                {(grants || []).length} Active Proposals
              </Badge>
            </div>
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Grant Opportunity', 'Organization', 'Status', 'Request Amount', 'Deadline', 'Actions'].map(h => (
                        <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(grants || []).length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No grants found.</td></tr>
                    )}
                    {(grants || []).map((grant) => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₱{Number(grant.amount || 0).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grant.deadline}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditGrant(grant)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="h-4 w-4" /></button>
                            <button onClick={() => handleDeleteGrant(grant.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(causeMarketing || []).length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500">No cause marketing records yet.</div>
            ) : (
              (causeMarketing || []).map((cm) => (
                <Card key={cm.id} className="hover:shadow-md transition-shadow group relative">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{cm.title}</CardTitle>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditCM(cm)} className="p-1.5 bg-white shadow-sm border rounded-md text-blue-600 hover:bg-blue-50"><Edit2 className="h-3.5 w-3.5" /></button>
                        <button onClick={() => handleDeleteCM(cm.id)} className="p-1.5 bg-white shadow-sm border rounded-md text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge variant={cm.status === 'Active' ? 'success' : 'secondary'}>{cm.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-600">{cm.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Raised YTD</span>
                      <span className="font-bold text-gray-900">₱{Number(cm.raisedYtd || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Active Partners</span>
                      <span className="font-bold text-gray-900">{Number(cm.activePartners || 0)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const modalTitle = () => {
    if (activeTab === 'Grants') return currentGrant ? 'Edit Grant' : 'Create New Grant';
    if (activeTab === 'Campaign') return currentEvent ? 'Edit Campaign Event' : 'Create New Campaign Event';
    if (activeTab === 'CauseMarketing') return currentCM ? 'Edit Cause Marketing' : 'Create New Cause Marketing';
    return currentCampaign ? `Edit ${singularLabel}` : `Create New ${singularLabel}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fundraising & Projects</h1>
          <p className="text-sm text-gray-500">Strategic planning and management of all revenue streams.</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create New {singularLabel}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex p-1 bg-gray-100 rounded-lg space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
            >
              <tab.icon className={`h-4 w-4 mr-2 ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'}`} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder={`Search ${activeTab.toLowerCase()}...`} className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {activeTab === 'Projects' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="py-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Active Projects</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{activeCount}</p>
            <p className="text-xs text-gray-400 mt-1">{completedCount} completed</p>
          </CardContent></Card>
          <Card><CardContent className="py-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Total Target</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">₱{totalTarget.toLocaleString()}</p>
          </CardContent></Card>
          <Card><CardContent className="py-4">
            <p className="text-xs font-medium text-gray-500 uppercase">Total Raised</p>
            <p className="mt-2 text-2xl font-bold text-primary-700">₱{totalRaised.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{totalTarget ? Math.round((totalRaised / totalTarget) * 100) : 0}% of overall goal</p>
          </CardContent></Card>
        </div>
      )}

      <div className="mt-6">{renderTabContent()}</div>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle()}>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── Projects Form ── */}
          {activeTab === 'Projects' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input name="title" required placeholder="Enter project title..." defaultValue={currentCampaign?.title} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₱</span>
                    <Input name="target" type="number" className="pl-7" placeholder="0.00" required min="1" defaultValue={currentCampaign?.target} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <Input name="endDate" type="date" required defaultValue={currentCampaign?.endDate} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select name="status" defaultValue={currentCampaign?.status || 'Active'} options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Completed', value: 'Completed' },
                  { label: 'Paused', value: 'Paused' },
                ]} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" required defaultValue={currentCampaign?.description}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                  placeholder="Describe the goals and impact..." />
              </div>
            </>
          )}

          {/* ── Campaign Events Form ── */}
          {activeTab === 'Campaign' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <Input name="title" required placeholder="Enter event title..." defaultValue={currentEvent?.title} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <Input name="date" type="date" required defaultValue={currentEvent?.date} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <Input name="time" type="time" defaultValue={currentEvent?.time} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Goal Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₱</span>
                    <Input name="goal" type="number" className="pl-7" placeholder="0.00" min="0" defaultValue={currentEvent?.goal} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select name="status" defaultValue={currentEvent?.status || 'Upcoming'} options={[
                    { label: 'Upcoming', value: 'Upcoming' },
                    { label: 'Ongoing', value: 'Ongoing' },
                    { label: 'Completed', value: 'Completed' },
                    { label: 'Cancelled', value: 'Cancelled' },
                  ]} />
                </div>
              </div>

              {/* ── Image Upload ── */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-md" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm font-medium">Click to change</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                      <Upload className="h-8 w-8 mb-2" />
                      <p className="text-sm font-medium text-gray-600">Click to upload image</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" defaultValue={currentEvent?.description}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                  placeholder="Describe this campaign event..." />
              </div>
            </>
          )}

          {/* ── Grants Form ── */}
          {activeTab === 'Grants' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grant Title</label>
                <Input name="title" required placeholder="Enter grant opportunity..." defaultValue={currentGrant?.title} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <Input name="org" required placeholder="Funding organization" defaultValue={currentGrant?.org} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₱</span>
                    <Input name="amount" type="number" className="pl-7" placeholder="0.00" required min="1" defaultValue={currentGrant?.amount} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <Input name="deadline" type="date" required defaultValue={currentGrant?.deadline} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select name="status" defaultValue={currentGrant?.status || 'Under Review'} options={[
                    { label: 'Approved', value: 'Approved' },
                    { label: 'Under Review', value: 'Under Review' },
                    { label: 'Drafting', value: 'Drafting' },
                    { label: 'Declined', value: 'Declined' },
                  ]} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proposal ID</label>
                  <Input name="propId" required placeholder="PR-YYYY-XXX" defaultValue={currentGrant?.propId} />
                </div>
              </div>
            </>
          )}

          {/* ── Cause Marketing Form ── */}
          {activeTab === 'CauseMarketing' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <Input name="title" required placeholder="Enter campaign title..." defaultValue={currentCM?.title} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select name="status" defaultValue={currentCM?.status || 'Active'} options={[
                  { label: 'Active', value: 'Active' },
                  { label: 'Inactive', value: 'Inactive' },
                  { label: 'Completed', value: 'Completed' },
                ]} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Raised YTD</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">₱</span>
                    <Input name="raisedYtd" type="number" className="pl-7" placeholder="0.00" min="0" defaultValue={currentCM?.raisedYtd} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Active Partners</label>
                  <Input name="activePartners" type="number" placeholder="0" min="0" defaultValue={currentCM?.activePartners} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" defaultValue={currentCM?.description}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                  placeholder="Describe this cause marketing initiative..." />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" type="button" onClick={closeModal}>Cancel</Button>
            <Button type="submit">
              {activeTab === 'Grants' ? (currentGrant ? 'Update Grant' : 'Create Grant') :
               activeTab === 'Campaign' ? (currentEvent ? 'Update Event' : 'Create Event') :
               activeTab === 'CauseMarketing' ? (currentCM ? 'Update' : 'Create') :
               (currentCampaign ? 'Update Project' : 'Create Project')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}