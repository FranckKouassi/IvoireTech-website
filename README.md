# Ivoire Tech Solutions — Site vitrine

Site vitrine officiel d'**Ivoire Tech Solutions SARL**, cabinet de conseil en data science, intelligence artificielle et solutions IT, basé à Abidjan (Côte d'Ivoire).

**Site en ligne** : [ivoiretech-solutions.com](https://ivoiretech-solutions.com)

---

## Aperçu

| Page | Fichier | Contenu |
|------|---------|---------|
| Accueil | `index.html` | Hero, services, secteurs, équipe, CTA |
| À propos | `a-propos.html` | Mission, vision, valeurs, infos légales |
| Services | `services.html` | Expertises, secteurs, stack technique |
| Notre Approche | `approche.html` | Méthode en 5 étapes, collaboration |
| Collaborateurs | `collaborateurs.html` | Profils de l'équipe (5 collaborateurs) |
| Contact | `contact.html` | Coordonnées + formulaire |

---

## Stack technique

- **HTML5** sémantique, multi-pages
- **CSS3** — design system maison (`assets/css/style.css`), variables CSS, mode sombre, grilles blueprint
- **JavaScript vanilla** — aucun bundler, aucune dépendance npm
- **Font Awesome 6** (CDN) — icônes
- **Google Fonts** — Sora, Inter, JetBrains Mono
- **i18n** — français / anglais via `assets/js/i18n.js`

---

## Fonctionnalités

- Bilingue **FR / EN** (localStorage)
- Thème **clair / sombre**
- **Responsive** mobile-first, menu latéral
- Animations au scroll (AOS-like via `main.js`)
- **SEO** : Open Graph, Twitter Cards, JSON-LD, `sitemap.xml`, `robots.txt`
- **Accessibilité** : skip link, `aria-label`, `prefers-reduced-motion`

---

## Structure du projet

```text
.
├── index.html
├── a-propos.html
├── services.html
├── approche.html
├── collaborateurs.html
├── contact.html
├── assets/
│   ├── css/style.css          # Design system + styles par page
│   ├── js/
│   │   ├── main.js            # Navigation, thème, scroll, formulaire
│   │   ├── i18n.js            # Traductions FR / EN
│   │   └── hero-animation.js  # Animation hero (accueil)
│   ├── images/                # Logos SVG, visuels services / secteurs
│   └── colaborateurs/
│       └── photo/             # Photos équipe (CVs exclus du dépôt)
├── Infos-site/                # Charte graphique / logos source
├── sitemap.xml
├── robots.txt
├── netlify.toml               # Config déploiement Netlify
├── DEPLOYMENT.md              # Guide mise en ligne
├── LICENSE
└── TODO.md
```

---

## Lancer en local

Aucune installation requise.

```bash
# Depuis la racine du projet
python3 -m http.server 8000
```

Ouvrez [http://localhost:8000](http://localhost:8000).

> Préférez un serveur local à l'ouverture directe de `index.html` (file://) pour le bon comportement des chemins et du cache CSS.

---

## Modifier le contenu

### Textes traduits

Éditez `assets/js/i18n.js` :

- Objet `fr` : textes français
- Objet `en` : textes anglais

Chaque chaîne est référencée dans le HTML par `data-i18n="cle"`.

Après modification, incrémentez le paramètre de cache dans les pages HTML, par exemple :

```html
<link rel="stylesheet" href="assets/css/style.css?v=20260809">
<script src="assets/js/i18n.js?v=20260809"></script>
```

### Styles

Fichier unique : `assets/css/style.css`. Blocs dédiés par page :

- `.services-page`
- `.approach-page`
- `.team-page`
- `.about-page`

### Ajouter un collaborateur

1. Photo dans `assets/colaborateurs/photo/`
2. Carte profil dans `collaborateurs.html` (copier une carte existante)
3. Clés i18n dans `assets/js/i18n.js`

---

## Publier sur GitHub

### 1. Initialiser le dépôt (première fois)

```bash
cd Cabinet-IvTech-Solutions-main

git init
git add .
git status   # vérifier qu'aucun CV PDF n'est listé
git commit -m "Initial commit — site vitrine Ivoire Tech Solutions"
```

### 2. Créer le dépôt sur GitHub

1. [github.com/new](https://github.com/new)
2. Nom suggéré : `ivtech-solutions-website` ou `Cabinet-IvTech-Solutions`
3. **Ne pas** cocher README / .gitignore (déjà présents localement)
4. Visibilité : **Private** recommandé si vous hébergez des infos internes

### 3. Pousser le code

```bash
git branch -M main
git remote add origin https://github.com/VOTRE-ORG/ivtech-solutions-website.git
git push -u origin main
```

### Fichiers exclus automatiquement (`.gitignore`)

- `.DS_Store`, fichiers éditeur
- `.env` et secrets
- **`assets/colaborateurs/Cv colab/`** — CVs PDF (données personnelles)

---

## Déploiement

Voir **[DEPLOYMENT.md](./DEPLOYMENT.md)** pour Netlify, GitHub Pages ou hébergement FTP.

Configuration Netlify incluse : pas de commande de build, publication à la racine.

---

## À finaliser

Consultez [TODO.md](./TODO.md) pour la liste des éléments restants (formulaire contact, RCCM, photo Jean-Charles, etc.).

---

## Licence

Projet sous licence **MIT** — voir [LICENSE](./LICENSE).

© 2026 Ivoire Tech Solutions SARL — Abidjan, Côte d'Ivoire.
