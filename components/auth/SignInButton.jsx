'use client';
// components/auth/SignInButton.jsx
import { signIn } from 'next-auth/react';

export function SignInButton() {
  return (
    <button className="auth-btn" onClick={() => signIn('google')}>
      Sign in with Google
    </button>
  );
}
