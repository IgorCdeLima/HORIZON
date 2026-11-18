# Landing page Horizon: estrutura de design (etapa 4)

> Os textos estão em [landing-textos.md](landing-textos.md). Este arquivo define **como** a página se organiza: identidade visual, grade, componentes, cada seção no desktop e no celular, e o formulário de captação.

---

## 1. Decisões gerais

| Item | Decisão | Motivo |
|---|---|---|
| Onde fica | Raiz do projeto (`index.html`) | É a página que abre primeiro. O formulário dos alunos fica em `formulario/` |
| Tecnologia | HTML + CSS + JS puro, sem framework | Igual ao formulário: hospedagem estática (GitHub Pages) e manutenção simples |
| Tipo de página | Uma página só, com rolagem e menu âncora | Leitura linear: problema → solução → prova → ação |
| Responsividade | *Mobile first*, quebras em **640px** e **1024px** | Grande parte do público chega pelo celular (link enviado no WhatsApp ou em apresentação) |
| Largura máxima do conteúdo | 1160px, com margem lateral de 16px no celular e 32px no desktop | |
| Formulário de contato | Envia para o Google Sheets pelo Apps Script (mesmo padrão de `apps-script/Code.gs`) | Já está implementado e é gratuito, sem servidor |

---

## 2. Identidade visual

Reaproveita a paleta do formulário (`css/style.css`) para que a landing e o teste pareçam o mesmo produto.

**Cores**
| Token | Cor | Uso |
|---|---|---|
| `--azul-900` | `#0b2350` | Fundo do hero e do rodapé, títulos |
| `--azul-700` | `#143f8a` | Títulos de seção, links |
| `--azul-500` | `#2a6ae0` | Botões principais, destaques |
| `--azul-50` | `#f3f7fe` | Fundo alternado das seções |
| `--prata-300` | `#c6ccd4` | Bordas, divisores |
| `--prata-grad` | gradiente prateado | Cartões de destaque e selos |
| `--texto` / `--texto-suave` | `#16233b` / `#4a5568` | Corpo do texto |

**Cores dos níveis (usadas só no mapa de calor e nos cartões D a A)**
D `#d64545` · C `#e8a33d` · B `#2a6ae0` · A `#1f9d6b`

**Tipografia:** Inter (Google Fonts), a mesma do formulário.
- H1 do hero: 40px no celular, 56px no desktop, peso 700
- H2 das seções: 28px / 40px, peso 700
- Corpo: 17px, altura de linha 1,6
- Etiquetas (*eyebrow*): 13px, MAIÚSCULAS, espaçamento de 0,12em, `--azul-500`

**Formas:** raio de 16px nos cartões e de 999px nos botões (pílula), sombra suave azulada (`--sombra`).

**Logo:** [img/logo.jpg](../img/logo.jpg). É um círculo azul com uma figura branca de braços abertos, um capelo e um arco de "horizonte" na base. O azul da logo combina com `--azul-600`/`--azul-700`, então a paleta fica como está.
- No topo: 40px, ao lado do nome "Horizon".
- Sobre fundo azul (hero e rodapé): o JPG tem **fundo branco quadrado**. Ele vai dentro de um "selo" branco redondo (`border-radius: 50%`, borda prateada fina), o mesmo estilo da marca no formulário. Assim o fundo branco não aparece como quadrado.
- Ícone da aba do navegador (*favicon*) e imagem de compartilhamento: gerados a partir da logo na etapa 5.
- Ideal para o futuro: uma versão **PNG transparente ou SVG**, que deixa a logo nítida em qualquer tamanho e sobre qualquer fundo.

**Modo escuro:** fica de fora nesta versão. A página já tem seções escuras (hero e rodapé), então o contraste está garantido.

---

## 3. Mapa da página

```
┌──────────────────────────────────────────────┐
│ MENU fixo (logo · âncoras · botão)            │
├──────────────────────────────────────────────┤
│ 1  HERO                       fundo azul-900  │
│ 2  PROBLEMA                   fundo branco    │
│ 3  COMO FUNCIONA (3 passos)   fundo azul-50   │
│ 4  O MÉTODO (Bloom + exemplo) fundo branco    │
│ 5  CONCEITOS D–A              fundo azul-50   │
│ 6  PARA QUEM                  fundo branco    │
│ 7  TEMPO DO PROFESSOR         fundo azul-900  │
│ 8  DIFERENCIAL (tabela)       fundo branco    │
│ 9  TESTE + PILOTO (formulário) fundo azul-50  │
│ 10 QUEM SOMOS (StartUCS)      fundo branco    │
│ 11 FAQ (acordeão)             fundo branco    │
│ 12 RODAPÉ                     fundo azul-900  │
└──────────────────────────────────────────────┘
```
Fundos alternados ajudam a separar as seções sem linhas. As seções escuras (1, 7 e 12) servem de "respiro" e marcam os pontos de virada da página.

