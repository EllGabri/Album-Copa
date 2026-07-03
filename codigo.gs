/**
 * BACKEND - COPA EXCELÊNCIA CRESOL PLANALTO SUL
 * Motor com integração Qlik, leitura de Stores e exclusões de gerentes.
 * Versão 2.0: Validações robustas, sem poluição de código
 */

var SPREADSHEET_ID = ""; // Deixe vazio se o script estiver vinculado à planilha "Copa Excelência"
var FIGURINHAS_FOLDER_ID = ""; // ID da pasta do Drive com os PNGs das figurinhas (preencher antes de usar "Reconciliar Figurinhas do Drive")
var TEMPLATES_FOLDER_ID = ""; // ID da pasta do Drive com os PNGs de "TEMPLATE - ALBUM/" (preencher antes de usar "Reconciliar Templates do Drive")

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🔄 Integração Qlik')
    .addItem('Sincronizar Dados da Copa Agora', 'forcarSincronizacaoPlanilhaPeloMenu')
    .addSeparator()
    .addItem('📦 Distribuir Pacotes (1 por agência)', 'distribuirUmPacote')
    .addItem('🎫 Distribuir 5 Pacotes (teste)', 'distribuir5Pacotes')
    .addSeparator()
    .addItem('🧩 Reconciliar Figurinhas do Drive', 'reconciliarFigurinhasPeloMenu')
    .addItem('🖼️ Reconciliar Templates do Drive', 'reconciliarTemplatesPeloMenu')
    .addSeparator()
    .addItem('⏰ Ativar Liberação Semanal (Sexta-feira)', 'configurarGatilhoSemanal')
    .addItem('⏸️ Desativar Liberação Semanal', 'removerGatilhoSemanal')
    .addToUi();
}

// ROTEADOR SEGURO
function doGet(e) {
  var pagina = (e && e.parameter && e.parameter.pagina) ? e.parameter.pagina : 'Index';
  return HtmlService.createTemplateFromFile(pagina)
    .evaluate()
    .setTitle('🏆 Copa Excelência - Cresol Planalto Sul')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

/**
 * Helper para incluir outro arquivo HTML do projeto via scriptlet
 * (`<?!= include('NomeDoArquivo'); ?>`). Usado para embutir slotMap.json
 * (arquivo "SlotMap.html") diretamente no HTML servido, sem exigir uma
 * chamada extra de google.script.run no cliente.
 */
function include(nomeArquivo) {
  return HtmlService.createHtmlOutputFromFile(nomeArquivo).getContent();
}

function obterDadosCompletos() {
  var diagnostico = { planilhaEncontrada: false, abasDisponiveisNaPlanilha: [], errosAbas: {} };
  
  try {
    var spread = (SPREADSHEET_ID && SPREADSHEET_ID !== "") ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    if (!spread) return JSON.stringify({ status: "error_setup", message: "Planilha não encontrada." });
    
    diagnostico.planilhaEncontrada = true;
    var allSheets = spread.getSheets();
    diagnostico.abasDisponiveisNaPlanilha = allSheets.map(function(s) { return s.getName(); });
    
    var configSheet = null;
    var usuariosExcluidos = [];
    var tabelaPontuacao = {};
    var tabelaTecnicos = {};

    for (var i = 0; i < allSheets.length; i++) {
      var sheetName = allSheets[i].getName().toLowerCase().trim();
      if (sheetName === "configurações_dashboard" || sheetName === "configuracoes_dashboard") {
        configSheet = allSheets[i];
        break;
      }
    }
    
    if (configSheet) {
      try {
        // LER EXCLUSÕES (Coluna A)
        var excValues = configSheet.getRange("A1:A15").getValues();
        for (var i = 0; i < excValues.length; i++) {
          var exc = excValues[i][0];
          if (exc && exc.toString().trim() !== "") {
            usuariosExcluidos.push(exc.toString().trim());
          }
        }
        
        // LER TABELA DE PONTUAÇÃO (Colunas C e D)
        var pontuacaoValues = configSheet.getRange("C2:D15").getValues();
        for (var i = 0; i < pontuacaoValues.length; i++) {
          var indicador = pontuacaoValues[i][0];
          var gols = pontuacaoValues[i][1];
          if (indicador && indicador.toString().trim() !== "" && indicador.toString().trim() !== "NS") {
            tabelaPontuacao[indicador.toString().trim()] = parseFloat(gols) || 0;
          }
        }
        
        // LER TABELA DE TÉCNICOS (Colunas L, M, N)
        var tecnicosValues = configSheet.getRange("L2:N15").getValues();
        for (var i = 0; i < tecnicosValues.length; i++) {
          var agencia = tecnicosValues[i][0];
          var tecnico = tecnicosValues[i][1];
          var chaveamento = tecnicosValues[i][2];
          if (agencia && tecnico && tecnico.toString().trim() !== "") {
            tabelaTecnicos[agencia.toString().trim()] = {
              tecnico: tecnico.toString().trim(),
              chaveamento: chaveamento ? chaveamento.toString().trim() : ""
            };
          }
        }
      } catch(e) {
        diagnostico.errosAbas["Config"] = "Falha ao ler configurações.";
      }
    }

    var agencias = lerDadosDeAbaFlexivel(spread, "Store_Agencia", diagnostico);
    var gerentes = lerDadosDeAbaFlexivel(spread, "Store_Gerente", diagnostico);
    var carteiras = lerDadosDeAbaFlexivel(spread, "Store_Carteira", diagnostico);
    
    if (agencias.length === 0 && gerentes.length === 0) {
      return JSON.stringify({ status: "diagnostic", message: "As abas 'Store_' estão vazias.", diagnostico: diagnostico });
    }
    
    return JSON.stringify({ 
      status: "ok", 
      data: {
        usuariosExcluidos: usuariosExcluidos,
        agencias: agencias,
        gerentes: gerentes,
        carteiras: carteiras,
        tabelaPontuacao: tabelaPontuacao,
        tabelaTecnicos: tabelaTecnicos,
        webAppUrl: ScriptApp.getService().getUrl()
      } 
    });
    
  } catch (error) {
    return JSON.stringify({ status: "error", message: error.toString(), diagnostico: diagnostico });
  }
}

function lerDadosDeAbaFlexivel(spread, nomeProcurado, diagnostico) {
  try {
    var sheets = spread.getSheets();
    var sheetReal = null;
    var nomeProcuradoLimpo = nomeProcurado.toString().toLowerCase().trim();
    
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].getName().toString().toLowerCase().trim() === nomeProcuradoLimpo) {
        sheetReal = sheets[i];
        break;
      }
    }
    
    if (!sheetReal) {
      diagnostico.errosAbas[nomeProcurado] = "Aba não encontrada.";
      return [];
    }
    
    var range = sheetReal.getDataRange();
    var values = range.getValues();
    if (values.length <= 1) return [];
    
    var headers = values[0].map(function(h) { return h ? h.toString().trim() : ""; });
    var records = [];
    
    for (var r = 1; r < values.length; r++) {
      var row = values[r];
      var item = {};
      var temDados = false;
      
      for (var c = 0; c < headers.length; c++) {
        if (headers[c]) {
          var val = row[c];
          if (Object.prototype.toString.call(val) === '[object Date]') {
            var dia = ("0" + val.getDate()).slice(-2);
            var mes = ("0" + (val.getMonth() + 1)).slice(-2);
            var ano = val.getFullYear();
            val = dia + "/" + mes + "/" + ano;
          } else if (val !== null && typeof val === 'object') {
            val = val.toString();
          }
          item[headers[c]] = val !== undefined ? val : "";
          if (val !== "") temDados = true;
        }
      }
      if (temDados) records.push(item);
    }
    return records;
  } catch (e) {
    return [];
  }
}

