/* =========================================================
   BOOK & BEYOND PUBLISHING™
   Authority Whiteboard Landing Page
   File: assets/code/js/main.js
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initOrderBumpTotal();
  initModal();
  initBookBelt();
  initProgressBar();
  initScrollReveal();
  initCounters();
  initFloatingCTA();
});

/* ------------------------------
   Mobile Navigation
------------------------------ */

function initMobileNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-active");
  });

  const links = navLinks.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.classList.remove("is-active");
    });
  });
}

/* ------------------------------
   Checkout Total / Order Bump
------------------------------ */

function initOrderBumpTotal() {
  const orderBump = document.querySelector('input[name="bestseller_launch_kit"]');
  const totalPrice = document.querySelector("[data-total-price]");

  if (!orderBump || !totalPrice) return;

  const basePrice = 97;
  const bumpPrice = 47;

  function updateTotal() {
    const total = orderBump.checked ? basePrice + bumpPrice : basePrice;
    totalPrice.textContent = `$${total}`;
  }

  orderBump.addEventListener("change", updateTotal);
  updateTotal();
}

/* ------------------------------
   Learn More Modal
------------------------------ */

function initModal() {
  const modal = document.getElementById("bump-modal");
  const openButtons = document.querySelectorAll("[data-open-modal]");
  const closeButtons = document.querySelectorAll("[data-close-modal]");

  if (!modal || !openButtons.length) return;

  openButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const modalId = button.getAttribute("data-open-modal");
      const targetModal = document.getElementById(modalId);

      if (!targetModal) return;

      if (typeof targetModal.showModal === "function") {
        targetModal.showModal();
      } else {
        targetModal.setAttribute("open", "true");
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const openModal = button.closest("dialog");

      if (!openModal) return;

      openModal.close();
    });
  });

  modal.addEventListener("click", (event) => {
    const modalContent = modal.querySelector(".modal-content");

    if (!modalContent) return;

    const clickedOutside = !modalContent.contains(event.target);

    if (clickedOutside) {
      modal.close();
    }
  });
}

/* ------------------------------
   Book Belt Duplication
   Creates smoother infinite scroll.
------------------------------ */

function initBookBelt() {
  const bookTrack = document.querySelector(".book-track");

  if (!bookTrack) return;

  const books = Array.from(bookTrack.children);

  if (!books.length) return;

  books.forEach((book) => {
    const clone = book.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    bookTrack.appendChild(clone);
  });
}

/* ------------------------------
   Reading Progress Bar
------------------------------ */

function initProgressBar() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;

  const update = () => {
    const scrolled = window.scrollY;
    const total =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = `${Math.min(pct, 100)}%`;
    bar.setAttribute("aria-valuenow", Math.round(pct));
  };

  window.addEventListener("scroll", update, { passive: true });
  update(); // run once on load
}

/* ------------------------------
   Scroll Reveal
   Fade-up elements with [data-reveal]
------------------------------ */

function initScrollReveal() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;

  // Fallback: no IntersectionObserver support
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  els.forEach((el) => observer.observe(el));
}

/* ------------------------------
   Counter Animation
   Animates [data-count] elements when in view.
   Usage: <strong data-count="150" data-suffix="+">150+</strong>
------------------------------ */

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  if (!("IntersectionObserver" in window)) return;

  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const duration = 1800;
        const startTime = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = easeOutQuart(progress);
          const value = target * eased;

          el.textContent =
            (Number.isInteger(target)
              ? Math.floor(value)
              : value.toFixed(0)) + suffix;

          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ------------------------------
   Floating CTA Bar
   Appears after scrolling past the hero.
   Hides when the checkout section is visible.
------------------------------ */

function initFloatingCTA() {
  const cta = document.getElementById("floating-cta");
  const checkout = document.getElementById("checkout");

  if (!cta) return;

  const update = () => {
    const scrollY = window.scrollY;

    // Start showing after 600px
    if (scrollY < 600) {
      cta.classList.remove("is-visible");
      cta.setAttribute("aria-hidden", "true");
      return;
    }

    // Hide once checkout is on screen
    if (checkout) {
      const { top } = checkout.getBoundingClientRect();
      if (top < window.innerHeight * 0.75) {
        cta.classList.remove("is-visible");
        cta.setAttribute("aria-hidden", "true");
        return;
      }
    }

    cta.classList.add("is-visible");
    cta.setAttribute("aria-hidden", "false");
  };

  window.addEventListener("scroll", update, { passive: true });
}

/* ------------------------------
   Temporary Form Handling
   Replace this when PayPal is connected.
------------------------------ */

const orderForm = document.querySelector(".order-form");

if (orderForm) {
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    alert(
      "PayPal checkout is not connected yet. Replace this placeholder in main.js when your PayPal button is ready."
    );
  });
}
