/* ==========================================================================
   Invitación XV Años - Lupita García Hidalgo
   Lógica interactiva, cuenta regresiva, animaciones y WhatsApp RSVP
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. FECHA DEL EVENTO: Sábado 10 de Octubre de 2026 a las 16:00 (Misa)
  const eventDate = new Date('2026-10-10T16:00:00-06:00').getTime();

  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 2. EFECTO DE PÉTALOS FLOTANTES
  const petalsContainer = document.querySelector('.petals-container');
  if (petalsContainer) {
    const petalCount = 14;
    for (let i = 0; i < petalCount; i++) {
      createPetal(petalsContainer);
    }
  }

  function createPetal(container) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // Propiedades aleatorias
    const startLeft = Math.random() * 100;
    const duration = 6 + Math.random() * 8;
    const delay = Math.random() * 5;
    const size = 10 + Math.random() * 14;

    petal.style.left = `${startLeft}vw`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.4}px`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.animationDelay = `${delay}s`;

    container.appendChild(petal);

    petal.addEventListener('animationiteration', () => {
      petal.style.left = `${Math.random() * 100}vw`;
    });
  }

  // 3. ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => revealObserver.observe(el));

  // 4. PANTALLA DE BIENVENIDA Y AUDIO DE FONDO
  const bgAudio = document.getElementById('bgAudio');
  const musicToggle = document.getElementById('musicToggle');
  const welcomeScreen = document.getElementById('welcomeScreen');
  const openInvitationBtn = document.getElementById('openInvitationBtn');
  let isPlaying = false;

  function playMusic() {
    if (bgAudio) {
      bgAudio.play().then(() => {
        if (musicToggle) musicToggle.classList.add('playing');
        isPlaying = true;
      }).catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    }
  }

  function pauseMusic() {
    if (bgAudio) {
      bgAudio.pause();
      if (musicToggle) musicToggle.classList.remove('playing');
      isPlaying = false;
    }
  }

  if (openInvitationBtn && welcomeScreen) {
    openInvitationBtn.addEventListener('click', () => {
      welcomeScreen.classList.add('hidden');
      playMusic();
    });
  }

  if (musicToggle && bgAudio) {
    musicToggle.addEventListener('click', () => {
      if (isPlaying) {
        pauseMusic();
      } else {
        playMusic();
      }
    });
  }

  // 5. MODAL DE CONFIRMACIÓN POR WHATSAPP
  const rsvpModal = document.getElementById('rsvpModal');
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const rsvpForm = document.getElementById('rsvpForm');

  if (openModalBtn && rsvpModal) {
    openModalBtn.addEventListener('click', () => {
      rsvpModal.classList.add('active');
    });
  }

  if (closeModalBtn && rsvpModal) {
    closeModalBtn.addEventListener('click', () => {
      rsvpModal.classList.remove('active');
    });
  }

  if (rsvpModal) {
    rsvpModal.addEventListener('click', (e) => {
      if (e.target === rsvpModal) {
        rsvpModal.classList.remove('active');
      }
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guestName = document.getElementById('guestName').value.trim();
      const attendance = document.getElementById('guestAttendance').value;
      const guestCount = document.getElementById('guestCount').value;
      const guestNote = document.getElementById('guestNote').value.trim();

      // Número de WhatsApp para confirmaciones
      const phoneNumber = "526393989687";

      let message = `¡Hola! Confirmo mi respuesta para los XV de Lupita García Hidalgo:\n\n`;
      message += `• *Nombre:* ${guestName}\n`;
      message += `• *Asistencia:* ${attendance}\n`;
      if (attendance === 'Sí, asistiré') {
        message += `• *Pases que confirmo:* ${guestCount}\n`;
      }
      if (guestNote) {
        message += `• *Mensaje:* ${guestNote}\n`;
      }

      const encodedUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(encodedUrl, '_blank');
      rsvpModal.classList.remove('active');
    });
  }
});
