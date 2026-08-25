#!/usr/bin/env bash
# Copie le CV HTML local (Cv colab) vers le dossier public du site.
# Usage : depuis la racine du projet → ./scripts/sync-founder-cv.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/assets/colaborateurs/Cv colab"
DST="$ROOT/assets/colaborateurs/cv/franck-kouassi"

if [[ ! -d "$SRC" ]]; then
  echo "Erreur : dossier introuvable — $SRC" >&2
  exit 1
fi

rm -rf "$DST"
mkdir -p "$DST"

shopt -s nullglob
entries=("$SRC"/*)
if (( ${#entries[@]} == 0 )); then
  echo "Erreur : $SRC est vide." >&2
  exit 1
fi

cp -R "$SRC"/* "$DST"/

# Consultation en ligne uniquement — pas de PDF public
find "$DST" -type f -iname '*.pdf' -delete

if [[ ! -f "$DST/index.html" ]]; then
  html_file="$(find "$DST" -maxdepth 2 -type f -name '*.html' ! -iname '*preview*' | head -1)"
  if [[ -z "$html_file" ]]; then
    echo "Erreur : aucun fichier HTML trouvé dans $SRC" >&2
    exit 1
  fi
  cp "$html_file" "$DST/index.html"
fi

# Photo du site si le CV attend uploads/photo-Franck-KOUASSI-website.jpg
site_photo="$ROOT/assets/colaborateurs/photo/photo-franck-antelme-kouassi.jpg"
if [[ -f "$site_photo" ]]; then
  mkdir -p "$DST/uploads"
  cp "$site_photo" "$DST/uploads/photo-Franck-KOUASSI-website.jpg"
fi

echo "OK — CV synchronisé vers assets/colaborateurs/cv/franck-kouassi/ (HTML, sans PDF)."
