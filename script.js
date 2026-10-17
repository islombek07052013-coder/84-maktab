/* DENOV 84-MAKTAB — script.js (Barcha xonalar rasmlari bilan) */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. O'quv yili yakunigacha Hisoblagich (Countdown) */
  function updateCountdown() {
    const targetDate = new Date('2026-05-25T08:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft > 0) {
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      const cdDays = document.getElementById('cdDays');
      const cdHours = document.getElementById('cdHours');
      const cdMins = document.getElementById('cdMins');
      const cdSecs = document.getElementById('cdSecs');

      if (cdDays) cdDays.textContent = String(days).padStart(2, '0');
      if (cdHours) cdHours.textContent = String(hours).padStart(2, '0');
      if (cdMins) cdMins.textContent = String(minutes).padStart(2, '0');
      if (cdSecs) cdSecs.textContent = String(seconds).padStart(2, '0');
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();


  /* 2. Sinflar bo'yicha Dars Jadvali Filtr va Ma'lumotlari */
  const scheduleData = {
    primary: {
      title: "1 - 4 Sinflar (Boshlang'ich smena)",
      headers: ["Hafta kuni", "1-soat", "2-soat", "3-soat", "4-soat"],
      rows: [
        ["Dushanba", "Ona tili", "Matematika", "O'qish", "Jismoniy tarbiya"],
        ["Seshanba", "Matematika", "Ona tili", "Tabiatshunoslik", "Rasm"],
        ["Chorshanba", "Ona tili", "Matematika", "O'qish", "Ingliz tili"],
        ["Payshanba", "Matematika", "Ona tili", "Musiqa", "Texnologiya"],
        ["Juma", "Oqish", "Matematika", "Jismoniy tarbiya", "Odobnoma"]
      ]
    },
    middle: {
      title: "5 - 9 Sinflar (O'rta bo'g'in)",
      headers: ["Hafta kuni", "1-soat", "2-soat", "3-soat", "4-soat", "5-soat", "6-soat"],
      rows: [
        ["Dushanba", "Matematika", "Ona tili", "Fizika", "Ingliz tili", "Tarix", "Jismoniy tarbiya"],
        ["Seshanba", "Adabiyot", "Matematika", "Biologiya", "Informatika", "Geografiya", "Rus tili"],
        ["Chorshanba", "Fizika", "Kimyo", "Matematika", "Ingliz tili", "Ona tili", "Tarbiya"],
        ["Payshanba", "Tarix", "Geografiya", "Matematika", "Adabiyot", "Informatika", "Biologiya"],
        ["Juma", "Ingliz tili", "Kimyo", "Ona tili", "Fizika", "Jismoniy tarbiya", "Musiqa / Chizma"]
      ]
    },
    senior: {
      title: "10 - 11 Sinflar (Yuqori sinflar)",
      headers: ["Hafta kuni", "1-soat", "2-soat", "3-soat", "4-soat", "5-soat", "6-soat"],
      rows: [
        ["Dushanba", "Algebra", "Fizika", "Ingliz tili", "Ona tili", "Kimyo", "Tarix"],
        ["Seshanba", "Geometriya", "Kimyo", "Biologiya", "Informatika", "Adabiyot", "Huquq"],
        ["Chorshanba", "Fizika", "Algebra", "Ingliz tili", "Tarix", "Geografiya", "Jismoniy tarbiya"],
        ["Payshanba", "Ona tili", "Geometriya", "Biologiya", "Informatika", "Kimyo", "Iqtisod"],
        ["Juma", "Ingliz tili", "Algebra", "Fizika", "Adabiyot", "ChQBT / Tarbiya", "Jismoniy tarbiya"]
      ]
    }
  };

  function renderSchedule(groupKey) {
    const box = document.getElementById('schedContent');
    if (!box) return;
    const data = scheduleData[groupKey];
    if (!data) return;

    let html = `<h4 style="margin-bottom: 15px; color: var(--color-gold-300); font-weight: 700;">📌 ${data.title}</h4>`;
    html += `<div style="overflow-x: auto;"><table class="sched-table"><thead><tr>`;
    
    data.headers.forEach(h => html += `<th>${h}</th>`);
    html += `</tr></thead><tbody>`;

    data.rows.forEach(row => {
      html += `<tr>`;
      row.forEach(cell => html += `<td>${cell}</td>`);
      html += `</tr>`;
    });

    html += `</tbody></table></div>`;
    box.innerHTML = html;
  }

  const schedBtns = document.querySelectorAll('.sched-btn');
  schedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      schedBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      if (btn.textContent.includes('1 - 4')) renderSchedule('primary');
      else if (btn.textContent.includes('5 - 9')) renderSchedule('middle');
      else if (btn.textContent.includes('10 - 11')) renderSchedule('senior');
    });
  });

  renderSchedule('primary');


  /* 3. Ustozlar uchun Modal Oyna (Batafsil ma'lumot) */
  const teacherModal = document.getElementById('teacherModal');
  const closeModalBtn = document.getElementById('closeModal');
  const modalName = document.getElementById('modalName');
  const modalRole = document.getElementById('modalRole');
  const modalBadge = document.getElementById('modalBadge');
  const modalBio = document.getElementById('modalBio');

  document.querySelectorAll('.teacher-card, .leader-premium-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('h3').textContent;
      const role = card.querySelector('.teacher-role, .l-role, .l-badge, .l-badge-sub') ? card.querySelector('.teacher-role, .l-role, .l-badge, .l-badge-sub').textContent : "Pedagog";
      const badge = card.querySelector('.teacher-badge, .l-role') ? card.querySelector('.teacher-badge, .l-role').textContent : "Mutaxassis";
      const bio = card.dataset.bio || "Ushbu ustozimiz o'z ishining professional mutaxassisi bo'lib, ko'plab o'quvchilarga chuqur bilim berib kelmoqda.";

      if (modalName) modalName.textContent = name;
      if (modalRole) modalRole.textContent = role;
      if (modalBadge) modalBadge.textContent = badge;
      if (modalBio) modalBio.textContent = bio;

      if (teacherModal) teacherModal.hidden = false;
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => teacherModal.hidden = true);
  }
  if (teacherModal) {
    teacherModal.addEventListener('click', (e) => {
      if (e.target === teacherModal) teacherModal.hidden = true;
    });
  }


  /* 4. Murojaat Formasidan Telegramga yuborish */
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


  /* 5. Barcha Xonalar Fotogalereyasi va 4 tadan Rasmlar Lightbox Funksiyasi */
  function roomGalleryInit() {
    const modal = document.getElementById('roomGalleryModal');
    if (!modal) return;

    const modalTitle = document.getElementById('roomModalTitle');
    const mainImg = document.getElementById('activeRoomImg');
    const thumbList = document.getElementById('thumbList');
    const closeBtn = document.getElementById('closeRoomModal');
    const prevBtn = document.getElementById('prevImgBtn');
    const nextBtn = document.getElementById('nextImgBtn');

    // Har bir xonaning 4 tadan rasmlari
    const ROOM_DATA = {
      it: {
        title: "IT va Kompyuter Xonasi Rasmlari",
        images: [it_1.jpg, "images/it_2.jpg", "images/it_3.jpg", "images/it_4.jpg"],
        fallback: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800"
      },
      sewing: {
        title: "Tikuvchilik va Mehnat Xonasi Rasmlari",
        images: ["images/sewing_1.jpg", "images/sewing_2.jpg", "images/sewing_3.jpg", "images/sewing_4.jpg"],
        fallback: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800"
      },
      robotics: {
        title: "Robototexnika Laboratoriyasi Rasmlari",
        images: ["images/robot_1.jpg", "images/robot_2.jpg", "images/robot_3.jpg", "images/robot_4.jpg"],
        fallback: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800"
      },
      science: {
        title: "Kimyo va Biologiya Laboratoriyasi Rasmlari",
        images: ["images/science_1.jpg", "images/science_2.jpg", "images/science_3.jpg", "images/science_4.jpg"],
        fallback: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800"
      },
      library: {
        title: "Zamonaviy Kutubxona Rasmlari",
        images: ["images/lib_1.jpg", "images/lib_2.jpg", "images/lib_3.jpg", "images/lib_4.jpg"],
        fallback: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800"
      }
    };

    let currentImages = [];
    let currentIndex = 0;

    function showImage(index) {
      currentIndex = index;
      if (currentIndex < 0) currentIndex = currentImages.length - 1;
      if (currentIndex >= currentImages.length) currentIndex = 0;

      mainImg.src = currentImages[currentIndex];
      
      const thumbs = thumbList.querySelectorAll('.thumb-img');
      thumbs.forEach((t, idx) => {
        t.classList.toggle('active-thumb', idx === currentIndex);
      });
    }

    document.querySelectorAll('.room-card').forEach(card => {
      card.addEventListener('click', () => {
        const roomType = card.dataset.room;
        const data = ROOM_DATA[roomType];
        if (!data) return;

        modalTitle.textContent = data.title;
        currentImages = data.images;
        
        thumbList.innerHTML = '';
        currentImages.forEach((src, idx) => {
          const img = document.createElement('img');
          img.src = src;
          img.className = 'thumb-img';
          img.onerror = function() { this.src = data.fallback; };
          img.addEventListener('click', () => showImage(idx));
          thumbList.appendChild(img);
        });

        mainImg.onerror = function() { this.src = data.fallback; };
        showImage(0);
        modal.hidden = false;
      });
    });

    if (prevBtn) prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => showImage(currentIndex + 1));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.hidden = true);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.hidden = true;
    });
  }

  roomGalleryInit();

});
