// Edit this one file to publish your own music and project links.
// Leave SoundCloud URLs empty until they point to work you own.
// Valid SoundCloud track and playlist URLs can be embedded directly.
export const MUSIC_CONFIG = {
  profileUrl: '',
  tracks: [
    // { title: 'Track title', category: 'Original score', url: 'https://soundcloud.com/you/track-slug' },
  ],
};

export const ENGINEERING_PROJECTS = [
  {
    number: '01', title: 'Paper-plane robotic bird', status: 'Concept / exploring',
    category: 'ROBOTICS · FLIGHT',
    summary: 'A camera-carrying robotic bird inspired by the simplicity of a paper aeroplane. The dream: lightweight, stable flight with a little bit of personality.',
    detail: 'Questions on the bench: lift vs weight, passive gliding, servos for steering, onboard camera power and radio control.',
    tags: ['Flight dynamics', 'Embedded systems', 'Camera', 'Prototyping'],
  },
  {
    number: '02', title: 'Safety-aware robot control', status: 'Research interest',
    category: 'CONTROL · ROBOTICS',
    summary: 'Exploring how feedback controllers, energy constraints and mathematical safety guarantees can make physical robots easier to trust.',
    detail: 'Reading and experimentation roadmap: PD control, control Lyapunov and barrier functions, energy-aware safe response and compliance.',
    tags: ['Control theory', 'Safety', 'Dynamics', 'Lie groups'],
  },
  {
    number: '03', title: 'The electronics workbench', status: 'Ideas / planning',
    category: 'ELECTRONICS · MAKING',
    summary: 'A growing collection of small hardware experiments to build up sensors, actuators and microcontroller skills for bigger robotics projects.',
    detail: 'The starting kit: breadboards, microcontrollers, IMUs, motors and careful experiments. Future demos will live here.',
    tags: ['Arduino / ESP32', 'Sensors', 'Actuators', 'CAD'],
  },
];

export const ML_PROJECTS = [
  {
    title: 'PyTorch training workbench', type: 'INTERACTIVE DEMO', state: 'Playable now',
    summary: 'Train a tiny linear model in your browser and inspect its loss curve. The equivalent PyTorch implementation is shown beside it.',
    tags: ['Optimization', 'Gradient descent', 'PyTorch'],
  },
  {
    title: 'Deep hedging & stochastic control', type: 'RESEARCH DIRECTION', state: 'Exploring',
    summary: 'Thinking about how learned policies can solve sequential financial decisions under uncertainty, costs and risk constraints.',
    tags: ['Stochastic control', 'Deep hedging', 'Finance'],
  },
  {
    title: 'Random matrix theory for portfolios', type: 'RESEARCH DIRECTION', state: 'Exploring',
    summary: 'Studying covariance estimation and eigenvalue noise as a bridge between mathematical theory and portfolio optimization.',
    tags: ['RMT', 'Statistics', 'Portfolio theory'],
  },
];
