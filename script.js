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

  /* 2. O'quv yili yakunlanishiga / Yozgi ta'tilgacha hisoblagich */
  function countdownTimer() {
    const daysEl = $('#cdDays'), hoursEl = $('#cdHours'), minsEl = $('#cdMins'), secsEl = $('#cdSecs');
    if (!daysEl) return;
    
    // Yozgi ta'til va So'nggi Qo'ng'iroq sanasi (2027-yil 25-may)
    const targetDate = new Date('2027-05-25T08:00:00+05:00').getTime();

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

  /* 4. Direct Telegram Murojaat Formasi */
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
      
      const tgUrl = `https://t.me/MAK_RAHBARI84?text=${encodeURIComponent(message)}`;
      window.open(tgUrl, '_blank');
    });
  }

  /* 5. Teacher Modal */
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

  [themeToggle, countdownTimer, classSchedule, contactForm, teacherModal].forEach(fn => {
    try { fn(); } catch (err) { console.error(err); }
  });
});
