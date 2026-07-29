import { auth } from '../../lib/auth';
import { SignInGate } from '../../components/auth/SignInGate';
import { TrackerApp } from '../../components/tracker/TrackerApp';

export default async function Page() {
  const session = await auth();
  if (!session) return <SignInGate />;
  return <TrackerApp />;
}
