import './dashboard.css';
import { auth } from '../lib/auth';
import { SignInGate } from '../components/auth/SignInGate';
import { DashboardApp } from '../components/dashboard/DashboardApp';

export default async function Page() {
  const session = await auth();
  if (!session) return <SignInGate />;
  return <DashboardApp />;
}
