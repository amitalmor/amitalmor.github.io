document.documentElement.classList.add('js');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  toggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    toggle.focus();
  }
});
const filters = document.querySelector('.filters');
if (filters) {
  filters.hidden = false;
  const entries = [...document.querySelectorAll('[data-publication]')];
  const search = document.querySelector('#publication-search');
  const year = document.querySelector('#publication-year');
  const topic = document.querySelector('#publication-topic');
  function restoreFilters() {
    const params = new URLSearchParams(location.search);
    const requestedArea = params.get('area') || '';
    const requestedYear = params.get('year') || '';
    topic.value = [...topic.options].some(option => option.value === requestedArea) ? requestedArea : '';
    year.value = [...year.options].some(option => option.value === requestedYear) ? requestedYear : '';
    search.value = (params.get('q') || '').slice(0, 500);
  }
  function update() {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const entry of entries) {
      const match = (!query || entry.textContent.toLocaleLowerCase().includes(query)) &&
        (!year.value || entry.dataset.year === year.value) &&
        (!topic.value || entry.dataset.topics.split(',').includes(topic.value));
      entry.hidden = !match;
      if (match) count++;
    }
    document.querySelectorAll('.publication-group').forEach(group => {
      group.hidden = ![...group.querySelectorAll('[data-publication]')].some(entry => !entry.hidden);
    });
    document.querySelector('#results-count').textContent = `${count} ${count === 1 ? 'record' : 'records'} shown`;
    document.querySelector('#no-results').hidden = count !== 0;
    const url = new URL(location.href);
    for (const [key, value] of [['area', topic.value], ['year', year.value], ['q', search.value.trim()]]) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  }
  filters.addEventListener('input', update);
  filters.addEventListener('change', update);
  filters.addEventListener('reset', () => setTimeout(update, 0));
  window.addEventListener('popstate', () => { restoreFilters(); update(); });
  restoreFilters();
  update();
}
