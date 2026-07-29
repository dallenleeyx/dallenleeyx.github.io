// lib/auth.js — Auth.js v5 config. Single-user gate: only ALLOWED_EMAIL may
// sign in via Google. JWT session strategy, so no database adapter is needed.
import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ profile }) {
      return !!profile?.email && profile.email === process.env.ALLOWED_EMAIL;
    },
  },
});
