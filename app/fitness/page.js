import './fitness.css';
import { auth } from '../../lib/auth';
import { SignInGate } from '../../components/auth/SignInGate';
import { FitnessAppShell } from '../../components/fitness/FitnessAppShell';

export default async function Page() {
  const session = await auth();
  if (!session) return <SignInGate />;
  return <FitnessAppShell />;
}
