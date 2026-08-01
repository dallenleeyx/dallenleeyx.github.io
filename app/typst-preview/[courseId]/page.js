// app/typst-preview/[courseId]/page.js — server wrapper that resolves the
// dynamic route param before handing off to the client viewer, so the
// client component always receives a plain string prop regardless of
// whether this Next.js version treats `params` as a Promise.
import { TypstPreviewViewer } from './TypstPreviewViewer';

export default async function TypstPreviewPage({ params }) {
  const { courseId } = await params;
  return <TypstPreviewViewer courseId={courseId} />;
}
