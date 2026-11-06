import { getStatusColor } from '../../utils/helpers';

interface BadgeProps {
  label: string;
  status?: string;
  color?: string;
  className?: string;
}

export function Badge({ label, status, color, className = '' }: BadgeProps) {
  const cls = status ? getStatusColor(status) : color ?? 'text-slate-400 bg-slate-400/10';
  return (
    <span
      className={`badge ${cls} ${className}`}
      style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
    >
      {label}
    </span>
  );
}

interface StatusDotProps { status: string; }
const dotColors: Record<string, string> = {
  active: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]',
  inactive: 'bg-slate-500',
  away: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.6)]',
  online: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.6)]',
  offline: 'bg-slate-500',
};

export function StatusDot({ status }: StatusDotProps) {
  return <span className={`inline-block w-2 h-2 rounded-full ${dotColors[status] ?? 'bg-slate-500'}`} />;
}
