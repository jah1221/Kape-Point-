/**
 * Kape Point Cafe - Main Interactive Script
 * Zero Dependencies | Vanilla ES6+ | Fully Accessible
 *
 * Interactive Features:
 * 1. Mobile navigation hamburger toggle with ARIA synchronization
 * 2. Interactive FAQ Accordion with collapsible panels and ARIA state management
 * 3. Table Reservation Modal Dialog with form validation and focus management
 * 4. Menu category filtering
 * 5. Contact form validation and toast notification feedback
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. Toast Notification Utility
     ========================================================================== */
  const showToast = (message, type = 'success') => {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'status');

    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = type === 'success' ? '✓' : 'ℹ';

    const text = document.createElement('span');
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    container.appendChild(toast);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

      setTimeout(() => {
        if (container.contains(toast)) {
          container.removeChild(toast);
        }
      }, 300);
    }, 4000);
  };

  /* ==========================================================================
     2. Dark / Light Mode Theme Toggle
     ========================================================================== */
  const initThemeToggle = () => {
    const themeToggleBtn = document.getElementById('themeToggle');
    const storageKey = 'kape_point_theme';

    const getPreferredTheme = () => {
      const savedTheme = localStorage.getItem(storageKey);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    };

    const applyTheme = (theme, persist = false) => {
      document.documentElement.setAttribute('data-theme', theme);
      if (persist) {
        try {
          localStorage.setItem(storageKey, theme);
        } catch (e) {}
      }

      if (themeToggleBtn) {
        const isDark = theme === 'dark';
        themeToggleBtn.setAttribute('aria-pressed', String(isDark));
        const labelText = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        themeToggleBtn.setAttribute('aria-label', labelText);
        themeToggleBtn.setAttribute('title', labelText);

        const textSpan = themeToggleBtn.querySelector('.theme-toggle-text');
        if (textSpan) {
          textSpan.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }
      }
    };

    // Initialize state
    const currentTheme =
      document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    applyTheme(currentTheme, false);

    // Toggle button event listener
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const targetTheme = activeTheme === 'dark' ? 'light' : 'dark';
        applyTheme(targetTheme, true);
      });
    }

    // Listen for OS scheme changes if user hasn't explicitly set a preference
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const userSaved = localStorage.getItem(storageKey);
        if (!userSaved) {
          applyTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    }
  };

  /* ==========================================================================
     3. Mobile Hamburger Menu Toggle (Section 5)
     ========================================================================== */
  const initNavigation = () => {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const primaryNav = document.getElementById('primaryNav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Sticky header shadow change on window scroll
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (!menuToggle || !primaryNav) return;

    // Toggle menu state and synchronize aria-expanded
    const toggleMenu = () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      const nextState = !isExpanded;

      menuToggle.setAttribute('aria-expanded', String(nextState));
      primaryNav.classList.toggle('is-open', nextState);
    };

    const closeMenu = () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      primaryNav.classList.remove('is-open');
    };

    // Click on hamburger button
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking any navigation link
    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        primaryNav.classList.contains('is-open') &&
        !primaryNav.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Active navigation highlighting via IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window && sections.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const currentId = entry.target.getAttribute('id');
              navLinks.forEach((link) => {
                const href = link.getAttribute('href');
                if (href === `#${currentId}`) {
                  link.classList.add('active');
                } else {
                  link.classList.remove('active');
                }
              });
            }
          });
        },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      );

      sections.forEach((sec) => observer.observe(sec));
    }
  };

  /* ==========================================================================
     3. Interactive FAQ Accordion (Section 5)
     ========================================================================== */
  const initFaqAccordion = () => {
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (!accordionItems.length) return;

    accordionItems.forEach((item) => {
      const trigger = item.querySelector('.accordion-trigger');
      const panel = item.querySelector('.accordion-panel');

      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const isCurrentlyExpanded = trigger.getAttribute('aria-expanded') === 'true';

        // Collapse all other accordion items for clean single-panel view
        accordionItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherTrigger = otherItem.querySelector('.accordion-trigger');
            const otherPanel = otherItem.querySelector('.accordion-panel');

            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherPanel) otherPanel.hidden = true;
          }
        });

        // Toggle state of clicked item
        if (isCurrentlyExpanded) {
          trigger.setAttribute('aria-expanded', 'false');
          panel.hidden = true;
          item.classList.remove('active');
        } else {
          trigger.setAttribute('aria-expanded', 'true');
          panel.hidden = false;
          item.classList.add('active');
        }
      });
    });
  };

  /* ==========================================================================
     4. Table Reservation Modal Dialog (Section 5)
     ========================================================================== */
  const initReservationModal = () => {
    const modal = document.getElementById('reserveModal');
    const openButtons = document.querySelectorAll('.open-reserve-modal');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelModalBtn');
    const form = document.getElementById('reservationForm');
    const dateInput = document.getElementById('resDate');

    if (!modal) return;

    // Set today as minimum selectable reservation date
    if (dateInput) {
      const todayISO = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', todayISO);
      dateInput.value = todayISO;
    }

    let previousActiveElement = null;

    const openModal = () => {
      previousActiveElement = document.activeElement;
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';

      // Focus first interactive element inside modal
      const firstInput = modal.querySelector('input, select, textarea, button');
      firstInput?.focus();
    };

    const closeModal = () => {
      modal.setAttribute('hidden', '');
      document.body.style.overflow = '';
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };

    openButtons.forEach((btn) => btn.addEventListener('click', openModal));
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);

    // Click outside dialog to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
        closeModal();
      }
    });

    // Client-side static validation
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameField = document.getElementById('resName');
        const phoneField = document.getElementById('resPhone');
        const timeField = document.getElementById('resTime');
        const nameError = document.getElementById('resNameError');
        const phoneError = document.getElementById('resPhoneError');
        const timeError = document.getElementById('resTimeError');

        // Reset errors
        [nameError, phoneError, timeError].forEach((el) => {
          if (el) el.textContent = '';
        });
        [nameField, phoneField, timeField].forEach((el) => {
          el?.classList.remove('invalid');
        });

        let isValid = true;

        if (!nameField?.value.trim()) {
          nameError.textContent = 'Please enter your full name.';
          nameField?.classList.add('invalid');
          isValid = false;
        }

        if (!phoneField?.value.trim()) {
          phoneError.textContent = 'Please provide a valid contact number.';
          phoneField?.classList.add('invalid');
          isValid = false;
        }

        if (!timeField?.value) {
          timeError.textContent = 'Please select a preferred dining time.';
          timeField?.classList.add('invalid');
          isValid = false;
        }

        if (isValid) {
          const guestName = nameField.value.trim();
          closeModal();
          showToast(`Table reserved for ${guestName}! We look forward to welcoming you.`);
          form.reset();

          if (dateInput) {
            const todayISO = new Date().toISOString().split('T')[0];
            dateInput.value = todayISO;
          }
        }
      });
    }
  };

  /* ==========================================================================
     5. Menu Category Filtering Tabs
     ========================================================================== */
  const initMenuTabs = () => {
    const tabButtons = document.querySelectorAll('.menu-tab-btn');
    const menuCards = document.querySelectorAll('.menu-card');

    if (!tabButtons.length || !menuCards.length) return;

    tabButtons.forEach((button) => {
      button.addEventListener('click', () => {
        // Synchronize ARIA and active class
        tabButtons.forEach((btn) => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');

        const selectedCategory = button.getAttribute('data-category');

        menuCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (selectedCategory === 'all' || cardCategory === selectedCategory) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  };

  /* ==========================================================================
     6. Contact Form Validation
     ========================================================================== */
  const initContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName');
      const email = document.getElementById('contactEmail');
      const message = document.getElementById('contactMessage');
      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const messageError = document.getElementById('messageError');

      // Reset previous error messages
      [nameError, emailError, messageError].forEach((el) => {
        if (el) el.textContent = '';
      });
      [name, email, message].forEach((el) => {
        el?.classList.remove('invalid');
      });

      let isValid = true;

      if (!name?.value.trim()) {
        nameError.textContent = 'Please enter your name.';
        name?.classList.add('invalid');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email?.value.trim() || !emailRegex.test(email.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        email?.classList.add('invalid');
        isValid = false;
      }

      if (!message?.value.trim()) {
        messageError.textContent = 'Please enter your message.';
        message?.classList.add('invalid');
        isValid = false;
      }

      if (isValid) {
        showToast('Salamat! Your message has been sent to our cafe team.');
        contactForm.reset();
      }
    });
  };

  /* ==========================================================================
     7. Order Cart System
     ========================================================================== */
  const initOrderCart = () => {
    // Cart state: array of { name, price, qty }
    let cart = [];

    // DOM references
    const fab = document.getElementById('cartFab');
    const fabCount = document.getElementById('cartFabCount');
    const overlay = document.getElementById('cartOverlay');
    const drawer = document.getElementById('cartDrawer');
    const drawerClose = document.getElementById('cartDrawerClose');
    const drawerBody = document.getElementById('cartDrawerBody');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItemsList = document.getElementById('cartItemsList');
    const drawerFooter = document.getElementById('cartDrawerFooter');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    const placeOrderBtn = document.getElementById('cartPlaceOrder');
    const clearAllBtn = document.getElementById('cartClearAll');
    const addButtons = document.querySelectorAll('.btn-add-to-order');

    if (!fab || !drawer) return;

    // ---- Cart Drawer Open / Close ----
    const openDrawer = () => {
      overlay?.removeAttribute('hidden');
      drawer.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      drawerClose?.focus();
    };

    const closeDrawer = () => {
      drawer.setAttribute('hidden', '');
      overlay?.setAttribute('hidden', '');
      document.body.style.overflow = '';
    };

    fab.addEventListener('click', openDrawer);
    drawerClose?.addEventListener('click', closeDrawer);
    overlay?.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !drawer.hasAttribute('hidden')) {
        closeDrawer();
      }
    });

    // ---- Cart State Helpers ----
    const getTotal = () => cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const getTotalItems = () => cart.reduce((sum, item) => sum + item.qty, 0);

    const updateFabBadge = () => {
      const count = getTotalItems();
      if (count > 0) {
        fabCount.textContent = count;
        fabCount.removeAttribute('hidden');
      } else {
        fabCount.setAttribute('hidden', '');
      }
    };

    const pulseFab = () => {
      fab.classList.remove('pulse');
      // Force reflow to restart animation
      void fab.offsetWidth;
      fab.classList.add('pulse');
    };

    const renderCart = () => {
      updateFabBadge();

      if (cart.length === 0) {
        cartEmpty.style.display = '';
        cartItemsList.innerHTML = '';
        drawerFooter?.setAttribute('hidden', '');
        return;
      }

      cartEmpty.style.display = 'none';
      drawerFooter?.removeAttribute('hidden');

      // Render items
      cartItemsList.innerHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₱${item.price} each</div>
          </div>
          <div class="cart-item-controls">
            <button type="button" class="cart-qty-btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity of ${item.name}">−</button>
            <span class="cart-qty-value">${item.qty}</span>
            <button type="button" class="cart-qty-btn" data-action="increase" data-index="${index}" aria-label="Increase quantity of ${item.name}">+</button>
          </div>
          <span class="cart-item-subtotal">₱${item.price * item.qty}</span>
          <button type="button" class="cart-item-remove" data-action="remove" data-index="${index}" aria-label="Remove ${item.name} from order">✕</button>
        </div>
      `).join('');

      // Update totals
      const total = getTotal();
      subtotalEl.textContent = `₱${total.toLocaleString()}`;
      totalEl.textContent = `₱${total.toLocaleString()}`;
    };

    // ---- Add to Cart (from menu buttons) ----
    addButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.menu-card');
        if (!card) return;

        const name = card.dataset.itemName;
        const price = parseInt(card.dataset.itemPrice, 10);

        const existing = cart.find((item) => item.name === name);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ name, price, qty: 1 });
        }

        // Visual feedback on button
        btn.textContent = '✓ Added';
        btn.classList.add('added');
        setTimeout(() => {
          btn.textContent = '+ Add';
          btn.classList.remove('added');
        }, 1200);

        pulseFab();
        renderCart();
      });
    });

    // ---- Cart Item Controls (Increase / Decrease / Remove) ----
    cartItemsList.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;

      const action = btn.dataset.action;
      const index = parseInt(btn.dataset.index, 10);

      if (isNaN(index) || index < 0 || index >= cart.length) return;

      if (action === 'increase') {
        cart[index].qty += 1;
      } else if (action === 'decrease') {
        cart[index].qty -= 1;
        if (cart[index].qty <= 0) {
          cart.splice(index, 1);
        }
      } else if (action === 'remove') {
        cart.splice(index, 1);
      }

      renderCart();
    });

    // ---- Place Order ----
    placeOrderBtn?.addEventListener('click', () => {
      if (cart.length === 0) return;

      const orderType = document.querySelector('input[name="orderType"]:checked')?.value || 'dine-in';
      const total = getTotal();
      const itemCount = getTotalItems();
      const label = orderType === 'dine-in' ? 'Dine-In' : 'Takeout';

      cart = [];
      renderCart();
      closeDrawer();

      showToast(`Order placed! ${itemCount} item${itemCount > 1 ? 's' : ''} (${label}) — ₱${total.toLocaleString()}. Preparing your order now! ☕`);
    });

    // ---- Clear All ----
    clearAllBtn?.addEventListener('click', () => {
      cart = [];
      renderCart();
    });

    // Initial render
    renderCart();
  };

  /* ==========================================================================
     Initialize All Modules On DOMContentLoaded
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavigation();
    initFaqAccordion();
    initReservationModal();
    initMenuTabs();
    initContactForm();
    initOrderCart();
  });
})();
