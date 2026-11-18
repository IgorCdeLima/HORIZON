/**
 * HORIZON — Receptor de interessados da landing page (Google Sheets)
 *
 * Use numa PLANILHA SEPARADA ("Horizon · Interessados"), não na planilha
 * de respostas dos alunos. Cole em: Planilha > Extensões > Apps Script.
 * O passo a passo de implantação é o mesmo do README (App da Web,
 * executar como "Eu", acesso "Qualquer pessoa").
 *
 * O formulário tem 2 etapas e as duas usam o mesmo "ID do envio":
 *  - Etapa 1 cria a linha do contato.
 *  - Etapa 2 (opcional) completa ESSA MESMA linha, sem duplicar.
 */

const NOME_DA_ABA = "Interessados";

// Ordem fixa das colunas. Para incluir um campo novo, acrescente aqui
// e use o mesmo nome em landing/js/contato.js.
const COLUNAS = [
  "ID do envio",
  "Recebido em",
  "Atualizado em",
  "Etapa concluída",
  "Nome",
  "E-mail",
  "WhatsApp",
  "Perfil",
  "Escola e cidade",
  "Consentimento LGPD",
  "Rede",
  "Séries",
  "Turmas de Física",
  "Alunos (aprox.)",
  "Interesses",
  "Mensagem",
  "Origem",
  "Status", // para a equipe: Novo / Contatado / Piloto / Sem interesse
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const dados = JSON.parse(e.postData.contents);
    const valores = dados.valores || {};
    const id = String(valores["ID do envio"] || "").trim();
    if (!id) return resposta({ ok: false, erro: "ID do envio ausente." });

    const aba = prepararAba();
    const agora = new Date();
    const linhaExistente = encontrarLinha(aba, id);

    if (linhaExistente === -1) {
      // Novo contato
      valores["Recebido em"] = agora;
      valores["Atualizado em"] = agora;
      valores["Status"] = "Novo";
      aba.appendRow(COLUNAS.map(function (c) { return protegerTexto(valores[c]); }));
      return resposta({ ok: true, criado: true });
    }

    // Contato já existe: completa só os campos enviados agora
    const intervalo = aba.getRange(linhaExistente, 1, 1, COLUNAS.length);
    const atual = intervalo.getValues()[0];
    COLUNAS.forEach(function (c, i) {
      if (c === "ID do envio" || c === "Recebido em" || c === "Status") return;
      const novo = valores[c];
      if (novo !== undefined && novo !== null && novo !== "") atual[i] = protegerTexto(novo);
    });
    atual[COLUNAS.indexOf("Atualizado em")] = agora;
    intervalo.setValues([atual]);
    return resposta({ ok: true, atualizado: true });
  } catch (erro) {
    return resposta({ ok: false, erro: String(erro) });
  } finally {
    lock.releaseLock();
  }
}

// Abrir a URL do App da Web no navegador mostra se ele está no ar
function doGet() {
  return resposta({ ok: true, mensagem: "Horizon: receptor de interessados ativo." });
}

function prepararAba() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  const aba = planilha.getSheetByName(NOME_DA_ABA) || planilha.insertSheet(NOME_DA_ABA);
  if (aba.getLastRow() === 0) {
    aba.getRange(1, 1, 1, COLUNAS.length)
      .setValues([COLUNAS])
      .setFontWeight("bold")
      .setBackground("#143f8a")
      .setFontColor("#ffffff");
    aba.setFrozenRows(1);
  }
  return aba;
}

function encontrarLinha(aba, id) {
  if (aba.getLastRow() < 2) return -1;
  const ids = aba.getRange(2, 1, aba.getLastRow() - 1, 1).getValues().flat().map(String);
  const i = ids.indexOf(id);
  return i === -1 ? -1 : i + 2;
}

// Impede que textos começando com = + - @ virem fórmula na planilha
function protegerTexto(valor) {
  if (valor === undefined || valor === null) return "";
  if (typeof valor === "string" && /^[=+\-@]/.test(valor)) return "'" + valor;
  return valor;
}

function resposta(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
