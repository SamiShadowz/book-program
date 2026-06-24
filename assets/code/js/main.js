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