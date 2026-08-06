'use client';
// components/dashboard/DashboardApp.jsx — the "/" Dashboard: assistant
// panel up top, today's tasks below. The 6-month plan and morning/evening
// cron reports were cut (not worth the recurring Claude spend) -- the
// assistant + its accumulating memory are the investment now.
import { AssistantPanel } from './AssistantPanel';
import { TodayTasks } from './TodayTasks';

export function DashboardApp() {
  return (
    <div className="dash-shell">
      <div className="dash-header">
        <h1>Dashboard</h1>
        <div className="sub">Everything you need to do, in one place</div>
      </div>

      <AssistantPanel />

      <div className="dash-grid">
        <TodayTasks />
      </div>
    </div>
  );
}
