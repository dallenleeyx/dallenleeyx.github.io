// site/assets/projects-data.js — everything projects.html renders. Edit the
// array below with your real Colab notebooks; nothing else needs to change.
// `colabUrl` should point straight at the notebook ("Share" -> "Copy link"
// in Colab). `category` is freeform -- the filter pills on projects.html
// are generated automatically from whatever values appear here.
var COLAB_PROJECTS = [
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
