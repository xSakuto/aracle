(function () {
  'use strict';

  /* Logo mit hellem Subtitle (für dunklen Hintergrund) */
  const LOGO = 'Brand_assets/aracle logo - black.png';

  function isActive(href) {
    const p = window.location.pathname;
    if (href === '/') return (p === '/' || p === '/index.html') ? 'class="active"' : '';
    return (p === href || p === href + '.html') ? 'class="active"' : '';
  }

  const root = document.getElementById('nav-root');
  if (!root) return;

  root.outerHTML = `<nav id="navbar">
  <a href="/" class="nav-logo">
    <img id="nav-logo-img" src="${LOGO}" alt="Aracle">
  </a>
  <div class="nav-center">
    <a href="/" ${isActive('/')}>Home</a>
    <a href="/projekte" ${isActive('/projekte')}>Projekte</a>
    <a href="/team" ${isActive('/team')}>Team</a>
    <a href="/#about">About</a>
    <a href="https://discord.gg/BgpKdzBYtD" target="_blank">Discord</a>
  </div>
  <div class="nav-right">
    <a href="/contact" class="btn-primary">Kontakt &rarr;</a>
  </div>
</nav>`;

  const nav = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
})();
