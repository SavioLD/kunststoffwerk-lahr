/* Bernauer Group — shared front-end behaviour (no dependencies) */
(function () {
  'use strict';

  /* Mobile navigation drawer */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.mainnav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    /* Close when a link is followed */
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    /* Close on Escape */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        toggle.focus();
      }
    });
  }

  /* -----------------------------------------------------------------
     Sprachumschaltung DE / EN
     Deutsch steht im Markup, Englisch in data-en (Text) bzw. data-en-html.
     Die deutsche Fassung wird beim ersten Wechsel gesichert.
     ----------------------------------------------------------------- */
  var STORE = 'bernauer-lang';

  function applyLang(lang) {
    var nodes = document.querySelectorAll('[data-en], [data-en-html]');

    Array.prototype.forEach.call(nodes, function (el) {
      var isHtml = el.hasAttribute('data-en-html');
      var attr = isHtml ? 'data-en-html' : 'data-en';

      /* deutsche Ursprungsfassung einmalig sichern */
      if (!el.hasAttribute('data-de-cache')) {
        el.setAttribute('data-de-cache', isHtml ? el.innerHTML : el.textContent);
      }

      var value = lang === 'en' ? el.getAttribute(attr) : el.getAttribute('data-de-cache');
      if (value === null) return;
      if (isHtml) { el.innerHTML = value; } else { el.textContent = value; }
    });

    /* Titel und Meta-Beschreibung */
    var title = document.querySelector('title');
    if (title && title.getAttribute('data-en')) {
      if (!title.getAttribute('data-de-cache')) title.setAttribute('data-de-cache', title.textContent);
      title.textContent = lang === 'en' ? title.getAttribute('data-en') : title.getAttribute('data-de-cache');
    }
    var desc = document.querySelector('meta[name="description"]');
    if (desc && desc.getAttribute('data-en')) {
      if (!desc.getAttribute('data-de-cache')) desc.setAttribute('data-de-cache', desc.getAttribute('content'));
      desc.setAttribute('content', lang === 'en' ? desc.getAttribute('data-en') : desc.getAttribute('data-de-cache'));
    }

    document.documentElement.lang = lang;

    Array.prototype.forEach.call(document.querySelectorAll('.langswitch button'), function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });

    try { localStorage.setItem(STORE, lang); } catch (e) { /* Privatmodus */ }
  }

  var saved;
  try { saved = localStorage.getItem(STORE); } catch (e) { saved = null; }
  if (saved === 'en') applyLang('en');
  else applyLang('de');

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.langswitch button');
    if (btn) applyLang(btn.dataset.lang);
  });

  /* Reveal-on-scroll (progressive enhancement, respects reduced motion) */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('[data-reveal]');
    Array.prototype.forEach.call(targets, function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }
})();
