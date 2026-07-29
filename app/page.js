import { auth } from '../lib/auth';
import { SignInGate } from '../components/auth/SignInGate';
import { Dashboard } from '../components/dashboard/Dashboard';

export default async function Page() {
  const session = await auth();
  if (!session) return <SignInGate />;
  return <Dashboard />;
}
