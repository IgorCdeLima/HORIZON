/* =====================================================================
   PERGUNTAS.JS — TODO O CONTEÚDO DO FORMULÁRIO FICA AQUI
   ---------------------------------------------------------------------
   Para trocar textos, imagens ou o vídeo, edite apenas este arquivo.

   Cada pergunta tem:
     codigo  -> código da ficha (vira o nome da coluna na planilha)
     titulo  -> título exibido no topo do cartão
     blocos  -> lista exibida NA ORDEM em que aparece:
                { tipo: "texto",   conteudo: "..." }
                { tipo: "citacao", conteudo: "..." }
                { tipo: "lista",   itens: ["...", "..."] }
                { tipo: "imagem",  src: "../img/arquivo.png", alt: "descrição" }
                { tipo: "nota",    conteudo: "..." }          (texto menor, em destaque)
                { tipo: "tabela",  cabecalho: [...], linhas: [[...], [...]] }
                { tipo: "comando", conteudo: "..." }          (o que o aluno deve fazer)
     alternativas -> (opcional) [{ letra: "A", texto: "..." }, ...]
     campos  -> caixas de texto de resposta. Cada campo vira uma coluna:
                { id: "resposta", rotulo: "Sua resposta", placeholder: "...", linhas: 6 }
   ===================================================================== */

const CONFIG = {
  // URL do App Script publicado (veja o README.md, passo 3)
  URL_PLANILHA: "https://script.google.com/macros/s/AKfycbzKI3lU7OFXty_lY-_1QDNnHdLJeQql1IKnv3Pp1yDro_dWWdBvhfwHYGJoGs--IGts/exec",

  // Mostrar o cronômetro para o aluno? (o tempo é registrado de qualquer forma)
  MOSTRAR_CRONOMETRO: true,

  // Séries disponíveis na tela de identificação
  SERIES: ["1º ano do Ensino Médio", "2º ano do Ensino Médio", "3º ano do Ensino Médio"],

  IDADE_MIN: 12,
  IDADE_MAX: 30,
};

const VIDEO = {
  titulo: "Hora do vídeo",
  texto: "Assista ao vídeo com atenção. Depois dele, você responderá a novas perguntas sobre as mesmas situações.",
  // Cole aqui o ID do vídeo do YouTube (o trecho depois de "watch?v=")
  // Ex.: https://www.youtube.com/watch?v=M7lc1UVf-VE  ->  "M7lc1UVf-VE"
  youtubeId: "https://www.youtube.com/watch?v=M7lc1UVf-VE", // vídeo genérico de teste
};

/* ---------------------------------------------------------------------
   PERGUNTAS DIAGNÓSTICAS (antes do vídeo)
   --------------------------------------------------------------------- */
