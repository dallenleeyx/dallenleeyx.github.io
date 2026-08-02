'use client';
// components/tracker/visualizers/GeoGebraVisualizer.jsx — runs a post's
// pasted GeoGebra commands (one per line) inside an embedded GeoGebra
// Classic applet. GeoGebra's own embed API (deployggb.js) injects
// directly into the host page with no sandboxing of its own, but there's
// no reason to give that up just because the input changed from raw HTML
// to math commands: a small fixed wrapper (GeoGebra's script tag, the
// applet container, and the user's commands run via evalCommand) is
// generated and run inside the same sandboxed iframe
// (sandbox="allow-scripts", no allow-same-origin) the previous
// HTML-paste version used, so pasted commands still can't reach this
// site's cookies/session/DOM.
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
      sandbox="allow-scripts"
      srcDoc={buildSrcDoc(code)}
      title="Visualizer"
    />
  );
}
