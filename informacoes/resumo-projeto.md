# Horizon — resumo do projeto

**Em uma frase:** a Horizon é uma plataforma de avaliação formativa para o Ensino Médio. Ela troca a prova pontual e a nota de 0 a 10 por um ciclo curto e diário (diagnóstico antes da aula e verificação depois). Assim o professor descobre *onde* o raciocínio de cada turma falha, sem gastar horas corrigindo. O piloto começa por Física.

Origem: programa StartUCS (Universidade de Caxias do Sul), com mentoria de Cesar Pisetta. Pesquisadores: Breno Cechinato de Lima, Igor Cechinato de Lima e Rudson da Rosa Pedroso.

## O problema
- **A nota esconde o erro.** Em Física, um resultado errado costuma vir de uma ideia errada (por exemplo, "se está parado, não há força"), e não de conta errada. Quando o professor só vê certo ou errado, a lacuna passa despercebida e se acumula de um conteúdo para o próximo.
- **O professor não tem tempo.** Um docente de Física atende de 300 a 400 alunos em até 10 turmas. Ler centenas de justificativas por semana é inviável. Se uma ferramenta pedir mais de 3 minutos por aula, mais de 80% dos professores a abandonam já na 2ª semana.
- **Nenhuma ferramenta atual fecha o ciclo.** Sistemas como Geekie e Plurall exigem trocar o material ou só contam acertos. Bancos de questões como SuperPro e Estuda.com dão apenas um percentual. Google Forms deixa a tabulação toda com o professor. YouTube e Khan Academy não se comunicam com a escola. A Letrus faz avaliação formativa, mas só de redação.

## A solução: ciclo em 5 fases
1. **Pré-aula:** o aluno responde de 2 a 3 questões conceituais curtas, em menos de 5 minutos.
2. **Agrupamento inteligente:** a IA junta respostas parecidas em "famílias de raciocínio" e identifica os equívocos típicos.
3. **Validação do professor:** ele revisa uma amostra de cada grupo e aplica a rubrica a todos com um clique. A decisão final é sempre do professor.
4. **Aula presencial:** um mapa de calor mostra as lacunas da turma e sugere uma intervenção de cerca de 10 minutos para o começo da aula.
5. **Pós-aula:** uma questão parecida com a do diagnóstico (o *exit ticket*) mede quanto a turma avançou.

A base pedagógica vem de métodos já testados no ensino de Física: Ensino sob Medida (JiTT), Instrução pelos Pares (Mazur) e rubricas analíticas. Cada resposta é avaliada em 4 fases: entender o conceito, modelar a situação, calcular e justificar. No lugar da média, o aluno recebe um **conceito de A a D**: D = não consolidado, C = em desenvolvimento, B = consolidado, A = avançado.

**O que já foi feito neste repositório:** um protótipo do ciclo com 6 perguntas de Física alinhadas às habilidades do ENEM (H5, H6, H17, H20 e H23). Ele tem a sequência diagnóstico → vídeo → pós-aula, critérios de correção por verbo e registro das respostas em planilha.

## Para quem
| Público | O que ganha |
|---|---|
| **Professor de Física** (usuário principal) | Sabe o que a turma não entendeu antes da aula e não precisa corrigir aluno por aluno |
| **Aluno do Ensino Médio** | Entende em que etapa do raciocínio errou e recebe o próximo passo |
| **Coordenação e direção** (quem paga) | Vê, ainda no início, as turmas em risco de reprovação e evasão, com relatórios para mostrar às famílias |

## Modelo de negócio
- **Entrada pelo professor:** piloto gratuito de 90 dias com 3 a 5 professores de Física, ao longo de 4 ciclos. Os resultados são levados depois à direção da escola.
- **Contrato com a escola (SaaS):** cobrança por aluno ativo, entre R$ 6 e R$ 18 por mês, mais uma taxa de implantação e treinamento.
- **Ponto de equilíbrio:** de 12 a 13 escolas. No segundo ano, 30 escolas gerariam cerca de R$ 1 milhão de receita recorrente por ano.
- **Expansão:** depois de Física, Química, Matemática e Biologia.

## Metas de validação
- Professor gasta **no máximo 4 minutos por semana por turma**.
- **Pelo menos 75%** dos alunos concluem o diagnóstico.
- **Mais de 80%** das turmas com lacuna detectada recebem uma intervenção em sala.
- Métrica principal (*north star*): **intervenções feitas a partir das evidências**.

---

### Pontos de atenção para a landing page
1. **"Substitui provas"** pode assustar escolas e coordenadores. Os documentos falam em trocar a *nota pontual* por um *acompanhamento contínuo*. Sugiro algo como "avaliação que acompanha o aluno todo dia, não só no dia da prova".
2. **A meta de "35% menos notas vermelhas"** é uma hipótese da mentoria, não um resultado. Na página, ela deve aparecer como objetivo do piloto ou ficar de fora.
3. **Os números variam entre os documentos:** 300 ou 400 alunos por professor, preço por aluno ou tíquete de R$ 500 por escola. É melhor escolher uma versão antes de publicar.
