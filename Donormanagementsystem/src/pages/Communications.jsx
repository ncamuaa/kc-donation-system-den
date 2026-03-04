
import React, { useState } from 'react';
import { Mail, Send, Plus, Settings, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useData } from '../context/DataContext';

export function Communications() {
  const {
    commTemplates,
    commWorkflows,
    commHistory,
    addCommTemplate,
    updateCommTemplate,
    deleteCommTemplate,
    updateCommWorkflow,
  } = useData();

  const [activeTab, setActiveTab] = useState('templates');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [templateSubject, setTemplateSubject] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [workflowStatus, setWorkflowStatus] = useState('');
  const [historySearch, setHistorySearch] = useState('');

  const handleOpenNewTemplate = () => {
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateSubject('');
    setTemplateContent('');
    setIsTemplateModalOpen(true);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateSubject(template.subject);
    setTemplateContent(template.content || '');
    setIsTemplateModalOpen(true);
  };

  const handleSubmitTemplate = async (e) => {
    e.preventDefault();
    const payload = { name: templateName, subject: templateSubject, content: templateContent };
    if (editingTemplate) {
      await updateCommTemplate({ ...payload, id: editingTemplate.id });
    } else {
      await addCommTemplate(payload);
    }
    setIsTemplateModalOpen(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = async (id) => {
    if (confirm('Are you sure you want to delete this template?')) {
      await deleteCommTemplate(id);
    }
  };

  const handleConfigureWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    setWorkflowStatus(workflow.status);
    setIsWorkflowModalOpen(true);
  };

  const handleSaveWorkflow = async () => {
    if (!selectedWorkflow) return;
    await updateCommWorkflow({ id: selectedWorkflow.id, status: workflowStatus });
    setIsWorkflowModalOpen(false);
  };

  const handleExportHistory = () => {
    const header = ['Recipient', 'Template', 'Date', 'Status'];
    const rows = commHistory.map((log) => [log.recipient, log.template, log.date, log.status]);
    const csv = [header, ...rows]
      .map((row) => row.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'communication-history.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredHistory = commHistory.filter((log) =>
    log.recipient.toLowerCase().includes(historySearch.toLowerCase()) ||
    log.template.toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-sm text-gray-500">Manage email templates, automation, and communication history.</p>
        </div>
        <Button onClick={handleOpenNewTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'templates', label: 'Templates', icon: Mail },
            { id: 'automation', label: 'Automation', icon: Settings },
            { id: 'history', label: 'History', icon: Clock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── TEMPLATES ── */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="group-hover:text-primary-600 transition-colors">{template.name}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template)}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-500 hover:text-red-700">
                      Delete
                    </Button>
                  </div>
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
          <Card
            className="border-dashed border-2 bg-gray-50 flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handleOpenNewTemplate}
          >
            <div className="text-center">
              <Plus className="h-8 w-8 mx-auto text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">Create new template</span>
            </div>
          </Card>
        </div>
      )}

      {/* ── AUTOMATION ── */}
      {activeTab === 'automation' && (
        <div className="space-y-4">
          {commWorkflows.map((workflow) => (
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
                  <Button variant="outline" size="sm" onClick={() => handleConfigureWorkflow(workflow)}>
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── HISTORY ── */}
      {activeTab === 'history' && (
        <Card>
          <CardContent className="p-0">
            <div className="p-4 border-b flex justify-between items-center">
              <Input
                placeholder="Search history..."
                className="max-w-xs"
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
              />
              <Button variant="outline" size="sm" onClick={handleExportHistory}>
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
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">No history found.</td>
                  </tr>
                )}
                {filteredHistory.map((log) => (
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

      {/* ── TEMPLATE MODAL ── */}
      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title={editingTemplate ? 'Edit Template' : 'New Template'}
      >
        <form onSubmit={handleSubmitTemplate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
            <Input value={templateName} onChange={(e) => setTemplateName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
            <Input value={templateSubject} onChange={(e) => setTemplateSubject(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              className="w-full min-h-[120px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Add email content..."
              value={templateContent}
              onChange={(e) => setTemplateContent(e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsTemplateModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Template</Button>
          </div>
        </form>
      </Modal>

      {/* ── WORKFLOW MODAL ── */}
      <Modal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
        title="Workflow Settings"
      >
        {selectedWorkflow && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Workflow Name</p>
              <p className="text-sm font-medium text-gray-900 mt-1">{selectedWorkflow.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Trigger</p>
                <p className="text-sm text-gray-900 mt-1">{selectedWorkflow.trigger}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase">Steps</p>
                <p className="text-sm text-gray-900 mt-1">{selectedWorkflow.steps}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Status</p>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={workflowStatus}
                onChange={(e) => setWorkflowStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsWorkflowModalOpen(false)}>Close</Button>
              <Button onClick={handleSaveWorkflow}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}