# Horizon — Formulário de Física

Formulário em carrossel: **perguntas diagnósticas → vídeo → perguntas avaliativas**. Cada aluno vira uma linha numa planilha do Google Sheets.

## Estrutura

```
index.html            página (moldura de 80% da tela)
css/style.css         visual (azul, branco e prateado)
js/perguntas.js       ← CONTEÚDO: textos, imagens, vídeo e URL da planilha
js/script.js          motor do carrossel (cria e apaga as telas)
apps-script/Code.gs   código que recebe os dados na planilha
img/                  coloque as imagens aqui
```

## Configurar a planilha (uma vez só)

1. Crie uma planilha nova no Google Sheets, com o nome que quiser.
2. Abra **Extensões → Apps Script**, apague o conteúdo do editor, cole o código de [apps-script/Code.gs](apps-script/Code.gs) e salve.
3. Clique em **Implantar → Nova implantação**:
   - Tipo (ícone ⚙️): **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
   - Clique em **Implantar** e autorize o acesso com a sua conta. Se aparecer "app não verificado", clique em *Avançado → Acessar*.
4. Copie a **URL do app da Web** (termina em `/exec`) e cole em `js/perguntas.js`:
   ```js
   URL_PLANILHA: "https://script.google.com/macros/s/XXXX/exec",
   ```
5. Para testar, abra essa URL no navegador. Deve aparecer `{"ok":true,...}`.

A aba **Respostas** e o cabeçalho são criados automaticamente no primeiro envio.

> Se você alterar o `Code.gs` depois, vá em **Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão**. Assim a URL continua a mesma.

## Colunas da planilha

| Coluna | Conteúdo |
|---|---|
| ID do envio | identificador único (evita linhas duplicadas) |
| Data/hora de início / término | quando o aluno clicou em "Começar" e em "Enviar" |
| Idade, Série | dados do aluno |
| Tempo total (s) e (hh:mm:ss) | do "Começar" ao "Enviar" |
| Tempo diagnóstica / vídeo / avaliativa (s) | tempo gasto em cada etapa |
| `Diagnóstica \| H20-NEWTON-01 \| Sua resposta` … | uma coluna por campo de resposta |
| `… \| Alternativa` | letra marcada nas questões com alternativas |

## Trocar conteúdo

Tudo fica em `js/perguntas.js`:

- **Vídeo:** troque `VIDEO.youtubeId` pelo ID do YouTube (o trecho depois de `watch?v=`).
- **Imagens:** coloque os arquivos em `img/` com estes nomes, ou altere o `src`:
  - `img/newton-01-diagnostica.png`: pessoa empurrando o caixote (pode ter balão de pensamento)
  - `img/newton-01-avaliativa.png`: mesma cena, sem setas nem balão
  - `img/newton-02-diagrama.png`: estudante e caixote com as setas FE, Fat, P e N
  - `img/energia-01-modelos.png`: Modelos A e B elevando caixas
  Enquanto uma imagem não existir, o site mostra um quadro indicando o caminho esperado.
- **Textos:** edite os `blocos` de cada pergunta.
- **Cronômetro visível:** `CONFIG.MOSTRAR_CRONOMETRO = false` esconde o relógio do aluno. O tempo continua sendo registrado.

> Se mudar o `rotulo` de um campo ou o `codigo` de uma pergunta, o nome da coluna muda. A planilha cria uma coluna nova e mantém a antiga.

## Rodar localmente

Use um servidor local. Abrir o `index.html` direto (endereço `file://`) faz o YouTube bloquear o vídeo (erro 153).

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Para publicar, sirva estes arquivos em qualquer hospedagem estática (GitHub Pages, Netlify etc.).
