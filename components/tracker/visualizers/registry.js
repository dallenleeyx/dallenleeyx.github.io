// components/tracker/visualizers/registry.js — one entry per visualizer
// type, so adding a new one (random walk, path homotopy, ...) later is
// just another entry here, not a change to VisualizerPost/AddVisualizerModal.
import { BandMatrixViz, BAND_MATRIX_DEFAULTS } from './BandMatrixViz';

export const VISUALIZER_TYPES = {
  bandMatrix: { label: 'Band matrix', Component: BandMatrixViz, defaultParams: BAND_MATRIX_DEFAULTS },
};
