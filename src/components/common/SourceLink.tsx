interface SourceLinkProps {
  url: string;
  name: string;
  className?: string;
}

export default function SourceLink({ url, name, className = '' }: SourceLinkProps) {
  if (!url || url === '#') {
    return (
      <span className={`text-xs text-[#86868b] ${className}`}>
        {name}
      </span>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-sm text-[#0071e3] no-underline hover:underline ${className}`}
    >
      {name} ›
    </a>
  );
}
