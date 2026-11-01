document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isActive = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', String(isActive));
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Set minimum date to today for date picker
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // --- Booking Form Handling ---
  const form = document.getElementById('bookingForm');
  const bookingResult = document.getElementById('bookingResult');
  const bookingSummary = document.getElementById('bookingSummary');
  const btnBookAgain = document.getElementById('btnBookAgain');

  if (form) {
    const inputs = {
      fullName: document.getElementById('fullName'),
      phone: document.getElementById('phone'),
      date: document.getElementById('date'),
      time: document.getElementById('time'),
      guests: document.getElementById('guests'),
      notes: document.getElementById('notes')
    };

    const errors = {
      fullName: document.getElementById('fullNameError'),
      phone: document.getElementById('phoneError'),
      date: document.getElementById('dateError'),
      time: document.getElementById('timeError'),
      guests: document.getElementById('guestsError')
    };

    const setError = (field, message) => {
      if (inputs[field]) {
        inputs[field].classList.add('invalid');
      }
      if (errors[field]) {
        errors[field].textContent = message;
      }
    };

    const clearError = (field) => {
      if (inputs[field]) {
        inputs[field].classList.remove('invalid');
      }
      if (errors[field]) {
        errors[field].textContent = '';
      }
    };

    // Real-time input error clearing
    Object.keys(inputs).forEach(field => {
      if (inputs[field]) {
        inputs[field].addEventListener('input', () => clearError(field));
      }
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Họ tên
      const fullNameVal = inputs.fullName.value.trim();
      if (!fullNameVal) {
        setError('fullName', 'Vui lòng nhập họ và tên.');
        isValid = false;
      } else {
        clearError('fullName');
      }

      // Validate Số điện thoại
      const phoneVal = inputs.phone.value.trim();
      const phoneRegex = /^(0|\+84)[0-9]{8,11}$/;
      const cleanedPhone = phoneVal.replace(/[\s.-]/g, '');
      if (!phoneVal) {
        setError('phone', 'Vui lòng nhập số điện thoại.');
        isValid = false;
      } else if (!phoneRegex.test(cleanedPhone)) {
        setError('phone', 'Số điện thoại không hợp lệ (ví dụ: 0900000000).');
        isValid = false;
      } else {
        clearError('phone');
      }

      // Validate Ngày
      const dateVal = inputs.date.value;
      if (!dateVal) {
        setError('date', 'Vui lòng chọn ngày.');
        isValid = false;
      } else {
        clearError('date');
      }

      // Validate Giờ
      const timeVal = inputs.time.value;
      if (!timeVal) {
        setError('time', 'Vui lòng chọn giờ.');
        isValid = false;
      } else {
        clearError('time');
      }

      // Validate Số người (1-10)
      const guestsVal = parseInt(inputs.guests.value, 10);
      if (isNaN(guestsVal) || guestsVal < 1 || guestsVal > 10) {
        setError('guests', 'Vui lòng chọn số lượng người từ 1 đến 10.');
        isValid = false;
      } else {
        clearError('guests');
      }

      if (!isValid) {
        // Focus first invalid field
        const firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
        return;
      }

      // Form is valid: build confirmation details
      const notesVal = inputs.notes.value.trim();
      const summaryText = 
        `Cảm ơn ${fullNameVal}! Quán đã nhận yêu cầu đặt bàn.\n` +
        `• Số điện thoại: ${phoneVal}\n` +
        `• Ngày & Giờ: ${dateVal} lúc ${timeVal}\n` +
        `• Số người: ${guestsVal}` +
        (notesVal ? `\n• Ghi chú: ${notesVal}` : '');

      bookingSummary.textContent = summaryText;

      form.style.display = 'none';
      bookingResult.style.display = 'block';
      bookingResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    if (btnBookAgain) {
      btnBookAgain.addEventListener('click', () => {
        form.reset();
        Object.keys(inputs).forEach(clearError);
        bookingResult.style.display = 'none';
        form.style.display = 'block';
      });
    }
  }
});
