(function () {
  const STORAGE_KEY = "gb-cookie-consent";
  const TAWK_PROPERTY_ID = "6a90a76df9ea923446ab5efc";
  const TAWK_WIDGET_ID = "1k12gs1bf";

  let loaded = false;

  function hasConsent() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "accepted";
    } catch (error) {
      return false;
    }
  }

  function loadTawk() {
    if (loaded || window.Tawk_API) return;
    loaded = true;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
  }

  function init() {
    if (hasConsent()) loadTawk();
  }

  document.addEventListener("gb:includes-loaded", init);
  document.addEventListener("gb:cookie-consent-accepted", loadTawk);
})();
