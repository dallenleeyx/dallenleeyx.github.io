'use client';
// components/auth/SignInButton.jsx
import { signIn } from 'next-auth/react';

export function SignInButton() {
  return (
    <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={() => signIn('google')}>
      Sign in with Google
    </button>
  );
}
