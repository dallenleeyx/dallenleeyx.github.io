// site/assets/projects.js — search + category filter for projects.html.
// Reads COLAB_PROJECTS from projects-data.js (loaded first).
(function () {
  var ALL = 'All';
  var state = { query: '', category: ALL };

  var grid = document.querySelector('.proj-grid');
  var empty = document.querySelector('.proj-empty');
  var count = document.querySelector('.proj-count');
  var filtersEl = document.querySelector('.proj-filters');
  var searchInput = document.querySelector('.proj-search input');

  function categories() {
    var set = [ALL];
    COLAB_PROJECTS.forEach(function (p) {
      if (set.indexOf(p.category) === -1) set.push(p.category);
    });
    return set;
  }

  function cardHtml(p) {
    var title = escapeHtml(p.title);
    var desc = escapeHtml(p.description);
    var cat = escapeHtml(p.category);
    return (
      '<a class="proj-card" href="' + encodeURI(p.colabUrl) + '" target="_blank" rel="noreferrer noopener">' +
        '<div class="proj-card-head">' +
          '<span class="proj-card-category">' + cat + '</span>' +
          '<span class="proj-card-icon" aria-hidden="true">↗</span>' +
        '</div>' +
        '<h3 class="proj-card-title">' + title + '</h3>' +
        '<p class="proj-card-desc">' + desc + '</p>' +
        '<span class="proj-card-cta">Open in Colab</span>' +
      '</a>'
    );
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function render() {
    var q = state.query.trim().toLowerCase();
    var filtered = COLAB_PROJECTS.filter(function (p) {
      var matchesCategory = state.category === ALL || p.category === state.category;
      var matchesQuery = !q
        || p.title.toLowerCase().indexOf(q) !== -1
        || p.description.toLowerCase().indexOf(q) !== -1;
      return matchesCategory && matchesQuery;
    });

    count.textContent = filtered.length + ' project' + (filtered.length === 1 ? '' : 's');

    if (filtered.length > 0) {
      grid.style.display = '';
      empty.style.display = 'none';
      grid.innerHTML = filtered.map(cardHtml).join('');
    } else {
      grid.style.display = 'none';
      empty.style.display = '';
      empty.textContent = COLAB_PROJECTS.length === 0
        ? 'No projects yet — check back soon.'
        : 'No projects match ' + (state.query ? '“' + state.query + '”' : 'this category') + '.';
    }
  }

  function renderFilters() {
    filtersEl.innerHTML = categories().map(function (c) {
      var active = c === state.category ? ' active' : '';
      return '<button type="button" class="proj-filter' + active + '" data-category="' + escapeHtml(c) + '" aria-pressed="' + (c === state.category) + '">' + escapeHtml(c) + '</button>';
    }).join('');

    Array.prototype.forEach.call(filtersEl.querySelectorAll('.proj-filter'), function (btn) {
      btn.addEventListener('click', function () {
        state.category = btn.getAttribute('data-category');
        renderFilters();
        render();
      });
    });
  }

  searchInput.addEventListener('input', function (e) {
    state.query = e.target.value;
    render();
  });

  renderFilters();
  render();
})();
