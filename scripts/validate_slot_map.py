"""
Valida slotMap.json (gerado por generate_slot_map.py) contra o pool de
slots esperado (SLOTS_COMISSAO_TECNICA + obterSlotsPorAgencia() em
codigo.gs). Sai com exit code != 0 se encontrar qualquer inconsistência.

Checagens:
  1. Todo numero 1-161 (exceto 162, confirmado sem figurinha) aparece
     exatamente uma vez em algum template.
  2. Nenhum numero fora de 1-162 aparece.
  3. Nenhum numero duplicado (presente em 2+ templates/slots).
  4. A uniao dos numeros de "Pac Sao Joaquim I" + "Pac Sao Joaquim Ii" bate
     exatamente com o pool da agencia "Pac São Joaquim" (11-28).
"""
import json
import os
import sys
from collections import Counter

SLOT_MAP_PATH = os.path.join(os.path.dirname(__file__), "..", "slotMap.json")

# Espelha codigo.gs: SLOTS_COMISSAO_TECNICA + obterMapeamentoCompletoDeSlots()
# Ranges corrigidos em 2026-07-05 apos investigacao completa (leitura visual
# de todos os 19 templates) - ver Fase 11 do Plans.md.
SLOTS_COMISSAO_TECNICA = list(range(1, 11))
POOL_POR_AGENCIA = {
    "Pac Bela Vista Do Toldo": list(range(146, 155)),
    "Pac São Joaquim": list(range(11, 29)),
    "Pac Canoinhas": list(range(29, 42)),
    "Pac Lages": list(range(51, 62)),
    "Pac Lages Ii": list(range(42, 51)) + [162],
    "Pac Porto União": list(range(62, 72)),
    "Pac Otacilio Costa": list(range(72, 83)),
    "Pac Correia Pinto": list(range(83, 92)),
    "Pac Irineópolis": list(range(92, 103)),
    "Pac Major Vieira": list(range(103, 114)),
    "Pac Bom Jardim Da Serra": list(range(114, 121)),
    "Pac Timbó Grande": list(range(121, 129)),
    "Pac Monte Castelo": list(range(129, 138)),
    "Pac Ponte Alta": list(range(138, 146)),
    "Pac Santa Cruz Do Timbo": list(range(155, 162)),
}
# "162" deixou de ser um numero sem figurinha: passou a pertencer a
# Pac Lages Ii (slot que tinha "41" duplicado com Canoinhas, renumerado por
# decisao do usuario em 2026-07-05). Nenhum numero sem figurinha confirmado
# no momento.
NUMEROS_SEM_FIGURINHA_CONFIRMADOS = set()


def main():
    with open(SLOT_MAP_PATH, encoding="utf-8") as fh:
        slot_map = json.load(fh)

    erros = []

    todos_numeros = []
    for chave, tpl in slot_map["templates"].items():
        for s in tpl.get("slots", []):
            todos_numeros.append(s["numero"])

    contagem = Counter(todos_numeros)
    duplicados = sorted(n for n, cnt in contagem.items() if cnt > 1)
    if duplicados:
        erros.append(f"Números duplicados no slotMap: {duplicados}")

    esperado_total = set()
    for pool in POOL_POR_AGENCIA.values():
        esperado_total.update(pool)
    esperado_total.update(SLOTS_COMISSAO_TECNICA)
    esperado_total -= NUMEROS_SEM_FIGURINHA_CONFIRMADOS

    faltando = sorted(esperado_total - set(contagem.keys()))
    if faltando:
        erros.append(f"Números esperados ausentes no slotMap: {faltando}")

    extra = sorted(set(contagem.keys()) - esperado_total - NUMEROS_SEM_FIGURINHA_CONFIRMADOS)
    if extra:
        erros.append(f"Números no slotMap fora de qualquer pool conhecido: {extra}")

    sj1 = {s["numero"] for s in slot_map["templates"]["Pac Sao Joaquim I"]["slots"]}
    sj2 = {s["numero"] for s in slot_map["templates"]["Pac Sao Joaquim Ii"]["slots"]}
    uniao_sj = sj1 | sj2
    pool_sj = set(POOL_POR_AGENCIA["Pac São Joaquim"])
    if uniao_sj != pool_sj:
        erros.append(f"União Sao Joaquim I+II ({sorted(uniao_sj)}) != pool 'Pac São Joaquim' ({sorted(pool_sj)})")

    if erros:
        print("VALIDACAO FALHOU:")
        for e in erros:
            print(f"  - {e}")
        return 1

    print(f"Validação OK: {len(contagem)} números únicos, cobrindo todos os pools esperados (exceto {sorted(NUMEROS_SEM_FIGURINHA_CONFIRMADOS)}, confirmado sem figurinha).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
