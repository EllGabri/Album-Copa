# 📊 ANÁLISE: Regras da "Copa Excelência" vs. Implementação Atual

## 🎯 Período da Campanha

**Regra:** Junho a Agosto (90 dias)
- Fase 1 (1-30/06): Fase de Grupos
- Fase 2 (1-30/07): Mata-mata (Multiplicador 1.5x)
- Fase 3 (1-30/08): Grande Final (Últimos 15 dias com placar oculto)

**Status na Implementação:** ⚠️ NÃO ENCONTRADO

---

## 📋 Tabela de Pontuação (Gols)

### ATAQUE RÁPIDO (1-2 Gols)

| Produto | Critério | Gols | Status |
|---------|----------|------|--------|
| Abertura de Contas | Conta ativa com Capital integralizado | 1 | ⚠️ |
| Cartão de Crédito | Cartão emitido, limite > R$ 1.000, 1ª transação | 1 | ⚠️ |
| Cheque Especial | Novo limite > R$ 1.000 | 1 | ⚠️ |
| Emissão de Boletos | Cadastro emitente com boletos gerados | 2 | ⚠️ |

### MEIO DE CAMPO (2-4 Gols)

| Produto | Critério | Gols | Status |
|---------|----------|------|--------|
| Incremento Capital Social | Novo Solcap, renovação automática > R$ 50 | 2 | ⚠️ |
| Seguros (Vida/Residência) | Proposta emitida e paga | 2 | ⚠️ |
| Adquirência/Maquininha | Domicílio ativo + faturamento inicial | 3 | ⚠️ |
| Seguros (Auto/Frota/Agrícola/Empresarial) | Proposta emitida e paga | 4 | ⚠️ |

### GOLEADA (4-5 Gols)

| Produto | Critério | Gols | Status |
|---------|----------|------|--------|
| Consórcio | Cota comercializada | 4 | ⚠️ |
| Captação (RDC, LCA, Poupança) | A cada R$ 10.000 incrementada | 4 | ⚠️ |
| Crédito Comercial | A cada R$ 10.000 incrementada | 4 | ⚠️ |
| Crédito Comercial Pré-aprovado | Bônus a cada R$ 5.000 liberado | 1 | ⚠️ |
| Incremento Capital Social (Procap) | Acima de R$ 10.000 integralizados | 5 | ⚠️ |

### DEFESA (±2 a ±5 Gols)

| Produto | Critério | Gols | Status |
|---------|----------|------|--------|
| Inadimplência Controlada | Inad 15 a cada 1% reduzido | +2 | ⚠️ |
| Inadimplência Descontrolada | Inad 15 a cada 1% aumento | -5 | ⚠️ |

---

## 👥 Divisão de Grupos

### GRUPO 1 (Seleções Cabeça de Chave)
- São Joaquim
- Canoinhas
- Lages Guarujá
- Lages Santa Helena
- Porto União

### GRUPO 2 (Seleções Intermediárias)
- Correia Pinto
- Otacílio Costa
- Irineópolis
- Major Vieira

### GRUPO 3 (Seleções Desafiantes)
- Bom Jardim da Serra
- Timbó Grande
- Monte Castelo
- Ponte Alta
- Bela Vista do Toldo
- Santa Cruz do Timbó

---

## 📊 Regras de Cálculo de Pontuação

### ✅ DEVE INCLUIR

1. **Período Específico:** Apenas Junho a Agosto (SEM SALDO DE MAIO)
   - Fase 1: 01-30/06
   - Fase 2: 01-30/07 (com multiplicador 1.5x)
   - Fase 3: 01-30/08 (últimos 15 dias com placar oculto)

2. **Agregação de Dados:**
   - Somar pontos de TODOS os gerentes de cada agência
   - **Pontuação do gerente = Pontuação da agência (deve bater exatamente)**
   - Não incluir gerentes excluídos

3. **Multiplicadores:**
   - Fase 1 (Jun): 1.0x
   - Fase 2 (Jul): 1.5x (mata-mata)
   - Fase 3 (Ago): 1.0x (mas últimos 15 dias com placar oculto)

4. **Ranking por Grupo:**
   - Agências ordenadas por total de gols dentro de seu grupo
   - 1º lugar: Artilheiro (maior pontuação)
   - 2º lugar: Segunda colocação
   - 3º lugar: Terceira colocação

5. **Técnicos (Regionais/Assessores):**
   - Soma dos gols de seus respectivos gerentes/agências
   - Se time goleia → sobe na tabela
   - Se time estagna → zona de rebaixamento

---

## 🎁 Premiação

### AGÊNCIAS
- **1º lugar cada grupo:** R$ 3.000 (voucher viagem)
- **2º lugar cada grupo:** R$ 750
- **3º lugar cada grupo:** R$ 500

### EQUIPE TÉCNICA
- **Happy hour** para maior percentual do planejamento estratégico

---

## ⚠️ PROBLEMAS IDENTIFICADOS

### 1. **Período de Cálculo NÃO Implementado**
- ❌ Não há filtro de datas (Junho a Agosto apenas)
- ❌ Não há exclusão de saldo de Maio
- ❌ Não há diferenciação de fases

### 2. **Multiplicadores de Fase NÃO Implementados**
- ❌ Fase 2 (Julho) deveria ter 1.5x (mata-mata)
- ❌ Nenhuma evidência de multiplicadores no código

### 3. **Placar Oculto NÃO Implementado**
- ❌ Fase 3 (últimos 15 dias de Agosto) deveria ter ranking oculto

### 4. **Sincronização Gerente-Agência NÃO Verificada**
- ⚠️ Código lê Store_Gerente e Store_Agencia
- ⚠️ Não há evidência de que pontuação bate exatamente
- ⚠️ Precisa validar se `SUM(gerentes da agência X) = Pontuação agência X`

### 5. **Exclusão de Colaboradores PARCIALMENTE Implementada**
- ✓ Código lê lista de excluídos de "Configurações_Dashboard"
- ❌ Não está claro se está sendo aplicado no cálculo final

### 6. **Tabela de Técnicos PARCIALMENTE Implementada**
- ✓ Código lê técnicos de "Configurações_Dashboard" (Colunas L, M, N)
- ❌ Não há lógica de soma de pontos dos gerentes para técnicos

---

## 📝 Checklist de Validação

- [ ] Datas filtradas (Jun-Ago apenas)
- [ ] Sem saldo de Maio incluído
- [ ] Multiplicador 1.5x em Julho
- [ ] Placar oculto últimos 15 de Agosto
- [ ] Pontuação gerente = pontuação agência
- [ ] Colaboradores excluídos removidos
- [ ] Técnicos com soma correta
- [ ] Ranking por grupo funciona
- [ ] Premiação alinhada

---

**Data da Análise:** 2026-08-03  
**Status:** ⚠️ REQUER VALIDAÇÃO IMEDIATA
