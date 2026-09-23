/* Evidence-based audit: funnel, judges, MAE, hallucination patterns (Table 3),
   paper figures 5/6, and the failure taxonomy (Tables 4/5). */
(function () {
  'use strict';
  var U = window.U, D = U.D, h = U.h, A = D.audit, S = D.stats;
  var DEP = [
    { key: 'api', label: 'API', color: 'var(--series-api)', cssVar: '--series-api' },
    { key: 'local', label: 'Local', color: 'var(--series-local)', cssVar: '--series-local' }
  ];
  var ART = { 'deadlock-loop': 'cr-crab', 'rubric-leakage': 'cr-fish', 'pseudo-tool-call-credulity': 'cr-hermit', 'output-instability': 'cr-jelly', 'timeout-with-credit': 'cr-snail' };

  function depLegend(host) {
    host.textContent = '';
    DEP.forEach(function (d) { host.appendChild(h('span', { class: 'legend__item' }, h('span', { class: 'legend__sw', style: { background: d.color } }), d.label)); });
  }

  /* keep a parenthetical such as "(score set to 0)" on one line */
  function nowrapParens(text) {
    var frag = document.createDocumentFragment();
    String(text).split(/(\([^)]*\))/).forEach(function (part) {
      if (!part) return;
      frag.appendChild(part.charAt(0) === '(' ? h('span', { class: 'nowrap', text: part }) : document.createTextNode(part));
    });
    return frag;
  }

  function lead() {
    var w = D.meta.why.filter(function (x) { return x.key === 'trustworthy'; })[0];
    U.$('#rel-lead').textContent = w.problem + ' DAREBench applies deterministic post-hoc rules to every score that involves the primary judge; flagged cases go to a meta-judge from a different model family, which decides whether the execution evidence supports the awarded positive score.';
  }

  /* Audit funnel as step cards: every number is printed, no bars (the stages differ by
     orders of magnitude, so bars on one scale would hide the last two steps, and bars on
     per-stage scales would mislead). */
  function funnel() {
    var ol = U.$('#funnel');
    var sub = {
      runs: 'every applicable model–task pair, in one shared OpenClaw runtime',
      judgeCalls: 'scores that involve the primary judge (judge or hybrid tasks)',
      flagged: 'suspicious positive scores routed to the meta-judge',
      confirmed: 'positive credit that the trajectory and artifacts do not support'
    };
    A.funnel.forEach(function (st, i) {
      var last = i === A.funnel.length - 1;
      var li = h('li', { class: 'astep' + (last ? ' astep--final' : '') },
        h('span', { class: 'astep__n', attrs: { 'aria-hidden': 'true' }, text: String(i + 1) }),
        h('div', { class: 'astep__body' },
          h('span', { class: 'astep__v', text: U.int(st.value) }),
          h('span', { class: 'astep__l' }, nowrapParens(st.label)),
          sub[st.key] ? h('span', { class: 'astep__s', text: sub[st.key] }) : null));
      if (last) li.appendChild(U.burst('BUSTED!', 'red'));
      ol.appendChild(li);
    });
    var rule = U.$('#audit-rule');
    rule.appendChild(h('p', { class: 'funnel__rule-h', text: 'Audited score (Eq. 10)' }));
    rule.appendChild(h('code', { text: A.rule }));
    var feats = h('div', { class: 'feats' }, h('span', { class: 'note', text: 'Rule features (Appendix C):' }));
    A.triggerFeatures.forEach(function (f) { feats.appendChild(h('code', { text: f })); });
    rule.appendChild(feats);
  }

  function judges() {
    var c = U.$('#judge-chain');
    function node(icon, bg, title, sub) {
      return h('div', { class: 'jnode' }, h('span', { class: 'jnode__icon', style: { background: bg } }, U.icon(icon)), h('div', null, h('b', { text: title }), h('span', { text: sub })));
    }
    c.appendChild(node('i-bubble', 'var(--sec-orange-fill)', 'Primary judge: ' + A.primaryJudge, 'Scores judge and hybrid tasks against a task-level rubric.'));
    c.appendChild(h('span', { class: 'jarrow' }, U.icon('i-down'), 'rule-flagged positive scores'));
    c.appendChild(node('i-eye', 'var(--sec-purple-fill)', 'Meta-judge: ' + A.metaJudge, 'A different model family. Sees the prompt, trajectory, artifacts, rubric and the primary judge’s rationale.'));
    c.appendChild(h('span', { class: 'jarrow' }, U.icon('i-down'), 'verdict'));
    c.appendChild(node('i-check', 'var(--sec-green-fill)', 'Unsupported → score set to zero', 'Otherwise the original score is kept.'));

    var mae = U.$('#mae');
    mae.appendChild(h('h4', { class: 'sr-only', text: 'Agreement with human experts' }));
    mae.appendChild(h('div', { class: 'mae__tiles' },
      h('div', { class: 'mae__tile' }, h('div', { class: 'mae__v', text: A.mae.primaryJudge.toFixed(3) }), h('div', { class: 'mae__l', text: 'MAE, primary judge' })),
      h('div', { class: 'mae__mid' }, h('span', { class: 'scribble scribble--sm', text: 'about half' }), U.icon('i-arrow', 'mae__arrow')),
      h('div', { class: 'mae__tile mae__tile--after' }, h('div', { class: 'mae__v', text: A.mae.afterMetaJudge.toFixed(3) }), h('div', { class: 'mae__l', text: 'MAE, after meta-judge' }))));
    mae.appendChild(h('p', { class: 'mae__cap', text: A.mae.definition.replace(/\.$/, '') + ' (n = ' + A.mae.n + '). Lower is better; the paper notes the corrected error is approximately half that of the primary judge (Appendix C).' }));
  }

  function patterns() {
    U.$('#patterns-sub').textContent = 'Unsupported positive scores confirmed by the meta-judge, split by deployment mode (Table 3): ' + A.totals.total + ' in total, ' + A.totals.local + ' from local and ' + A.totals.api + ' from API models.';
    depLegend(U.$('#patterns-legend'));
    var max = 0;
    A.patterns.forEach(function (p) { max = Math.max(max, p.api, p.local); });
    var grid = U.$('#pattern-grid');
    var patternRows = [];
    A.patterns.forEach(function (p) {
      var bars = h('div', { class: 'pbars' });
      DEP.forEach(function (d) {
        var v = p[d.key];
        var track = h('span', { class: 'pbar__track' },
          h('span', { class: 'pbar__fill', style: { width: 'calc((100% - 30px) * ' + (v / max) + ')', background: d.color, 'min-width': v ? '3px' : '0' } }),
          h('span', { class: 'pbar__v', text: String(v), style: { left: 'calc((100% - 30px) * ' + (v / max) + ' + ' + (v ? 6 : 0) + 'px)' } }));
        var row = h('div', { class: 'pbar', attrs: { role: 'img', 'aria-label': p.name + ', ' + d.label + ': ' + v } }, h('span', { text: d.label, attrs: { 'aria-hidden': 'true' } }), track);
        U.hoverTip(row, function () {
          return { title: p.name, rows: DEP.map(function (x) { return { label: x.label, value: String(p[x.key]), color: U.css(x.cssVar) }; }), note: 'Table 3, confirmed unsupported positive scores' };
        });
        patternRows.push(row);
        bars.appendChild(row);
      });
      grid.appendChild(h('li', { class: 'pattern reveal' },
        U.icon(ART[p.key] || 'cr-crab', 'pattern__art'),
        h('div', { class: 'pattern__txt' }, h('h4', { text: p.name }), h('p', { text: p.definition })),
        bars));
    });
    /* one Tab stop for the chart; arrow keys move between bars, each with its tooltip */
    U.roving(patternRows);
    var rows = A.patterns.concat([{ name: 'Total', definition: '', local: A.totals.local, api: A.totals.api, total: A.totals.total }]);
    U.tableView(U.$('#patterns-table'), U.table([
      { label: 'Pattern', get: function (p) { return p.name; } },
      { label: 'Definition', get: function (p) { return p.definition; } },
      { label: 'API', num: true, get: function (p) { return String(p.api); } },
      { label: 'Local', num: true, get: function (p) { return String(p.local); } },
      { label: 'Total', num: true, get: function (p) { return String(p.total); } }
    ], rows, 'Hallucination patterns (Table 3)'));
  }

  function figs() {
    var box = U.$('#audit-figs');
    A.figures.forEach(function (k) {
      var f = U.fig(k);
      if (!f) return;
      var parts = f.caption.split(/\.\s+(?=Task:)/);
      box.appendChild(h('figure', { class: 'afig card card--blob' },
        U.zoomable(U.IMG + f.file, f.alt, f.label + '. ' + f.caption, f.label),
        h('figcaption', null,
          h('p', { class: 'afig__label', text: f.label + ' · ' + f.section }),
          h('h4', { text: parts[0] }),
          h('p', { text: parts[1] ? parts[1] : '' }))));
    });
  }

  /* ---------- failure taxonomy (Tables 4/5) ---------- */
  function taxonomy() {
    var T = D.errorTaxonomy;
    U.$('#tax-sub').textContent = T.note + ' Counts of failure codes among ' + T.totals.api.sampled + ' API and ' + T.totals.local.sampled + ' local sampled failures (Table 5 totals).';
    depLegend(U.$('#tax-legend'));
    var host = U.$('#tax-box');
    host.textContent = '';
    var max = 0;
    T.codes.forEach(function (c) { max = Math.max(max, T.totals.api[c.code], T.totals.local[c.code]); });
    var list = h('ul', { class: 'taxrows' });
    var taxRows = [];
    T.codes.forEach(function (c) {
      var bars = h('div', { class: 'pbars' });
      DEP.forEach(function (d) {
        var v = T.totals[d.key][c.code];
        var track = h('span', { class: 'pbar__track' },
          h('span', { class: 'pbar__fill', style: { width: 'calc((100% - 30px) * ' + (v / max) + ')', background: d.color, 'min-width': v ? '3px' : '0' } }),
          h('span', { class: 'pbar__v', text: String(v), style: { left: 'calc((100% - 30px) * ' + (v / max) + ' + ' + (v ? 6 : 0) + 'px)' } }));
        var row = h('div', { class: 'pbar', attrs: { role: 'img', 'aria-label': c.code + ' (' + c.name + '), ' + d.label + ': ' + v + '. ' + c.definition } }, h('span', { text: d.label, attrs: { 'aria-hidden': 'true' } }), track);
        U.hoverTip(row, function () {
          return { title: c.code + ' · ' + c.name, rows: DEP.map(function (x) { return { label: x.label, value: String(T.totals[x.key][c.code]), color: U.css(x.cssVar) }; }), note: c.definition };
        });
        taxRows.push(row);
        bars.appendChild(row);
      });
      list.appendChild(h('li', { class: 'taxrow' },
        h('div', { class: 'taxrow__lab' }, h('b', { text: c.code }), h('span', { text: c.name })),
        bars));
    });
    host.appendChild(list);
    U.roving(taxRows);
    U.tableView(U.$('#tax-table'), U.table([
      { label: 'Code', get: function (c) { return c.code; } },
      { label: 'Name', get: function (c) { return c.name; } },
      { label: 'Definition', get: function (c) { return c.definition; } },
      { label: 'API', num: true, get: function (c) { return String(T.totals.api[c.code]); } },
      { label: 'Local', num: true, get: function (c) { return String(T.totals.local[c.code]); } },
      { label: 'All', num: true, get: function (c) { return String(T.totals.all[c.code]); } }
    ], T.codes, 'Failure taxonomy (Table 4) with Table 5 totals'));
  }

  U.initReliability = function () { lead(); funnel(); judges(); patterns(); figs(); taxonomy(); };
})();
