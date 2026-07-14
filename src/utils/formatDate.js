// Shared date/time formatting so every page renders the same way.
// Time is always in 12-hour format (e.g. "14 Jul 2026, 3:05 PM").

const DATE_TIME_OPTS = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true, // force 12-hour clock regardless of the OS locale
};

// Returns a 12-hour date+time string, or "-" for empty/invalid input.
export const formatDateTime = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-GB", DATE_TIME_OPTS);
};
