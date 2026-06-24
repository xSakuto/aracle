(function () {
  'use strict';

  /* Logo mit hellem Subtitle (für dunklen Hintergrund) */
  const LOGO = 'Brand_assets/aracle logo - black.png';

  if (!document.getElementById('footer-styles')) {
    const s = document.createElement('style');
    s.id = 'footer-styles';
    s.textContent = `
footer {
  border-top: 1px solid var(--border);
  padding: 5.5rem 4rem 3.5rem;
  font-family: var(--font, 'Helvetica Neue', Helvetica, Arial, sans-serif);
}
.footer-inner { max-width: 1320px; margin: 0 auto; }
.footer-top {
  display: grid;
  grid-template-columns: 2.4fr 1fr 1fr;
  gap: 3.5rem;
  margin-bottom: 4.5rem;
}
.footer-brand img { height: 3rem; margin-bottom: 1.8rem; opacity: 0.9; display: block; }
.footer-brand p { font-size: 1.3rem; color: var(--text-muted); line-height: 1.72; max-width: 26rem; }
.footer-col h4 {
  font-size: 1.1rem; font-weight: 600; color: rgba(255,255,255,0.5);
  text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1.6rem;
}
.footer-col ul { display: flex; flex-direction: column; gap: 0.9rem; list-style: none; }
.footer-col a { font-size: 1.3rem; color: var(--text-muted); text-decoration: none; transition: color 0.18s; }
.footer-col a:hover { color: var(--text-dim); }
.footer-bottom {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 2.8rem; border-top: 1px solid var(--border);
}
.footer-copy { font-size: 1.2rem; color: var(--text-muted); }
.footer-views {
  font-size: 1.1rem; color: var(--text-muted);
  display: inline-flex; align-items: center; gap: 0.5rem;
}
.footer-views-dot {
  width: 0.5rem; height: 0.5rem; border-radius: 50%;
  background: var(--aqua, #00ffff); opacity: 0.6;
  animation: footer-blink 2.2s ease-in-out infinite;
}
@keyframes footer-blink { 0%,100%{opacity:.6} 50%{opacity:.15} }
.footer-social { display: flex; gap: 1.2rem; }
.footer-social .soc {
  width: 3.2rem; height: 3.2rem; border-radius: 0.7rem;
  border: 1px solid var(--border); display: flex; align-items: center;
  justify-content: center; color: var(--text-muted); text-decoration: none;
  transition: border-color 0.18s, color 0.18s;
}
.footer-social .soc:hover { border-color: var(--border-aqua, rgba(0,255,255,0.18)); color: var(--aqua, #00ffff); }
.footer-social .soc svg { width: 1.5rem; height: 1.5rem; }
.footer-legal { display: flex; gap: 2.4rem; }
.footer-legal a { font-size: 1.2rem; color: var(--text-muted); text-decoration: none; transition: color 0.18s; }
.footer-legal a:hover { color: var(--text-dim); }
@media (max-width: 768px) {
  .footer-top { grid-template-columns: 1fr; }
  .footer-bottom { flex-wrap: wrap; gap: 1.6rem; }
}
    `;
    document.head.appendChild(s);
  }

  const root = document.getElementById('footer-root');
  if (!root) return;

  root.outerHTML = `<footer>
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <img id="footer-logo" src="${LOGO}" alt="Aracle">
        <p>Create. Connect. Inspire. Ein kreatives Netzwerk für Technik, Gaming &amp; Design, aufgebaut von der Community für die Community.</p>
      </div>
      <div class="footer-col">
        <h4>Projekte</h4>
        <ul>
          <li><a href="/projekte#highside">Highside</a></li>
          <li><a href="/projekte#sakuto">Sakuto</a></li>
          <li><a href="/projekte#swizzly">Swizzly</a></li>
          <li><a href="/projekte#araclesmp">AracleSMP</a></li>
          <li><a href="/projekte#cloud">Aracle Cloud</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Aracle</h4>
        <ul>
          <li><a href="/#about">About</a></li>
          <li><a href="/projekte">Projekte</a></li>
          <li><a href="/history">History</a></li>
          <li><a href="https://discord.gg/BgpKdzBYtD">Discord</a></li>
          <li><a href="mailto:kontakt@aracle.io">Kontakt</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p class="footer-copy">&copy; 2025 Aracle. Alle Rechte vorbehalten.</p>
      <div class="footer-social">
        <a href="#" class="soc" aria-label="X / Twitter">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>
        <a href="https://discord.gg/BgpKdzBYtD" class="soc" aria-label="Discord">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.275 1.226-1.963.021-.04.001-.088-.041-.104a13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028z"/></svg>
        </a>
        <a href="#" class="soc" aria-label="Instagram">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
        </a>
      </div>
      <div class="footer-legal">
        <a href="/datenschutz">Datenschutz</a>
        <a href="/impressum">Impressum</a>
      </div>
    </div>
  </div>
</footer>`;

})();
