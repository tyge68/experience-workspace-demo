import { loadCSS } from '../../../scripts/aem.js';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Renders a "person" structured content document as a profile card.
 * Expected fields: name, birth_date, birth_place, nationality, bio, imdb_id.
 * @param {Element} block
 * @param {object} data
 */
export default async function renderPerson(block, data = {}) {
  await loadCSS(`${window.hlx.codeBasePath}/blocks/structured-content/renderers/person.css`);

  const card = document.createElement('article');
  card.className = 'sc-person';

  const name = document.createElement('h2');
  name.className = 'sc-person-name';
  name.textContent = data.name || '';
  card.append(name);

  const facts = [
    ['Born', [formatDate(data.birth_date), data.birth_place].filter(Boolean).join(' · ')],
    ['Nationality', data.nationality],
  ].filter(([, value]) => value);
  if (facts.length) {
    const dl = document.createElement('dl');
    dl.className = 'sc-person-facts';
    facts.forEach(([label, value]) => {
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      dl.append(dt, dd);
    });
    card.append(dl);
  }

  if (data.bio) {
    const bio = document.createElement('p');
    bio.className = 'sc-person-bio';
    bio.textContent = data.bio;
    card.append(bio);
  }

  if (/^nm\d+$/.test(data.imdb_id || '')) {
    const a = document.createElement('a');
    a.className = 'sc-person-imdb';
    a.href = `https://www.imdb.com/name/${data.imdb_id}/`;
    a.textContent = 'View on IMDb';
    a.target = '_blank';
    a.rel = 'noopener';
    card.append(a);
  }

  block.replaceChildren(card);
}