function forcarSincronizacaoPlanilhaPeloMenu() {
  var ui = SpreadsheetApp.getUi();
  var resposta = forcarSincronizacaoPlanilha();
  if (resposta.status === "success") {
    ui.alert("Sincronização Concluída", "Relatório da Copa:\n\n" + resposta.log.replace(/ \| /g, "\n"), ui.ButtonSet.OK);
  } else {
    ui.alert("Erro na Sincronização", resposta.message, ui.ButtonSet.OK);
  }
}

function forcarSincronizacaoPlanilha() {
  try {
    var folderId = "1HrSNNoAAQyOJVb5h0_nsJYDDKRazC9ew"; 
    var spread = (SPREADSHEET_ID && SPREADSHEET_ID !== "") ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    if (!spread) return { status: "error", message: "Planilha não encontrada." };
    
    var folder = DriveApp.getFolderById(folderId);
    var csvFilesTarget = ["Store_Cooperativa", "Store_Agencia", "Store_Gerente", "Store_Carteira"];
    var logs = [];

    for (var i = 0; i < csvFilesTarget.length; i++) {
      var baseName = csvFilesTarget[i];
      var allFiles = folder.getFiles();
      
      var ficheiroMaisRecente = null;
      var dataMaisRecente = 0;

      while (allFiles.hasNext()) {
        var f = allFiles.next();
        var fName = f.getName().toLowerCase();
        if (fName.indexOf(baseName.toLowerCase()) !== -1) {
          var time = f.getLastUpdated().getTime();
          if (time > dataMaisRecente) {
            dataMaisRecente = time;
            ficheiroMaisRecente = f;
          }
        }
      }

      if (ficheiroMaisRecente) {
        var blob = ficheiroMaisRecente.getBlob();
        var csvContent = blob.getDataAsString("UTF-8");
        
        if (csvContent.charCodeAt(0) === 0xFEFF) {
          csvContent = csvContent.substring(1);
        } else if (csvContent.startsWith('ï»¿')) {
          csvContent = csvContent.substring(3);
        }
        
        var primeiraLinha = csvContent.split(/\r?\n/)[0] || "";
        var delimitador = ',';
        if (primeiraLinha.indexOf(';') !== -1) delimitador = ';';
        else if (primeiraLinha.indexOf('\t') !== -1) delimitador = '\t';

        var csvData = Utilities.parseCsv(csvContent, delimitador);
        
        if (csvData && csvData.length > 0) {
          var sheet = null;
          var sheets = spread.getSheets();
          for (var j = 0; j < sheets.length; j++) {
            if (sheets[j].getName().toLowerCase().trim() === baseName.toLowerCase()) {
              sheet = sheets[j];
              break;
            }
          }
          if (!sheet) sheet = spread.insertSheet(baseName);
          
          sheet.clearContents();
          sheet.clearFormats(); 
          
          var maxR = sheet.getMaxRows();
          var maxC = sheet.getMaxColumns();
          if (maxR > 0 && maxC > 0) {
            sheet.getRange(1, 1, maxR, maxC).clearDataValidations();
          }
          
          var maxCols = 0;
          for(var r=0; r<csvData.length; r++) {
            if(csvData[r].length > maxCols) maxCols = csvData[r].length;
          }
          
          var cleanData = csvData.map(function(row) {
             var newRow = row.slice(0);
             while (newRow.length < maxCols) newRow.push("");
             return newRow;
          });
          
          sheet.getRange(1, 1, cleanData.length, maxCols).setValues(cleanData);
          logs.push(baseName + ": Importadas " + cleanData.length + " linhas");
        } else {
          logs.push(baseName + ": Vazio.");
        }
      } else {
        logs.push(baseName + ": Não encontrado.");
      }
    }
    return { status: "success", log: logs.join(" | ") };
  } catch (e) {
    return { status: "error", message: e.toString() };
  }
}

