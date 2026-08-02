// components/tracker/visualizers/starterExample.js — a ready-to-run
// GeoGebra command example handed to "+ New visualizer", since starting
// from a blank command box isn't the point -- pasting a working example
// and tweaking it is. One command per line, run in order via evalCommand
// (see GeoGebraVisualizer.jsx). Slider(...) creates an actual draggable
// slider in the applet for n/b -- no separate range-input UI needed, the
// applet provides that itself.
export const BAND_MATRIX_EXAMPLE_GGB = `n = Slider(2, 24, 1)
b = Slider(0, 23, 1)
squares = Sequence(Sequence(SetColor(Rectangle((j - 1, i - 1), (j, i)), If(abs(i - j) <= b, 20, 235), If(abs(i - j) <= b, 20, 235), If(abs(i - j) <= b, 20, 235)), j, 1, n), i, 1, n)`;
