/**
 * HORIZON — Receptor de respostas para Google Sheets
 * Cole este código em: Planilha > Extensões > Apps Script
 * Cada envio do formulário vira UMA linha na aba "Respostas".
 * O cabeçalho é criado automaticamente no primeiro envio.
 */

const NOME_DA_ABA = "Respostas";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000); // evita que dois alunos escrevam na mesma linha ao mesmo tempo

  try {
    const dados = JSON.parse(e.postData.contents);
    const colunas = dados.colunas || [];
    const valores = dados.valores || {};

    const planilha = SpreadsheetApp.getActiveSpreadsheet();
    const aba = planilha.getSheetByName(NOME_DA_ABA) || planilha.insertSheet(NOME_DA_ABA);

    // Cabeçalho: mantém as colunas existentes e acrescenta novas, se surgirem
    let cabecalho = aba.getLastColumn() > 0
      ? aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0].filter(String)
      : [];
    colunas.forEach(function (c) { if (cabecalho.indexOf(c) === -1) cabecalho.push(c); });

    aba.getRange(1, 1, 1, cabecalho.length)
      .setValues([cabecalho])
      .setFontWeight("bold")
      .setBackground("#143f8a")
      .setFontColor("#ffffff");
    aba.setFrozenRows(1);

    // Evita linhas duplicadas se o aluno clicar em "Tentar novamente"
    const colId = cabecalho.indexOf("ID do envio") + 1;
    if (colId > 0 && aba.getLastRow() > 1) {
      const ids = aba.getRange(2, colId, aba.getLastRow() - 1, 1).getValues().flat();
      if (ids.indexOf(valores["ID do envio"]) !== -1) return resposta({ ok: true, duplicado: true });
    }

    const linha = cabecalho.map(function (c) { return protegerTexto(valores[c]); });
    aba.appendRow(linha);

    return resposta({ ok: true });
  } catch (erro) {
    return resposta({ ok: false, erro: String(erro) });
  } finally {
    lock.releaseLock();
  }
}

// Permite testar se o Web App está no ar abrindo a URL no navegador
function doGet() {
  return resposta({ ok: true, mensagem: "Horizon: receptor de respostas ativo." });
}

// Impede que respostas começando com = + - @ sejam interpretadas como fórmula
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
