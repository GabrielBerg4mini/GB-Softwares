(function () {
  const STORAGE_KEY = "gb-lang";
  const DEFAULT_LANG = "pt-BR";
  const LANGS = {
    "pt-BR": { label: "PT-BR", locale: "pt_BR" },
    "pt-PT": { label: "PT-PT", locale: "pt_PT" },
    en: { label: "EN", locale: "en_US" },
  };

  const cache = {};
  let current = DEFAULT_LANG;

  function detectLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGS[saved]) return saved;
    } catch (error) {
      // Armazenamento indisponível — segue para a detecção pelo navegador.
    }

    const browser = (navigator.language || "").toLowerCase();
    if (browser === "pt-pt") return "pt-PT";
    if (browser.startsWith("pt")) return "pt-BR";
    if (browser.startsWith("en")) return "en";
    return DEFAULT_LANG;
  }

  async function loadDictionary(lang) {
    if (cache[lang]) return cache[lang];
    const response = await fetch(`assets/i18n/${lang}.json`);
    if (!response.ok) throw new Error(response.status);
    cache[lang] = await response.json();
    return cache[lang];
  }

  function fill(template, el) {
    const holder = el.closest("[data-name]");
    const name = holder ? holder.dataset.name : "";
    return template.replace("{name}", name);
  }

  function setMeta(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute("content", value);
  }

  function applyDictionary(dict, lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = dict[el.dataset.i18n];
      if (value !== undefined) el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const value = dict[el.dataset.i18nHtml];
      if (value !== undefined) el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":");
        const value = dict[key];
        if (attr && value !== undefined) el.setAttribute(attr, fill(value, el));
      });
    });

    // Mensagem pré-preenchida dos links de WhatsApp
    document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
      const base = link.href.split("?")[0];
      link.href = `${base}?text=${encodeURIComponent(dict["wa.message"])}`;
    });

    document.documentElement.lang = lang;
    document.title = dict["meta.title"];
    setMeta('meta[name="description"]', dict["meta.description"]);
    setMeta('meta[property="og:title"]', dict["meta.title"]);
    setMeta('meta[property="og:description"]', dict["meta.description"]);
    setMeta('meta[property="og:locale"]', LANGS[lang].locale);
    setMeta('meta[name="twitter:title"]', dict["meta.title"]);
    setMeta('meta[name="twitter:description"]', dict["meta.description"]);

    document.querySelectorAll(".gb-lang-current").forEach((el) => {
      el.textContent = LANGS[lang].label;
    });
    document.querySelectorAll("[data-lang]").forEach((item) => {
      const active = item.dataset.lang === lang;
      item.classList.toggle("active", active);
      item.setAttribute("aria-current", active ? "true" : "false");
    });
  }

  async function setLanguage(lang, persist) {
    if (!LANGS[lang]) lang = DEFAULT_LANG;

    try {
      const dict = await loadDictionary(lang);
      current = lang;
      applyDictionary(dict, lang);
      document.dispatchEvent(new CustomEvent("gb:language-changed", { detail: { lang } }));
    } catch (error) {
      console.error(`Falha ao carregar o idioma "${lang}":`, error);
      return;
    }

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (error) {
        // Sem armazenamento (ex.: navegação privada) — a escolha vale só nesta sessão.
      }
    }
  }

  function init() {
    document.querySelectorAll("[data-lang]").forEach((item) => {
      item.addEventListener("click", () => {
        if (item.dataset.lang !== current) setLanguage(item.dataset.lang, true);
      });
    });

    setLanguage(detectLanguage(), false);
  }

  document.addEventListener("gb:includes-loaded", init);
})();
