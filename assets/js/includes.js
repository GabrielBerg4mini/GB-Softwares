async function loadIncludes() {
  const targets = document.querySelectorAll("[data-include]");

  await Promise.all(
    Array.from(targets).map(async (el) => {
      const file = el.getAttribute("data-include");
      try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(response.status);
        el.outerHTML = await response.text();
      } catch (error) {
        el.innerHTML = `<p class="text-danger m-3">Não foi possível carregar "${file}".</p>`;
        console.error(`Falha ao carregar include "${file}":`, error);
      }
    })
  );

  document.dispatchEvent(new CustomEvent("gb:includes-loaded"));
}

document.addEventListener("DOMContentLoaded", loadIncludes);
