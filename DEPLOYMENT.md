# Déploiement — Ivoire Tech Solutions

Guide rapide pour mettre le site en ligne après publication sur GitHub.

## Option 1 : Netlify (recommandé)

Le projet est déjà configuré pour Netlify (`netlify.toml` à la racine).

1. Créez un compte sur [netlify.com](https://www.netlify.com).
2. **Add new site → Import an existing project → GitHub**.
3. Sélectionnez le dépôt `Cabinet-IvTech-Solutions`.
4. Paramètres de build :
   - **Build command** : *(laisser vide)*
   - **Publish directory** : `.` (racine)
5. Déployez. Netlify attribue une URL du type `https://xxx.netlify.app`.
6. Domaine personnalisé (optionnel) : **Domain settings → Add custom domain** → `www.ivtechsolutions.ci`.

### Formulaire de contact (Netlify Forms)

Dans `contact.html`, ajoutez sur la balise `<form>` :

```html
<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" id="contactForm" novalidate>
  <input type="hidden" name="form-name" value="contact">
  <p hidden><label>Ne pas remplir : <input name="bot-field"></label></p>
  ...
</form>
```

Les soumissions apparaissent dans **Netlify → Forms**. Vous pouvez activer les notifications par e-mail.

---

## Option 2 : GitHub Pages

1. Sur GitHub : **Settings → Pages**.
2. **Source** : branche `main`, dossier `/ (root)`.
3. Le site sera disponible à `https://<username>.github.io/<repo>/`.

> Mettez à jour les URLs canoniques dans les fichiers HTML (`sitemap.xml`, `robots.txt`, balises `og:url`) si vous changez de domaine.

---

## Option 3 : Hébergement classique (cPanel, OVH, etc.)

Uploadez tout le contenu du dossier (sauf `.git`, `.gitignore`, fichiers de dev) via FTP/SFTP à la racine du domaine.

---

## Checklist avant mise en production

- [ ] URLs canoniques cohérentes (`ivtech-solutions.netlify.app` ou domaine final)
- [ ] Formulaire de contact branché et testé
- [ ] `sitemap.xml` et `robots.txt` à jour
- [ ] Photos collaborateurs présentes (`assets/colaborateurs/photo/`)
- [ ] Hard refresh testé sur mobile et desktop
- [ ] Aucun fichier `.env` ou CV PDF dans le dépôt public
