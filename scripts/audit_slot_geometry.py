"""
Audita a GEOMETRIA de slotMap.json (não a numeração/cobertura - isso já é
feito por validate_slot_map.py). Roda checagens que NÃO exigem os PNGs
originais (que não estão neste repositório, só no Drive/pasta local
"TEMPLATE - ALBUM" do usuário):

  1. Slot fora dos limites da própria imagem do template.
  2. Slots do mesmo template se sobrepondo (exceto o par legítimo de
     "grupoPar", que compartilha bbox por design).
  3. Slot com largura/altura destoando >15% da mediana dos demais slots do
     mesmo template (indício de detecção malfeita, não prova).

NÃO detecta (exige as imagens reais, fora do alcance deste script):
  - Retângulo detectado no lugar errado (número atribuído a um retângulo
    fisicamente diferente do que está impresso no template).
  - Erro de 1 posição na numeração impressa vs. a numeração atribuída por
    ordem de leitura (ver ACHADO Pac Irineópolis em 2026-07-04 no Plans.md).
"""
import json
import os
import sys

SLOT_MAP_PATH = os.path.join(os.path.dirname(__file__), "..", "slotMap.json")


def main():
    with open(SLOT_MAP_PATH, encoding="utf-8") as fh:
        slot_map = json.load(fh)

    problemas = []
    for nome, tpl in slot_map["templates"].items():
        slots = tpl.get("slots", [])
        if not slots:
            continue
        largura_img, altura_img = tpl.get("largura"), tpl.get("altura")
        larguras = sorted(s["largura"] for s in slots)
        alturas = sorted(s["altura"] for s in slots)
        med_l = larguras[len(larguras) // 2]
        med_a = alturas[len(alturas) // 2]

        for s in slots:
            n = s["numero"]
            if s["x"] < 0 or s["y"] < 0 or s["x"] + s["largura"] > largura_img + 1 or s["y"] + s["altura"] > altura_img + 1:
                problemas.append(
                    f"{nome} #{n}: fora dos limites da imagem "
                    f"(x={s['x']},y={s['y']},w={s['largura']},h={s['altura']}, img={largura_img}x{altura_img})"
                )
            if abs(s["largura"] - med_l) / med_l > 0.15 or abs(s["altura"] - med_a) / med_a > 0.15:
                problemas.append(
                    f"{nome} #{n}: tamanho fora do padrão do template "
                    f"(w={s['largura']} vs mediana {med_l}, h={s['altura']} vs mediana {med_a})"
                )

        for i in range(len(slots)):
            for j in range(i + 1, len(slots)):
                a, b = slots[i], slots[j]
                ax0, ay0, ax1, ay1 = a["x"], a["y"], a["x"] + a["largura"], a["y"] + a["altura"]
                bx0, by0, bx1, by1 = b["x"], b["y"], b["x"] + b["largura"], b["y"] + b["altura"]
                ox = max(0, min(ax1, bx1) - max(ax0, bx0))
                oy = max(0, min(ay1, by1) - max(ay0, by0))
                if ox > 5 and oy > 5:
                    problemas.append(f"{nome}: slots #{a['numero']} e #{b['numero']} se sobrepõem (overlap {ox:.0f}x{oy:.0f}px)")

    if problemas:
        print(f"AUDITORIA: {len(problemas)} ponto(s) para revisar visualmente:")
        for p in problemas:
            print("  -", p)
    else:
        print("Auditoria de geometria: nenhuma anomalia estrutural encontrada nos dados do slotMap.json.")
        print("Atenção: isso NÃO garante alinhamento pixel-perfeito com os PNGs reais - só descarta")
        print("sobreposição/estouro de limites/outliers de tamanho. Erros de correspondência número<->retângulo")
        print("(ex.: numeração impressa começando em outro número) só são detectáveis com as imagens em mãos.")
    return 1 if problemas else 0


if __name__ == "__main__":
    sys.exit(main())
