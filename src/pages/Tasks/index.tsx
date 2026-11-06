import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, CheckSquare, GripVertical, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../../store/useStore';
import { generateId, formatDate, isOverdue } from '../../utils/helpers';
import { Badge } from '../../components/common/Badge';
import { Avatar } from '../../components/common/Avatar';
import { SearchInput, Select } from '../../components/common/Inputs';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../components/common/Toast';
import type { Task } from '../../types';

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'completed']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  assignedTo: z.string().min(1),
  dueDate: z.string().min(1),
  projectId: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const statuses = ['todo', 'in-progress', 'review', 'completed'] as const;
const statusLabels: Record<string, string> = { todo: 'To Do', 'in-progress': 'In Progress', review: 'Review', completed: 'Completed' };
const priorities = ['low', 'medium', 'high', 'critical'] as const;

function TaskForm({ task, onClose }: { task?: Task; onClose: () => void }) {
  const { addTask, updateTask, teamMembers, projects } = useStore();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: task ?? { status: 'todo', priority: 'medium' },
  });

  const onSubmit = (data: FormData) => {
    if (task) {
      updateTask({ ...task, ...data, completed: data.status === 'completed' });
      toast('Task updated', 'success');
    } else {
      addTask({ ...data, id: generateId(), tags: [], completed: false, createdAt: new Date().toISOString(), description: data.description ?? '' });
      toast('Task created', 'success');
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-xs text-muted mb-1 block">Title</label>
        <input {...register('title')} className="input-glass" />
        {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
      </div>
      <div>
        <label className="text-xs text-muted mb-1 block">Description</label>
        <textarea {...register('description')} className="input-glass resize-none" rows={3} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted mb-1 block">Status</label>
          <select {...register('status')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
            {statuses.map((s) => <option key={s} value={s} style={{ background: 'rgb(var(--bg-secondary))' }}>{statusLabels[s]}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Priority</label>
          <select {...register('priority')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
            {priorities.map((p) => <option key={p} value={p} style={{ background: 'rgb(var(--bg-secondary))' }}>{p}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Assigned To</label>
          <select {...register('assignedTo')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
            <option value="" style={{ background: 'rgb(var(--bg-secondary))' }}>Select member</option>
            {teamMembers.map((m) => <option key={m.id} value={m.id} style={{ background: 'rgb(var(--bg-secondary))' }}>{m.name}</option>)}
          </select>
          {errors.assignedTo && <p className="text-xs text-red-400 mt-1">Required</p>}
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">Due Date</label>
          <input {...register('dueDate')} type="date" className="input-glass" />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-muted mb-1 block">Project (optional)</label>
          <select {...register('projectId')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
            <option value="" style={{ background: 'rgb(var(--bg-secondary))' }}>No project</option>
            {projects.map((p) => <option key={p.id} value={p.id} style={{ background: 'rgb(var(--bg-secondary))' }}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onClose} className="btn-glass">Cancel</button>
        <button type="submit" className="btn-primary">{task ? 'Update' : 'Create'} Task</button>
      </div>
    </form>
  );
}

function KanbanView({ tasks }: { tasks: Task[] }) {
  const { updateTask, teamMembers } = useStore();
  const [dragging, setDragging] = useState<string | null>(null);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {statuses.map((status) => {
        const cols = tasks.filter((t) => t.status === status);
        return (
          <div key={status} className="flex-shrink-0 w-64"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); if (dragging) { const t = tasks.find((x) => x.id === dragging); if (t) updateTask({ ...t, status, completed: status === 'completed' }); setDragging(null); } }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-secondary">{statusLabels[status]}</span>
              <span className="text-xs text-muted bg-white/5 px-2 py-0.5 rounded-full">{cols.length}</span>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {cols.map((t) => {
                const member = teamMembers.find((m) => m.id === t.assignedTo);
                const overdue = isOverdue(t.dueDate) && !t.completed;
                return (
                  <motion.div key={t.id} draggable onDragStart={() => setDragging(t.id)} onDragEnd={() => setDragging(null)}
                    className={`glass-card p-3 cursor-grab ${dragging === t.id ? 'opacity-50' : ''} ${overdue ? 'border-red-500/20' : ''}`} whileHover={{ scale: 1.02 }}>
                    <div className="flex items-start gap-2 mb-2">
                      <GripVertical size={12} className="text-muted mt-0.5 shrink-0" />
                      <p className="text-xs font-medium text-primary">{t.title}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge label={t.priority} status={t.priority} />
                      {overdue && <AlertCircle size={12} className="text-red-400" />}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      {member && <Avatar name={member.name} size="xs" />}
                      <span className={`text-xs ${overdue ? 'text-red-400' : 'text-muted'}`}>{formatDate(t.dueDate)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Tasks() {
  const { tasks, teamMembers, projects, deleteTask, updateTask } = useStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [view, setView] = useState<'list' | 'kanban'>('list');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = tasks.filter((t) =>
    (!search || t.title.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || t.status === statusFilter) &&
    (!priorityFilter || t.priority === priorityFilter)
  );

  const getMember = (id: string) => teamMembers.find((m) => m.id === id);
  const getProject = (id?: string) => projects.find((p) => p.id === id);

  const toggleComplete = (task: Task) => {
    const newStatus = task.completed ? 'todo' : 'completed';
    updateTask({ ...task, completed: !task.completed, status: newStatus });
    toast(task.completed ? 'Task reopened' : 'Task completed!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tasks</h1>
          <p className="text-secondary text-sm mt-1">{tasks.filter((t) => !t.completed).length} active tasks</p>
        </div>
        <button onClick={() => { setEditTask(undefined); setModalOpen(true); }} className="btn-primary"><Plus size={14} />New Task</button>
      </div>

      <div className="flex flex-wrap gap-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search tasks..." className="w-64" />
        <Select value={statusFilter} onChange={setStatusFilter} options={statuses.map((s) => ({ value: s, label: statusLabels[s] }))} placeholder="All Statuses" className="w-40" />
        <Select value={priorityFilter} onChange={setPriorityFilter} options={priorities.map((p) => ({ value: p, label: p }))} placeholder="All Priorities" className="w-36" />
        <div className="flex gap-1 glass rounded-xl p-1 ml-auto">
          {(['list', 'kanban'] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${view === v ? 'bg-violet-500/20 text-violet-400' : 'text-muted hover:text-secondary'}`}>{v}</button>
          ))}
        </div>
      </div>

      {view === 'kanban' ? (
        <KanbanView tasks={filtered} />
      ) : (
        <div className="space-y-2">
          {filtered.length === 0 && <EmptyState icon={<CheckSquare size={24} />} title="No tasks found" action={<button onClick={() => setModalOpen(true)} className="btn-primary">Create Task</button>} />}
          {filtered.map((t) => {
            const member = getMember(t.assignedTo);
            const project = getProject(t.projectId);
            const overdue = isOverdue(t.dueDate) && !t.completed;
            return (
              <motion.div key={t.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className={`glass-card flex items-center gap-4 ${overdue ? 'border-red-500/20' : ''}`}>
                <button onClick={() => toggleComplete(t)} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${t.completed ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-violet-400'}`}>
                  {t.completed && <span className="text-white text-xs">✓</span>}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${t.completed ? 'line-through text-muted' : 'text-primary'}`}>{t.title}</p>
                    {overdue && <AlertCircle size={13} className="text-red-400 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {project && <span className="text-xs text-violet-400">{project.name}</span>}
                    <Badge label={t.priority} status={t.priority} />
                    <Badge label={statusLabels[t.status]} status={t.status} />
                  </div>
                </div>
                {member && (
                  <div className="flex items-center gap-2 hidden sm:flex">
                    <Avatar name={member.name} size="xs" />
                    <span className="text-xs text-muted">{member.name}</span>
                  </div>
                )}
                <span className={`text-xs hidden md:block ${overdue ? 'text-red-400' : 'text-muted'}`}>{formatDate(t.dueDate)}</span>
                <div className="flex gap-1">
                  <button onClick={() => { setEditTask(t); setModalOpen(true); }} className="btn-glass p-1.5"><Edit2 size={13} /></button>
                  <button onClick={() => setDeleteId(t.id)} className="btn-glass p-1.5 text-red-400"><Trash2 size={13} /></button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTask ? 'Edit Task' : 'New Task'} size="md">
        <TaskForm task={editTask} onClose={() => setModalOpen(false)} />
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteTask(deleteId!); toast('Task deleted', 'success'); }} title="Delete Task" message="Delete this task permanently?" confirmLabel="Delete" danger />
    </div>
  );
}