// ============================================================
// MOTOR DO ÁLBUM VIRTUAL — Funções de Gestão do Álbum
// ============================================================

function obterDadosAlbum(agencia, pin) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const storeAlbum = ss.getSheetByName("Store_Album");
    
    if (!storeAlbum) {
      return JSON.stringify({ status: "error", message: "Aba Store_Album não encontrada" });
    }

    const dados = storeAlbum.getDataRange().getValues();
    let agenciaRow = null;

    // Procurar pela agência e validar PIN
    for (let i = 1; i < dados.length; i++) {
      const nomeAg = (dados[i][0] || "").toString().trim();
      const pinSalvo = (dados[i][1] || "").toString().trim();
      
      if (nomeAg === agencia && pinSalvo === pin) {
        agenciaRow = { index: i, data: dados[i] };
        break;
      }
    }

    if (!agenciaRow) {
      return JSON.stringify({ status: "error", message: "Agência ou PIN inválido" });
    }

    // Coluna C = Pacotinhos, D = Inventario (JSON), E = Coladas (JSON)
    const pacotinhos = parseInt(agenciaRow.data[2] || 0);
    let inventario = [];
    let coladas = [];

    try {
      if (agenciaRow.data[3]) {
        inventario = JSON.parse(agenciaRow.data[3]);
      }
    } catch (e) {
      console.log("Inventário vazio ou inválido");
    }

    try {
      if (agenciaRow.data[4]) {
        coladas = JSON.parse(agenciaRow.data[4]);
      }
    } catch (e) {
      console.log("Coladas vazio ou inválido");
    }

    return JSON.stringify({
      status: "success",
      data: {
        agencia: agencia,
        pacotinhos: pacotinhos,
        inventario: inventario || [],
        coladas: coladas || []
      }
    });

  } catch (erro) {
    console.error("Erro ao obter dados do álbum:", erro);
    return JSON.stringify({ status: "error", message: "Erro no servidor" });
  }
}

function gerarPacotinho(agencia) {
  try {
    // Obter todas as figurinhas da base (Store_Gerente)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const storeGerente = ss.getSheetByName("Store_Gerente");
    
    if (!storeGerente) {
      return JSON.stringify({ status: "error", message: "Aba Store_Gerente não encontrada" });
    }

    const dados = storeGerente.getDataRange().getValues();
    const exclusoes = obterUsuariosExcluidos();
    let figurinhasDisponiveis = [];

    // Coletar todas as figurinhas (gerentes únicos) da agência
    const jaProcessadas = new Set();
    
    for (let i = 1; i < dados.length; i++) {
      const nomeAg = (dados[i][5] || "").toString().trim(); // Coluna F = nm_agencia
      const gerente = (dados[i][7] || "").toString().trim(); // Coluna H = Gerente
      
      if (nomeAg === agencia && !exclusoes.includes(normalizarString(gerente))) {
        const idUnico = normalizarString(agencia) + "_" + normalizarString(gerente);
        
        if (!jaProcessadas.has(idUnico)) {
          figurinhasDisponiveis.push(idUnico);
          jaProcessadas.add(idUnico);
        }
      }
    }

    if (figurinhasDisponiveis.length === 0) {
      return JSON.stringify({ status: "error", message: "Nenhuma figurinha disponível" });
    }

    // Gerar 12-13 figurinhas aleatórias (sem repetir dentro do pacote)
    const tamanho = Math.floor(Math.random() * 2) + 12; // 12 ou 13
    const pacote = [];
    const usadas = new Set();

    for (let i = 0; i < tamanho && usadas.size < figurinhasDisponiveis.length; i++) {
      let idx;
      do {
        idx = Math.floor(Math.random() * figurinhasDisponiveis.length);
      } while (usadas.has(idx));
      
      pacote.push(figurinhasDisponiveis[idx]);
      usadas.add(idx);
    }

    return JSON.stringify({
      status: "success",
      data: pacote
    });

  } catch (erro) {
    console.error("Erro ao gerar pacotinho:", erro);
    return JSON.stringify({ status: "error", message: "Erro ao gerar pacote" });
  }
}

