// Theme Switcher JavaScript
(function () {
  'use strict';

  const themes = [
    {
      id: 'purple-pink',
      name: 'Purple Pink',
      colors: ['#6366f1', '#8b5cf6', '#ec4899']
    },
    {
      id: 'orange-red',
      name: 'Orange Red',
      colors: ['#f59e0b', '#ef4444', '#f97316']
    }
  ];

  // Get saved theme or default to orange-red
  const savedTheme = localStorage.getItem('site-theme') || 'orange-red';

  // Apply theme on page load
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeSwitcher);
  } else {
    initThemeSwitcher();
  }

  function initThemeSwitcher() {
    createThemeSwitcher();
  }

  function createThemeSwitcher() {
    // Create theme switcher HTML
    const switcherHTML = `
      <div class="theme-switcher">
        <button class="theme-toggle-btn" id="themeToggle" aria-label="Toggle theme menu">
          <span>Theme</span>
          <i class="fas fa-chevron-down"></i>
        </button>
        <div class="theme-menu" id="themeMenu">
          ${themes.map(theme => `
            <div class="theme-option" data-theme="${theme.id}">
              <div class="theme-color-preview" style="background: linear-gradient(135deg, ${theme.colors[0]} 0%, ${theme.colors[1]} 50%, ${theme.colors[2]} 100%);"></div>
              <span class="theme-name">${theme.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Insert into header container
    const container = document.getElementById('themeSwitcherContainer');
    if (container) {
      container.innerHTML = switcherHTML;
    }

    // Get elements
    const toggleBtn = document.getElementById('themeToggle');
    const themeMenu = document.getElementById('themeMenu');
    const themeOptions = document.querySelectorAll('.theme-option');

    // Mark active theme
    updateActiveTheme(savedTheme);

    // Toggle menu
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.theme-switcher')) {
        themeMenu.classList.remove('active');
      }
    });

    // Theme selection
    themeOptions.forEach(option => {
      option.addEventListener('click', () => {
        const themeId = option.getAttribute('data-theme');
        setTheme(themeId);
        themeMenu.classList.remove('active');
      });
    });
  }

  function setTheme(themeId) {
    document.documentElement.setAttribute('data-theme', themeId);
    localStorage.setItem('site-theme', themeId);
    updateActiveTheme(themeId);

    // Add a subtle animation effect
    document.body.style.transition = 'background-color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  function updateActiveTheme(themeId) {
    document.querySelectorAll('.theme-option').forEach(option => {
      if (option.getAttribute('data-theme') === themeId) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }
})();
