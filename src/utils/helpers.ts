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
    active: 'text-emerald-400 bg-emerald-400/10',
    inactive: 'text-slate-400 bg-slate-400/10',
    away: 'text-amber-400 bg-amber-400/10',
    completed: 'text-emerald-400 bg-emerald-400/10',
    'in-progress': 'text-blue-400 bg-blue-400/10',
    planning: 'text-purple-400 bg-purple-400/10',
    'on-hold': 'text-amber-400 bg-amber-400/10',
    todo: 'text-slate-400 bg-slate-400/10',
    review: 'text-cyan-400 bg-cyan-400/10',
    converted: 'text-emerald-400 bg-emerald-400/10',
    lost: 'text-red-400 bg-red-400/10',
    new: 'text-blue-400 bg-blue-400/10',
    contacted: 'text-cyan-400 bg-cyan-400/10',
    qualified: 'text-purple-400 bg-purple-400/10',
    proposal: 'text-amber-400 bg-amber-400/10',
    negotiation: 'text-orange-400 bg-orange-400/10',
    pending: 'text-amber-400 bg-amber-400/10',
    failed: 'text-red-400 bg-red-400/10',
    critical: 'text-red-400 bg-red-400/10',
    high: 'text-orange-400 bg-orange-400/10',
    medium: 'text-amber-400 bg-amber-400/10',
    low: 'text-emerald-400 bg-emerald-400/10',
  };
  return map[status] ?? 'text-slate-400 bg-slate-400/10';
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
