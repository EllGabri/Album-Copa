# Album Copa - Sistema de Álbum Digital

Aplicação web para gerenciamento de álbum digital de figurinhas da Copa do Mundo, com 15 agências e Comissão Técnica.

## Estrutura do Projeto

```
Album-Copa/
├── src/
│   ├── webapp/              # Código-fonte da aplicação web
│   │   ├── Album.html       # Interface principal do álbum
│   │   ├── Index.html       # Página de entrada (login)
│   │   ├── SlotMap.html     # Mapeamento gerado de slots
│   │   └── codigo.gs        # Backend em Google Apps Script
│   └── config/
│       └── slotMap.json     # Configuração de coordenadas dos slots
├── scripts/                 # Scripts Python para validação/geração
│   ├── generate_slot_map.py # Gera slotMap.json a partir dos templates
│   └── validate_slot_map.py # Valida integridade do slotMap.json
├── assets/                  # Recursos da aplicação
│   └── templates/           # (Referência) Templates dos álbuns das agências
├── reference/               # Documentação de referência
└── .gitignore              # Configuração Git
```

## Componentes Principais

### `src/webapp/`
Código-fonte da aplicação web rodando em Google Apps Script:

- **Album.html** (2000+ linhas)
  - Interface principal do álbum
  - Renderização de slots com drag-and-drop
  - Inventário com scroll horizontal
  - Sistema de pacotes e troca de figurinhas
  - Detecção de duplicatas

- **Index.html**
  - Página de entrada com login
  - Autenticação via Google

- **SlotMap.html**
  - Gerado automaticamente
  - Contém mapeamento de slots em JSON

- **codigo.gs**
  - Backend em Google Apps Script
  - Integração com Google Drive
  - Reconciliação de figurinhas
  - Lógica de pool de sorteio global

### `src/config/`
- **slotMap.json**: Mapeamento de coordenadas (x, y, largura, altura) para cada slot de cada template (19 agências/comissão)

### `scripts/`
- **generate_slot_map.py**: Gera `slotMap.json` a partir de coordenadas dos templates
- **validate_slot_map.py**: Valida integridade do mapeamento (numeração, duplicatas)

## Aplicação das Correções

### Para atualizar o WebApp no Google Apps Script:

1. **Copiar código da aplicação**:
   ```bash
   # Arquivo principal do backend
   cat src/webapp/codigo.gs
   
   # Arquivos HTML da interface
   cat src/webapp/Album.html
   cat src/webapp/Index.html
   ```

2. **Colar no editor do Apps Script**:
   - Abrir `https://script.google.com`
   - Colar `codigo.gs` no arquivo `codigo.gs` do projeto
   - Colar `Album.html` em um arquivo HTML com o mesmo nome
   - Colar `Index.html` em um arquivo HTML com o mesmo nome
   - Salvar e fazer deploy

3. **Executar funções de reconciliação**:
   - Rodar `reconciliarFigurinhas()` com `FIGURINHAS_FOLDER_ID` correto
   - Rodar `reconciliarTemplates()` para aplicar compartilhamento público
   - Testar no navegador: login, navegação entre agências, drag-and-drop

### Validação local

```bash
# Validar integridade do slotMap.json
python3 scripts/validate_slot_map.py

# Gerar novo slotMap.json (se necessário)
python3 scripts/generate_slot_map.py
```

## Recursos Implementados

- ✅ Mapeamento de coordenadas para 19 templates (15 agências + Comissão Técnica)
- ✅ Drag-and-drop de figurinhas com clique e posicionamento em slots
- ✅ Sistema de inventário com scroll horizontal
- ✅ Pacotes com sorteio aleatório do pool global (161 números)
- ✅ Detecção de figurinhas duplicadas (2+ cópias da mesma)
- ✅ Troca de repetidas: 5+ duplicatas por sorteio aleatório
- ✅ Renderização responsiva com Tailwind CSS
- ✅ Integração com Google Drive para armazenamento

## Branches

- `main`: Branch principal (production)
- `claude/album-copa-review-6jtvph`: Branch de desenvolvimento com últimas correções
- `backup/before-cleanup`: Backup de código antigo e documentação removida

## Contato / Manutenção

Aplicação mantida para Album Copa do Mundo.
