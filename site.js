/* Site behaviour. Projects are edited in projects-data.js, not here. */
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  root.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- mobile menu ---- */
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
    });
  }

  /* ---- header shadow after scrolling ---- */
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- email links: the address is assembled on load, so it is never in the page source,
         but the link is a real mailto: by the time anyone clicks or right-clicks it ---- */
  var parts = ['Pharmacist.IT', 'gmail.com'];
  var ADDRESS = parts[0] + '@' + parts[1];
  document.querySelectorAll('[data-mail]').forEach(function (a) {
    var subject = a.getAttribute('data-mail') || 'Hello from your website';
    a.setAttribute('href', 'mailto:' + ADDRESS + '?subject=' + encodeURIComponent(subject));
  });

  /* ---- icons and elements ---- */
  var ICONS = window.ICONS || {};
  var SVGNS = 'http://www.w3.org/2000/svg';
  function icon(name, cls) {
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('class', 'ic' + (cls ? ' ' + cls : ''));
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = ICONS[name] || '';
    return svg;
  }
  function tile(name, tone) {
    var s = document.createElement('span');
    s.className = 'tile' + (tone ? ' ' + tone : '');
    s.setAttribute('aria-hidden', 'true');
    s.appendChild(icon(name));
    return s;
  }
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text) n.textContent = text;
    return n;
  }

  /* ---- projects ---- */
  var projects = window.PROJECTS || [];
  var TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
  var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function parseDate(s) { var a = s.split('-'); return new Date(+a[0], +a[1] - 1, +a[2]); }
  function daysFrom(s) { return Math.round((parseDate(s) - TODAY) / 86400000); }
  function niceDate(s) { var d = parseDate(s); return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear(); }
  function relative(days) {
    if (days === 0) return 'today';
    var n = Math.abs(days);
    var txt = n <= 365 ? n + (n === 1 ? ' day' : ' days') : Math.round(n / 30.44) + ' months';
    return days < 0 ? txt + ' ago' : 'in ' + txt;
  }

  function renderTimeline(t) {
    var box = el('div', { 'class': 'tl' });
    var head = el('div', { 'class': 'tl-head' });
    head.appendChild(el('p', { 'class': 'tl-title' }, t.title));
    var first = t.milestones.filter(function (m) { return m.date; })[0];
    var target = t.milestones.filter(function (m) { return m.date && daysFrom(m.date) > 0; })[0];
    var stats = el('div', { 'class': 'tl-stats' });
    if (first) { var a = el('p'); a.appendChild(el('strong', null, String(Math.abs(daysFrom(first.date))))); a.appendChild(document.createTextNode(' days since proposed')); stats.appendChild(a); }
    if (target) { var b = el('p'); b.appendChild(el('strong', null, String(daysFrom(target.date)))); b.appendChild(document.createTextNode(' days to ' + niceDate(target.date))); stats.appendChild(b); }
    head.appendChild(stats);
    box.appendChild(head);
    var ol = el('ol', { 'class': 'tl-list' });
    t.milestones.forEach(function (m) {
      var li = el('li');
      if (m.pending) {
        li.className = 'pending';
        li.appendChild(el('span', { 'class': 'tl-date' }, 'Pending'));
        li.appendChild(el('span', { 'class': 'tl-rel' }, 'as of ' + t.reviewed));
      } else {
        var dd = daysFrom(m.date);
        li.className = dd < 0 ? 'past' : 'future';
        li.appendChild(el('span', { 'class': 'tl-date' }, niceDate(m.date)));
        li.appendChild(el('span', { 'class': 'tl-rel' }, relative(dd)));
      }
      li.appendChild(el('span', { 'class': 'tl-text' }, m.text));
      ol.appendChild(li);
    });
    box.appendChild(ol);
    box.appendChild(el('p', { 'class': 'tl-foot' }, 'Counts update each day. Status reviewed ' + t.reviewed + '.'));
    return box;
  }

  var TONES = ['', 'violet', 'amber'];
  function render(p, idx) {
    var article = el('article', { 'class': 'project card reveal', 'data-category': p.category || '' });
    if (p.id) article.id = p.id;
    var tone = p.tone || '';
    var fig = el('figure');
    if (p.timeline) fig.appendChild(renderTimeline(p.timeline));
    if (p.image) {
      fig.appendChild(el('img', { src: p.image, alt: p.imageAlt || '', width: '1200', height: '750', loading: 'lazy' }));
      if (p.imageCaption) fig.appendChild(el('figcaption', null, p.imageCaption));
    }
    if (!p.timeline && !p.image && p.mark) {
      var panel = el('div', { 'class': 'mark-panel' + (p.markTone === 'violet' ? ' violet' : ''), 'aria-hidden': 'true' });
      panel.appendChild(icon(p.icon || 'doc', 'big-ic'));
      var inner = el('div');
      inner.appendChild(tile(p.icon || 'doc', p.markTone === 'violet' ? 'violet' : ''));
      var span = el('span', null, p.mark);
      if (p.markSub) span.appendChild(el('small', null, p.markSub));
      inner.appendChild(span);
      panel.appendChild(inner);
      fig.appendChild(panel);
    }
    article.appendChild(fig);

    var body = el('div');
    var top = el('div', { 'class': 'proj-top' });
    if (p.icon) top.appendChild(tile(p.icon, tone));
    if (p.status) top.appendChild(el('span', { 'class': 'status' + (p.link && p.status === 'Early access' ? ' live' : '') }, p.link && p.status === 'Early access' ? 'Live' : p.status));
    if (top.childNodes.length) body.appendChild(top);
    body.appendChild(el('h3', null, p.title));
    if (p.summary) body.appendChild(el('p', null, p.summary));
    if (p.points && p.points.length) {
      var ul = el('ul');
      p.points.forEach(function (t) { ul.appendChild(el('li', null, t)); });
      body.appendChild(ul);
    }
    if (p.tags && p.tags.length) {
      var tags = el('ul', { 'class': 'tags', 'aria-label': 'Topics' });
      p.tags.forEach(function (t) { tags.appendChild(el('li', null, t)); });
      body.appendChild(tags);
    }
    var actions = el('div', { 'class': 'actions' });
    if (p.link) {
      var ext = /^https?:/.test(p.link);
      var attrs = { 'class': 'btn btn-primary', href: p.link };
      if (ext) { attrs.target = '_blank'; attrs.rel = 'noopener'; }
      var a1 = el('a', attrs, (p.linkLabel || 'Open the tool') + ' ');
      a1.appendChild(icon(ext ? 'ext' : 'arrow'));
      actions.appendChild(a1);
    } else if (p.requestAccess !== false) {
      var a2 = el('a', { 'class': 'btn btn-quiet', href: 'connect.html' }, (p.requestLabel || 'Request early access') + ' ');
      a2.appendChild(icon('arrow'));
      actions.appendChild(a2);
    }
    (p.links2 || []).forEach(function (x) {
      var a3 = el('a', { 'class': 'btn btn-quiet', href: x.url, target: '_blank', rel: 'noopener' }, (x.label || 'Learn more') + ' ');
      a3.appendChild(icon('ext'));
      actions.appendChild(a3);
    });
    if (actions.childNodes.length) body.appendChild(actions);
    if (p.note) body.appendChild(el('p', { 'class': 'proj-note' }, p.note));
    article.appendChild(body);
    return article;
  }

  var list = document.getElementById('project-list');
  if (list) {
    projects.forEach(function (p, i) { list.appendChild(render(p, i)); });
    var filters = document.querySelectorAll('.filters button');
    filters.forEach(function (b) {
      b.addEventListener('click', function () {
        var cat = b.getAttribute('data-filter');
        filters.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        list.querySelectorAll('.project').forEach(function (art) {
          art.hidden = !(cat === 'all' || art.getAttribute('data-category') === cat);
        });
      });
    });
  }
  /* Home page: the featured slot shows only the live timeline.
     The full project card lives on the Projects page. */
  var featured = document.getElementById('featured-project');
  if (featured && projects[0]) {
    var p0 = projects[0];
    if (p0.timeline) {
      var card = el('article', { 'class': 'project project-compact card reveal' });
      var f0 = el('figure');
      f0.appendChild(renderTimeline(p0.timeline));
      card.appendChild(f0);
      featured.appendChild(card);
    } else {
      featured.appendChild(render(p0, 0));
    }
  }

  /* ---- scroll reveal (staggered by sibling order) ---- */
  var revealEls = document.querySelectorAll('.reveal');
  function showAll() { revealEls.forEach(function (n) { n.classList.add('in'); }); }
  if (reduce || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (n) { io.observe(n); });
    setTimeout(function () { /* safety net if observers never fire */
      revealEls.forEach(function (n) { if (n.getBoundingClientRect().top < window.innerHeight) n.classList.add('in'); });
    }, 1200);
  }

  /* ---- count-up numbers ---- */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && !reduce && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        co.unobserve(e.target);
        var node = e.target, end = +node.getAttribute('data-count'), t0 = null;
        function step(ts) {
          if (t0 === null) t0 = ts;
          var k = Math.min((ts - t0) / 1200, 1);
          node.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(step); else node.textContent = String(end);
        }
        node.textContent = '0';
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (n) { co.observe(n); });
  }

  /* ---- 3D tilt on the Rx card (mouse only) ---- */
  var scene = document.querySelector('[data-tilt]');
  if (scene && !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var tilt = scene.querySelector('.tilt');
    var stage = scene.closest('.stage') || scene;
    stage.addEventListener('pointermove', function (e) {
      var r = scene.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      var y = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      x = Math.max(-1, Math.min(1, x)); y = Math.max(-1, Math.min(1, y));
      tilt.style.setProperty('--ry', (-12 + x * 14).toFixed(1) + 'deg');
      tilt.style.setProperty('--rx', (5 - y * 10).toFixed(1) + 'deg');
    });
    stage.addEventListener('pointerleave', function () {
      tilt.style.removeProperty('--ry'); tilt.style.removeProperty('--rx');
    });
  }

  /* ---- soft spotlight that follows the pointer on cards ---- */
  if (!reduce) {
    document.addEventListener('pointermove', function (e) {
      var c = e.target.closest && e.target.closest('.card');
      if (!c) return;
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }
})();

