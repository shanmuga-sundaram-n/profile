// Theme Switcher JavaScript
// NOTE: data-mode and data-theme are already set by the inline <head> script
// before any render. This file only wires the toggle's checked state and
// handles changes — no HTML injection needed (toggle is in the layout).
(function () {
  'use strict';

  function initThemeSwitcher() {
    var toggle = document.getElementById('modeToggle');
    if (!toggle) return;

    // Sync the checkbox state to the current mode
    var currentMode = document.documentElement.getAttribute('data-mode') || 'dark';
    toggle.checked = currentMode === 'light';

    toggle.addEventListener('change', function () {
      var mode = this.checked ? 'light' : 'dark';
      document.documentElement.setAttribute('data-mode', mode);
      localStorage.setItem('site-mode', mode);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeSwitcher);
  } else {
    initThemeSwitcher();
  }
})();
