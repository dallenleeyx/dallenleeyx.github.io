'use client';
// components/tracker/visualizers/GeoGebraVisualizer.jsx — runs a post's
// pasted GeoGebra commands (one per line) inside an embedded GeoGebra
// Classic applet, via a small fixed wrapper (GeoGebra's own script tag,
// the applet container, and the user's commands run via evalCommand) run
// inside an iframe.
//
// sandbox="allow-scripts allow-same-origin" -- NOT the allow-scripts-only
// sandbox the earlier raw-HTML-paste version used. GeoGebra's own bundle
// creates internal nested iframes as part of its own UI, and without
// allow-same-origin every sandboxed frame gets its own distinct opaque
// origin -- GeoGebra's internal frames then can't access each other's
// `document` at all, which throws "Blocked a frame at 'null' from
// accessing a frame at 'null': ... lack the allow-same-origin flag" and
// the applet never renders (confirmed: this is exactly the error a real
// deploy hit). allow-same-origin on srcdoc content resolves to this
// site's own origin (srcdoc has no independent URL of its own to be
// opaque about), so this iframe's content -- this wrapper script and
// GeoGebra's bundle -- does now run with the same DOM/cookie/session
// access the rest of the app has. Accepted deliberately: the only
// "untrusted" input here is GeoGebra command strings, a closed math-
// expression DSL with no way to execute arbitrary JS through
// evalCommand, and this is a single-user site where only the owner can
// ever paste anything into this box -- there's no other visitor for a
// malicious post to target.
function buildSrcDoc(commands) {
  // A literal "</script" inside the JSON-encoded commands string would
  // prematurely close the inline <script> block when the browser's HTML
  // parser scans for it -- that check is purely lexical (it doesn't know
  // about JS string escaping), so this has to happen before stringifying.
  const safeCommands = String(commands || '').replace(/<\/script/gi, '<\\/script');
  const commandsLiteral = JSON.stringify(safeCommands);
  return `<!doctype html>
<html>
<head><style>html,body{margin:0;padding:0;height:100%;overflow:hidden;}</style></head>
<body>
<div id="ggb" style="width:100%;height:100%;"></div>
<script src="https://www.geogebra.org/apps/deployggb.js"></script>
<script>
  var commands = ${commandsLiteral};
  var params = {
    appName: 'classic',
    width: window.innerWidth,
    height: window.innerHeight,
    showToolBar: false,
    showAlgebraInput: false,
    showMenuBar: false,
    showResetIcon: true,
    enableRightClick: false,
    errorDialogsActive: false,
    appletOnLoad: function(api) {
      commands.split('\\n').map(function(l) { return l.trim(); }).filter(Boolean).forEach(function(line) {
        try { api.evalCommand(line); } catch (e) {}
      });
    }
  };
  var applet = new GGBApplet(params, true);
  window.addEventListener('load', function() { applet.inject('ggb'); });
</script>
</body>
</html>`;
}

export function GeoGebraVisualizer({ code }) {
  return (
    <iframe
      className="tk-viz-iframe"
      sandbox="allow-scripts allow-same-origin"
      srcDoc={buildSrcDoc(code)}
      title="Visualizer"
    />
  );
}