/* ---------------------------------------------------------------
   Added features: Verify links, skill chip toggle, contact form.
   To post the contact form to a real inbox, set FORM_ENDPOINT below
   to your form service URL (for example a Formspree endpoint).
   Leave it as '' and the form falls back to the visitor's email app.
   --------------------------------------------------------------- */
(function () {
  var FORM_ENDPOINT = 'https://api.staticforms.dev/submit';
  var FORM_KEY = 'sf_409d01a88cc711810a6c3331'; /* public key: it can only deliver to the inbox registered with Static Forms */
  var MAIL = ['Pharmacist.IT', 'gmail.com'].join('@');

  /* ---- Verify links with no public URL yet ---- */
  document.querySelectorAll('.verify[data-soon]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.classList.contains('said')) return;
      b.classList.add('said');
      b.textContent = 'Coming soon';
    });
  });

  /* ---- Core skills: show six chips, reveal the rest on request ---- */
  document.querySelectorAll('.skills .card ul').forEach(function (ul) {
    var items = Array.prototype.slice.call(ul.children);
    if (items.length <= 6) return;
    items.slice(6).forEach(function (li) { li.classList.add('sk-hide'); });
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sk-more';
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = '+ ' + (items.length - 6) + ' more';
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      items.slice(6).forEach(function (li) { li.classList.toggle('sk-hide', open); });
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      btn.textContent = open ? '+ ' + (items.length - 6) + ' more' : 'Show fewer';
    });
    ul.parentNode.appendChild(btn);
  });

  /* ---- Contact form ---- */
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {};
    ['name', 'org', 'email', 'reason', 'message'].forEach(function (k) {
      var el = form.elements[k];
      data[k] = el ? String(el.value || '').trim() : '';
    });
    if (!data.name || !data.email || !data.message) {
      status.textContent = 'Please add your name, email, and a message.';
      return;
    }
    var subject = (data.reason || 'Website enquiry') + ' — ' + data.name + (data.org ? ' (' + data.org + ')' : '');
    var body = 'Name: ' + data.name + '\nOrganization: ' + (data.org || '-') + '\nEmail: ' + data.email +
               '\nReason: ' + (data.reason || '-') + '\n\n' + data.message;
    /* honeypot: real visitors never see or fill this field; bots do */
    var trap = form.elements['website'];
    if (trap && trap.value) {
      form.reset();
      status.textContent = 'Thank you. Your message has been sent and I will reply by email.';
      return;
    }
    if (FORM_ENDPOINT) {
      status.textContent = 'Sending…';
      var fd = new FormData();
      fd.append('apiKey', FORM_KEY);
      fd.append('subject', subject);
      fd.append('name', data.name);
      fd.append('email', data.email);
      fd.append('message', body);
      fetch(FORM_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: fd })
        .then(function (r) {
          return r.json().catch(function () { return {}; }).then(function (j) {
            if (!r.ok || j.success === false) throw new Error('bad status');
          });
        })
        .then(function () {
          form.reset();
          status.textContent = 'Thank you. Your message has been sent and I will reply by email.';
        })
        .catch(function () {
          status.textContent = 'That did not send. Opening your email app instead.';
          window.location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
        });
      return;
    }
    window.location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    status.textContent = 'Your email app should open with the message ready to send.';
  });
})();

