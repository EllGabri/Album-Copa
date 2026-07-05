# Auditoria de arquivos em "Figurinhas Copa Excelencia/"
# Extrai numero(s) + nome do padrao de nome de arquivo e cruza com os numeros
# de slot esperados por obterSlotsPorAgencia() (codigo.gs).
# Gera relatorio em docs/RELATORIO_AUDITORIA_FIGURINHAS.md na raiz do projeto.

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$root = Split-Path -Parent $PSScriptRoot
$figDir = Join-Path $root "Figurinhas Copa Excelencia"
$outFile = Join-Path $root "docs\RELATORIO_AUDITORIA_FIGURINHAS.md"

# Mapeamento REAL confirmado contra os templates em "TEMPLATE - ALBUM/" (2026-07-02).
# codigo.gs:obterSlotsPorAgencia() ainda está desatualizado em relação a isto - ver
# task 0.4 no Plans.md (precisa dividir "Pac São Joaquim" em I/II e adicionar
# "Comissao Tecnica").
$mappings = [ordered]@{
    "Comissao Tecnica"           = 1..10
    "Pac Bela Vista Do Toldo"    = 147..155
    "Pac Sao Joaquim I"          = 11..19
    "Pac Sao Joaquim Ii"         = 20..28
    "Pac Canoinhas"              = 29..41
    "Pac Lages"                  = 42..51
    "Pac Lages Ii"               = 52..62
    "Pac Porto União"            = 63..72
    "Pac Otacilio Costa"         = 73..83
    "Pac Correia Pinto"          = 84..92
    "Pac Irineópolis"            = 93..104
    "Pac Major Vieira"           = 105..115
    "Pac Bom Jardim Da Serra"    = 116..122
    "Pac Timbó Grande"           = 123..130
    "Pac Monte Castelo"          = 131..138
    "Pac Ponte Alta"             = 139..146
    "Pac Santa Cruz Do Timbo"    = 156..162
}

$expectedNumbers = New-Object System.Collections.Generic.SortedSet[int]
foreach ($k in $mappings.Keys) { foreach ($n in $mappings[$k]) { [void]$expectedNumbers.Add($n) } }
# 162 nao existe (confirmado pelo usuario - nao ha figurinha para este slot)
$semFigurinhaConfirmado = @(162)

$files = Get-ChildItem -LiteralPath $figDir -Filter *.png | Select-Object -ExpandProperty Name

$parsed = @()
$unparsed = @()
$foundNumbers = New-Object System.Collections.Generic.SortedSet[int]
$duplicates = @{}

foreach ($f in $files) {
    $base = $f -replace '\.png$', ''
    $base = $base -replace '^Cópia de\s+', ''
    $base = $base.Trim()

    # Caso 1: par puro "101-102" ou "25_26" (sem nome)
    if ($base -match '^(\d+)[-_](\d+)$') {
        $n1 = [int]$matches[1]; $n2 = [int]$matches[2]
        $parsed += [pscustomobject]@{ Arquivo=$f; Tipo="par"; Numeros=@($n1,$n2); Nome=$null }
        foreach ($n in @($n1,$n2)) {
            if ($foundNumbers.Contains($n)) { $duplicates[$n] = ($duplicates[$n] + 1) } else { $duplicates[$n] = 1 }
            [void]$foundNumbers.Add($n)
        }
        continue
    }

    # Caso 2: numero unico sem nome (arquivos "1.png".."10.png")
    if ($base -match '^(\d+)$') {
        $n1 = [int]$matches[1]
        $parsed += [pscustomobject]@{ Arquivo=$f; Tipo="unico-sem-nome"; Numeros=@($n1); Nome=$null }
        if ($foundNumbers.Contains($n1)) { $duplicates[$n1] = ($duplicates[$n1] + 1) } else { $duplicates[$n1] = 1 }
        [void]$foundNumbers.Add($n1)
        continue
    }

    # Caso 3: numero + separador (- , _ ou espaco) + nome
    if ($base -match '^(\d+)[-_\s]+(.+)$') {
        $n1 = [int]$matches[1]; $nome = $matches[2].Trim()
        $parsed += [pscustomobject]@{ Arquivo=$f; Tipo="unico-com-nome"; Numeros=@($n1); Nome=$nome }
        if ($foundNumbers.Contains($n1)) { $duplicates[$n1] = ($duplicates[$n1] + 1) } else { $duplicates[$n1] = 1 }
        [void]$foundNumbers.Add($n1)
        continue
    }

    $unparsed += $f
}

$missing = @($expectedNumbers | Where-Object { -not $foundNumbers.Contains($_) })
$missingConfirmados = @($missing | Where-Object { $semFigurinhaConfirmado -contains $_ })
$missingReais = @($missing | Where-Object { $semFigurinhaConfirmado -notcontains $_ })
$extra = @($foundNumbers | Where-Object { -not $expectedNumbers.Contains($_) })
$dupNumbers = @($duplicates.Keys | Where-Object { $duplicates[$_] -gt 1 } | Sort-Object)

