(() => {
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('#entry-search');
  const rows = [...document.querySelectorAll('.entry-row')];
  const empty = document.querySelector('.no-results');
  let filter = 'All';
  function update() {
    const query = search.value.trim().toLowerCase();
    let shown = 0;
    rows.forEach(row => {
      const visible = (filter === 'All' || row.dataset.kind === filter)
        && (!query || row.textContent.toLowerCase().includes(query));
      row.hidden = !visible;
      if (visible) shown++;
    });
    empty.hidden = rows.length === 0 || shown > 0;
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    buttons.forEach(b => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
    update();
  }));
  search.addEventListener('input', update);
})();
