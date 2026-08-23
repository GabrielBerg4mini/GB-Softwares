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

function animateCount(el, duration = 1200) {
  const target = Number(el.dataset.countTo);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = `${prefix}${Math.round(eased * target)}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initStatsAnimation() {
  const items = Array.from(document.querySelectorAll("#sobre .gb-stats li"));
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const item = entry.target;
        item.style.setProperty("--gb-delay", `${items.indexOf(item) * 0.12}s`);
        item.classList.add("is-visible");

        const number = item.querySelector(".gb-stat-number[data-count-to]");
        if (number) animateCount(number);

        obs.unobserve(item);
      });
    },
    { threshold: 0.4 }
  );

  items.forEach((item) => observer.observe(item));
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
  };

  acceptBtn.addEventListener("click", () => resolveConsent("accepted"));
  rejectBtn.addEventListener("click", () => resolveConsent("rejected"));

  window.addEventListener("resize", () => {
    if (banner.classList.contains("show")) shiftWhatsApp(true);
  });
}

document.addEventListener("gb:includes-loaded", () => {
  initScrollSpy();
  initNavLinks();
  initStatsAnimation();
  initCurrentYear();
  initCookieBanner();
});
