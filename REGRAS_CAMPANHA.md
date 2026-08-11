# 🏆 Regras Oficiais da Campanha — "Copa Excelência de Negócios: Rumo à Grande Final"

Fonte: documento oficial da campanha (Word), extraído e transcrito integralmente abaixo. Esta é a **fonte de verdade das regras de negócio** — `CONFIGURACOES_DASHBOARD.md` e `IMPLEMENTACAO_DASHBOARD.md` devem refletir o que está aqui.

## Objetivo

Promover engajamento comercial, fortalecimento da cultura de resultados e integração entre as agências através de uma campanha gamificada inspirada na Copa do Mundo. Alavancar o resultado da Cooperativa nos próximos 90 dias, estimulando a alta performance e a cross-sell (venda cruzada) de produtos estratégicos.

## 📅 As Fases do Campeonato (90 Dias)

A campanha é dividida em 3 fases de 30 dias.

**Foco Semanal (dentro de cada fase):**
- Semana 1: Volume e Ativação (Contas, Cartões, Cheque Especial)
- Semana 2: Crédito Comercial
- Semana 3/4: Capital Social
- Semana 4: Rentabilidade (Seguros, Consórcios e Adquirência)

| Fase | Período | Nome | Dinâmica | Estímulo |
|---|---|---|---|---|
| 🥉 Fase 1 | Dias 1-30/06 | Fase de Grupos | Gerentes começam a pontuar para garantir posição na tabela | "Artilheiro da Rodada" (maior pontuador do mês em cada grupo) ganha brinde personalizado da Copa |
| 🥈 Fase 2 | Dias 01-30/07 | O Mata-Mata (Oitavas e Quartas) | **Gols valem peso 1,5x** | "Quem não pontuar na semana, fica na zona de rebaixamento do grupo" |
| 🥇 Fase 3 | Dias 01-30/08 | A Grande Final (Semifinal e Final) | Últimos 15 dias = **"Placar Oculto"** (ranking para de ser atualizado publicamente) | Sprint final com "Gol de Ouro" (produtos específicos valendo o dobro de gols em dias selecionados — Dias D de vendas) |

## 📋 Comissão Técnica: Regionais e Assessores

Regionais e Assessores de Negócios viram "Técnicos" e "Auxiliares Técnicos":

- **Regionais (Técnicos):** somam os gols dos artilheiros das agências que pertencem ao seu chaveamento.
- **Assessores (Auxiliares Técnicos / "Passe para Gol"):** não fazem gol direto, dão a "Assistência" — somam os gols dos artilheiros do seu segmento.
- Se o time goleia, eles sobem na tabela; se o time estagna, ficam na zona de rebaixamento.

## 👥 Divisão dos Grupos (As Seleções da Copa)

A separação respeita o porte/potencial da praça. Haverá 1 Artilheiro Campeão por grupo (3 no total).

| Grupo | Critério | Agências |
|---|---|---|
| Grupo 1 (Cabeça de Chave) | Agência grande porte | São Joaquim, Canoinhas, **Lages Guarujá**, **Lages Santa Helena**, Porto União |
| Grupo 2 (Intermediárias) | Agência médio porte | Correia Pinto, Otacílio Costa, Irineópolis, Major Vieira |
| Grupo 3 (Desafiantes) | Agência pequeno porte / novas praças | Bom Jardim da Serra, Timbó Grande, Monte Castelo, Ponte Alta, Bela Vista do Toldo, Santa Cruz do Timbó |

⚠️ **Nomenclatura Lages:** o documento oficial usa "Lages Guarujá" e "Lages Santa Helena" — nos dados (`Store_*`), essas agências aparecem como **"Pac Lages Ii"** (= Lages Guarujá) e **"Pac Lages"** (= Lages Santa Helena), respectivamente. Já corrigido em `src/webapp/Index.html`.

## 🏆 Mecânica da Melhor Seleção

Para ser "Grande Campeã da Copa" de cada grupo, a agência deve atingir o **maior percentual de atingimento das metas do Planejamento Estratégico** ao final do campeonato (não é só total de gols — é atingimento % de meta).

## 🎁 Reconhecimento: "Almoço dos Campeões"

- Almoço pago para toda a equipe da agência vencedora (gerentes de negócios, assistentes, caixa, gerente da agência).
- Troféu: réplica da "Taça da Copa de Negócios" exposta na agência durante o ano.

## ⚽ A Tabela de Gols (Foco Comercial)

