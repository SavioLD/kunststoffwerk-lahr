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

    /* Platzhalter in Formularfeldern */
    Array.prototype.forEach.call(document.querySelectorAll('[data-en-placeholder]'), function (el) {
      if (!el.hasAttribute('data-de-placeholder')) {
        el.setAttribute('data-de-placeholder', el.getAttribute('placeholder') || '');
      }
      el.setAttribute('placeholder', lang === 'en'
        ? el.getAttribute('data-en-placeholder')
        : el.getAttribute('data-de-placeholder'));
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

  /* -----------------------------------------------------------------
     Kontaktformular

     Die Seite ist rein statisch, es gibt also keine Gegenstelle, die ein
     POST entgegennehmen koennte. Bis ein Endpunkt bereitsteht, stellt das
     Formular aus den Feldern eine strukturierte E-Mail zusammen und
     uebergibt sie an das Mailprogramm.

     Zum Umstellen auf einen echten Endpunkt genuegt es, am <form> ein
     data-endpoint="https://..." zu setzen; dann wird per fetch() gesendet.
     ----------------------------------------------------------------- */
  function t(de, en) { return document.documentElement.lang === 'en' ? en : de; }

  Array.prototype.forEach.call(document.querySelectorAll('form.form'), function (form) {
    var status = form.querySelector('.form__status');

    function setError(field, message) {
      var wrap = field.closest('.field') || field.closest('.consent');
      if (!wrap) return;
      wrap.classList.toggle('is-invalid', Boolean(message));
      var slot = wrap.querySelector('[data-err]');
      if (slot) slot.textContent = message || '';
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function validate() {
      var firstBad = null;
      Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (f) {
        var empty = f.type === 'checkbox' ? !f.checked : !f.value.trim();
        var badMail = f.type === 'email' && f.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value.trim());
        var msg = '';
        if (empty) msg = t('Bitte ausfüllen.', 'Please complete this field.');
        else if (badMail) msg = t('Bitte eine gültige E-Mail-Adresse angeben.', 'Please enter a valid email address.');
        setError(f, msg);
        if (msg && !firstBad) firstBad = f;
      });
      return firstBad;
    }

    /* Fehler ausblenden, sobald korrigiert wird */
    form.addEventListener('input', function (e) {
      var f = e.target;
      if (f.hasAttribute('required')) {
        var filled = f.type === 'checkbox' ? f.checked : f.value.trim();
        if (filled) setError(f, '');
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (status) status.className = 'form__status';

      var bad = validate();
      if (bad) {
        if (status) {
          status.className = 'form__status is-err';
          status.textContent = t('Bitte prüfen Sie die markierten Felder.',
                                 'Please check the highlighted fields.');
        }
        bad.focus();
        bad.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }

      /* Felder einsammeln (Einwilligung gehoert nicht in die Nachricht) */
      var lines = [];
      Array.prototype.forEach.call(form.elements, function (f) {
        if (!f.name || f.type === 'checkbox' || f.type === 'submit') return;
        var v = (f.value || '').trim();
        if (v) lines.push(f.name + ': ' + v);
      });

      var endpoint = form.getAttribute('data-endpoint');
      var subject = form.getAttribute('data-subject') || 'Anfrage';
      var to = form.getAttribute('data-to') || 'info@beratex.com';

      if (endpoint) {
        var data = {};
        Array.prototype.forEach.call(form.elements, function (f) {
          if (f.name) data[f.name] = f.type === 'checkbox' ? f.checked : f.value;
        });
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          form.reset();
          status.className = 'form__status is-ok';
          status.textContent = t('Vielen Dank. Ihre Anfrage ist bei uns eingegangen.',
                                 'Thank you. We have received your enquiry.');
        }).catch(function () {
          status.className = 'form__status is-err';
          status.textContent = t('Das Senden hat nicht geklappt. Bitte schreiben Sie uns an info@beratex.com.',
                                 'Sending failed. Please email us at info@beratex.com.');
        });
        return;
      }

      window.location.href = 'mailto:' + to
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(lines.join('\n'));

      if (status) {
        status.className = 'form__status is-ok';
        status.textContent = t('Ihre Anfrage wurde in Ihrem E-Mail-Programm geöffnet. Bitte dort noch absenden.',
                               'Your enquiry has been opened in your email client. Please send it from there.');
      }
    });
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
