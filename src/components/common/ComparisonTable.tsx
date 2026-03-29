interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface ComparisonTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  highlightFirst?: boolean;
  className?: string;
}

export default function ComparisonTable<T>({
  data,
  columns,
  keyExtractor,
  highlightFirst = false,
  className = '',
}: ComparisonTableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-[15px]">
        <thead>
          <tr className="border-b border-[#d2d2d7] dark:border-[#424245]">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3 px-4 text-xs font-semibold text-[#86868b] uppercase tracking-wider ${
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={keyExtractor(item)}
              className={`border-b border-[#d2d2d7]/50 dark:border-[#424245]/50 ${
                highlightFirst && idx === 0
                  ? 'bg-[#f5f5f7] dark:bg-[#2d2d2f]'
                  : ''
              }`}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-4 px-4 text-[#1d1d1f] dark:text-[#f5f5f7] ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                  }`}
                >
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
