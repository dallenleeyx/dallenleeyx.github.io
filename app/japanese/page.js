import './japanese.css';
import { auth } from '../../lib/auth';
import { SignInGate } from '../../components/auth/SignInGate';
import { JapaneseAppShell } from '../../components/japanese/JapaneseAppShell';

export default async function Page() {
  const session = await auth();
  if (!session) return <SignInGate />;
  return <JapaneseAppShell />;
}
