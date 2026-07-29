import { auth } from '../../lib/auth';
import { SignInGate } from '../../components/auth/SignInGate';

export default async function Page() {
  const session = await auth();
  if (!session) return <SignInGate />;
  return (
    <div className="tk-loading-screen">
      <div style={{ textAlign: 'center' }}>Japanese app coming soon.</div>
    </div>
  );
}
