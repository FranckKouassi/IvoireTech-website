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
find "$DST" -type f -name '.thumbnail' -delete

# Si le bundle HTML est dans un sous-dossier (ex. cv-kouassi-html/), remonter à la racine
bundle_dir=""
for dir in "$DST"/*/; do
  [[ -f "${dir}support.js" && -f "${dir}doc-page.js" ]] || continue
  bundle_dir="$dir"
  break
done

if [[ -n "$bundle_dir" ]]; then
  shopt -s dotglob
  for item in "$bundle_dir"*; do
    name="$(basename "$item")"
    case "$name" in
      *.html)
        cp "$item" "$DST/index.html"
        ;;
      *)
        if [[ -d "$item" && -d "$DST/$name" ]]; then
          cp -R "$item"/* "$DST/$name"/
        else
          cp -R "$item" "$DST/"
        fi
        ;;
    esac
  done
  rm -rf "$bundle_dir"
fi

if [[ ! -f "$DST/index.html" ]]; then
  html_file="$(find "$DST" -maxdepth 2 -type f -name '*.html' ! -iname '*preview*' | head -1)"
  if [[ -z "$html_file" ]]; then
    echo "Erreur : aucun fichier HTML trouvé dans $SRC" >&2
    exit 1
  fi
  cp "$html_file" "$DST/index.html"
fi

# Dépendances minimales requises par index.html
for required in support.js doc-page.js; do
  if [[ ! -f "$DST/$required" ]]; then
    echo "Erreur : $required manquant après synchronisation." >&2
    exit 1
  fi
done

# Photo du site si le CV attend uploads/photo-Franck-KOUASSI-website.jpg
site_photo="$ROOT/assets/colaborateurs/photo/photo-franck-antelme-kouassi.jpg"
if [[ -f "$site_photo" ]]; then
  mkdir -p "$DST/uploads"
  cp "$site_photo" "$DST/uploads/photo-Franck-KOUASSI-website.jpg"
fi

echo "OK — CV synchronisé vers assets/colaborateurs/cv/franck-kouassi/ (HTML, sans PDF)."
