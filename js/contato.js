/* =====================================================================
   HORIZON · Landing page · Formulário de interessados (2 etapas)
   ---------------------------------------------------------------------
   Envia os dados para a planilha "Horizon · Interessados" pelo Apps
   Script (apps-script/Interessados.gs).

   >>> ÚNICA CONFIGURAÇÃO NECESSÁRIA: cole a URL do App da Web abaixo. <<<
   Enquanto a URL não estiver configurada, o formulário funciona em
   "modo de teste": nada é enviado e os dados aparecem no console.

   O HTML esperado (montado na etapa 5) é:
     <form id="form-etapa-1"> ... campos com name="..." ... </form>
     <form id="form-etapa-2" hidden> ... </form>
     <div  id="form-sucesso" hidden> ... </div>
     <p    id="form-status" role="status" aria-live="polite"></p>
     <a    data-contato="email">  e  <a data-contato="whatsapp">
     <button type="button" id="pular-etapa-2">
   ===================================================================== */

const CONTATO_CONFIG = {
  URL_PLANILHA: "https://script.google.com/macros/s/AKfycbynt5uuc6I45kf5eYZN-GDWFVlUYKApp3HDcUuHcbR78WHMTkmFLLSosD_q9ufGJnjcqg/exec", // termina em /exec

  EMAIL: "Igor.c.l.oficial@outlook.com",
  WHATSAPP: "5554999306265", // (54) 9 9930-6265, só números e com o 55 do Brasil
  WHATSAPP_EXIBICAO: "(54) 9 9930-6265",
  WHATSAPP_MENSAGEM: "Olá! Vi a página da Horizon e quero saber mais sobre o piloto.",
};

/* Nome do campo no HTML (name="...") → nome da coluna na planilha.
   Os nomes das colunas precisam ser iguais aos de COLUNAS no Interessados.gs. */
const CAMPOS = {
  nome: "Nome",
  email: "E-mail",
  whatsapp: "WhatsApp",
  perfil: "Perfil",
  escola: "Escola e cidade",
  lgpd: "Consentimento LGPD",
  rede: "Rede",
  series: "Séries",
  turmas: "Turmas de Física",
  alunos: "Alunos (aprox.)",
  interesses: "Interesses",
  mensagem: "Mensagem",
};

