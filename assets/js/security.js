/**
 * Ivoire Tech Solutions — Protection e-mails & anti-scraping basique
 * Les adresses ne sont pas en clair dans le HTML source.
 */
(function (global) {
    'use strict';

    /** E-mail contact cabinet (encodé — ne pas mettre en clair dans le HTML) */
    var CONTACT_ENC = '=02bj5ycu9Wa0VHbvNXLoNWZ0Vmcp9mdpBEdjFGdu92Y';

    function decodeEmail(encoded) {
        if (!encoded) return '';
        try {
            return atob(encoded.split('').reverse().join(''));
        } catch (e) {
            return '';
        }
    }

    function protectEmailLinks() {
        document.querySelectorAll('.js-protected-email[data-e]').forEach(function (el) {
            var email = decodeEmail(el.getAttribute('data-e'));
            if (!email) return;
            el.href = 'mailto:' + email;
            el.setAttribute('rel', 'nofollow noopener');
            if (el.hasAttribute('data-show-text')) {
                var span = el.querySelector('span');
                if (span) span.textContent = email;
                else el.textContent = email;
            }
        });
    }

    /** Détecte soumission trop rapide ou honeypot rempli (bots) */
    function isBotSubmission(form) {
        var hp = form.querySelector('[name="website"]');
        if (hp && hp.value.trim() !== '') return true;
        var ts = form.querySelector('[name="_form_ts"]');
        if (ts && ts.value) {
            var elapsed = Date.now() - parseInt(ts.value, 10);
            if (elapsed < 3000) return true;
        }
        return false;
    }

    function initContactFormGuard() {
        var form = document.getElementById('contactForm');
        if (!form) return;
        var ts = form.querySelector('[name="_form_ts"]');
        if (ts) ts.value = String(Date.now());
    }

    global.IvoireTechSecurity = {
        decodeEmail: decodeEmail,
        getContactEmail: function () { return decodeEmail(CONTACT_ENC); },
        isBotSubmission: isBotSubmission,
        initContactFormGuard: initContactFormGuard
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            protectEmailLinks();
            initContactFormGuard();
        });
    } else {
        protectEmailLinks();
        initContactFormGuard();
    }
})(window);
