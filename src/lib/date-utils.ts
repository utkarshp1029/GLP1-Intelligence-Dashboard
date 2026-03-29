import { formatDistanceToNow, parseISO, isAfter } from 'date-fns';

export function timeAgo(isoDate: string): string {
  try {
    return formatDistanceToNow(parseISO(isoDate), { addSuffix: true });
  } catch {
    return 'unknown';
  }
}

export function isNewSince(entryTimestamp: string, lastVisit: string | null): boolean {
  if (!lastVisit) return true;
  try {
    return isAfter(parseISO(entryTimestamp), parseISO(lastVisit));
  } catch {
    return false;
  }
}

export function formatDate(isoDate: string): string {
  try {
    const d = parseISO(isoDate);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoDate;
  }
}
