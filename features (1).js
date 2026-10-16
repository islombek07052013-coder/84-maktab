/* features.js — 84-maktab: yangi funksiyalar (script.js dan KEYIN ulang) */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const norm = s => (s || '').toLowerCase().replace(/[‘’ʻʼ`']/g, '').trim();
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. Preloader */
  function preloader() {
    const p = document.createElement('div');
    p.className = 'pre';
    p.innerHTML = '<div class="pre-badge">84</div><div class="pre-bar"><i></i></div>';
    document.body.prepend(p);
    const hide = () => { p.classList.add('hide'); setTimeout(() => p.remove(), 600); };
    document.readyState === 'complete' ? setTimeout(hide, 350) : addEventListener('load', () => setTimeout(hide, 350));
    setTimeout(hide, 3000);
  }

  /* 2. Uch tilli sayt: UZ / RU / EN */
  const TR = {
    'Bosh sahifa': ['Главная', 'Home'], 'Biz haqimizda': ['О нас', 'About us'], 'Jadval': ['Расписание', 'Schedule'],
    'Sinfxonalar': ['Классы', 'Classrooms'], 'Ustozlar': ['Учителя', 'Teachers'], 'Kalkulyator': ['Калькулятор', 'Calculator'],
    'Platformalar': ['Платформы', 'Platforms'], 'Aloqa': ['Контакты', 'Contact'],
    "Zamonaviy ta'lim,<br>ishonchli kelajak": ['Современное образование,<br>уверенное будущее', 'Modern education,<br>a confident future'],
    "Denov tumanidagi 84-maktab har bir o'quvchida bilim, mahorat va yangi g'oyalarni tarbiyalaydi.": ['Школа №84 Денауского района развивает в каждом ученике знания, мастерство и новые идеи.', 'School No. 84 in Denov nurtures knowledge, skills and fresh ideas in every student.'],
    "Batafsil ma'lumot": ['Подробнее', 'Learn more'], 'Maktab haqida': ['О школе', 'About the school'],
    "O'quv yili yakunigacha": ['До конца учебного года', 'Until the end of the school year'],
    "So'nggi Qo'ng'iroq va yozgi ta'tilga qolgan vaqt:": ['Время до Последнего звонка и летних каникул:', 'Time left until the Last Bell and summer break:'],
    'Kun': ['Дней', 'Days'], 'Soat': ['Часов', 'Hours'], 'Daqiqa': ['Минут', 'Minutes'], 'Soniya': ['Секунд', 'Seconds'],
    'Raqamlarda maktabimiz': ['Школа в цифрах', 'Our school in numbers'],
    "Faol o'quvchilar": ['Активные ученики', 'Active students'], "Tajribali o'qituvchilar": ['Опытные учителя', 'Experienced teachers'],
    'Zamonaviy sinfxonalar': ['Современные классы', 'Modern classrooms'], "Olimpiada g'oliblari": ['Победители олимпиад', 'Olympiad winners'],
    "Qo'ng'iroq jadvali": ['Расписание звонков', 'Bell schedule'], '1-smena': ['1-я смена', 'Shift 1'], '2-smena': ['2-я смена', 'Shift 2'],
    'Choraklik Baho Kalkulyatori': ['Калькулятор четвертных оценок', 'Quarter Grade Calculator'], 'Hisoblash': ['Рассчитать', 'Calculate'],
    'Maktabimiz va zamonaviy sinfxonalar': ['Наша школа и современные классы', 'Our school and modern classrooms'],
    'Maktab rahbariyati va ustozlarimiz': ['Руководство и учителя школы', 'School leadership and teachers'],
    'Maktab rahbariyati': ['Руководство школы', 'School leadership'],
    "Foydali ta'lim platformalari": ['Полезные образовательные платформы', 'Useful learning platforms'],
    "O'quvchilar va o'qituvchilar uchun kerakli rasmiy ta'lim resurslari": ['Официальные образовательные ресурсы для учеников и учителей', 'Official learning resources for students and teachers'],
    'Bizning manzil xaritada': ['Мы на карте', 'Find us on the map'],
    'Tezkor havolalar': ['Быстрые ссылки', 'Quick links'], "Bog'lanish": ['Связаться с нами', 'Contact us']
  };
  function lang() {
    const th = $('#themeToggle'); if (!th) return;
    const els = $$('.main-nav a,.footer-col ul a,h2,.footer-col>h3,.sub-section-title.text-center,.stat-label,.cd-label,.btn,.shift-btn,.section-header p,.hero-content p,.hero-content h1');
    els.forEach(e => e.dataset.uz = e.innerHTML.trim());
    const box = document.createElement('div');
    box.className = 'lang';
    box.innerHTML = ['uz', 'ru', 'en'].map(l => `<button type="button" data-l="${l}">${l.toUpperCase()}</button>`).join('');
    const set = l => {
      const k = ['uz', 'ru', 'en'].indexOf(l);
      document.documentElement.lang = l;
      els.forEach(e => { const t = TR[e.dataset.uz]; e.innerHTML = k > 0 && t ? t[k - 1] : e.dataset.uz; });
      $$('button', box).forEach(b => b.classList.toggle('on', b.dataset.l === l));
      try { localStorage.setItem('lang', l); } catch (_) {}
      document.dispatchEvent(new Event('langchange'));
    };
    box.addEventListener('click', e => { const b = e.target.closest('button'); if (b) set(b.dataset.l); });
    th.before(box);
    let saved = 'uz'; try { saved = localStorage.getItem('lang') || 'uz'; } catch (_) {}
    set(saved);
  }

  /* 3. Qidiruv oynasi (Ctrl+K): bo'lim, ustoz, fan bo'yicha */
  function palette() {
    const th = $('#themeToggle'); if (!th) return;
    const o = document.createElement('div');
    o.className = 'cmd'; o.hidden = true;
    o.innerHTML = '<div class="cmd-box"><input type="search" placeholder="Qidirish: ustoz, bo\'lim, fan..." aria-label="Qidirish" autocomplete="off"><ul></ul><div class="cmd-hint">↑↓ tanlash · Enter ochish · Esc yopish</div></div>';
    document.body.append(o);
    const inp = $('input', o), ul = $('ul', o);
    let all = [], list = [], sel = 0;
    const build = () => {
      all = [];
      $$('.main-nav a[href^="#"]').forEach(a => all.push({ t: a.textContent.trim(), s: "Bo'limga o'tish", i: '📍', go: () => { const el = $(a.getAttribute('href')); if (el) el.scrollIntoView({ behavior: 'smooth' }); } }));
      all.push({ t: 'Tungi / kunduzgi rejim', s: 'Mavzu', i: '🌓', go: () => $('#themeToggle').click() });
      const tel = $('a[href^="tel:"]'); if (tel) all.push({ t: "Maktabga qo'ng'iroq qilish", s: tel.textContent.trim(), i: '📞', go: () => { location.href = tel.href; } });
      $$('.leadership-card,.mini-card').forEach(c => { const n = $('h3', c), r = $('.teacher-role', c); if (n) all.push({ t: n.textContent.trim(), s: r ? r.textContent.trim() : '', i: '👤', go: () => c.click() }); });
    };
    const render = () => {
      ul.innerHTML = list.map((x, k) => `<li class="${k === sel ? 'on' : ''}" data-k="${k}"><span>${x.i}</span><b>${esc(x.t)}</b><small>${esc(x.s)}</small></li>`).join('') || '<li class="none">Hech narsa topilmadi</li>';
      const a = $('li.on', ul); if (a) a.scrollIntoView({ block: 'nearest' });
    };
    const filter = () => { const q = norm(inp.value); list = (q ? all.filter(x => norm(x.t + ' ' + x.s).includes(q)) : all.slice(0, 10)).slice(0, 30); sel = 0; render(); };
    const open = () => { build(); inp.value = ''; filter(); o.hidden = false; inp.focus(); };
    const close = () => { o.hidden = true; };
    const run = k => { const x = list[k]; if (!x) return; close(); setTimeout(x.go, 60); };
    inp.addEventListener('input', filter);
    inp.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, list.length - 1); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
      else if (e.key === 'Enter') run(sel);
    });
    ul.addEventListener('click', e => { const li = e.target.closest('li[data-k]'); if (li) run(+li.dataset.k); });
    o.addEventListener('click', e => { if (e.target === o) close(); });
    addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); o.hidden ? open() : close(); }
      else if (e.key === 'Escape') { close(); const m = $('#teacherModal'); if (m) m.hidden = true; }
    });
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'cmd-btn'; b.textContent = '🔍'; b.setAttribute('aria-label', 'Qidirish (Ctrl+K)');
    b.addEventListener('click', open);
    th.before(b);
  }

  /* 4. Sana, soat va Denov ob-havosi (e'lon satrida) */
  function widget() {
    const bar = $('.news-ticker'); if (!bar) return;
    const w = document.createElement('div');
    w.className = 'wx'; w.innerHTML = '<span class="wx-d"></span><span class="wx-t"></span>';
    bar.append(w);
    const D = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    const M = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
    const p2 = n => String(n).padStart(2, '0');
    const clock = () => { const d = new Date(); $('.wx-d', w).textContent = `${D[d.getDay()]}, ${d.getDate()}-${M[d.getMonth()]} · ${p2(d.getHours())}:${p2(d.getMinutes())}`; };
    clock(); setInterval(clock, 30000);
    const ic = c => c === 0 ? '☀️' : c < 3 ? '🌤️' : c === 3 ? '☁️' : c < 50 ? '🌫️' : c < 70 ? '🌧️' : c < 80 ? '❄️' : c < 90 ? '🌦️' : '⛈️';
    fetch('https://api.open-meteo.com/v1/forecast?latitude=38.28&longitude=67.89&current=temperature_2m,weather_code&timezone=auto')
      .then(r => r.json())
      .then(j => { const c = j.current; $('.wx-t', w).innerHTML = `${ic(c.weather_code)} Denov <b>${Math.round(c.temperature_2m)}°C</b>`; })
      .catch(() => {});
  }

  /* 5. Hero: yozuv effekti */
  const WORDS = {
    uz: ["Bilim — kelajak kaliti", "Fan olimpiadalari va IT to'garaklari", "Tajribali ustozlar jamoasi", "Har bir o'quvchiga alohida e'tibor"],
    ru: ['Знания — ключ к будущему', 'Олимпиады и IT-кружки', 'Команда опытных учителей', 'Внимание каждому ученику'],
    en: ['Knowledge is the key to the future', 'Olympiads and IT clubs', 'A team of experienced teachers', 'Personal attention for every student']
  };
  function typed() {
    const h = $('.hero-content h1'); if (!h) return;
    const d = document.createElement('div');
    d.className = 'typed'; d.innerHTML = '<span></span><i></i>';
    h.after(d);
    const s = $('span', d);
    let w = 0, c = 0, del = false;
    document.addEventListener('langchange', () => { c = 0; del = false; });
    (function t() {
      const L = WORDS[document.documentElement.lang] || WORDS.uz, word = L[w % L.length];
      c += del ? -1 : 1;
      s.textContent = word.slice(0, Math.max(c, 0));
      let wait = del ? 35 : 70;
      if (!del && c >= word.length) { del = true; wait = 1600; }
      else if (del && c <= 0) { del = false; w++; wait = 300; }
      setTimeout(t, wait);
    })();
  }

  /* 6. Hero: sichqonchaga javob beradigan zarrachalar */
  function particles() {
    const hero = $('.hero'); if (!hero || reduce) return;
    const cv = document.createElement('canvas'), c = cv.getContext('2d');
    cv.className = 'hero-canvas'; hero.prepend(cv);
    let W, H, P = [], vis = true; const m = { x: -999, y: -999 };
    const size = () => {
      W = cv.width = hero.clientWidth; H = cv.height = hero.clientHeight;
      P = Array.from({ length: Math.min(70, Math.floor(W * H / 18000)) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4 }));
    };
    size(); addEventListener('resize', size);
    hero.addEventListener('mousemove', e => { const r = hero.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; });
    hero.addEventListener('mouseleave', () => { m.x = -999; });
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; }).observe(hero);
    (function draw() {
      if (vis) {
        c.clearRect(0, 0, W, H);
        P.forEach((p, i) => {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          c.fillStyle = 'rgba(205,160,89,.8)'; c.beginPath(); c.arc(p.x, p.y, 1.8, 0, 6.283); c.fill();
          for (let j = i + 1; j < P.length; j++) {
            const q = P[j], d = Math.hypot(p.x - q.x, p.y - q.y);
            if (d < 110) { c.strokeStyle = `rgba(205,160,89,${.25 * (1 - d / 110)})`; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke(); }
          }
          const dm = Math.hypot(p.x - m.x, p.y - m.y);
          if (dm < 150) { c.strokeStyle = `rgba(255,255,255,${.4 * (1 - dm / 150)})`; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(m.x, m.y); c.stroke(); }
        });
      }
      requestAnimationFrame(draw);
    })();
  }

  /* 7. Bo'limlar silliq paydo bo'ladi */
  function reveal() {
    const els = $$('.section-heading,.about-text,.about-visual,.stat-card,.countdown-card,.bell-list li,.calc-card,.gallery-item,.leadership-card,.link-card,.map-container,.footer-col');
    els.forEach((e, i) => { e.classList.add('rv'); e.style.setProperty('--d', (i % 4) * 80 + 'ms'); });
    const io = new IntersectionObserver(es => es.forEach(x => {
      if (!x.isIntersecting) return;
      io.unobserve(x.target); x.target.classList.add('in');
      setTimeout(() => x.target.classList.remove('rv', 'in'), 1100);
    }), { threshold: .12 });
    els.forEach(e => io.observe(e));
  }

  /* 8. Raqamlar 0 dan sanab chiqadi */
  function counters() {
    const io = new IntersectionObserver(es => es.forEach(x => {
      if (!x.isIntersecting) return;
      io.unobserve(x.target);
      const el = x.target, m = el.textContent.match(/^(\d+)(.*)$/); if (!m) return;
      const to = +m[1], suf = m[2], t0 = performance.now();
      const step = t => { const k = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }), { threshold: .5 });
    $$('.stat-number,.m-stat strong').forEach(e => io.observe(e));
  }

  /* 9. Kartochkalar 3D egilishi */
  function tilt() {
    if (matchMedia('(hover:none)').matches || reduce) return;
    $$('.stat-card,.modern-about-card,.link-card,.director-card').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(700px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-6px)`;
      });
      c.addEventListener('pointerleave', () => { c.style.transform = ''; });
    });
  }

  /* 10. Galereya: katta ko'rish (strelka, svayp, Esc) */
  function lightbox() {
    const imgs = () => $$('.gallery-item img');
    const lb = document.createElement('div');
    lb.className = 'lb'; lb.hidden = true;
    lb.innerHTML = '<button type="button" class="lb-x" aria-label="Yopish">×</button><button type="button" class="lb-p" aria-label="Oldingi">‹</button><figure><img alt=""><figcaption></figcaption></figure><button type="button" class="lb-n" aria-label="Keyingi">›</button>';
    document.body.append(lb);
    const im = $('img', lb), cap = $('figcaption', lb);
    let i = 0;
    const show = n => { const L = imgs(); if (!L.length) return; i = (n + L.length) % L.length; im.src = L[i].src; cap.textContent = L[i].alt; };
    const close = () => { lb.hidden = true; document.body.style.overflow = ''; };
    document.addEventListener('click', e => { const t = e.target.closest('.gallery-item img'); if (t) { show(imgs().indexOf(t)); lb.hidden = false; document.body.style.overflow = 'hidden'; } });
    $('.lb-x', lb).onclick = close; $('.lb-p', lb).onclick = () => show(i - 1); $('.lb-n', lb).onclick = () => show(i + 1);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
    let sx = 0;
    lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1)); });
  }

  /* 11. Kalkulyator: maslahat + a'lo baho uchun konfetti */
  function confetti() {
    const cv = document.createElement('canvas'), c = cv.getContext('2d');
    cv.className = 'confetti'; cv.width = innerWidth; cv.height = innerHeight; document.body.append(cv);
    const cols = ['#cda059', '#2f6fb0', '#ffffff', '#e8c27d', '#5aa0e6'];
    const P = Array.from({ length: 140 }, () => ({ x: innerWidth / 2, y: innerHeight * .6, vx: (Math.random() - .5) * 16, vy: -Math.random() * 16 - 4, s: Math.random() * 8 + 4, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[Math.random() * 5 | 0] }));
    let f = 0;
    (function a() {
      c.clearRect(0, 0, cv.width, cv.height);
      P.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.r += p.vr; c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c; c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore(); });
      if (++f < 150) requestAnimationFrame(a); else cv.remove();
    })();
  }
  function calcPlus() {
    const input = $('#gradeInput'), btn = $('#calcBtn'), box = $('#calcResult'); if (!input || !btn || !box) return;
    const msg = document.createElement('p'); msg.className = 'calc-msg'; box.append(msg);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
    btn.addEventListener('click', () => {
      const n = input.value.split(/[\s,]+/).map(Number).filter(x => !isNaN(x) && x >= 1 && x <= 5); if (!n.length) return;
      const s = n.reduce((a, b) => a + b, 0), avg = s / n.length, k = Math.ceil(9 * n.length - 2 * s);
      if (avg >= 4.5) { msg.textContent = "🎉 A'lo natija! Shunday davom eting!"; if (!reduce) confetti(); }
      else msg.textContent = `💪 Chorak bahosi 5 bo'lishi uchun yana kamida ${k} ta «5» baho kerak.`;
    });
  }

  /* 12. Tezkor aloqa tugmasi */
  function fab() {
    const tel = ($('a[href^="tel:"]') || {}).href || 'tel:+998975503307';
    const tg = ($('a[href*="t.me"]') || {}).href || 'https://t.me/MAK_RAHBARI84';
    const f = document.createElement('div');
    f.className = 'fab';
    f.innerHTML = `<button type="button" class="fab-main" aria-label="Aloqa">+</button><a href="${tel}">📞 Qo'ng'iroq</a><a href="${tg}" target="_blank" rel="noopener">✈️ Telegram</a>`;
    document.body.append(f);
    $('.fab-main', f).onclick = () => f.classList.toggle('open');
    document.addEventListener('click', e => { if (!f.contains(e.target)) f.classList.remove('open'); });
  }

  /* 13. Menyuda joriy bo'lim yoritiladi + mobil menyu avtomatik yopiladi */
  function spy() {
    const links = $$('.main-nav a[href^="#"]');
    const io = new IntersectionObserver(es => es.forEach(x => {
      if (x.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + x.target.id));
    }), { rootMargin: '-40% 0px -55% 0px' });
    links.map(a => $(a.getAttribute('href'))).filter(Boolean).forEach(s => io.observe(s));
    links.forEach(a => a.addEventListener('click', () => { const t = $('#nav-toggle'); if (t) t.checked = false; }));
  }

  [preloader, lang, palette, widget, typed, particles, reveal, counters, tilt, lightbox, calcPlus, fab, spy].forEach(fn => {
    try { fn(); } catch (err) { console.error(fn.name, err); }
  });
})();