const PERGUNTAS_DIAGNOSTICAS = [
  {
    codigo: "H20-NEWTON-01",
    titulo: "O caixote parado",
    blocos: [
      { tipo: "texto", conteudo: "Uma pessoa empurra um caixote sobre um piso horizontal e áspero, mas ele permanece parado. Ao observar isso, ela afirma:" },
      { tipo: "citacao", conteudo: "Se o caixote não se move, nenhuma força está atuando sobre ele." },
      { tipo: "imagem", src: "../img/pergunta_01.jpeg", alt: "Pessoa empurrando horizontalmente um caixote sobre um piso áspero" },
      { tipo: "nota", conteudo: "Considere o empurrão horizontal, desconsidere a resistência do ar e suponha que o caixote não tombe." },
      { tipo: "comando", conteudo: "Essa afirmação está correta? Explique seu raciocínio, considerando quais forças atuam sobre o caixote, quem ou o que exerce cada uma e como elas se relacionam para que ele permaneça parado." },
    ],
    campos: [
      { id: "resposta", rotulo: "Sua resposta", placeholder: "Escreva aqui sua explicação...", linhas: 8 },
    ],
  },

  {
    codigo: "H20-NEWTON-02",
    titulo: "As forças sobre o caixote",
    blocos: [
      { tipo: "texto", conteudo: "Um estudante empurra horizontalmente um grande caixote de madeira sobre um piso horizontal e áspero, mas o objeto permanece parado." },
      { tipo: "texto", conteudo: "Para compreender a situação, ele representa quatro forças que atuam sobre o caixote:" },
      { tipo: "lista", itens: ["Força de empurrão — FE.", "Força de atrito estático — Fat.", "Peso — P.", "Força normal — N."] },
      { tipo: "nota", conteudo: "Desconsidere a resistência do ar e suponha que o caixote não tombe." },
      { tipo: "imagem", src: "../img/pergunta_02.jpeg", alt: "Estudante empurrando o caixote e diagrama com as forças FE, Fat, P e N" },
      { tipo: "nota", conteudo: "Os comprimentos das setas são esquemáticos e não informam as intensidades das forças." },
      { tipo: "comando", conteudo: "Com base nas Leis de Newton, qual relação entre as forças explica o equilíbrio horizontal e vertical que mantém o caixote em repouso?" },
    ],
    alternativas: [
      { letra: "A", texto: "A força de empurrão FE tem a mesma intensidade do peso P, enquanto a força de atrito Fat tem a mesma intensidade da normal N." },
      { letra: "B", texto: "A força de empurrão FE tem a mesma intensidade e sentido oposto à força de atrito Fat, e a normal N tem a mesma intensidade e sentido oposto ao peso P." },
      { letra: "C", texto: "A força de atrito Fat é maior que a força de empurrão FE, pois o atrito precisa superar o empurrão para manter o caixote parado." },
    ],
    campos: [
      { id: "justificativa", rotulo: "Justifique sua escolha", placeholder: "Explique as relações entre as forças nas duas direções e por que o caixote permanece parado...", linhas: 6 },
    ],
  },

  {
    codigo: "H23-ENERGIA-01",
    titulo: "Qual equipamento comprar?",
    blocos: [
      { tipo: "texto", conteudo: "Uma cooperativa precisa instalar um equipamento para elevar caixas até um depósito. O equipamento será utilizado muitas vezes por dia." },
      { tipo: "texto", conteudo: "Dois modelos atendem às mesmas condições de segurança e elevam cargas iguais até a mesma altura, no mesmo tempo:" },
      { tipo: "lista", itens: [
        "<strong>Modelo A:</strong> custa menos para comprar, mas consome mais energia elétrica em cada elevação.",
        "<strong>Modelo B:</strong> custa mais para comprar, mas consome menos energia elétrica em cada elevação.",
      ] },
      { tipo: "texto", conteudo: "A cooperativa tem dinheiro para adquirir qualquer um dos modelos. Uma pessoa afirma:" },
      { tipo: "citacao", conteudo: "Como os dois elevam a mesma carga até a mesma altura, eles aproveitam igualmente a energia. Então devemos escolher apenas pelo menor preço de compra." },
      { tipo: "nota", conteudo: "Considere que as cargas partem e terminam em repouso e que os modelos têm iguais custos de instalação, manutenção e vida útil." },
      { tipo: "imagem", src: "../img/pergunta_03.jpeg", alt: "Modelos A e B elevando caixas iguais até a mesma altura" },
      { tipo: "comando", conteudo: "Você concorda com essa afirmação? Explique qual modelo escolheria para o uso frequente da cooperativa, relacionando o consumo de energia ao trabalho útil de elevação e às possíveis consequências econômicas ou ambientais dessa escolha." },
    ],
    campos: [
      { id: "resposta", rotulo: "Sua resposta", placeholder: "Escreva aqui sua explicação...", linhas: 8 },
    ],
  },

  {
    codigo: "H17-CINEMATICA-01",
    titulo: "O movimento do carrinho",
    blocos: [
      { tipo: "texto", conteudo: "Um carrinho se desloca em linha reta, sempre no mesmo sentido. Sua velocidade foi registrada na tabela abaixo." },
      { tipo: "texto", conteudo: "Entre 0 e 4 segundos, a velocidade aumenta de maneira uniforme. Entre 4 e 8 segundos, permanece constante." },
      { tipo: "tabela",
        cabecalho: ["Tempo (s)", "Velocidade (m/s)"],
        linhas: [["0", "0"], ["2", "4"], ["4", "8"], ["6", "8"], ["8", "8"]] },
      { tipo: "comando", conteudo: "Explique como o movimento do carrinho muda ao longo dos oito segundos. Compare as duas etapas e determine a aceleração em cada uma delas e o deslocamento total, mostrando como utilizou as informações da tabela." },
    ],
    campos: [
      { id: "resposta", rotulo: "Sua resposta (explicação e cálculos)", placeholder: "Descreva as etapas, compare-as e mostre os cálculos da aceleração e do deslocamento...", linhas: 10 },
    ],
  },

  {
    codigo: "H5-MOTOR-01",
    titulo: "Qual fonte usar no motor?",
    blocos: [
      { tipo: "texto", conteudo: "Em uma atividade escolar, um pequeno motor elétrico será utilizado para elevar uma carga por meio de um cabo." },
      { tipo: "texto", conteudo: "Na condição de funcionamento prevista, o motor precisa receber <strong>12 V</strong> e consome <strong>120 W</strong> de potência elétrica." },
      { tipo: "nota", conteudo: "Considere um modelo simplificado de corrente contínua, com tensão e corrente constantes durante o funcionamento, sem conversores de tensão. Despreze a corrente de partida e as perdas nos fios." },
      { tipo: "imagem", src: "../img/pergunta_05.jpeg", alt: "Fonte de alimentação ligada a um motor elétrico que eleva uma carga por meio de um cabo" },
      { tipo: "texto", conteudo: "Estão disponíveis três fontes:" },
      { tipo: "tabela",
        cabecalho: ["Fonte", "Tensão de saída", "Corrente máxima fornecida"],
        linhas: [["A", "12 V", "5 A"], ["B", "12 V", "15 A"], ["C", "24 V", "15 A"]] },
      { tipo: "comando", conteudo: "Qual fonte atende às necessidades desse motor? Justifique sua escolha utilizando as informações de tensão e potência para determinar a corrente necessária e explicar por que as outras fontes não atendem às condições apresentadas." },
    ],
    campos: [
      { id: "resposta", rotulo: "Sua resposta (cálculo e justificativa)", placeholder: "Mostre o cálculo da corrente, indique a fonte escolhida e explique por que as outras não servem...", linhas: 10 },
    ],
  },

  {
    codigo: "H6-BICICLETA-01",
    titulo: "A marcha para a subida",
    blocos: [
      { tipo: "texto", conteudo: "Uma pessoa está aprendendo a utilizar as marchas de uma bicicleta. Antes de uma subida, consulta o manual e encontra as informações abaixo." },
      { tipo: "imagem", src: "../img/pergunta_06.jpeg", alt: "Vista lateral da transmissão da bicicleta: engrenagem dianteira ligada aos pedais, engrenagem traseira na roda e a corrente entre elas" },
      { tipo: "texto", conteudo: "<strong>Trecho do manual simplificado</strong>" },
      { tipo: "texto", conteudo: "Durante a pedalada, com a transmissão engatada, o número de voltas da roda pode ser calculado pela relação:" },
      { tipo: "citacao", conteudo: "Voltas da roda = Voltas dos pedais × (nº de dentes da engrenagem dianteira ÷ nº de dentes da engrenagem traseira)" },
      { tipo: "texto", conteudo: "Para enfrentar uma subida, utilize a configuração que permita percorrer uma distância menor a cada volta completa dos pedais. Isso reduz a força necessária nos pedais para enfrentar a mesma resistência ao movimento, embora exija mais voltas dos pedais para percorrer a mesma distância." },
      { tipo: "texto", conteudo: "A bicicleta permite estas configurações:" },
      { tipo: "tabela",
        cabecalho: ["Configuração", "Dentes na engrenagem dianteira", "Dentes na engrenagem traseira"],
        linhas: [["A", "30", "30"], ["B", "30", "15"]] },
      { tipo: "nota", conteudo: "Considere uma transmissão ideal, sem perdas, e que cada volta da roda corresponde a 2 m percorridos, sem deslizamento. Uma volta dos pedais corresponde a uma volta completa do conjunto de pedais." },
      { tipo: "comando", conteudo: "Com base no manual, qual configuração você recomendaria para a subida? Explique sua escolha comparando a distância percorrida em uma volta completa dos pedais nas duas configurações e relacionando os resultados à orientação do fabricante." },
    ],
    campos: [
      { id: "resposta", rotulo: "Sua resposta (cálculos e recomendação)", placeholder: "Calcule a distância em cada configuração e explique qual recomendaria...", linhas: 10 },
    ],
  },
];