function salvarProgressoAlbum(agencia, pacotes, inventario, coladas) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const storeAlbum = ss.getSheetByName("Store_Album");
    
    if (!storeAlbum) {
      console.error("Aba Store_Album não encontrada");
      return;
    }

    const dados = storeAlbum.getDataRange().getValues();
    
    for (let i = 1; i < dados.length; i++) {
      const nomeAg = (dados[i][0] || "").toString().trim();
      
      if (nomeAg === agencia) {
        // Coluna C = Pacotinhos, D = Inventario (JSON), E = Coladas (JSON)
        const updates = [
          [i + 1, 3, parseInt(pacotes) || 0], // Pacotinhos
          [i + 1, 4, JSON.stringify(inventario || [])], // Inventario
          [i + 1, 5, JSON.stringify(coladas || [])] // Coladas
        ];

        for (const upd of updates) {
          const range = storeAlbum.getRange(upd[0], upd[1]);
          range.setValue(upd[2]);
        }
        
        console.log(`Progresso do álbum de ${agencia} salvo com sucesso`);
        return;
      }
    }
    
    console.error("Agência não encontrada em Store_Album");

  } catch (erro) {
    console.error("Erro ao salvar progresso do álbum:", erro);
  }
}

function validarLoginAlbum(agencia, pin) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const storeAlbum = ss.getSheetByName("Store_Album");
    
    if (!storeAlbum) {
      return JSON.stringify({ status: "error", message: "Aba não encontrada" });
    }

    const dados = storeAlbum.getDataRange().getValues();
    
    for (let i = 1; i < dados.length; i++) {
      const nomeAg = (dados[i][0] || "").toString().trim();
      const pinSalvo = (dados[i][1] || "").toString().trim();
      
      if (nomeAg === agencia && pinSalvo === pin) {
        // PIN correto, retornar dados
        let pacotinhos = parseInt(dados[i][2] || 0);
        let inventario = [];
        let coladas = [];

        try {
          if (dados[i][3]) inventario = JSON.parse(dados[i][3]);
        } catch (e) {}

        try {
          if (dados[i][4]) coladas = JSON.parse(dados[i][4]);
        } catch (e) {}

        return JSON.stringify({
          status: "success",
          data: {
            agencia: agencia,
            pacotinhos: pacotinhos,
            inventario: inventario,
            coladas: coladas
          }
        });
      }
    }

    return JSON.stringify({ status: "error", message: "Agência ou PIN inválido" });

  } catch (erro) {
    console.error("Erro ao validar login:", erro);
    return JSON.stringify({ status: "error", message: "Erro no servidor" });
  }
}

function normalizarString(str) {
  if (!str) return "";
  return str.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function obterUsuariosExcluidos() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const configDash = ss.getSheetByName("Configuracoes_Dashboard");
    
    if (!configDash) return [];
    
    const exclusoes = configDash.getRange("A2:A15").getValues();
    return exclusoes.filter(row => row[0]).map(row => normalizarString(row[0]));
  } catch (e) {
    console.log("Erro ao obter exclusões:", e);
    return [];
  }
}

// ============================================================
// MOTOR DO ÁLBUM — Distribuição de Pacotes (Ajustado)
// ============================================================

function distribuirUmPacote() {
  distribuirPacotinhosPorAgencia(1);
}

function distribuir5Pacotes() {
  distribuirPacotinhosPorAgencia(5);
}

// Última sexta-feira de distribuição automática (inclusive, até o fim do
// dia). Após esta data, o gatilho semanal para de liberar pacotes.
var DATA_LIMITE_DISTRIBUICAO = new Date(2026, 7, 28, 23, 59, 59); // mês 0-indexado: 7 = agosto

/**
 * Chamada pelo trigger semanal (ver configurarGatilhoSemanal). Não usa
 * SpreadsheetApp.getUi() porque triggers instaláveis rodam sem UI.
 */
function distribuirPacoteSemanalAutomatico() {
  var hoje = new Date();
  if (hoje > DATA_LIMITE_DISTRIBUICAO) {
    Logger.log("Distribuição semanal automática encerrada: data-limite (28/08/2026) já passou.");
    return;
  }
  distribuirPacotinhosPorAgenciaSemUi(1);
}

/**
 * Ativa o gatilho semanal (toda sexta-feira, ~08h) que libera 1 pacote por
 * agência automaticamente até DATA_LIMITE_DISTRIBUICAO. Idempotente: remove
 * qualquer gatilho anterior do mesmo tipo antes de criar um novo.
 */
