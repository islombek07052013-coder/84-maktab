/* Denov 84-maktab — script.js */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const norm = s => (s || '').toLowerCase().replace(/[‘’`ʻʼ'ʻ]/g, '').trim();

  /* O'qituvchilarni qidirish va fan bo'yicha saralash */
  function teachers() {
    const list = $('.featured-teachers-list'), tools =$('.t-tools'), empty = $('.t-empty'); if (!list \vert{}\vert{} !tools) return;  const cards = $$('.mini-card', list);
    if (!cards.length) return;

    const CATS = [
      ["Boshlang'ich", 'boshlangich'], 
      ['Ona tili', 'ona tili'], 
      ['Rus tili', 'rus tili'], 
      ['Ingliz tili', 'ingliz'], 
      ['Matematika', 'matematika'], 
      ['Informatika', 'informatika'],
      ['Fizika', 'fizika'], 
      ['Kimyo', 'kimyo'], 
      ['Biologiya', 'biologiya'], 
      ['Geografiya', 'geografiya'], 
      ['Tarix', 'tarix'], 
      ['Tarbiya', 'tarbiya'],
      ['Musiqa va San\'at', 'musiqa|tasviriy|chizmachilik'], 
      ['Jismoniy tarbiya', 'jismoniy']
    ];

    const data = cards.map(c => {
      const nameEl = $('h3', c);
      const roleEl = $('.teacher-role', c);
      const nameText = nameEl ? nameEl.textContent : '';
      const roleText = roleEl ? roleEl.textContent : '';
      const combined = norm(nameText + ' ' + roleText);
      
      let matchedCat = 'Boshqa';
      for (const [catName, keyword] of CATS) {
        if (new RegExp(keyword, 'i').test(norm(roleText))) {
          matchedCat = catName;
          break;
        }
      }
      return { c, cat: matchedCat, text: combined };
    });

    const activeCategories = ['Hammasi', ...CATS.map(c => c[0]), 'Boshqa'].filter(n => n === 'Hammasi' || data.some(d => d.cat === n));
    const chips = $('.t-chips', tools), input = $('#tSearch'), count = $('.t-count', tools);
    if (!chips || !input) return;

    let cur = 'Hammasi';
    chips.innerHTML = activeCategories.map(n => {
      const countNum = n === 'Hammasi' ? data.length : data.filter(d => d.cat === n).length;
      return `<button type="button" data-c="${n}">${n}<small>(${countNum})</small></button>`;
    }).join('');

    function apply() {
      const q = norm(input.value);
      let n = 0;
      data.forEach(d => {
        const matchesCat = (cur === 'Hammasi' || d.cat === cur);
        const matchesQuery = !q || d.text.includes(q);
        const ok = matchesCat && matchesQuery;
        d.c.hidden = !ok;
        if (ok) n++;
      });
      $$('button', chips).forEach(b => b.classList.toggle('on', b.dataset.c === cur));
      if (count) count.textContent = `${n} ta o'qituvchi topildi`;
      if (empty) empty.hidden = n > 0;
    }

    chips.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (b) {
        cur = b.dataset.c;
        apply();
      }
    });

    input.addEventListener('input', apply);
    tools.hidden = false;
    apply();
  }

  /* Qo'ng'iroq jadvali */
  function bells() {
    const items = $$('#bellList li'), out = $('#bellNow');
    if (!items.length || !out) return;
    const m = t => { const [h, mi] = t.split(':'); return +h * 60 + +mi; };
    const L = items.map(li => { 
      const span = $('span', li);
      if (span) span.textContent = `${li.dataset.s} – ${li.dataset.e}`; 
      return [m(li.dataset.s), m(li.dataset.e), li.dataset.s]; 
    });
    function tick() {
      const d = new Date(), n = d.getHours() * 60 + d.getMinutes();
      let msg, cur = -1;
      if (d.getDay() === 0) msg = 'Bugun dam olish kuni.';
      else {
        cur = L.findIndex(([a, b]) => n >= a && n < b);
        if (cur >= 0) msg = `Hozir <strong>${cur + 1}-dars</strong>, tugashiga <strong>${L[cur][1] - n} daqiqa</strong> qoldi.`;
        else {
          const nx = L.findIndex(([a]) => n < a);
          msg = nx < 0 ? 'Bugungi darslar tugadi.' : nx === 0 ? `Darslar soat <strong>${L[0][2]}</strong> da boshlanadi.` : `Tanaffus. Keyingi dars (${nx + 1}-dars) <strong>${L[nx][2]}</strong> da.`;
        }
      }
      out.innerHTML = msg;
      items.forEach((li, i) => li.classList.toggle('on', i === cur));
    }
    tick(); setInterval(tick, 20000);
  }

  /* Galereya: Lightbox */
  function lightbox() {
    const grid = $('.gallery-grid');
    if (!grid) return;
    const lb = document.createElement('div');
    lb.className = 'lb'; lb.hidden = true; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    lb.innerHTML = '<button class="lb-x" aria-label="Yopish">×</button><button class="lb-p" aria-label="Oldingi">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-n" aria-label="Keyingi">›</button>';
    document.body.append(lb);
    let imgs = [], i = 0;
    const show = k => { i = (k + imgs.length) % imgs.length; const im = $('img', lb); if (im && imgs[i]) { im.src = imgs[i].currentSrc || imgs[i].src; im.alt = imgs[i].alt; const cap = $('figcaption', lb); if (cap) cap.textContent = imgs[i].alt; } }; const open = im => { imgs = $$('.gallery-item img', grid); if (!imgs.includes(im)) return; show(imgs.indexOf(im)); lb.hidden = false; document.body.classList.add('lb-open'); const xBtn = $('.lb-x', lb); if (xBtn) xBtn.focus(); }; const close = () => { lb.hidden = true; document.body.classList.remove('lb-open'); if (imgs[i]) imgs[i].focus(); }; grid.addEventListener('click', e => { const im = e.target.closest('img'); if (im) open(im); }); grid.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('img')) open(e.target); }); lb.addEventListener('click', e => { if (e.target === lb \vert{}\vert{} e.target.closest('.lb-x')) close(); else if (e.target.closest('.lb-p')) show(i - 1); else if (e.target.closest('.lb-n')) show(i + 1); }); addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); }); }    /* Raqamlar animatsiyasi */ function counters() { if (reduce \vert{}\vert{} !('IntersectionObserver' in window)) return; const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); const txt = e.target.textContent, n = parseInt(txt, 10), suf = txt.replace(/[\d\s]/g, ''), t0 = performance.now(); if (!n) return; const f = now => { const p = Math.min((now - t0) / 1200, 1); e.target.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }), { threshold: 0.6 }); $$('.stat-number').forEach(e => io.observe(e));
  }

  /* Chrome (progress bar, to-top, active menu) */
  function chrome() {
    const bar = document.createElement('div'), top = document.createElement('button');
    bar.className = 'progress'; top.className = 'to-top'; top.type = 'button'; top.textContent = '↑'; top.setAttribute('aria-label', 'Yuqoriga qaytish');
    document.body.append(bar, top);
    const onScroll = () => {
      const h = document.documentElement;
      bar.style.transform = `scaleX(${h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)})`;
      top.classList.toggle('show', h.scrollTop > 600);
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
    const links = $$('.main-nav a');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      }), { rootMargin: '-45% 0px -50% 0px' });
      links.forEach(a => { const href = a.getAttribute('href'); if (href && href.startsWith('#')) { const s = $(href); if (s) io.observe(s); } });
    }
    links.forEach(a => a.addEventListener('click', () => { const t = $('#nav-toggle'); if (t) t.checked = false; }));
  }

  [teachers, bells, lightbox, counters, chrome].forEach(fn => { try { fn(); } catch (err) { console.error(fn.name, err); } });
})();
