// lib/dashboard/planSeed.js — the empty-state shape for a goal plan that
// hasn't been generated yet, returned by the API before any record exists
// (mirrors lib/seed-data.js's TRACKER_SEED role for courses).
export const EMPTY_GOAL_PLAN = {
  createdAt: null,
  jlptExamDate: null,
  courseTargets: [],
  milestones: [],
  narrative: '',
  generatedAt: null,
  generatedByModel: null,
};