$lines = @()
$lines += "# Relatório de Auditoria — Figurinhas Copa Excelência"
$lines += ""
$lines += "Gerado automaticamente pela task 0.1 (Plans.md) via ``scripts/audit-figurinhas.ps1``."
$lines += ""
$lines += "## Resumo"
$lines += ""
$lines += "- Arquivos encontrados em ``Figurinhas Copa Excelencia/``: **$($files.Count)**"
$lines += "- Arquivos parseados com sucesso: **$($parsed.Count)**"
$lines += "- Arquivos que não casaram com nenhum padrão conhecido: **$($unparsed.Count)**"
$lines += "- Números de slot únicos cobertos por arquivo: **$($foundNumbers.Count)**"
$lines += "- Números esperados (Comissão Técnica 1-10 + slots de agência): **$($expectedNumbers.Count)**"
$lines += "- Números esperados SEM arquivo correspondente: **$($missing.Count)** ($($missingConfirmados.Count) confirmado(s) como sem figurinha, $($missingReais.Count) gap(s) real(is))"
$lines += "- Números com arquivo mas fora do mapeamento conhecido: **$($extra.Count)**"
$lines += "- Números cobertos por mais de um arquivo (duplicados): **$($dupNumbers.Count)**"
$lines += ""

$lines += "## 1. Arquivos que não casam com o padrão ``<n>- NOME`` / ``<n1>-<n2>``"
$lines += ""
if ($unparsed.Count -eq 0) {
    $lines += "Nenhum. Todos os arquivos casaram com um padrão reconhecido."
} else {
    foreach ($u in $unparsed) { $lines += "- ``$u``" }
}
$lines += ""

$lines += "## 2. Números esperados sem figurinha correspondente"
$lines += ""
if ($missingReais.Count -eq 0) {
    $lines += "Nenhum gap real. Todos os números esperados têm arquivo, exceto os confirmados abaixo."
} else {
    $lines += "| Número | Página dona |"
    $lines += "|---|---|"
    foreach ($m in $missingReais) {
        $ag = ($mappings.Keys | Where-Object { $mappings[$_] -contains $m })
        $lines += "| $m | $ag |"
    }
}
$lines += ""
if ($missingConfirmados.Count -gt 0) {
    $lines += "> Confirmado pelo usuário como sem figurinha (não é bug, não gerar essa figurinha):"
    $lines += "> $($missingConfirmados -join ', ')."
    $lines += ""
}

$lines += "## 3. Números com arquivo mas fora do mapeamento conhecido"
$lines += ""
if ($extra.Count -eq 0) {
    $lines += "Nenhum. Todo arquivo encontrado corresponde a um número esperado (Comissão Técnica 1-10 ou slot de agência)."
} else {
    $lines += ($extra -join ", ")
}
$lines += ""

$lines += "## 4. Números cobertos por mais de um arquivo (possível duplicidade)"
$lines += ""
if ($dupNumbers.Count -eq 0) {
    $lines += "Nenhum."
} else {
    foreach ($d in $dupNumbers) {
        $matchingFiles = $parsed | Where-Object { $_.Numeros -contains $d } | Select-Object -ExpandProperty Arquivo
        $lines += "- Número **$d** aparece em $($duplicates[$d]) arquivos: $($matchingFiles -join ', ')"
    }
}
$lines += ""

$lines += "## 5. Pendência conhecida em ``codigo.gs`` (não bloqueia esta task)"
$lines += ""
$lines += "``obterSlotsPorAgencia()`` em ``codigo.gs`` ainda está desatualizado frente aos templates"
$lines += "reais confirmados nesta auditoria:"
$lines += ""
$lines += "- Tem uma única chave ``Pac São Joaquim`` (11-28), mas o Canva divide em duas páginas:"
$lines += "  ``Pac Sao Joaquim I`` (11-19) e ``Pac Sao Joaquim Ii`` (20-28)."
$lines += "- Não tem nenhuma chave para ``Comissao Tecnica`` (01-10 - Técnicos 1-5, Aux. Técnicos 6-10)."
$lines += ""
$lines += "Corrigido no mapeamento de referência deste script (task 0.1); a correção equivalente em"
$lines += "``codigo.gs`` fica registrada como task 0.4 no Plans.md."
$lines += ""

$lines += "## 6. Todos os números por arquivo (referência completa)"
$lines += ""
$lines += "| Arquivo | Tipo | Número(s) | Nome extraído |"
$lines += "|---|---|---|---|"
foreach ($p in ($parsed | Sort-Object { $_.Numeros[0] })) {
    $nomeStr = if ($p.Nome) { $p.Nome } else { "-" }
    $lines += "| ``$($p.Arquivo)`` | $($p.Tipo) | $($p.Numeros -join ', ') | $nomeStr |"
}
$lines += ""

$lines | Out-File -FilePath $outFile -Encoding utf8

Write-Output "Relatorio gerado em: $outFile"
Write-Output "Arquivos: $($files.Count) | Parseados: $($parsed.Count) | Nao parseados: $($unparsed.Count)"
Write-Output "Faltando: $($missing.Count) | Fora do mapeamento: $($extra.Count) | Duplicados: $($dupNumbers.Count)"
