(function () {
  const STORAGE_KEY = "gb-cookie-consent";
  const GA_MEASUREMENT_ID = "G-XTLGKKGE23";

  let loaded = false;

  function hasConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "accepted";
    } catch (error) {
      return false;
    }
  }

  function loadGtag() {
    if (loaded) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  function init() {
    if (hasConsent()) loadGtag();
  }

  document.addEventListener("gb:includes-loaded", init);
  document.addEventListener("gb:cookie-consent-accepted", loadGtag);
})();
