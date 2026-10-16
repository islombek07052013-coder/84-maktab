/* Denov 84-maktab — script.js */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s); const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* 1. Dark/Light Mode Toggle */
  function themeToggle() {
    const btn = $('#themeToggle');
    if (!btn) return;
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) { document.body.classList.add('dark-mode'); $('.theme-icon', btn).textContent = '☀️'; }
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const dark = document.body.classList.contains('dark-mode');
      $('.theme-icon', btn).textContent = dark ? '☀️' : '🌙';
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    });
  }

  /* 2. Countdown Timer */
  function countdownTimer() {
    const daysEl = $('#cdDays'), hoursEl = $('#cdHours'), minsEl = $('#cdMins'), secsEl = $('#cdSecs');
    if (!daysEl) return;
    const targetDate = new Date('May 25, 2027 08:00:00').getTime();

    function update() {
      const diff = targetDate - new Date().getTime();
      if (diff <= 0) return;
      daysEl.textContent = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, '0');
      hoursEl.textContent = String(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
      minsEl.textContent = String(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
      secsEl.textContent = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(2, '0');
    }
    update(); setInterval(update, 1000);
  }

  /* 3. Dynamic Class Schedule */
  function classSchedule() {
    const box = $('#schedContent'), btns = $$('.sched-btn');
    if (!box) return;

    const DATA = {
      primary: [
        { class: "1-A Sinf", teacher: "Davlatova Etibor", subjects: "Ona tili, Matematika, Tarbiya, Musiqa" },
        { class: "2-B Sinf", teacher: "Normurodova Dilrabo", subjects: "Ona tili, Matematika, Tasviriy san'at" },
        { class: "3-A Sinf", teacher: "Irismatova Dilbar", subjects: "Ona tili, Matematika, Tabiiy fan" },
        { class: "4-A Sinf", teacher: "Jumaeva Sharifa", subjects: "Ona tili, Matematika, Ingliz tili" }
      ],
      middle: [
        { class: "5-A Sinf", teacher: "Ismailova Dildora", subjects: "Ona tili, Matematika, Tarix, Ingliz tili, Biologiya" },
        { class: "7-B Sinf", teacher: "Sultonmurodov Erkin", subjects: "Matematika, Fizika, Kimyo, Geografiya, Rus tili" },
        { class: "9-A Sinf", teacher: "Xujamkulov Shavkat", subjects: "Informatika, Algebra, Geometriya, Fizika, Kimyo" }
      ],
      senior: [
        { class: "10-A Sinf", teacher: "Jo'raeva Shaxlo", subjects: "Geografiya, Matematika, Kimyo, Biologiya, Tarix" },
        { class: "11-A Sinf", teacher: "Xasanov Xushnud", subjects: "Tarix, Huquq, Algebra, Fizika, Ingliz tili (IELTS)" }
      ]
    };

    function render(group) {
      const list = DATA[group] || [];
      box.innerHTML = `
        <table class="sched-table">
          <thead>
            <tr><th>Sinf</th><th>Sinf Rahbari</th><th>Asosiy Fanlar</th></tr>
          </thead>
          <tbody>
            ${list.map(item => `
              <tr>
                <td><strong>${item.class}</strong></td>
                <td>${item.teacher}</td>
                <td>${item.subjects}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        render(btn.dataset.group);
      });
    });

    render('primary');
  }

  /* 4. FAQ Accordion */
  function faqAccordion() {
    $$('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        item.classList.toggle('active');
      });
    });
  }

  /* 5. Online Form Submission */
  function contactForm() {
    const form = $('#contactForm'), success = $('#mSuccess');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      form.hidden = true;
      success.hidden = false;
    });
  }

  /* 6. Grade Calculator */
  function gradeCalculator() {
    const input = $('#gradeInput'), btn = $('#calcBtn'), resBox = $('#calcResult');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const nums = input.value.split(/[\s,]+/).map(Number).filter(n => !isNaN(n) && n >= 1 && n <= 5);
      if (!nums.length) return alert("To'g'ri baho kiriting!");
      const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
      $('#avgScore').textContent = avg.toFixed(2);
      $('#finalGrade').textContent = Math.round(avg);
      resBox.hidden = false;
    });
  }

  /* 7. Teacher Modal */
  function teacherModal() {
    const modal = $('#teacherModal'), closeBtn = $('#closeModal');
    if (!modal) return;

    document.addEventListener('click', e => {
      const card = e.target.closest('.teacher-card');
      if (card) {
        $('#modalName').textContent = $('h3', card) ?$('h3', card).textContent : '';
        $('#modalRole').textContent = $('.teacher-role', card) ? $('.teacher-role', card).textContent : '';$('#modalBadge').textContent = $('.teacher-badge', card) ?$('.teacher-badge', card).textContent : '';
        $('#modalBio').textContent = card.dataset.bio \vert{}\vert{} "Qo'shimcha ma'lumot yo'q."; modal.hidden = false; } });      closeBtn.addEventListener('click', () => modal.hidden = true); modal.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; }); }    /* 8. Bells Schedule */ function bells() { const shiftBtns = $$('.shift-btn'), list1 = $('#bellList1'), list2 = $('#bellList2'), out = $('#bellNow'); if (!list1) return; let currentShift = '1';      function tick() { const activeList = currentShift === '1' ? list1 : list2; const items = $$('li', activeList);
      const m = t => { const [h, mi] = t.split(':'); return +h * 60 + +mi; };
      const L = items.map(li => [m(li.dataset.s), m(li.dataset.e), li.dataset.s]);
      const d = new Date(), n = d.getHours() * 60 + d.getMinutes();
      let msg;

      if (d.getDay() === 0) msg = 'Bugun dam olish kuni.';
      else {
        const cur = L.findIndex(([a, b]) => n >= a && n < b);
        if (cur >= 0) msg = `Hozir (${currentShift}-smena) <strong>${cur + 1}-dars</strong>, tugashiga <strong>${L[cur][1] - n} daqiqa</strong> qoldi.`;
        else msg = `Dars vaqti emas yoki tanaffus.`;
      }
      out.innerHTML = msg;
    }

    shiftBtns.forEach(btn => btn.addEventListener('click', () => {
      currentShift = btn.dataset.shift;
      list1.style.display = currentShift === '1' ? 'grid' : 'none';
      list2.style.display = currentShift === '2' ? 'grid' : 'none';
      shiftBtns.forEach(b => b.classList.toggle('active', b.dataset.shift === currentShift));
      tick();
    }));
    tick(); setInterval(tick, 20000);
  }

  [themeToggle, countdownTimer, classSchedule, faqAccordion, contactForm, gradeCalculator, teacherModal, bells].forEach(fn => {
    try { fn(); } catch (err) { console.error(err); }
  });
})();
