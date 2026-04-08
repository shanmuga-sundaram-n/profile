// Site-wide search powered by Fuse.js
// Opens with ⌘K / Ctrl+K or clicking the search icon in the nav

(function () {
  'use strict';

  var INDEX_URL = '/search.json';
  var fuse = null;
  var overlay = null;
  var input = null;
  var results = null;
  var selectedIndex = -1;

  // ── Bootstrap ─────────────────────────────────────────────────────────
  function init() {
    overlay = document.getElementById('site-search-overlay');
    input   = document.getElementById('site-search-input');
    results = document.getElementById('site-search-results');

    if (!overlay || !input || !results) return;

    // Keyboard shortcut: ⌘K / Ctrl+K
    document.addEventListener('keydown', function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') closeSearch();
    });

    // Close when clicking backdrop
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeSearch();
    });

    // Keyboard navigation inside results
    input.addEventListener('keydown', handleArrowKeys);

    // Live search on input
    var debounce;
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        selectedIndex = -1;
        renderResults(input.value.trim());
      }, 150);
    });

    // Search icon button
    var btn = document.getElementById('site-search-btn');
    if (btn) btn.addEventListener('click', openSearch);
  }

  // ── Open / Close ──────────────────────────────────────────────────────
  function openSearch() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    input.focus();
    input.select();

    // Lazy-load the index once
    if (!fuse) loadIndex();
    else renderResults(input.value.trim());
  }

  function closeSearch() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    results.innerHTML = '';
    selectedIndex = -1;
  }

  // ── Index loading ─────────────────────────────────────────────────────
  function loadIndex() {
    results.innerHTML = '<p class="site-search-hint">Loading index…</p>';

    fetch(INDEX_URL)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        // Filter out nulls / bad entries
        var items = data.filter(function (d) { return d && d.title; });

        fuse = new Fuse(items, {
          keys: [
            { name: 'title',       weight: 0.4 },
            { name: 'description', weight: 0.25 },
            { name: 'content',     weight: 0.2 },
            { name: 'excerpt',     weight: 0.1 },
            { name: 'tags',        weight: 0.03 },
            { name: 'categories',  weight: 0.02 }
          ],
          threshold: 0.35,
          ignoreLocation: true,
          includeMatches: true,
          minMatchCharLength: 2
        });

        renderResults(input.value.trim());
      })
      .catch(function () {
        results.innerHTML = '<p class="site-search-hint">Could not load search index.</p>';
      });
  }

  // ── Render results ────────────────────────────────────────────────────
  function renderResults(query) {
    if (!fuse) return;

    results.innerHTML = '';
    selectedIndex = -1;

    if (!query) {
      results.innerHTML = '<p class="site-search-hint">Type to search pages, posts & projects…</p>';
      return;
    }

    var hits = fuse.search(query).slice(0, 8);

    if (!hits.length) {
      results.innerHTML = '<p class="site-search-hint">No results for <strong>' + escHtml(query) + '</strong></p>';
      return;
    }

    var html = hits.map(function (hit, i) {
      var item = hit.item;
      var typeIcon = item.type === 'post' ? 'fa-newspaper' : item.type === 'project' ? 'fa-project-diagram' : 'fa-file-alt';
      var typeLabel = item.type === 'post' ? 'Post' : item.type === 'project' ? 'Project' : 'Page';
      var desc = item.description || item.excerpt || '';
      if (desc.length > 120) desc = desc.slice(0, 120) + '…';

      return '<a href="' + escHtml(item.url) + '" class="site-search-item" data-idx="' + i + '">' +
        '<div class="site-search-item-icon"><i class="fas ' + typeIcon + '"></i></div>' +
        '<div class="site-search-item-body">' +
          '<div class="site-search-item-title">' + highlight(item.title, query) + '</div>' +
          (desc ? '<div class="site-search-item-desc">' + escHtml(desc) + '</div>' : '') +
        '</div>' +
        '<div class="site-search-item-meta">' +
          '<span class="site-search-type">' + typeLabel + '</span>' +
          (item.date ? '<span class="site-search-date">' + escHtml(item.date) + '</span>' : '') +
        '</div>' +
        '</a>';
    }).join('');

    results.innerHTML = html;

    // Navigate on click — closeSearch handled by navigation
    results.querySelectorAll('.site-search-item').forEach(function (el) {
      el.addEventListener('click', closeSearch);
    });
  }

  // ── Arrow-key navigation ──────────────────────────────────────────────
  function handleArrowKeys(e) {
    var items = results.querySelectorAll('.site-search-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      updateSelection(items);
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      items[selectedIndex].click();
    }
  }

  function updateSelection(items) {
    items.forEach(function (el, i) {
      el.classList.toggle('selected', i === selectedIndex);
    });
    if (selectedIndex >= 0) items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }

  // ── Helpers ───────────────────────────────────────────────────────────
  function escHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlight(text, query) {
    if (!text || !query) return escHtml(text);
    var safe = escHtml(text);
    var safeQ = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return safe.replace(new RegExp('(' + safeQ + ')', 'gi'), '<mark>$1</mark>');
  }

  // ── Boot ──────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
