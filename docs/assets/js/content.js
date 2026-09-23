/* Hero, motivation, overview, findings, case study, cite, footer.
   Every number is read from window.DARE; prose here paraphrases or quotes the paper. */
(function () {
  'use strict';
  var U = window.U, D = U.D, h = U.h, S = D.stats, M = D.meta;

  function finding(key) { return D.findings.filter(function (x) { return x.key === key; })[0]; }

  /* ---------------- hero ---------------- */
  function hero() {
    U.$('#hero-arxiv').textContent = 'arXiv:' + M.arxivId + ' · ' + M.arxivCategory + ' · ' + M.arxivDate;

    var ul = U.$('#authors');
    ul.textContent = ''; /* replace the static no-JS fallback */
    M.authors.forEach(function (a, i) {
      var li = h('li', null, a.name);
      var sup = h('sup', { text: a.affils.join(',') });
      if (a.equalContribution) sup.appendChild(h('span', { class: 'mark', text: M.authorNotes.equalSymbol, attrs: { title: M.authorNotes.equalContribution } }));
      if (a.corresponding) sup.appendChild(h('span', { class: 'mark', text: M.authorNotes.correspondingSymbol, attrs: { title: M.authorNotes.corresponding } }));
      li.appendChild(sup);
      if (i < M.authors.length - 1) li.appendChild(document.createTextNode(','));
      ul.appendChild(li);
    });
    var ol = U.$('#affils');
    ol.textContent = '';
    M.affiliations.forEach(function (af) { ol.appendChild(h('li', null, h('sup', { text: String(af.id) }), af.name)); });
    var an = U.$('#author-notes');
    an.textContent = '';
    an.appendChild(h('span', { class: 'nowrap', text: M.authorNotes.equalSymbol + ' ' + M.authorNotes.equalContribution }));
    an.appendChild(document.createTextNode('   '));
    an.appendChild(h('span', { class: 'nowrap', text: M.authorNotes.correspondingSymbol + ' ' + M.authorNotes.corresponding }));

    var tiles = [
      { v: U.int(S.tasks), l: 'agent tasks', sub: U.int(S.textTasks) + ' text · ' + U.int(S.mmTasks) + ' multimodal', icon: 'i-paper', bg: 'var(--sec-blue-fill)', c: 'var(--sec-blue-ink)' },
      { v: U.int(S.sources), l: 'source benchmarks', sub: 'selected and adapted', icon: 'i-compass', bg: 'var(--sec-blue-fill)', c: 'var(--sec-blue-ink)' },
      { v: U.matrixLabel(), l: 'workload matrix', sub: 'modality × execution form', icon: 'i-token', bg: 'var(--sec-green-fill)', c: 'var(--sec-green-ink)' },
      { v: U.int(S.models), l: 'models evaluated', sub: U.int(S.apiModels) + ' API + ' + U.int(S.localModels) + ' local', icon: 'i-server', bg: 'var(--sec-green-fill)', c: 'var(--sec-green-ink)' },
      { v: U.int(S.runs), l: 'model–task runs', sub: 'in one shared OpenClaw runtime', icon: 'i-loop', bg: 'var(--sec-orange-fill)', c: 'var(--sec-orange-ink)' },
      { v: U.int(S.unsupportedRemoved), l: 'unsupported positive scores removed', sub: 'by the evidence-based audit', icon: 'i-eye', bg: 'var(--sec-purple-fill)', c: 'var(--sec-purple-ink)', burst: 'BUSTED!' }
    ];
    var box = U.$('#stat-tiles');
    tiles.forEach(function (t) {
      var ic = h('span', { class: 'stat__icon', style: { background: t.bg, color: t.c } }, U.icon(t.icon));
      var li = h('li', { class: 'stat' + (t.burst ? ' stat--burst' : '') }, ic, h('span', { class: 'stat__value', text: t.v }), h('span', { class: 'stat__label', text: t.l }), h('span', { class: 'stat__sub', text: t.sub }));
      if (t.burst) li.appendChild(U.burst(t.burst, 'red'));
      box.appendChild(li);
    });
  }

  /* ---------------- why ---------------- */
  function why() {
    U.$('#why-lead').textContent = 'As language models become general-purpose agents, evaluation has to look beyond static answer correctness. The paper argues that a benchmark used to choose and deploy an agent model has to answer three questions:';
    var art = { interpretable: ['ic-grid', 'theme-blue'], attributable: ['ic-bowl', 'theme-green'], trustworthy: ['ic-shield', 'theme-orange'] };
    var list = U.$('#why-grid');
    M.why.forEach(function (w) {
      var a = art[w.key] || ['ic-shield', 'theme-blue'];
      var word = w.key.charAt(0).toUpperCase() + w.key.slice(1) + '?';
      list.appendChild(h('li', { class: 'why reveal ' + a[1] },
        h('div', { class: 'why__top' },
          h('span', { class: 'why__art' }, U.icon(a[0])),
          h('h3', { class: 'why__q' }, h('span', { class: 'why__word', text: word }), w.question)),
        h('p', { class: 'why__problem', text: w.problem }),
        h('p', { class: 'why__answer' }, h('strong', { text: 'DAREBench’s answer' }), w.answer)));
    });
    var tl = U.$('#tldr-list');
    [M.taglines[1], M.taglines[2], M.taglines[3]].forEach(function (t) { tl.appendChild(h('li', { text: t })); });
    U.$('#abstract-text').textContent = M.abstract;
  }

  /* ---------------- overview ---------------- */
  function overview() {
    var f2 = U.fig('fig2');
    U.$('#overview-lead').textContent = 'The pipeline turns heterogeneous source benchmarks into comparable, auditable reports: tasks are curated and classified, every model executes them in the same agent runtime, scores are computed and audited, and results are summarized per workload together with tokens and cost.';
    var img = U.$('#overview-img');
    img.src = U.IMG + f2.file; img.alt = f2.alt;
    var cap = U.$('#overview-cap');
    cap.appendChild(h('b', { text: f2.label + '. ' }));
    cap.appendChild(document.createTextNode(f2.caption));
    U.$('#overview-zoom').addEventListener('click', function () { U.lightbox(U.IMG + f2.file, f2.alt, f2.label + '. ' + f2.caption); });

    var sc = S.scoring, rt = S.runtime;
    var stages = [
      { cls: 'blue', art: 'ic-chest', title: 'Construct',
        text: U.int(S.tasks) + ' tasks are selected and adapted from ' + U.int(S.sources) + ' source benchmarks through feasibility, difficulty and representativeness filters, then organized into a ' + U.matrixLabel() + ' workload matrix by input modality and execution form.',
        chips: [U.int(S.textTasks) + ' text', U.int(S.mmTasks) + ' multimodal'] },
      { cls: 'green', art: 'cr-octopus', title: 'Execute',
        text: 'Every model runs in one shared OpenClaw environment (common agent loop, tool interface, workspace and logging) with web search, web fetch and ' + rt.clawhubSkillsInPaper + ' Clawhub skills. A task contract fixes the workspace, tools, artifact, scorer and time budget.',
        chips: ['OpenClaw ' + rt.openclaw] },
      { cls: 'orange', art: 'ic-scale', title: 'Score & audit',
        text: 'Each task is scored by automated checks, an LLM judge, or a weighted hybrid. Post-hoc rules flag suspicious positive scores, and a meta-judge from a different model family checks them against the evidence.',
        chips: [sc.auto + ' auto · ' + sc.judge + ' judge · ' + sc.hybrid + ' hybrid tasks'] },
      { cls: 'purple', art: 'ic-board', title: 'Report',
        text: 'Audited accuracy overall and per workload group, tokens per task, and reference cost from public API prices, with accuracy–cost Pareto frontiers for API models drawn separately for text and multimodal workloads.',
        chips: [U.int(S.models) + ' models', U.int(S.runs) + ' runs'] }
    ];
    var ol = U.$('#stages');
    stages.forEach(function (s) {
      var chips = h('div', { class: 'stage__chips' });
      s.chips.forEach(function (c) { chips.appendChild(h('span', { class: 'pill', text: c })); });
      ol.appendChild(h('li', { class: 'stage reveal stage--' + s.cls },
        U.icon(s.art, 'stage__art'), h('h3', { text: s.title }), h('p', { text: s.text }), chips));
    });
  }

  /* ---------------- findings ---------------- */
  function findings() {
    var meta = {
      'workload-winners': { icon: 'i-crown', cls: 'fi-blue', wide: true, jump: '#leaderboard', jl: 'Explore the leaderboard', lb: { deploy: 'all', track: 'full' } },
      'open-weight-gap': { icon: 'i-server', cls: 'fi-green', jump: '#leaderboard', jl: 'Show local models in the leaderboard', lb: { deploy: 'local', track: 'full' } },
      'pareto': { icon: 'i-frontier', cls: 'fi-orange', jump: '#cost', jl: 'See the frontiers' },
      'tokens-vs-dollars': { icon: 'i-coins', cls: 'fi-orange', jump: '#tokens-card', jl: 'Compare tokens and dollars' },
      'judge-hallucination': { icon: 'i-eye', cls: 'fi-purple', jump: '#reliability', jl: 'Inside the audit' },
      'deployment-failures': { icon: 'i-loop', cls: 'fi-purple', jump: '#pattern-grid', jl: 'Hallucination patterns' },
      'model-evolution': { icon: 'i-sprout', cls: 'fi-green', jump: '#leaderboard', jl: 'Show local models in the leaderboard', lb: { deploy: 'local', track: 'full' } },
      'failure-taxonomy': { icon: 'i-compass', cls: 'fi-blue', jump: '#taxonomy', jl: 'Failure taxonomy' }
    };
    var order = ['workload-winners', 'open-weight-gap', 'pareto', 'tokens-vs-dollars', 'judge-hallucination', 'deployment-failures', 'model-evolution', 'failure-taxonomy'];
    var grid = U.$('#findings-grid');
    order.forEach(function (key, idx) {
      var f = finding(key);
      if (!f) return;
      var m = meta[key];
      var card = h('article', { class: 'finding reveal ' + m.cls + (m.wide ? ' finding--wide' : ''), attrs: { 'aria-labelledby': 'f-' + key } },
        h('div', { class: 'finding__top' }, h('span', { class: 'finding__icon' }, U.icon(m.icon)), h('span', { class: 'finding__sec', text: f.section })),
        h('h3', { text: f.title, attrs: { id: 'f-' + key } }));
      if (key === 'workload-winners') card.appendChild(winners());
      if (key === 'open-weight-gap') card.appendChild(gapVisual(f));
      if (key === 'tokens-vs-dollars') card.appendChild(chainVisual(f));
      if (key === 'judge-hallucination') card.appendChild(auditVisual(f));
      var body = h('p', { class: 'finding__text', attrs: { id: 'ft-' + key } }, U.emphNums(f.statement));
      card.appendChild(body);
      var more = null;
      if (f.statement.length > 230 && !m.wide) {
        more = h('button', { class: 'finding__more', attrs: { type: 'button', 'aria-expanded': 'false', 'aria-controls': 'ft-' + key } }, 'Read the full finding');
        more.addEventListener('click', function () {
          var open = card.classList.toggle('is-open');
          more.setAttribute('aria-expanded', String(open));
          more.textContent = open ? 'Show less' : 'Read the full finding';
        });
        card.classList.add('is-clampable');
      }
      var a = h('a', { class: 'jump', attrs: { href: m.jump } }, m.jl, U.icon('i-arrow'));
      if (m.lb) a.addEventListener('click', function () { if (U.lbSet) U.lbSet(m.lb); });
      card.appendChild(h('div', { class: 'finding__actions' }, more || null, a));
      grid.appendChild(card);
    });
  }
  function winners() {
    var box = h('div', { class: 'winners', attrs: { role: 'table', 'aria-label': 'Best model per workload group (Table 1)' } });
    var forms = [];
    U.GROUPS.forEach(function (g) { if (forms.indexOf(g.form) < 0) forms.push(g.form); });
    var formLabel = { 'single-step': 'Single-step', 'multi-step': 'Multi-step', 'multi-step+tools': 'Multi-step + tools' };
    var hr = h('div', { attrs: { role: 'row' }, style: { display: 'contents' } });
    hr.appendChild(h('span', { attrs: { role: 'columnheader' }, class: 'winners__h' }));
    forms.forEach(function (f) { hr.appendChild(h('span', { class: 'winners__h', text: formLabel[f] || f, attrs: { role: 'columnheader' } })); });
    box.appendChild(hr);
    ['text', 'multimodal'].forEach(function (mod) {
      var row = h('div', { attrs: { role: 'row' }, style: { display: 'contents' } });
      row.appendChild(h('span', { class: 'winners__r', attrs: { role: 'rowheader' } }, h('span', { class: 'lg-only', text: mod === 'text' ? 'Text' : 'Multimodal' }), h('span', { class: 'sm-only', text: mod === 'text' ? 'Text' : 'MM', attrs: { 'aria-hidden': 'true' } })));
      forms.forEach(function (f) {
        var g = U.GROUPS.filter(function (x) { return x.modality === mod && x.form === f; })[0];
        row.appendChild(h('span', { class: 'winner', style: { '--c': U.wlVar(g.key) }, attrs: { role: 'cell', title: g.longLabel } },
          h('b', { text: g.best.model }), h('span', null, h('span', { class: 'lg-only', text: g.label + ' · ' }), U.pct(g.best.acc))));
      });
      box.appendChild(row);
    });
    return box;
  }
  /* open-weight gap: the two local Overall values the paper states, plus its "~15 points" */
  function gapVisual(f) {
    var nums = f.numbers.filter(function (n) { return n.model; });
    var gap = f.numbers.filter(function (n) { return n.gapPoints != null; })[0];
    var box = h('div', { class: 'mini-bars' });
    var bars = [];
    nums.forEach(function (n) {
      var m = U.model(n.model);
      var bar = h('div', { class: 'mini-bar', attrs: { role: 'img', 'aria-label': n.model + ': Overall ' + U.pct(n.overall) + ' percent (local model, stated in ' + f.section + ')' } },
        h('span', { class: 'mini-bar__n', text: n.model, attrs: { 'aria-hidden': 'true' } }),
        h('span', { class: 'mini-bar__t', attrs: { 'aria-hidden': 'true' } }, h('span', { class: 'mini-bar__f', style: { width: n.overall + '%', background: 'var(--series-local)' } })),
        h('span', { class: 'mini-bar__v', text: U.pct(n.overall), attrs: { 'aria-hidden': 'true' } }));
      U.hoverTip(bar, function () {
        return { title: n.model, rows: [{ label: 'Overall accuracy', value: U.pct(n.overall) + '%', color: U.css('--series-local') }],
          note: (m ? m.vendor + ' · ' : '') + 'Local · stated in the paper (' + f.section + ')' };
      });
      bars.push(bar);
      box.appendChild(bar);
    });
    U.roving(bars);
    var wrap = h('div', { class: 'mini-wrap' }, box);
    if (gap) wrap.appendChild(h('p', { class: 'scribble scribble--tilt', text: '~' + gap.gapPoints + ' pt gap to frontier commercial models' }));
    return wrap;
  }
  /* tokens vs dollars: MiMo-V2.5 vs Claude-Opus-4.6 overall (numbers stated in §4.2) */
  function chainVisual(f) {
    var a = f.numbers.filter(function (n) { return n.overallTokensK != null; });
    if (a.length < 2) return h('span');
    var ratio = a[1].ratioApprox;
    function chip(n) {
      return h('div', { class: 'vs-chip' }, h('b', { text: n.model }), h('span', { class: 'vs-chip__big', text: n.overallTokensK + 'k tokens' }), h('span', { text: '$' + n.overallCost.toFixed(3) + ' per task (Overall)' }));
    }
    return h('div', { class: 'vs' }, chip(a[0]), h('span', { class: 'vs__mid' }, h('span', { class: 'scribble', text: '~' + ratio + '× the cost' }), U.icon('i-arrow')), chip(a[1]));
  }

  /* judge hallucination: the audit counts and the MAE change, as stated in §4.3 / Appendix C */
  function auditVisual(f) {
    var n = f.numbers;
    var steps = [[U.int(n.judgeCalls), 'judge calls'], [U.int(n.flagged), 'flagged'], [U.int(n.confirmed), 'removed']];
    var row = h('div', { class: 'mini-funnel', attrs: { role: 'img', 'aria-label': steps.map(function (x) { return x[0] + ' ' + x[1]; }).join(', then ') } });
    steps.forEach(function (x, i) {
      if (i) row.appendChild(U.icon('i-arrow', 'mini-funnel__arr'));
      row.appendChild(h('span', { class: 'mini-funnel__s' + (i === steps.length - 1 ? ' is-final' : '') }, h('b', { text: x[0] }), h('span', { text: x[1] })));
    });
    return h('div', { class: 'mini-wrap' }, row,
      h('p', { class: 'mini-mae' }, 'MAE vs. human experts: ', h('b', { text: n.maeJudge.toFixed(3) }), ' → ', h('b', { text: n.maeMeta.toFixed(3) }), h('span', { class: 'scribble scribble--sm', text: ' about half' })));
  }

  /* ---------------- case study (Fig. 3) ---------------- */
  /* §4.4 of the paper, quoted verbatim (sentences 2–5). */
  var PAPER_4_4 = 'The task requires filtering foods by two visual constraints before retrieving their glycemic-index values. Qwen3.5-9B misreads the chart and retains Avocado despite the CO2 threshold; this early error changes the candidate set and leads to the wrong answer. It also relies on unverified sources. In contrast, Claude Opus 4.8 applies both constraints and checks retrieved values against authoritative sources.';
  function caseStudy() {
    var f = U.fig('fig3');
    var box = U.$('#case-study');
    var parts = f.caption.split(/\.\s+(?=Example Task:)/);
    var title = parts[0];
    var task = (parts[1] || '').replace(/^Example Task:\s*/, '');
    var t = D.tasks.filter(function (x) { return x.id === f.taskId; })[0];
    var g = t ? U.group(t.group) : null;
    box.appendChild(h('div', { class: 'case__fig' }, U.zoomable(U.IMG + f.file, f.alt, f.label + '. ' + f.caption, f.label)));
    var chips = h('p', { class: 'case__chips' });
    if (t) {
      chips.appendChild(h('span', { class: 'pill', text: U.source(t.source).name }));
      chips.appendChild(h('span', { class: 'pill' }, h('span', { class: 'dot', style: { background: U.wlVar(g.key) } }), g.label));
    }
    box.appendChild(h('figcaption', null,
      h('p', { class: 'case__label', text: 'Case study · ' + f.label + ' (' + f.section + ')' }),
      h('h3', { text: title }),
      h('div', { class: 'case__task' }, h('span', { class: 'case__tag', text: 'Example task' }), h('p', { text: task })),
      h('blockquote', { class: 'case__quote' }, h('p', { text: PAPER_4_4 }), h('footer', { text: 'Paper, ' + f.section })),
      chips));
  }

  /* ---------------- cite + footer ---------------- */
  function cite() {
    U.$('#bibtex').textContent = M.bibtex;
    var links = h('div', { class: 'cite__links' },
      h('span', { class: 'btn-pair' },
        h('a', { class: 'btn btn--sm btn--navy', attrs: { href: M.arxivUrl, rel: 'noopener' } }, U.icon('i-paper'), 'arXiv ' + M.arxivId),
        h('a', { class: 'btn btn--sm btn--ghost', attrs: { href: M.pdfUrl, rel: 'noopener' } }, U.icon('i-pdf'), 'PDF')),
      h('span', { class: 'btn-pair' },
        h('a', { class: 'btn btn--sm btn--ghost', attrs: { href: M.github, rel: 'noopener' } }, U.icon('i-github'), 'Code'),
        M.hfDataset ? h('a', { class: 'btn btn--sm btn--ghost', attrs: { href: M.hfDataset, rel: 'noopener', title: 'DAREBench on Hugging Face' } }, U.icon('i-data'), 'HF Dataset') : null));
    U.$('.cite__body').appendChild(links);
    U.$$('[data-copy-target]').forEach(function (b) {
      b.addEventListener('click', function () { U.copy(document.getElementById(b.getAttribute('data-copy-target')).textContent, b); });
    });
    var fa = U.$('#footer-affils');
    M.affiliations.forEach(function (a) { fa.appendChild(h('li', { text: a.name, attrs: { value: String(a.id) } })); });
    U.$('#footer-ack').textContent = 'DAREBench runs every model in the OpenClaw agent runtime (version ' + S.runtime.openclaw + ' in the paper). Its ' + U.int(S.tasks) + ' tasks are selected and adapted from ' + U.int(S.sources) + ' public source benchmarks, and we gratefully acknowledge their authors:';
    var fs = U.$('#footer-srcs');
    fs.textContent = '';
    D.sources.forEach(function (s, i) {
      fs.appendChild(h('span', { class: 'src-i', text: s.name + (i < D.sources.length - 1 ? ' ·' : '') }));
      if (i < D.sources.length - 1) fs.appendChild(document.createTextNode(' '));
    });
    U.$('#footer-base').textContent = 'All numbers on this page follow the arXiv paper (' + M.arxivId + M.arxivVersion + '). Illustrations are original; figures are reproduced from the paper.';
  }

  U.initContent = function () { hero(); why(); overview(); findings(); caseStudy(); cite(); };
})();
