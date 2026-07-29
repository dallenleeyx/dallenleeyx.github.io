import Link from 'next/link';
import { auth } from '../lib/auth';
import { SignInGate } from '../components/auth/SignInGate';

export default async function Page() {
  const session = await auth();
  if (!session) return <SignInGate />;
  return (
    <div className="tk-loading-screen">
      <div style={{ textAlign: 'center' }}>
        <h1 className="tk-brand-name" style={{ fontSize: '1.6rem', marginBottom: '1.2rem' }}>Dashboard</h1>
        <p className="tk-note-p" style={{ marginBottom: '1.6rem' }}>Combined tasks and goals are coming soon.</p>
        <div style={{ display: 'flex', gap: '.8rem', justifyContent: 'center' }}>
          <Link className="tk-btn tk-btn-primary tk-btn-sm" href="/math">Math</Link>
          <Link className="tk-btn tk-btn-outline tk-btn-sm" href="/japanese">Japanese</Link>
        </div>
      </div>
    </div>
  );
}
