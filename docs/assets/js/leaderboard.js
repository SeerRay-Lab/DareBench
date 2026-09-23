/* Interactive leaderboard: paper Table 1 (audited accuracy), all 35 models.
   Column order follows Table 1 (Text groups, Text Avg, MM groups, MM Avg) plus Overall (Eq. 11). */
(function () {
  'use strict';
  var U = window.U, D = U.D, h = U.h, S = D.stats;
  var state = { track: 'full', deploy: 'all', style: 'bars', sort: 'overall', dir: 'desc' };
  var segs = {};
  /* heat mode: four bins on teal steps 400-700, the subset that passes the ordinal checks
     (light end 2.16:1 on white; validate_palette --ordinal). Thresholds are display scaffolding. */
  var BINS = [40, 60, 80];
  var STEPS = [400, 500, 600, 700];
  var compact = false; // summary columns first + swipe hint: used whenever the full layout overflows
  var FORM_SHORT = { 'single-step': 'Single', 'multi-step': 'Multi', 'multi-step+tools': 'Multi+Tools' };

  function isStated(m) { return /^paper prose/.test(m.overallSource || ''); }
  function colDefs() {
    var c = [];
    U.TEXT_GROUPS.forEach(function (g) { c.push({ key: g.key, label: g.label, short: FORM_SHORT[g.form], long: g.longLabel, group: g.key, mod: 'text', get: function (m) { return m.acc[g.key]; } }); });
    c.push({ key: 'textAvg', label: 'Text Avg', short: 'Avg', long: 'Text average (Table 1, task-weighted)', avg: true, mod: 'text', get: function (m) { return m.textAvg; } });
    if (state.track === 'full') {
      U.MM_GROUPS.forEach(function (g) { c.push({ key: g.key, label: g.label, short: FORM_SHORT[g.form], long: g.longLabel, group: g.key, mod: 'mm', get: function (m) { return m.acc[g.key]; } }); });
      c.push({ key: 'mmAvg', label: 'MM Avg', short: 'Avg', long: 'Multimodal average (Table 1, task-weighted)', avg: true, mod: 'mm', get: function (m) { return m.mmAvg; } });
      c.push({ key: 'overall', label: 'Overall', short: 'Overall', long: 'Overall accuracy over all applicable tasks (Eq. 11)', avg: true, overall: true, mod: 'all', get: function (m) { return m.textOnly ? null : m.overall; } });
    }
    if (compact) {
      /* the table overflows its card: summary columns first so they are visible without swiping */
      var avgs = c.filter(function (x) { return x.avg; }).sort(function (a, b) { return (b.overall ? 1 : 0) - (a.overall ? 1 : 0); });
      var groups = c.filter(function (x) { return !x.avg; });
      if (groups.length) groups[0].sep = true;
      return avgs.concat(groups);
    }
    c.forEach(function (x) { if (x.overall || (x.mod === 'mm' && x.group === U.MM_GROUPS[0].key)) x.sep = true; });
    return c;
  }
  function depOk(m) { return state.deploy === 'all' || m.deployment === state.deploy; }
  function step(v) { var i = 0; while (i < BINS.length && v >= BINS[i]) i++; return STEPS[i]; }
  function overallNote(m) {
    if (isStated(m)) return 'Stated in the paper (' + m.overallSource.replace(/^paper prose\s*\(?/, '').replace(/\)$/, '') + ')';
    return 'Derived with the paper’s definition: task-count-weighted over ' + m.overallTasks + ' tasks (Eq. 11), from the Table 1 Text Avg (' + S.textTasks + ' tasks) and MM Avg (' + S.mmTasks + ' tasks)';
  }
  function barColor(c) { return c.overall ? 'var(--series-overall)' : c.mod === 'text' ? 'var(--series-text)' : 'var(--series-mm)'; }

  /* Render in the full layout; if the table then overflows its scroller, re-render compact. */
  function render() {
    compact = false;
    draw();
    var sc = U.$('#lb-table').parentNode, t = U.$('#lb-table');
    if (t.getBoundingClientRect().width > sc.clientWidth + 1) { compact = true; draw(); }
    overflowUi();
  }
  var FADE = 40; // the right-edge fade of an overflowing table (style.css mask, 36 px) plus a little air
  function overflowUi() {
    var sc = U.$('#lb-table').parentNode, card = sc.closest('.lb');
    var over = sc.scrollWidth > sc.clientWidth + 1;
    card.classList.toggle('is-overflow', over);
    sc.classList.toggle('at-end', !over || sc.scrollLeft + sc.clientWidth >= sc.scrollWidth - 2);
    /* the visible width of the scroller: the full-width notice row wraps inside it instead of running
       past the right edge */
    sc.style.setProperty('--lb-vis', sc.clientWidth + 'px');
    /* keyboard focus never lands under the sticky Rank · Model column or the right-edge fade (WCAG 2.4.11) */
    var st = U.$('#lb-table thead th.c-model');
    sc.style.scrollPaddingLeft = over && st ? st.offsetWidth + 'px' : '';
    sc.style.scrollPaddingRight = over ? FADE + 'px' : '';
  }
  /* fallback for browsers that ignore scroll-padding when focus scrolls: bring the focused control
     fully into the part of the scroller that the sticky column and the fade do not cover */
  function revealFocused(e) {
    var el = e.target, sc = U.$('#lb-table').parentNode;
    if (!el || !el.classList || !el.classList.contains('sort-btn') || !sc.contains(el)) return;
    var st = U.$('#lb-table thead th.c-model');
    var s = sc.getBoundingClientRect(), r = el.getBoundingClientRect();
    var left = s.left + (st ? st.getBoundingClientRect().width : 0), right = s.left + sc.clientWidth - (sc.scrollWidth > sc.clientWidth + 1 ? FADE : 0);
    if (r.left < left) sc.scrollLeft -= left - r.left;
    else if (r.right > right) sc.scrollLeft += Math.min(r.right - right, r.left - left);
  }
  function draw() {
    var C = colDefs();
    var main, extra = [];
    if (state.track === 'full') {
      main = D.models.filter(function (m) { return !m.textOnly && depOk(m); });
      extra = D.models.filter(function (m) { return m.textOnly && depOk(m); });
    } else {
      main = D.models.filter(depOk);
    }
    var sortCol = C.filter(function (c) { return c.key === state.sort; })[0];
    if (!sortCol) { state.sort = state.track === 'full' ? 'overall' : 'textAvg'; state.dir = 'desc'; sortCol = C.filter(function (c) { return c.key === state.sort; })[0]; }
    var ranks = U.rank(main, sortCol.get);
    function cmp(a, b) {
      var va = sortCol.get(a), vb = sortCol.get(b);
      if (va == null && vb == null) return 0; if (va == null) return 1; if (vb == null) return -1;
      var d = vb - va;
      if (d === 0) d = D.models.indexOf(a) - D.models.indexOf(b); // ties keep Table 1 order
      return state.dir === 'desc' ? d : -d;
    }
    main.sort(cmp); extra.sort(cmp);
    /* best value per column among every row shown (text-only rows included for text columns, as Table 1 marks places) */
    var best = {};
    C.forEach(function (c) { var mx = null; main.concat(extra).forEach(function (m) { var v = c.get(m); if (v != null && (mx == null || v > mx)) mx = v; }); best[c.key] = mx; });

    var t = U.$('#lb-table');
    t.textContent = '';
    t.className = 'lb-table style-' + state.style + (state.track === 'text' ? ' lb-table--text' : '');
    t.appendChild(h('caption', { class: 'sr-only', attrs: { id: 'lb-caption' } },
      'Leaderboard, ' + (state.track === 'full' ? 'full track (text and multimodal)' : 'text track') + ', ' +
      (state.deploy === 'all' ? 'all models' : state.deploy === 'api' ? 'API models' : 'local models') + ', sorted by ' + sortCol.long + ' ' + (state.dir === 'desc' ? 'descending' : 'ascending') + '. Audited accuracy in percent.'));

    var thead = h('thead');
    var gr = h('tr', { class: 'lb-groups' + (compact ? ' is-hidden-row' : '') });
    gr.appendChild(h('td', { class: 'c-model sticky' }));
    var nText = C.filter(function (c) { return c.mod === 'text'; }).length, nMM = C.filter(function (c) { return c.mod === 'mm'; }).length;
    gr.appendChild(h('th', { attrs: { colspan: String(nText), scope: 'colgroup' }, class: 'grp grp--text' }, h('span', { class: 'gdot', style: { background: 'var(--series-text)' } }), 'Text'));
    if (nMM) gr.appendChild(h('th', { attrs: { colspan: String(nMM), scope: 'colgroup' }, class: 'grp grp--mm' }, h('span', { class: 'gdot', style: { background: 'var(--series-mm)' } }), 'Multimodal'));
    if (state.track === 'full') gr.appendChild(h('th', { attrs: { scope: 'col' }, class: 'grp grp--all', text: 'All' }));
    thead.appendChild(gr);

    var hr = h('tr');
    hr.appendChild(h('th', { attrs: { scope: 'col' }, class: 'c-model sticky' }, h('span', { class: 'c-model__h', text: 'Rank · Model' })));
    C.forEach(function (c) {
      var th = h('th', { class: (c.avg ? 'is-avg' : '') + (c.overall ? ' is-overall' : '') + (c.sep ? ' is-sep' : ''), attrs: { scope: 'col', 'aria-sort': c.key === state.sort ? (state.dir === 'desc' ? 'descending' : 'ascending') : 'none' } });
      /* accessible name starts with the visible label (WCAG 2.5.3); th[aria-sort] carries the sort state */
      var b = h('button', { class: 'sort-btn', attrs: { type: 'button', 'data-col': c.key } });
      var inner = h('span', { class: 'sort-btn__lab' });
      if (c.group) inner.appendChild(h('span', { class: 'gtick', style: { background: U.wlVar(c.group) } }));
      inner.appendChild(h('span', { class: 'lab-lg', text: c.label }));
      inner.appendChild(h('span', { class: 'sr-only', text: 'sort by ' + c.long }));
      b.appendChild(inner);
      b.appendChild(h('span', { class: 'arr', attrs: { 'aria-hidden': 'true' }, text: c.key === state.sort ? (state.dir === 'desc' ? '▼' : '▲') : '▽' }));
      b.addEventListener('click', function () {
        if (state.sort === c.key) state.dir = state.dir === 'desc' ? 'asc' : 'desc';
        else { state.sort = c.key; state.dir = 'desc'; }
        render();
        var again = U.$('#lb-table thead .sort-btn[data-col="' + c.key + '"]');
        if (again) again.focus();
        var line = U.$('#lb-bubble .narrator-bubble__line');
        U.$('#live').textContent = 'Sorted by ' + c.long + ', ' + (state.dir === 'desc' ? 'highest first' : 'lowest first') + '. ' + (line ? line.textContent : '');
      });
      th.appendChild(b);
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    t.appendChild(thead);

    var tb = h('tbody');
    main.forEach(function (m) { tb.appendChild(row(m, C, ranks.get(m), best, sortCol)); });
    t.appendChild(tb);
    if (extra.length) {
      var tb2 = h('tbody', { class: 'lb-extra' });
      var btn = h('button', { class: 'linkish', attrs: { type: 'button' } }, 'Compare them in the Text track');
      btn.addEventListener('click', function () { U.lbSet({ track: 'text' }); var r = U.$('#lb-track [aria-checked="true"]'); if (r) r.focus(); });
      tb2.appendChild(h('tr', { class: 'lb-divider' }, h('td', { attrs: { colspan: String(C.length + 1) } },
        h('span', { class: 'lb-divider__in' }, U.icon('i-info'), h('span', null, 'Text-only models: evaluated on the ' + U.int(S.textTasks) + ' text tasks only, so they have no multimodal scores and no Overall here. Not ranked in this track. ', btn)))));
      extra.forEach(function (m) { tb2.appendChild(row(m, C, null, best, sortCol)); });
      t.appendChild(tb2);
    }

    notes(main, extra);
    legend();
    bubble(sortCol, main);
  }

  function row(m, C, r, best, sortCol) {
    var tr = h('tr', { class: m.textOnly && state.track === 'full' ? 'is-extra' : '' });
    var rc;
    if (r == null) rc = h('span', { class: 'c-rank c-rank--none', attrs: { 'aria-hidden': 'true' } });
    else if (r <= 3) rc = h('span', { class: 'medal medal--' + r, text: String(r), attrs: { title: 'Rank ' + r + ' by ' + sortCol.label + ' in this view' } });
    else rc = h('span', { class: 'c-rank', text: String(r) });
    var meta = h('span', { class: 'm-meta' },
      h('span', { class: 'm-dep m-dep--' + m.deployment, text: m.deployment === 'api' ? 'API' : 'Local' }),
      h('span', { class: 'm-vendor', text: m.vendor }));
    if (m.textOnly) meta.appendChild(h('span', { class: 'm-tag', text: 'text-only' }));
    tr.appendChild(h('th', { class: 'c-model sticky', attrs: { scope: 'row' } }, h('div', { class: 'c-model__in' }, rc, h('div', null, h('span', { class: 'm-name', text: m.name }), meta))));
    C.forEach(function (c) {
      var v = c.get(m);
      var td = h('td', { class: 'cellv' + (c.avg ? ' is-avg' : '') + (c.overall ? ' is-overall' : '') + (c.key === state.sort ? ' is-sorted' : '') + (c.sep ? ' is-sep' : ''), data: { m: m.name, c: c.key } });
      if (v == null) {
        td.classList.add('is-na');
        td.appendChild(h('span', { attrs: { 'aria-hidden': 'true' }, text: '—' }));
        td.appendChild(h('span', { class: 'sr-only', text: m.textOnly ? 'not evaluated (text-only model)' : 'not available' }));
        tr.appendChild(td); return;
      }
      var isBest = v === best[c.key];
      var cell = h('span', { class: 'cell' });
      if (isBest) { td.classList.add('is-best'); cell.appendChild(U.icon('i-crown', 'crown')); }
      cell.appendChild(h('span', { class: 'v', text: U.pct(v) }));
      if (c.overall && isStated(m)) cell.appendChild(h('span', { class: 'stated', attrs: { title: 'Value stated in the paper’s text' }, text: '◆' }));
      if (state.style === 'heat') {
        var s = step(v);
        td.style.background = 'var(--seq-' + s + ')';
        td.style.color = 'var(--seq-' + s + '-on)';
      } else {
        cell.appendChild(h('span', { class: 'cbar', attrs: { 'aria-hidden': 'true' } }, h('span', { style: { width: v + '%', background: barColor(c) } })));
      }
      td.appendChild(cell);
      if (isBest) td.appendChild(h('span', { class: 'sr-only', text: ' (best in column)' }));
      if (c.overall && isStated(m)) td.appendChild(h('span', { class: 'sr-only', text: ' (stated in the paper)' }));
      tr.appendChild(td);
    });
    return tr;
  }

  function notes(main, extra) {
    var textOnly = D.models.filter(function (m) { return m.textOnly; }).length;
    var note = U.$('#lb-note');
    note.textContent = '';
    note.appendChild(U.icon('i-info'));
    if (state.track === 'full') {
      note.appendChild(h('span', { text: 'Full track: the ' + S.multimodalModels + ' multimodal-capable models, ranked over all ' + S.tasks + ' tasks. The ' + textOnly + ' text-only models were not evaluated on multimodal tasks; they are listed below the ranking and compete in the Text track (' + S.textTasks + ' text tasks).' }));
    } else {
      note.appendChild(h('span', { text: 'Text track: all ' + S.models + ' models on the ' + S.textTasks + ' text tasks, ranked by the paper’s Text Avg by default. Text-only models are tagged.' }));
    }
    var foot = U.$('#lb-foot');
    foot.textContent = '';
    var stated = D.models.filter(isStated);
    foot.appendChild(h('p', null, h('strong', { text: 'Audited scores. ' }), 'Every accuracy is computed from audited task scores, ' + D.audit.rule.replace(/\.$/, '') + '. Group accuracies and the Text/MM averages are the paper’s Table 1 values (averages are task-count-weighted).'));
    if (state.track === 'full') {
      foot.appendChild(h('p', null, h('strong', { text: 'Overall. ' }),
        'Table 1 has no Overall column. Overall is the task-count-weighted mean over each model’s applicable tasks (Eq. 11). Values the paper states in its text are shown as stated and marked ',
        h('span', { class: 'stated', text: '◆' }), ' (' + stated.map(function (m) { return m.shortName + ' ' + U.pct(m.overall); }).join(', ') + '); the others are derived from Table 1 with the same definition.'));
    }
    foot.appendChild(h('p', null, h('strong', { text: 'Places. ' }), 'Table 1 marks first to third place within each deployment mode. Here the medals follow the current track, filter and sort column (competition ranking; ties share a place), and a crown marks the best value in each column among the rows shown.'));
  }

  function legend() {
    var lg = U.$('#lb-legend');
    lg.textContent = '';
    if (state.style === 'heat') {
      var ramp = h('span', { class: 'ramp', attrs: { role: 'img', 'aria-label': 'Accuracy color scale in ' + STEPS.length + ' bins: ' + STEPS.map(function (s, i) { return i === 0 ? 'below ' + BINS[0] : i === STEPS.length - 1 ? BINS[BINS.length - 1] + ' and above' : BINS[i - 1] + ' to ' + BINS[i]; }).join(', ') } });
      STEPS.forEach(function (s, i) {
        var lab = i === 0 ? '<' + BINS[0] : i === STEPS.length - 1 ? '≥' + BINS[BINS.length - 1] : BINS[i - 1] + '–' + BINS[i];
        ramp.appendChild(h('span', { text: lab, style: { background: 'var(--seq-' + s + ')', color: 'var(--seq-' + s + '-on)' } }));
      });
      lg.appendChild(h('span', { class: 'legend__item' }, h('span', { class: 'legend__title', text: 'Accuracy (%)' }), ramp));
    } else {
      lg.appendChild(h('span', { class: 'legend__item' }, h('span', { class: 'legend__title', text: 'Bar length = accuracy (0–100):' })));
      [['var(--series-text)', 'Text'], ['var(--series-mm)', 'Multimodal'], ['var(--series-overall)', 'Overall (all tasks)']].forEach(function (x) {
        if (state.track === 'text' && x[1] !== 'Text') return;
        lg.appendChild(h('span', { class: 'legend__item' }, h('span', { class: 'legend__bar', style: { background: x[0] } }), x[1]));
      });
    }
    lg.appendChild(h('span', { class: 'legend__item' }, h('span', { class: 'best-chip' }, U.icon('i-crown', 'crown')), 'best in column'));
    if (state.track === 'full') lg.appendChild(h('span', { class: 'legend__item' }, h('span', { class: 'stated', text: '◆' }), 'Overall stated in the paper'));
    lg.appendChild(h('span', { class: 'legend__item' }, h('span', { class: 'legend__title', text: 'Deployment:' }), h('span', { class: 'm-dep m-dep--api', text: 'API' }), h('span', { class: 'm-dep m-dep--local', text: 'Local' })));
  }

  /* narrator: the mascot names the leader of the current sort column */
  function bubble(sortCol, main) {
    var host = U.$('#lb-bubble');
    host.textContent = '';
    var valid = main.filter(function (m) { return sortCol.get(m) != null; });
    if (!valid.length) { host.textContent = 'No models match this filter.'; return; }
    var top = valid.slice().sort(function (a, b) { return sortCol.get(b) - sortCol.get(a); });
    var lead = top.filter(function (m) { return sortCol.get(m) === sortCol.get(top[0]); });
    var v = sortCol.get(lead[0]);
    host.appendChild(h('span', { class: 'narrator-bubble__lab', text: sortCol.group ? sortCol.long : sortCol.label }));
    var line = h('span', { class: 'narrator-bubble__line' }, h('b', { text: lead.map(function (m) { return m.name; }).join(' & ') }), (lead.length > 1 ? ' lead with ' : ' leads with ') + U.pct(v));
    if (sortCol.overall && !isStated(lead[0])) { line.appendChild(document.createTextNode(' ')); line.appendChild(h('span', { class: 'nowrap', text: '(derived, Eq. 11)' })); }
    line.appendChild(document.createTextNode('.'));
    host.appendChild(line);
    host.appendChild(h('span', { class: 'narrator-bubble__hint', text: 'Sort by another column and watch the gold medal move.' }));
  }

  function tooltips() {
    var t = U.$('#lb-table');
    t.addEventListener('pointermove', function (e) {
      var td = e.target.closest ? e.target.closest('td.cellv') : null;
      if (!td || td.classList.contains('is-na')) { U.tip.hide(); return; }
      var m = U.model(td.dataset.m), key = td.dataset.c;
      var c = colDefs().filter(function (x) { return x.key === key; })[0];
      if (!c) return;
      var v = c.get(m);
      var rowsSpec = [{ label: c.long, value: U.pct(v) + '%', color: c.group ? U.css('--wl-' + c.group) : null }];
      var note = m.vendor + ' · ' + (m.deployment === 'api' ? 'API' : 'Local') + (m.textOnly ? ' · text-only' : '');
      if (td.classList.contains('is-best')) note += ' · best in this column';
      if (c.overall) note += '. ' + overallNote(m) + '.';
      else note += '. Paper Table 1.';
      U.tip.show({ title: m.name, rows: rowsSpec, note: note }, e.clientX, e.clientY, t);
    });
    t.addEventListener('pointerleave', function () { U.tip.hide(); });
  }

  U.initLeaderboard = function () {
    U.$('#lb-lead').textContent = 'Audited accuracy (%) of ' + S.apiModels + ' commercial API models and ' + S.localModels + ' locally deployed open-weight models on each workload group, from the paper’s Table 1. Positive scores that the meta-judge confirmed as unsupported were set to zero before averaging. Sort any column: the leader changes with the workload.';
    segs.track = U.seg(U.$('#lb-track'), [
      { value: 'full', label: 'Full (text + MM)', title: 'Multimodal-capable models on all tasks' },
      { value: 'text', label: 'Text track (all ' + S.models + ')', title: 'All models on the text tasks' }
    ], state.track, function (v) { state.track = v; state.sort = v === 'full' ? 'overall' : 'textAvg'; state.dir = 'desc'; render(); });
    segs.deploy = U.seg(U.$('#lb-deploy'), [
      { value: 'all', label: 'All' },
      { value: 'api', label: 'API' },
      { value: 'local', label: 'Local' }
    ], state.deploy, function (v) { state.deploy = v; render(); });
    U.seg(U.$('#lb-style'), [
      { value: 'bars', label: 'Bars' },
      { value: 'heat', label: 'Heat' }
    ], state.style, function (v) { state.style = v; render(); });
    tooltips();
    render();
    var sc = U.$('#lb-table').parentNode;
    sc.addEventListener('scroll', function () { overflowUi(); }, { passive: true });
    sc.addEventListener('focusin', function (e) { requestAnimationFrame(function () { revealFocused(e); }); });
    /* re-decide the layout when the card width changes (keeps focus on the active sort button) */
    U.onResize(sc, function () {
      var a = document.activeElement, col = a && a.classList && a.classList.contains('sort-btn') ? a.dataset.col : null;
      render();
      if (col) { var again = U.$('#lb-table thead .sort-btn[data-col="' + col + '"]'); if (again) again.focus(); }
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
  };
  U.lbState = state;
  U.lbSet = function (o) {
    if (o.track && o.track !== state.track) { state.track = o.track; state.sort = o.track === 'full' ? 'overall' : 'textAvg'; state.dir = 'desc'; segs.track.select(o.track); }
    if (o.deploy) { state.deploy = o.deploy; segs.deploy.select(o.deploy); }
    render();
  };
})();
