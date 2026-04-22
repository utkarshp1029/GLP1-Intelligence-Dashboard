interface StalenessBadgeProps {
  lastUpdated?: string;
  size?: 'sm' | 'md';
}

export function getStalenessLevel(lastUpdated?: string): {
  days: number;
  level: 'fresh' | 'recent' | 'stale' | 'very-stale' | 'unknown';
  label: string;
  colorClass: string;
  dotClass: string;
} {
  if (!lastUpdated) {
    return {
      days: -1,
      level: 'unknown',
      label: 'Unknown',
      colorClass: 'text-gray-500 bg-gray-100 dark:bg-gray-800',
      dotClass: 'bg-gray-400',
    };
  }

  const updated = new Date(lastUpdated);
  const now = new Date();
  const days = Math.floor(
    (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (days <= 2) {
    return {
      days,
      level: 'fresh',
      label: days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days}d ago`,
      colorClass: 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/30',
      dotClass: 'bg-emerald-500',
    };
  }
  if (days <= 7) {
    return {
      days,
      level: 'recent',
      label: `${days}d ago`,
      colorClass: 'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/30',
      dotClass: 'bg-blue-500',
    };
  }
  if (days <= 14) {
    return {
      days,
      level: 'stale',
      label: `${days}d ago`,
      colorClass: 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-900/30',
      dotClass: 'bg-amber-500',
    };
  }
  return {
    days,
    level: 'very-stale',
    label: `${days}d ago`,
    colorClass: 'text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-900/30',
    dotClass: 'bg-red-500',
  };
}

export default function StalenessBadge({
  lastUpdated,
  size = 'sm',
}: StalenessBadgeProps) {
  const { label, colorClass, dotClass } = getStalenessLevel(lastUpdated);
  const sizeClass = size === 'md' ? 'text-xs px-2 py-1' : 'text-[10px] px-1.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${colorClass} ${sizeClass}`}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {label}
    </span>
  );
}
