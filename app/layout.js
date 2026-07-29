import 'katex/dist/katex.min.css';
import './colors_and_type.css';
import './tracker.css';
import { AppNav } from '../components/nav/AppNav';

export const metadata = {
  title: 'The Proof Lab | Dallen Lee',
};

const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem('proofLabTheme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body data-screen-label="tracker">
        <div id="root">{children}</div>
        <AppNav />
      </body>
    </html>
  );
}