function configurarGatilhoSemanal() {
  removerGatilhoSemanal();
  ScriptApp.newTrigger('distribuirPacoteSemanalAutomatico')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.FRIDAY)
    .atHour(8)
    .create();
  SpreadsheetApp.getUi().alert(
    "⏰ Liberação semanal ativada",
    "Pacotes serão distribuídos automaticamente toda sexta-feira (~08h) até 28/08/2026.",
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Remove todo(s) gatilho(s) de distribuição semanal automática já
 * instalado(s). Chamado no início de configurarGatilhoSemanal() para evitar
 * duplicar acionadores, e disponível como item de menu separado para
 * desativar a automação.
 */
function removerGatilhoSemanal() {
  var triggers = ScriptApp.getProjectTriggers();
  var removidos = 0;
  triggers.forEach(function (t) {
    if (t.getHandlerFunction() === 'distribuirPacoteSemanalAutomatico') {
      ScriptApp.deleteTrigger(t);
      removidos++;
    }
  });
  if (removidos > 0) {
    Logger.log("Removido(s) " + removidos + " acionador(es) de distribuição semanal.");
  }
  return removidos;
}

/**
 * Núcleo da distribuição de pacotes, sem nenhuma chamada de UI - pode ser
 * chamado tanto pelo menu manual quanto por um trigger instalável (triggers
 * não têm SpreadsheetApp.getUi() disponível e lançariam erro se chamado).
 */
function distribuirPacotinhosPorAgenciaSemUi(quantidade = 1) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const storeAlbum = ss.getSheetByName("Store_Album");

  if (!storeAlbum) {
    Logger.log("❌ Aba Store_Album não encontrada");
    return { sucesso: false, atualizadas: 0 };
  }

  const dados = storeAlbum.getDataRange().getValues();
  let atualizadas = 0;

  Logger.log(`\n📦 Iniciando distribuição de ${quantidade} pacote(s)...`);
  Logger.log(`Total de linhas: ${dados.length}`);

  // Iterar pelas agências (linha 2 em diante, pulando header)
  for (let i = 1; i < dados.length; i++) {
    const nomeAgencia = (dados[i][0] || "").toString().trim();

    if (nomeAgencia && nomeAgencia !== "") {
      // Coluna C = Pacotinhos (índice 2)
      const range = storeAlbum.getRange(i + 1, 3);
      range.setValue(quantidade);
      atualizadas++;

      Logger.log(`✓ Linha ${i + 1} - ${nomeAgencia}: ${quantidade} pacote(s)`);
    }
  }

  Logger.log(`\n✅ Total de agências atualizadas: ${atualizadas}`);
  return { sucesso: true, atualizadas: atualizadas };
}

/**
 * Wrapper com UI, usado pelo menu manual (distribuirUmPacote, distribuir5Pacotes).
 */
function distribuirPacotinhosPorAgencia(quantidade = 1) {
  try {
    const resultado = distribuirPacotinhosPorAgenciaSemUi(quantidade);
    if (!resultado.sucesso) {
      SpreadsheetApp.getUi().alert("❌ Erro: Aba Store_Album não encontrada");
      return false;
    }
    SpreadsheetApp.getUi().alert(`✅ ${resultado.atualizadas} agências receberam ${quantidade} pacote(s)!`);
    return true;
  } catch (erro) {
    Logger.log("❌ Erro ao distribuir pacotes: " + erro);
    SpreadsheetApp.getUi().alert("❌ Erro: " + erro.message);
    return false;
  }
}

// Função de debug: verificar conteúdo de Store_Album
function debugStoreAlbum() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const storeAlbum = ss.getSheetByName("Store_Album");
  const dados = storeAlbum.getDataRange().getValues();
  
  Logger.log("=== STORE_ALBUM DEBUG ===");
  Logger.log("Header:", dados[0]);
  Logger.log("\nPrimeiras 5 agências:");
  for (let i = 1; i < Math.min(6, dados.length); i++) {
    Logger.log(`Linha ${i + 1}: Agência="${dados[i][0]}" | PIN="${dados[i][1]}" | Pacotes="${dados[i][2]}" | Inv="${dados[i][3]?.substring(0, 50)}..."`);
  }
}

// Função auxiliar: mapear figurinha (gerente) → imagem do Drive
function encontrarImagemFigurinha(nomeGerente, agencia, listaFigurinhas) {
  // Normalizar nome do gerente para buscar na pasta
  const nomeNormalizando = normalizarString(nomeGerente);
  
  // Procurar arquivo que contenha o nome do gerente
  for (let fig of listaFigurinhas) {
    if (normalizarString(fig.nome).includes(nomeNormalizando)) {
      return fig.url;
    }
  }
  
  // Sem imagem específica → placeholder
  return null;
}

// Pool GLOBAL de figurinhas colecionáveis por QUALQUER agência (página
// "Comissão Técnica", slots 1-10). Não pertence a nenhuma chave de
// obterSlotsPorAgencia() - é somado ao pool próprio da agência no sorteio
// do pacote (ver gerarPacotinho / rasgarPacote no frontend).
var SLOTS_COMISSAO_TECNICA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Mapeamento fixo: Agência → Números de Slots do Álbum
// NOTA: "Pac São Joaquim" é uma única agência/login/PIN (pool 11-28), mesmo
// sendo exibida em 2 páginas de template (Pac Sao Joaquim I e II) - não
// dividir esta chave.
function obterSlotsPorAgencia(agencia) {
  const mappings = {
    "Pac Bela Vista Do Toldo": [147, 148, 149, 150, 151, 152, 153, 154, 155],
    "Pac São Joaquim": [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 25, 26, 27, 28, 23, 24],
    "Pac Canoinhas": [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41],
    "Pac Lages": [42, 43, 44, 45, 46, 47, 48, 49, 50, 51],
    "Pac Lages Ii": [52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62],
    "Pac Porto União": [63, 64, 65, 66, 67, 68, 69, 70, 71, 72],
    "Pac Otacilio Costa": [73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83],
    "Pac Correia Pinto": [84, 85, 86, 87, 88, 89, 90, 91, 92],
    "Pac Irineópolis": [93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104],
    "Pac Major Vieira": [105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115],
    "Pac Bom Jardim Da Serra": [116, 117, 118, 119, 120, 121, 122],
    "Pac Timbó Grande": [123, 124, 125, 126, 127, 128, 129, 130],
    "Pac Monte Castelo": [131, 132, 133, 134, 135, 136, 137, 138],
    "Pac Ponte Alta": [139, 140, 141, 142, 143, 144, 145, 146],
    "Pac Santa Cruz Do Timbo": [156, 157, 158, 159, 160, 161, 162]
  };

  return mappings[agencia] || [];
}

