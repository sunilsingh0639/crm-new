import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, GripVertical, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../../store/useStore';
import { generateId, formatDate } from '../../utils/helpers';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { SearchInput, Select } from '../../components/common/Inputs';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../components/common/Toast';
import type { Contact } from '../../types';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  company: z.string().min(1),
  position: z.string().min(1),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'converted', 'lost']),
  source: z.enum(['website', 'referral', 'social', 'email', 'cold-call', 'event']),
  assignedTo: z.string().min(1),
  notes: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const stages = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'converted', 'lost'] as const;
const stageLabels: Record<string, string> = { new: 'New Lead', contacted: 'Contacted', qualified: 'Qualified', proposal: 'Proposal', negotiation: 'Negotiation', converted: 'Converted', lost: 'Lost' };

function ContactForm({ contact, onClose }: { contact?: Contact; onClose: () => void }) {
  const { addContact, updateContact } = useStore();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: contact ?? { status: 'new', source: 'website' },
  });

  const onSubmit = (data: FormData) => {
    if (contact) {
      updateContact({ ...contact, ...data });
      toast('Contact updated', 'success');
    } else {
      addContact({ ...data, id: generateId(), createdAt: new Date().toISOString() });
      toast('Contact added', 'success');
    }
    onClose();
  };

  const field = (name: keyof FormData, label: string, type = 'text') => (
    <div>
      <label className="text-xs text-muted mb-1 block">{label}</label>
      <input {...register(name)} type={type} className="input-glass" />
      {errors[name] && <p className="text-xs text-red-400 mt-1">{errors[name]?.message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {field('name', 'Full Name')}
        {field('email', 'Email', 'email')}
        {field('phone', 'Phone')}
        {field('company', 'Company')}
        {field('position', 'Position')}
        {field('assignedTo', 'Assigned To')}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted mb-1 block">Status</label>
          <select {...register('status')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
            {stages.map((s) => <option key={s} value={s} style={{ background: 'rgb(var(--bg-secondary))' }}>{stageLabels[s]}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Source</label>
          <select {...register('source')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
            {['website', 'referral', 'social', 'email', 'cold-call', 'event'].map((s) => <option key={s} value={s} style={{ background: 'rgb(var(--bg-secondary))' }}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs text-muted mb-1 block">Notes</label>
        <textarea {...register('notes')} className="input-glass resize-none" rows={3} />
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onClose} className="btn-glass">Cancel</button>
        <button type="submit" className="btn-primary">{contact ? 'Update' : 'Add'} Contact</button>
      </div>
    </form>
  );
}

function KanbanView({ contacts }: { contacts: Contact[] }) {
  const { updateContact } = useStore();
  const [dragging, setDragging] = useState<string | null>(null);

  const handleDrop = (stage: Contact['status'], e: React.DragEvent) => {
    e.preventDefault();
    if (!dragging) return;
    const contact = contacts.find((c) => c.id === dragging);
    if (contact) updateContact({ ...contact, status: stage });
    setDragging(null);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageContacts = contacts.filter((c) => c.status === stage);
        return (
          <div
            key={stage}
            className="flex-shrink-0 w-56"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(stage, e)}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-secondary">{stageLabels[stage]}</span>
              <span className="text-xs text-muted bg-white/5 px-2 py-0.5 rounded-full">{stageContacts.length}</span>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {stageContacts.map((c) => (
                <motion.div
                  key={c.id}
                  draggable
                  onDragStart={() => setDragging(c.id)}
                  onDragEnd={() => setDragging(null)}
                  className={`glass-card p-3 cursor-grab active:cursor-grabbing ${dragging === c.id ? 'opacity-50' : ''}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <GripVertical size={12} className="text-muted" />
                    <Avatar name={c.name} size="xs" />
                    <span className="text-xs font-medium text-primary truncate">{c.name}</span>
                  </div>
                  <p className="text-xs text-muted">{c.company}</p>
                  <p className="text-xs text-muted">{c.position}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function CRM() {
  const { contacts, deleteContact } = useStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [editContact, setEditContact] = useState<Contact | undefined>();
  const [viewContact, setViewContact] = useState<Contact | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      (!q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)) &&
      (!statusFilter || c.status === statusFilter) &&
      (!sourceFilter || c.source === sourceFilter)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">CRM</h1>
          <p className="text-secondary text-sm mt-1">{contacts.length} contacts</p>
        </div>
        <button onClick={() => { setEditContact(undefined); setModalOpen(true); }} className="btn-primary">
          <Plus size={14} />Add Contact
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search contacts..." className="w-64" />
        <Select value={statusFilter} onChange={setStatusFilter} options={stages.map((s) => ({ value: s, label: stageLabels[s] }))} placeholder="All Statuses" className="w-40" />
        <Select value={sourceFilter} onChange={setSourceFilter} options={['website', 'referral', 'social', 'email', 'cold-call', 'event'].map((s) => ({ value: s, label: s }))} placeholder="All Sources" className="w-36" />
        <div className="flex gap-1 glass rounded-xl p-1 ml-auto">
          {(['list', 'kanban'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${view === v ? 'bg-violet-500/20 text-violet-400' : 'text-muted hover:text-secondary'}`}>{v}</button>
          ))}
        </div>
      </div>

      {view === 'kanban' ? (
        <KanbanView contacts={filtered} />
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden">
          {filtered.length === 0 ? (
            <EmptyState icon={<Users size={24} />} title="No contacts found" description="Add your first contact or adjust filters" action={<button onClick={() => setModalOpen(true)} className="btn-primary">Add Contact</button>} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Contact', 'Company', 'Status', 'Source', 'Assigned', 'Created', 'Actions'].map((h) => (
                      <th key={h} className="text-left text-xs text-muted font-medium pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={c.name} size="sm" />
                          <div>
                            <p className="font-medium text-primary">{c.name}</p>
                            <p className="text-xs text-muted">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-primary">{c.company}</p>
                        <p className="text-xs text-muted">{c.position}</p>
                      </td>
                      <td className="py-3 pr-4"><Badge label={stageLabels[c.status]} status={c.status} /></td>
                      <td className="py-3 pr-4 text-secondary capitalize">{c.source}</td>
                      <td className="py-3 pr-4 text-secondary">{c.assignedTo}</td>
                      <td className="py-3 pr-4 text-muted">{formatDate(c.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setViewContact(c)} className="btn-glass p-1.5"><Eye size={13} /></button>
                          <button onClick={() => { setEditContact(c); setModalOpen(true); }} className="btn-glass p-1.5"><Edit2 size={13} /></button>
                          <button onClick={() => setDeleteId(c.id)} className="btn-glass p-1.5 text-red-400 hover:bg-red-500/10"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editContact ? 'Edit Contact' : 'Add Contact'} size="lg">
        <ContactForm contact={editContact} onClose={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!viewContact} onClose={() => setViewContact(undefined)} title="Contact Details" size="md">
        {viewContact && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={viewContact.name} size="xl" />
              <div>
                <h3 className="text-lg font-bold text-primary">{viewContact.name}</h3>
                <p className="text-secondary">{viewContact.position} at {viewContact.company}</p>
                <Badge label={stageLabels[viewContact.status]} status={viewContact.status} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['Email', viewContact.email], ['Phone', viewContact.phone], ['Source', viewContact.source], ['Assigned', viewContact.assignedTo], ['Created', formatDate(viewContact.createdAt)]].map(([k, v]) => (
                <div key={k} className="glass p-3 rounded-xl">
                  <p className="text-xs text-muted mb-1">{k}</p>
                  <p className="text-primary">{v}</p>
                </div>
              ))}
            </div>
            {viewContact.notes && (
              <div className="glass p-3 rounded-xl">
                <p className="text-xs text-muted mb-1">Notes</p>
                <p className="text-sm text-secondary">{viewContact.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { deleteContact(deleteId!); toast('Contact deleted', 'success'); }}
        title="Delete Contact"
        message="Are you sure you want to delete this contact? This action cannot be undone."
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}
