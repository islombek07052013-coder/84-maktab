/* ==========================================================
   DENOV 84-MAKTAB — To'liq Ishchi JS (Galereya + Modal + Telegram + Adminlar)
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // 1. SUPABASE ULANISHI
  const SUPABASE_URL = 'https://erurfkbqnwzpieantvm.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVydXJma2Jxbnd6cGllYW50dm0iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNzQyMTE5LCJleHAiOjE5Nzk5OTcxMTl9.k8K62Q4p9a3C5s8xW7v1t0m6n2p4q5r8s9t0u1v2w3x';
  
  let supabaseClient = null;

  if (window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      fetchTeachers(supabaseClient);
      loadAdminsList(supabaseClient); // Adminlar ro'yxatini yuklash
    } catch (err) {
      console.log('Supabase ulana olmadi.');
    }
  }

  // USTOZLARNI OLIB KELISH
  async function fetchTeachers(client) {
    try {
      let { data: teachers, error } = await client.from('teachers').select('*');
      if (error) return;

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
              <span class="teacher-badge">${t.badge || "O'qituvchi"}</span>
            </div>
          `;
          card.addEventListener('click', () => {
            openTeacherModal(t.full_name, t.subject, t.badge || "O'qituvchi", t.bio);
          });
          listContainer.appendChild(card);
        });
      }
    } catch(e) {}
  }

  // 2. ADMINLARNI BOSHQARISH (Qo'shish va O'chirish)
  async function loadAdminsList(client) {
    const tableBody = document.querySelector('table tbody'); 
    if (!tableBody) return;

    const { data: admins, error } = await client
      .from('admins')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) return;

    tableBody.innerHTML = '';
    admins.forEach((admin, index) => {
      const row = document.createElement('tr');
      const isSuperAdmin = admin.email === 'islombek07052013@gmail.com';
      
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${admin.email} ${isSuperAdmin ? '<span class="badge" style="background:#f3e5ab; color:#000; padding:2px 6px; border-radius:4px; font-size:11px;">Asosiy (Siz)</span>' : ''}</td>
        <td>
          ${isSuperAdmin ? '<span style="color:gray;">O\'chirib bo\'lmaydi</span>' : `<button class="delete-admin-btn" data-id="${admin.id}" style="color: #ff4d4d; background: none; border: none; cursor: pointer; font-weight:bold;">O'chirish</button>`}
        </td>
      `;
      tableBody.appendChild(row);
    });

    // O'chirish tugmasi
    document.querySelectorAll('.delete-admin-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const adminId = e.target.getAttribute('data-id');
        if (confirm("Haqiqatan ham bu adminni o'chirmoqchimisiz?")) {
          const { error } = await client.from('admins').delete().eq('id', adminId);
          if (!error) loadAdminsList(client);
        }
      });
    });
  }

  // Yangi admin qo'shish tugmasi va inputi
  const addAdminBtn = document.getElementById('addAdminBtn'); // Admin qo'shish tugmasi ID si
  const adminEmailInput = document.querySelector('input[type="email"]'); // Pochta yozish joyi

  if (addAdminBtn && supabaseClient) {
    addAdminBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const emailVal = adminEmailInput ? adminEmailInput.value.trim().toLowerCase() : '';

      if (!emailVal) {
        alert("Iltimos, Google pochtani kiriting!");
        return;
      }

      const { error } = await supabaseClient
        .from('admins')
        .insert([{ email: emailVal }]);

      if (error) {
        alert("Xatolik: Bu pochta allaqachon mavjud yoki xato. (" + error.message + ")");
      } else {
        alert("Yangi admin muvaffaqiyatli qo'shildi!");
        if (adminEmailInput) adminEmailInput.value = '';
        loadAdminsList(supabaseClient);
      }
    });
  }

  // 3. XONALAR GALEREYASI MODAL OYNASI
  const roomModal = document.getElementById('roomGalleryModal');
  const closeRoomModal = document.getElementById('closeRoomModal');
  const activeRoomImg = document.getElementById('activeRoomImg');
  const roomModalTitle = document.getElementById('roomModalTitle');
  const thumbList = document.getElementById('thumbList');
  const prevImgBtn = document.getElementById('prevImgBtn');
  const nextImgBtn = document.getElementById('nextImgBtn');

  let currentImages = [];
  let currentIndex = 0;

  document.querySelectorAll('.room-card').forEach(card => {
    card.addEventListener('click', () => {
      const imagesAttr = card.getAttribute('data-images');
      const titleEl = card.querySelector('h3');
      const roomTitle = titleEl ? titleEl.textContent : "Xona galereyasi";
      
      if (imagesAttr) {
        try {
          currentImages = JSON.parse(imagesAttr);
          currentIndex = 0;
          if (roomModalTitle) roomModalTitle.textContent = roomTitle;
          updateGalleryModal();
          if (roomModal) roomModal.hidden = false;
        } catch(e) {}
      }
    });
  });

  function updateGalleryModal() {
    if (currentImages.length > 0 && activeRoomImg) {
      activeRoomImg.src = currentImages[currentIndex];
      
      if (thumbList) {
        thumbList.innerHTML = '';
        currentImages.forEach((imgSrc, idx) => {
          const thumb = document.createElement('img');
          thumb.src = imgSrc;
          thumb.style.cssText = `width: 60px; height: 45px; object-fit: cover; border-radius: 6px; cursor: pointer; opacity: ${idx === currentIndex ? '1' : '0.5'}; border: ${idx === currentIndex ? '2px solid #f3e5ab' : 'none'};`;
          thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = idx;
            updateGalleryModal();
          });
          thumbList.appendChild(thumb);
        });
      }
    }
  }

  if (prevImgBtn) {
    prevImgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      updateGalleryModal();
    });
  }

  if (nextImgBtn) {
    nextImgBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % currentImages.length;
      updateGalleryModal();
    });
  }

  if (closeRoomModal && roomModal) {
    closeRoomModal.addEventListener('click', () => roomModal.hidden = true);
    roomModal.addEventListener('click', (e) => {
      if (e.target === roomModal) roomModal.hidden = true;
    });
  }

  // 4. USTOZLAR MODAL OYNASI
  const teacherModal = document.getElementById('teacherModal');
  const closeModalBtn = document.getElementById('closeModal');

  function openTeacherModal(name, role, badge, bio) {
    if (!teacherModal) return;
    document.getElementById('modalName').textContent = name;
    document.getElementById('modalRole').textContent = role;
    document.getElementById('modalBadge').textContent = badge;
    document.getElementById('modalBio').textContent = bio || "Ma'lumot mavjud emas.";
    teacherModal.hidden = false;
  }

  if (closeModalBtn && teacherModal) {
    closeModalBtn.addEventListener('click', () => teacherModal.hidden = true);
    teacherModal.addEventListener('click', (e) => {
      if (e.target === teacherModal) teacherModal.hidden = true;
    });
  }

  document.querySelectorAll('.leader-premium-card, .teacher-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('h3')?.textContent || "Ustoz";
      const role = card.querySelector('.l-role, .teacher-role')?.textContent || "O'qituvchi";
      const badge = card.querySelector('.l-badge, .l-badge-sub, .teacher-badge')?.textContent || "Oliy";
      const bio = card.getAttribute('data-bio') || "Ma'lumot mavjud emas.";
      openTeacherModal(name, role, badge, bio);
    });
  });

  // 5. O'QUV YILI YAKUNIGA HISOB-KITOB (COUNTDOWN)
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

  // 6. TELEGRAM FORMASI
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // Agar bu forma admin qo'shish formasi bo'lmasa, Telegramga yuboradi
      if (document.getElementById('addAdminBtn')) return; 
      
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
