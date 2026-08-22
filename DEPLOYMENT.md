# Déploiement — Ivoire Tech Solutions

Guide de mise en ligne et de maintenance du site vitrine.

## Hébergement actuel : Cloudflare Workers (Static Assets)

| Élément | Valeur |
|---------|--------|
| Projet Cloudflare | `ivoiretech-website` |
| URL de test | `ivoiretech-website.kfranckkevin.workers.dev` |
| Domaine production | [ivoiretech-solutions.com](https://ivoiretech-solutions.com) |
| Domaine défensif | `ivoire-tech-solutions.com` → redirect 301 vers le principal |
| Dépôt GitHub | [IvoireTech-Solutions/IvoireTech-website](https://github.com/IvoireTech-Solutions/IvoireTech-website) (private) |
| Branche | `main` |
| Déploiement | Automatique à chaque `git push` sur `main` |

### Modifier et publier le site

```bash
cd "/Users/franck.kouassi/Documents/Perso/IvTech Solutions/Cabinet-IvTech-Solutions-main"

# 1. Modifier les fichiers HTML / CSS / JS
# 2. Vérifier en local (optionnel)
python3 -m http.server 8000

# 3. Commit + push → déploiement Cloudflare automatique
git add .
git commit -m "Description du changement"
git push origin main
```

> **Ne pas modifier** les enregistrements DNS mail (MX, SPF, DKIM) lors des changements web sur Cloudflare.

---

## DNS & e-mails (Cloudflare + Google Workspace)

| Type | Nom | Usage |
|------|-----|-------|
| MX | `@` | Gmail (`smtp.google.com`) |
| TXT | `@` | SPF + Google site verification |
| TXT | `google._domainkey` | DKIM |
| Workers | custom domain | Site web |

| E-mail | Rôle |
|--------|------|
| `franck.kouassi@ivoiretech-solutions.com` | Compte admin / fondateur |
| `contact@ivoiretech-solutions.com` | Alias contact (site web) |

---

## Lancer en local

```bash
python3 -m http.server 8000
```

Ouvrir [http://localhost:8000](http://localhost:8000).

---

## Formulaire de contact

Le formulaire ouvre le client mail de l'utilisateur avec un message pré-rempli vers `contact@ivoiretech-solutions.com`.

Pour un envoi **sans ouvrir le client mail** (recommandé à terme), options compatibles Cloudflare Workers :

- **[Formspree](https://formspree.io)** — gratuit jusqu'à 50 envois/mois
- **[Web3Forms](https://web3forms.com)** — gratuit, clé API simple
- **Cloudflare Worker custom** — endpoint POST + envoi via API Gmail/SendGrid

---

## Anciennes options (non utilisées)

<details>
<summary>Netlify — abandonné (repo private = plan payant)</summary>

Le fichier `netlify.toml` est conservé à titre historique mais n'est plus utilisé.
</details>

<details>
<summary>GitHub Pages / FTP</summary>

Toujours possibles en upload manuel, mais le workflow Cloudflare + GitHub est préféré.
</details>

---

## Checklist avant mise en production

- [x] URLs canoniques cohérentes (`https://ivoiretech-solutions.com`)
- [x] Domaine production actif
- [x] E-mails pro configurés (Google Workspace)
- [x] Redirect 301 `ivoire-tech-solutions.com` → domaine principal
- [ ] Formulaire contact testé (client mail ou service tiers)
- [x] `sitemap.xml` et `robots.txt` à jour
- [ ] Soumettre le sitemap dans Google Search Console
- [ ] Photos collaborateurs complètes
- [ ] Hard refresh testé mobile + desktop