/* ---------------- CV flipbook (cv.html) ---------------- */
(function () {
  var stage = document.getElementById('cv-stage');
  if (!stage) return;
  var pages = Array.prototype.slice.call(stage.querySelectorAll('.cv-page'));
  var prev = document.getElementById('cv-prev');
  var next = document.getElementById('cv-next');
  var dots = document.getElementById('cv-dots');
  var count = document.getElementById('cv-count');
  var printBtn = document.getElementById('cv-print');
  var i = 0;
  var PAGE_W = 816, PAGE_H = 1056;

  /* fit the letter-size page to the column, and give the stage its height */
  function fit() {
    var avail = stage.parentNode.clientWidth;
    var s = Math.min(1, avail / PAGE_W);
    stage.style.setProperty('--cvs', s);
    stage.style.height = Math.round(PAGE_H * s) + 'px';
    var bar = document.querySelector('.cv-bar'), hint = document.querySelector('.cv-hint');
    [bar, hint].forEach(function (n) { if (n) n.style.setProperty('--cvs', s); });
  }
  fit();
  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);

  pages.forEach(function (p, n) {
    var d = document.createElement('button');
    d.type = 'button';
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', 'Page ' + (n + 1));
    d.setAttribute('aria-selected', n === 0 ? 'true' : 'false');
    d.addEventListener('click', function () { go(n); });
    dots.appendChild(d);
  });

  function go(n) {
    n = Math.max(0, Math.min(pages.length - 1, n));
    i = n;
    pages.forEach(function (p, k) {
      p.classList.toggle('is-current', k === n);
      p.classList.toggle('is-prev', k < n);
      if (k === n) p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true');
    });
    Array.prototype.forEach.call(dots.children, function (d, k) {
      d.setAttribute('aria-selected', k === n ? 'true' : 'false');
    });
    prev.disabled = n === 0;
    next.disabled = n === pages.length - 1;
    stage.classList.toggle('can-turn', n < pages.length - 1);
    count.textContent = 'Page ' + (n + 1) + ' of ' + pages.length;
    fit();
  }
  prev.addEventListener('click', function () { go(i - 1); });
  next.addEventListener('click', function () { go(i + 1); });

  stage.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(i + 1); }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(i - 1); }
    if (e.key === 'Home') { e.preventDefault(); go(0); }
    if (e.key === 'End') { e.preventDefault(); go(pages.length - 1); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    if (e.key === 'ArrowRight') go(i + 1);
    if (e.key === 'ArrowLeft') go(i - 1);
  });

  /* swipe */
  var x0 = null, y0 = null;
  stage.addEventListener('touchstart', function (e) {
    x0 = e.changedTouches[0].clientX; y0 = e.changedTouches[0].clientY;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? i + 1 : i - 1);
    x0 = y0 = null;
  }, { passive: true });

  /* clicking the page turns it, unless the reader clicked a link or is selecting text */
  stage.addEventListener('click', function (e) {
    if (i >= pages.length - 1) return;
    if (e.target.closest('a, button, input, textarea, select')) return;
    var sel = window.getSelection && window.getSelection();
    if (sel && !sel.isCollapsed) return;
    go(i + 1);
  });

  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });

  /* the email on page 1 is only written into the page when asked for */
  var MAIL = ['Pharmacist.IT', 'gmail.com'].join('@');
  document.querySelectorAll('.cv-mail').forEach(function (b) {
    b.addEventListener('click', function () {
      var a = document.createElement('a');
      a.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(b.getAttribute('data-mail') || 'Hello');
      a.textContent = MAIL;
      a.style.fontWeight = '500';
      b.parentNode.replaceChild(a, b);
    });
  });
})();
