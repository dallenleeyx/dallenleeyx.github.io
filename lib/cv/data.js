// lib/cv/data.js — everything the public CV site (/ and /projects) renders
// text-wise. Edit the values below with your real info; nothing else in
// components/home or components/projects needs to change.

export const PROFILE = {
  name: 'Dallen Lee',
  tagline: 'Computer Science student building software and machine learning projects.',
  bio: "I'm a Computer Science student interested in machine learning, data, and building "
    + 'useful software. This site collects my writing, coursework, and a running log of the '
    + 'notebooks I build in Google Colab.',
  // Longer version shown in the About section — replace with your real bio.
  aboutLong: "I'm currently studying Computer Science, with a focus on machine learning and "
    + 'data-driven systems. Outside of coursework I like turning small ideas into working '
    + 'prototypes — most of them start as a Google Colab notebook before becoming anything '
    + 'bigger. This site is where I keep a public record of that work: papers and projects '
    + "I've written, the courses that shaped how I think about the field, and the notebooks "
    + 'themselves.',
  focusAreas: ['Machine Learning', 'Data Science', 'Software Engineering', 'NLP'],
  // Replace with a real contact email you want public — kept as a placeholder for now.
  email: 'your.email@example.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/dallenleeyx' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/your-handle' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/' },
  ],
};

// Papers / write-ups / notable projects shown on the home page.
// `href` is optional — omit it (or leave empty) for entries with no public link yet.
export const WRITING = [
  {
    tag: 'Machine Learning',
    title: 'Predicting Student Performance with Ensemble Learning',
    description:
      'Compared gradient boosting and random forest models on academic performance data, '
      + 'with an emphasis on feature importance and fairness across subgroups.',
    href: '',
  },
  {
    tag: 'NLP',
    title: 'Efficient Attention Mechanisms for Long-Context Models',
    description:
      'A survey and small-scale implementation of sparse and linear attention variants, '
      + 'benchmarked on throughput and downstream accuracy.',
    href: '',
  },
  {
    tag: 'Algorithms',
    title: 'Sorting Algorithms Under Real-World Data Distributions',
    description:
      'An empirical comparison of classic sorting algorithms on non-uniform, real-world '
      + 'datasets rather than the usual randomized benchmarks.',
    href: '',
  },
];

// Coursework, grouped for display. Add/remove groups and items freely.
export const COURSES = [
  {
    category: 'Computer Science',
    items: ['Data Structures & Algorithms', 'Operating Systems', 'Computer Networks', 'Database Systems'],
  },
  {
    category: 'Mathematics & Statistics',
    items: ['Linear Algebra', 'Multivariable Calculus', 'Probability & Statistics', 'Discrete Mathematics'],
  },
  {
    category: 'Machine Learning & AI',
    items: ['Machine Learning', 'Deep Learning', 'Natural Language Processing', 'Computer Vision'],
  },
];

// Google Colab projects listed on /projects. `colabUrl` should point straight at the
// notebook ("Share" → "Copy link" in Colab). Category is freeform — the filter pills
// on /projects are generated automatically from whatever values appear here.
export const COLAB_PROJECTS = [
  {
    title: 'Housing Price Prediction with Gradient Boosting',
    description: 'End-to-end regression pipeline on housing data: cleaning, feature engineering, and an XGBoost model tuned with cross-validation.',
    category: 'Machine Learning',
    colabUrl: 'https://colab.research.google.com/',
  },
  {
    title: 'Sentiment Analysis on Social Media Posts',
    description: 'Fine-tuned a lightweight transformer to classify sentiment on short-form text, with an error analysis of the hardest cases.',
    category: 'NLP',
    colabUrl: 'https://colab.research.google.com/',
  },
  {
    title: 'Exploratory Analysis of Global Climate Data',
    description: 'Cleaned and visualized decades of temperature and precipitation records to surface long-term regional trends.',
    category: 'Data Analysis',
    colabUrl: 'https://colab.research.google.com/',
  },
  {
    title: 'Handwritten Digit Recognition from Scratch',
    description: 'A convolutional neural network built with NumPy only (no autograd) to understand backprop at the implementation level.',
    category: 'Computer Vision',
    colabUrl: 'https://colab.research.google.com/',
  },
  {
    title: 'Movie Recommendation Engine',
    description: 'Collaborative filtering with matrix factorization, compared against a simple content-based baseline on the MovieLens dataset.',
    category: 'Machine Learning',
    colabUrl: 'https://colab.research.google.com/',
  },
  {
    title: 'Named Entity Recognition for News Articles',
    description: 'Trained a sequence-tagging model to extract people, organizations, and locations from raw news text.',
    category: 'NLP',
    colabUrl: 'https://colab.research.google.com/',
  },
];
