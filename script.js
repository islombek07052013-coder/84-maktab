/* DENOV 84-MAKTAB — script.js (To'liq va yakuniy versiya) */

document.addEventListener('DOMContentLoaded', () => {

  /* 1. O'quv yili yakunigacha Hisoblagich (Countdown) */
  function updateCountdown() {
    const now = new Date();
    let currentYear = now.getFullYear();
    
    // Yillik 25-may sanasini belgilaymiz (4 = May oyi)
    let targetDate = new Date(currentYear, 4, 25, 8, 0, 0).getTime();
    
    // Agar joriy yilgi 25-may o'tib ketgan bo'lsa, keyingi yilgi 25-mayni hisoblaydi
    if (now.getTime() > targetDate) {
      targetDate = new Date(currentYear + 1, 4, 25, 8, 0, 0).getTime();
    }

    const timeLeft = targetDate - now.getTime();

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


  /* 2. Ustozlar uchun Modal Oyna (Batafsil ma'lumot) */
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


  /* 3. Murojaat Formasidan @MAK_RAHBARI84 ga yuborish */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('mName').value;
      const phone = document.getElementById('mPhone').value;
      const subject = document.getElementById('mSubject').value;
      const text = document.getElementById('mText').value;

      const message = `📨 Yangi murojaat (84-maktab sayti):\n\n👤 Ism: ${name}\n📞 Tel: ${phone}\n📌 Mavzu: ${subject}\n💬 Matn: ${text}`;
      
      // @MAK_RAHBARI84 ga yo'naltirish
      const telegramUrl = `https://t.me/MAK_RAHBARI84?text=${encodeURIComponent(message)}`;
      window.open(telegramUrl, '_blank');
    });
  }


  /* 4. Barcha Xonalar Fotogalereyasi va Lightbox Funksiyasi */
  function roomGalleryInit() {
    const modal = document.getElementById('roomGalleryModal');
    if (!modal) return;

    const modalTitle = document.getElementById('roomModalTitle');
    const mainImg = document.getElementById('activeRoomImg');
    const thumbList = document.getElementById('thumbList');
    const closeBtn = document.getElementById('closeRoomModal');
    const prevBtn = document.getElementById('prevImgBtn');
    const nextBtn = document.getElementById('nextImgBtn');

    const ROOM_DATA = {
      it: {
        title: "IT va Kompyuter Xonasi Rasmlari",
        images: ["images/it_1.jpg.jpg", "images/it_2.jpg.jpg", "images/it_3.jpg.jpg", "images/it_4.jpg.jpg"],
        fallback: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800"
      },
      sewing: {
        title: "Tikuvchilik va Dizayn Xonasi Rasmlari",
        images: ["images/sewing_1.jpg.jpg", "images/sewing_2.jpg.jpg", "images/sewing_3.jpg.jpg"],
        fallback: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800"
      },
      music: {
        title: "Musiqa Xonasi Rasmlari",
        images: ["images/music_1.jpg.jpg", "images/music_2.jpg.jpg", "images/music_3.jpg.jpg"],
        fallback: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800"
      },
      art: {
        title: "Tasviriy San'at Xonasi Rasmlari",
        images: ["images/art_1.jpg.jpg", "images/art_2.jpg.jpg", "images/art_3.jpg.jpg", "images/art_4.jpg.jpg"],
        fallback: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800"
      },
      tech: {
        title: "Texnologiya Xonasi Rasmlari",
        images: ["images/tech_1.jpg.jpg.jpg", "images/tech_2.jpg.jpg.jpg", "images/tech_3.jpg.jpg.jpg"],
        fallback: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800"
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
