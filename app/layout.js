import './colors_and_type.css';
import './shell.css';
import { AppNav } from '../components/nav/AppNav';

export const metadata = {
  title: 'Dallen Lee',
};

const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem('proofLabTheme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Both sites' fonts loaded upfront as real <link> tags (not a CSS @import,
            which chains a fetch off the stylesheet instead of starting immediately
            with the HTML), so switching between /japanese and /fitness never
            waits on a fresh font fetch. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=DM+Mono:wght@300;400;500&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Shippori+Mincho:wght@400;500;600;700&family=STIX+Two+Text:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <div id="root">{children}</div>
        <AppNav />
      </body>
    </html>
  );
}
