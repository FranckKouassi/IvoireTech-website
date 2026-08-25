#!/usr/bin/env bash
# Copie le CV PDF local (Cv colab) vers le dossier public du site.
# Usage : depuis la racine du projet → ./scripts/sync-founder-cv.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/assets/colaborateurs/Cv colab"
DST="$ROOT/assets/colaborateurs/cv/franck-kouassi-cv.pdf"

if [[ ! -d "$SRC" ]]; then
  echo "Erreur : dossier introuvable — $SRC" >&2
  exit 1
fi

pdf_file=""
while IFS= read -r -d '' candidate; do
  pdf_file="$candidate"
  break
done < <(find "$SRC" -maxdepth 4 -type f -iname '*.pdf' -print0 | sort -z)

if [[ -z "$pdf_file" ]]; then
  echo "Erreur : aucun PDF trouvé dans $SRC" >&2
  exit 1
fi

mkdir -p "$(dirname "$DST")"
cp "$pdf_file" "$DST"

echo "OK — CV synchronisé vers assets/colaborateurs/cv/franck-kouassi-cv.pdf"
