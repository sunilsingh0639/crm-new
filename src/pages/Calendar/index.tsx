import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO } from 'date-fns';
import { useStore } from '../../store/useStore';
import { generateId } from '../../utils/helpers';
import { Modal, ConfirmDialog } from '../../components/common/Modal';
import { useToast } from '../../components/common/Toast';
import type { CalendarEvent } from '../../types';

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  start: z.string().min(1),
  end: z.string().min(1),
  category: z.enum(['meeting', 'deadline', 'reminder', 'event', 'holiday']),
  allDay: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

const categoryColors: Record<string, string> = {
  meeting: '#8b5cf6',
  deadline: '#ef4444',
  reminder: '#f59e0b',
  event: '#3b82f6',
  holiday: '#10b981',
};

function EventForm({ event, defaultDate, onClose }: { event?: CalendarEvent; defaultDate?: Date; onClose: () => void }) {
  const { addEvent, updateEvent } = useStore();
  const { toast } = useToast();
  const defaultStart = defaultDate ? format(defaultDate, "yyyy-MM-dd'T'HH:mm") : '';
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: event ? { ...event, start: event.start.slice(0, 16), end: event.end.slice(0, 16) } : { category: 'meeting', start: defaultStart, end: defaultStart, allDay: false },
  });

  const onSubmit = (data: FormData) => {
    if (event) { updateEvent({ ...event, ...data }); toast('Event updated', 'success'); }
    else { addEvent({ ...data, id: generateId() }); toast('Event created', 'success'); }
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
        <textarea {...register('description')} className="input-glass resize-none" rows={2} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted mb-1 block">Start</label>
          <input {...register('start')} type="datetime-local" className="input-glass" />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">End</label>
          <input {...register('end')} type="datetime-local" className="input-glass" />
        </div>
      </div>
      <div>
        <label className="text-xs text-muted mb-1 block">Category</label>
        <select {...register('category')} className="input-glass" style={{ background: 'var(--glass-bg)' }}>
          {['meeting', 'deadline', 'reminder', 'event', 'holiday'].map((c) => (
            <option key={c} value={c} style={{ background: 'rgb(var(--bg-secondary))' }}>{c}</option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-secondary cursor-pointer">
        <input {...register('allDay')} type="checkbox" className="rounded" />
        All day event
      </label>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" onClick={onClose} className="btn-glass">Cancel</button>
        <button type="submit" className="btn-primary">{event ? 'Update' : 'Create'} Event</button>
      </div>
    </form>
  );
}

export default function Calendar() {
  const { events, deleteEvent } = useStore();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<CalendarEvent | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getEventsForDay = (day: Date) =>
    events.filter((e) => isSameDay(parseISO(e.start), day));

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    if (view === 'month') d.setMonth(d.getMonth() + dir);
    else if (view === 'week') d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  const upcomingEvents = events
    .filter((e) => new Date(e.start) >= new Date())
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Calendar</h1>
          <p className="text-secondary text-sm mt-1">{events.length} events</p>
        </div>
        <button onClick={() => { setEditEvent(undefined); setSelectedDate(new Date()); setModalOpen(true); }} className="btn-primary"><Plus size={14} />New Event</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Calendar */}
        <div className="xl:col-span-3 glass-card">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(-1)} className="btn-glass p-2"><ChevronLeft size={14} /></button>
              <h2 className="font-semibold text-primary text-lg">{format(currentDate, 'MMMM yyyy')}</h2>
              <button onClick={() => navigate(1)} className="btn-glass p-2"><ChevronRight size={14} /></button>
              <button onClick={() => setCurrentDate(new Date())} className="btn-glass text-xs px-3">Today</button>
            </div>
            <div className="flex gap-1 glass rounded-xl p-1">
              {(['month', 'week', 'day'] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-all capitalize ${view === v ? 'bg-violet-500/20 text-violet-400' : 'text-muted hover:text-secondary'}`}>{v}</button>
              ))}
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="text-center text-xs text-muted font-medium py-2">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const dayEvents = getEventsForDay(day);
              const inMonth = isSameMonth(day, currentDate);
              const today = isToday(day);
              return (
                <motion.div
                  key={day.toISOString()}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => { setSelectedDate(day); setEditEvent(undefined); setModalOpen(true); }}
                  className={`min-h-[80px] p-1.5 rounded-xl cursor-pointer transition-colors ${inMonth ? 'hover:bg-white/5' : 'opacity-30'} ${today ? 'ring-1 ring-violet-500/50 bg-violet-500/5' : ''}`}
                >
                  <span className={`text-xs font-medium block mb-1 w-6 h-6 flex items-center justify-center rounded-full ${today ? 'bg-violet-500 text-white' : 'text-secondary'}`}>
                    {format(day, 'd')}
                  </span>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((e) => (
                      <div
                        key={e.id}
                        onClick={(ev) => { ev.stopPropagation(); setSelectedEvent(e); }}
                        className="text-[10px] px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80"
                        style={{ background: `${categoryColors[e.category]}20`, color: categoryColors[e.category] }}
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && <div className="text-[10px] text-muted px-1">+{dayEvents.length - 2} more</div>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="glass-card">
          <h3 className="font-semibold text-primary mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {upcomingEvents.length === 0 && <p className="text-sm text-muted text-center py-4">No upcoming events</p>}
            {upcomingEvents.map((e) => (
              <div key={e.id} className="flex gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedEvent(e)}>
                <div className="w-1 rounded-full shrink-0" style={{ background: categoryColors[e.category] }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-primary truncate">{e.title}</p>
                  <p className="text-xs text-muted">{format(parseISO(e.start), 'MMM d, h:mm a')}</p>
                  <span className="text-xs capitalize" style={{ color: categoryColors[e.category] }}>{e.category}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
            <p className="text-xs text-muted font-medium mb-2">Categories</p>
            {Object.entries(categoryColors).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-2 text-xs text-secondary capitalize">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                {cat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(undefined)} title="Event Details" size="sm">
        {selectedEvent && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ background: categoryColors[selectedEvent.category] }} />
              <span className="text-sm capitalize text-secondary">{selectedEvent.category}</span>
            </div>
            <p className="text-secondary text-sm">{selectedEvent.description || 'No description'}</p>
            <div className="glass p-3 rounded-xl text-sm">
              <p className="text-xs text-muted mb-1">Start</p>
              <p className="text-primary">{format(parseISO(selectedEvent.start), 'PPpp')}</p>
            </div>
            <div className="glass p-3 rounded-xl text-sm">
              <p className="text-xs text-muted mb-1">End</p>
              <p className="text-primary">{format(parseISO(selectedEvent.end), 'PPpp')}</p>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => { setEditEvent(selectedEvent); setSelectedEvent(undefined); setModalOpen(true); }} className="btn-glass flex-1 justify-center"><Edit2 size={13} />Edit</button>
              <button onClick={() => { setDeleteId(selectedEvent.id); setSelectedEvent(undefined); }} className="btn-glass flex-1 justify-center text-red-400"><Trash2 size={13} />Delete</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editEvent ? 'Edit Event' : 'New Event'} size="md">
        <EventForm event={editEvent} defaultDate={selectedDate} onClose={() => setModalOpen(false)} />
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { deleteEvent(deleteId!); toast('Event deleted', 'success'); }} title="Delete Event" message="Delete this event?" confirmLabel="Delete" danger />
    </div>
  );
}
