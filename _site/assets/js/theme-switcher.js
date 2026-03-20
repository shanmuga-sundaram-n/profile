// Theme Switcher JavaScript
(function () {
  'use strict';

  // Detect system preference for dark/light mode
  function detectSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  // Get saved mode; on first visit default to dark and persist it
  const savedMode = localStorage.getItem('site-mode') || (localStorage.setItem('site-mode', 'dark'), 'dark');

  // Always use orange-red theme
  document.documentElement.setAttribute('data-mode', savedMode);
  document.documentElement.setAttribute('data-theme', 'orange-red');

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeSwitcher);
  } else {
    initThemeSwitcher();
  }

  function initThemeSwitcher() {
    createModeToggle();
  }

  function createModeToggle() {
    const currentMode = document.documentElement.getAttribute('data-mode') || 'dark';
    const checked = currentMode === 'light' ? 'checked' : '';

    const modeToggleHTML = `
      <label class="mode-switch" aria-label="Toggle dark/light mode">
        <input type="checkbox" id="modeToggle" ${checked}>
        <span class="mode-slider">
          <i class="fas fa-sun mode-icon-sun"></i>
          <i class="fas fa-moon mode-icon-moon"></i>
        </span>
      </label>
    `;

    const container = document.getElementById('modeToggleContainer');
    if (container) {
      container.innerHTML = modeToggleHTML;
    }

    const toggleInput = document.getElementById('modeToggle');
    if (toggleInput) {
      toggleInput.addEventListener('change', function () {
        setMode(this.checked ? 'light' : 'dark');
      });
    }
  }

  function setMode(mode) {
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('site-mode', mode);
  }
})();
