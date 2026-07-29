import { auth } from '../lib/auth';
import { SignInGate } from '../components/auth/SignInGate';
import { RootRedirect } from '../components/nav/RootRedirect';

export default async function Page() {
  const session = await auth();
  if (!session) return <SignInGate />;
  return <RootRedirect />;
}
