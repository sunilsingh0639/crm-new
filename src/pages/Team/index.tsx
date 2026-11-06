import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Mail, Phone, MapPin, UserCircle } from 'lucide-react';
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
import type { TeamMember } from '../../types';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  role: z.string().min(1),
  department: z.string().min(1),
  status: z.enum(['active', 'inactive', 'away']),
  location: z.string().min(1),
  joinDate: z.string().min(1),
});
type FormData = z.infer<typeof schema>;

const departments = ['Engineering', 'Design', 'Product', 'Infrastructure', 'Analytics', 'Marketing', 'Sales', 'HR'];

function MemberForm({ member, onClose }: { member?: TeamMember; onClose: () => void }) {
  const { addTeamMember, updateTeamMember } = useStore();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: member ?? { status: 'active', joinDate: new Date().toISOString().split('T')[0] },
  });

  const onSubmit = (data: FormData) => {
    if (member) { updateTeamMember({ ...member, ...data }); toast('Member updated', 'success'); }
    else { addTeamMember({ ...data, id: generateId(), skills: [], projects: [] }); toast('Member added', 'success'); }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted mb-1 block">Full Name</label>
          <input {...register('name')} className="input-glass" />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Email</label>
          <input {...register('email')} type="email" className="input-glass" />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Phone</label>
          <input {...register('phone')} className="input-glass" />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Role</label>
          <input {...register('role')} className="input-glass" />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Department</label>
          <select {...register('department')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
            {departments.map((d) => <option key={d} value={d} style={{ background: 'rgb(var(--bg-secondary))' }}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Status</label>
          <select {...register('status')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
            {['active', 'inactive', 'away'].map((s) => <option key={s} value={s} style={{ background: 'rgb(var(--bg-secondary))' }}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Location</label>
          <input {...register('location')} className="input-glass" />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Join Date</label>
          <input {...register('joinDate')} type="date" className="input-glass" />
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onClose} className="btn-glass">Cancel</button>
        <button type="submit" className="btn-primary">{member ? 'Update' : 'Add'} Member</button>
      </div>
    </form>
  );
}

export default function Team() {
  const { teamMembers, deleteTeamMember } = useStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMember, setEditMember] = useState<TeamMember | undefined>();
  const [viewMember, setViewMember] = useState<TeamMember | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = teamMembers.filter((m) =>
    (!search || m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase())) &&
    (!deptFilter || m.department === deptFilter) &&
    (!statusFilter || m.status === statusFilter)
  );

  const deptOptions = [...new Set(teamMembers.map((m) => m.department))].map((d) => ({ value: d, label: d }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Team</h1>
          <p className="text-secondary text-sm mt-1">{teamMembers.length} members</p>
        </div>
        <button onClick={() => { setEditMember(undefined); setModalOpen(true); }} className="btn-primary"><Plus size={14} />Add Member</button>
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search members..." className="w-64" />
        <Select value={deptFilter} onChange={setDeptFilter} options={deptOptions} placeholder="All Departments" className="w-44" />
        <Select value={statusFilter} onChange={setStatusFilter} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }, { value: 'away', label: 'Away' }]} placeholder="All Statuses" className="w-36" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<UserCircle size={24} />} title="No members found" action={<button onClick={() => setModalOpen(true)} className="btn-primary">Add Member</button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card glass-hover">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={m.name} size="lg" />
                  <div>
                    <h3 className="font-semibold text-primary">{m.name}</h3>
                    <p className="text-xs text-secondary">{m.role}</p>
                    <Badge label={m.status} status={m.status} className="mt-1" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setViewMember(m)} className="btn-glass p-1.5 text-xs">View</button>
                  <button onClick={() => { setEditMember(m); setModalOpen(true); }} className="btn-glass p-1.5"><Edit2 size={12} /></button>
                  <button onClick={() => setDeleteId(m.id)} className="btn-glass p-1.5 text-red-400"><Trash2 size={12} /></button>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-secondary">
                  <Mail size={12} className="text-muted" />
                  <span className="truncate">{m.email}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <Phone size={12} className="text-muted" />
                  <span>{m.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <MapPin size={12} className="text-muted" />
                  <span>{m.location}</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-muted">{m.department}</span>
                <span className="text-xs text-muted">Joined {formatDate(m.joinDate)}</span>
              </div>
              {m.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {m.skills.slice(0, 3).map((s) => (
                    <span key={s} className="text-xs text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                  {m.skills.length > 3 && <span className="text-xs text-muted">+{m.skills.length - 3}</span>}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editMember ? 'Edit Member' : 'Add Member'} size="lg">
        <MemberForm member={editMember} onClose={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!viewMember} onClose={() => setViewMember(undefined)} title="Member Profile" size="md">
        {viewMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={viewMember.name} size="xl" />
              <div>
                <h3 className="text-lg font-bold text-primary">{viewMember.name}</h3>
                <p className="text-secondary">{viewMember.role}</p>
                <p className="text-sm text-muted">{viewMember.department}</p>
                <Badge label={viewMember.status} status={viewMember.status} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[['Email', viewMember.email], ['Phone', viewMember.phone], ['Location', viewMember.location], ['Joined', formatDate(viewMember.joinDate)]].map(([k, v]) => (
                <div key={k} className="glass p-3 rounded-xl">
                  <p className="text-xs text-muted mb-1">{k}</p>
                  <p className="text-primary">{v}</p>
                </div>
              ))}
            </div>
            {viewMember.skills.length > 0 && (
              <div>
                <p className="text-xs text-muted mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {viewMember.skills.map((s) => (
                    <span key={s} className="text-xs text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteTeamMember(deleteId!); toast('Member removed', 'success'); }} title="Remove Member" message="Remove this team member?" confirmLabel="Remove" danger />
    </div>
  );
}
