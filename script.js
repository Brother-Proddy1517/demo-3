(() => {
  // Mobile menu
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  toggle.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', nav.classList.toggle('open'));
  });
  nav.addEventListener('click', e => {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', false); }
  });

  // Liturgical season: sets the colour band from today's date
  const easter = y => {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
      f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
      i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
      m = Math.floor((a + 11 * h + 22 * l) / 451), t = h + l - 7 * m + 114;
    return new Date(y, Math.floor(t / 31) - 1, (t % 31) + 1);
  };
  const shift = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const season = (now = new Date()) => {
    const t = new Date(now.getFullYear(), now.getMonth(), now.getDate()), y = t.getFullYear();
    const E = easter(y), x = new Date(y, 11, 25), advent = shift(x, -((x.getDay() || 7) + 21));
    if (t >= x || (t.getMonth() === 0 && t.getDate() <= 5)) return ['Christmastide', '#a07b16'];
    if (t >= advent) return ['Advent', '#4B2E83'];
    if (t >= shift(E, -46) && t < E) return ['Lent', '#3d236f'];
    if (t >= E && t < shift(E, 49)) return ['Eastertide', '#a07b16'];
    if (+t === +shift(E, 49)) return ['Pentecost', '#9E1B2E'];
    return ['Ordinary Time', '#3F6B3A'];
  };
  const [name, color] = season();
  document.documentElement.style.setProperty('--season', color);
  document.getElementById('season-text').textContent = name;

  // Calendar filters
  const chips = document.querySelectorAll('.chip');
  const items = document.querySelectorAll('.event-list li');
  chips.forEach(chip => chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.toggle('is-active', c === chip));
    const f = chip.dataset.filter;
    items.forEach(li => { li.hidden = f !== 'all' && li.dataset.cat !== f; });
  }));

  // Visit form (demo only: nothing is sent)
  const form = document.getElementById('visit-form');
  const msg = form.querySelector('.form-msg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('[required]').forEach(el => {
      const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
      el.setAttribute('aria-invalid', bad);
      if (bad) ok = false;
    });
    msg.textContent = ok
      ? `Thank you, ${form.name.value.split(' ')[0]}. We look forward to seeing you at ${form.service.value}.`
      : 'Please enter your name and a valid email address.';
    if (ok) form.reset();
  });
})();
