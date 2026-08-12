// lib/fitness/defaultPlan.js — the starter weekly template a first-time
// visitor sees, and the day-key/label constants the rest of the Fitness
// section shares. Fully editable from the Plan view -- this is just a
// reasonable seed, not a fixed program.
export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const DAY_LABELS = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

// JS Date.getDay() is 0=Sunday..6=Saturday; map that to our mon-first keys.
const JS_DAY_TO_KEY = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
export function dayKeyForDate(date) {
  return JS_DAY_TO_KEY[date.getDay()];
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function exercise(name, sets, reps) {
  return { id: uid(), name, sets, reps };
}

export function defaultDays() {
  return {
    mon: { title: 'Push', exercises: [
      exercise('Bench Press', 4, '6-8'),
      exercise('Overhead Press', 3, '8-10'),
      exercise('Triceps Pushdown', 3, '10-12'),
    ] },
    tue: { title: 'Pull', exercises: [
      exercise('Deadlift', 3, '5'),
      exercise('Pull-ups', 4, '6-10'),
      exercise('Barbell Row', 3, '8-10'),
    ] },
    wed: { title: 'Rest', exercises: [] },
    thu: { title: 'Legs', exercises: [
      exercise('Squat', 4, '6-8'),
      exercise('Romanian Deadlift', 3, '8-10'),
      exercise('Calf Raise', 3, '12-15'),
    ] },
    fri: { title: 'Full Body', exercises: [
      exercise('Incline Press', 3, '8-10'),
      exercise('Lat Pulldown', 3, '10-12'),
      exercise('Lunges', 3, '10 each leg'),
    ] },
    sat: { title: 'Cardio', exercises: [
      exercise('Run or Bike', 1, '30 min'),
    ] },
    sun: { title: 'Rest', exercises: [] },
  };
}
