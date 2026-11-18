/* =====================================================================
   HORIZON · Landing page · Interações (menu, animações, mapa de calor)
   O formulário fica em contato.js.
   ===================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  window.horizonPronto = true;
  const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Menu ---------- */
  const topo = document.getElementById("topo");
  const botaoMenu = document.getElementById("menu-botao");
  const menu = document.getElementById("menu");

  function fecharMenu() {
    topo.classList.remove("aberto");
    botaoMenu.setAttribute("aria-expanded", "false");
    botaoMenu.setAttribute("aria-label", "Abrir menu");
  }

  botaoMenu.addEventListener("click", function () {
    const abrir = !topo.classList.contains("aberto");
    topo.classList.toggle("aberto", abrir);
    botaoMenu.setAttribute("aria-expanded", String(abrir));
    botaoMenu.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
  });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) fecharMenu(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecharMenu(); });
  window.matchMedia("(min-width: 1024px)").addEventListener("change", fecharMenu);

  // Fundo branco no menu depois que a página rola
  function aoRolar() { topo.classList.toggle("rolado", window.scrollY > 24); }
  aoRolar();
  window.addEventListener("scroll", aoRolar, { passive: true });

  /* ---------- Entrada das seções + contadores ---------- */
  const revelar = document.querySelectorAll(".revelar");
  const contadores = document.querySelectorAll("[data-contar]");

  function contar(el) {
    const alvo = Number(el.dataset.contar);
    if (menosMovimento || alvo === 0) { el.textContent = alvo; return; }
    const duracao = 1100, inicio = performance.now();
    (function passo(agora) {
      const t = Math.min(1, (agora - inicio) / duracao);
      el.textContent = Math.round(alvo * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(passo);
    })(inicio);
  }

  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("visivel");
        en.target.querySelectorAll("[data-contar]").forEach(contar);
        obs.unobserve(en.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revelar.forEach(function (el) { obs.observe(el); });
  } else {
    revelar.forEach(function (el) { el.classList.add("visivel"); });
    contadores.forEach(function (el) { el.textContent = el.dataset.contar; });
  }

  /* ---------- Mapa de calor do hero: a turma "evolui" ---------- */
  // Alterna entre o diagnóstico (antes) e o pós-aula (depois) a cada 3,5 s
  const celulas = document.querySelectorAll(".mapa-linha i");
  if (celulas.length && !menosMovimento) {
    const antes = Array.from(celulas).map(function (c) { return c.className; });
    const subir = { "n-d": "n-c", "n-c": "n-b", "n-b": "n-b", "n-a": "n-a" };
    const depois = antes.map(function (n, i) { return i % 3 === 2 ? n : subir[n]; });
    let mostrandoDepois = false;
    setInterval(function () {
      if (document.hidden) return;
      mostrandoDepois = !mostrandoDepois;
      const lista = mostrandoDepois ? depois : antes;
      celulas.forEach(function (c, i) { c.className = lista[i]; });
    }, 3500);
  }
})();
