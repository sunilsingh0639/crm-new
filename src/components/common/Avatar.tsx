import { getInitials, getAvatarColor } from '../../utils/helpers';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  xs: 'w-6 h-6 text-[9px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ${className}`}
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.30)' }}
      />
    );
  }
  return (
    <div
      className={`${sizes[size]} rounded-full bg-gradient-to-br ${getAvatarColor(name)} flex items-center justify-center font-semibold text-white shrink-0 ${className}`}
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.20)' }}
    >
      {getInitials(name)}
    </div>
  );
}

interface AvatarGroupProps {
  names: string[];
  max?: number;
  size?: AvatarProps['size'];
}

export function AvatarGroup({ names, max = 3, size = 'sm' }: AvatarGroupProps) {
  const visible = names.slice(0, max);
  const rest = names.length - max;
  return (
    <div className="flex -space-x-2">
      {visible.map((name) => (
        <Avatar
          key={name}
          name={name}
          size={size}
          className="ring-2 ring-[rgba(10,8,30,0.80)]"
        />
      ))}
      {rest > 0 && (
        <div
          className={`${sizes[size]} rounded-full flex items-center justify-center text-[10px] font-semibold text-slate-300 ring-2`}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
          }}
        >
          +{rest}
        </div>
      )}
    </div>
  );
}