(function () {
  "use strict";

  let idEnvio = null; // o mesmo ID liga a etapa 1 e a etapa 2

  /* ---------- Links de contato direto ---------- */
  // Preenche o <span data-texto> do link (preserva ícones); sem ele, usa o próprio link
  function preencherTexto(a, texto) {
    const alvo = a.querySelector("[data-texto]");
    if (alvo) { if (!alvo.textContent.trim()) alvo.textContent = texto; }
    else if (!a.textContent.trim()) a.textContent = texto;
  }

  function prepararContatos() {
    document.querySelectorAll('[data-contato="email"]').forEach(function (a) {
      a.href = "mailto:" + CONTATO_CONFIG.EMAIL + "?subject=" + encodeURIComponent("Piloto Horizon");
      preencherTexto(a, CONTATO_CONFIG.EMAIL);
    });
    document.querySelectorAll('[data-contato="whatsapp"]').forEach(function (a) {
      a.href = "https://wa.me/" + CONTATO_CONFIG.WHATSAPP +
        "?text=" + encodeURIComponent(CONTATO_CONFIG.WHATSAPP_MENSAGEM);
      a.target = "_blank";
      a.rel = "noopener";
      preencherTexto(a, "WhatsApp " + CONTATO_CONFIG.WHATSAPP_EXIBICAO);
    });
  }

  /* ---------- Utilidades ---------- */
  function gerarId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "id-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
  }

  function status(texto, tipo) {
    const el = document.getElementById("form-status");
    if (!el) return;
    el.textContent = texto || "";
    el.dataset.tipo = tipo || "";
  }

  // Lê o formulário. Campos com várias opções (checkbox) viram "a, b, c".
  function lerFormulario(form) {
    const valores = {};
    const fd = new FormData(form);
    Object.keys(CAMPOS).forEach(function (nome) {
      if (!form.elements[nome]) return;
      const todos = fd.getAll(nome).map(String).map(function (v) { return v.trim(); }).filter(Boolean);
      if (nome === "lgpd") valores[CAMPOS[nome]] = todos.length ? "Sim" : "Não";
      else if (todos.length) valores[CAMPOS[nome]] = todos.join(", ");
    });
    return valores;
  }

  // Máscara simples de telefone: (54) 9 9999-9999
  function mascararTelefone(input) {
    input.addEventListener("input", function () {
      const d = input.value.replace(/\D/g, "").slice(0, 11);
      let v = d;
      if (d.length > 2) v = "(" + d.slice(0, 2) + ") " + d.slice(2);
      if (d.length > 3) v = "(" + d.slice(0, 2) + ") " + d.slice(2, 3) + " " + d.slice(3);
      if (d.length > 7) v = "(" + d.slice(0, 2) + ") " + d.slice(2, 3) + " " + d.slice(3, 7) + "-" + d.slice(7);
      input.value = v;
    });
  }

  function ocupado(form, sim) {
    form.querySelectorAll("button, input, select, textarea").forEach(function (el) { el.disabled = sim; });
    form.setAttribute("aria-busy", sim ? "true" : "false");
  }

  /* ---------- Envio ---------- */
  async function enviar(valores, etapa) {
    valores["ID do envio"] = idEnvio;
    valores["Etapa concluída"] = etapa;
    valores["Origem"] = origem();

    const url = CONTATO_CONFIG.URL_PLANILHA;
    if (!url || url.indexOf("COLE_AQUI") === 0) {
      console.warn("[Horizon] URL_PLANILHA não configurada. Modo de teste. Dados:", valores);
      await new Promise(function (r) { setTimeout(r, 500); });
      return;
    }

    // text/plain evita a verificação CORS (preflight), que o Apps Script não responde
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ valores: valores }),
    });
    const json = await resp.json().catch(function () { return { ok: resp.ok }; });
    if (!json.ok) throw new Error(json.erro || "Falha ao salvar.");
  }

  // Registra de onde o visitante veio (ex.: ?origem=apresentacao-startucs)
  function origem() {
    const p = new URLSearchParams(location.search);
    return p.get("origem") || p.get("utm_source") || document.referrer || "direto";
  }

  /* ---------- Etapas ---------- */
  function iniciar() {
    prepararContatos();

    const f1 = document.getElementById("form-etapa-1");
    const f2 = document.getElementById("form-etapa-2");
    const sucesso = document.getElementById("form-sucesso");
    if (!f1) return; // página sem formulário

    if (f1.elements.whatsapp) mascararTelefone(f1.elements.whatsapp);

    f1.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      if (!f1.reportValidity()) return;

      idEnvio = idEnvio || gerarId();
      ocupado(f1, true);
      status("Enviando…", "info");
      try {
        await enviar(lerFormulario(f1), "1 de 2");
        status("", "");
        f1.hidden = true;
        if (f2) { f2.hidden = false; f2.querySelector("input, select, textarea")?.focus(); }
        else mostrarSucesso();
      } catch (erro) {
        console.error(erro);
        status("Não conseguimos enviar agora. Tente de novo ou fale com a gente pelo WhatsApp ou e-mail abaixo.", "erro");
      } finally {
        ocupado(f1, false);
      }
    });

    if (f2) {
      f2.addEventListener("submit", async function (ev) {
        ev.preventDefault();
        ocupado(f2, true);
        status("Enviando…", "info");
        try {
          await enviar(lerFormulario(f2), "2 de 2");
          mostrarSucesso();
        } catch (erro) {
          // O contato já foi salvo na etapa 1. Não travamos a pessoa aqui.
          console.error(erro);
          mostrarSucesso();
        } finally {
          ocupado(f2, false);
        }
      });

      const pular = document.getElementById("pular-etapa-2");
      if (pular) pular.addEventListener("click", mostrarSucesso);
    }

    function mostrarSucesso() {
      status("", "");
      if (f2) f2.hidden = true;
      f1.hidden = true;
      if (sucesso) { sucesso.hidden = false; sucesso.focus?.(); }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
