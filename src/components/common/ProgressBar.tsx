interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };

const getGradient = (pct: number, color?: string) => {
  if (color) return color;
  if (pct >= 80) return 'linear-gradient(90deg, #10b981, #06b6d4)';
  if (pct >= 50) return 'linear-gradient(90deg, #8b5cf6, #6366f1)';
  if (pct >= 25) return 'linear-gradient(90deg, #f59e0b, #f97316)';
  return 'linear-gradient(90deg, #ef4444, #f97316)';
};

const getGlow = (pct: number) => {
  if (pct >= 80) return '0 0 8px rgba(16,185,129,0.50)';
  if (pct >= 50) return '0 0 8px rgba(139,92,246,0.50)';
  if (pct >= 25) return '0 0 8px rgba(245,158,11,0.50)';
  return '0 0 8px rgba(239,68,68,0.50)';
};

export function ProgressBar({ value, max = 100, color, size = 'md', showLabel = false, className = '' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`flex-1 ${heights[size]} rounded-full overflow-hidden`}
        style={{ background: 'rgba(255,255,255,0.06)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.20)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${pct}%`,
            background: getGradient(pct, color),
            boxShadow: getGlow(pct),
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-slate-400 w-8 text-right font-medium tabular-nums">{Math.round(pct)}%</span>
      )}
    </div>
  );
}
