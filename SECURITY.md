# Sécurité — Ivoire Tech Solutions

Guide des protections en place et actions à faire dans **Cloudflare** et **Google Admin**.

---

## Protections déjà dans le code

| Mesure | Fichier | Effet |
|--------|---------|-------|
| En-têtes HTTP sécurisés (HSTS, CSP, X-Frame-Options…) | `_headers` | Anti-clickjacking, MIME sniffing, injection |
| E-mails obfusqués (pas de `mailto:` en clair) | `assets/js/security.js` | Réduit le scraping automatique d'adresses |
| Honeypot + délai minimum formulaire | `contact.html`, `main.js` | Bloque une partie des bots |
| `rel="nofollow"` sur liens e-mail | `security.js` | Limite le suivi par certains crawlers |

---

## Cloudflare Dashboard — à activer manuellement

Connexion : [dash.cloudflare.com](https://dash.cloudflare.com) → domaine `ivoiretech-solutions.com`

### 1. Bot Fight Mode (gratuit)

**Security → Bots → Bot Fight Mode → ON**

Bloque une partie du trafic automatisé malveillant.

### 2. Security Level

**Security → Settings → Security Level → Medium** (ou High si vous recevez des attaques)

### 3. Rate Limiting (recommandé)

**Security → WAF → Rate limiting rules**

Exemple :

| Champ | Valeur |
|-------|--------|
| Nom | `Limit contact & scraping` |
| Expression | `(http.request.uri.path contains "contact") or (http.user_agent contains "bot")` |
| Requêtes | 30 / minute / IP |
| Action | Block ou Managed Challenge |

### 4. WAF — règles gérées

**Security → WAF → Managed rules → Cloudflare Managed Ruleset → ON**

### 5. SSL/TLS

**SSL/TLS → Overview → Full (strict)**

**SSL/TLS → Edge Certificates → Always Use HTTPS → ON**

**SSL/TLS → Edge Certificates → Automatic HTTPS Rewrites → ON**

### 6. Scrape Shield

**Scrape Shield → Email Address Obfuscation → ON** (couche supplémentaire si Pages/Proxy)

**Scrape Shield → Hotlink Protection → ON** (images)

### 7. Cloudflare Turnstile (optionnel, formulaire)

Pour un CAPTCHA invisible sur le formulaire contact :

1. **Turnstile → Add site** → domaine `ivoiretech-solutions.com`
2. Copier la **Site Key** dans `contact.html` (widget commenté en bas du fichier)
3. Vérification côté serveur nécessite un Worker — à brancher avec Formspree/Web3Forms

---

## E-mails — protection contre le spoofing (DNS)

Vérifier dans **Cloudflare DNS** pour `ivoiretech-solutions.com` :

| Enregistrement | Statut attendu |
|----------------|----------------|
| **SPF** (TXT `@`) | `v=spf1 include:_spf.google.com ~all` ✅ |
| **DKIM** (TXT `google._domainkey`) | Clé Google Workspace ✅ |
| **DMARC** (TXT `_dmarc`) | ⚠️ **À ajouter si absent** |

### DMARC recommandé (à ajouter)

```
Type : TXT
Nom  : _dmarc
Valeur : v=DMARC1; p=quarantine; rua=mailto:franck.kouassi@ivoiretech-solutions.com; pct=100; adkim=s; aspf=s
```

Après 2–4 semaines sans problème, passer à `p=reject` pour bloquer totalement l'usurpation.

### Bonnes pratiques Google Workspace

- Activer **2FA** sur `franck.kouassi@ivoiretech-solutions.com`
- Ne jamais publier `franck.kouassi@...` sur le site public
- Utiliser uniquement `contact@...` (alias) côté vitrine
- Vérifier régulièrement **admin.google.com → Rapports → Audit e-mail**

---

## Domaine défensif

`ivoire-tech-solutions.com` → redirect 301 ✅ (empêche0squatting et phishing sur variante proche)

---

## Limites honnêtes

- **Aucune protection n'est absolue** : un humain motivé peut toujours lire l'e-mail affiché à l'écran.
- L'obfuscation bloque surtout les **bots** qui parsent le HTML.
- Le **DMARC + SPF + DKIM** protège contre l'**envoi frauduleux** depuis votre domaine (phishing au nom de votre entreprise).
- Pour un formulaire 100 % fiable sans client mail : migrer vers **Formspree** ou **Web3Forms** + Turnstile.

---

## Audit rapide après déploiement

```bash
curl -sI https://ivoiretech-solutions.com/ | grep -iE 'strict-transport|content-security|x-frame|x-content'
```

Tester les e-mails : affichage correct après chargement JS, formulaire contact fonctionnel.
