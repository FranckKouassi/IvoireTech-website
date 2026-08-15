/**
 * Hero — Réseau neuronal animé + mascotte survolant les 6 secteurs
 * (sans rotation mascotte)
 */
(function () {
    'use strict';
    const canvas = document.getElementById('hero-canvas');
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    const host = canvas.parentElement;
    const ONE_WAY_MS = 10000;
    const NET_SPEED = 0.38;

    const C = {
        blue: [31, 111, 178],
        teal: [15, 118, 110],
        gold: [240, 194, 122],
        orange: [255, 140, 0],
        green: [0, 158, 96],
        white: [255, 255, 255],
        navy: [15, 42, 68]
    };

    const SECTORS = [
        { label: 'Finance', short: 'Banque & risque' },
        { label: 'Télécoms', short: 'Réseau & churn' },
        { label: 'Agriculture', short: 'Prévision & climat' },
        { label: 'Santé', short: 'Parcours & stocks' },
        { label: 'Commerce', short: 'Demande & client' },
        { label: 'Énergie', short: 'Public & conso' }
    ];

    let w, h, tick = 0, raf = 0, running = true, startTs = 0;
    // Parallaxe : cible visée par le pointeur, puis valeur lissée (inertie).
    let pointerTX = 0, pointerTY = 0, pointerX = 0, pointerY = 0;
    let sectors = [];
    let particles = [];
    let trail = [];
    let logo = null;
    let logoReady = false;
    let netNodes = [];
    let netEdges = [];
    let netSignals = [];

    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

    function logoCandidates() {
        const fromAttr = canvas.getAttribute('data-logo');
        const list = [];
        if (fromAttr) list.push(fromAttr);
        list.push(
            '../assets/images/IvTech-Logo-Symbole-Couleur.svg',
            'assets/images/IvTech-Logo-Symbole-Couleur.svg',
            '/assets/images/IvTech-Logo-Symbole-Couleur.svg'
        );
        return list;
    }

    function loadLogo(paths, i) {
        if (i >= paths.length) return;
        logo = new Image();
        logo.decoding = 'async';
        logo.onload = () => { logoReady = true; };
        logo.onerror = () => loadLogo(paths, i + 1);
        logo.src = paths[i];
    }

    function initNetwork() {
        netNodes = [];
        netEdges = [];
        // Plus dense / plus imposant — 6 couches
        const layers = [7, 11, 14, 12, 9, 5];
        layers.forEach((count, li) => {
            for (let i = 0; i < count; i++) {
                const t = count === 1 ? 0.5 : i / (count - 1);
                netNodes.push({
                    x: (li - 2.4) * 1.2,
                    y: (t - 0.5) * 3.15,
                    z: (Math.random() - 0.5) * 0.35,
                    layer: li,
                    pulse: Math.random() * Math.PI * 2,
                    color: li === 0 ? C.blue : li === layers.length - 1 ? C.teal : (li % 2 ? C.gold : C.blue)
                });
            }
        });
        netNodes.forEach((a, i) => {
            netNodes.forEach((b, j) => {
                if (j <= i) return;
                if (b.layer === a.layer + 1 && Math.random() > 0.18) {
                    netEdges.push({ a: i, b: j, w: 0.4 + Math.random() * 0.55 });
                } else if (b.layer === a.layer + 2 && Math.random() > 0.82) {
                    // Quelques sauts de couche pour densifier
                    netEdges.push({ a: i, b: j, w: 0.2 + Math.random() * 0.3 });
                }
            });
        });
        netSignals = Array.from({ length: 28 }, () => ({
            e: Math.floor(Math.random() * Math.max(1, netEdges.length)),
            t: Math.random(),
            sp: (0.0022 + Math.random() * 0.0035) * NET_SPEED
        }));
    }

    function projectNet(n) {
        // FOV large + proche → réseau dominant sur la moitié droite
        // Clamp z > 0 : évite division/gradient invalides qui cassaient la boucle RAF
        const fov = 580;
        const z = Math.max(0.85, n.z + 2.2);
        const s = fov / z;
        // Les nœuds proches réagissent davantage au pointeur : la profondeur
        // se lit sans avoir à faire tourner le réseau plus vite.
        const depth = 2.6 / z;
        return {
            x: w * 0.58 + n.x * s * 1.35 + pointerX * 26 * depth,
            y: h * 0.38 + n.y * s * 1.2 + pointerY * 18 * depth,
            s,
            z
        };
    }

    function resize() {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        w = host.clientWidth;
        h = host.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        initNetwork();

        const baseY = h * 0.74;
        const left = w * 0.40;
        const right = w * 0.94;
        const span = right - left;

        sectors = SECTORS.map((s, i) => {
            const t = i / (SECTORS.length - 1);
            return {
                ...s,
                x: left + span * t,
                y: baseY - Math.sin(t * Math.PI) * h * 0.05,
                r: Math.max(16, Math.min(26, w * 0.016)),
                hue: [C.blue, C.teal, C.gold, C.orange, C.green, C.blue][i]
            };
        });
    }

    function progressAt(now) {
        // Boucle infinie aller-retour : période = 2 * ONE_WAY_MS
        const period = ONE_WAY_MS * 2;
        const elapsed = ((now - startTs) % period + period) % period;
        const cycle = elapsed / ONE_WAY_MS; // 0..2
        const forward = cycle < 1;
        const raw = Math.min(0.999999, Math.max(0, forward ? cycle : 2 - cycle));
        const n = sectors.length;
        if (n < 2) return { u: 0, active: 0, forward: true, dwell: false };

        const dwellW = 0.7;
        const moveW = 2.8;
        const phases = [];
        for (let i = 0; i < n; i++) {
            phases.push({ type: 'dwell', index: i, w: dwellW });
            if (i < n - 1) phases.push({ type: 'move', from: i, to: i + 1, w: moveW });
        }
        const totalW = phases.reduce((s, p) => s + p.w, 0);
        let pos = raw * totalW;

        for (let p = 0; p < phases.length; p++) {
            const ph = phases[p];
            if (pos > ph.w && p < phases.length - 1) {
                pos -= ph.w;
                continue;
            }
            const localPos = Math.min(pos, ph.w);
            if (ph.type === 'dwell') {
                return { u: ph.index / (n - 1), active: ph.index, forward, dwell: true };
            }
            const t = easeInOut(localPos / ph.w);
            return {
                u: (ph.from + t) / (n - 1),
                active: t < 0.5 ? ph.from : ph.to,
                forward,
                dwell: false
            };
        }
        return { u: forward ? 1 : 0, active: forward ? n - 1 : 0, forward, dwell: true };
    }

    function mascotPose(now) {
        if (!sectors.length) {
            return { x: w * 0.7, y: h * 0.4, active: 0, dwell: false };
        }

        const { u, active, dwell } = progressAt(now);
        const max = sectors.length - 1;
        const f = Math.min(max, Math.max(0, u * max));
        const i0 = Math.min(max - 1, Math.floor(f));
        const i1 = Math.min(max, i0 + 1);
        const local = f - i0;
        const a = sectors[i0];
        const b = sectors[i1];
        if (!a || !b) {
            return { x: sectors[0].x, y: sectors[0].y - h * 0.17, active: 0, dwell: true };
        }

        const x = a.x + (b.x - a.x) * local;
        const base = a.y + (b.y - a.y) * local;
        const bob = Math.sin(now * 0.003) * (dwell ? 5 : 8);
        const y = base - h * 0.17 + bob;

        return { x, y, active: Math.max(0, Math.min(max, active)), dwell };
    }

    function drawNeuralNet() {
        // Halo d’ambiance plus large
        const g = ctx.createRadialGradient(w * 0.62, h * 0.38, 0, w * 0.62, h * 0.38, w * 0.58);
        g.addColorStop(0, rgba(C.blue, 0.22));
        g.addColorStop(0.45, rgba(C.teal, 0.08));
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);

        const rot = tick * 0.00105 * NET_SPEED;
        const cos = Math.cos(rot);
        const sin = Math.sin(rot);

        const projected = netNodes.map((n) => {
            const x = n.x * cos - n.z * sin;
            const z = n.x * sin + n.z * cos;
            return projectNet({
                x,
                y: n.y + Math.sin(tick * 0.008 * NET_SPEED + n.pulse) * 0.05,
                z,
                color: n.color,
                pulse: n.pulse
            });
        });

        // Connexions — plus visibles
        netEdges.forEach((e) => {
            const A = projected[e.a];
            const B = projected[e.b];
            if (!A || !B) return;
            ctx.strokeStyle = rgba(C.white, 0.07 + e.w * 0.12);
            ctx.lineWidth = 0.85 + e.w * 0.4;
            ctx.beginPath();
            ctx.moveTo(A.x, A.y);
            ctx.lineTo(B.x, B.y);
            ctx.stroke();
        });

        // Signaux — plus nombreux, trail léger
        netSignals.forEach((s) => {
            const e = netEdges[s.e];
            if (!e) return;
            s.t += s.sp;
            if (s.t >= 1) {
                s.t = 0;
                s.e = Math.floor(Math.random() * netEdges.length);
            }
            const A = projected[e.a];
            const B = projected[e.b];
            if (!A || !B) return;
            const x = A.x + (B.x - A.x) * s.t;
            const y = A.y + (B.y - A.y) * s.t;
            const fade = Math.sin(s.t * Math.PI);
            const trailX = A.x + (B.x - A.x) * Math.max(0, s.t - 0.08);
            const trailY = A.y + (B.y - A.y) * Math.max(0, s.t - 0.08);
            ctx.strokeStyle = rgba(C.gold, fade * 0.35);
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(trailX, trailY);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.fillStyle = rgba(C.gold, fade * 0.95);
            ctx.beginPath();
            ctx.arc(x, y, 2.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = rgba(C.white, fade * 0.55);
            ctx.beginPath();
            ctx.arc(x, y, 1.1, 0, Math.PI * 2);
            ctx.fill();
        });

        projected.forEach((p, i) => {
            const n = netNodes[i];
            const glow = 0.35 + 0.28 * Math.sin(tick * 0.015 * NET_SPEED + n.pulse);
            const r = Math.max(1.5, 2.8 + 4.2 / p.z);
            if (!Number.isFinite(p.x) || !Number.isFinite(p.y) || !Number.isFinite(r)) return;
            const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 6.5);
            halo.addColorStop(0, rgba(n.color, glow * 0.5));
            halo.addColorStop(0.45, rgba(n.color, glow * 0.12));
            halo.addColorStop(1, 'transparent');
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r * 6.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = rgba(n.color, 0.65 + glow * 0.35);
            ctx.beginPath();
            ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = rgba(C.white, 0.35 + glow * 0.25);
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(1, r * 0.35), 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawPath() {
        if (!sectors.length) return;
        ctx.beginPath();
        ctx.strokeStyle = rgba(C.white, 0.12);
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.moveTo(sectors[0].x, sectors[0].y);
        for (let i = 1; i < sectors.length; i++) {
            const p = sectors[i - 1];
            const s = sectors[i];
            const mx = (p.x + s.x) / 2;
            const my = (p.y + s.y) / 2 - 12;
            ctx.quadraticCurveTo(mx, my, s.x, s.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }

    function drawSectors(activeIdx, now) {
        sectors.forEach((s, i) => {
            const active = i === activeIdx;
            const pulse = 0.5 + 0.5 * Math.sin(now * 0.005 + i);
            const r = s.r * (active ? 1.2 : 1);

            const disc = ctx.createRadialGradient(s.x, s.y, 2, s.x, s.y, r * 2.6);
            disc.addColorStop(0, rgba(s.hue, active ? 0.55 : 0.16));
            disc.addColorStop(0.5, rgba(C.navy, active ? 0.4 : 0.18));
            disc.addColorStop(1, 'transparent');
            ctx.fillStyle = disc;
            ctx.beginPath();
            ctx.arc(s.x, s.y, r * 2.6, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.strokeStyle = rgba(s.hue, active ? 0.85 : 0.3 + pulse * 0.15);
            ctx.lineWidth = active ? 2.2 : 1.1;
            ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
            ctx.stroke();

            ctx.beginPath();
            ctx.fillStyle = rgba(C.white, active ? 0.95 : 0.4);
            ctx.arc(s.x, s.y, active ? 3.8 : 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.save();
            ctx.textAlign = 'center';
            ctx.font = `600 ${Math.max(10, Math.min(12, w * 0.011))}px Sora, Inter, system-ui, sans-serif`;
            ctx.fillStyle = rgba(C.white, active ? 0.95 : 0.5);
            ctx.fillText(s.label, s.x, s.y + r + 16);
            if (active) {
                ctx.font = `500 ${Math.max(9, Math.min(10, w * 0.009))}px Inter, system-ui, sans-serif`;
                ctx.fillStyle = rgba(C.gold, 0.8);
                ctx.fillText(s.short, s.x, s.y + r + 30);
            }
            ctx.restore();
        });
    }

    function emitParticles(pose) {
        const s = sectors[pose.active];
        if (!s) return;
        if (Math.random() < (pose.dwell ? 0.55 : 0.35)) {
            particles.push({
                x: pose.x + (Math.random() - 0.5) * 24,
                y: pose.y + 18,
                tx: s.x + (Math.random() - 0.5) * 14,
                ty: s.y,
                life: 1,
                color: Math.random() > 0.45 ? C.gold : C.teal
            });
        }
        trail.push({ x: pose.x, y: pose.y + 8, life: 1 });
        if (trail.length > 36) trail.shift();
        if (particles.length > 90) particles.splice(0, particles.length - 90);
    }

    function drawParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= 0.02;
            p.x += (p.tx - p.x) * 0.06;
            p.y += (p.ty - p.y) * 0.06;
            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }
            ctx.beginPath();
            ctx.fillStyle = rgba(p.color, p.life * 0.75);
            ctx.arc(p.x, p.y, 1.8 * p.life, 0, Math.PI * 2);
            ctx.fill();
        }
        trail.forEach((t) => {
            t.life -= 0.035;
            if (t.life <= 0) return;
            ctx.beginPath();
            ctx.fillStyle = rgba(C.gold, t.life * 0.28);
            ctx.arc(t.x, t.y, 2.2 * t.life, 0, Math.PI * 2);
            ctx.fill();
        });
        trail = trail.filter((t) => t.life > 0);
    }

    function drawBeam(pose) {
        const s = sectors[pose.active];
        if (!s) return;
        const g = ctx.createLinearGradient(pose.x, pose.y + 24, s.x, s.y);
        g.addColorStop(0, rgba(C.gold, pose.dwell ? 0.5 : 0.28));
        g.addColorStop(0.55, rgba(C.teal, 0.2));
        g.addColorStop(1, rgba(s.hue, 0.08));
        ctx.strokeStyle = g;
        ctx.lineWidth = pose.dwell ? 2 : 1.4;
        ctx.beginPath();
        ctx.moveTo(pose.x, pose.y + 26);
        ctx.quadraticCurveTo((pose.x + s.x) / 2, (pose.y + s.y) / 2 + 18, s.x, s.y);
        ctx.stroke();
    }

    function drawMascot(pose) {
        const size = Math.max(70, Math.min(105, w * 0.085));

        const aura = ctx.createRadialGradient(pose.x, pose.y + 6, 4, pose.x, pose.y + 6, size * 0.9);
        aura.addColorStop(0, rgba(C.gold, pose.dwell ? 0.32 : 0.2));
        aura.addColorStop(0.45, rgba(C.blue, 0.12));
        aura.addColorStop(1, 'transparent');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(pose.x, pose.y + 6, size * 0.9, 0, Math.PI * 2);
        ctx.fill();

        const shadowY = sectors[pose.active] ? sectors[pose.active].y + 34 : pose.y + size;
        ctx.save();
        ctx.translate(pose.x, shadowY);
        ctx.scale(1, 0.28);
        ctx.beginPath();
        ctx.fillStyle = rgba(C.navy, 0.4);
        ctx.arc(0, 0, size * 0.32, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Toujours droite : pas de rotation ni de flip
        if (logoReady && logo) {
            ctx.globalAlpha = 0.97;
            ctx.drawImage(logo, pose.x - size / 2, pose.y - size / 2, size, size);
            ctx.globalAlpha = 1;
        } else {
            ctx.fillStyle = rgba(C.navy, 0.9);
            ctx.beginPath();
            ctx.moveTo(pose.x, pose.y - size * 0.4);
            ctx.lineTo(pose.x + size * 0.36, pose.y + size * 0.3);
            ctx.lineTo(pose.x - size * 0.36, pose.y + size * 0.3);
            ctx.closePath();
            ctx.fill();
        }
    }

    function draw(now) {
        if (!running) return;
        if (!startTs) startTs = now;

        // Inertie du parallaxe : le réseau rattrape le pointeur, il ne le colle pas.
        pointerX += (pointerTX - pointerX) * 0.045;
        pointerY += (pointerTY - pointerY) * 0.045;

        try {
            ctx.clearRect(0, 0, w, h);
            drawNeuralNet();

            // Sous 900 px, la scène narrative (parcours + mascotte + libellés
            // de secteurs) empiétait sur le titre et les boutons. On ne garde
            // que le réseau neuronal, qui reste un fond, pas un contenu.
            if (w >= 900) {
                const pose = mascotPose(now);
                if (Number.isFinite(pose.x) && Number.isFinite(pose.y)) {
                    drawPath();
                    drawSectors(pose.active, now);
                    emitParticles(pose);
                    drawBeam(pose);
                    drawParticles();
                    drawMascot(pose);
                }
            }
        } catch (err) {
            // Ne jamais laisser une erreur canvas tuer la boucle
        }

        tick++;
        raf = requestAnimationFrame(draw);
    }

    function start() {
        cancelAnimationFrame(raf);
        resize();
        loadLogo(logoCandidates(), 0);
        startTs = 0;
        running = true;
        raf = requestAnimationFrame(draw);
    }

    const ro = new ResizeObserver(() => {
        resize();
    });
    ro.observe(host);

    /* Parallaxe au pointeur — souris et trackpad uniquement.
       Le hero réagit à la présence sans jamais bouger assez pour gêner
       la lecture du titre. */
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        host.addEventListener('pointermove', (e) => {
            const rect = host.getBoundingClientRect();
            pointerTX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            pointerTY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        }, { passive: true });

        host.addEventListener('pointerleave', () => {
            pointerTX = 0;
            pointerTY = 0;
        });
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            running = false;
            cancelAnimationFrame(raf);
        } else {
            // Reprendre sans casser la phase de boucle
            const period = ONE_WAY_MS * 2;
            const offset = startTs ? ((performance.now() - startTs) % period + period) % period : 0;
            startTs = performance.now() - offset;
            running = true;
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(draw);
        }
    });

    // Pause seulement si le hero est vraiment hors écran (économise CPU)
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting) {
                if (!running) {
                    running = true;
                    cancelAnimationFrame(raf);
                    raf = requestAnimationFrame(draw);
                }
            } else {
                running = false;
                cancelAnimationFrame(raf);
            }
        });
    }, { threshold: 0.01 });
    io.observe(host);

    start();
})();
