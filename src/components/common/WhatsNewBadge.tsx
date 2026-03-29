interface WhatsNewBadgeProps {
  count: number;
  className?: string;
}

export default function WhatsNewBadge({ count, className = '' }: WhatsNewBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={`text-[10px] font-semibold text-[#0071e3] ${className}`}
    >
      NEW
    </span>
  );
}
