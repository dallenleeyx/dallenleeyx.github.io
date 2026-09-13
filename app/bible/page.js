import './bible.css';
import { auth } from '../../lib/auth';
import { SignInGate } from '../../components/auth/SignInGate';
import { BibleAppShell } from '../../components/bible/BibleAppShell';

export default async function Page() {
  const session = await auth();
  if (!session) return <SignInGate />;
  return <BibleAppShell />;
}
