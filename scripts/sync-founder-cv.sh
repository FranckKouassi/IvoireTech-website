#!/usr/bin/env bash
# Copie le CV PDF local (Cv colab) vers le dossier public du site.
# Usage : depuis la racine du projet → ./scripts/sync-founder-cv.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/assets/colaborateurs/Cv colab"
DST="$ROOT/assets/colaborateurs/cv/Cv-KOUASSI-Franck-updated.pdf"
PREFERRED_NAME="Cv-KOUASSI-Franck-updated.pdf"

if [[ ! -d "$SRC" ]]; then
  echo "Erreur : dossier introuvable — $SRC" >&2
  exit 1
fi

pdf_file=""
if [[ -f "$SRC/$PREFERRED_NAME" ]]; then
  pdf_file="$SRC/$PREFERRED_NAME"
else
  while IFS= read -r -d '' candidate; do
    pdf_file="$candidate"
    break
  done < <(find "$SRC" -maxdepth 4 -type f -iname '*updated*.pdf' -print0 | sort -z)

  if [[ -z "$pdf_file" ]]; then
    while IFS= read -r -d '' candidate; do
      pdf_file="$candidate"
      break
    done < <(find "$SRC" -maxdepth 4 -type f -iname '*.pdf' -print0 | sort -z)
  fi
fi

if [[ -z "$pdf_file" ]]; then
  echo "Erreur : aucun PDF trouvé dans $SRC (attendu : $PREFERRED_NAME)" >&2
  exit 1
fi

mkdir -p "$(dirname "$DST")"
cp "$pdf_file" "$DST"

# Retirer l'ancien nom public pour éviter les caches navigateur
rm -f "$ROOT/assets/colaborateurs/cv/franck-kouassi-cv.pdf"

echo "OK — CV synchronisé depuis $(basename "$pdf_file") vers assets/colaborateurs/cv/Cv-KOUASSI-Franck-updated.pdf"
