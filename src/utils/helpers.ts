export const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

export const formatNumber = (n: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const formatRelativeTime = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
};

export const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    active:       'text-emerald-300 bg-emerald-500/12 border-emerald-500/25',
    inactive:     'text-slate-400   bg-slate-500/12   border-slate-500/20',
    away:         'text-amber-300   bg-amber-500/12   border-amber-500/25',
    completed:    'text-emerald-300 bg-emerald-500/12 border-emerald-500/25',
    'in-progress':'text-blue-300    bg-blue-500/12    border-blue-500/25',
    planning:     'text-violet-300  bg-violet-500/12  border-violet-500/25',
    'on-hold':    'text-amber-300   bg-amber-500/12   border-amber-500/25',
    todo:         'text-slate-400   bg-slate-500/12   border-slate-500/20',
    review:       'text-cyan-300    bg-cyan-500/12    border-cyan-500/25',
    converted:    'text-emerald-300 bg-emerald-500/12 border-emerald-500/25',
    lost:         'text-red-300     bg-red-500/12     border-red-500/25',
    new:          'text-blue-300    bg-blue-500/12    border-blue-500/25',
    contacted:    'text-cyan-300    bg-cyan-500/12    border-cyan-500/25',
    qualified:    'text-violet-300  bg-violet-500/12  border-violet-500/25',
    proposal:     'text-amber-300   bg-amber-500/12   border-amber-500/25',
    negotiation:  'text-orange-300  bg-orange-500/12  border-orange-500/25',
    pending:      'text-amber-300   bg-amber-500/12   border-amber-500/25',
    failed:       'text-red-300     bg-red-500/12     border-red-500/25',
    critical:     'text-red-300     bg-red-500/12     border-red-500/25',
    high:         'text-orange-300  bg-orange-500/12  border-orange-500/25',
    medium:       'text-amber-300   bg-amber-500/12   border-amber-500/25',
    low:          'text-emerald-300 bg-emerald-500/12 border-emerald-500/25',
  };
  return map[status] ?? 'text-slate-400 bg-slate-500/12 border-slate-500/20';
};

export const getPriorityColor = (priority: string) => {
  const map: Record<string, string> = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#f59e0b',
    low: '#10b981',
  };
  return map[priority] ?? '#94a3b8';
};

export const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

export const downloadCSV = (data: Record<string, unknown>[], filename: string) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [headers.join(','), ...data.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const avatarColors = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-pink-500 to-rose-600',
  'from-indigo-500 to-blue-600',
];

export const getAvatarColor = (name: string) =>
  avatarColors[name.charCodeAt(0) % avatarColors.length];
