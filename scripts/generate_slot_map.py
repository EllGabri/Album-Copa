"""
Gera slotMap.json a partir da análise geométrica dos PNGs em "TEMPLATE - ALBUM/".

Não depende de OCR/tesseract/cv2/scipy (indisponíveis neste ambiente) - usa
apenas PIL + numpy. Detecta:
  - RETÂNGULOS: o contorno branco fino de cada slot (baixo "fill ratio",
    bbox grande). Slots lado-a-lado sem espaçamento (bordas coladas)
    aparecem como UM retângulo mesclado contendo 2 círculos - nesse caso o
    script divide o bbox ao meio e guarda o bbox combinado em "grupoPar".
    IMPORTANTE: bordas coladas no template NÃO implicam que os 2 números
    compartilham uma imagem (confirmado por contra-exemplo real: 149/150
    ficam colados no template mas são pessoas diferentes, sem arquivo de
    figurinha combinado). "grupoPar" é só metadado geométrico auxiliar -
    quem decide se usa o recorte compartilhado é o motor do álbum, ao
    checar se os dois números apontam pro MESMO FileID na aba Figurinhas
    (ver spec.md seção 3).
  - CÍRCULOS: os selos numerados brancos (alto "fill ratio" ~0.74-0.78,
    bbox quase quadrado, diâmetro ~85-110px numa imagem de 2000px de
    largura). Usados só para localizar/ordenar cada slot, não para
    recortar a figurinha (a figurinha cobre o retângulo inteiro).

Como não há OCR disponível, o NÚMERO de cada slot é atribuído por ORDEM DE
LEITURA (bloco esquerdo inteiro de cima a baixo, depois bloco direito) e
cruzado com o intervalo numérico esperado por template (tabela
EXPECTED_RANGES, validada manualmente contra scripts/audit-figurinhas.ps1 e
inspeção visual direta de 4 templates). Templates cuja contagem detectada
não bate com o esperado são reportados como PENDENTE_REVISAO e não recebem
número - devem ser conferidos manualmente antes de uso em produção.
"""
import json
import os
import sys

import numpy as np
from PIL import Image

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "..", "TEMPLATE - ALBUM")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "slotMap.json")

# Intervalo numérico esperado por arquivo de template (min, max), validado
# contra scripts/audit-figurinhas.ps1 (Comissao Tecnica) e inspeção visual
# direta (Canoinhas, Sao Joaquim I/II). "Pac São Joaquim" continua sendo UMA
# agência/pool (11-28) mas exibida em 2 arquivos de template - ver spec.md.
#  ACHADO (2026-07-03): os arquivos "Pac Lages.png" e "Pac Lages Ii.png" tem
#  o CONTEUDO trocado em relacao ao nome do arquivo - confirmado por
#  inspecao visual direta. "Pac Lages.png" mostra "Lages - Santa Helena"
#  (52-62); "Pac Lages Ii.png" mostra "Lages - Guaruja" (42-51). Os ranges
#  abaixo sao os REAIS (por conteudo, nao pelo nome do arquivo); a
#  associacao agencia->arquivo em paginasPorAgencia usa esses ranges para
#  apontar pro arquivo certo. CONFIRMADO com o usuario (2026-07-04): login
#  "Pac Lages" = "Lages - Santa Helena" (52-62, arquivo Pac Lages.png) e
#  login "Pac Lages Ii" = "Lages - Guaruja" (42-51, arquivo Pac Lages Ii.png).
EXPECTED_RANGES = {
    "Comissao Tecnica": (1, 10),
    "Pac Sao Joaquim I": (11, 19),
    "Pac Sao Joaquim Ii": (20, 28),
    "Pac Canoinhas": (29, 41),
    "Pac Lages": (52, 62),
    "Pac Lages Ii": (42, 51),
    "Pac Porto Uniao": (63, 72),
    "Pac Otacilio Costa": (73, 83),
    "Pac Correia Pinto": (84, 92),
    "Pac Irineopolis": (93, 104),
    "Pac Major Vieira": (105, 115),
    "Pac Bom Jardim da Serra": (116, 122),
    "Pac Timbo Grande": (123, 130),
    "Pac Monte Castelo": (131, 138),
    "Pac Ponte Alta": (139, 146),
    "Pac Porto Uniao D. Sta Cruz Do Timbo": (156, 162),
    "Pac Bela Vista do Toldo": (147, 155),
}
# Páginas sem slots numerados (só arte de capa/contracapa).
NO_SLOT_TEMPLATES = {"Capa", "Contra Capa"}

