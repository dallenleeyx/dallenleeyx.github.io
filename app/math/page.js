import 'katex/dist/katex.min.css';
import './math.css';
import { auth } from '../../lib/auth';
import { SignInGate } from '../../components/auth/SignInGate';
import { MathAppShell } from '../../components/math/MathAppShell';

export default async function Page() {
  const session = await auth();
  if (!session) return <SignInGate />;
  return <MathAppShell />;
}
