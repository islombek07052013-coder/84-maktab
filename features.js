/* Denov 84-maktab: qo'shimcha funksiyalar. HTML'ga tegmasdan ishlaydi. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const norm = s => s.toLowerCase().replace(/[‘’`ʻʼ']/g, '');

  const TG_USER = 'MAK_RAHBARI84'; // murojaatlar shu Telegram akkauntiga boradi
  // DIQQAT: qo'ng'iroq vaqtlari NAMUNA. Maktabingizning haqiqiy jadvaliga almashtiring.
  const BELLS = [['08:00', '08:45'], ['08:55', '09:40'], ['09:50', '10:35'], ['10:45', '11:30'], ['11:40', '12:25'], ['12:35', '13:20'], ['13:30', '14:15']];

  /* ---------- Menyu: yangi havolalar, nom tuzatish ---------- */
  function nav() {
    $$('a[href="#news"]').forEach(a => { a.textContent = 'Sinfxonalar'; });
    const add = (before, href, text) => { const a = $(`.main-nav a[href="${before}"]`); if (a) a.closest('li').insertAdjacentHTML('beforebegin', `<li><a href="${href}">${text}</a></li>`); };
    add('#news', '#bells', 'Jadval');
    add('#contact', '#appeal', 'Murojaat');
  }

  /* ---------- O'qituvchilarni qidirish va fan bo'yicha saralash ---------- */
  function teachers() {
    const list = $('.featured-teachers-list');
    if (!list) return;
    const CATS = [["Boshlang'ich sinf", 'boshlangich'], ['Ona tili', 'ona tili'], ['Rus tili', 'rus tili'], ['Ingliz tili', 'ingliz'], ['Matematika', 'matematika'], ['Informatika', 'informatika'],
      ['Fizika', 'fizika'], ['Kimyo', 'kimyo'], ['Biologiya', 'biologiya'], ['Geografiya', 'geografiya'], ['Tarix', 'tarix'], ["San'at va musiqa", 'tasviriy|musiqa|chizmachilik'], ['Jismoniy tarbiya', 'jismoniy']];
    const data = $$('.mini-card', list).map(c => {
      const role = norm(c.querySelector('.teacher-role').textContent);
      const cat = (CATS.find(([, k]) => new RegExp(k).test(role)) || ['Boshqa'])[0];
      return { c, cat, text: norm(c.querySelector('h3').textContent + ' ' + role) };
    });
    const tools = el('div', 't-tools', `<input type="search" id="tSearch" placeholder="Ism yoki fan bo'yicha qidirish" aria-label="O'qituvchini qidirish" autocomplete="off"><div class="t-chips" role="group" aria-label="Fan bo'yicha saralash"></div><p class="t-count" aria-live="polite"></p>`);
    const empty = el('p', 't-empty', "Hech narsa topilmadi. Boshqa so'z bilan urinib ko'ring.");
    empty.hidden = true;
    list.before(tools); list.after(empty);
    const names = ['Hammasi', ...CATS.map(c => c[0]), 'Boshqa'].filter(n => n === 'Hammasi' || data.some(d => d.cat === n));
    let cur = 'Hammasi';
    const chips = $('.t-chips', tools);
    chips.innerHTML = names.map(n => `<button type="button" data-c="${n}">${n}<small>${n === 'Hammasi' ? data.length : data.filter(d => d.cat === n).length}</small></button>`).join('');
    function apply() {
      const q = norm($('#tSearch').value).trim();
      let n = 0;
      data.forEach(d => { const ok = (cur === 'Hammasi' || d.cat === cur) && d.text.includes(q); d.c.hidden = !ok; if (ok) n++; });
      $$('button', chips).forEach(b => b.classList.toggle('on', b.dataset.c === cur));
      $('.t-count', tools).textContent = `${n} ta o'qituvchi ko'rsatilmoqda`;
      empty.hidden = n > 0;
    }
    chips.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { cur = b.dataset.c; apply(); } });
    $('#tSearch').addEventListener('input', apply);
    apply();
  }

  /* ---------- Qo'ng'iroq jadvali va hozirgi dars ---------- */
  function bells() {
    const after = $('#stats');
    if (!after) return;
    const sec = el('section', 'bells', `<div class="container"><h2 class="section-heading">Qo'ng'iroq jadvali</h2><div class="bell-now" id="bellNow" aria-live="polite"></div><ol class="bell-list">${BELLS.map(([a, b], i) => `<li><b>${i + 1}-dars</b><span>${a} – ${b}</span></li>`).join('')}</ol></div>`);
    sec.id = 'bells';
    after.after(sec);
    const m = t => { const [h, mi] = t.split(':'); return +h * 60 + +mi; };
    function tick() {
      const d = new Date(), n = d.getHours() * 60 + d.getMinutes();
      let msg, cur = -1;
      if (d.getDay() === 0) msg = 'Bugun dam olish kuni.';
      else {
        cur = BELLS.findIndex(([a, b]) => n >= m(a) && n < m(b));
        if (cur >= 0) msg = `Hozir <strong>${cur + 1}-dars</strong>, tugashiga <strong>${m(BELLS[cur][1]) - n} daqiqa</strong> qoldi.`;
        else {
          const nx = BELLS.findIndex(([a]) => n < m(a));
          msg = nx < 0 ? 'Bugungi darslar tugadi.' : nx === 0 ? `Darslar soat <strong>${BELLS[0][0]}</strong> da boshlanadi.` : `Tanaffus. Keyingi dars (${nx + 1}-dars) <strong>${BELLS[nx][0]}</strong> da.`;
        }
      }
      $('#bellNow').innerHTML = msg;
      $$('.bell-list li', sec).forEach((li, i) => li.classList.toggle('on', i === cur));
    }
    tick(); setInterval(tick, 20000);
  }

  /* ---------- Rahbariyatga murojaat (Telegram orqali) ---------- */
  function appeal() {
    const before = $('#location');
    if (!before) return;
    const sec = el('section', 'appeal', `<div class="container appeal-inner">
      <div><h2>Rahbariyatga murojaat</h2><p>Savol, taklif yoki murojaatingizni yozing. Telegram ochiladi, tayyor xabarni yuborish tugmasini bosasiz.</p></div>
      <form class="appeal-form" id="appealForm">
        <input id="aName" placeholder="Ismingiz" autocomplete="name" required>
        <input id="aPhone" type="tel" placeholder="Telefon raqamingiz" autocomplete="tel">
        <select id="aType" aria-label="Murojaat turi"><option>Savol</option><option>Taklif</option><option>Shikoyat</option><option>Qabul va hujjatlar</option></select>
        <textarea id="aMsg" rows="4" placeholder="Murojaat matni" required></textarea>
        <button class="btn btn-primary" type="submit">Telegramda yuborish</button>
      </form></div>`);
    sec.id = 'appeal';
    before.before(sec);
    $('#appealForm').addEventListener('submit', e => {
      e.preventDefault();
      const phone = $('#aPhone').value.trim();
      const text = `Murojaat (${$('#aType').value})\nIsm: ${$('#aName').value.trim()}${phone ? '\nTelefon: ' + phone : ''}\n\n${$('#aMsg').value.trim()}`;
      window.open(`https://t.me/${TG_USER}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    });
  }

  /* ---------- Galereya: katta ko'rish (lightbox) ---------- */
  function lightbox() {
    const imgs = $$('.gallery-item img');
    if (!imgs.length) return;
    const lb = el('div', 'lb', '<button class="lb-x" aria-label="Yopish">×</button><button class="lb-p" aria-label="Oldingi">‹</button><figure><img alt=""><figcaption></figcaption></figure><button class="lb-n" aria-label="Keyingi">›</button>');
    lb.hidden = true; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
    document.body.append(lb);
    let i = 0;
    const show = k => { i = (k + imgs.length) % imgs.length; const im = $('img', lb); im.src = imgs[i].src; im.alt = imgs[i].alt; $('figcaption', lb).textContent = imgs[i].alt; };
    const open = k => { show(k); lb.hidden = false; document.body.classList.add('lb-open'); $('.lb-x', lb).focus(); };
    const close = () => { lb.hidden = true; document.body.classList.remove('lb-open'); imgs[i].focus(); };
    imgs.forEach((im, k) => { im.tabIndex = 0; im.addEventListener('click', () => open(k)); im.addEventListener('keydown', e => { if (e.key === 'Enter') open(k); }); });
    lb.addEventListener('click', e => {
      if (e.target === lb || e.target.closest('.lb-x')) close();
      else if (e.target.closest('.lb-p')) show(i - 1);
      else if (e.target.closest('.lb-n')) show(i + 1);
    });
    addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
  }

  /* ---------- Raqamlar sanab chiqiladi ---------- */
  function counters() {
    if (reduce || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const txt = e.target.textContent, n = parseInt(txt, 10), suf = txt.replace(/[\d\s]/g, ''), t0 = performance.now();
      if (!n) return;
      const f = now => { const p = Math.min((now - t0) / 1200, 1); e.target.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(f); };
      requestAnimationFrame(f);
    }), { threshold: 0.6 });
    $$('.stat-number').forEach(e => io.observe(e));
  }

  /* ---------- Yuqoriga tugma, o'qish chizig'i, aktiv menyu ---------- */
  function chrome() {
    const bar = el('div', 'progress'), top = el('button', 'to-top', '↑');
    top.type = 'button'; top.setAttribute('aria-label', 'Yuqoriga qaytish');
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
      links.forEach(a => { const s = $(a.getAttribute('href')); if (s) io.observe(s); });
    }
    links.forEach(a => a.addEventListener('click', () => { const t = $('#nav-toggle'); if (t) t.checked = false; }));
  }

  nav(); teachers(); bells(); appeal(); lightbox(); counters(); chrome();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
