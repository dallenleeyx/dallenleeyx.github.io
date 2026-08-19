// site/assets/theme.js — manual light/dark toggle, persisted in localStorage.
// Falls back to the OS preference (handled in CSS via prefers-color-scheme)
// until the visitor picks explicitly.
(function () {
  var KEY = 'cvTheme';

  function apply(theme) {
    if (theme) document.documentElement.setAttribute('data-theme', theme);
    else document.documentElement.removeAttribute('data-theme');
  }

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}
  apply(saved);

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    function isDark() {
      var explicit = document.documentElement.getAttribute('data-theme');
      if (explicit) return explicit === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    function render() { btn.textContent = isDark() ? '☀️' : '🌙'; }
    render();

    btn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      render();
    });
  });
})();
