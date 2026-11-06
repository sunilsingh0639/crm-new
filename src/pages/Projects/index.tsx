import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, LayoutGrid, List, Table, FolderKanban, GripVertical } from 'lucide-react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../../store/useStore';
import { generateId, formatDate, formatCurrency } from '../../utils/helpers';
import { Badge } from '../../components/common/Badge';
import { Avatar, AvatarGroup } from '../../components/common/Avatar';
import { ProgressBar } from '../../components/common/ProgressBar';
import { SearchInput, Select } from '../../components/common/Inputs';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../components/common/Toast';
import type { Project, ViewMode } from '../../types';

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  status: z.enum(['planning', 'in-progress', 'on-hold', 'completed']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  startDate: z.string().min(1),
  dueDate: z.string().min(1),
  budget: z.coerce.number().min(0),
  progress: z.coerce.number().min(0).max(100),
});
type FormData = z.infer<typeof schema>;

const statuses = ['planning', 'in-progress', 'on-hold', 'completed'] as const;
const priorities = ['low', 'medium', 'high', 'critical'] as const;

function ProjectForm({ project, onClose }: { project?: Project; onClose: () => void }) {
  const { addProject, updateProject } = useStore();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: project ?? { status: 'planning', priority: 'medium', progress: 0, budget: 0 },
  });

  const onSubmit = (data: FormData) => {
    if (project) {
      updateProject({ ...project, ...data });
      toast('Project updated', 'success');
    } else {
      addProject({ ...data, id: generateId(), team: [], tags: [], spent: 0, createdAt: new Date().toISOString() });
      toast('Project created', 'success');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs text-muted mb-1 block">Project Name</label>
        <input {...register('name')} className="input-glass" />
        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="text-xs text-muted mb-1 block">Description</label>
        <textarea {...register('description')} className="input-glass resize-none" rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted mb-1 block">Status</label>
          <select {...register('status')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
            {statuses.map((s) => <option key={s} value={s} style={{ background: 'rgb(var(--bg-secondary))' }}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Priority</label>
          <select {...register('priority')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
            {priorities.map((p) => <option key={p} value={p} style={{ background: 'rgb(var(--bg-secondary))' }}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Start Date</label>
          <input {...register('startDate')} type="date" className="input-glass" />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Due Date</label>
          <input {...register('dueDate')} type="date" className="input-glass" />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Budget ($)</label>
          <input {...register('budget')} type="number" className="input-glass" />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Progress (%)</label>
          <input {...register('progress')} type="number" min="0" max="100" className="input-glass" />
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onClose} className="btn-glass">Cancel</button>
        <button type="submit" className="btn-primary">{project ? 'Update' : 'Create'} Project</button>
      </div>
    </form>
  );
}

function KanbanView({ projects }: { projects: Project[] }) {
  const { updateProject } = useStore();
  const [dragging, setDragging] = useState<string | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statuses.map((status) => {
        const cols = projects.filter((p) => p.status === status);
        return (
          <div key={status} className="flex-shrink-0 w-64"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (dragging) { const p = projects.find((x) => x.id === dragging); if (p) updateProject({ ...p, status }); setDragging(null); } }}
          >
            <div className="flex items-center justify-between mb-3">
              <Badge label={status} status={status} />
              <span className="text-xs text-muted">{cols.length}</span>
            </div>
            <div className="space-y-3 min-h-[100px]">
              {cols.map((p) => (
                <motion.div key={p.id} draggable onDragStart={() => setDragging(p.id)} onDragEnd={() => setDragging(null)}
                  className={`glass-card p-3 cursor-grab ${dragging === p.id ? 'opacity-50' : ''}`} whileHover={{ scale: 1.02 }}>
                  <div className="flex items-start gap-2 mb-2">
                    <GripVertical size={12} className="text-muted mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary">{p.name}</p>
                      <Badge label={p.priority} status={p.priority} className="mt-1" />
                    </div>
                  </div>
                  <ProgressBar value={p.progress} size="sm" showLabel className="mt-2" />
                  <p className="text-xs text-muted mt-2">Due {formatDate(p.dueDate)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Projects() {
  const { projects, teamMembers, deleteProject } = useStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [view, setView] = useState<ViewMode>('grid');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | undefined>();
  const [viewProject, setViewProject] = useState<Project | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = projects.filter((p) =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || p.status === statusFilter) &&
    (!priorityFilter || p.priority === priorityFilter)
  );

  const getTeamNames = (ids: string[]) => ids.map((id) => teamMembers.find((m) => m.id === id)?.name ?? id).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Projects</h1>
          <p className="text-secondary text-sm mt-1">{projects.length} total projects</p>
        </div>
        <button onClick={() => { setEditProject(undefined); setModalOpen(true); }} className="btn-primary"><Plus size={14} />New Project</button>
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." className="w-64" />
        <Select value={statusFilter} onChange={setStatusFilter} options={statuses.map((s) => ({ value: s, label: s }))} placeholder="All Statuses" className="w-40" />
        <Select value={priorityFilter} onChange={setPriorityFilter} options={priorities.map((p) => ({ value: p, label: p }))} placeholder="All Priorities" className="w-36" />
        <div className="flex gap-1 glass rounded-xl p-1 ml-auto">
          {[{ v: 'grid', icon: LayoutGrid }, { v: 'list', icon: List }, { v: 'kanban', icon: FolderKanban }, { v: 'table', icon: Table }].map(({ v, icon: Icon }) => (
            <button key={v} onClick={() => setView(v as ViewMode)} className={`p-1.5 rounded-lg transition-all ${view === v ? 'bg-violet-500/20 text-violet-400' : 'text-muted hover:text-secondary'}`}><Icon size={15} /></button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <EmptyState icon={<FolderKanban size={24} />} title="No projects found" action={<button onClick={() => setModalOpen(true)} className="btn-primary">Create Project</button>} />}

      {view === 'kanban' && <KanbanView projects={filtered} />}

      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card glass-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-primary truncate">{p.name}</h3>
                  <p className="text-xs text-muted mt-0.5 line-clamp-2">{p.description}</p>
                </div>
                <div className="flex gap-1 ml-2">
                  <button onClick={() => setViewProject(p)} className="btn-glass p-1.5"><Eye size={12} /></button>
                  <button onClick={() => { setEditProject(p); setModalOpen(true); }} className="btn-glass p-1.5"><Edit2 size={12} /></button>
                  <button onClick={() => setDeleteId(p.id)} className="btn-glass p-1.5 text-red-400"><Trash2 size={12} /></button>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <Badge label={p.status} status={p.status} />
                <Badge label={p.priority} status={p.priority} />
              </div>
              <ProgressBar value={p.progress} showLabel className="mb-3" />
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Due {formatDate(p.dueDate)}</span>
                <span className="text-emerald-400 font-medium">{formatCurrency(p.budget)}</span>
              </div>
              {p.team.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <AvatarGroup names={getTeamNames(p.team)} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {view === 'list' && (
        <div className="space-y-3">
          {filtered.map((p) => (
            <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass-card flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-primary">{p.name}</h3>
                  <Badge label={p.status} status={p.status} />
                  <Badge label={p.priority} status={p.priority} />
                </div>
                <p className="text-xs text-muted">{p.description}</p>
              </div>
              <div className="w-32 hidden md:block"><ProgressBar value={p.progress} showLabel /></div>
              <div className="text-right hidden lg:block">
                <p className="text-sm text-emerald-400 font-medium">{formatCurrency(p.budget)}</p>
                <p className="text-xs text-muted">{formatDate(p.dueDate)}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setViewProject(p)} className="btn-glass p-1.5"><Eye size={13} /></button>
                <button onClick={() => { setEditProject(p); setModalOpen(true); }} className="btn-glass p-1.5"><Edit2 size={13} /></button>
                <button onClick={() => setDeleteId(p.id)} className="btn-glass p-1.5 text-red-400"><Trash2 size={13} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {view === 'table' && (
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Name', 'Status', 'Priority', 'Progress', 'Budget', 'Due Date', 'Team', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs text-muted font-medium pb-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/2 transition-colors">
                  <td className="py-3 pr-4 font-medium text-primary">{p.name}</td>
                  <td className="py-3 pr-4"><Badge label={p.status} status={p.status} /></td>
                  <td className="py-3 pr-4"><Badge label={p.priority} status={p.priority} /></td>
                  <td className="py-3 pr-4 w-28"><ProgressBar value={p.progress} size="sm" showLabel /></td>
                  <td className="py-3 pr-4 text-emerald-400">{formatCurrency(p.budget)}</td>
                  <td className="py-3 pr-4 text-muted">{formatDate(p.dueDate)}</td>
                  <td className="py-3 pr-4"><AvatarGroup names={getTeamNames(p.team)} size="xs" /></td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <button onClick={() => setViewProject(p)} className="btn-glass p-1.5"><Eye size={12} /></button>
                      <button onClick={() => { setEditProject(p); setModalOpen(true); }} className="btn-glass p-1.5"><Edit2 size={12} /></button>
                      <button onClick={() => setDeleteId(p.id)} className="btn-glass p-1.5 text-red-400"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editProject ? 'Edit Project' : 'New Project'} size="lg">
        <ProjectForm project={editProject} onClose={() => setModalOpen(false)} />
      </Modal>

      <Modal open={!!viewProject} onClose={() => setViewProject(undefined)} title="Project Details" size="lg">
        {viewProject && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge label={viewProject.status} status={viewProject.status} />
              <Badge label={viewProject.priority} status={viewProject.priority} />
            </div>
            <p className="text-secondary text-sm">{viewProject.description}</p>
            <div className="grid grid-cols-2 gap-3">
              {[['Budget', formatCurrency(viewProject.budget)], ['Spent', formatCurrency(viewProject.spent)], ['Start', formatDate(viewProject.startDate)], ['Due', formatDate(viewProject.dueDate)]].map(([k, v]) => (
                <div key={k} className="glass p-3 rounded-xl">
                  <p className="text-xs text-muted mb-1">{k}</p>
                  <p className="text-primary font-medium">{v}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-muted mb-2">Progress</p>
              <ProgressBar value={viewProject.progress} showLabel />
            </div>
            {viewProject.team.length > 0 && (
              <div>
                <p className="text-xs text-muted mb-2">Team</p>
                <div className="flex flex-wrap gap-2">
                  {getTeamNames(viewProject.team).map((name) => (
                    <div key={name} className="flex items-center gap-2 glass px-3 py-1.5 rounded-full">
                      <Avatar name={name} size="xs" />
                      <span className="text-xs text-secondary">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteProject(deleteId!); toast('Project deleted', 'success'); }} title="Delete Project" message="Delete this project permanently?" confirmLabel="Delete" danger />
    </div>
  );
}