---

## 4. Seção por seção

### Menu
```
DESKTOP
[LOGO Horizon]   Como funciona  O método  Para quem  Piloto   (Teste grátis)

CELULAR
[LOGO]                                        (≡)
 → o menu abre como painel de cima para baixo, com links grandes (48px de altura)
```
Fica transparente sobre o hero e ganha fundo branco com sombra quando a página rola.

### 1. Hero
```
DESKTOP (2 colunas, 55% / 45%)
┌───────────────────────────┬─────────────────────┐
│ AVALIAÇÃO FORMATIVA · …    │   ┌───────────────┐ │
│ Avalie o raciocínio,       │   │ MAPA DE CALOR │ │
│ não só a resposta.         │   │ (tablet)      │ │
│ subtítulo…                 │   │       ┌─────┐ │ │
│ (Teste…)  (Levar p/ escola)│   └───────│celul│─┘ │
│ 3 passos · <5 min · …      │           └─────┘   │
└───────────────────────────┴─────────────────────┘

CELULAR: texto em cima, botões empilhados com 100% de largura, mockup embaixo e menor
```
O mockup é feito em HTML/CSS, não em imagem: uma grade 5×4 de células coloridas D–A, com uma animação leve em que as células "migram" de cor. Pesa menos, fica nítido em qualquer tela e pode ser editado.

### 2. Problema
```
Título centralizado
[ 300–400 ]  [ 3 min ]  [ 0 ]     ← 3 cartões (desktop) / empilhados (celular)
legenda       legenda    legenda
```
Os números aparecem grandes (48px, `--azul-700`), com contagem animada ao entrar na tela.

### 3. Como funciona
```
DESKTOP
 (1) Diagnóstico ──→ (2) Conhecimento ──→ (3) Relatório
   ícone lupa          ícone play/livro      ícone gráfico
   texto               texto                 texto
        ↖────────── repete a cada aula ──────────↙

CELULAR: linha do tempo vertical (número à esquerda, texto à direita)
```

### 4. O método
```
DESKTOP (2 colunas)
┌──────────────────────┬───────────────────────────┐
│ Pirâmide de Bloom    │ Situação: caixote          │
│ (SVG, verbos         │ [img pergunta_01]          │
│  destacados)         │ Aluno 1 ── D  (cinza→verm.)│
│                      │ Aluno 2 ── C               │
│                      │ Aluno 3 ── B               │
└──────────────────────┴───────────────────────────┘
chips: Identificar · Relacionar · Comparar · …

CELULAR: exemplo primeiro (é mais concreto), pirâmide depois
```
As três respostas aparecem como "balões" de conversa, cada uma com o selo do nível ao lado.

### 5. Conceitos D–A
```
[ D ] [ C ] [ B ] [ A ]   ← 4 cartões com borda superior colorida
Desktop: 4 colunas · Tablet: 2×2 · Celular: carrossel horizontal com "snap"
```

### 6. Para quem
```
[ Professor ] [ Aluno ] [ Coordenação ]   ← cartões com mini-tela no topo
Celular: empilhados
```

### 7. Tempo do professor (seção escura)
```
Título em branco
  4 min        75%        80%
  /semana      concluem   recebem
  /turma       diagnóst.  intervenção
selo pequeno: "metas do piloto"
```

### 8. Diferencial
Tabela com 4 colunas. A coluna **Horizon** fica destacada com fundo `--azul-50` e borda azul.
No celular, a tabela vira **cartões por linha** ("Diagnóstico antes da aula → Horizon ✓"), para não exigir rolagem lateral.

### 9. Teste + Piloto
```
DESKTOP (2 colunas)
┌─────────────────────┬──────────────────────────────┐
│ ALUNOS E CURIOSOS    │ PROFESSORES E ESCOLAS         │
│ Teste seus           │ Leve a Horizon para sua escola│
│ conhecimentos        │ [formulário em 2 etapas]      │
│ (Começar o teste)    │                               │
│                      │ Prefere conversar?            │
│                      │ ✉ e-mail · WhatsApp           │
└─────────────────────┴──────────────────────────────┘
CELULAR: empilhado. O bloco do piloto vem primeiro, porque é a conversão mais valiosa.
```