// ============================================================
// FIM DO ARQUIVO ORIGINAL (obterSlotsPorAgencia etc. preservados)
// ============================================================

/**
 * Fornece lista de figurinhas da aba "Figurinhas" com URLs de imagem
 * construídas a partir do File ID (Coluna D). Usado pelo Álbum Virtual para
 * exibir as fotos reais sem varrer pasta do Drive.
 * O "id" de cada figurinha é o NÚMERO DO SLOT (Coluna A), a mesma numeração
 * usada nos templates do Canva e em obterSlotsPorAgencia()/SLOTS_COMISSAO_TECNICA.
 * Retorna todas as figurinhas; o frontend filtra por número de slot.
 */
function obterFigurinhusDoAlbum(agencia) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const figSheet = ss.getSheetByName("Figurinhas");

    if (!figSheet) {
      return JSON.stringify({ status: "error", message: "Aba Figurinhas não encontrada" });
    }

    const dados = figSheet.getDataRange().getValues();
    if (dados.length <= 1) {
      return JSON.stringify({ status: "success", figurinhas: [] });
    }

    const figurinhas = [];
    for (let i = 1; i < dados.length; i++) {
      const row = dados[i];
      const idPlan = row[0];                                  // Col A - numero do slot
      const nome = (row[1] || "").toString().trim();          // Col B - Nome
      const equipe = (row[2] || "").toString().trim();        // Col C - Equipe/página dona
      const fileId = (row[3] || "").toString().trim();        // Col D - File ID do Drive

      if (idPlan === "" || idPlan === null || isNaN(idPlan)) continue;

      const numero = parseInt(idPlan, 10);
      const imageUrl = fileId ? `https://drive.google.com/uc?id=${fileId}` : null;

      figurinhas.push({
        id: numero,
        nome: nome,
        agencia: equipe || "Geral",
        fileId: fileId,
        imageUrl: imageUrl
      });
    }

    return JSON.stringify({
      status: "success",
      figurinhas: figurinhas
    });
  } catch (erro) {
    console.error("Erro ao obter figurinhas do álbum:", erro);
    return JSON.stringify({ status: "error", message: "Erro no servidor ao carregar figurinhas" });
  }
}

// ============================================================
// RECONCILIAÇÃO DE FIGURINHAS (Drive → aba "Figurinhas")
// ============================================================

/**
 * Retorna o mapa completo página → lista de números de slot, usado tanto
 * por obterSlotsPorAgencia() (pool de pacotes) quanto para rotular a coluna
 * "Equipe" da aba Figurinhas. Fonte única de verdade para as duas coisas.
 */
function obterMapeamentoCompletoDeSlots() {
  return {
    "Pac Bela Vista Do Toldo": rangeDeNumeros(147, 155),
    "Pac São Joaquim": rangeDeNumeros(11, 28),
    "Pac Canoinhas": rangeDeNumeros(29, 41),
    "Pac Lages": rangeDeNumeros(42, 51),
    "Pac Lages Ii": rangeDeNumeros(52, 62),
    "Pac Porto União": rangeDeNumeros(63, 72),
    "Pac Otacilio Costa": rangeDeNumeros(73, 83),
    "Pac Correia Pinto": rangeDeNumeros(84, 92),
    "Pac Irineópolis": rangeDeNumeros(93, 104),
    "Pac Major Vieira": rangeDeNumeros(105, 115),
    "Pac Bom Jardim Da Serra": rangeDeNumeros(116, 122),
    "Pac Timbó Grande": rangeDeNumeros(123, 130),
    "Pac Monte Castelo": rangeDeNumeros(131, 138),
    "Pac Ponte Alta": rangeDeNumeros(139, 146),
    "Pac Santa Cruz Do Timbo": rangeDeNumeros(156, 162)
  };
}

function rangeDeNumeros(inicio, fim) {
  var arr = [];
  for (var i = inicio; i <= fim; i++) arr.push(i);
  return arr;
}

/**
 * Busca reversa: dado um número de slot, encontra a página/agência dona.
 * Números 1-10 (Comissão Técnica) não pertencem a nenhuma agência - retorna
 * o rótulo fixo "Comissao Tecnica".
 */
