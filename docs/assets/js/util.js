/* DAREBench project page: shared helpers. Classic script (works over file://).
   Every number rendered on the page is read from window.DARE (assets/data/data.js). */
(function () {
  'use strict';
  var D = window.DARE;
  var U = (window.U = {});
  U.D = D;
  U.IMG = 'assets/'; // data.js image paths (img/...) live under assets/

  var SVGNS = 'http://www.w3.org/2000/svg';

  U.$ = function (s, r) { return (r || document).querySelector(s); };
  U.$$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Element builder. attrs: class, text, attrs{}, data{}, on{}, style{}; children: nodes/strings. */
  U.h = function (tag, o) {
    var el = document.createElement(tag);
    o = o || {};
    if (o.class) el.className = o.class;
    if (o.text != null) el.textContent = o.text;
    if (o.attrs) for (var k in o.attrs) if (o.attrs[k] != null && o.attrs[k] !== false) el.setAttribute(k, o.attrs[k] === true ? '' : o.attrs[k]);
    if (o.data) for (var d in o.data) el.dataset[d] = o.data[d];
    if (o.style) for (var st in o.style) el.style.setProperty(st, o.style[st]);
    if (o.on) for (var ev in o.on) el.addEventListener(ev, o.on[ev]);
    for (var i = 2; i < arguments.length; i++) U.append(el, arguments[i]);
    return el;
  };
  U.append = function (el, c) {
    if (c == null || c === false) return el;
    if (Array.isArray(c)) { c.forEach(function (x) { U.append(el, x); }); return el; }
    el.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c);
    return el;
  };
  U.s = function (tag, attrs, parent) {
    var el = document.createElementNS(SVGNS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  };
  /* <svg><use href="#id"/></svg> icon */
  U.icon = function (id, cls) {
    var svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    if (cls) svg.setAttribute('class', cls);
    var use = document.createElementNS(SVGNS, 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    return svg;
  };

  /* ---- data access ---- */
  U.get = function (path) {
    return String(path).split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, D);
  };
  var byName = {};
  D.models.forEach(function (m) { byName[m.name] = m; byName[m.shortName] = m; });
  U.model = function (n) { return byName[n]; };
  U.group = function (k) { return D.groups.filter(function (g) { return g.key === k; })[0]; };
  U.source = function (k) { return D.sources.filter(function (s) { return s.key === k; })[0]; };
  U.GROUPS = D.groupOrder.map(U.group);
  U.TEXT_GROUPS = U.GROUPS.filter(function (g) { return g.modality === 'text'; });
  U.MM_GROUPS = U.GROUPS.filter(function (g) { return g.modality !== 'text'; });
  U.wlVar = function (k) { return 'var(--wl-' + k + ')'; };
  U.css = function (name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); };

  /* ---- formatting (display only; never recomputes paper values) ---- */
  U.int = function (n) { return Number(n).toLocaleString('en-US'); };
  U.pct = function (n) { return n == null ? '—' : Number(n).toFixed(1); };
  U.tok = function (k) { return k == null ? '—' : k + 'k'; };
  U.usd = function (txt) { return txt == null ? '—' : (txt.charAt(0) === '<' ? '<$' + txt.slice(1) : '$' + txt); };
  U.modalityCount = function () {
    var m = {}, f = {};
    D.groups.forEach(function (g) { m[g.modality] = 1; f[g.form] = 1; });
    return [Object.keys(m).length, Object.keys(f).length];
  };
  U.matrixLabel = function () { var mc = U.modalityCount(); return mc[0] + '×' + mc[1]; };
  U.scoringLabel = { auto: 'Auto', judge: 'Judge', hybrid: 'Hybrid' };
  U.SCORING_ORDER = ['auto', 'hybrid', 'judge']; // ordinal: increasing reliance on the LLM judge
  U.scoringVar = function (k) { return 'var(--score-' + k + ')'; };

  /* Competition ranking (1,2,2,4) by value descending */
  U.rank = function (items, val) {
    var sorted = items.slice().sort(function (a, b) { return val(b) - val(a); });
    var ranks = new Map();
    sorted.forEach(function (it, i) {
      if (i > 0 && val(it) === val(sorted[i - 1])) ranks.set(it, ranks.get(sorted[i - 1]));
      else ranks.set(it, i + 1);
    });
    return ranks;
  };

  /* Wrap numbers in a sentence with <b> (text built with DOM nodes, not innerHTML) */
  U.emphNums = function (text) {
    /* Bold standalone numbers only (not digits inside names such as GPT-5.4 or Qwen3.6-27B). */
    var frag = document.createDocumentFragment();
    var re = /(^|[\s(~+\u2248\u2192:;,])((?:\$|<\$?|[+\u2212])?\d[\d,]*(?:\.\d+)?(?:k|%|\u00d7)?)(?![\w\-.]*\w)/g, last = 0, m;
    while ((m = re.exec(text))) {
      var start = m.index + m[1].length;
      if (start > last) frag.appendChild(document.createTextNode(text.slice(last, start)));
      frag.appendChild(U.h('b', { text: m[2] }));
      last = start + m[2].length;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    return frag;
  };
  /* Render `code` spans from README markdown */
  U.mdCode = function (text) {
    var frag = document.createDocumentFragment();
    String(text).split(/(`[^`]+`)/g).forEach(function (part) {
      if (!part) return;
      if (part.charAt(0) === '`' && part.charAt(part.length - 1) === '`') frag.appendChild(U.h('code', { text: part.slice(1, -1) }));
      else frag.appendChild(document.createTextNode(part));
    });
    return frag;
  };

  /* ---- bindings ---- */
  U.bindAll = function (root) {
    U.$$('[data-bind]', root).forEach(function (el) {
      var v = U.get(el.getAttribute('data-bind'));
      if (v != null) el.textContent = v;
    });
    U.$$('[data-href]', root).forEach(function (el) {
      var v = U.get(el.getAttribute('data-href'));
      if (v) { el.setAttribute('href', v); el.setAttribute('rel', 'noopener'); }
    });
  };

  /* ---- tooltip ---- */
  var tip, tipOwner = null;
  U.tip = {
    el: function () { return tip || (tip = document.getElementById('tip')); },
    /* spec: {title, rows:[{label, value, color}], note} */
    show: function (spec, x, y, owner) {
      var t = U.tip.el();
      t.textContent = '';
      if (spec.title) t.appendChild(U.h('div', { class: 'tip__title', text: spec.title }));
      (spec.rows || []).forEach(function (r) {
        var key = U.h('span', { class: 'tip__key' });
        if (r.color) key.style.borderTopColor = r.color; else key.style.borderTopColor = 'transparent';
        t.appendChild(U.h('div', { class: 'tip__row' }, key, U.h('span', { class: 'tip__lab', text: r.label }), U.h('span', { class: 'tip__val', text: r.value })));
      });
      if (spec.note) t.appendChild(U.h('div', { class: 'tip__note', text: spec.note }));
      t.hidden = false;
      tipOwner = owner || null;
      var w = t.offsetWidth, hgt = t.offsetHeight, vw = window.innerWidth, vh = window.innerHeight;
      var left = x + 16, top = y + 16;
      if (left + w > vw - 8) left = Math.max(8, x - w - 16);
      if (top + hgt > vh - 8) top = Math.max(8, y - hgt - 16);
      t.style.left = left + 'px';
      t.style.top = top + 'px';
    },
    showAt: function (spec, el) {
      var r = el.getBoundingClientRect();
      U.tip.show(spec, r.left + r.width / 2, r.top + r.height / 2, el);
    },
    hide: function (owner) {
      if (owner && tipOwner && owner !== tipOwner) return;
      var t = U.tip.el(); if (t) t.hidden = true; tipOwner = null;
    },
    /* keyboard focus: show next to the element and remember it, so the tooltip can be
       re-anchored after a scroll instead of floating detached from its owner */
    focus: function (specFn, el) {
      focusOwner = { el: el, spec: specFn };
      U.tip.showAt(specFn(), el);
    },
    blur: function (el) {
      if (focusOwner && focusOwner.el === el) focusOwner = null;
      U.tip.hide(el);
    }
  };
  var focusOwner = null, scrollTimer = null;
  /* Attach hover + focus tooltip to an element; specFn returns the spec */
  U.hoverTip = function (el, specFn) {
    el.addEventListener('pointermove', function (e) { U.tip.show(specFn(), e.clientX, e.clientY, el); });
    el.addEventListener('pointerleave', function () { U.tip.hide(el); });
    el.addEventListener('focus', function () { U.tip.focus(specFn, el); });
    el.addEventListener('blur', function () { U.tip.blur(el); });
  };
  window.addEventListener('scroll', function () {
    U.tip.hide();
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      if (!focusOwner || document.activeElement !== focusOwner.el) { focusOwner = null; return; }
      var r = focusOwner.el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) U.tip.showAt(focusOwner.spec(), focusOwner.el);
    }, 160);
  }, { passive: true });
  /* Escape dismisses the tooltip for good: forget the focus owner so a later scroll does not re-open it */
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { focusOwner = null; U.tip.hide(); } });

  /* ---- chart <-> table toggles ---- */
  U.initViewToggles = function () {
    U.$$('.view-toggle').forEach(function (btn) {
      var t = btn.getAttribute('data-target');
      var chart = document.getElementById(t + '-chart'), table = document.getElementById(t + '-table');
      if (!chart || !table) return;
      /* the visible label says what the button will show next ("View as table" / "View as chart"),
         so no aria-pressed: a changing name plus a pressed state would double-signal */
      btn.removeAttribute('aria-pressed');
      btn.setAttribute('aria-controls', t + '-chart ' + t + '-table');
      btn.addEventListener('click', function () {
        var showTable = table.hidden;
        btn.classList.toggle('is-on', showTable);
        chart.hidden = showTable; table.hidden = !showTable;
        btn.querySelector('span').textContent = showTable ? 'View as chart' : 'View as table';
        var use = btn.querySelector('use'); if (use) use.setAttribute('href', showTable ? '#i-chart' : '#i-table');
        U.tip.hide();
        document.dispatchEvent(new CustomEvent('viewtoggle', { detail: { target: t, table: showTable } }));
      });
    });
  };

  /* Build a simple data table: cols [{label, num?, cls?, get(row)->string|node}] */
  U.table = function (cols, rows, caption) {
    var t = U.h('table', { class: 'data-table' });
    if (caption) t.appendChild(U.h('caption', { text: caption }));
    var thead = U.h('thead'), tr = U.h('tr');
    cols.forEach(function (c) { tr.appendChild(U.h('th', { class: c.num ? 'num' : (c.cls || ''), text: c.label, attrs: { scope: 'col' } })); });
    thead.appendChild(tr); t.appendChild(thead);
    var tb = U.h('tbody');
    rows.forEach(function (r) {
      var row = U.h('tr');
      cols.forEach(function (c, i) {
        var v = c.get(r);
        var cell = U.h(i === 0 && c.rowHeader !== false ? 'th' : 'td', { class: c.num ? 'num' : (c.cls || '') });
        if (i === 0 && c.rowHeader !== false) cell.setAttribute('scope', 'row');
        U.append(cell, v == null ? '—' : v);
        row.appendChild(cell);
      });
      tb.appendChild(row);
    });
    t.appendChild(tb);
    return t;
  };

  /* Put a U.table into a chart's table view (host = the .view--table element), replacing what was there.
     The caption moves above the scroller so it never scrolls away with the columns; the scroller is a
     named, focusable region (keyboard users can scroll it with the arrow keys), and while it overflows a
     "swipe" hint shows and the right edge fades until the last column is reached. */
  U.tableView = function (host, table) {
    host.textContent = '';
    host.classList.add('tview');
    var capEl = table.querySelector('caption'), capId = host.id + '-cap';
    var cap = U.h('p', { class: 'tview__cap', text: capEl ? capEl.textContent : '', attrs: { id: capId } });
    if (capEl) capEl.parentNode.removeChild(capEl);
    table.setAttribute('aria-labelledby', capId);
    var sc = U.h('div', { class: 'table-scroll', attrs: { tabindex: '0', role: 'region', 'aria-labelledby': capId } }, table);
    sc.addEventListener('scroll', function () { tviewState(host, sc); }, { passive: true });
    host.appendChild(cap);
    host.appendChild(U.h('p', { class: 'tview__swipe', text: 'swipe the table sideways →', attrs: { 'aria-hidden': 'true' } }));
    host.appendChild(sc);
    tviewState(host, sc);
    return sc;
  };
  function tviewState(host, sc) {
    var over = sc.scrollWidth > sc.clientWidth + 1;
    host.classList.toggle('is-over', over);
    sc.classList.toggle('at-end', !over || sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 2);
  }
  function tviewAll() {
    U.$$('.tview').forEach(function (host) { var sc = U.$('.table-scroll', host); if (sc) tviewState(host, sc); });
  }
  var tviewTimer;
  window.addEventListener('resize', function () { clearTimeout(tviewTimer); tviewTimer = setTimeout(tviewAll, 80); });
  document.addEventListener('viewtoggle', tviewAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(tviewAll);

  /* ---- segmented radio control ---- */
  U.seg = function (container, options, value, onChange) {
    container.textContent = '';
    var btns = options.map(function (o) {
      var b = U.h('button', { attrs: { type: 'button', role: 'radio', 'aria-checked': String(o.value === value), tabindex: o.value === value ? '0' : '-1' } });
      if (o.dot) b.appendChild(U.h('span', { class: 'dot', style: { background: o.dot } }));
      b.appendChild(document.createTextNode(o.label));
      if (o.title) b.title = o.title;
      b.addEventListener('click', function () { select(o.value, true); });
      container.appendChild(b);
      return b;
    });
    function select(v, fire) {
      options.forEach(function (o, i) {
        var on = o.value === v;
        btns[i].setAttribute('aria-checked', String(on));
        btns[i].tabIndex = on ? 0 : -1;
      });
      if (fire) onChange(v);
    }
    container.addEventListener('keydown', function (e) {
      var idx = btns.indexOf(document.activeElement);
      if (idx < 0) return;
      var n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (idx + 1) % btns.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (idx - 1 + btns.length) % btns.length;
      if (n != null) { e.preventDefault(); btns[n].focus(); btns[n].click(); }
    });
    return { select: select };
  };

  /* ---- copy to clipboard ---- */
  U.copy = function (text, btn) {
    function done(ok) {
      var span = btn.querySelector('span');
      var prev = span.textContent;
      span.textContent = ok ? 'Copied' : 'Press Ctrl+C';
      btn.classList.toggle('is-done', ok);
      var use = btn.querySelector('use'); if (use && ok) use.setAttribute('href', '#i-check');
      var live = document.getElementById('live'); if (live) live.textContent = ok ? 'Copied to clipboard' : 'Copy failed';
      setTimeout(function () { span.textContent = prev === 'Copied' ? 'Copy' : prev; btn.classList.remove('is-done'); if (use) use.setAttribute('href', '#i-copy'); }, 1600);
    }
    function fallback() {
      var ta = U.h('textarea', { attrs: { readonly: true, 'aria-hidden': 'true' }, style: { position: 'fixed', left: '-9999px', top: '0' } });
      ta.value = text; document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta); done(ok);
    }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    else fallback();
  };
  U.copyButton = function (getText, label) {
    var b = U.h('button', { class: 'copy-btn', attrs: { type: 'button', 'aria-label': label || 'Copy to clipboard' } }, U.icon('i-copy'), U.h('span', { text: 'Copy', attrs: { 'aria-hidden': 'true' } }));
    b.addEventListener('click', function () { U.copy(getText(), b); });
    return b;
  };

  /* ---- lightbox ---- */
  U.lightbox = function (src, alt, caption) {
    var dlg = document.getElementById('lightbox');
    var img = document.getElementById('lightbox-img');
    /* on phones, show the figure near its natural size inside a pannable box */
    var pan = window.matchMedia && window.matchMedia('(max-width: 720px)').matches;
    dlg.classList.toggle('is-pan', !!pan);
    img.style.width = '';
    img.onload = function () { if (pan) img.style.width = Math.min(img.naturalWidth, 1400) + 'px'; };
    img.src = src; img.alt = alt || '';
    if (pan && img.complete && img.naturalWidth) img.style.width = Math.min(img.naturalWidth, 1400) + 'px';
    document.getElementById('lightbox-cap').textContent = caption || '';
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  };
  U.initLightbox = function () {
    var dlg = document.getElementById('lightbox');
    document.getElementById('lightbox-close').addEventListener('click', function () { dlg.close ? dlg.close() : dlg.removeAttribute('open'); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  };
  U.fig = function (key) { return D.caseStudy.figures.filter(function (f) { return f.key === key; })[0]; };
  /* zoomable figure button */
  U.zoomable = function (src, alt, caption, label, opts) {
    opts = opts || {};
    var img = U.h('img', { attrs: { src: src, alt: alt || '', loading: opts.eager ? null : 'lazy', decoding: 'async' } });
    var b = U.h('button', { class: 'zoomable', attrs: { type: 'button', 'aria-label': 'Enlarge ' + (label || 'figure') } }, img,
      U.h('span', { class: 'zoomable__hint' }, U.icon('i-zoom'), 'Enlarge'));
    b.addEventListener('click', function () { U.lightbox(src, alt, caption); });
    return b;
  };

  /* ---- resize ---- */
  U.onResize = function (el, fn) {
    var last = 0, t;
    var ro = new ResizeObserver(function (entries) {
      var w = Math.round(entries[0].contentRect.width);
      if (w === last || w === 0) return;
      last = w; clearTimeout(t); t = setTimeout(function () { fn(w); }, 60);
    });
    ro.observe(el);
  };
  U.reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Nice linear ticks */
  U.ticks = function (lo, hi, n) {
    var span = hi - lo, step = Math.pow(10, Math.floor(Math.log10(span / n))), err = span / n / step;
    if (err >= 7.5) step *= 10; else if (err >= 3.5) step *= 5; else if (err >= 1.5) step *= 2;
    var out = [], v = Math.ceil(lo / step) * step;
    for (; v <= hi + 1e-9; v += step) out.push(Math.round(v * 1e6) / 1e6);
    return out;
  };


  /* Log-axis tick labels (1-2-5 per decade) without collisions: 1s first, then 5s, then 2s;
     a label is kept only if it clears every kept label by `gap` px and stays inside [x0, x1].
     ticks: [{v, k, x}] -> returns the subset whose labels should be drawn. */
  U.fitTicks = function (ticks, fmt, x0, x1, font, gap) {
    gap = gap == null ? 8 : gap;
    var kept = [];
    [1, 5, 2].forEach(function (k) {
      ticks.filter(function (t) { return t.k === k; }).forEach(function (t) {
        var w = U.textWidth(fmt(t.v), font || '400 12.5px Nunito');
        var a = t.x - w / 2, b = t.x + w / 2;
        if (a < x0 - 1 || b > x1 + 1) return;
        for (var i = 0; i < kept.length; i++) if (a < kept[i].b + gap && b > kept[i].a - gap) return;
        kept.push({ a: a, b: b, t: t });
      });
    });
    return kept.map(function (x) { return x.t; });
  };
  U.usdTick = function (v) { var dec = Math.max(0, -Math.floor(Math.log10(v) + 1e-9)); return '$' + v.toFixed(dec); };

  /* ---- roving focus: one Tab stop for a set of marks, arrow keys move between them ----
     items: array of focusable elements (in navigation order). onFocus(i) is called when
     an item receives focus. Returns {set(i)} to move the tab stop programmatically. */
  U.roving = function (items, onFocus, opts) {
    opts = opts || {};
    var cur = Math.max(0, Math.min(items.length - 1, opts.start || 0));
    items.forEach(function (el, i) {
      el.setAttribute('tabindex', i === cur ? '0' : '-1');
      el.addEventListener('focus', function () { cur = i; items.forEach(function (x, j) { x.setAttribute('tabindex', j === i ? '0' : '-1'); }); if (onFocus) onFocus(i); });
      el.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = Math.min(items.length - 1, i + 1);
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = Math.max(0, i - 1);
        else if (e.key === 'Home') n = 0;
        else if (e.key === 'End') n = items.length - 1;
        if (n != null) { e.preventDefault(); items[n].focus(); }
      });
    });
    return { set: function (i) { cur = i; items.forEach(function (x, j) { x.setAttribute('tabindex', j === i ? '0' : '-1'); }); } };
  };

  /* ---- comic starburst accent (decorative; the number it sits next to is real text) ---- */
  U.burst = function (text, variant) {
    return U.h('span', { class: 'burst' + (variant ? ' burst--' + variant : ''), attrs: { 'aria-hidden': 'true' } }, U.h('span', { class: 'burst__t', text: text }));
  };

  /* Text width measurement for SVG label layout */
  var measureCtx;
  U.textWidth = function (text, font) {
    measureCtx = measureCtx || document.createElement('canvas').getContext('2d');
    measureCtx.font = font || '800 12.5px Nunito';
    return measureCtx.measureText(text).width;
  };
})();