### 10. Quem somos
Texto curto e selo "StartUCS · UCS". **Sem fotos da equipe** nesta versão.

### 11. FAQ
Acordeão com `<details>`/`<summary>`. Funciona sem JavaScript e é acessível.

### 12. Rodapé
Logo claro · descrição · contato · "© 2026 Horizon".

---

## 5. Formulário de captação

### Formato: 2 etapas
**Etapa 1: o essencial** (salva o contato assim que é enviada)
| Campo | Tipo | Obrigatório |
|---|---|---|
| Nome | texto | sim |
| E-mail | e-mail | sim |
| WhatsApp | telefone | não |
| Você é… | Professor(a) · Coordenação/Direção · Outro | sim |
| Escola e cidade | texto | sim |
| ☐ Concordo em ser contatado(a) pela Horizon (LGPD) | caixa de seleção | sim |

Botão: **Quero participar do piloto**

**Etapa 2: qualificação** (aparece depois do envio, é opcional e pode ser pulada)
| Campo | Tipo |
|---|---|
| Rede | Particular · Pública · Outra |
| Séries em que atua | 1º · 2º · 3º ano (várias opções) |
| Quantas turmas de Física? | número |
| Quantos alunos, aproximadamente? | 1–100 · 100–300 · 300+ |
| O que mais te interessa? | Diagnóstico · Relatórios · Economia de tempo · Outro |
| Algo que queira nos contar? | texto livre |

Botão: **Enviar** · Link: *Pular esta etapa*

**Tela de confirmação:** "Recebemos seu contato! Vamos responder em até 2 dias úteis." Abaixo, o botão **Enquanto isso, faça o teste de Física**.

### Para onde vão os dados (já preparado)
| Arquivo | Função |
|---|---|
| [apps-script/Interessados.gs](../apps-script/Interessados.gs) | Recebe os dados na planilha **"Horizon · Interessados"**, aba "Interessados". A etapa 1 cria a linha e a etapa 2 **completa a mesma linha** pelo "ID do envio", sem duplicar. Também cria as colunas "Recebido em", "Atualizado em", "Origem" e **"Status"** (começa como "Novo", para a equipe acompanhar o atendimento). |
| [js/contato.js](../js/contato.js) | Valida, aplica máscara no WhatsApp, envia as duas etapas e mostra a confirmação. Sem a URL configurada, funciona em **modo de teste**: nada é enviado e os dados aparecem no console. Se a etapa 2 falhar, a pessoa não fica travada, porque o contato já foi salvo. |

**Origem do contato:** links com `?origem=nome` (ex.: `?origem=apresentacao-startucs` no fim do endereço do site) ficam registrados na coluna "Origem". Assim dá para saber qual apresentação ou mensagem trouxe cada interessado.

### Contato direto (sempre visível)
Abaixo do formulário: **"Prefere conversar? Fale com a gente:"**
- ✉ **Igor.c.l.oficial@outlook.com** (abre o e-mail com o assunto "Piloto Horizon")
- WhatsApp **(54) 9 9930-6265** (abre a conversa com uma mensagem pronta)

Os dois também aparecem no rodapé. Os dados ficam centralizados em `CONTATO_CONFIG`, em `contato.js`.

---

## 6. Acessibilidade e desempenho

- Contraste de no mínimo 4,5:1 em todo texto. Botões e links com área de toque de pelo menos 44px.
- Todo campo do formulário tem `<label>` visível e mensagens de erro em texto (não só em cor).
- Animações desligadas com `prefers-reduced-motion`.
- Imagens com `loading="lazy"`, `width` e `height` definidos e texto alternativo.
- As imagens das perguntas (cerca de 350KB cada) serão comprimidas para WebP de até 120KB na etapa 5.
- Metatags de compartilhamento (título, descrição e imagem do WhatsApp/LinkedIn) para quando o link for enviado.

---

## 7. Pendências

- [x] Logo: `img/logo.jpg`. Uma versão PNG transparente ou SVG seria melhor no futuro.
- [x] E-mail e WhatsApp de contato.
- [x] Script da planilha e JS do formulário preparados.
- [ ] Criar a planilha "Horizon · Interessados", colar `apps-script/Interessados.gs`, implantar e colar a URL em `CONTATO_CONFIG.URL_PLANILHA` (passo a passo no README).
- [x] Endereço do teste de Física: `formulario/`.
- [ ] Confirmar o texto "piloto de 90 dias, sem custo" antes de divulgar.