function obterAgenciaDoSlot(numero) {
  if (SLOTS_COMISSAO_TECNICA.indexOf(numero) !== -1) return "Comissao Tecnica";
  var mapeamento = obterMapeamentoCompletoDeSlots();
  for (var agencia in mapeamento) {
    if (mapeamento[agencia].indexOf(numero) !== -1) return agencia;
  }
  return "";
}

/**
 * Extrai numero(s) + nome do padrão de nome de arquivo usado na pasta de
 * figurinhas do Drive:
 *  - "101-102.png" / "25_26.png"        -> par sem nome (imagem panorâmica)
 *  - "1.png" .. "10.png"                -> numero único sem nome
 *  - "104- ALANA SOFIA.png" (variações  -> numero único + nome
 *    de separador: "-", "_", espaço, ou nenhum: "64 FERNANDO RABELO")
 * Prefixo opcional "Cópia de " é ignorado.
 * Retorna null se o nome do arquivo não casar com nenhum padrão.
 */
function parseNomeArquivoFigurinha(nomeArquivo) {
  var base = nomeArquivo.replace(/\.png$/i, "");
  base = base.replace(/^C[oó]pia de\s+/i, "").trim();

  var m = base.match(/^(\d+)[-_](\d+)$/);
  if (m) {
    return { tipo: "par", numeros: [parseInt(m[1], 10), parseInt(m[2], 10)], nome: null };
  }

  m = base.match(/^(\d+)$/);
  if (m) {
    return { tipo: "unico-sem-nome", numeros: [parseInt(m[1], 10)], nome: null };
  }

  m = base.match(/^(\d+)[-_\s]+(.+)$/);
  if (m) {
    return { tipo: "unico-com-nome", numeros: [parseInt(m[1], 10)], nome: m[2].trim() };
  }

  return null;
}

/**
 * Varre a pasta do Drive (FIGURINHAS_FOLDER_ID) e popula/atualiza a aba
 * "Figurinhas" (ID | Nome | Equipe | FileID | Info) a partir do padrão de
 * nome de cada arquivo. Idempotente: roda 2x sem duplicar linhas (casa por
 * ID numérico já existente na planilha).
 */
function reconciliarFigurinhas() {
  try {
    if (!FIGURINHAS_FOLDER_ID) {
      return {
        status: "error",
        message: "Configure a constante FIGURINHAS_FOLDER_ID no topo do codigo.gs com o ID da pasta do Drive que contém as figurinhas."
      };
    }

    var spread = (SPREADSHEET_ID && SPREADSHEET_ID !== "") ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    var figSheet = spread.getSheetByName("Figurinhas");
    if (!figSheet) return { status: "error", message: "Aba Figurinhas não encontrada." };

    var folder = DriveApp.getFolderById(FIGURINHAS_FOLDER_ID);
    var arquivos = folder.getFilesByType(MimeType.PNG);

    var registros = {}; // numero -> { nome, fileId }
    var naoParseados = [];

    while (arquivos.hasNext()) {
      var arquivo = arquivos.next();
      var parsed = parseNomeArquivoFigurinha(arquivo.getName());
      if (!parsed) {
        naoParseados.push(arquivo.getName());
        continue;
      }
      var fileId = arquivo.getId();
      parsed.numeros.forEach(function (numero) {
        registros[numero] = { nome: parsed.nome, fileId: fileId };
      });
    }

    var dados = figSheet.getDataRange().getValues();
    var linhaPorId = {}; // numero -> linha (1-based) já existente na planilha

    for (var i = 1; i < dados.length; i++) {
      var idExistente = dados[i][0];
      if (idExistente !== "" && idExistente !== null && !isNaN(idExistente)) {
        linhaPorId[parseInt(idExistente, 10)] = i + 1;
      }
    }

    var numeros = Object.keys(registros).map(function (n) { return parseInt(n, 10); }).sort(function (a, b) { return a - b; });
    var criadas = 0, atualizadas = 0;

    numeros.forEach(function (numero) {
      var reg = registros[numero];
      var equipe = obterAgenciaDoSlot(numero);
      var linha = linhaPorId[numero];
      var infoExistente = linha ? figSheet.getRange(linha, 5).getValue() : "";
      var nomeFinal = reg.nome || infoExistente || "";

      if (linha) {
        figSheet.getRange(linha, 1, 1, 4).setValues([[numero, nomeFinal, equipe, reg.fileId]]);
        atualizadas++;
      } else {
        figSheet.appendRow([numero, nomeFinal, equipe, reg.fileId, ""]);
        criadas++;
      }
    });

    var resumo = "Reconciliação concluída: " + criadas + " criada(s), " + atualizadas + " atualizada(s).";
    if (naoParseados.length > 0) {
      resumo += " " + naoParseados.length + " arquivo(s) não reconhecido(s): " + naoParseados.join(", ");
    }

    return { status: "success", message: resumo, criadas: criadas, atualizadas: atualizadas, naoParseados: naoParseados };
  } catch (e) {
    return { status: "error", message: e.toString() };
  }
}

function reconciliarFigurinhasPeloMenu() {
  var resultado = reconciliarFigurinhas();
  var ui = SpreadsheetApp.getUi();
  if (resultado.status === "success") {
    ui.alert("Reconciliação de Figurinhas", resultado.message, ui.ButtonSet.OK);
  } else {
    ui.alert("Erro na Reconciliação", resultado.message, ui.ButtonSet.OK);
  }
}

