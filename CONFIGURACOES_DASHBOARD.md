# 📋 Configurações Dashboard - Copa Excelência

Dados de referência extraídos da aba `Configuracoes_Dashboard` e do dashboard publicado. Para fórmulas e passo a passo de implementação, ver `IMPLEMENTACAO_DASHBOARD.md`. Para as regras oficiais completas da campanha (fonte de verdade), ver `REGRAS_CAMPANHA.md`.

## 1. COLABORADORES EXCLUÍDOS DO RANKING

Estes colaboradores **NÃO participam** do ranking final de pontuação (fonte: `Configuracoes_Dashboard!A2:A16`):

| # | Nome |
|---|------|
| 1 | LUAN NUNES DA SILVA |
| 2 | KATRIELE DOS SANTOS |
| 3 | CRISTIANE APARECIDA KOBOKOSKI |
| 4 | GABRIEL NUNES |
| 5 | GABRIEL PESSOA ANTUNES |
| 6 | JAMES NALON JUNIOR |
| 7 | JEAN GILBERTO GRITTEN |
| 8 | EDSON DE ESPINDOLA |
| 9 | LUAN DE MELLO GONCALVES |
| 10 | MAIKON MORAES HENCKEMAIER |
| 11 | LUKAS BUSE |
| 12 | DENISIA A ASSUNCAO LUIZ WROBLEWSKI |
| 13 | PAULO MICHAHOUSKI MAIDEL |
| 14 | TAIS FERNANDA M DE SOUZA ALVES DA SILVA |
| 15 | VICTOR SILVEIRA PZIVITOVSKI |

---

## 2. INDICADORES STORE_GERENTE (PONTUAÇÃO/GOLS)

Fonte: `Configuracoes_Dashboard!C2:D15`.

| Indicador | Pontuação | Tipo | Regra |
|-----------|-----------|------|-------|
| Ativo Comercial | 1 Gol | Un | A cada 1 unidade, conte 1 Gol |
| Seguro de Vida | 2 Gols | Un | A cada 1 unidade, conte 2 Gols |
| Consórcio | 4 Gols | Un | A cada 1 unidade, conte 4 Gols |
| Depósitos Totais | 4 Gols | R$ | A cada R$ 10.000, conte 4 Gols |
| Crédito Comercial | 4 Gols | R$ | A cada R$ 10.000, conte 4 Gols |
| Capital Social | 5 Gols | R$ | A cada R$ 10.000, conte 5 Gols |
| Inad 15 Redução | +2 Gols | % | A cada redução de porcentagem, conte 2 Gols |
| Inad 15 Aumento | -5 Gols | % | A cada aumento de porcentagem, conte -5 Gols |

---

## 3. INDICADORES ADICIONAIS (Futuros)

Ainda não implementados no dashboard — falta confirmar o nome exato do indicador em `Store_Gerente`/`Store_Carteira` para poder implementar. Ver `REGRAS_CAMPANHA.md` seção "Divergências e Pendências".

| Indicador | Pontuação | Tipo |
|-----------|-----------|------|
| Adquirência/Domicílio (Maquininha) | 3 Gols | Un |
| Cartão | 1 Gol | Un |
| Cheque Especial | 1 Gol | Un |
| Emissão de Boletos | 2 Gols | Un |
| Incremento de Capital Social (Solcap) | 2 Gols | Un |
| Seguros (Auto/Frota/Agrícola/Empresarial/Maquinário) | 4 Gols | Un |
| Crédito Comercial — bônus pré-aprovado | +1 Gol | R$ 5.000 liberado (adicional ao Crédito Comercial normal) |

---

## 4. ESTRUTURA DE AGÊNCIAS, TIMES E GRUPOS

Fonte: `Configuracoes_Dashboard` colunas G (Agência) e H (Nome do Time). O Grupo (1/2/3) não existe como coluna na planilha — foi extraído do chaveamento "Classificação das Seleções" do dashboard publicado.

