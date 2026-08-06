'use client';
// components/dashboard/DashboardApp.jsx — the "/" Dashboard: assistant
// panel up top, today's tasks / 6-month plan / reports below.
import { useState } from 'react';
import { useCoursesSync } from '../../lib/useCoursesSync';
import { useGoalPlanSync } from '../../hooks/dashboard/useGoalPlanSync';
import { useDashboardReports } from '../../hooks/dashboard/useDashboardReports';
import { AssistantPanel } from './AssistantPanel';
import { TodayTasks } from './TodayTasks';
import { PlanTimeline } from './PlanTimeline';
import { MorningReport } from './MorningReport';
import { EveningReport } from './EveningReport';
import { PlanSetupModal } from './PlanSetupModal';

export function DashboardApp() {
  const { courses } = useCoursesSync();
  const { plan, regenerating, regeneratePlan } = useGoalPlanSync();
  const { reports, loading: reportsLoading } = useDashboardReports();
  const [setupOpen, setSetupOpen] = useState(false);

  const handleGenerate = async (input) => {
    const result = await regeneratePlan(input);
    if (result.ok) setSetupOpen(false);
    else window.alert('Could not generate the plan. Please try again.');
  };

  return (
    <div className="dash-shell">
      <div className="dash-header">
        <h1>Dashboard</h1>
        <div className="sub">Everything you need to do, in one place</div>
      </div>

      <AssistantPanel />

      <div className="dash-grid">
        <TodayTasks />
        <MorningReport reports={reports} loading={reportsLoading} />
        <EveningReport reports={reports} loading={reportsLoading} />
        <PlanTimeline plan={plan} onOpenSetup={() => setSetupOpen(true)} />
      </div>

      {setupOpen && (
        <PlanSetupModal
          courses={courses || []}
          plan={plan}
          generating={regenerating}
          onClose={() => setSetupOpen(false)}
          onGenerate={handleGenerate}
        />
      )}
    </div>
  );
}
