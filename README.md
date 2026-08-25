# Ivoire Tech Solutions

Cabinet de conseil en data science, intelligence artificielle, solutions IT et cybersécurité, basé à Abidjan, Côte d'Ivoire.

Nous accompagnons banques, télécoms, agro-industries, santé, distribution et secteur public, du cadrage métier jusqu'à la mise en production.

**Nos expertises** — Consulting Data Science · Intelligence Artificielle · Solutions IT sur mesure · Cybersécurité · Formation & Accompagnement

🌍 [ivoiretech-solutions.com](https://ivoiretech-solutions.com) · ✉️ [contact@ivoiretech-solutions.com](mailto:contact@ivoiretech-solutions.com)

Site vitrine officiel d'**IVTECH SOLUTIONS SARLU** (nom commercial : **Ivoire Tech Solutions**) — dépôt du site web statique (HTML, CSS, JS).

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
├── DEPLOYMENT.md              # Guide mise en ligne (Cloudflare Workers)
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

Dépôt : **[IvoireTech-Solutions/IvoireTech-website](https://github.com/IvoireTech-Solutions/IvoireTech-website)** (private, branche `main`).

```bash
cd "/Users/franck.kouassi/Documents/Perso/IvTech Solutions/Cabinet-IvTech-Solutions-main"

git add .
git status   # vérifier qu'aucun CV PDF n'est listé
git commit -m "Description du changement"
git push origin main
```

Chaque push sur `main` déclenche le déploiement automatique sur **Cloudflare Workers** → [ivoiretech-solutions.com](https://ivoiretech-solutions.com).

### Fichiers exclus automatiquement (`.gitignore`)

- `.DS_Store`, fichiers éditeur
- `.env` et secrets
- **`assets/colaborateurs/cv/`** — CV public du fondateur (PDF)
- **`assets/colaborateurs/Cv colab/`** — CVs collaborateurs locaux (exclus par `.gitignore`)

---

## Déploiement

Hébergement : **Cloudflare Workers** (static assets), domaine **[ivoiretech-solutions.com](https://ivoiretech-solutions.com)**.

Voir **[DEPLOYMENT.md](./DEPLOYMENT.md)** pour le workflow complet (push GitHub → déploiement auto, DNS, e-mails Google Workspace).

---

## À finaliser

Consultez [TODO.md](./TODO.md) pour la liste des éléments restants (formulaire contact, RCCM, photo Jean Charles, etc.).

Sécurité : **[SECURITY.md](./SECURITY.md)** — en-têtes HTTP, anti-scraping e-mails, checklist Cloudflare + DMARC.

---

## Licence

Projet sous licence **MIT** — voir [LICENSE](./LICENSE).

© 2026 IVTECH SOLUTIONS SARLU (Ivoire Tech Solutions) — RCCM CI-ABJ-03-2026-B13-09993 — Abidjan, Côte d'Ivoire.
