/* =====================================================================
   SCRIPT.JS — MOTOR DO CARROSSEL
   A cada avanço, o conteúdo do palco é apagado e recriado via JS.
   O conteúdo (textos, imagens, vídeo) vem de perguntas.js.
   ===================================================================== */

(() => {
  "use strict";

  /* ---------- Estado ---------- */
  const estado = {
    passo: 0,
    aluno: { idade: "", serie: "" },
    respostas: {},          // { "DIAG|H20-NEWTON-01": { alternativa: "B", resposta: "..." } }
    tempos: {},             // marcos de tempo (ms)
    enviando: false,
  };

  /* ---------- Sequência de telas ---------- */
  const FASES = {
    DIAG: { rotulo: "Diagnóstica", coluna: "Diagnóstica" },
    AVAL: { rotulo: "Avaliativa", coluna: "Avaliativa" },
  };

  const PASSOS = [
    { tipo: "identificacao" },
    ...PERGUNTAS_DIAGNOSTICAS.map((p, i) => ({ tipo: "pergunta", fase: "DIAG", pergunta: p, indice: i, total: PERGUNTAS_DIAGNOSTICAS.length })),
    { tipo: "video" },
    ...PERGUNTAS_AVALIATIVAS.map((p, i) => ({ tipo: "pergunta", fase: "AVAL", pergunta: p, indice: i, total: PERGUNTAS_AVALIATIVAS.length })),
    { tipo: "envio" },
    { tipo: "fim" },
  ];

  /* ---------- Elementos fixos ---------- */
  const palco = document.getElementById("palco");
  const barra = document.getElementById("progresso-barra");
  const etapaRotulo = document.getElementById("etapa-rotulo");
  const cronometroEl = document.getElementById("cronometro");

  /* ---------- Utilitário para criar elementos ---------- */
  function el(tag, atributos = {}, filhos = []) {
    const no = document.createElement(tag);
    for (const [chave, valor] of Object.entries(atributos)) {
      if (valor === null || valor === undefined || valor === false) continue;
      if (chave === "class") no.className = valor;
      else if (chave === "html") no.innerHTML = valor;          // só usado com conteúdo de perguntas.js
      else if (chave === "text") no.textContent = valor;
      else if (chave.startsWith("on")) no.addEventListener(chave.slice(2), valor);
      else no.setAttribute(chave, valor === true ? "" : valor);
    }
    (Array.isArray(filhos) ? filhos : [filhos]).forEach((f) => {
      if (f === null || f === undefined || f === false) return;
      no.appendChild(typeof f === "string" ? document.createTextNode(f) : f);
    });
    return no;
  }

  const chaveResposta = (fase, codigo) => `${fase}|${codigo}`;

  /* ---------- Cronômetro ---------- */
  let intervaloCronometro = null;

  function formatarTempo(ms) {
    const s = Math.max(0, Math.round(ms / 1000));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const seg = s % 60;
    const dois = (n) => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${dois(m)}:${dois(seg)}` : `${dois(m)}:${dois(seg)}`;
  }

  function iniciarCronometro() {
    estado.tempos.inicio = Date.now();
    if (!CONFIG.MOSTRAR_CRONOMETRO) return;
    cronometroEl.hidden = false;
    const atualizar = () => { cronometroEl.textContent = formatarTempo(Date.now() - estado.tempos.inicio); };
    atualizar();
    intervaloCronometro = setInterval(atualizar, 1000);
  }

  function pararCronometro() {
    clearInterval(intervaloCronometro);
  }

  /* ---------- Navegação ---------- */
  let navegando = false;    // evita avançar duas vezes com clique duplo
  function irPara(novoPasso) {
    if (navegando) return;
    navegando = true;
    const anterior = palco.firstElementChild;
    const montar = () => {
      if (!navegando) return;            // já montado (animationend + timeout)
      navegando = false;
      palco.replaceChildren();           // apaga a div anterior
      palco.scrollTop = 0;
      estado.passo = novoPasso;
      registrarMarcoDeTempo();
      palco.appendChild(criarTela(PASSOS[novoPasso]));   // cria a nova
      atualizarCabecalho();
      const foco = palco.querySelector("h2");
      if (foco) foco.focus({ preventScroll: true });
    };

    if (anterior) {
      anterior.classList.add("saindo");
      anterior.addEventListener("animationend", montar, { once: true });
      // segurança caso a animação não dispare
      setTimeout(() => { if (palco.firstElementChild === anterior) montar(); }, 400);
    } else {
      montar();
    }
  }

  function registrarMarcoDeTempo() {
    const p = PASSOS[estado.passo];
    const agora = Date.now();
    if (p.tipo === "pergunta" && p.fase === "DIAG" && !estado.tempos.inicioDiag) estado.tempos.inicioDiag = agora;
    if (p.tipo === "video" && !estado.tempos.inicioVideo) estado.tempos.inicioVideo = agora;
    if (p.tipo === "pergunta" && p.fase === "AVAL" && !estado.tempos.inicioAval) estado.tempos.inicioAval = agora;
    if (p.tipo === "envio") estado.tempos.fimAval = agora; // atualiza se o aluno voltar para revisar
  }

  function atualizarCabecalho() {
    const p = PASSOS[estado.passo];
    const totalUteis = PASSOS.length - 1; // sem a tela final
    const pct = Math.min(100, Math.round((estado.passo / (totalUteis - 1)) * 100));
    barra.style.width = `${pct}%`;
    barra.parentElement.setAttribute("aria-valuenow", pct);

    const rotulos = {
      identificacao: "Identificação",
      video: "Vídeo",
      envio: "Envio",
      fim: "Concluído",
    };
    etapaRotulo.textContent = p.tipo === "pergunta"
      ? `${FASES[p.fase].rotulo} · ${p.indice + 1} de ${p.total}`
      : rotulos[p.tipo];
  }

  /* ---------- Fábrica de telas ---------- */
  function criarTela(passo) {
    switch (passo.tipo) {
      case "identificacao": return telaIdentificacao();
      case "pergunta": return telaPergunta(passo);
      case "video": return telaVideo();
      case "envio": return telaEnvio();
      case "fim": return telaFim();
    }
  }

  function cartao(conteudo, navegacao) {
    return el("section", { class: "cartao" }, [
      el("div", { class: "cartao-conteudo" }, el("div", { class: "cartao-miolo" }, conteudo)),
      navegacao ? el("div", { class: "cartao-nav" }, navegacao) : null,
    ]);
  }

  function botao(texto, aoClicar, variante = "primario", extra = {}) {
    return el("button", { type: "button", class: `btn btn-${variante}`, onclick: aoClicar, ...extra }, texto);
  }

  /* ----- Tela 1: identificação ----- */
  function telaIdentificacao() {
    const erro = el("p", { class: "erro", role: "alert" });

    const idade = el("input", {
      type: "number", id: "idade", min: CONFIG.IDADE_MIN, max: CONFIG.IDADE_MAX,
      inputmode: "numeric", value: estado.aluno.idade, placeholder: "Ex.: 16",
    });

    const serie = el("select", { id: "serie" }, [
      el("option", { value: "", text: "Selecione..." }),
      ...CONFIG.SERIES.map((s) => el("option", { value: s, text: s, selected: estado.aluno.serie === s })),
    ]);

    const comecar = () => {
      const valIdade = parseInt(idade.value, 10);
      if (!valIdade || valIdade < CONFIG.IDADE_MIN || valIdade > CONFIG.IDADE_MAX) {
        erro.textContent = `Informe uma idade entre ${CONFIG.IDADE_MIN} e ${CONFIG.IDADE_MAX} anos.`;
        idade.focus();
        return;
      }
      if (!serie.value) {
        erro.textContent = "Selecione a sua série.";
        serie.focus();
        return;
      }
      estado.aluno = { idade: valIdade, serie: serie.value };
      if (!estado.tempos.inicio) iniciarCronometro();
      irPara(estado.passo + 1);
    };

    return cartao([
      el("span", { class: "selo" }, "Física · Ensino Médio"),
      el("h2", { tabindex: "-1" }, "Bem-vindo(a)!"),
      el("p", { class: "lead" }, "Esta atividade tem três etapas: primeiro você responde a algumas perguntas, depois assiste a um vídeo e, por fim, responde a novas perguntas."),
      el("ol", { class: "etapas" }, [
        el("li", {}, [el("strong", {}, "Perguntas diagnósticas"), " — responda com o que você já sabe."]),
        el("li", {}, [el("strong", {}, "Vídeo"), " — assista com atenção."]),
        el("li", {}, [el("strong", {}, "Perguntas avaliativas"), " — responda com o que aprendeu."]),
      ]),
      el("p", { class: "dica" }, "Não há resposta certa ou errada nas perguntas iniciais. Explique seu raciocínio com suas palavras. O tempo começa a contar quando você clicar em \"Começar\"."),
      el("div", { class: "grade-campos" }, [
        el("label", { class: "campo" }, [el("span", {}, "Idade"), idade]),
        el("label", { class: "campo" }, [el("span", {}, "Série"), serie]),
      ]),
      erro,
    ], [el("span"), botao("Começar", comecar)]);
  }

  /* ----- Telas de pergunta ----- */
  function criarBloco(bloco) {
    switch (bloco.tipo) {
      case "texto":
        return el("p", { html: bloco.conteudo });
      case "citacao":
        return el("blockquote", { html: `“${bloco.conteudo}”` });
      case "lista":
        return el("ul", { class: "lista" }, bloco.itens.map((i) => el("li", { html: i })));
      case "nota":
        return el("p", { class: "nota", html: bloco.conteudo });
      case "comando":
        return el("p", { class: "comando", html: bloco.conteudo });
      case "imagem": {
        const fig = el("figure", { class: "figura" });
        const img = el("img", { src: bloco.src, alt: bloco.alt || "", loading: "lazy" });
        img.addEventListener("error", () => {
          fig.replaceChildren(el("div", { class: "figura-vazia" }, [
            el("span", { class: "figura-icone", "aria-hidden": "true" }, "🖼"),
            el("span", {}, bloco.alt || "Imagem"),
            el("code", {}, bloco.src),
          ]));
        });
        fig.appendChild(img);
        if (bloco.legenda) fig.appendChild(el("figcaption", { html: bloco.legenda }));
        return fig;
      }
      case "tabela":
        return el("div", { class: "tabela-wrap" }, el("table", {}, [
          el("thead", {}, el("tr", {}, bloco.cabecalho.map((c) => el("th", { html: c })))),
          el("tbody", {}, bloco.linhas.map((linha) => el("tr", {}, linha.map((c, i) => el(i === 0 ? "th" : "td", { html: c, scope: i === 0 ? "row" : null }))))),
        ]));
      default:
        return null;
    }
  }

  function telaPergunta(passo) {
    const { pergunta, fase } = passo;
    const chave = chaveResposta(fase, pergunta.codigo);
    const salvo = estado.respostas[chave] || {};
    const aviso = el("p", { class: "aviso", role: "alert" });

    const conteudo = [
      el("span", { class: `selo selo-${fase.toLowerCase()}` }, `${FASES[fase].rotulo} · Pergunta ${passo.indice + 1}`),
      el("h2", { tabindex: "-1" }, pergunta.titulo),
      ...pergunta.blocos.map(criarBloco),
    ];

    if (pergunta.alternativas) {
      const grupo = el("fieldset", { class: "alternativas" }, [
        el("legend", {}, "Escolha uma alternativa"),
        ...pergunta.alternativas.map((alt) => el("label", { class: "alternativa" }, [
          el("input", { type: "radio", name: "alternativa", value: alt.letra, checked: salvo.alternativa === alt.letra }),
          el("span", { class: "alt-letra" }, alt.letra),
          el("span", { class: "alt-texto", html: alt.texto }),
        ])),
      ]);
      conteudo.push(grupo);
    }

    pergunta.campos.forEach((campo) => {
      const id = `campo-${campo.id}`;
      conteudo.push(el("label", { class: "campo campo-texto", for: id }, [
        el("span", {}, campo.rotulo),
        el("textarea", { id, "data-campo": campo.id, rows: campo.linhas || 5, placeholder: campo.placeholder || "" }, salvo[campo.id] || ""),
      ]));
    });

    conteudo.push(aviso);

    const coletar = () => {
      const tela = palco.firstElementChild;
      const dados = {};
      const marcada = tela.querySelector('input[name="alternativa"]:checked');
      if (pergunta.alternativas) dados.alternativa = marcada ? marcada.value : "";
      tela.querySelectorAll("textarea[data-campo]").forEach((t) => { dados[t.dataset.campo] = t.value.trim(); });
      estado.respostas[chave] = dados;
      return dados;
    };

    const avancar = () => {
      const dados = coletar();
      const vazios = [];
      if (pergunta.alternativas && !dados.alternativa) vazios.push("a alternativa");
      pergunta.campos.forEach((c) => { if (!dados[c.id]) vazios.push(`"${c.rotulo}"`); });

      if (vazios.length) {
        aviso.textContent = `Para avançar, preencha ${vazios.join(" e ")}.`;
        return;
      }
      irPara(estado.passo + 1);
    };

    // Só permite voltar dentro da mesma fase (não volta da avaliativa para a diagnóstica)
    const podeVoltar = passo.indice > 0;
    const voltar = () => { coletar(); irPara(estado.passo - 1); };

    return cartao(conteudo, [
      podeVoltar ? botao("Voltar", voltar, "secundario") : el("span"),
      botao("Avançar", avancar),
    ]);
  }

  /* ----- Tela do vídeo ----- */
  function telaVideo() {
    // Aceita tanto o ID ("M7lc1UVf-VE") quanto o link completo do YouTube
    const casa = String(VIDEO.youtubeId).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/);
    const id = casa ? casa[1] : String(VIDEO.youtubeId).trim();
    const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0&modestbranding=1`;
    return cartao([
      el("span", { class: "selo selo-video" }, "Vídeo"),
      el("h2", { tabindex: "-1" }, VIDEO.titulo),
      el("p", { class: "lead" }, VIDEO.texto),
      el("div", { class: "video-wrap" }, el("iframe", {
        src, title: VIDEO.titulo, loading: "lazy", allowfullscreen: true,
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        referrerpolicy: "strict-origin-when-cross-origin",
      })),
      el("p", { class: "dica" }, "Depois de assistir, clique em \"Avançar\". Você não poderá voltar às perguntas iniciais."),
    ], [el("span"), botao("Avançar", () => irPara(estado.passo + 1))]);
  }

  /* ----- Tela de envio ----- */
  function telaEnvio() {
    const status = el("p", { class: "status", role: "status" });
    const btnEnviar = botao("Enviar respostas", null);
    const btnVoltar = botao("Voltar", () => irPara(estado.passo - 1), "secundario");

    btnEnviar.addEventListener("click", async () => {
      if (estado.enviando) return;
      estado.enviando = true;
      btnEnviar.disabled = true;
      btnVoltar.disabled = true;
      btnEnviar.textContent = "Enviando...";
      status.className = "status";
      status.textContent = "";

      if (!estado.tempos.fim) {
        estado.tempos.fim = Date.now();
        pararCronometro();
      }

      try {
        await enviarParaPlanilha(montarLinha());
        irPara(estado.passo + 1);
      } catch (e) {
        console.error(e);
        salvarBackupLocal();
        status.className = "status status-erro";
        status.textContent = e.doServidor
          ? `A planilha recusou o envio (${e.message}). Avise o(a) professor(a). Suas respostas não foram perdidas.`
          : "Não foi possível enviar agora. Verifique sua internet e tente novamente. Suas respostas não foram perdidas.";
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Tentar novamente";
        estado.enviando = false;
      }
    });

    return cartao([
      el("span", { class: "selo" }, "Quase lá"),
      el("h2", { tabindex: "-1" }, "Pronto para enviar?"),
      el("p", { class: "lead" }, "Você respondeu a todas as perguntas. Se quiser revisar a última resposta, clique em \"Voltar\". Quando estiver pronto(a), envie suas respostas."),
      status,
    ], [btnVoltar, btnEnviar]);
  }

  /* ----- Tela final ----- */
  function telaFim() {
    const total = estado.tempos.fim - estado.tempos.inicio;
    return cartao([
      el("div", { class: "fim-icone", "aria-hidden": "true" }, "✓"),
      el("h2", { tabindex: "-1", class: "centro" }, "Respostas enviadas!"),
      el("p", { class: "lead centro" }, "Obrigado pela sua participação."),
      el("p", { class: "centro tempo-final" }, ["Tempo total: ", el("strong", {}, formatarTempo(total))]),
    ]);
  }

  /* ---------- Montagem da linha da planilha ---------- */
  function montarLinha() {
    const t = estado.tempos;
    const seg = (a, b) => (a && b ? Math.round((b - a) / 1000) : "");
    const dataHora = (ms) => new Date(ms).toLocaleString("pt-BR");

    // A ordem deste objeto define a ordem das colunas na planilha
    const linha = {
      "ID do envio": gerarId(),
      "Data/hora de início": dataHora(t.inicio),
      "Data/hora de término": dataHora(t.fim),
      "Idade": estado.aluno.idade,
      "Série": estado.aluno.serie,
      "Tempo total (s)": seg(t.inicio, t.fim),
      "Tempo total (hh:mm:ss)": formatarTempo(t.fim - t.inicio),
      "Tempo diagnóstica (s)": seg(t.inicioDiag, t.inicioVideo),
      "Tempo vídeo (s)": seg(t.inicioVideo, t.inicioAval),
      "Tempo avaliativa (s)": seg(t.inicioAval, t.fimAval),
    };

    const adicionarFase = (fase, perguntas) => {
      perguntas.forEach((p) => {
        const r = estado.respostas[chaveResposta(fase, p.codigo)] || {};
        const prefixo = `${FASES[fase].coluna} | ${p.codigo}`;
        if (p.alternativas) linha[`${prefixo} | Alternativa`] = r.alternativa || "";
        p.campos.forEach((c) => { linha[`${prefixo} | ${c.rotulo}`] = r[c.id] || ""; });
      });
    };
    adicionarFase("DIAG", PERGUNTAS_DIAGNOSTICAS);
    adicionarFase("AVAL", PERGUNTAS_AVALIATIVAS);

    return { colunas: Object.keys(linha), valores: linha };
  }

  let idEnvio = null;
  function gerarId() {
    if (idEnvio) return idEnvio; // mesmo ID em novas tentativas → evita linhas duplicadas
    idEnvio = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
    return idEnvio;
  }

  async function enviarParaPlanilha(payload) {
    if (!CONFIG.URL_PLANILHA || CONFIG.URL_PLANILHA.startsWith("COLE_AQUI")) {
      console.warn("URL_PLANILHA não configurada. Dados que seriam enviados:", payload);
      throw new Error("URL da planilha não configurada em js/perguntas.js");
    }
    // text/plain evita a verificação CORS (preflight) que o Apps Script não responde
    const resp = await fetch(CONFIG.URL_PLANILHA, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    const json = await resp.json();
    if (!json.ok) {
      const erro = new Error(json.erro || "Erro desconhecido na planilha");
      erro.doServidor = true;
      throw erro;
    }
    return json;
  }

  function salvarBackupLocal() {
    try {
      const chave = "horizon-backup";
      const lista = JSON.parse(localStorage.getItem(chave) || "[]");
      const linha = montarLinha();
      if (!lista.some((l) => l.valores["ID do envio"] === linha.valores["ID do envio"])) lista.push(linha);
      localStorage.setItem(chave, JSON.stringify(lista));
    } catch (_) { /* armazenamento indisponível */ }
  }

  /* ---------- Proteção contra fechar a página no meio ---------- */
  window.addEventListener("beforeunload", (e) => {
    const tipo = PASSOS[estado.passo].tipo;
    if (estado.tempos.inicio && tipo !== "fim") {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  /* ---------- Início ---------- */
  irPara(0);
})();