/* ---------------------------------------------------------------------
   PERGUNTAS AVALIATIVAS (depois do vídeo)
   --------------------------------------------------------------------- */
const PERGUNTAS_AVALIATIVAS = [
  {
    codigo: "H20-NEWTON-01",
    titulo: "Representando as forças",
    blocos: [
      { tipo: "texto", conteudo: "O caixote continua parado enquanto a pessoa o empurra horizontalmente sobre o piso áspero." },
      { tipo: "imagem", src: "../img/pergunta_01_pos.jpeg", alt: "Pessoa empurrando o caixote, sem setas" },
      { tipo: "nota", conteudo: "Desconsidere a resistência do ar e suponha que o caixote não tombe." },
      { tipo: "comando", conteudo: "Descreva as setas que você desenharia sobre o caixote para representar as forças que atuam nele. Para cada seta, informe: qual é a força, quem ou o que a exerce, a direção e o sentido (para cima, para baixo, para a direita, para a esquerda) e o comprimento em relação às outras setas. Depois, escreva uma breve explicação de como essas setas representam o equilíbrio que mantém o caixote em repouso." },
    ],
    campos: [
      { id: "setas", rotulo: "Descrição das setas", placeholder: "Ex.: Seta 1 — força ..., exercida por ..., aponta para ..., comprimento ...", linhas: 7 },
      { id: "explicacao", rotulo: "Explicação do equilíbrio", placeholder: "Explique como as setas mostram que o caixote permanece em repouso...", linhas: 5 },
    ],
  },

  {
    codigo: "H20-NEWTON-02",
    titulo: "Equilíbrio ou ação e reação?",
    blocos: [
      { tipo: "texto", conteudo: "Um estudante empurra horizontalmente um caixote sobre um piso horizontal e áspero, mas ele permanece parado." },
      { tipo: "texto", conteudo: "O diagrama representa quatro forças que atuam sobre o caixote:" },
      { tipo: "lista", itens: [
        "<strong>FE:</strong> empurrão exercido pelo estudante.",
        "<strong>Fat:</strong> atrito estático exercido pelo piso.",
        "<strong>P:</strong> peso exercido pela Terra.",
        "<strong>N:</strong> normal exercida pelo piso.",
      ] },
      { tipo: "nota", conteudo: "Desconsidere a resistência do ar e suponha que o caixote não tombe." },
      { tipo: "imagem", src: "../img/pergunta_02.jpeg", alt: "Estudante empurrando o caixote e diagrama com as forças FE, Fat, P e N" },
      { tipo: "nota", conteudo: "Os comprimentos das setas são esquemáticos e não informam as intensidades das forças." },
      { tipo: "comando", conteudo: "Qual alternativa diferencia corretamente as relações de equilíbrio e de ação e reação nessa situação?" },
    ],
    alternativas: [
      { letra: "A", texto: "Peso P e normal N formam um par de ação e reação que explica o equilíbrio vertical. Empurrão FE e atrito Fat formam outro par de ação e reação que explica o equilíbrio horizontal." },
      { letra: "B", texto: "O caixote permanece parado porque a força que exerce sobre o estudante é maior que o empurrão FE recebido dele." },
      { letra: "C", texto: "FE e Fat se equilibram na horizontal, e N e P se equilibram na vertical. Essas forças atuam sobre o mesmo corpo, o caixote, enquanto as forças de um par de ação e reação pertencem à mesma interação e atuam em corpos distintos." },
    ],
    campos: [
      { id: "justificativa", rotulo: "Justifique sua escolha", placeholder: "Explique o repouso do caixote e o critério para distinguir forças em equilíbrio de pares de ação e reação...", linhas: 6 },
    ],
  },

  {
    codigo: "H23-ENERGIA-01",
    titulo: "Recomendação de compra",
    blocos: [
      { tipo: "texto", conteudo: "Antes da compra, a cooperativa recebe os resultados de um teste dos equipamentos." },
      { tipo: "texto", conteudo: "Cada modelo elevou uma carga de <strong>100 kg</strong> até uma altura de <strong>6 m</strong>, partindo e terminando em repouso." },
      { tipo: "nota", conteudo: "Considere g = 10 m/s². A energia útil corresponde ao aumento da energia potencial gravitacional da carga." },
      { tipo: "imagem", src: "../img/pergunta_03.jpeg", alt: "Modelos A e B elevando caixas iguais até a mesma altura" },
      { tipo: "texto", conteudo: "A tabela apresenta a energia elétrica consumida por elevação e o preço de compra dos equipamentos." },
      { tipo: "tabela",
        cabecalho: ["Informação", "Modelo A", "Modelo B"],
        linhas: [
          ["Energia elétrica consumida por elevação", "12.000 J", "8.000 J"],
          ["Preço de compra (valores fictícios)", "R$ 2.000", "R$ 2.800"],
        ] },
      { tipo: "texto", conteudo: "Os equipamentos têm iguais condições de segurança, tempo de elevação, vida útil e custos de instalação e manutenção. A cooperativa dispõe de <strong>R$ 3.000</strong> e pretende utilizar o equipamento muitas vezes por dia." },
      { tipo: "comando", conteudo: "Elabore uma recomendação de compra para a cooperativa. Apresente o cálculo da energia útil da elevação e do rendimento de cada modelo. Utilize os resultados para comparar as alternativas e justificar sua escolha, considerando o preço inicial e uma consequência econômica ou ambiental do consumo de energia durante o uso." },
    ],
    campos: [
      { id: "calculos", rotulo: "Cálculos (energia útil e rendimento)", placeholder: "Mostre os cálculos passo a passo...", linhas: 6 },
      { id: "recomendacao", rotulo: "Recomendação de compra", placeholder: "Qual modelo você recomenda e por quê?", linhas: 6 },
    ],
  },

  {
    codigo: "H17-CINEMATICA-01",
    titulo: "Do gráfico para a tabela",
    blocos: [
      { tipo: "texto", conteudo: "Outro carrinho se desloca em linha reta, sempre no mesmo sentido. O gráfico mostra sua velocidade ao longo de doze segundos. Os trechos entre os pontos são segmentos de reta." },
      { tipo: "imagem", src: "../img/grafico_cinematica_pos.svg", alt: "Gráfico velocidade × tempo com os pontos (0; 0), (3; 3), (6; 6), (9; 6) e (12; 6): trecho crescente de 0 a 6 s e trecho horizontal de 6 a 12 s" },
      { tipo: "comando", conteudo: "Uma pessoa precisa compreender esse movimento sem visualizar o gráfico. Prepare uma tabela com os valores de tempo e velocidade indicados e uma breve explicação comparando as duas etapas. Inclua a aceleração de cada etapa e o deslocamento total, explicando como obteve esses resultados a partir do gráfico." },
    ],
    campos: [
      { id: "tabela", rotulo: "Tabela (tempo e velocidade)", placeholder: "Ex.: t = 0 s → v = ... m/s\nt = 3 s → v = ... m/s\n...", linhas: 6 },
      { id: "explicacao", rotulo: "Explicação e cálculos (acelerações e deslocamento)", placeholder: "Compare as duas etapas e mostre como calculou as acelerações e o deslocamento total...", linhas: 8 },
    ],
  },

  {
    codigo: "H5-MOTOR-01",
    titulo: "Recomendando uma fonte",
    blocos: [
      { tipo: "texto", conteudo: "Outro equipamento utiliza um motor para elevar uma carga de <strong>30 kg</strong> até uma altura de <strong>2 m</strong>, em <strong>10 s</strong>. A carga parte e termina em repouso." },
      { tipo: "texto", conteudo: "O rendimento global da conversão de energia elétrica em energia útil de elevação é de <strong>60%</strong>, e o motor foi projetado para receber <strong>20 V</strong>." },
      { tipo: "nota", conteudo: "Considere g = 10 m/s². Utilize as potências e a corrente médias durante a elevação. Na comparação com as fontes, considere essa corrente média como a corrente de funcionamento do modelo simplificado, desconsiderando picos e variações durante o percurso. Despreze também a corrente de partida e as perdas nos fios. Não há conversores de tensão." },
      { tipo: "imagem", src: "../img/pergunta_05_pos.jpeg", alt: "Motor no alto de uma estrutura elevando uma caixa de 30 kg a uma altura de 2 m" },
      { tipo: "texto", conteudo: "Estão disponíveis estas fontes:" },
      { tipo: "tabela",
        cabecalho: ["Fonte", "Tensão de saída", "Corrente máxima fornecida"],
        linhas: [["D", "20 V", "3 A"], ["E", "20 V", "6 A"], ["F", "40 V", "6 A"]] },
      { tipo: "comando", conteudo: "Recomende uma fonte para esse equipamento. Utilize a elevação da carga e o rendimento para determinar a potência elétrica média necessária e a corrente correspondente. Compare as fontes e justifique sua recomendação." },
    ],
    campos: [
      { id: "calculos", rotulo: "Cálculos (energia, potências e corrente)", placeholder: "Mostre os cálculos passo a passo...", linhas: 7 },
      { id: "recomendacao", rotulo: "Recomendação da fonte", placeholder: "Qual fonte você recomenda? Compare as três e justifique...", linhas: 6 },
    ],
  },

  {
    codigo: "H6-BICICLETA-01",
    titulo: "Orientando o ciclista",
    blocos: [
      { tipo: "texto", conteudo: "Uma bicicleta diferente possui uma engrenagem dianteira com 36 dentes e duas opções de engrenagem traseira." },
      { tipo: "texto", conteudo: "Ao observar que a configuração D faz a roda girar mais vezes por volta dos pedais, um ciclista comenta:" },
      { tipo: "citacao", conteudo: "Vou usar essa configuração na subida, porque a roda gira mais e isso deve deixar a pedalada mais leve." },
      { tipo: "imagem", src: "../img/pergunta_06_pos.jpeg", alt: "Configurações C e D da transmissão, com as engrenagens dianteira e traseira identificadas" },
      { tipo: "texto", conteudo: "<strong>Trecho do manual simplificado</strong>" },
      { tipo: "lista", itens: [
        "Com a transmissão engatada, calcule as voltas da roda multiplicando as voltas dos pedais pela razão entre o número de dentes da engrenagem dianteira e o da traseira.",
        "Para subidas, escolha a configuração que produza menor distância por volta dos pedais. Isso reduz a força necessária nos pedais para enfrentar a mesma resistência ao movimento.",
      ] },
      { tipo: "texto", conteudo: "As configurações disponíveis são:" },
      { tipo: "tabela",
        cabecalho: ["Configuração", "Dentes na engrenagem dianteira", "Dentes na engrenagem traseira"],
        linhas: [["C", "36", "36"], ["D", "36", "12"]] },
      { tipo: "nota", conteudo: "Considere uma transmissão ideal, sem perdas, e que cada volta da roda corresponde a 2 m percorridos, sem deslizamento." },
      { tipo: "comando", conteudo: "A escolha do ciclista está de acordo com o manual? Prepare uma orientação para ele, comparando as distâncias percorridas após quatro voltas completas dos pedais nas configurações C e D e explicando qual configuração deve utilizar na subida. Apresente seus cálculos." },
    ],
    campos: [
      { id: "calculos", rotulo: "Cálculos (voltas da roda e distância)", placeholder: "Calcule para as configurações C e D, com quatro voltas dos pedais...", linhas: 6 },
      { id: "orientacao", rotulo: "Orientação para o ciclista", placeholder: "A escolha dele está de acordo com o manual? Qual configuração deve usar e por quê?", linhas: 6 },
    ],
  },
];
