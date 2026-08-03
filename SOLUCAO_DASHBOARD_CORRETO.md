# 🎯 SOLUÇÃO: Dashboard Copa Excelência com Indicadores Disponíveis

## 📊 Indicadores Disponíveis nos Stores

```
✅ TEMOS (8 indicadores):
├── Ativo Comercial                → 1 Gol (por unidade)
├── Seguro de Vida                 → 2 Gols (por unidade)
├── Consórcio                       → 4 Gols (por unidade)
├── Depósitos Totais               → 4 Gols (a cada R$ 10.000)
├── Crédito Comercial              → 4 Gols (a cada R$ 10.000)
├── Capital Social                 → 5 Gols (a cada R$ 10.000)
├── Inad 15 (Redução)              → +2 Gols (por % reduzido)
└── Inad 15 (Aumento)              → -5 Gols (por % aumentado)

❌ NÃO TEMOS (6 indicadores - EXCLUIR DO CÁLCULO):
├── Adquirência/Domicílio (Maquininha)
├── Cartão de Crédito
├── Cheque Especial
├── Emissão de Boletos
├── Incremento de Capital Social (Solcap)
└── (Seguros Auto/Frota/Agrícola/Empresarial - considerar como Seguro de Vida)
```

---

## 🗓️ Período de Cálculo: Junho a Agosto Apenas

### Regra de Filtro para TODOS os cálculos:

```
DATA >= 01/06/2024 E DATA <= 31/08/2024
OU (em fórmulas)
MÊS(DATA) >= 6 E MÊS(DATA) <= 8 E ANO(DATA) = 2024
```

**NÃO EXCLUIR dos Stores (mantém integridade dos dados)**
**MAS EXCLUIR dos cálculos do Dashboard (fórmulas)**

---

## 📐 Fórmulas de Cálculo de Gols por Indicador

### 1. ATIVO COMERCIAL = 1 Gol
```
=COUNTIFS(
  Store_Gerente[Data], ">="&DATE(2024,6,1),
  Store_Gerente[Data], "<="&DATE(2024,8,31),
  Store_Gerente[Gerente], "="&A2,
  Store_Gerente[Ativo Comercial], ">0"
) * 1
```

### 2. SEGURO DE VIDA = 2 Gols
```
=COUNTIFS(
  Store_Gerente[Data], ">="&DATE(2024,6,1),
  Store_Gerente[Data], "<="&DATE(2024,8,31),
  Store_Gerente[Gerente], "="&A2,
  Store_Gerente[Seguro de Vida], ">0"
) * 2
```

### 3. CONSÓRCIO = 4 Gols
```
=COUNTIFS(
  Store_Gerente[Data], ">="&DATE(2024,6,1),
  Store_Gerente[Data], "<="&DATE(2024,8,31),
  Store_Gerente[Gerente], "="&A2,
  Store_Gerente[Consórcio], ">0"
) * 4
```

### 4. DEPÓSITOS TOTAIS = 4 Gols a cada R$ 10.000
```
=INT(
  SUMIFS(
    Store_Gerente[Depósitos Totais],
    Store_Gerente[Data], ">="&DATE(2024,6,1),
    Store_Gerente[Data], "<="&DATE(2024,8,31),
    Store_Gerente[Gerente], "="&A2
  ) / 10000
) * 4
```

### 5. CRÉDITO COMERCIAL = 4 Gols a cada R$ 10.000
```
=INT(
  SUMIFS(
    Store_Gerente[Crédito Comercial],
    Store_Gerente[Data], ">="&DATE(2024,6,1),
    Store_Gerente[Data], "<="&DATE(2024,8,31),
    Store_Gerente[Gerente], "="&A2
  ) / 10000
) * 4
```

### 6. CAPITAL SOCIAL = 5 Gols a cada R$ 10.000
```
=INT(
  SUMIFS(
    Store_Gerente[Capital Social],
    Store_Gerente[Data], ">="&DATE(2024,6,1),
    Store_Gerente[Data], "<="&DATE(2024,8,31),
    Store_Gerente[Gerente], "="&A2
  ) / 10000
) * 5
```

### 7. INADIMPLÊNCIA 15 - REDUÇÃO = +2 Gols por %
```
=IF(
  Inad15_Basedez - Inad15_Agora > 0,
  (Inad15_Basedez - Inad15_Agora) * 2,
  0
)
```

### 8. INADIMPLÊNCIA 15 - AUMENTO = -5 Gols por %
```
=IF(
  Inad15_Agora - Inad15_Basedez > 0,
  (Inad15_Agora - Inad15_Basedez) * -5,
  0
)
```

---

## 📊 TOTAL DE GOLS POR GERENTE (Junho-Agosto)

```
TOTAL GOLS GERENTE = 
  (Ativo Comercial * 1)
+ (Seguro de Vida * 2)
+ (Consórcio * 4)
+ (Depósitos / 10000 * 4)
+ (Crédito / 10000 * 4)
+ (Capital Social / 10000 * 5)
+ (Inad15 Redução * 2)
- (Inad15 Aumento * 5)
```

---

## 🎖️ MULTIPLICADOR DE FASES

### Fase 1: Junho (01-30/06) = 1.0x
```
=IF(MÊS(Data)=6, Gols * 1.0, 0)
```

### Fase 2: Julho (01-30/07) = 1.5x (MATA-MATA)
```
=IF(MÊS(Data)=7, Gols * 1.5, 0)
```

### Fase 3: Agosto (01-30/08) = 1.0x
```
=IF(MÊS(Data)=8, Gols * 1.0, 0)
```

### TOTAL COM MULTIPLICADORES:
```
=SOMASE(Junho) + SOMASE(Julho*1.5) + SOMASE(Agosto)
```

---

## 📋 AGREGAÇÃO: Gerentes → Agência

**CRÍTICO:** Deve bater EXATAMENTE

```
PONTOS AGÊNCIA = SUM(Pontos de TODOS os gerentes dessa agência)
```

---

## 🏆 RANKING POR GRUPO

### Grupos Definidos:

**GRUPO 1:**
- São Joaquim
- Canoinhas
- Lages (ambas)
- Porto União

**GRUPO 2:**
- Correia Pinto
- Otacílio Costa
- Irineópolis
- Major Vieira

**GRUPO 3:**
- Bom Jardim da Serra
- Timbó Grande
- Monte Castelo
- Ponte Alta
- Bela Vista do Toldo
- Santa Cruz do Timbó

---

## 🔐 PLACAR OCULTO (Últimos 15 dias de Agosto)

```
Data: 16/08/2024 até 31/08/2024

SE DATA >= 16/08 E DATA <= 31/08:
  - Dashboard NÃO exibe ranking em tempo real
  - Mostra mensagem: "Placar oculto até 31/08"
  - Calcula internamente, mas não mostra posição
  - Revela posição final em 01/09
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [ ] Todas fórmulas usam DATE(2024,6,1) a DATE(2024,8,31)
- [ ] Nenhum dado de Janeiro-Maio incluído
- [ ] Nenhum dado de Setembro+ incluído
- [ ] Multiplicador 1.5x em Julho
- [ ] Pontos Gerente = Pontos Agência (soma exata)
- [ ] Ranking por grupo correto
- [ ] Placar oculto em 16-31/08

---

**Data:** 2026-08-03  
**Status:** ✅ Pronto para implementação  
**Período:** Junho a Agosto 2024 apenas
