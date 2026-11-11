// Vorschau-Skript des Arbeitsplatzes (F1.6, «Zeigen» und «Text»). Läuft in der Seite der Person im lokalen Dev-Server, nur wenn
// sie im iframe des Arbeitsplatzes steckt. Astro markiert im Dev-Modus jedes Element mit data-astro-source-file und
// data-astro-source-loc (astro/dist/core/compile/compile.js, annotateSourceFile), entfernt sie im Browser aber wieder (Werkzeugleiste,
// App «Audit», gemessen mit Astro 7.4.7); die Integration albatros-vorschau sichert sie vorher als data-albatros-source-file und -loc.
// Gelesen wird zuerst die Sicherung. Nachrichten gehen nur an den Ursprung, von dem dieses Skript geladen wurde (der Arbeitsplatz auf
// 127.0.0.1), und nur von dort werden Befehle angenommen.
(() => {
  if (window.parent === window || window.__albatrosVorschau) return;
  window.__albatrosVorschau = true;
  const eigen = document.currentScript && document.currentScript.src ? new URL(document.currentScript.src).origin : null;
  if (!eigen || !/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(eigen)) return;

  let modus = 'aus';
  let markiert = null;
  let bearbeitet = null;
  let alterText = '';

  const stil = document.createElement('style');
  stil.textContent = `
    .albatros-markiert { outline: 2px solid #2f6df6 !important; outline-offset: 2px !important; cursor: pointer !important; }
    .albatros-tippen { outline: 2px dashed #2f6df6 !important; outline-offset: 2px !important; cursor: text !important; }
    html.albatros-zeigen, html.albatros-zeigen * { cursor: crosshair !important; }`;
  document.head.appendChild(stil);

  const senden = (nachricht) => window.parent.postMessage({ quelle: 'albatros-vorschau', ...nachricht }, eigen);
  const quelleVon = (el) => {
    const q = el && el.closest ? el.closest('[data-albatros-source-file], [data-astro-source-file]') : null;
    if (!q) return null;
    const datei = q.getAttribute('data-albatros-source-file') || q.getAttribute('data-astro-source-file');
    const [zeile, spalte] = String(q.getAttribute('data-albatros-source-loc') || q.getAttribute('data-astro-source-loc') || '').split(':');
    return { el: q, datei, zeile: Number(zeile) || null, spalte: Number(spalte) || null };
  };
  const rechteck = (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), b: Math.round(r.width), h: Math.round(r.height) };
  };
  const nurText = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && !el.querySelector('img,video,svg,iframe,input,textarea,select');

  function markieren(el) {
    if (markiert && markiert !== el) markiert.classList.remove('albatros-markiert', 'albatros-tippen');
    markiert = el;
    if (el) el.classList.add(modus === 'text' ? 'albatros-tippen' : 'albatros-markiert');
  }

  function textFertig(behalten) {
    if (!bearbeitet) return;
    const el = bearbeitet;
    bearbeitet = null;
    el.removeAttribute('contenteditable');
    const neu = el.innerText.trim();
    if (!behalten || neu === alterText.trim()) {
      el.innerText = alterText;
      return;
    }
    const q = quelleVon(el);
    if (q) senden({ aktion: 'text', datei: q.datei, zeile: q.zeile, spalte: q.spalte, alt: alterText.trim(), neu });
  }

  document.addEventListener('mouseover', (e) => {
    if (modus === 'aus' || bearbeitet) return;
    const q = quelleVon(e.target);
    if (!q) return markieren(null);
    if (modus === 'text' && !nurText(q.el)) return markieren(null);
    markieren(q.el);
  }, true);

  document.addEventListener('click', (e) => {
    if (modus === 'aus') return;
    if (bearbeitet && bearbeitet.contains(e.target)) return;
    e.preventDefault();
    e.stopPropagation();
    const q = quelleVon(e.target);
    if (!q) return;
    if (modus === 'zeigen') {
      const img = q.el.tagName === 'IMG' ? q.el : q.el.querySelector('img');
      senden({
        aktion: 'gezeigt', datei: q.datei, zeile: q.zeile, spalte: q.spalte, tag: q.el.tagName.toLowerCase(),
        text: (q.el.innerText || '').trim().slice(0, 300), bild: img ? img.getAttribute('src') : null, rechteck: rechteck(q.el),
      });
    } else if (modus === 'text' && nurText(q.el)) {
      textFertig(true);
      bearbeitet = q.el;
      alterText = q.el.innerText;
      q.el.setAttribute('contenteditable', 'true');
      q.el.focus();
    }
  }, true);

  document.addEventListener('keydown', (e) => {
    if (!bearbeitet) return;
    if (e.key === 'Escape') { e.preventDefault(); textFertig(false); }
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); textFertig(true); }
  }, true);
  document.addEventListener('focusout', (e) => { if (bearbeitet && e.target === bearbeitet) textFertig(true); }, true);

  window.addEventListener('message', (e) => {
    if (e.origin !== eigen || !e.data || e.data.quelle !== 'albatros-arbeitsplatz') return;
    if (e.data.aktion === 'modus' && ['aus', 'zeigen', 'text'].includes(e.data.modus)) {
      textFertig(true);
      modus = e.data.modus;
      markieren(null);
      document.documentElement.classList.toggle('albatros-zeigen', modus === 'zeigen');
    }
  });

  senden({ aktion: 'bereit', pfad: location.pathname, titel: document.title });
})();
