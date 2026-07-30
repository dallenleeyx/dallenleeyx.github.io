// Shown instantly while the session check + RSC payload for /japanese load.
// Inline-styled (not a japanese.css class) since that stylesheet is imported
// by page.js itself and may not have loaded yet on a cold navigation here.
export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#fff',
        color: '#111',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      Loading…
    </div>
  );
}
