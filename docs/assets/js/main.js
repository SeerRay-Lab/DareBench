/* Bootstrap: bindings, sections (each isolated in try/catch), navigation, reveal-on-scroll. */
(function () {
  'use strict';
  var U = window.U;

  function nav() {
    var toggle = U.$('.nav__toggle'), menu = U.$('#nav-menu');
    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    }
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    U.$$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setOpen(false); toggle.focus(); } });
    document.addEventListener('click', function (e) { if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) setOpen(false); });
    /* keyboard: tabbing out of the open menu closes it, so it never covers the newly focused control */
    menu.addEventListener('focusout', function (e) {
      var to = e.relatedTarget;
      if (menu.classList.contains('is-open') && to && !menu.contains(to) && to !== toggle) setOpen(false);
    });

    var links = U.$$('.nav__links a');
    var ids = links.map(function (a) { return a.getAttribute('href').slice(1); });
    var secs = U.$$('main > section');
    var bar = U.$('.nav__progress span');
    var ticking = false, lastY = window.scrollY, header = U.$('.nav');
    header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
    function update() {
      ticking = false;
      var y = window.scrollY;
      if (menu.classList.contains('is-open') || header.contains(document.activeElement) || y < 240) header.classList.remove('is-hidden');
      else if (y > lastY + 6) header.classList.add('is-hidden');
      else if (y < lastY - 6) header.classList.remove('is-hidden');
      lastY = y;
      var probe = window.innerHeight * 0.35;
      var cur = null;
      secs.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) cur = s.id; });
      links.forEach(function (a, i) { if (ids[i] === cur) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function reveal() {
    var els = U.$$('.reveal');
    if (!('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* Ambient animations (fish, bubbles, kelp, bobbing art) only run while their section is on screen. */
  function pauseOffscreen() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-offscreen', !en.isIntersecting); });
    }, { rootMargin: '80px 0px' });
    U.$$('main > section, footer').forEach(function (el) { io.observe(el); });
  }

  /* In-page pause for the ambient loops (WCAG 2.2.2), remembered across visits. */
  function motionToggle() {
    var btn = U.$('#motion-toggle'), root = document.documentElement, KEY = 'darebench-motion-paused';
    if (!btn) return;
    function set(paused, store) {
      root.classList.toggle('motion-paused', paused);
      btn.setAttribute('aria-pressed', String(paused));
      if (store) { try { localStorage.setItem(KEY, paused ? '1' : '0'); } catch (e) { /* storage unavailable (file://, private mode) */ } }
    }
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { saved = null; }
    set(saved === '1', false);
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-pressed') !== 'true', true); });
  }

  function start() {
    U.bindAll(document);
    var steps = [
      ['content', U.initContent], ['workloads', U.initWorkloads], ['leaderboard', U.initLeaderboard],
      ['cost', U.initCost], ['reliability', U.initReliability], ['quickstart', U.initQuickstart]
    ];
    steps.forEach(function (s) {
      try { s[1](); } catch (e) { console.error('[DAREBench] ' + s[0] + ' failed:', e); }
    });
    [['toggles', U.initViewToggles], ['lightbox', U.initLightbox], ['nav', nav], ['reveal', reveal], ['motion', pauseOffscreen], ['motion-toggle', motionToggle]].forEach(function (s) {
      try { s[1](); } catch (e) { console.error('[DAREBench] ' + s[0] + ' failed:', e); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
