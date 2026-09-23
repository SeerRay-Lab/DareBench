/* Quick start (README, verbatim) and the annotated task-file anatomy. */
(function () {
  'use strict';
  var U = window.U, D = U.D, h = U.h, Q = D.quickstart, A = D.taskAnatomy;

  function codeBlock(code, lang, label) {
    var pre = h('pre', { attrs: { tabindex: '0', 'aria-label': (lang || 'code') + ' snippet' } });
    code.split('\n').forEach(function (line, i, arr) {
      var span;
      if (/^\s*#/.test(line) && lang !== 'python') span = h('span', { class: 'c-com', text: line });
      else {
        span = h('span');
        var m = line.match(/^(\s*)(\S+)(.*)$/);
        if (m && lang === 'bash') { span.appendChild(document.createTextNode(m[1])); span.appendChild(h('span', { class: 'c-cmd', text: m[2] })); span.appendChild(document.createTextNode(m[3])); }
        else span.textContent = line;
      }
      pre.appendChild(span);
      if (i < arr.length - 1) pre.appendChild(document.createTextNode('\n'));
    });
    if (label) pre.setAttribute('aria-label', label);
    return h('div', { class: 'codeblock' }, U.copyButton(function () { return code; }, 'Copy: ' + (label || 'code')), pre);
  }

  function steps() {
    var ol = U.$('#qs-steps');
    /* 1. OpenClaw + skills (README) */
    ol.appendChild(h('li', { class: 'step' }, h('h3', { text: Q.step1.title }), codeBlock(Q.step1.code, Q.step1.lang, 'install commands for OpenClaw and Clawhub skills')));
    /* 2. clone */
    ol.appendChild(h('li', { class: 'step' }, h('h3', { text: Q.clone.title }), codeBlock(Q.clone.code, Q.clone.lang, 'clone commands')));
    /* 3. judge */
    ol.appendChild(h('li', { class: 'step' }, h('h3', { text: Q.judge.title }), h('p', null, U.mdCode(Q.judge.text)), codeBlock(Q.judge.code, Q.judge.lang, 'judge model setting'),
      h('p', { class: 'note', style: { 'margin-top': '10px', 'margin-bottom': '0' }, text: 'In the paper, the primary judge is ' + D.audit.primaryJudge + ' and the meta-judge is ' + D.audit.metaJudge + '.' })));
    /* 4. run */
    var runBox = h('div');
    var seg = h('div', { class: 'seg run-tabs', attrs: { role: 'radiogroup', 'aria-label': 'Run mode' } });
    function draw(i) {
      runBox.textContent = '';
      var r = Q.run[i];
      runBox.appendChild(h('p', { class: 'run-title', text: r.title }));
      runBox.appendChild(codeBlock(r.code, 'bash', r.mode + ' run command'));
      runBox.appendChild(h('p', { class: 'note', style: { 'margin-top': '10px', 'margin-bottom': '0' } }, U.mdCode(r.note)));
    }
    U.seg(seg, Q.run.map(function (r, i) { return { value: i, label: r.mode.charAt(0).toUpperCase() + r.mode.slice(1), title: r.title }; }), 0, draw);
    draw(0);
    ol.appendChild(h('li', { class: 'step' }, h('h3', { text: 'Run the benchmark' }), seg, runBox));

    /* what every model gets in the paper (§4.1, §A.2) */
    U.$('#qs-tools-lead').textContent = 'In the paper, all models share the same tools with identical visibility and permissions (§4.1, §A.2).';
    var tools = U.$('#qs-tools');
    var base = h('ul', { class: 'tool-base' },
      h('li', null, U.icon('i-code'), h('span', null, h('b', { text: 'Default OpenClaw tool suite' }), ' — file I/O, shell execution, agent-loop control')),
      h('li', null, U.icon('i-search'), h('span', null, h('code', { text: 'web_search' }), ' (Brave Search)')),
      h('li', null, U.icon('i-globe'), h('span', null, h('code', { text: 'web_fetch' }), ' (URL-to-markdown)')));
    tools.appendChild(base);
    var groups = [];
    Q.paperSkills.forEach(function (sk) { if (groups.indexOf(sk.group) < 0) groups.push(sk.group); });
    tools.appendChild(h('p', { class: 'tool-h', text: Q.paperSkills.length + ' Clawhub skills integrated in the paper’s runs' }));
    groups.forEach(function (gname) {
      var dl = h('div', { class: 'tool-group' }, h('p', { class: 'tool-group__h', text: gname }));
      var ul2 = h('ul', { class: 'tool-skills' });
      Q.paperSkills.filter(function (sk) { return sk.group === gname; }).forEach(function (sk) {
        var li = h('li', { class: 'tool-skill', attrs: { tabindex: '0' } }, h('code', { text: sk.name }));
        U.hoverTip(li, function () { return { title: sk.name, rows: [], note: sk.description }; });
        li.setAttribute('aria-label', sk.name + ': ' + sk.description);
        ul2.appendChild(li);
      });
      dl.appendChild(ul2);
      tools.appendChild(dl);
    });

    /* requirements */
    var req = U.$('#qs-reqs');
    Q.requirements.forEach(function (r) {
      var li = h('li');
      var m = r.match(/^(.*)\((https?:\/\/[^)]+)\)(.*)$/);
      if (m) { li.appendChild(U.mdCode(m[1])); li.appendChild(h('a', { text: m[2].replace(/^https?:\/\//, ''), attrs: { href: m[2], rel: 'noopener' } })); li.appendChild(U.mdCode(m[3])); }
      else li.appendChild(U.mdCode(r));
      req.appendChild(li);
    });
    /* flags */
    var dl = U.$('#qs-flags');
    Q.flags.forEach(function (f) {
      var dd = h('dd', null, U.mdCode(f.description));
      U.$$('code', dd).forEach(function (c) {
        var parts = c.textContent.split('/');
        if (parts.length < 2) { c.classList.add('nowrap'); return; }
        c.textContent = '';
        parts.forEach(function (p, i) {
          c.appendChild(h('span', { class: 'seg-n', text: p + (i < parts.length - 1 ? '/' : '') }));
          if (i < parts.length - 1) c.appendChild(document.createElement('wbr'));
        });
      });
      dl.appendChild(h('div', null, h('dt', null, U.mdCode(f.flagMarkdown)), dd));
    });
  }

  /* ---------------- anatomy ---------------- */
  function symNode(sym) {
    var f = document.createDocumentFragment();
    if (sym === 'W0') { f.appendChild(h('span', { class: 'math', text: 'W' })); f.appendChild(h('sup', { text: '0' })); }
    else if (sym === 't_max') { f.appendChild(h('span', { class: 'math', text: 't' })); f.appendChild(h('sup', { text: 'max' })); }
    else f.appendChild(h('span', { class: 'math', text: sym }));
    return f;
  }
  var lineEls = [], tupleBtns = {}, pinned = 'p';

  function anatomy() {
    U.$('#anat-sub').textContent = 'A task file from the repository (' + A.file + '), mapped to the paper’s task tuple. Select a component to highlight where it lives.';
    var cap = U.$('#anat-cap');
    if (cap) cap.textContent = A.note;
    U.$('#anat-file').textContent = A.file;
    /* equation */
    var eq = U.$('#anat-eq');
    eq.appendChild(h('span', { class: 'math', text: 'τ' }));
    eq.appendChild(document.createTextNode(' = ('));
    A.tuple.forEach(function (t, i) {
      eq.appendChild(symNode(t.symbol));
      if (i < A.tuple.length - 1) eq.appendChild(document.createTextNode(', '));
    });
    eq.appendChild(document.createTextNode(')'));

    /* build lines */
    var L = [];
    function add(text, cls, syms) { L.push({ text: text, cls: cls || '', syms: syms || [] }); }
    add('---', 'fm');
    A.frontmatter.split('\n').forEach(function (ln) {
      var syms = [];
      if (/^(environment:|\s+type:|\s+requirements:|workspace_files:)/.test(ln)) syms.push('W0');
      if (/^(grading_type:|grading_weights:|\s+automated:|\s+llm_judge:)/.test(ln)) syms.push('G');
      if (/^timeout_seconds:/.test(ln)) syms.push('t_max');
      add(ln, 'fm', syms);
    });
    add('---', 'fm');
    add('');
    add('## Prompt', 'h2', ['p']);
    A.prompt.split('\n').forEach(function (ln) {
      var syms = ['p'];
      if (/answer\.txt/.test(ln)) syms.push('C');
      if (/tools or skills/.test(ln)) syms.push('T');
      if (/complete the task in/.test(ln)) syms.push('t_max');
      add(ln, '', syms);
    });
    add('');
    add('## Expected Behavior', 'h2');
    A.expectedBehavior.split('\n').forEach(function (ln) { add(ln); });
    add('');
    add('## Grading Criteria', 'h2', ['G']);
    A.gradingCriteria.split('\n').forEach(function (ln) { add(ln, /^\[withheld/.test(ln) ? 'withheld' : '', /answer_written/.test(ln) ? ['G', 'C'] : ['G']); });
    add('');
    add('## Automated Checks', 'h2', ['G', 'C']);
    add('```python', '', ['G']);
    A.automatedChecks.split('\n').forEach(function (ln) { add(ln, '', /answer_file|answer_written|answer\.txt/.test(ln) ? ['G', 'C'] : ['G']); });
    add('```', '', ['G']);
    add('');
    add('## LLM Judge Rubric', 'h2', ['G']);
    A.rubric.split('\n').forEach(function (ln) { add(ln, /^\[withheld/.test(ln) ? 'withheld' : /\[REDACTED\]/.test(ln) ? 'redact' : '', ['G']); });

    var pre = U.$('#anat-code');
    L.forEach(function (l) {
      var el = h('span', { class: 'ln ' + l.cls, text: l.text === '' ? '​' : l.text });
      el._syms = l.syms;
      lineEls.push(el);
      pre.appendChild(el);
    });

    /* tuple list */
    var list = U.$('#anat-tuple');
    A.tuple.forEach(function (t) {
      var b = h('button', { class: 'sym-' + t.symbol, attrs: { type: 'button', 'aria-pressed': String(t.symbol === pinned), 'aria-controls': 'anat-code', 'aria-label': t.name + ' (' + t.symbol.replace('_', ' ') + '): highlight its lines in the task file. ' + t.value } },
        h('span', { class: 'tuple__sym' }, h('span', null, symNode(t.symbol))),
        h('span', { class: 'tuple__name', text: t.name }),
        h('span', { class: 'tuple__where', text: t.where }),
        h('span', { class: 'tuple__val', text: t.value }));
      b.addEventListener('click', function () { pinned = t.symbol; sync(); highlight(t.symbol, true); });
      b.addEventListener('pointerenter', function () { highlight(t.symbol, false); });
      b.addEventListener('pointerleave', function () { highlight(pinned, false); });
      b.addEventListener('focus', function () { highlight(t.symbol, true); });
      tupleBtns[t.symbol] = b;
      list.appendChild(h('li', null, b));
    });
    list.parentNode.insertBefore(h('p', { class: 'tuple-val', attrs: { id: 'anat-val', 'aria-live': 'polite' } }), list.nextSibling);
    sync();
    highlight(pinned, false);
  }
  function sync() {
    Object.keys(tupleBtns).forEach(function (k) { tupleBtns[k].setAttribute('aria-pressed', String(k === pinned)); });
    var t = A.tuple.filter(function (x) { return x.symbol === pinned; })[0], cap = U.$('#anat-val');
    if (t && cap) { cap.textContent = ''; cap.appendChild(h('b', { text: t.name + ' · ' })); cap.appendChild(h('span', { class: 'tuple-val__where', text: t.where + ' — ' })); cap.appendChild(document.createTextNode(t.value)); }
  }
  function highlight(sym, scroll) {
    var pre = U.$('#anat-code'), first = null;
    pre.className = 'codefile__body sym-' + sym;
    lineEls.forEach(function (el) {
      var on = el._syms.indexOf(sym) >= 0;
      el.classList.toggle('is-hl', on);
      if (on && !first) first = el;
    });
    if (scroll && first) pre.scrollTo({ top: Math.max(0, first.offsetTop - 24), behavior: U.reduceMotion ? 'auto' : 'smooth' });
  }

  U.initQuickstart = function () {
    steps(); anatomy();
    var fl = U.$('#qs-flags-box');
    if (fl && window.matchMedia && window.matchMedia('(max-width: 720px)').matches) fl.removeAttribute('open');
  };
})();
