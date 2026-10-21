import './portfolio.css';
import { PortfolioNav } from '../../components/portfolio/PortfolioNav';

export const metadata = {
  title: 'Portfolio · Dallen Lee',
  description: 'Music, robotics, and machine learning experiments by Dallen Lee.',
};

export default function PortfolioLayout({ children }) {
  return (
    <div className="pf-root">
      <PortfolioNav />
      {children}
      <footer className="pf-footer">
        <span>© Dallen Lee · Creative experiments, mathematical ideas, and things in progress.</span>
        <a href="https://github.com/dallenleeyx" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
      </footer>
    </div>
  );
}