| Categoria | Produto Comercial | Critério para Marcar Gol | Pontuação |
|---|---|---|---|
| Ataque Rápido | Abertura de Contas | Conta ativa com Capital integralizado | 1 Gol |
| Ataque Rápido | Cartão de Crédito | Cartão emitido, limite acima de R$ 1.000,00 e com a 1ª transação | 1 Gol |
| Ataque Rápido | Cheque Especial | Novo limite acima de R$ 1.000,00 | 1 Gol |
| Ataque Rápido | Emissão de Boletos | Cadastro de emitente com boletos gerados | 2 Gols |
| Meio de Campo | Incremento de Capital Social (Solcap) | Novo Solcap com renovação automática acima de R$ 50,00 integralizados | 2 Gols |
| Meio de Campo | Seguros (Vida/Residência) | Proposta emitida e paga | 2 Gols |
| Meio de Campo | Adquirência/Domicílio (Maquininha) | Domicílio bancário ativo + faturamento inicial | 3 Gols |
| Meio de Campo | Seguros (Auto/Frota/Agrícola/Empresarial/Maquinário) | Proposta emitida e paga | 4 Gols |
| Goleada | Consórcio | Cota comercializada | 4 Gols |
| Goleada | Captação (RDC, LCA, Poupança) | A cada R$ 10.000,00 incrementada | 4 Gols |
| Goleada | Crédito Comercial | A cada R$ 10.000,00 incrementada | 4 Gols |
| Goleada | Crédito Comercial — bônus pré-aprovado | A cada R$ 5.000,00 liberado (crédito pré-aprovado) | +1 Gol extra |
| Goleada | Capital Social (Procap) | Procap acima de R$ 10.000,00 integralizados, a cada R$ 10.000 | 5 Gols |
| Defesa | Inadimplência controlada (Inad 15 crédito comercial) | A cada 1 ponto percentual **reduzido** | +2 Gols |
| Defesa | Inadimplência descontrolada (Inad 15 crédito comercial) | A cada 1 ponto percentual **aumentado** | -5 Gols |

## 🎁 Premiação: A Chuteira de Ouro

Premiação entre os 3 melhores gerentes de cada grupo (9 premiados no total):

| Posição | Prêmio | Custo total (3 grupos) |
|---|---|---|
| 🥇 1º de cada Grupo (O Artilheiro) | Voucher Viagem/Hospedagem R$ 3.000,00 (fim de semana em hotel fazenda/resort regional com acompanhante) | R$ 9.000,00 |
| 🥈 2º de cada Grupo | R$ 750,00 | R$ 2.250,00 |
| 🥉 3º de cada Grupo | R$ 500,00 | R$ 1.500,00 |
| 🎖️ Equipe Técnica (Assessores e Regionais) | Happy hour para o maior percentual do planejamento estratégico | — |

---

## ⚠️ Divergências e Pendências Frente ao Que Está Implementado

Comparando esta tabela oficial com `CONFIGURACOES_DASHBOARD.md` (indicadores de `Store_Gerente`) e o código em `src/webapp/`:

1. **✅ Já implementado e batendo:** Ativo Comercial/Abertura de Contas (1 gol), Cartão (1 gol), Cheque Especial (1 gol), Emissão de Boletos (2 gols), Adquirência/Domicílio (3 gols), Consórcio (4 gols), Depósitos Totais/Captação (4 gols/R$10k), Crédito Comercial (4 gols/R$10k), Capital Social/Procap (5 gols/R$10k), Seguro de Vida (2 gols), Inad 15 (+2/-5 por ponto percentual).
2. **🟡 Não implementado — falta confirmar o nome exato do indicador em `Store_Gerente`/`Store_Carteira`:**
   - **Seguros (Auto/Frota/Agrícola/Empresarial/Maquinário) = 4 Gols** — categoria de seguro diferente e mais valiosa que "Seguro de Vida/Residência" (2 gols); atualmente `calcularGolsGerente` trata todo "Seguro de Vida" como 2 gols e não tem case para essa categoria.
   - **Crédito Comercial — bônus pré-aprovado (+1 gol a cada R$ 5.000 liberado)** — regra adicional sobre o Crédito Comercial normal (4 gols/R$10k); não implementada em nenhum lugar (nem nas fórmulas do Sheets, nem no dashboard).
   - **Incremento de Capital Social (Solcap, 2 gols)** — já estava listado como indicador futuro em `CONFIGURACOES_DASHBOARD.md`; distinto do "Capital Social/Procap" (5 gols/R$10k) já implementado.
3. **🟡 Mecânica de "Melhor Seleção" não implementada:** a campanha define o critério de agência campeã como **% de atingimento de metas do Planejamento Estratégico**, não soma bruta de gols. O dashboard atual (`src/webapp/Index.html`) rankeia agências por soma de gols nos grupos, mas tem uma tabela separada "Ranking Geral - Atingimento da Meta" (`ag.gols / ag.metaGols`) que pode já cobrir isso parcialmente — precisa revisão para confirmar se é essa métrica que decide o campeão do grupo.
4. **🟡 "Gol de Ouro" (produtos em dobro em Dias D) e "Placar Oculto" (últimos 15 dias de agosto sem atualização pública):** nenhuma das duas mecânicas está implementada no dashboard atualmente.

Para implementar os itens 2-4, é necessário ver como esses indicadores/regras aparecem nomeados em `Store_Gerente`/`Store_Carteira` (não há amostra de dados ainda para "Seguros Auto/Frota", "bônus pré-aprovado" ou "Solcap").
