# TODO — Ivoire Tech Solutions

## Fait

- [x] Architecture multi-pages (6 pages)
- [x] Bilingue FR / EN (`assets/js/i18n.js`)
- [x] Mode sombre / clair
- [x] Design tech / pro (blueprint, icônes, cartes) — Services, Approche, Collaborateurs, À propos
- [x] Page Collaborateurs : 5 profils unifiés
- [x] SEO : Open Graph, Twitter, JSON-LD, sitemap, robots.txt
- [x] Responsive + accessibilité de base
- [x] Domaine & e-mails pro : `ivoiretech-solutions.com`, `contact@ivoiretech-solutions.com`
- [x] Hébergement Cloudflare Workers + déploiement auto via GitHub (`main`)
- [x] Redirect 301 `ivoire-tech-solutions.com` → domaine principal
- [x] Google Workspace (Gmail pro)
- [x] Protections sécurité : en-têtes HTTP, obfuscation e-mails, anti-bot formulaire — voir `SECURITY.md`

## À faire / à fournir

- [ ] Activer Bot Fight Mode + DMARC dans Cloudflare — voir `SECURITY.md`
- [ ] Formulaire contact sans client mail (Formspree ou Web3Forms) — voir `DEPLOYMENT.md`
- [ ] Photo Jean-Charles Koua (`assets/colaborateurs/photo/photo-jean-charles-koua.jpg`)
- [ ] Numéro de téléphone à afficher (+225 …)
- [ ] RCCM à compléter dans les pages légales
- [ ] LinkedIn Affoué Yao (si souhaité)
- [ ] Soumettre `sitemap.xml` dans Google Search Console
- [ ] Études de cas / réalisations clients (quand disponibles)
- [ ] Harmoniser la section équipe de la page d'accueil avec la page Collaborateurs

## Notes dépôt GitHub

- Les **CV PDF** restent en local (`assets/colaborateurs/Cv colab/`) — exclus par `.gitignore`
- Dépôt **privé** : `github.com/IvoireTech-Solutions/IvoireTech-website`
- **Push sur `main`** → déploiement automatique Cloudflare Workers
