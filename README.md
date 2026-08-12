# Album Copa - Sistema de Álbum Digital + Copa Excelência

Aplicação web para gerenciamento de álbum digital de figurinhas (15 agências + Comissão Técnica) e dashboard da campanha "Copa Excelência de Negócios" (Jun-Ago 2026), rodando como Web App do Google Apps Script vinculado à planilha de produção.

## Estrutura do Projeto

```
Album-Copa/
├── src/
│   ├── webapp/              # Código-fonte ATUAL (o que roda em produção)
│   │   ├── Album.html       # Interface do álbum de figurinhas
│   │   ├── Index.html       # Dashboard da Copa Excelência
│   │   ├── SlotMap.html     # Mapeamento de slots do álbum
│   │   └── codigo.gs        # Backend (Google Apps Script)
│   └── config/
│       └── slotMap.json     # Coordenadas dos slots de cada template
├── backup/
│   └── webapp/               # Versão ANTERIOR de src/webapp/, para consulta/rollback rápido
└── .gitignore
```

## Convenção de Backup

Este repositório **não está conectado** ao Apps Script/planilha em produção — todo código aqui precisa ser copiado manualmente para lá (ver seção abaixo). Por isso, sempre que `src/webapp/` é alterado:

1. A versão anterior de cada arquivo alterado é copiada para `backup/webapp/` (sobrescrevendo o que já estava lá).
2. A versão nova fica em `src/webapp/`, como sempre.

`backup/webapp/` guarda sempre **um único snapshot**: o estado imediatamente anterior à última mudança — não é um histórico completo (isso o `git log`/`git show` já cobre). Serve para comparar rapidamente "o que era antes vs. o que é agora" sem precisar rodar comandos git, direto pela interface do GitHub.

## Componentes Principais

### `src/webapp/`
- **Index.html** — Dashboard público da Copa Excelência: rankings de gerentes/agências por grupo, Comissão Técnica (Duelo de Técnicos + Auxiliares), pódio e premiações. Lê os dados direto das abas `Store_*` e `Configuracoes_Dashboard` via `codigo.gs` e recalcula tudo em JavaScript a cada carregamento.
- **Album.html** — Interface do álbum de figurinhas: drag-and-drop, inventário, pacotes, detecção de duplicatas.
- **SlotMap.html** — Mapeamento gerado de slots (gerado a partir de `src/config/slotMap.json`).
- **codigo.gs** — Backend: leitura das abas `Store_*`/`Configuracoes_Dashboard`, integração com Google Drive, reconciliação de figurinhas/templates, distribuição de pacotes.

### `src/config/`
- **slotMap.json** — coordenadas (x, y, largura, altura) de cada slot, por template (19 agências/comissão).

## Aplicação das Correções (Apps Script)

1. Abrir `https://script.google.com` no projeto vinculado à planilha.
2. Para cada arquivo que mudou em `src/webapp/`, selecionar todo o conteúdo do arquivo correspondente no editor e colar por cima (substituição total).
3. Salvar e implantar nova versão (Implantar → Gerenciar implantações → editar → Nova versão).
4. Se `codigo.gs` mudou e envolve figurinhas/templates: rodar `reconciliarFigurinhas()` / `reconciliarTemplates()` pelo menu da planilha.

## Branches

- `main` — branch principal (production).

## Contato / Manutenção

Aplicação mantida para a Copa Excelência / Album Copa.
