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

document.addEventListener("gb:includes-loaded", () => {
  initScrollSpy();
  initNavLinks();
  initStatsAnimation();
  initCurrentYear();
});
