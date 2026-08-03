# Setup e Deployment - Album Copa

Instruções passo a passo para aplicar as correções e atualizar a aplicação.

## 1. Validar Integridade Local

Antes de fazer qualquer alteração, validar que o `slotMap.json` está correto:

```bash
cd /home/user/Album-Copa
python3 scripts/validate_slot_map.py
```

Esperado: `Validação OK: 161 números únicos, cobrindo todos os pools esperados`

## 2. Atualizar codigo.gs no Apps Script

### Copiar o código atualizado:

```bash
cat src/webapp/codigo.gs
```

### Colar no Google Apps Script:

1. Abrir https://script.google.com/
2. Clicar no projeto "Album Copa" (ou criar novo se necessário)
3. Abrir arquivo `codigo.gs`
4. **Ctrl+A** para selecionar tudo
5. Colar o conteúdo completo de `src/webapp/codigo.gs`
6. Salvar (Ctrl+S)
7. Deploy → New Deployment → Type: Web app
   - Execute as: seu usuário
   - Who has access: Anyone

## 3. Atualizar Album.html

### Copiar o código atualizado:

```bash
cat src/webapp/Album.html
```

### Colar no Google Apps Script:

1. No mesmo projeto, clicar no ➕ ("Create new file") se não existir "Album.html"
2. Selecionar "HTML"
3. Nomear como "Album"
4. **Ctrl+A** para selecionar tudo
5. Colar o conteúdo completo de `src/webapp/Album.html`
6. Salvar

## 4. Atualizar Index.html

### Copiar o código atualizado:

```bash
cat src/webapp/Index.html
```

### Colar no Google Apps Script:

1. Clicar no ➕ ("Create new file") se não existir "Index.html"
2. Selecionar "HTML"
3. Nomear como "Index"
4. **Ctrl+A** para selecionar tudo
5. Colar o conteúdo completo de `src/webapp/Index.html`
6. Salvar

## 5. Reconciliar Dados no Drive

### Executar Reconciliação de Figurinhas:

1. No Google Apps Script, abrir o editor de código
2. Na função `reconciliarFigurinhas()`, verificar se `FIGURINHAS_FOLDER_ID` está correto
   - Deve apontar para a pasta contendo os arquivos PNG das figurinhas
3. Clicar no ▶ (Play) ao lado de `reconciliarFigurinhas`
4. Esperar execução completar (2-5 minutos)

### Executar Reconciliação de Templates:

1. Na função `reconciliarTemplates()`, verificar se `TEMPLATE_FOLDER_ID` está correto
   - Deve apontar para a pasta contendo os templates (arquivos PNG)
2. Clicar no ▶ ao lado de `reconciliarTemplates`
3. Esperar execução completar (2-5 minutos)
   - Isso aplicará compartilhamento público a todos os arquivos

## 6. Testar a Aplicação

### Acessar o WebApp:

1. No Google Apps Script, clicar em "Deployment" no topo
2. Clicar no link da URL gerada (ex: `https://script.google.com/macros/d/.../usercodeappid`)
3. Fazer login com uma conta de agência

### Verificar Funcionalidades:

- [ ] **Página carrega**: Álbum visível sem erros de imagem em branco
- [ ] **Navegação**: Botões "Capa" → Agências (A-Z) → Comissão Técnica → Contracapa
- [ ] **Sua agência marcada**: Mostra "— SUA AGÊNCIA" quando logado
- [ ] **Drag-and-drop**: Clicar em figurinha do inventário e arrastar para slot
- [ ] **Scroll horizontal**: Setas ‹ › funcionam para scroll do inventário
- [ ] **Pacote**: Clicar em "Rasgar Pacote" sorteia 5 figurinhas aleatórias
- [ ] **Duplicatas**: Se tiver 2+ da mesma, mostra "REPETIDA" no inventário
- [ ] **Troca de repetidas**: Com 5+ duplicatas, botão "Trocar repetidas" aparece

## 7. Correções Aplicadas

### CSS de Overflow (Photo Clipping)
Todas as imagens coladas são recortadas dentro do slot com `overflow: hidden`:
```css
.figurinha-colada {
  overflow: hidden;
}
.figurinha-colada img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### Coordenadas de Slots
Coordenadas corrigidas para 5 páginas (12 slots total):
- Slot 06 (Comissão Técnica): y=261, altura=345 → y=214, altura=392
- Múltiplos slots em outras páginas ajustados após investigação visual

### Scroll Horizontal no Inventário
Arrow buttons (‹ ›) implementados com:
```javascript
const distancia = 200; // pixels
inventarioDiv.scrollBy({ left: -distancia, behavior: 'smooth' });
```

### Troca de Figurinhas Repetidas
Função `trocarRepetidas()` troca 5+ duplicatas por sorteio do pool global:
```javascript
trocarRepetidas() {
  const minimo = 5;
  const indicesRepetidos = obterIndicesRepetidos();
  if (indicesRepetidos.size >= minimo) {
    // Remove as repetidas do inventário
    // Sorteia novos números do pool global
  }
}
```

## 8. Troubleshooting

### Imagens em branco
- [ ] Verificar se `garantirCompartilhamentoPublico()` foi executado
- [ ] Confirmar que PNGs estão compartilhados como "Qualquer pessoa com o link"
- [ ] Executar `reconciliarTemplates()` novamente

### Slots fora de posição
- [ ] Validar `slotMap.json`: `python3 scripts/validate_slot_map.py`
- [ ] Se houver erro, regenerar: `python3 scripts/generate_slot_map.py`
- [ ] Fazer upload do novo `slotMap.json` em `src/config/`

### Pacote sorteando números duplicados
- [ ] Pool pode conter números da agência que já foram colados
- [ ] Isto é esperado - o usuário pode não completar outras agências
- [ ] Se quiser filtro rigoroso, editar `construirPoolGlobal()` em `codigo.gs`

## 9. Manutenção

### Adicionar nova agência
1. Adicionar entrada em `POOL_POR_AGENCIA` em `codigo.gs`
2. Adicionar template PNG à pasta de templates
3. Regenerar `slotMap.json`: `python3 scripts/generate_slot_map.py`
4. Validar: `python3 scripts/validate_slot_map.py`

### Atualizar mapeamento de slots
1. Editar coordenadas em `scripts/generate_slot_map.py` (variável `EXPECTED_RANGES`)
2. Regenerar: `python3 scripts/generate_slot_map.py`
3. Validar: `python3 scripts/validate_slot_map.py`
4. Copiar novo `slotMap.json` para `src/config/`

---

**Última atualização**: 2026-08-03
**Branch**: `claude/album-copa-review-6jtvph`
