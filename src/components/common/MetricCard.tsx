import type { KeyMetric } from '../../types/common';

interface MetricCardProps {
  metric: KeyMetric;
  className?: string;
}

export default function MetricCard({ metric, className = '' }: MetricCardProps) {
  return (
    <div className={`${className}`}>
      <p className="text-sm text-[#86868b] mb-1">{metric.label}</p>
      <p className="text-3xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
        {metric.value}
      </p>
      {metric.delta && (
        <p className={`text-sm mt-1 ${
          metric.delta_direction === 'up' ? 'text-[#30d158]' :
          metric.delta_direction === 'down' ? 'text-[#ff3b30]' :
          'text-[#86868b]'
        }`}>
          {metric.delta}
        </p>
      )}
    </div>
  );
}
