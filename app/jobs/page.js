import './jobs.css';
import { auth } from '../../lib/auth';
import { SignInGate } from '../../components/auth/SignInGate';
import { JobsAppShell } from '../../components/jobs/JobsAppShell';

export default async function Page() {
  const session = await auth();
  if (!session) return <SignInGate />;
  return <JobsAppShell />;
}
