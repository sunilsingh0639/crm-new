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
    <span className={`badge ${cls} ${className}`}>
      {label}
    </span>
  );
}

interface StatusDotProps {
  status: string;
}

const dotColors: Record<string, string> = {
  active: 'bg-emerald-400',
  inactive: 'bg-slate-400',
  away: 'bg-amber-400',
  online: 'bg-emerald-400',
  offline: 'bg-slate-400',
};

export function StatusDot({ status }: StatusDotProps) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${dotColors[status] ?? 'bg-slate-400'}`} />
  );
}
