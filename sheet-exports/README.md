# Exports de abas do Google Sheets

Arquivos `.html`/`.css` nesta pasta são **exports estáticos de abas da planilha
"Copa Excelência"** (formato de exportação nativo do Google Sheets — note o
`resources/sheet.css` e as classes `.ritz`/`.waffle` no HTML), usados como
snapshot/referência local. **Não fazem parte do código-fonte do WebApp** — o
`codigo.gs` (em `../apps-script/`) lê os dados ao vivo da planilha real via
`SpreadsheetApp`, nunca destes arquivos.
