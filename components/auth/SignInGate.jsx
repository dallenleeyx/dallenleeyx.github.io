// components/auth/SignInGate.jsx — shown when there is no authenticated session
import { SignInButton } from './SignInButton';

export function SignInGate() {
  return (
    <div className="auth-gate">
      <div>
        <div className="auth-gate-brand">Dallen Lee</div>
        <p className="auth-gate-sub">Sign in to continue.</p>
        <SignInButton />
      </div>
    </div>
  );
}
