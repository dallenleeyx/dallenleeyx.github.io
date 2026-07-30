// lib/holidays.js — NUS academic-year + Singapore public holidays; no
// classes run on these dates. Confirmed dates only, from the official
// AY2026/2027 NUS academic calendar. A handful of Singapore public
// holidays were still "to be confirmed" at publication (Chinese New Year,
// Good Friday, Vesak Day, Hari Raya Puasa) and are deliberately left out
// rather than guessed -- add them once NUS/MOM confirm the exact dates.
export const NUS_HOLIDAYS = [
  { date: '2026-08-10', label: 'National Day (observed)' },
  { date: '2026-10-09', label: 'NUS Well-Being Day' },
  { date: '2026-11-09', label: 'Deepavali (observed)' },
  { date: '2026-12-25', label: 'Christmas Day' },
  { date: '2027-01-01', label: "New Year's Day" },
  { date: '2027-05-01', label: 'Labour Day' },
];

export function isHoliday(iso) {
  return NUS_HOLIDAYS.some(h => h.date === iso);
}
