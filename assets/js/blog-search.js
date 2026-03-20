(function () {
  const ALL_POSTS = JSON.parse(document.getElementById('post-data').textContent);
  const state = { query: '', category: 'all', page: 1, perPage: 6 };

  const postsContainer = document.getElementById('posts-container');
  const paginationControls = document.getElementById('pagination-controls');
  const noResults = document.getElementById('no-results');
  const searchInput = document.getElementById('blog-search');
  const categoryFilters = document.getElementById('category-filters');

  function filterPosts() {
    let posts = ALL_POSTS;

    if (state.query) {
      const q = state.query.toLowerCase();
      posts = posts.filter(function (p) {
        const text = [p.title, p.excerpt, p.description, (p.tags || []).join(' '), (p.categories || []).join(' ')].join(' ').toLowerCase();
        return text.includes(q);
      });
    }

    if (state.category !== 'all') {
      posts = posts.filter(function (p) {
        return (p.categories || []).map(function (c) { return c.toLowerCase(); }).includes(state.category);
      });
    }

    return posts;
  }

  function renderCards(posts) {
    if (posts.length === 0) {
      postsContainer.innerHTML = '';
      noResults.hidden = false;
      return;
    }

    noResults.hidden = true;
    postsContainer.innerHTML = posts.map(function (post) {
      const categories = (post.categories || []).map(function (c) {
        return '<span>' + escapeHtml(c) + '</span>';
      }).join(', ');

      const excerpt = post.description || post.excerpt || '';

      return '<article class="post-card">' +
        '<div class="post-meta">' +
        '<span><i class="far fa-calendar"></i> ' + escapeHtml(post.date) + '</span>' +
        (categories ? '<span><i class="fas fa-folder"></i> ' + categories + '</span>' : '') +
        '</div>' +
        '<h3 class="post-title"><a href="' + post.url + '">' + escapeHtml(post.title) + '</a></h3>' +
        '<p class="post-excerpt">' + escapeHtml(excerpt) + '</p>' +
        '<a href="' + post.url + '" class="read-more">Read More <i class="fas fa-arrow-right"></i></a>' +
        '</article>';
    }).join('');
  }

  function renderPagination(total) {
    const totalPages = Math.ceil(total / state.perPage);

    if (totalPages <= 1) {
      paginationControls.innerHTML = '';
      return;
    }

    let html = '';
    html += '<button class="pagination-btn" data-page="prev" ' + (state.page === 1 ? 'disabled' : '') + '><i class="fas fa-chevron-left"></i></button>';

    for (let i = 1; i <= totalPages; i++) {
      html += '<button class="pagination-btn' + (i === state.page ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }

    html += '<button class="pagination-btn" data-page="next" ' + (state.page === totalPages ? 'disabled' : '') + '><i class="fas fa-chevron-right"></i></button>';

    paginationControls.innerHTML = html;
  }

  function render() {
    const filtered = filterPosts();
    const total = filtered.length;
    const start = (state.page - 1) * state.perPage;
    const paginated = filtered.slice(start, start + state.perPage);

    renderCards(paginated);
    renderPagination(total);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Search input with debounce
  var debounceTimer;
  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      state.query = searchInput.value.trim();
      state.page = 1;
      render();
    }, 200);
  });

  // Category filter buttons
  categoryFilters.addEventListener('click', function (e) {
    var btn = e.target.closest('.category-btn');
    if (!btn) return;

    categoryFilters.querySelectorAll('.category-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    btn.classList.add('active');

    state.category = btn.dataset.category;
    state.page = 1;
    render();
  });

  // Pagination (event delegation)
  paginationControls.addEventListener('click', function (e) {
    var btn = e.target.closest('.pagination-btn');
    if (!btn || btn.disabled) return;

    var page = btn.dataset.page;
    var totalPages = Math.ceil(filterPosts().length / state.perPage);

    if (page === 'prev') {
      state.page = Math.max(1, state.page - 1);
    } else if (page === 'next') {
      state.page = Math.min(totalPages, state.page + 1);
    } else {
      state.page = parseInt(page, 10);
    }

    render();
    postsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Initial render
  render();
})();
