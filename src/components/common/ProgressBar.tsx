interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const heights = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

export function ProgressBar({ value, max = 100, color, size = 'md', showLabel = false, className = '' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const bg = color ?? (pct >= 80 ? '#10b981' : pct >= 50 ? '#8b5cf6' : pct >= 25 ? '#f59e0b' : '#ef4444');
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`flex-1 ${heights[size]} rounded-full bg-white/5 overflow-hidden`}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: bg }}
        />
      </div>
      {showLabel && <span className="text-xs text-secondary w-8 text-right">{Math.round(pct)}%</span>}
    </div>
  );
}
