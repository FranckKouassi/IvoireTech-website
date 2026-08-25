/**
 * Page CV fondateur — consultation en ligne (sans lien de téléchargement).
 */
(function () {
    'use strict';

    const viewer = document.getElementById('cv-viewer');
    if (!viewer) return;

    viewer.addEventListener('contextmenu', (e) => e.preventDefault());

    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
            e.preventDefault();
        }
    });
})();
