import './music.css';
import { auth } from '../../lib/auth';
import { SignInGate } from '../../components/auth/SignInGate';
import { MusicAppShell } from '../../components/music/MusicAppShell';

export default async function Page() {
  const session = await auth();
  if (!session) return <SignInGate />;
  return <MusicAppShell />;
}
