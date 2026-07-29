// components/auth/SignInGate.jsx — shown when there is no authenticated session
import { SignInButton } from './SignInButton';

export function SignInGate() {
  return (
    <div className="tk-loading-screen">
      <div style={{ textAlign: 'center' }}>
        <div className="tk-brand-name" style={{ marginBottom: '.6rem' }}>The Proof Lab</div>
        <p className="tk-note-p" style={{ marginBottom: '1.4rem' }}>Sign in to access your courses.</p>
        <SignInButton />
      </div>
    </div>
  );
}
