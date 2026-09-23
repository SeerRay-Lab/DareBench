/* Workload matrix, cell detail, source composition, task explorer. */
(function () {
  'use strict';
  var U = window.U, D = U.D, h = U.h;
  var FORM_LABEL = { 'single-step': 'Single-step', 'multi-step': 'Multi-step', 'multi-step+tools': 'Multi-step + tools' };
  var MOD_LABEL = { text: 'Text', multimodal: 'Multimodal' };
  var selected = null, cellBtns = {}, exampleIdx = {};

  function forms() { var f = []; U.GROUPS.forEach(function (g) { if (f.indexOf(g.form) < 0) f.push(g.form); }); return f; }
  function mods() { var m = []; U.GROUPS.forEach(function (g) { if (m.indexOf(g.modality) < 0) m.push(g.modality); }); return m; }
  function groupAt(mod, form) { return U.GROUPS.filter(function (g) { return g.modality === mod && g.form === form; })[0]; }

  function mixbar(scoring, lg) {
    var bar = h('span', { class: 'mixbar' + (lg ? ' mixbar--lg' : ''), attrs: { 'aria-hidden': 'true' } });
    U.SCORING_ORDER.forEach(function (k) {
      if (!scoring[k]) return;
      bar.appendChild(h('span', { style: { background: U.scoringVar(k), flex: scoring[k] + ' 1 0' } }));
    });
    return bar;
  }
  function mixText(scoring) {
    return U.SCORING_ORDER.filter(function (k) { return scoring[k]; }).map(function (k) { return scoring[k] + ' ' + U.scoringLabel[k].toLowerCase(); }).join(', ');
  }
  function scoringLegend() {
    var lg = h('div', { class: 'legend' }, h('span', { class: 'legend__title', text: 'Scoring' }));
    U.SCORING_ORDER.forEach(function (k) {
      lg.appendChild(h('span', { class: 'legend__item' }, h('span', { class: 'legend__sw', style: { background: U.scoringVar(k) } }), U.scoringLabel[k]));
    });
    return lg;
  }

  /* ---------------- matrix ---------------- */
  function buildMatrix() {
    var host = U.$('#matrix');
    var grid = h('div', { class: 'matrix__grid' });
    grid.appendChild(h('span', { class: 'matrix__corner', text: 'input ↓ / execution →' }));
    forms().forEach(function (f) { grid.appendChild(h('span', { class: 'matrix__col', text: FORM_LABEL[f] || f })); });
    grid.appendChild(h('span', { class: 'matrix__axis', attrs: { 'aria-hidden': 'true' } }, h('span', { text: 'increasing execution complexity' })));
    mods().forEach(function (mod) {
      grid.appendChild(h('span', { class: 'matrix__row', text: MOD_LABEL[mod] || mod }));
      forms().forEach(function (f) {
        var g = groupAt(mod, f);
        var srcNames = g.sources.map(function (k) { return U.source(k).name; });
        /* the accessible name is the visible text plus a hidden gloss, so it contains the visible label (WCAG 2.5.3) */
        var btn = h('button', {
          class: 'wcell', style: { '--c': U.wlVar(g.key) },
          attrs: { type: 'button', 'aria-pressed': 'false', 'aria-controls': 'cell-detail' }
        },
          h('span', { class: 'wcell__count', text: String(g.count) }),
          h('span', { class: 'wcell__unit', text: 'tasks' }),
          h('span', { class: 'wcell__label', text: g.label }),
          h('span', { class: 'wcell__sr', text: ' (' + g.longLabel + ')' }),
          h('span', { class: 'wcell__src', text: srcNames.join(', ') }),
          h('span', { class: 'wcell__sr', text: ' Scoring: ' + mixText(g.scoring) + '.' }),
          mixbar(g.scoring));
        btn.addEventListener('click', function () { select(g.key, true); });
        U.hoverTip(btn, function () {
          return { title: g.longLabel, rows: [{ label: 'Tasks', value: String(g.count), color: U.css('--wl-' + g.key) }].concat(U.SCORING_ORDER.filter(function (k) { return g.scoring[k]; }).map(function (k) {
            return { label: U.scoringLabel[k] + ' scoring', value: String(g.scoring[k]), color: U.css('--score-' + k) };
          })), note: srcNames.join(', ') };
        });
        cellBtns[g.key] = btn;
        grid.appendChild(btn);
      });
    });
    host.appendChild(grid);
    host.appendChild(h('div', { class: 'matrix__foot' }, scoringLegend(), h('span', { class: 'matrix__hint', text: 'select a cell to dive in' })));
  }

  function select(key, focusDetail) {
    selected = key;
    Object.keys(cellBtns).forEach(function (k) { cellBtns[k].setAttribute('aria-pressed', String(k === key)); });
    renderDetail(key);
  }

  function renderDetail(key) {
    var g = U.group(key), box = U.$('#cell-detail');
    box.textContent = '';
    box.appendChild(h('div', { class: 'cd__head' },
      h('span', { class: 'cd__sw', style: { background: U.wlVar(key) } }),
      h('h3', { class: 'cd__title', text: g.longLabel }),
      h('span', { class: 'cd__count', text: g.count + ' tasks · ' + g.applicableModels + ' models' })));

    var grid = h('div', { class: 'cd__grid' });
    /* sources + scoring */
    var left = h('div', { class: 'cd__block' }, h('h4', { text: 'Sources' }));
    var srcs = h('div', { class: 'cd__srcs' });
    g.sources.forEach(function (k) {
      var s = U.source(k);
      srcs.appendChild(h('span', { class: 'pill', attrs: { title: s.capability } }, s.name, h('span', { class: 'chip__n', text: String(s.count) })));
    });
    left.appendChild(srcs);
    left.appendChild(h('h4', { text: 'Scoring modes', style: { 'margin-top': '14px' } }));
    var mixRows = h('div', { class: 'cd__mixrows' });
    U.SCORING_ORDER.forEach(function (k) {
      if (!g.scoring[k]) return;
      mixRows.appendChild(h('span', null, h('span', { class: 'legend__sw', style: { background: U.scoringVar(k) } }), g.scoring[k] + ' ' + U.scoringLabel[k].toLowerCase()));
    });
    left.appendChild(h('div', { class: 'cd__mix' }, mixbar(g.scoring, true), mixRows));
    grid.appendChild(left);

    /* top models (Table 1) */
    var right = h('div', { class: 'cd__block' }, h('h4', { text: 'Top models (audited accuracy, %)' }));
    var models = D.models.filter(function (m) { return m.acc[key] != null; });
    var ranks = U.rank(models, function (m) { return m.acc[key]; });
    var top = models.filter(function (m) { return ranks.get(m) <= 3; }).sort(function (a, b) { return b.acc[key] - a.acc[key]; });
    var max = 100;
    var ol = h('ol', { class: 'top3' });
    var items = [];
    top.forEach(function (m) {
      var r = ranks.get(m);
      var li = h('li', null,
        h('span', { class: 'medal medal--' + r + ' top3__rank' }, h('span', { class: 'sr-only', text: 'Rank ' }), String(r)),
        h('span', { class: 'top3__name' }, m.name, h('span', { class: 'top3__vendor', text: m.vendor + ' · ' + (m.deployment === 'api' ? 'API' : 'Local') })),
        h('span', { class: 'top3__val', text: U.pct(m.acc[key]) }),
        h('span', { class: 'top3__bar', attrs: { 'aria-hidden': 'true' }, style: { width: (m.acc[key] / max * 100) + '%', background: U.wlVar(key) } }));
      U.hoverTip(li, function () {
        return { title: m.name, rows: [{ label: g.longLabel + ' accuracy', value: U.pct(m.acc[key]) + '%', color: U.css('--wl-' + key) }],
          note: m.vendor + ' · ' + (m.deployment === 'api' ? 'API' : 'Local') + ' · rank ' + r + ' of ' + models.length + ' models (Table 1, audited accuracy)' };
      });
      items.push(li);
      ol.appendChild(li);
    });
    /* one Tab stop for the mini chart; arrow keys move between its bars */
    if (items.length) U.roving(items);
    right.appendChild(ol);
    var locals = models.filter(function (m) { return m.deployment === 'local'; }).sort(function (a, b) { return b.acc[key] - a.acc[key]; });
    if (locals.length) right.appendChild(h('p', { class: 'cd__local' }, 'Best local model: ', h('b', { text: locals[0].shortName }), ' (' + U.pct(locals[0].acc[key]) + ')'));
    grid.appendChild(right);
    box.appendChild(grid);

    /* example task */
    var exs = D.examples.filter(function (e) { return e.group === key; });
    if (exs.length) {
      var idx = exampleIdx[key] || 0;
      var ex = h('div', { class: 'example' });
      var tabs = h('div', { class: 'example__tabs' }, h('h4', { text: 'Example task from the repo' }));
      var seg = h('div', { class: 'seg', attrs: { role: 'radiogroup', 'aria-label': 'Example task' } });
      tabs.appendChild(seg);
      ex.appendChild(tabs);
      var body = h('div');
      ex.appendChild(body);
      U.seg(seg, exs.map(function (e, i) { return { value: i, label: e.sourceName }; }), idx, function (v) { exampleIdx[key] = v; drawExample(body, exs[v]); });
      drawExample(body, exs[idx]);
      box.appendChild(ex);
    }
  }

  function drawExample(body, e) {
    body.textContent = '';
    var card = h('div', { class: 'example__card example__card--taped' + (e.imageFile ? ' has-img' : '') });
    if (e.imageFile) {
      var zb = U.zoomable(U.IMG + e.imageFile, e.imageAlt || '', e.imageAlt || '', 'task image for ' + e.id);
      card.appendChild(h('div', { class: 'example__img' }, zb));
    }
    var txt = h('div');
    txt.appendChild(h('p', { class: 'example__prompt', text: e.promptExcerpt, attrs: { lang: /[一-鿿]/.test(e.promptExcerpt) ? 'zh' : null } }));
    if (e.englishGloss) txt.appendChild(h('p', { class: 'example__gloss', text: 'English wording in the paper: “' + e.englishGloss + '”' }));
    /* a translation made for the page (the paper does not give one): labelled as such */
    else if (e.englishTranslation) txt.appendChild(h('p', { class: 'example__gloss', text: 'In English (our translation): “' + e.englishTranslation + '”' }));
    var meta = h('div', { class: 'example__meta' },
      h('span', { class: 'pill pill--soft example__id', text: e.id }),
      h('span', { class: 'pill', text: e.scoring + ' scoring' }),
      h('span', { class: 'pill', text: e.timeoutSeconds + ' s budget' }),
      h('span', { class: 'pill', text: 'artifact: ' + e.artifact }));
    txt.appendChild(meta);
    var notes = [e.excerptNote];
    if (e.paperRef) notes.push(e.paperRef + '.');
    txt.appendChild(h('p', { class: 'example__note', text: notes.join(' ') }));
    card.appendChild(txt);
    body.appendChild(card);
  }

  /* ---------------- sources ---------------- */
  var chipBtns = {}, segEls = {}, pinned = null;
  function buildSources() {
    U.$('#sources-sub').textContent = D.stats.sources + ' public benchmarks contribute ' + D.stats.tasks + ' tasks. Bar width is the number of tasks each source contributes; color shows its workload group.';
    var lg = U.$('#sources-legend');
    U.GROUPS.forEach(function (g) {
      lg.appendChild(h('span', { class: 'legend__item' }, h('span', { class: 'legend__sw', style: { background: U.wlVar(g.key) } }), g.label));
    });
    var bar = U.$('#compbar');
    D.sources.forEach(function (s) {
      var g = U.group(s.group);
      /* pointer-only view of the composition: the source chips below are the keyboard and
         screen-reader equivalent (same tooltip, same pin action), so the bar is aria-hidden */
      var seg = h('div', { class: 'compbar__seg', style: { background: U.wlVar(s.group), flex: s.count + ' 1 0', 'min-width': '0' } });
      seg.addEventListener('pointermove', function (e) { U.tip.show(srcTip(s), e.clientX, e.clientY, seg); });
      seg.addEventListener('pointerleave', function () { U.tip.hide(seg); });
      seg.addEventListener('pointerenter', function () { hot(s.key, true); });
      seg.addEventListener('pointerleave', function () { hot(s.key, false); });
      seg.addEventListener('click', function () { pin(s.key); });
      segEls[s.key] = seg;
      bar.appendChild(seg);
    });
    var wall = U.$('#chipwall');
    U.GROUPS.forEach(function (g) {
      /* lane title breaks only between "modality · form", never inside a part; the count never splits */
      var title = h('span', { class: 'lane__title' });
      g.longLabel.split(' · ').forEach(function (part, i, arr) { title.appendChild(h('span', { class: 'nowrap', text: part + (i < arr.length - 1 ? ' ·' : '') })); if (i < arr.length - 1) title.appendChild(document.createTextNode(' ')); });
      var lane = h('div', { class: 'lane' }, h('div', { class: 'lane__head' }, h('span', { class: 'legend__sw', style: { background: U.wlVar(g.key) } }), title, h('small', { text: g.count + ' tasks' })));
      var chips = h('div', { class: 'lane__chips' });
      g.sources.forEach(function (k) {
        var s = U.source(k);
        var c = h('button', { class: 'chip', attrs: { type: 'button', 'aria-pressed': 'false', 'aria-controls': 'source-info', 'aria-label': s.name + ', ' + s.count + ' tasks' } }, s.name, h('span', { class: 'chip__n', text: String(s.count) }));
        U.hoverTip(c, function () { return srcTip(s); });
        c.addEventListener('pointerenter', function () { hot(k, true); });
        c.addEventListener('pointerleave', function () { hot(k, false); });
        c.addEventListener('click', function () { pin(k); });
        chipBtns[k] = c;
        chips.appendChild(c);
      });
      lane.appendChild(chips);
      wall.appendChild(lane);
    });
    U.$('#source-info').appendChild(h('p', { class: 'source-info__empty', text: 'select a benchmark to read what it tests' }));

    /* a named, focusable scroller with the caption above it, like the other table views */
    U.tableView(U.$('#sources-table'), U.table([
      { label: 'Benchmark', get: function (s) { return s.name; } },
      { label: 'Capability', get: function (s) { return s.capability; } },
      { label: '# Tasks', num: true, get: function (s) { return String(s.count); } },
      { label: 'Group', get: function (s) { return U.group(s.group).label; } },
      { label: 'Scoring', get: function (s) { return s.scoring; } }
    ], D.sources, 'Source benchmarks (Table 9)'));
  }
  function srcTip(s) {
    var g = U.group(s.group);
    return { title: s.name, rows: [
      { label: 'Tasks', value: String(s.count), color: U.css('--wl-' + s.group) },
      { label: 'Group', value: g.label },
      { label: 'Scoring', value: s.scoring }
    ], note: s.capability };
  }
  function hot(k, on) {
    if (chipBtns[k]) chipBtns[k].classList.toggle('is-hot', on);
    if (segEls[k]) segEls[k].classList.toggle('is-hot', on);
  }
  function pin(k) {
    pinned = pinned === k ? null : k;
    Object.keys(chipBtns).forEach(function (x) { chipBtns[x].setAttribute('aria-pressed', String(x === pinned)); });
    var box = U.$('#source-info');
    box.textContent = '';
    if (!pinned) { box.appendChild(h('p', { class: 'source-info__empty', text: 'select a benchmark to read what it tests' })); return; }
    var s = U.source(pinned), g = U.group(s.group);
    var cite = s.citation || {};
    box.appendChild(h('div', { class: 'source-info__card' },
      h('h4', { text: s.fullName && s.fullName !== s.name ? s.name + ' — ' + s.fullName : s.name }),
      h('div', { class: 'source-info__meta' },
        h('span', { class: 'pill' }, h('span', { class: 'dot', style: { background: U.wlVar(s.group) } }), g.label),
        h('span', { class: 'pill', text: s.count + ' tasks' }),
        h('span', { class: 'pill', text: s.scoring }),
        h('span', { class: 'pill pill--soft', text: s.capability })),
      h('p', { text: s.description }),
      cite.title ? h('p', { class: 'source-info__cite', text: (cite.text ? cite.text + '. ' : '') + cite.title + (cite.venue ? '. ' + cite.venue : '') }) : null));
  }

  /* ---------------- explorer ---------------- */
  function buildExplorer() {
    U.$('#explorer-sub').textContent = D.tasks.length + ' tasks · id and name, source, group, scoring, level and time budget';
    var fg = U.$('#f-group'), fs = U.$('#f-source'), fsc = U.$('#f-scoring'), fq = U.$('#f-q');
    fg.appendChild(h('option', { text: 'All groups', attrs: { value: '' } }));
    U.GROUPS.forEach(function (g) { fg.appendChild(h('option', { text: g.label, attrs: { value: g.key } })); });
    fs.appendChild(h('option', { text: 'All sources', attrs: { value: '' } }));
    D.sources.forEach(function (s) { fs.appendChild(h('option', { text: s.name, attrs: { value: s.key } })); });
    fsc.appendChild(h('option', { text: 'All modes', attrs: { value: '' } }));
    ['Auto', 'Hybrid', 'Judge'].forEach(function (s) { fsc.appendChild(h('option', { text: s, attrs: { value: s } })); });
    var table = U.$('#task-table');
    table.appendChild(h('caption', { class: 'sr-only', text: 'Task metadata from the repository (no prompts or answers)' }));
    var thead = h('thead', null, h('tr', null,
      h('th', { text: 'Task id · name', attrs: { scope: 'col' } }), h('th', { text: 'Source', attrs: { scope: 'col' } }),
      h('th', { text: 'Group', attrs: { scope: 'col' } }), h('th', { text: 'Scoring', attrs: { scope: 'col' } }),
      h('th', { text: 'Level', attrs: { scope: 'col' } }), h('th', { class: 'num', text: 'Time budget (s)', attrs: { scope: 'col' } })));
    var tb = h('tbody');
    table.appendChild(thead); table.appendChild(tb);
    function draw() {
      var q = fq.value.trim().toLowerCase();
      var rows = D.tasks.filter(function (t) {
        return (!fg.value || t.group === fg.value) && (!fs.value || t.source === fs.value) && (!fsc.value || t.scoring === fsc.value) &&
          (!q || t.id.toLowerCase().indexOf(q) >= 0 || (t.name || '').toLowerCase().indexOf(q) >= 0);
      });
      tb.textContent = '';
      var frag = document.createDocumentFragment();
      rows.forEach(function (t) {
        var g = U.group(t.group);
        frag.appendChild(h('tr', null,
          h('th', { class: 'mono', attrs: { scope: 'row' } }, t.id, t.name ? h('span', { class: 'task-name', text: t.name }) : null),
          h('td', { text: U.source(t.source).name }),
          h('td', null, h('span', { class: 'legend__item' }, h('span', { class: 'legend__sw', style: { background: U.wlVar(t.group), width: '10px', height: '10px' } }), g.label)),
          h('td', { text: t.scoring }),
          h('td', { text: t.level || '—' }),
          h('td', { class: 'num', text: String(t.timeoutSeconds) })));
      });
      tb.appendChild(frag);
      U.$('#explorer-count').textContent = 'Showing ' + rows.length + ' of ' + D.tasks.length + ' tasks';
    }
    [fg, fs, fsc].forEach(function (el) { el.addEventListener('change', draw); });
    fq.addEventListener('input', draw);
    /* the 233-row table is only built the first time the explorer is opened */
    var ex = U.$('#explorer'), built = false;
    function ensure() { if (!built && ex.open) { built = true; draw(); } }
    ex.addEventListener('toggle', ensure);
    ensure();
  }

  U.initWorkloads = function () {
    buildMatrix();
    select(D.groupOrder[0]);
    buildSources();
    buildExplorer();
  };
})();