#  ACHADO (2026-07-03): "Pac Monte Castelo.png" tem 9 retangulos (130-138),
#  mas o numero 130 TAMBEM aparece em "Pac Timbo Grande.png" (123-130) -
#  duplicidade real na arte do Canva, nao é bug de deteccao (confirmado por
#  inspecao visual dos dois arquivos). Ate a marketing decidir a quem 130
#  pertence, mantemos o comportamento atual do codigo.gs (130 pertence só à
#  Timbó Grande) e excluímos o primeiro retângulo detectado em Monte
#  Castelo (a duplicata de "130") da numeração dessa página.
SKIP_FIRST_N = {"Pac Monte Castelo": 1}

MIN_LINE = 150  # tamanho minimo (px) para considerar um componente "retangulo"


def white_mask(im):
    arr = np.array(im.convert("RGB"))
    return (arr[:, :, 0] > 235) & (arr[:, :, 1] > 235) & (arr[:, :, 2] > 235)


def run_length_ccl(mask):
    """Componentes conectados (4-conectividade) via run-length + union-find."""
    h, w = mask.shape
    runs = []
    row_runs_idx = [[] for _ in range(h)]
    for y in range(h):
        row = mask[y]
        if not row.any():
            continue
        diff = np.diff(row.astype(np.int8))
        starts = list(np.where(diff == 1)[0] + 1)
        ends = list(np.where(diff == -1)[0] + 1)
        if row[0]:
            starts = [0] + starts
        if row[-1]:
            ends = ends + [w]
        for s, e in zip(starts, ends):
            idx = len(runs)
            runs.append((y, s, e))
            row_runs_idx[y].append(idx)

    parent = list(range(len(runs)))

    def find(a):
        while parent[a] != a:
            parent[a] = parent[parent[a]]
            a = parent[a]
        return a

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[rb] = ra

    for y in range(h - 1):
        if not row_runs_idx[y] or not row_runs_idx[y + 1]:
            continue
        for i in row_runs_idx[y]:
            _, s1, e1 = runs[i]
            for j in row_runs_idx[y + 1]:
                _, s2, e2 = runs[j]
                if s1 < e2 and s2 < e1:
                    union(i, j)

    comps = {}
    for i, (y, s, e) in enumerate(runs):
        r = find(i)
        c = comps.setdefault(r, {"minx": s, "maxx": e, "miny": y, "maxy": y, "area": 0})
        c["minx"] = min(c["minx"], s)
        c["maxx"] = max(c["maxx"], e)
        c["miny"] = min(c["miny"], y)
        c["maxy"] = max(c["maxy"], y)
        c["area"] += e - s
    return list(comps.values())


def classify(comps):
    circles, rects = [], []
    for c in comps:
        w = c["maxx"] - c["minx"]
        h = c["maxy"] - c["miny"] + 1
        if w <= 0 or h <= 0:
            continue
        fill = c["area"] / (w * h)
        aspect = w / h
        item = {"x": int(c["minx"]), "y": int(c["miny"]), "w": int(w), "h": int(h), "fill": round(fill, 3)}
        if 85 <= w <= 110 and 85 <= h <= 110 and 0.85 <= aspect <= 1.15 and 0.60 <= fill <= 0.85:
            circles.append(item)
        elif w >= MIN_LINE and h >= 200 and fill <= 0.15:
            rects.append(item)
    return circles, rects


def circle_center(c):
    return (c["x"] + c["w"] / 2.0, c["y"] + c["h"] / 2.0)


def rect_contains(rect, point):
    px, py = point
    return rect["x"] <= px <= rect["x"] + rect["w"] and rect["y"] <= py <= rect["y"] + rect["h"]


