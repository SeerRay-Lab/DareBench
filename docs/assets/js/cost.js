/* Accuracy–cost scatter (the paper's Fig. 1: plotted models and frontiers exactly as drawn)
   and the tokens-vs-dollars small multiples (Table 2). */
(function () {
  'use strict';
  var U = window.U, D = U.D, h = U.h, s = U.s;
  var mode = 'text';
  var tokSort = 'tokens';

  function field() { return mode === 'text' ? 'textAvg' : 'mmAvg'; }
  function acc(m) { return mode === 'text' ? m.textAvg : m.mmAvg; }
  function cost(m) { return m.cost[field()]; }
  function costTxt(m) { return m.costText[field()]; }
  function tok(m) { return m.tokens[field()]; }
  function modeColor() { return mode === 'text' ? U.css('--series-text') : U.css('--series-mm'); }
  function modeLabel() { return mode === 'text' ? 'Text' : 'Multimodal'; }
  function plotted() { return D.pareto.fig1Models[mode].map(U.model); }
  function frontier() { return D.pareto[mode].map(U.model); }
  function isFront(m) { return D.pareto[mode].indexOf(m.name) >= 0; }
  function apiModels() { return D.models.filter(function (m) { return m.deployment === 'api' && cost(m) != null && tok(m) != null; }); }
  function finding(k) { return D.findings.filter(function (x) { return x.key === k; })[0]; }
  /* models the paper names in its §4.2 prose: always labelled when plotted */
  function namedInProse(m) {
    var txt = [finding('pareto').statement, finding('tokens-vs-dollars').statement].join(' ');
    var re = new RegExp(m.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![\\w.-]*\\w)');
    return re.test(txt);
  }

  function tipSpec(m) {
    return { title: m.name, rows: [
      { label: modeLabel() + ' accuracy', value: U.pct(acc(m)) + '%', color: isFront(m) ? U.css('--pareto-hi') : U.css('--pareto-muted') },
      { label: 'Cost per task', value: U.usd(costTxt(m)) },
      { label: 'Tokens per task', value: U.tok(tok(m)) }
    ], note: m.vendor + (isFront(m) ? ' · on the Pareto frontier drawn in Fig. 1' : '') };
  }

  /* ---------------- scatter ---------------- */
  function drawScatter() {
    var box = U.$('#scatter-box');
    var W = Math.max(280, Math.round(box.clientWidth));
    var narrow = W < 560;
    var H = W >= 900 ? 500 : narrow ? 540 : 460;
    var m = { l: narrow ? 42 : 54, r: 10, t: 14, b: 54 };
    var pw = W - m.l - m.r, ph = H - m.t - m.b;
    var pts = plotted();
    var costs = pts.map(cost), accs = pts.map(acc);
    var lo = Math.log10(Math.min.apply(null, costs) / 1.7), hi = Math.log10(Math.max.apply(null, costs) * (narrow ? 1.7 : 3.2));
    var ylo = Math.floor((Math.min.apply(null, accs) - 2) / 5) * 5, yhi = Math.ceil((Math.max.apply(null, accs) + 2) / 5) * 5;
    function X(c) { return m.l + (Math.log10(c) - lo) / (hi - lo) * pw; }
    function Y(a) { return m.t + (1 - (a - ylo) / (yhi - ylo)) * ph; }

    box.textContent = '';
    var svg = s('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'group', 'aria-label': modeLabel() + ' accuracy versus cost per task for ' + pts.length + ' API models. One Tab stop: use the arrow keys to move between models in order of cost.' }, box);
    var g = s('g', { class: 'axis', 'aria-hidden': 'true' }, svg);
    U.ticks(ylo, yhi, 5).forEach(function (v) {
      s('line', { class: 'grid-line', x1: m.l, x2: W - m.r, y1: Y(v), y2: Y(v) }, g);
      var t = s('text', { x: m.l - 8, y: Y(v) + 4, 'text-anchor': 'end' }, g); t.textContent = String(v);
    });
    var xt = [];
    for (var e = Math.floor(lo); e <= Math.ceil(hi); e++) [1, 2, 5].forEach(function (k) { var v = k * Math.pow(10, e); if (Math.log10(v) >= lo && Math.log10(v) <= hi) xt.push({ v: v, k: k, x: X(v) }); });
    xt.forEach(function (o) { s('line', { class: 'grid-line', x1: o.x, x2: o.x, y1: m.t, y2: m.t + ph }, g); });
    /* tick labels: 1s first, then 5s and 2s only where they do not collide */
    U.fitTicks(xt, U.usdTick, 0, W, '400 12.5px Nunito', 10).forEach(function (o) {
      var t = s('text', { x: o.x, y: m.t + ph + 18, 'text-anchor': 'middle' }, g); t.textContent = U.usdTick(o.v);
    });
    s('line', { class: 'axis-line', x1: m.l, x2: W - m.r, y1: m.t + ph, y2: m.t + ph }, g);
    var xtitle = s('text', { class: 'axis-title', x: m.l + pw / 2, y: H - 10, 'text-anchor': 'middle' }, g); xtitle.textContent = 'Cost per task (USD, log scale)';
    var ytitle = s('text', { class: 'axis-title', transform: 'translate(' + 13 + ' ' + (m.t + ph / 2) + ') rotate(-90)', 'text-anchor': 'middle' }, g); ytitle.textContent = modeLabel() + ' accuracy (%)';

    /* frontier: dashed, as in the paper's Fig. 1 */
    var fr = frontier().slice().sort(function (a, b) { return cost(a) - cost(b); });
    s('path', { class: 'frontier', 'aria-hidden': 'true', d: fr.map(function (p, i) { return (i ? 'L' : 'M') + X(cost(p)).toFixed(1) + ' ' + Y(acc(p)).toFixed(1); }).join(' '),
      fill: 'none', stroke: U.css('--pareto-hi'), 'stroke-width': 2.2, 'stroke-dasharray': '7 5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);

    var nodes = pts.map(function (p) {
      var front = isFront(p);
      return { m: p, x: X(cost(p)), y: Y(acc(p)), r: front ? 6.5 : 5.5, front: front, must: namedInProse(p) };
    });
    var leadLayer = s('g', { class: 'leaders', 'aria-hidden': 'true' }, svg);
    var ptLayer = s('g', { 'aria-hidden': 'true' }, svg);
    nodes.slice().sort(function (a, b) { return (a.front ? 1 : 0) - (b.front ? 1 : 0); }).forEach(function (n) {
      n.dot = s('circle', { class: 'pt', cx: n.x, cy: n.y, r: n.r, fill: n.front ? U.css('--pareto-hi') : U.css('--pareto-muted'), stroke: '#fff', 'stroke-width': 2 }, ptLayer);
    });

    /* ---- label placement: every model where it fits; leader lines when the near slots are taken.
       Greedy by priority (frontier, then models the paper names, then the rest; crowded points first),
       with an ambiguity check, and up to three retries that promote any unlabelled priority point. ---- */
    var labLayer = s('g', { 'aria-hidden': 'true' }, svg);
    var baseObs = nodes.map(function (n) { return { x1: n.x - n.r - 2, y1: n.y - n.r - 2, x2: n.x + n.r + 2, y2: n.y + n.r + 2, owner: n }; });
    for (var fi = 1; fi < fr.length; fi++) {
      var ax = X(cost(fr[fi - 1])), ay = Y(acc(fr[fi - 1])), bx = X(cost(fr[fi])), by = Y(acc(fr[fi]));
      var steps = Math.max(2, Math.round(Math.hypot(bx - ax, by - ay) / 8));
      for (var si = 1; si < steps; si++) { var px = ax + (bx - ax) * si / steps, py = ay + (by - ay) * si / steps; baseObs.push({ x1: px - 3, y1: py - 3, x2: px + 3, y2: py + 3 }); }
    }
    var bounds = { x1: m.l + 2, y1: 2, x2: W - 2, y2: m.t + ph - 3 };
    var fs = narrow ? 10.5 : 12;
    function rectDist(b, x, y) { var dx = Math.max(b.x1 - x, 0, x - b.x2), dy = Math.max(b.y1 - y, 0, y - b.y2); return Math.hypot(dx, dy); }

    function layout(order) {
      var obstacles = baseObs.slice(), out = [];
      function hit(b, self) {
        if (b.x1 < bounds.x1 || b.x2 > bounds.x2 || b.y1 < bounds.y1 || b.y2 > bounds.y2) return true;
        /* never on top of its own dot either (its padded obstacle is skipped, its bounding box is not) */
        if (self && b.x1 + 2 < self.x + self.r && b.x2 - 2 > self.x - self.r && b.y1 + 1 < self.y + self.r && b.y2 - 1 > self.y - self.r) return true;
        for (var i = 0; i < obstacles.length; i++) {
          var o = obstacles[i];
          if (o.owner && o.owner === self) continue;
          if (b.x1 < o.x2 && b.x2 > o.x1 && b.y1 < o.y2 && b.y2 > o.y1) return true;
        }
        return false;
      }
      function ambiguous(b, self, led) {
        var own = rectDist(b, self.x, self.y);
        var bx = (b.x1 + b.x2) / 2, by = (b.y1 + b.y2) / 2, ownC = Math.hypot(bx - self.x, by - self.y);
        for (var i = 0; i < nodes.length; i++) {
          var o = nodes[i];
          if (o === self) continue;
          var d = rectDist(b, o.x, o.y);
          if (d < own + 3) return true;
          /* centre penalty (labels next to their dot; a leader line already shows ownership): a label that
             runs over or right next to another dot and whose centre is nearer that dot than its own reads as
             the other model's label (e.g. Claude-Opus-4.8 over the Claude-Opus-4.6 dot) */
          if (!led && d < 22 && Math.hypot(bx - o.x, by - o.y) < ownC) return true;
        }
        return false;
      }
      function segClear(x0, y0, x1, y1, self) {
        var len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.ceil(len / 3));
        for (var i = 1; i < n; i++) {
          var px = x0 + (x1 - x0) * i / n, py = y0 + (y1 - y0) * i / n;
          if (hit({ x1: px - 1, y1: py - 1, x2: px + 1, y2: py + 1 }, self)) return false;
        }
        return true;
      }
      function keep(n, c, b, text, bold, lead) {
        obstacles.push(b);
        if (lead) {
          var len = Math.hypot(lead[2] - lead[0], lead[3] - lead[1]), k = Math.max(2, Math.ceil(len / 4));
          for (var i = 1; i < k; i++) { var px = lead[0] + (lead[2] - lead[0]) * i / k, py = lead[1] + (lead[3] - lead[1]) * i / k; obstacles.push({ x1: px - 1.5, y1: py - 1.5, x2: px + 1.5, y2: py + 1.5 }); }
        }
        out.push({ n: n, c: c, b: b, text: text, bold: bold, lead: lead });
        return true;
      }
      function place(n) {
        var bold = n.front;
        var text = n.m.shortName + (n.front && !narrow ? ' [' + U.tok(tok(n.m)) + ']' : '');
        var font = (bold ? '800 ' : '700 ') + (bold ? fs + 0.5 : fs) + 'px Nunito';
        var w = Math.ceil(U.textWidth(text, font)), hh = fs + 3, r = n.r;
        var near = [
          [n.x + r + 4, n.y + 4, 'start'], [n.x - r - 4, n.y + 4, 'end'],
          [n.x, n.y - r - 5, 'middle'], [n.x, n.y + r + hh, 'middle'],
          [n.x + r + 1, n.y - r - 2, 'start'], [n.x - r - 1, n.y - r - 2, 'end'],
          [n.x + r + 1, n.y + r + hh - 2, 'start'], [n.x - r - 1, n.y + r + hh - 2, 'end']
        ];
        if (n.front) near = [near[2], near[4], near[5], near[0], near[1], near[3], near[6], near[7]];
        /* near the plot edges: a label centred above/below its dot may slide sideways to stay inside,
           as long as it still spans its own dot */
        [[n.x, n.y - r - 5], [n.x, n.y + r + hh]].forEach(function (p) {
          if (p[0] - w / 2 - 2 < bounds.x1 && bounds.x1 + 2 + w - 6 > n.x) near.push([bounds.x1 + 2, p[1], 'start']);
          if (p[0] + w / 2 + 2 > bounds.x2 && bounds.x2 - 2 - w + 6 < n.x) near.push([bounds.x2 - 2, p[1], 'end']);
        });
        function boxFor(c) {
          var x1 = c[2] === 'start' ? c[0] : c[2] === 'end' ? c[0] - w : c[0] - w / 2;
          var fsz = bold ? fs + 0.5 : fs;
          return { x1: x1 - 2, y1: c[1] - fsz * 1.02 - 1, x2: x1 + w + 2, y2: c[1] + fsz * 0.37 + 1 };
        }
        for (var i = 0; i < near.length; i++) {
          var b = boxFor(near[i]);
          if (!hit(b, n) && !ambiguous(b, n)) return keep(n, near[i], b, text, bold, null);
        }
        var angles = [0, 180, -30, -150, 30, 150, -60, -120, 60, 120, -90, 90, -15, -165, 15, 165];
        /* short leaders only (a long leader across the cloud reads as someone else's label) */
        var dists = narrow ? [16, 22, 28, 36, 46, 58] : [22, 30, 40, 52, 66];
        for (var di = 0; di < dists.length; di++) {
          for (var ai = 0; ai < angles.length; ai++) {
            var a = angles[ai] * Math.PI / 180, cx = Math.cos(a), cy = Math.sin(a);
            var lx = n.x + cx * dists[di], ly = n.y + cy * dists[di];
            var anchor = cx > 0.3 ? 'start' : cx < -0.3 ? 'end' : 'middle';
            var c = [lx, ly + (cy < -0.3 ? -2 : cy > 0.3 ? hh - 2 : 4), anchor];
            var bb = boxFor(c);
            var ex = Math.max(bb.x1, Math.min(n.x, bb.x2)), ey = Math.max(bb.y1, Math.min(n.y, bb.y2));
            var sx = n.x + cx * (r + 2), sy = n.y + cy * (r + 2);
            /* the label must still sit closer to its own dot than to any other dot */
            if (!hit(bb, n) && !ambiguous(bb, n, true) && segClear(sx, sy, ex, ey, n)) return keep(n, c, bb, text, bold, [sx, sy, ex, ey]);
          }
        }
        return false;
      }
      order.forEach(place);
      return out;
    }

    nodes.forEach(function (n) { n.crowd = nodes.filter(function (o) { return o !== n && Math.hypot(o.x - n.x, o.y - n.y) < 70; }).length; });
    function byCrowd(a, b) { return b.crowd - a.crowd || acc(b.m) - acc(a.m); }
    /* phones: label only the frontier and the models the paper names; the rest are in the tooltip and table */
    var tiers = [nodes.filter(function (n) { return n.front; }),
      nodes.filter(function (n) { return !n.front && n.must; }).sort(byCrowd),
      narrow ? [] : nodes.filter(function (n) { return !n.front && !n.must; }).sort(byCrowd)];
    var result = layout([].concat(tiers[0], tiers[1], tiers[2]));
    for (var attempt = 0; attempt < 3; attempt++) {
      var got = result.map(function (x) { return x.n; });
      var missingPri = tiers[0].concat(tiers[1]).filter(function (n) { return got.indexOf(n) < 0; });
      if (!missingPri.length) break;
      tiers.forEach(function (t, ti) { tiers[ti] = missingPri.filter(function (n) { return t.indexOf(n) >= 0; }).concat(t.filter(function (n) { return missingPri.indexOf(n) < 0; })); });
      var next = layout([].concat(tiers[0], tiers[1], tiers[2]));
      var nextMissing = tiers[0].concat(tiers[1]).filter(function (n) { return next.map(function (x) { return x.n; }).indexOf(n) < 0; }).length;
      if (nextMissing < missingPri.length || (nextMissing === missingPri.length && next.length > result.length)) result = next;
    }
    result.forEach(function (L) {
      if (L.lead) s('line', { class: 'leader', x1: L.lead[0].toFixed(1), y1: L.lead[1].toFixed(1), x2: L.lead[2].toFixed(1), y2: L.lead[3].toFixed(1) }, leadLayer);
      var t = s('text', { class: 'pt-label' + (L.bold ? '' : ' pt-label--muted'), x: L.c[0].toFixed(1), y: L.c[1].toFixed(1), 'text-anchor': L.c[2], style: 'font-size:' + (L.bold ? fs + 0.5 : fs) + 'px' }, labLayer);
      var i2 = L.text.indexOf(' [');
      if (L.bold && i2 > 0) {
        t.appendChild(document.createTextNode(L.text.slice(0, i2)));
        var ts = s('tspan', { class: 'pt-label__tok' }, t); ts.textContent = L.text.slice(i2);
      } else t.textContent = L.text;
      L.n.labelled = true;
    });
    /* ---- points that did not get a name get a small number next to their dot, keyed under the chart,
       placed with the same rules (no collisions; the number sits closer to its own dot than to any other) ---- */
    var obs2 = baseObs.slice();
    result.forEach(function (L) {
      obs2.push(L.b);
      if (L.lead) { var len = Math.hypot(L.lead[2] - L.lead[0], L.lead[3] - L.lead[1]), k = Math.max(2, Math.ceil(len / 4)); for (var i = 1; i < k; i++) { var px = L.lead[0] + (L.lead[2] - L.lead[0]) * i / k, py = L.lead[1] + (L.lead[3] - L.lead[1]) * i / k; obs2.push({ x1: px - 1.5, y1: py - 1.5, x2: px + 1.5, y2: py + 1.5 }); } }
    });
    var keyed = [], nfs = 10.5;
    /* near-coincident unnamed points (< 8 px apart) share one tag such as "3/4" */
    var groups = [];
    nodes.filter(function (n) { return !n.labelled; }).sort(function (a, b) { return a.x - b.x || a.y - b.y; }).forEach(function (n) {
      var g = groups.filter(function (gr) { return gr.some(function (o) { return Math.hypot(o.x - n.x, o.y - n.y) < 8; }); })[0];
      if (g) g.push(n); else groups.push([n]);
    });
    groups.forEach(function (grp) {
      var nums = grp.map(function (n, i) { return keyed.length + i + 1; });
      var txt = nums.join('/'), w = Math.ceil(U.textWidth(txt, '800 ' + nfs + 'px Nunito'));
      var cx = grp.reduce(function (a, n) { return a + n.x; }, 0) / grp.length, cy = grp.reduce(function (a, n) { return a + n.y; }, 0) / grp.length;
      var r = Math.max.apply(null, grp.map(function (n) { return n.r + Math.hypot(n.x - cx, n.y - cy); }));
      var cand = [];
      [0, 4].forEach(function (d) {
        cand.push([cx + r + 3 + d, cy + 4, 'start'], [cx - r - 3 - d, cy + 4, 'end'], [cx, cy - r - 3 - d, 'middle'], [cx, cy + r + nfs + 1 + d, 'middle'],
          [cx + r + 2 + d, cy - r - 1 - d, 'start'], [cx - r - 2 - d, cy - r - 1 - d, 'end'], [cx + r + 2 + d, cy + r + nfs - 1 + d, 'start'], [cx - r - 2 - d, cy + r + nfs - 1 + d, 'end']);
      });
      for (var i = 0; i < cand.length; i++) {
        var c = cand[i], x1 = c[2] === 'start' ? c[0] : c[2] === 'end' ? c[0] - w : c[0] - w / 2;
        var b = { x1: x1 - 1.5, y1: c[1] - nfs * 1.08 - 1, x2: x1 + w + 1.5, y2: c[1] + nfs * 0.37 + 1 };
        if (b.x1 < bounds.x1 || b.x2 > bounds.x2 || b.y1 < bounds.y1 || b.y2 > bounds.y2) continue;
        if (grp.some(function (n) { return b.x1 < n.x + n.r && b.x2 > n.x - n.r && b.y1 < n.y + n.r && b.y2 > n.y - n.r; })) continue;
        var clash = obs2.some(function (o) { return grp.indexOf(o.owner) < 0 && b.x1 < o.x2 && b.x2 > o.x1 && b.y1 < o.y2 && b.y2 > o.y1; });
        if (clash) continue;
        var own = Math.max.apply(null, grp.map(function (n) { return rectDist(b, n.x, n.y); }));
        if (nodes.some(function (o) { return grp.indexOf(o) < 0 && rectDist(b, o.x, o.y) < own + 3; })) continue;
        obs2.push(b);
        var t = s('text', { class: 'pt-num', x: c[0].toFixed(1), y: c[1].toFixed(1), 'text-anchor': c[2], style: 'font-size:' + nfs + 'px' }, labLayer);
        t.textContent = txt;
        grp.forEach(function (n) { keyed.push(n); n.labelled = true; });
        return;
      }
    });
    if (keyed.length) {
      var key = h('p', { class: 'pt-key' }, h('span', { class: 'legend__title', text: 'Numbered points:' }));
      keyed.forEach(function (n, i) { key.appendChild(h('span', { class: 'pt-key__i' }, h('b', { text: String(i + 1) }), ' ' + n.m.shortName)); });
      box.appendChild(key);
    }
    var unl = nodes.filter(function (n) { return !n.labelled; }).length;

    /* ---- interaction: nearest-point hover + one Tab stop with arrow keys (ordered by cost) ---- */
    var hitLayer = s('g', null, svg);
    var active = null;
    function activate(n, ev) {
      if (active && active !== n) deactivate();
      active = n;
      n.dot.setAttribute('r', n.r + 2.5);
      n.dot.setAttribute('stroke', U.css('--ink'));
      n.dot.setAttribute('stroke-width', 2.5);
      if (ev) U.tip.show(tipSpec(n.m), ev.clientX, ev.clientY, svg);
    }
    function deactivate() {
      if (!active) return;
      active.dot.setAttribute('r', active.r);
      active.dot.setAttribute('stroke', '#fff');
      active.dot.setAttribute('stroke-width', 2);
      active = null;
    }
    var byCost = nodes.slice().sort(function (a, b) { return cost(a.m) - cost(b.m) || acc(a.m) - acc(b.m); });
    byCost.forEach(function (n) {
      n.hit = s('circle', { class: 'pt-hit', cx: n.x, cy: n.y, r: 13, role: 'img',
        'aria-label': n.m.name + ': ' + modeLabel().toLowerCase() + ' accuracy ' + U.pct(acc(n.m)) + ' percent, ' + U.usd(costTxt(n.m)) + ' per task, ' + U.tok(tok(n.m)) + ' tokens per task' + (n.front ? ', on the Pareto frontier drawn in Fig. 1' : '') }, hitLayer);
      n.hit.addEventListener('focus', function () { activate(n); U.tip.focus(function () { return tipSpec(n.m); }, n.hit); });
      n.hit.addEventListener('blur', function () { deactivate(); U.tip.blur(n.hit); });
    });
    U.roving(byCost.map(function (n) { return n.hit; }));
    svg.addEventListener('pointermove', function (e) {
      var r = svg.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
      var best = null, bd = 30 * 30;
      nodes.forEach(function (n) { var d = (n.x - px) * (n.x - px) + (n.y - py) * (n.y - py); if (d < bd) { bd = d; best = n; } });
      if (best) activate(best, e); else { deactivate(); U.tip.hide(svg); }
    });
    svg.addEventListener('pointerleave', function () { deactivate(); U.tip.hide(svg); });

    var capNote = D.pareto.note.replace(/^.*?\(caption\)\.\s*/, '');
    U.$('#scatter-cap').textContent = capNote + (unl ? ' ' + unl + (unl === 1 ? ' point is' : ' points are') + ' unlabeled at this width; hover, focus or use the table view.' : '');
  }

  function scatterMeta() {
    var n = plotted().length;
    U.$('#scatter-title').textContent = (mode === 'text' ? '(a) Text' : '(b) Multimodal') + ': accuracy vs. cost per task';
    U.$('#scatter-sub').textContent = 'The ' + n + ' API models plotted in the paper’s Fig. 1' + (mode === 'text' ? '(a)' : '(b)') + '. Accuracy is the Table 1 ' + (mode === 'text' ? 'Text Avg' : 'MM Avg') + '; cost is the Table 2 reference cost. On wider screens, frontier labels show tokens per task, as in the paper.';
    var lg = U.$('#scatter-legend');
    lg.textContent = '';
    lg.appendChild(h('span', { class: 'legend__item' }, h('span', { class: 'legend__line legend__line--dash' }), 'Pareto frontier (dashed, as drawn in Fig. 1)'));
    lg.appendChild(h('span', { class: 'legend__item' }, h('span', { class: 'legend__dot', style: { background: 'var(--pareto-muted)' } }), 'Other API models'));
    var rows = plotted().slice().sort(function (a, b) { return cost(a) - cost(b); });
    U.tableView(U.$('#scatter-table'), U.table([
      { label: 'Model', get: modelCell },
      { label: 'Vendor', cls: 'col-vendor', get: function (m) { return m.vendor; } },
      { label: 'Accuracy (%)', num: true, get: function (m) { return U.pct(acc(m)); } },
      { label: 'Cost / task', num: true, get: function (m) { return U.usd(costTxt(m)); } },
      { label: 'Tokens / task', num: true, get: function (m) { return U.tok(tok(m)); } },
      { label: 'Frontier (Fig. 1)', get: function (m) { return isFront(m) ? 'Yes' : ''; } }
    ], rows, modeLabel() + ': accuracy and cost of the models in Fig. 1, sorted by cost'));
  }
  /* table views: on phones the Vendor column folds into a second line of the model cell */
  function modelCell(m) { return [m.name, h('span', { class: 'cell-sub', text: m.vendor })]; }

  function notes() {
    var aside = U.$('#cost-notes');
    aside.textContent = '';
    var chain = h('ol', { class: 'chain' });
    D.pareto[mode].map(U.model).forEach(function (m) {
      chain.appendChild(h('li', null, h('b', { text: m.shortName }), h('span', { class: 'num', text: U.usd(costTxt(m)) + ' · ' + U.pct(acc(m)) + '%' })));
    });
    aside.appendChild(h('div', { class: 'note-card' },
      h('h3', null, U.icon('i-frontier'), (mode === 'text' ? 'Text' : 'Multimodal') + ' frontier, cheapest first'),
      chain));
    var f = finding('pareto');
    aside.appendChild(h('div', { class: 'note-card' }, h('h3', { text: 'What the paper observes' }), h('p', null, U.emphNums(f.statement))));
    var lt = finding('local-tokens');
    if (lt) aside.appendChild(h('div', { class: 'note-card' }, h('h3', null, U.icon('i-server'), 'And the local models? (' + lt.section + ')'), h('p', null, U.emphNums(lt.statement))));
  }

  /* ---------------- tokens vs dollars: shared rows, token bars (linear) + cost dots (log) ---------------- */
  function drawTokens() {
    var box = U.$('#tokens-box');
    var W = Math.max(260, Math.round(box.clientWidth));
    /* phones: two full-width panels (tokens, then cost) in the same row order, names above the marks,
       so each plot keeps the full card width instead of ~50 px beside a name column */
    var stacked = W < 600, wide = W >= 820, compact = W < 700;
    var list = apiModels();
    var rows = list.slice().sort(tokSort === 'tokens'
      ? function (a, b) { return tok(a) - tok(b) || cost(a) - cost(b); }
      : function (a, b) { return cost(a) - cost(b) || tok(a) - tok(b); });
    var byTok = list.slice().sort(function (a, b) { return tok(a) - tok(b); });
    var byCost = list.slice().sort(function (a, b) { return cost(a) - cost(b); });
    var tags = {};
    function tag(m, t) { (tags[m.name] = tags[m.name] || []).push(t); }
    tag(byTok[0], 'fewest tokens'); tag(byTok[byTok.length - 1], 'most tokens');
    tag(byCost[0], 'cheapest'); tag(byCost[byCost.length - 1], 'most expensive');
    var maxTok = tok(byTok[byTok.length - 1]);
    var cLo = Math.log10(cost(byCost[0]) / 1.4), cHi = Math.log10(cost(byCost[byCost.length - 1]) * 1.25);
    var color = modeColor();
    var fs = stacked ? 12 : compact ? 11.5 : 12.5;
    var tickFont = '400 12.5px Nunito';

    box.textContent = '';
    var hits = [], rowEls = {};
    function hot(m, on) { (rowEls[m.name] || []).forEach(function (g) { g.classList.toggle('is-hot', on); }); }
    function rightRound(x, y, w, h) {
      /* bar with a rounded data end (radius <= half the width, so short bars stay proportional) */
      var r = Math.min(4, w / 2, h / 2);
      return 'M' + x + ' ' + y + ' h' + (w - r) + ' a' + r + ' ' + r + ' 0 0 1 ' + r + ' ' + r + ' v' + (h - 2 * r) + ' a' + r + ' ' + r + ' 0 0 1 -' + r + ' ' + r + ' h-' + (w - r) + ' z';
    }
    function costTicks(x0, x1, CX) {
      var t = [];
      for (var e = Math.floor(cLo); e <= Math.ceil(cHi); e++) [1, 2, 5].forEach(function (k) {
        var v = k * Math.pow(10, e);
        if (Math.log10(v) >= cLo && Math.log10(v) <= cHi) t.push({ v: v, k: k, x: CX(v) });
      });
      return { all: t, labelled: U.fitTicks(t, U.usdTick, x0, x1, tickFont, 10) };
    }
    function label(m) {
      return m.name + ': ' + U.tok(tok(m)) + ' tokens per task, ' + U.usd(costTxt(m)) + ' per task' + (tags[m.name] ? ' (' + tags[m.name].join(', ') + ')' : '');
    }
    function wire(hitR, m, focusable) {
      hitR.addEventListener('pointermove', function (ev) { hot(m, true); U.tip.show(tipSpec(m), ev.clientX, ev.clientY, hitR); });
      hitR.addEventListener('pointerleave', function () { hot(m, false); U.tip.hide(hitR); });
      if (!focusable) return;
      hitR.addEventListener('focus', function () { hot(m, true); U.tip.focus(function () { return tipSpec(m); }, hitR); });
      hitR.addEventListener('blur', function () { hot(m, false); U.tip.blur(hitR); });
      hits.push(hitR);
    }
    var svg, ax, H;

    if (stacked) {
      var rowH = 27, head = 46, pgap = 30;
      var panelH = head + rows.length * rowH;
      H = panelH * 2 + pgap;
      var barMax = W - 2;
      var CXs = function (c) { return 6 + (Math.log10(c) - cLo) / (cHi - cLo) * (W - 12); };
      svg = s('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'group', 'aria-label': 'API models ' + (tokSort === 'tokens' ? 'sorted by tokens per task' : 'sorted by cost per task') + ': first panel, token bars on a linear scale; second panel, cost dots on a log scale, in the same row order. One Tab stop: use the arrow keys to move between models.' }, box);
      ax = s('g', { class: 'axis', 'aria-hidden': 'true' }, svg);
      var hdr = function (y, txt) { var t = s('text', { class: 'chains-head', x: 0, y: y }, ax); t.textContent = txt; };
      var tickTxt = function (x, y, txt, anchor) { var t = s('text', { class: 'tick', x: x, y: y, 'text-anchor': anchor }, ax); t.textContent = txt; };
      /* panel 1: tokens */
      hdr(16, 'Tokens per task');
      var tstep = maxTok > 300 ? 200 : 100;
      for (var tv = 0; tv <= maxTok; tv += tstep) {
        var tx = tv / maxTok * barMax;
        s('line', { class: 'grid-line', x1: tx, x2: tx, y1: head - 6, y2: panelH }, ax);
        tickTxt(tx, head - 12, tv === 0 ? '0' : tv + 'k', tv === 0 ? 'start' : 'middle');
      }
      /* panel 2: cost (log) */
      var y2 = panelH + pgap;
      hdr(y2 + 16, 'Cost per task (USD, log scale)');
      var ct = costTicks(0, W, CXs);
      ct.all.forEach(function (o) { s('line', { class: 'grid-line', x1: o.x, x2: o.x, y1: y2 + head - 6, y2: H }, ax); });
      ct.labelled.forEach(function (o) { tickTxt(o.x, y2 + head - 12, U.usdTick(o.v), 'middle'); });
      rows.forEach(function (m, i) {
        rowEls[m.name] = [];
        [0, 1].forEach(function (panel) {
          var y = (panel ? y2 : 0) + head + i * rowH;
          var gr = s('g', { class: 'tk-row' + (tags[m.name] ? ' is-key' : ''), transform: 'translate(0 ' + y + ')', 'aria-hidden': 'true' }, svg);
          rowEls[m.name].push(gr);
          s('rect', { class: 'tk-band', x: -4, y: 0, width: W + 8, height: rowH - 1, rx: 6 }, gr);
          var nm = s('text', { class: 'nm', x: 0, y: 11.5, style: 'font-size:' + fs + 'px' }, gr); nm.textContent = m.shortName;
          var val = s('text', { class: 'val', x: W, y: 11.5, 'text-anchor': 'end', style: 'font-size:' + (fs - 0.5) + 'px' }, gr);
          if (panel === 0) {
            val.textContent = U.tok(tok(m));
            s('path', { d: rightRound(0, 15, Math.max(1, tok(m) / maxTok * barMax), 8), fill: color }, gr);
          } else {
            val.textContent = U.usd(costTxt(m));
            s('line', { class: 'tk-stem', x1: 0, x2: CXs(cost(m)), y1: 19, y2: 19 }, gr);
            s('circle', { cx: CXs(cost(m)), cy: 19, r: 5, fill: color, stroke: '#fff', 'stroke-width': 2 }, gr);
          }
          var hitR = s('rect', { class: 'tk-hit', x: 0, y: y, width: W, height: rowH, rx: 6 }, svg);
          if (panel === 0) { hitR.setAttribute('role', 'img'); hitR.setAttribute('aria-label', label(m)); }
          else hitR.setAttribute('aria-hidden', 'true');
          wire(hitR, m, panel === 0);
        });
      });
    } else {
      var nameW = Math.ceil(Math.max.apply(null, list.map(function (m) { return U.textWidth(m.shortName, '800 ' + fs + 'px Nunito'); }))) + 10;
      var valW = compact ? 46 : 52, tagW = wide ? 150 : 0, gap = compact ? 16 : 22;
      var panelW = (W - nameW - valW - tagW - gap * 2) / 2;
      var tokX = nameW + 6, tokValPad = compact ? 36 : 40, tokBarMax = panelW - tokValPad;
      var costX = tokX + panelW + gap, costW = panelW;
      var rowH2 = compact ? 24 : 26, head2 = 54;
      H = head2 + rows.length * rowH2 + 8;
      var CX = function (c) { return costX + 6 + (Math.log10(c) - cLo) / (cHi - cLo) * (costW - 12); };
      svg = s('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H, role: 'group', 'aria-label': 'API models ' + (tokSort === 'tokens' ? 'sorted by tokens per task' : 'sorted by cost per task') + ': token bars on a linear scale and cost dots on a log scale. One Tab stop: use the arrow keys to move between rows.' }, box);
      ax = s('g', { class: 'axis', 'aria-hidden': 'true' }, svg);
      var headText = function (x, y, txt, cls, anchor) { var t = s('text', { class: cls, x: x, y: y, 'text-anchor': anchor || 'start' }, ax); t.textContent = txt; return t; };
      headText(tokX, 16, 'Tokens per task', 'chains-head');
      headText(costX, 16, compact ? 'Cost per task (log)' : 'Cost per task (USD, log)', 'chains-head');
      var tstep2 = maxTok > 300 ? 200 : 100;
      for (var tv2 = 0; tv2 <= maxTok; tv2 += tstep2) {
        var x = tokX + tv2 / maxTok * tokBarMax;
        s('line', { class: 'grid-line', x1: x, x2: x, y1: head2 - 6, y2: H - 6 }, ax);
        headText(x, head2 - 12, tv2 === 0 ? '0' : tv2 + 'k', 'tick', tv2 === 0 ? 'start' : 'middle');
      }
      var ct2 = costTicks(costX, costX + costW, CX);
      ct2.all.forEach(function (o) { s('line', { class: 'grid-line', x1: o.x, x2: o.x, y1: head2 - 6, y2: H - 6 }, ax); });
      ct2.labelled.forEach(function (o) { headText(o.x, head2 - 12, U.usdTick(o.v), 'tick', 'middle'); });
      rows.forEach(function (m, i) {
        var y = head2 + i * rowH2;
        var gr = s('g', { class: 'tk-row' + (tags[m.name] ? ' is-key' : ''), transform: 'translate(0 ' + y + ')', 'aria-hidden': 'true' }, svg);
        rowEls[m.name] = [gr];
        s('rect', { class: 'tk-band', x: 0, y: 1, width: W, height: rowH2 - 2, rx: 6 }, gr);
        var cy = rowH2 / 2;
        var nm = s('text', { class: 'nm', x: nameW - 4, y: cy + 4.5, 'text-anchor': 'end', style: 'font-size:' + fs + 'px' }, gr); nm.textContent = m.shortName;
        var bw = Math.max(1, tok(m) / maxTok * tokBarMax);
        var bh = Math.min(12, rowH2 - 12);
        s('path', { d: rightRound(tokX, cy - bh / 2, bw, bh), fill: color }, gr);
        var tvt = s('text', { class: 'val', x: tokX + bw + 5, y: cy + 4.5, style: 'font-size:' + (fs - 0.5) + 'px' }, gr); tvt.textContent = U.tok(tok(m));
        s('line', { class: 'tk-stem', x1: costX + 6, x2: CX(cost(m)), y1: cy, y2: cy }, gr);
        s('circle', { cx: CX(cost(m)), cy: cy, r: 5.5, fill: color, stroke: '#fff', 'stroke-width': 2 }, gr);
        var cvt = s('text', { class: 'val', x: W - tagW - 2, y: cy + 4.5, 'text-anchor': 'end', style: 'font-size:' + (fs - 0.5) + 'px' }, gr); cvt.textContent = U.usd(costTxt(m));
        if (wide && tags[m.name]) {
          var tg = s('text', { class: 'tk-tag', x: W - tagW + 12, y: cy + 5 }, gr);
          tg.textContent = '← ' + tags[m.name].join(', ');
        }
        var hitR = s('rect', { class: 'tk-hit', x: 0, y: y, width: W, height: rowH2, role: 'img', 'aria-label': label(m) }, svg);
        wire(hitR, m, true);
      });
    }
    U.roving(hits);

    U.$('#tokens-sub').textContent = 'Tokens and reference cost per task for the ' + list.length + ' API models in Table 2 (' + (mode === 'text' ? 'Text Avg' : 'MM Avg') + (stacked ? '), in the same row order in both panels. ' : '), on shared rows. ') +
      (tokSort === 'tokens' ? 'Rows are sorted by tokens: if tokens predicted cost, the dots would climb steadily to the right.' : 'Rows are sorted by cost: if cost predicted tokens, the bars would grow steadily.');
    var cap = U.$('#tokens-cap');
    cap.textContent = '';
    var ext = h('p', { class: 'tokens-ext' });
    [['fewest tokens', byTok[0], U.tok(tok(byTok[0]))], ['most tokens', byTok[byTok.length - 1], U.tok(tok(byTok[byTok.length - 1]))],
      ['cheapest', byCost[0], U.usd(costTxt(byCost[0]))], ['most expensive', byCost[byCost.length - 1], U.usd(costTxt(byCost[byCost.length - 1]))]].forEach(function (x) {
      ext.appendChild(h('span', { class: 'tokens-ext__i' }, h('span', { class: 'scribble scribble--sm', text: x[0] }), h('b', { text: x[1].shortName }), ' ' + x[2]));
    });
    cap.appendChild(ext);
    cap.appendChild(h('p', { class: 'note' }, U.emphNums(finding('tokens-vs-dollars').statement)));

    U.tableView(U.$('#tokens-table'), U.table([
      { label: 'Model', get: modelCell },
      { label: 'Vendor', cls: 'col-vendor', get: function (m) { return m.vendor; } },
      { label: 'Tokens / task', num: true, get: function (m) { return U.tok(tok(m)); } },
      { label: 'Cost / task', num: true, get: function (m) { return U.usd(costTxt(m)); } },
      { label: 'Accuracy (%)', num: true, get: function (m) { return U.pct(acc(m)); } }
    ], rows, modeLabel() + ': API models (Table 2), ' + (tokSort === 'tokens' ? 'sorted by tokens per task' : 'sorted by cost per task')));
  }

  function renderAll() { scatterMeta(); drawScatter(); notes(); drawTokens(); }

  U.initCost = function () {
    U.$('#cost-lead').textContent = 'Reference cost per task comes from public API prices, so the paper analyzes accuracy–cost trade-offs for API models. Text and multimodal workloads trace different Pareto frontiers, and the models that use the fewest tokens are not the ones that cost the least.';
    U.seg(U.$('#cost-mode'), [
      { value: 'text', label: 'Text', dot: 'var(--series-text)' },
      { value: 'mm', label: 'Multimodal', dot: 'var(--series-mm)' }
    ], mode, function (v) { mode = v; renderAll(); });
    U.seg(U.$('#tokens-sort'), [
      { value: 'tokens', label: 'Sort by tokens' },
      { value: 'cost', label: 'Sort by cost' }
    ], tokSort, function (v) { tokSort = v; drawTokens(); });
    var f1 = U.fig('fig1');
    U.$('#fig1-btn-lab').textContent = 'Paper’s ' + f1.label;
    U.$('#fig1-btn').setAttribute('aria-label', 'Open the paper’s ' + f1.label + ' (accuracy–cost plot) in a larger view');
    U.$('#fig1-btn').addEventListener('click', function () { U.lightbox(U.IMG + f1.file, f1.alt, f1.label + '. ' + f1.caption); });
    renderAll();
    /* labels are measured with the web font: redraw once it has loaded */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { drawScatter(); drawTokens(); });
    U.onResize(U.$('#scatter-box'), function () { drawScatter(); });
    U.onResize(U.$('#tokens-box'), function () { drawTokens(); });
    document.addEventListener('viewtoggle', function (e) { if (!e.detail.table) { if (e.detail.target === 'scatter') drawScatter(); if (e.detail.target === 'tokens') drawTokens(); } });
  };
  U.costMode = function () { return mode; };
})();
