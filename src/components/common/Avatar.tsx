import { getInitials, getAvatarColor } from '../../utils/helpers';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  if (src) {
    return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ${className}`} />;
  }
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${getAvatarColor(name)} flex items-center justify-center font-semibold text-white shrink-0 ${className}`}>
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
        <Avatar key={name} name={name} size={size} className="ring-2 ring-[rgb(var(--bg-primary))]" />
      ))}
      {rest > 0 && (
        <div className={`${sizes[size]} rounded-full glass flex items-center justify-center text-xs font-semibold text-secondary ring-2 ring-[rgb(var(--bg-primary))]`}>
          +{rest}
        </div>
      )}
    </div>
  );
}
