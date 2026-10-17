/* Denov 84-maktab — script.js */
document.addEventListener('DOMContentLoaded', () => {
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

  /* 2. O'quv yili Countdown Timer */
  function countdownTimer() {
    const daysEl = $('#cdDays'), hoursEl = $('#cdHours'), minsEl = $('#cdMins'), secsEl = $('#cdSecs');
    if (!daysEl) return;
    
    const targetDate = new Date(2027, 4, 25, 8, 0, 0).getTime();

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

  /* 3. Class Schedule */
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

  /* 4. FAQ Accordion (Ochilib yopiluvchi savollar) */
  function faqAccordion() {
    $$('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.parentElement;
        item.classList.toggle('active');
      });
    });
  }

  /* 5. Direct Telegram Murojaat Formasi */
  function contactForm() {
    const form = $('#contactForm');
    if (!form) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#mName').value;
      const phone = $('#mPhone').value;
      const subject = $('#mSubject').value;
      const text = $('#mText').value;

      const message = `Assalomu alaykum!\nMurojaat qiluvchi: ${name}\nTelefon: ${phone}\nMavzu: ${subject}\n\nMurojaat matni:\n${text}`;
      
      // Telegramga xabarni yo'naltirish
      const tgUrl = `https://t.me/MAK_RAHBARI84?text=${encodeURIComponent(message)}`;
      window.open(tgUrl, '_blank');
    });
  }

  /* 6. Bells Schedule */
  function bells() {
    const shiftBtns = $$('.shift-btn');
    const list1 = $('#bellList1');
    const list2 = $('#bellList2');
    const out = $('#bellNow'); if (!list1 \vert{}\vert{} !list2 \vert{}\vert{} !out) return;      let currentShift = '1';      function tick() { const activeList = currentShift === '1' ? list1 : list2; const items = $$('.bell-card-item', activeList);
      const m = t => { const [h, mi] = t.split(':'); return +h * 60 + +mi; };
      const L = items.map(li => [m(li.dataset.s), m(li.dataset.e), li.dataset.s]);
      const d = new Date(), n = d.getHours() * 60 + d.getMinutes();
      let msg, cur = -1;

      if (d.getDay() === 0) msg = 'Bugun dam olish kuni.';
      else {
        cur = L.findIndex(([a, b]) => n >= a && n < b);
        if (cur >= 0) msg = `Hozir (${currentShift}-smena) <strong>${cur + 1}-soat dars</strong> ketmoqda, tugashiga <strong>${L[cur][1] - n} daqiqa</strong> qoldi.`;
        else {
          const nx = L.findIndex(([a]) => n < a);
          msg = nx < 0 ? `Bugungi (${currentShift}-smena) darslar yakunlandi.` : nx === 0 ? `${currentShift}-smena darslari soat <strong>${L[0][2]}</strong> da boshlanadi.` : `Hozir tanaffus. Keyingi dars <strong>${L[nx][2]}</strong> da boshlanadi.`;
        }
      }
      out.innerHTML = msg;
      
      list1.querySelectorAll('.bell-card-item').forEach((li, i) => li.classList.toggle('on', currentShift === '1' && i === cur));
      list2.querySelectorAll('.bell-card-item').forEach((li, i) => li.classList.toggle('on', currentShift === '2' && i === cur));
    }

    shiftBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentShift = btn.dataset.shift;
        shiftBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (currentShift === '1') {
          list1.style.display = 'grid';
          list2.style.display = 'none';
        } else {
          list1.style.display = 'none';
          list2.style.display = 'grid';
        }
        tick();
      });
    });

    tick(); 
    setInterval(tick, 10000);
  }

  /* Teacher Modal */
  function teacherModal() {
    const modal = $('#teacherModal'), closeBtn = $('#closeModal');
    if (!modal) return;

    document.addEventListener('click', e => {
      const card = e.target.closest('.teacher-card') || e.target.closest('.leader-premium-card');
      if (card) {
        $('#modalName').textContent = $('h3', card) ? $('h3', card).textContent : '';$('#modalRole').textContent = $('.teacher-role', card) ?$('.teacher-role', card).textContent : ($('.l-role', card) ?$('.l-role', card).textContent : '');
        $('#modalBadge').textContent = $('.teacher-badge', card) ? $('.teacher-badge', card).textContent : 'Rahbariyat';$('#modalBio').textContent = card.dataset.bio || "Qo'shimcha ma'lumot yo'q.";
        modal.hidden = false;
      }
    });

    closeBtn.addEventListener('click', () => modal.hidden = true);
    modal.addEventListener('click', e => { if (e.target === modal) modal.hidden = true; });
  }

  [themeToggle, countdownTimer, classSchedule, faqAccordion, contactForm, bells, teacherModal].forEach(fn => {
    try { fn(); } catch (err) { console.error(err); }
  });
});