def build_slots(circles, rects):
    """Casa cada retangulo com seu(s) circulo(s); divide retangulos mesclados
    (2 circulos) em 2 meio-slots. Retorna lista de slots SEM numero ainda,
    em ordem de leitura (bloco esquerdo cima->baixo, depois bloco direito)."""
    slots = []
    for rect in rects:
        contidos = [c for c in circles if rect_contains(rect, circle_center(c))]
        if len(contidos) == 2:
            contidos.sort(key=lambda c: circle_center(c)[0])
            meia_largura = rect["w"] / 2.0
            esquerda = {"x": rect["x"], "y": rect["y"], "w": meia_largura, "h": rect["h"]}
            direita = {"x": rect["x"] + meia_largura, "y": rect["y"], "w": meia_largura, "h": rect["h"]}
            grupo_full = {"x": rect["x"], "y": rect["y"], "w": rect["w"], "h": rect["h"]}
            slots.append({"bbox": esquerda, "circulo": contidos[0], "par": grupo_full, "ladoPar": "esquerda"})
            slots.append({"bbox": direita, "circulo": contidos[1], "par": grupo_full, "ladoPar": "direita"})
        elif len(contidos) == 1:
            slots.append({"bbox": rect, "circulo": contidos[0], "par": None, "ladoPar": None})
        elif len(contidos) == 0:
            # retangulo sem circulo dentro (raro - ex. circulo tocando a borda);
            # tenta casar pelo circulo mais proximo do centro do retangulo.
            rcx, rcy = rect["x"] + rect["w"] / 2.0, rect["y"] + rect["h"] / 2.0
            if circles:
                mais_proximo = min(circles, key=lambda c: (circle_center(c)[0]-rcx)**2 + (circle_center(c)[1]-rcy)**2)
                slots.append({"bbox": rect, "circulo": mais_proximo, "par": None, "ladoPar": None})
        # len(contidos) > 2 nao deveria ocorrer; ignorado propositalmente (fica pendente)

    # Ordena por ordem de leitura: agrupa em blocos via maior lacuna horizontal
    # entre centros de circulo (divisor esquerda/direita da pagina), depois
    # ordena cada bloco por linha (banda de y, tolerancia 60px) e coluna (x).
    if not slots:
        return []

    centros_x = sorted(circle_center(s["circulo"])[0] for s in slots)
    maior_gap, gap_pos = 0, None
    for i in range(len(centros_x) - 1):
        gap = centros_x[i + 1] - centros_x[i]
        if gap > maior_gap:
            maior_gap = gap
            gap_pos = (centros_x[i] + centros_x[i + 1]) / 2.0

    usa_blocos = maior_gap > 250  # lacuna grande o suficiente para ser a "quebra de pagina"
    bloco_esq = [s for s in slots if not usa_blocos or circle_center(s["circulo"])[0] < gap_pos]
    bloco_dir = [s for s in slots if usa_blocos and circle_center(s["circulo"])[0] >= gap_pos]

    def ordenar_bloco(bloco):
        bloco = sorted(bloco, key=lambda s: circle_center(s["circulo"])[1])
        linhas = []
        for s in bloco:
            cy = circle_center(s["circulo"])[1]
            colocado = False
            for linha in linhas:
                if abs(circle_center(linha[0]["circulo"])[1] - cy) < 60:
                    linha.append(s)
                    colocado = True
                    break
            if not colocado:
                linhas.append([s])
        resultado = []
        for linha in linhas:
            resultado.extend(sorted(linha, key=lambda s: circle_center(s["circulo"])[0]))
        return resultado

    return ordenar_bloco(bloco_esq) + ordenar_bloco(bloco_dir)


def processar_template(nome_arquivo, nome_chave):
    im = Image.open(os.path.join(TEMPLATE_DIR, nome_arquivo))
    mask = white_mask(im)
    comps = run_length_ccl(mask)
    circles, rects = classify(comps)
    slots_ordenados = build_slots(circles, rects)

    pular = SKIP_FIRST_N.get(nome_chave, 0)
    ignorados = slots_ordenados[:pular]
    slots_ordenados = slots_ordenados[pular:]

    esperado = EXPECTED_RANGES.get(nome_chave)
    resultado = {
        "template": nome_arquivo,
        "largura": im.size[0],
        "altura": im.size[1],
        "circulosDetectados": len(circles),
        "retangulosDetectados": len(rects),
        "slotsMontados": len(slots_ordenados),
        "slots": [],
        "status": "ok",
    }

    if esperado is None:
        resultado["status"] = "sem_intervalo_esperado"
        return resultado

    qtd_esperada = esperado[1] - esperado[0] + 1
    if len(slots_ordenados) != qtd_esperada:
        resultado["status"] = "PENDENTE_REVISAO"
        resultado["motivo"] = f"esperado {qtd_esperada} slots ({esperado[0]}-{esperado[1]}), detectado {len(slots_ordenados)}"

    numero = esperado[0]
    for s in slots_ordenados:
        entry = {
            "numero": numero,
            "x": round(s["bbox"]["x"], 1),
            "y": round(s["bbox"]["y"], 1),
            "largura": round(s["bbox"]["w"], 1),
            "altura": round(s["bbox"]["h"], 1),
        }
        if s["par"]:
            entry["grupoPar"] = {
                "x": round(s["par"]["x"], 1),
                "y": round(s["par"]["y"], 1),
                "largura": round(s["par"]["w"], 1),
                "altura": round(s["par"]["h"], 1),
            }
            entry["ladoPar"] = s["ladoPar"]
        resultado["slots"].append(entry)
        numero += 1

    return resultado


