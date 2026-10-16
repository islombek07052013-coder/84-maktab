/* Denov 84-maktab — script.js */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const norm = s => (s || '').toLowerCase().replace(/[‘’`ʻʼ'ʻ]/g, '').trim();

  /* 1. Dark / Light Mode */
  function themeToggle() {
    const btn = $('#themeToggle');
    if (!btn) return;
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
      document.body.classList.add('dark-mode');
      $('.theme-icon', btn).textContent = '☀️';
    }
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const dark = document.body.classList.contains('dark-mode');
      $('.theme-icon', btn).textContent = dark ? '☀️' : '🌙';
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    });
  }

  /* 2. O'quv yili yakunigacha Hisoblagich (25-May So'nggi Qo'ng'iroq) */
  function countdownTimer() {
    const daysEl = $('#cdDays'), hoursEl = $('#cdHours'), minsEl = $('#cdMins'), secsEl = $('#cdSecs');
    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    // Surxondaryo viloyati va O'zbekiston maktablari uchun 25-may o'quv yili yakuni
    const targetDate = new Date('May 25, 2027 08:00:00').getTime();

    function update() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        daysEl.textContent = '00'; hoursEl.textContent = '00'; minsEl.textContent = '00'; secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(mins).padStart(2, '0');
      secsEl.textContent = String(secs).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
  }

  /* 3. Choraklik Baho Kalkulyatori */
  function gradeCalculator() {
    const input = $('#gradeInput'), btn = $('#calcBtn'), resBox = $('#calcResult');
    const avgScoreEl = $('#avgScore'), finalGradeEl = $('#finalGrade');
    if (!input || !btn || !resBox) return;

    btn.addEventListener('click', () => {
      const val = input.value.trim();
      if (!val) return;
      const nums = val.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n >= 1 && n <= 5);
      if (!nums.length) {
        alert("Iltimos, to'g'ri baholarni kiriting (masalan: 5, 4, 3, 5)!");
        return;
      }
      const sum = nums.reduce((a, b) => a + b, 0);
      const avg = sum / nums.length;
      const finalGrade = Math.round(avg);

      avgScoreEl.textContent = avg.toFixed(2);
      finalGradeEl.textContent = finalGrade;
      resBox.hidden = false;
    });
  }

  /* 4. O'qituvchilar Modal Oynasi */
  function teacherModal() {
    const modal = $('#teacherModal'), closeBtn = $('#closeModal');
    const modalName = $('#modalName'), modalRole = $('#modalRole'), modalBadge = $('#modalBadge'), modalBio = $('#modalBio');
    if (!modal || !closeBtn) return;

    document.addEventListener('click', e => {
      const card = e.target.closest('.teacher-card');
      if (card) {
        const name = $('h3', card) ?$('h3', card).textContent : '';
        const role = $('.teacher-role', card) ?$('.teacher-role', card).textContent : '';
        const badge = $('.teacher-badge', card) ?$('.teacher-badge', card).textContent : '';
        const bio = card.dataset.bio || "O'qituvchi haqida qo'shimcha ma'lumot mavjud emas.";

        modalName.textContent = name;
        modalRole.textContent = role;
        modalBadge.textContent = badge;
        modalBio.textContent = bio;
        modal.hidden = false;
      }
    });

    closeBtn.addEventListener('click', () => modal.hidden = true);
    modal.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; });
  }

  /* 5. O'qituvchilarni qidirish va fan bo'yicha saralash */
  function teachers() {
    const list = $('.featured-teachers-list'), tools =$('.t-tools'), empty = $('.t-empty'); if (!list \vert{}\vert{} !tools) return; const cards = $$('.mini-card', list);
    if (!cards.length) return;

    const CATS = [
      ["Boshlang'ich", 'boshlangich'], ['Ona tili', 'ona tili'], ['Rus tili', 'rus tili'],
      ['Ingliz tili', 'ingliz'], ['Matematika', 'matematika'], ['Informatika', 'informatika'],
      ['Fizika', 'fizika'], ['Kimyo', 'kimyo'], ['Biologiya', 'biologiya'], ['Geografiya', 'geografiya'],
      ['Tarix', 'tarix'], ['Tarbiya', 'tarbiya'], ['Musiqa va San\'at', 'musiqa|tasviriy|chizmachilik'],
      ['Jismoniy tarbiya', 'jismoniy']
    ];

    const data = cards.map(c => {
      const nameText = $('h3', c) ?$('h3', c).textContent : '';
      const roleText = $('.teacher-role', c) ?$('.teacher-role', c).textContent : '';
      let matchedCat = 'Boshqa';
      for (const [catName, keyword] of CATS) {
        if (new RegExp(keyword, 'i').test(norm(roleText))) { matchedCat = catName; break; }
      }
      return { c, cat: matchedCat, text: norm(nameText + ' ' + roleText) };
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
        const ok = (cur === 'Hammasi' || d.cat === cur) && (!q || d.text.includes(q));
        d.c.hidden = !ok;
        if (ok) n++;
      });
      $$('button', chips).forEach(b => b.classList.toggle('on', b.dataset.c === cur));
      if (count) count.textContent = `${n} ta o'qituvchi topildi`;
      if (empty) empty.hidden = n > 0;
    }

    chips.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (b) { cur = b.dataset.c; apply(); }
    });
    input.addEventListener('input', apply);
    tools.hidden = false;
    apply();
  }

  /* 6. Qo'ng'iroq jadvali (1 va 2-smena) */
  function bells() {
    const shiftBtns = $$('.shift-btn'), list1 = $('#bellList1'), list2 = $('#bellList2'), out = $('#bellNow'); if (!list1 \vert{}\vert{} !list2 \vert{}\vert{} !out) return; let currentShift = '1';      function updateVisibility() { list1.style.display = currentShift === '1' ? 'block' : 'none'; list2.style.display = currentShift === '2' ? 'block' : 'none'; shiftBtns.forEach(b => b.classList.toggle('active', b.dataset.shift === currentShift)); tick(); }      shiftBtns.forEach(btn => btn.addEventListener('click', () => { currentShift = btn.dataset.shift; updateVisibility(); }));      const m = t => { const [h, mi] = t.split(':'); return +h * 60 + +mi; };      function tick() { const activeList = currentShift === '1' ? list1 : list2; const items = $$('li', activeList);
      const L = items.map(li => [m(li.dataset.s), m(li.dataset.e), li.dataset.s]);
      const d = new Date(), n = d.getHours() * 60 + d.getMinutes();
      let msg, cur = -1;

      if (d.getDay() === 0) msg = 'Bugun dam olish kuni.';
      else {
        cur = L.findIndex(([a, b]) => n >= a && n < b);
        if (cur >= 0) msg = `Hozir (${currentShift}-smena) <strong>${cur + 1}-dars</strong>, tugashiga <strong>${L[cur][1] - n} daqiqa</strong> qoldi.`;
        else {
          const nx = L.findIndex(([a]) => n < a);
          msg = nx < 0 ? `Bugungi (${currentShift}-smena) darslar tugadi.` : nx === 0 ? `${currentShift}-smena darslari soat <strong>${L[0][2]}</strong> da boshlanadi.` : `Tanaffus. Keyingi dars (${nx + 1}-dars) <strong>${L[nx][2]}</strong> da.`;
        }
      }
      out.innerHTML = msg;
      list1.querySelectorAll('li').forEach((li, i) => li.classList.toggle('on', currentShift === '1' && i === cur));
      list2.querySelectorAll('li').forEach((li, i) => li.classList.toggle('on', currentShift === '2' && i === cur));
    }
    tick();
    setInterval(tick, 20000);
  }

  /* 7. Chrome va Scroll Effektlari */
  function chrome() {
    const bar = document.createElement('div'), top = document.createElement('button');
    bar.className = 'progress'; top.className = 'to-top'; top.type = 'button'; top.textContent = '↑';
    document.body.append(bar, top);

    const onScroll = () => {
      const h = document.documentElement;
      bar.style.transform = `scaleX(${h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1)})`;
      top.classList.toggle('show', h.scrollTop > 500);
    };
    addEventListener('scroll', onScroll, { passive: true });
    top.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  }

  [themeToggle, countdownTimer, gradeCalculator, teacherModal, teachers, bells, chrome].forEach(fn => {
    try { fn(); } catch (err) { console.error(fn.name, err); }
  });
})();
