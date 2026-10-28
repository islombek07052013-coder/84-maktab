/* ==========================================================
   DENOV 84-MAKTAB — User Side script.js
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. SUPABASE ORQALI USTOZLarni BAZADAN OLIB KELISH
  const SUPABASE_URL = 'https://erurfkbqnwzpieantvm.supabase.co';
  const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY'; // O'z anon keyingizni yozasiz
  
  if (window.supabase) {
    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    fetchTeachers(supabaseClient);
  }

  async function fetchTeachers(client) {
    let { data: teachers, error } = await client.from('teachers').select('*');
    
    if (error) {
      console.error('Maʼlumotni olishda xatolik:', error.message);
      return;
    }

    if (teachers && teachers.length > 0) {
      const listContainer = document.querySelector('.featured-teachers-list');
      if (!listContainer) return;

      listContainer.innerHTML = '';
      teachers.forEach(t => {
        const card = document.createElement('div');
        card.className = 'teacher-card mini-card';
        card.setAttribute('data-bio', t.bio || "Ma'lumot kiritilmagan");
        card.innerHTML = `
          <div class="teacher-info">
            <h3>${t.full_name}</h3>
            <p class="teacher-role">${t.subject}</p>
            <span class="teacher-badge">O'qituvchi</span>
          </div>
        `;
        // Modal oynani ulash
        card.addEventListener('click', () => {
          openTeacherModal(t.full_name, t.subject, "O'qituvchi", t.bio);
        });
        listContainer.appendChild(card);
      });
    }
  }

  // 2. O'quv yili yakunigacha Hisoblagich (Countdown)
  function updateCountdown() {
    const now = new Date();
    let currentYear = now.getFullYear();
    let targetDate = new Date(currentYear, 4, 25, 8, 0, 0).getTime();
    
    if (now.getTime() > targetDate) {
      targetDate = new Date(currentYear + 1, 4, 25, 8, 0, 0).getTime();
    }

    const timeLeft = targetDate - now.getTime();
    if (timeLeft > 0) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      if (document.getElementById('cdDays')) document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
      if (document.getElementById('cdHours')) document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
      if (document.getElementById('cdMins')) document.getElementById('cdMins').textContent = String(minutes).padStart(2, '0');
      if (document.getElementById('cdSecs')) document.getElementById('cdSecs').textContent = String(seconds).padStart(2, '0');
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // 3. Ustoz Modal Oynasi funksiyasi
  const teacherModal = document.getElementById('teacherModal');
  const closeModalBtn = document.getElementById('closeModal');

  function openTeacherModal(name, role, badge, bio) {
    if (!teacherModal) return;
    document.getElementById('modalName').textContent = name;
    document.getElementById('modalRole').textContent = role;
    document.getElementById('modalBadge').textContent = badge;
    document.getElementById('modalBio').textContent = bio;
    teacherModal.hidden = false;
  }

  if (closeModalBtn && teacherModal) {
    closeModalBtn.addEventListener('click', () => teacherModal.hidden = true);
    teacherModal.addEventListener('click', (e) => {
      if (e.target === teacherModal) teacherModal.hidden = true;
    });
  }

  // Statik kartochkalar uchun ham hodisa
  document.querySelectorAll('.leader-premium-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('h3')?.textContent || "Rahbariyat";
      const role = card.querySelector('.l-role')?.textContent || "Rahbar";
      const badge = card.querySelector('.l-badge, .l-badge-sub')?.textContent || "Oliy toifa";
      const bio = card.getAttribute('data-bio') || "Ma'lumot mavjud emas.";
      openTeacherModal(name, role, badge, bio);
    });
  });

  // 4. Telegram Murojaat Formasi
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('mName').value;
      const phone = document.getElementById('mPhone').value;
      const subject = document.getElementById('mSubject').value;
      const text = document.getElementById('mText').value;

      const message = `📨 Yangi murojaat (84-maktab sayti):\n\n👤 Ism: ${name}\n📞 Tel: ${phone}\n📌 Mavzu: ${subject}\n💬 Matn: ${text}`;
      const telegramUrl = `https://t.me/MAK_RAHBARI84?text=${encodeURIComponent(message)}`;
      window.open(telegramUrl, '_blank');
    });
  }

});
