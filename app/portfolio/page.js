import Link from 'next/link';

const destinations = [
  { href: '/portfolio/music', index: '01', symbol: '♫', tag: 'SONIC JOURNAL', name: 'Music & Sound', blurb: 'Stories, textures and emotions — scored in sound.', tone: 'music', prompt: 'Enter the listening room' },
  { href: '/portfolio/engineering', index: '02', symbol: '✳', tag: 'THE WORKSHOP', name: 'Engineering', blurb: 'Curious machines, robotics concepts, and prototypes.', tone: 'engineering', prompt: 'Open the workshop' },
  { href: '/portfolio/ml', index: '03', symbol: '</>', tag: 'THE LAB', name: 'Machine Learning', blurb: 'Models, mathematical ideas and executable experiments.', tone: 'ml', prompt: 'Launch the lab' },
];

export default function PortfolioPage() {
  return (
    <main className="pf-container pf-index">
      <div className="pf-index-hero">
        <span className="pf-overline">WELCOME TO THE PLAYGROUND · EST. IN CURIOSITY</span>
        <h1>One mind.<br /><em>Three playgrounds.</em></h1>
        <p>A portfolio that feels more like a collection of little worlds. Pick a door, turn a dial, run an experiment.</p>
        <div className="pf-index-deco" aria-hidden="true">✳ <span>♪</span> ◉</div>
      </div>
      <div className="pf-world-grid">
        {destinations.map((world) => (
          <Link key={world.href} href={world.href} className={'pf-world pf-world-' + world.tone}>
            <span className="pf-world-top"><span>{world.index} / 03</span><span>↗</span></span>
            <span className="pf-world-symbol" aria-hidden="true">{world.symbol}</span>
            <span className="pf-overline">{world.tag}</span>
            <strong>{world.name}</strong>
            <span className="pf-world-blurb">{world.blurb}</span>
            <span className="pf-world-cta">{world.prompt} <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </div>
      <p className="pf-index-note">Built for exploration. Real projects and works will keep replacing the sketches as they evolve.</p>
    </main>
  );
}