| Agência (Config. G) | Nome do Time (Config. H) | Nome Completo (Store_*/Resumo) | Grupo |
|---|---|---|---|
| Ponte Alta | Morangueiros | Pac Ponte Alta | 3 |
| Santa Cruz do Timbó | Artilheiros da Meta | Pac Porto Uniao D. Sta Cruz Do Timbo | 3 |
| Lages Ii | Craques da Coop | Pac Lages Ii | 1 |
| Timbó Grande | Golaço Tg | Pac Timbó Grande | 3 |
| Porto União | Tropa do Xixo | Pac Porto União | 1 |
| Correia Pinto | Construindo Gigantes | Pac Correia Pinto | 2 |
| Otacilio Costa | Furacão Laranja | Pac Otacilío Costa | 2 |
| Irineópolis | Pix na Rede FC | Pac Irineópolis | 2 |
| Canoinhas | Little Boat | Pac Canoinhas | 1 |
| Major Vieira | Sinergia | Pac Major Vieira | 2 |
| São Joaquim | Gigantes da Serra | Pac São Joaquim | 1 |
| Monte Castelo | Craques da cooperação | Pac Monte Castelo | 3 |
| Bom Jardim | Real Cooperativo | Pac Bom Jardim Da Serra | 3 |
| Bela Vista | Esquadrão Excelência | Pac Bela Vista Do Toldo | 3 |
| Lages | Canarinhos da Serra | Pac Lages | 1 |

**Grupos:**
- **Grupo 1 (Cabeças de Chave):** São Joaquim, Lages Ii, Porto União, Lages, Canoinhas
- **Grupo 2 (Intermediárias):** Major Vieira, Irineópolis, Otacilio Costa, Correia Pinto
- **Grupo 3 (Desafiantes):** Monte Castelo, Ponte Alta, Timbó Grande, Santa Cruz do Timbó, Bom Jardim, Bela Vista

---

## 5. ESTRUTURA TÉCNICA E CHAVEAMENTOS

Fonte: `Configuracoes_Dashboard!M2:O15` (colunas M=Agência, N=Técnico, O=Chaveamento; a coluna `L` é um espaçador vazio — cuidado ao ler esse intervalo por código, já foi motivo de bug em `codigo.gs`).

| Agência | Técnico | Chaveamento |
|---------|---------|-------------|
| Pac Canoinhas | Marcos Fedechen | Chaveamento Norte |
| Pac Porto União | Marcos Fedechen | Chaveamento Norte |
| Pac Irineópolis | Marcos Fedechen | Chaveamento Norte |
| Pac Major Vieira | Marcos Fedechen | Chaveamento Norte |
| Pac Bela Vista Do Toldo | Marcos Fedechen | Chaveamento Norte |
| Pac Timbó Grande | Marcos Fedechen | Chaveamento Norte |
| Pac Monte Castelo | Marcos Fedechen | Chaveamento Norte |
| Pac Porto Uniao D. Sta Cruz Do Timbo | Marcos Fedechen | Chaveamento Norte |
| Pac São Joaquim | Jean Paes | Chaveamento Serra |
| Pac Lages Ii | Jean Paes | Chaveamento Serra |
| Pac Lages | Jean Paes | Chaveamento Serra |
| Pac Correia Pinto | Jean Paes | Chaveamento Serra |
| Pac Bom Jardim Da Serra | Jean Paes | Chaveamento Serra |
| Pac Otacilício Costa | Jean Paes | Chaveamento Serra |
| Pac Ponte Alta | Jean Paes | Chaveamento Serra |

### Auxiliares Técnicos (Fonte: `Configuracoes_Dashboard!Q2:R3`)

| Auxiliar Técnico | Segmento |
|---|---|
| ~~Karla Melo~~ | ~~PJ~~ — removida do dashboard (não faz mais parte da função) |
| Paulo Colli | PF e AGRO |

---

## 6. DOCUMENTAÇÃO EXTERNA

### Links Google Drive
- **Figurinhas**: 1LjzbgsMJyUB9ixAxpQ5hiDdfk41MvSCJ
- **Template**: 1XpBlh_FBL8SHdExGccH1djViff1bnLcY

---

## 7. PERÍODOS DE COMPETIÇÃO

| Período | Registros (Store_Agencia) | Multiplicador |
|---------|-------|---|
| Junho 2026 (06/2026) | 967 | 1,0x |
| Julho 2026 (07/2026) | 1.007 | 1,5x (Mata-Mata) |
| Agosto 2026 (08/2026) | 1.152 | 1,0x |

---

**Referência:** `IMPLEMENTACAO_DASHBOARD.md` (fórmulas do Google Sheets) | `src/webapp/` (código do dashboard público, Apps Script)
