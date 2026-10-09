function initScrollSpy() {
  if (!window.bootstrap || !document.getElementById("gbNavbar")) return;

  new bootstrap.ScrollSpy(document.body, {
    target: "#gbNavbar",
    rootMargin: "-20% 0px -60%",
  });
}

function closeMobileMenu() {
  const navbarCollapse = document.getElementById("gbNavbar");
  if (!navbarCollapse || !navbarCollapse.classList.contains("show")) return;

  const collapse = window.bootstrap && bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
  collapse && collapse.hide();
}

function initNavLinks() {
  document.querySelectorAll('#gbNavbar a[href^="#"]').forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

function initSwipers() {
  if (!window.Swiper) return;

  const pagination = (root) => ({
    el: root.querySelector(".gb-swiper-pagination"),
    clickable: true,
  });

  const portfolio = document.querySelector(".gb-portfolio-swiper");
  if (portfolio) {
    new Swiper(portfolio, {
      loop: true,
      centeredSlides: true,
      speed: 600,
      spaceBetween: 24,
      slidesPerView: 1.15,
      breakpoints: {
        576: { slidesPerView: 2 },
        992: { slidesPerView: 3 },
      },
      navigation: {
        prevEl: ".gb-portfolio-prev",
        nextEl: ".gb-portfolio-next",
      },
      pagination: pagination(portfolio),
    });
  }
}

function initCurrentYear() {
  const el = document.getElementById("gbCurrentYear");
  if (el) el.textContent = new Date().getFullYear();
}

function initCookieBanner() {
  const banner = document.getElementById("gbCookieBanner");
  const acceptBtn = document.getElementById("gbCookieAccept");
  const rejectBtn = document.getElementById("gbCookieReject");
  if (!banner || !acceptBtn || !rejectBtn) return;

  const STORAGE_KEY = "gb-cookie-consent";
  const waButton = document.querySelector(".gb-whatsapp-float");
  const baseBottom = waButton ? parseFloat(getComputedStyle(waButton).bottom) || 0 : 0;

  const shiftWhatsApp = (shift) => {
    if (!waButton) return;
    waButton.style.bottom = shift ? `${baseBottom + banner.offsetHeight + 16}px` : "";
  };

  let consentGiven = true;
  try {
    consentGiven = Boolean(localStorage.getItem(STORAGE_KEY));
  } catch (error) {
    consentGiven = true;
  }

  if (!consentGiven) {
    requestAnimationFrame(() => {
      banner.classList.add("show");
      shiftWhatsApp(true);
    });
  }

  const resolveConsent = (choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch (error) {
      // Armazenamento indisponível (ex.: navegação privada) — apenas oculta o banner nesta sessão.
    }
    banner.classList.remove("show");
    shiftWhatsApp(false);

    if (choice === "accepted") {
      document.dispatchEvent(new CustomEvent("gb:cookie-consent-accepted"));
    }
  };

  acceptBtn.addEventListener("click", () => resolveConsent("accepted"));
  rejectBtn.addEventListener("click", () => resolveConsent("rejected"));

  const refreshShift = () => {
    if (banner.classList.contains("show")) shiftWhatsApp(true);
  };

  window.addEventListener("resize", refreshShift);
  document.addEventListener("gb:language-changed", refreshShift);
}

document.addEventListener("gb:includes-loaded", () => {
  initScrollSpy();
  initNavLinks();
  initSwipers();
  initCurrentYear();
  initCookieBanner();
});