def main():
    arquivos = sorted(f for f in os.listdir(TEMPLATE_DIR) if f.lower().endswith(".png"))
    slot_map = {"geradoEm": "scripts/generate_slot_map.py", "dimensaoReferencia": [2000, 1414], "templates": {}}
    pendentes = []

    for f in arquivos:
        nome_chave = f[:-4]
        if nome_chave in NO_SLOT_TEMPLATES:
            slot_map["templates"][nome_chave] = {"template": f, "slots": [], "status": "sem_slots"}
            continue
        resultado = processar_template(f, nome_chave)
        slot_map["templates"][nome_chave] = resultado
        if resultado["status"] != "ok":
            pendentes.append((nome_chave, resultado.get("motivo", resultado["status"])))

    # paginasPorAgencia: agencia de LOGIN (pool de pacotes, codigo.gs:
    # obterSlotsPorAgencia) -> lista ordenada de ARQUIVOS de template a
    # exibir. Casado por CONTEUDO (intervalo numerico), nao por nome de
    # arquivo == nome da agencia - necessario por causa do achado Lages/
    # Lages Ii (arquivos com conteudo trocado, ver comentario em
    # EXPECTED_RANGES acima).
    AGENCY_POOLS = {
        "Pac Bela Vista Do Toldo": (147, 155),
        "Pac São Joaquim": (11, 28),  # 1 login, 2 arquivos de template
        "Pac Canoinhas": (29, 41),
        # Confirmado com o usuario (2026-07-04): login "Pac Lages" = agencia
        # "Lages - Santa Helena" (arquivo Pac Lages.png, 52-62) e login
        # "Pac Lages Ii" = "Lages - Guaruja" (arquivo Pac Lages Ii.png, 42-51).
        "Pac Lages": (52, 62),
        "Pac Lages Ii": (42, 51),
        "Pac Porto União": (63, 72),
        "Pac Otacilio Costa": (73, 83),
        "Pac Correia Pinto": (84, 92),
        "Pac Irineópolis": (93, 104),
        "Pac Major Vieira": (105, 115),
        "Pac Bom Jardim Da Serra": (116, 122),
        "Pac Timbó Grande": (123, 130),
        "Pac Monte Castelo": (131, 138),
        "Pac Ponte Alta": (139, 146),
        "Pac Santa Cruz Do Timbo": (156, 162),
    }

    range_por_template = {chave: EXPECTED_RANGES[chave] for chave in EXPECTED_RANGES if chave not in ("Pac Sao Joaquim I", "Pac Sao Joaquim Ii")}

    paginas_por_agencia = {}
    avisos_paginas = []
    for agencia, pool in AGENCY_POOLS.items():
        if agencia == "Pac São Joaquim":
            paginas_por_agencia[agencia] = ["Pac Sao Joaquim I", "Pac Sao Joaquim Ii"]
            continue
        candidatos = [tpl for tpl, rng in range_por_template.items() if rng == pool]
        if len(candidatos) == 1:
            paginas_por_agencia[agencia] = candidatos
        else:
            avisos_paginas.append(f"{agencia} (pool {pool}): {len(candidatos)} template(s) candidato(s) = {candidatos}")
            paginas_por_agencia[agencia] = candidatos

    slot_map["paginasPorAgencia"] = paginas_por_agencia

    with open(OUTPUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(slot_map, fh, ensure_ascii=False, indent=2)

    print(f"slotMap.json gerado em {OUTPUT_PATH}")
    print(f"Templates processados: {len(arquivos)}")
    if pendentes:
        print(f"\nPENDENTE_REVISAO ({len(pendentes)}):")
        for nome, motivo in pendentes:
            print(f"  - {nome}: {motivo}")
    else:
        print("Todos os templates bateram com o intervalo esperado.")

    if avisos_paginas:
        print(f"\nAVISO em paginasPorAgencia ({len(avisos_paginas)}):")
        for a in avisos_paginas:
            print(f"  - {a}")


if __name__ == "__main__":
    sys.exit(main())