// ============================================================
// TEMPLATES DO ÁLBUM (Drive → aba "Templates")
// ============================================================
//
// Os PNGs de "TEMPLATE - ALBUM/" (Capa, Contra Capa, Pac <Agência>,
// Comissao Tecnica) precisam estar no Drive para o WebApp exibi-los como
// fundo de página (mesma técnica usada para as figurinhas). O NOME de
// cada arquivo (sem ".png") deve ser IDÊNTICO à chave usada em
// slotMap.json / SLOT_MAP.templates (ex.: "Pac Canoinhas",
// "Pac Sao Joaquim I", "Comissao Tecnica", "Capa").

/**
 * Varre TEMPLATES_FOLDER_ID e popula/atualiza a aba "Templates"
 * (Nome | FileID), casando por nome de arquivo exato (sem extensão).
 * Idempotente. Cria a aba se ela não existir.
 */
function reconciliarTemplates() {
  try {
    if (!TEMPLATES_FOLDER_ID) {
      return {
        status: "error",
        message: "Configure a constante TEMPLATES_FOLDER_ID no topo do codigo.gs com o ID da pasta do Drive que contém os templates do álbum."
      };
    }

    var spread = (SPREADSHEET_ID && SPREADSHEET_ID !== "") ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spread.getSheetByName("Templates");
    if (!sheet) {
      sheet = spread.insertSheet("Templates");
      sheet.appendRow(["Nome", "FileID"]);
    }

    var folder = DriveApp.getFolderById(TEMPLATES_FOLDER_ID);
    var arquivos = folder.getFilesByType(MimeType.PNG);

    var dados = sheet.getDataRange().getValues();
    var linhaPorNome = {};
    for (var i = 1; i < dados.length; i++) {
      var nomeExistente = (dados[i][0] || "").toString().trim();
      if (nomeExistente) linhaPorNome[nomeExistente] = i + 1;
    }

    // Nomes de template reconhecidos: chaves de página de agência (única)
    // + páginas especiais sem pool (Comissão Técnica, Capa, Contra Capa) +
    // as 2 páginas de exibição de São Joaquim (não são chave de pool).
    var nomesReconhecidos = Object.keys(obterMapeamentoCompletoDeSlots());
    nomesReconhecidos.push("Comissao Tecnica", "Capa", "Contra Capa", "Pac Sao Joaquim I", "Pac Sao Joaquim Ii");

    var criadas = 0, atualizadas = 0;
    var naoReconhecidos = [];

    while (arquivos.hasNext()) {
      var arquivo = arquivos.next();
      var nomeChave = arquivo.getName().replace(/\.png$/i, "").trim();
      var fileId = arquivo.getId();

      if (nomesReconhecidos.indexOf(nomeChave) === -1) {
        naoReconhecidos.push(arquivo.getName());
      }

      var linha = linhaPorNome[nomeChave];
      if (linha) {
        sheet.getRange(linha, 2).setValue(fileId);
        atualizadas++;
      } else {
        sheet.appendRow([nomeChave, fileId]);
        criadas++;
      }
    }

    var resumo = "Templates reconciliados: " + criadas + " criado(s), " + atualizadas + " atualizado(s).";
    if (naoReconhecidos.length > 0) {
      resumo += " " + naoReconhecidos.length + " arquivo(s) com nome não reconhecido: " + naoReconhecidos.join(", ");
    }

    return { status: "success", message: resumo, criadas: criadas, atualizadas: atualizadas, naoReconhecidos: naoReconhecidos };
  } catch (e) {
    return { status: "error", message: e.toString() };
  }
}

function reconciliarTemplatesPeloMenu() {
  var resultado = reconciliarTemplates();
  var ui = SpreadsheetApp.getUi();
  if (resultado.status === "success") {
    ui.alert("Reconciliação de Templates", resultado.message, ui.ButtonSet.OK);
  } else {
    ui.alert("Erro na Reconciliação", resultado.message, ui.ButtonSet.OK);
  }
}

/**
 * Retorna { nomeTemplate: urlDaImagem } para todos os templates
 * reconciliados. Usado pelo Álbum Virtual para montar o fundo de cada
 * página a partir do Drive.
 */
function obterTemplatesDoAlbum() {
  try {
    var spread = (SPREADSHEET_ID && SPREADSHEET_ID !== "") ? SpreadsheetApp.openById(SPREADSHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spread.getSheetByName("Templates");
    if (!sheet) return JSON.stringify({ status: "error", message: "Aba Templates não encontrada. Rode 'Reconciliar Templates do Drive' primeiro." });

    var dados = sheet.getDataRange().getValues();
    var templates = {};
    for (var i = 1; i < dados.length; i++) {
      var nome = (dados[i][0] || "").toString().trim();
      var fileId = (dados[i][1] || "").toString().trim();
      if (nome && fileId) {
        templates[nome] = "https://drive.google.com/uc?id=" + fileId;
      }
    }
    return JSON.stringify({ status: "success", templates: templates });
  } catch (e) {
    return JSON.stringify({ status: "error", message: e.toString() });
  }
}