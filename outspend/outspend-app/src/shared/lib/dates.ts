const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function monthKey(year: number, month: number): string {
  return `${year}-${pad(month)}`;
}

export function currentMonth(): string {
  const now = new Date();
  return monthKey(now.getFullYear(), now.getMonth() + 1);
}

export function shiftMonth(key: string, delta: number): string {
  const [year, month] = key.split('-').map(Number);
  const index = year * 12 + (month - 1) + delta;
  return monthKey(Math.floor(index / 12), (index % 12) + 1);
}

export function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}

export function monthShort(key: string): string {
  return MONTHS[Number(key.split('-')[1]) - 1].slice(0, 3);
}

// First and last day of a yyyy-MM month, as yyyy-MM-dd.
export function monthRange(key: string): { from: string; to: string } {
  const [year, month] = key.split('-').map(Number);
  const lastDay = new Date(year, month, 0).getDate();
  return { from: `${key}-01`, to: `${key}-${pad(lastDay)}` };
}

// Dates are written as yyyy-MM-dd in the phone's own time zone, which is what the backend expects.
export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isValidIsoDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return false;
  }
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function todayIso(): string {
  return toIsoDate(new Date());
}

export function isoDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toIsoDate(date);
}

// 2026-11-02 -> "Mon, 2 Nov 2026"
export function formatDate(iso: string): string {
  const date = parseIsoDate(iso);
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3)} ${date.getFullYear()}`;
}
