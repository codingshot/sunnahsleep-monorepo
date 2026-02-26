/** Returns true if string looks like HH:mm or H:mm with valid hour (0-23) and minute (0-59). */
export function isValidTimeFormat(timeStr: string): boolean {
  const t = timeStr.trim();
  if (!t) return false;
  const parts = t.split(/[:\s]/);
  if (parts.length < 2) return false;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  return (
    Number.isFinite(h) &&
    Number.isFinite(m) &&
    h >= 0 &&
    h <= 23 &&
    m >= 0 &&
    m <= 59
  );
}
