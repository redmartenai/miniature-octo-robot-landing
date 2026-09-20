/* ---------------------------------------------------------------------
   Boot guard.

   The markup ships with <body hidden>. Nothing is revealed until this file
   runs AND the page is being served from somewhere on the allowlist below.
   Paste the HTML into an online editor and you get a blank page: the CSS,
   this script and the eight images are all separate files it will not have.

   This is a deterrent, not a lock. Anyone holding all four files can delete
   these twenty lines. It stops casual pasting, not a determined copy.

   Deploying for real? Add the hostname to ALLOWED_HOSTS.
   Previewing inside an IDE panel that uses an iframe? Set ALLOW_EMBED = true.
   --------------------------------------------------------------------- */
var ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]', ''];
var ALLOW_EMBED = false;

(function boot() {
  'use strict';
  var onDisk = location.protocol === 'file:';
  var hostOk = onDisk || ALLOWED_HOSTS.indexOf(location.hostname) !== -1;

  var framed;
  try { framed = window.top !== window.self; } catch (e) { framed = true; }

  if (!hostOk || (framed && !ALLOW_EMBED)) {
    document.documentElement.replaceChildren();
    var note = document.createElement('body');
    note.setAttribute('style',
      'margin:0;min-height:100vh;display:grid;place-items:center;background:#0E1210;' +
      'color:#7C857F;font:400 14px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;' +
      'text-align:center;padding:40px');
    note.textContent = 'This page runs from its own project folder.';
    document.documentElement.appendChild(note);
    return;
  }
  document.body.hidden = false;
})();

/* Runs locally in the browser only: no network calls, no third-party code,
   no build step, nothing is sent anywhere. */
(function () {
  'use strict';

  /* ---- nav dropdown on narrow screens --------------------------------- */
  var navBtn = document.getElementById('navtoggle');
  var navList = document.getElementById('navlinks');
  if (navBtn && navList) {
    navBtn.addEventListener('click', function () {
      var open = navList.classList.toggle('open');
      navBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navList.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        navList.classList.remove('open');
        navBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- scroll bus ------------------------------------------------------
     One passive listener and one animation frame for everything that is
     driven by scroll position, instead of a listener per effect. */
  var calmMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var onScroll = (function () {
    var subs = [], queued = false;
    function run() {
      queued = false;
      var y = window.scrollY || window.pageYOffset;
      for (var i = 0; i < subs.length; i++) { subs[i].frame(y); }
    }
    addEventListener('scroll', function () {
      if (!queued) { queued = true; requestAnimationFrame(run); }
    }, { passive: true });
    addEventListener('resize', function () {
      for (var i = 0; i < subs.length; i++) { if (subs[i].measure) { subs[i].measure(); } }
      run();
    });
    /* anything above a scroll-driven section can change height after load —
       lazily rendered sections, the fonts, the photographs — so positions are
       measured again whenever the page itself changes height */
    function remeasure() {
      for (var i = 0; i < subs.length; i++) { if (subs[i].measure) { subs[i].measure(); } }
      run();
    }
    var lastH = 0;
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        var h = document.documentElement.scrollHeight;
        if (h !== lastH) { lastH = h; remeasure(); }
      }).observe(document.body);
    }
    addEventListener('load', remeasure);
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(remeasure); }
    return function (sub) { subs.push(sub); if (sub.measure) { sub.measure(); } run(); };
  })();

  /* ---- frame 1 → frame 2: the hand-over ---------------------------------
     The hero pins and sinks back while the next frame rises over it, growing
     from small to full size as it docks. One custom property, --p (0→1 over
     the second frame's climb from the bottom of the screen to the top),
     drives both sides of it in CSS. The hero fades out from 45% of the climb
     and is hidden from 80%, so it never shows behind the frame you are
     reading. */
  (function stack() {
    var st = document.querySelector('.stack');
    var next = st && st.querySelector('.slept');
    if (!st || !next || calmMotion) { return; }
    st.classList.add('is-live');
    var hero = st.querySelector('.hero');
    var top = 0, vh = 0, last = -1;
    onScroll({
      measure: function () {
        vh = innerHeight;
        top = next.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
      },
      frame: function (y) {
        var p = Math.min(1, Math.max(0, (y - (top - vh)) / Math.max(1, vh - 10)));
        if (Math.abs(p - last) < 0.0006) { return; }
        last = p;
        st.style.setProperty('--p', p.toFixed(4));
        /* set on the element itself, so no browser can miss the repaint of
           a pinned layer: fades between 45% and 80% of the climb, then hides */
        var gone = p >= 0.8;
        hero.style.opacity = gone ? '0' : Math.min(1, Math.max(0, (0.8 - p) / 0.35)).toFixed(3);
        hero.style.visibility = gone ? 'hidden' : '';
        st.classList.toggle('is-docked', gone);
      }
    });
  })();

  /* ---- frame 2: how Red Marten executes, live -----------------------------
     Six agents on one dial. Each ring is an agent and each of its three arcs
     a step. Arcs fill as their steps run; a ring that waits on other agents
     stays a dotted guide until its hand-off, when a spark runs in along the
     12 o'clock line from each ring it waited on. The bezel lights round with
     the run as a whole, and the readout in the middle follows whichever step
     started last. When all six are done the dial takes one sweep of light,
     holds, winds its arcs back and runs again.

     Everything hangs off one virtual clock that only advances while the
     frame is on screen, so pausing many concurrent processes is exact —
     nothing is banked, restarted or skipped. Figures are illustrative. */
  (function runDial() {
  var slept = document.getElementById('slept');
  var dial = slept && slept.querySelector('.xd');
  if (!dial || !window.IntersectionObserver || calmMotion) { return; }

  // [label, seconds, log line, {n:[from,to,suffix]} | {m:[metric,to]}]
  var PLAN = {
    ads: { deps: [], steps: [
      ['Pulling spend by campaign', 2.6, 'pulling spend across 14 campaigns', { n: [0, 14, ' campaigns'] }],
      ['Comparing cost per meeting', 2.4, 'cost per meeting compared, campaign by campaign'],
      ['Moving budget to the winners', 2.1, 'budget moving to the strongest three']],
      done: ['Campaign performance analyzed', '14 campaigns', 'budget moved to the 3 strongest campaigns'] },
    growth: { deps: [], steps: [
      ['Scanning intent signals', 2.2, 'scanning intent signals across 1,900 accounts', { n: [0, 1900, ' signals'] }],
      ['Scoring the accounts', 2.8, '214 accounts scored for fit and intent', { n: [0, 214, ' scored'] }],
      ['Shortlisting the best fit', 1.8, 'shortlisting the best fit', { m: ['accounts', 32] }]],
      done: ['32 new accounts identified', '32 accounts', '32 new accounts identified'] },
    outbound: { deps: ['growth'], steps: [
      ['Researching each contact', 2.4, 'researching 118 contacts across 32 accounts', { n: [0, 118, ' contacts'] }],
      ['Writing first lines', 3.0, 'writing a first line for every contact', { m: ['emails', 118] }],
      ['Sequencing the sends', 1.8, 'sequencing sends into each timezone’s morning']],
      done: ['Personalized outreach launched', '118 emails', '118 personalized emails scheduled'] },
    crm: { deps: [], steps: [
      ['Matching records', 2.0, 'matching 1,284 records to their accounts', { n: [0, 1284, ' matched'] }],
      ['Merging duplicates', 2.2, '9 duplicates merged', { n: [0, 9, ' merged'] }],
      ['Writing back every activity', 3.0, 'writing back every call, email and meeting', { m: ['records', 512] }]],
      done: ['CRM records updated', '512 records', '512 records updated, 9 duplicates merged'] },
    finance: { deps: ['crm'], steps: [
      ['Reading closed-won', 2.0, 'reading closed-won from the updated CRM'],
      ['Modelling the quarter', 3.0, 'modelling the quarter from the live pipeline'],
      ['Checking against pipeline', 1.6, 'checking the model against open pipeline']],
      done: ['Forecast generated', 'Q3 model', 'forecast generated from the live pipeline'] },
    reporting: { deps: ['ads', 'outbound', 'finance'], steps: [
      ['Collecting every result', 1.8, 'collecting results from all six agents'],
      ['Writing the summary', 2.6, 'writing the executive summary'],
      ['Flagging what needs you', 1.4, 'three decisions that need a human', { n: [0, 3, ' decisions'] }]],
      done: ['Executive summary prepared', '3 decisions', '3 decisions flagged for you'] }
  };
  var NAMES = { ads: 'Ads', growth: 'Growth', outbound: 'Outbound', crm: 'CRM', finance: 'Finance', reporting: 'Reporting' };
  /* replies turn into meetings while the rest of the run is still going */
  var MEETINGS = [[2.2, 'Kestrel Analytics'], [4.6, 'Halden Systems'], [6.9, 'Northwind Logistics'], [8.4, 'Corvus Payments']];
  var HOLD = 4.5, UNWIND = 1.1;
  /* ring geometry, matching the markup: 290 degrees from 12 o'clock, three arcs */
  var START = -90, GAP = 4, SEG = (290 - 2 * GAP) / 3;

  var keys = Object.keys(PLAN);
  var rings = {};
  keys.forEach(function (k) {
    var g = dial.querySelector('.xd-ring[data-a="' + k + '"]'), tip = g.querySelector('.xd-tip');
    rings[k] = { g: g, fills: [].slice.call(g.querySelectorAll('.xd-fill')), tip: tip,
                 r: 300 - parseFloat(tip.getAttribute('cy')), plan: PLAN[k] };
  });
  var svg = dial.querySelector('.xd-svg');
  var ticks = [].slice.call(dial.querySelectorAll('.xd-tick'));
  var pn = dial.querySelector('.xd-pn'), kEl = dial.querySelector('.xd-k');
  var stepEl = dial.querySelector('.xd-step'), subEl = dial.querySelector('.xd-sub');
  var list = slept.querySelector('.xrun-log');
  var metricEl = {};
  [].forEach.call(slept.querySelectorAll('[data-m]'), function (d) { metricEl[d.getAttribute('data-m')] = d; });

  var vt = 0, last = 0, raf = 0, live = false, started = false, unwinding = false, lit = 72;
  var metric, shown, doneAt, doneCount, outboundAt, meetIdx, focus;

  function text(el, v) { if (el.textContent !== v) { el.textContent = v; } }
  function fmt(n) { return n >= 1000 ? Math.floor(n / 1000) + ',' + ('00' + (n % 1000)).slice(-3) : String(n); }
  function swap(el, v) {
    if (el.textContent === v) { return; }
    el.textContent = v; el.classList.remove('is-swap'); void el.offsetWidth; el.classList.add('is-swap');
  }
  function setFill(f, p) {
    f.style.strokeDashoffset = (100 * (1 - p)).toFixed(2);
    f.classList.toggle('is-empty', p <= 0.002);
  }
  function tipAt(R, i, p) {
    var a = (START + i * (SEG + GAP) + SEG * p) * Math.PI / 180;
    R.tip.setAttribute('cx', (300 + R.r * Math.cos(a)).toFixed(1));
    R.tip.setAttribute('cy', (300 + R.r * Math.sin(a)).toFixed(1));
  }
  function ringState(R, s) { R.g.setAttribute('class', 'xd-ring is-' + s); }
  function lightTicks(n) {
    if (n === lit) { return; }
    for (var i = Math.min(n, lit); i < Math.max(n, lit); i++) { ticks[i].classList.toggle('is-lit', i < n); }
    lit = n;
  }
  function log(who, msg) {
    var li = document.createElement('li'), b = document.createElement('b'), s = document.createElement('span');
    li.className = 'is-new'; b.textContent = who; s.textContent = msg;
    li.appendChild(b); li.appendChild(s);
    list.insertBefore(li, list.firstChild);
    while (list.children.length > 3) { list.removeChild(list.lastChild); }
  }
  /* a hand-off: a spark runs in from the ring that finished to the ring that starts */
  function spark(r0, r1) {
    var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    c.setAttribute('class', 'xd-spark'); c.setAttribute('r', '4.5');
    c.setAttribute('cx', '300'); c.setAttribute('cy', String(300 - r0));
    svg.appendChild(c);
    if (!c.animate) { c.remove(); return; }
    var d = (r0 - r1).toFixed(1);
    c.animate([{ transform: 'translateY(0)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1, offset: 0.12 },
               { transform: 'translateY(' + d + 'px)', opacity: 1, offset: 0.82 }, { transform: 'translateY(' + d + 'px)', opacity: 0 }],
              { duration: 950, easing: 'cubic-bezier(.45,0,.2,1)' }).onfinish = function () { c.remove(); };
  }
  function show(k, i) {
    focus = k;
    swap(kEl, NAMES[k] + ' · step ' + (i + 1) + ' of ' + PLAN[k].steps.length);
    swap(stepEl, PLAN[k].steps[i][0]);
    text(subEl, ' ');
  }

  function reset() {
    vt = 0; doneAt = -1; doneCount = 0; outboundAt = -1; meetIdx = 0; focus = null;
    metric = { accounts: 0, emails: 0, records: 0, meetings: 0 };
    shown = { accounts: 0, emails: 0, records: 0, meetings: 0 };
    keys.forEach(function (k) {
      var R = rings[k];
      R.i = -1; R.t0 = 0; R.base = null;
      R.fills.forEach(function (f) { setFill(f, 0); f.classList.remove('is-live'); });
      ringState(R, R.plan.deps.length ? 'wait' : 'queued');
    });
    lightTicks(0);
    Object.keys(metricEl).forEach(function (m) { text(metricEl[m], '0'); });
    list.textContent = '';
    log('run', 'plan loaded · 6 agents, 18 steps');
    text(pn, '0');
    swap(kEl, 'Plan loaded');
    swap(stepEl, 'Six agents, eighteen steps');
    text(subEl, 'starting now');
    slept.classList.add('ops-running');
    slept.classList.remove('is-complete');
  }

  function begin(k, R, i) {
    var s = R.plan.steps[i];
    R.i = i; R.t0 = vt;
    R.base = s[3] && s[3].m ? metric[s[3].m[0]] : null;
    if (i === 0) {
      ringState(R, 'live');
      R.plan.deps.forEach(function (d) { spark(rings[d].r, R.r); });
    } else {
      setFill(R.fills[i - 1], 1);
      R.fills[i - 1].classList.remove('is-live');
    }
    R.fills[i].classList.add('is-live');
    tipAt(R, i, 0);
    show(k, i);
    if (s[2]) { log(k, s[2]); }
  }

  function finish(k, R) {
    var d = R.plan.done;
    R.i = R.plan.steps.length;
    R.fills.forEach(function (f) { setFill(f, 1); f.classList.remove('is-live'); });
    ringState(R, 'done');
    log(k, d[2]);
    doneCount++;
    if (k === 'outbound') { outboundAt = vt; }
    if (focus === k) { swap(kEl, NAMES[k] + ' · done'); swap(stepEl, d[0]); text(subEl, d[1]); }
  }

  function depsDone(R) {
    return R.plan.deps.every(function (d) { return rings[d].i >= rings[d].plan.steps.length; });
  }

  function frame(now) {
    if (!live) { raf = 0; return; }
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now; vt += dt;
    var total = 0;
    keys.forEach(function (k) {
      var R = rings[k], n = R.plan.steps.length;
      if (R.i === -1 && doneAt < 0 && depsDone(R)) { begin(k, R, 0); }
      if (R.i > -1 && R.i < n) {
        var s = R.plan.steps[R.i], p = Math.min(1, (vt - R.t0) / s[1]);
        setFill(R.fills[R.i], p);
        tipAt(R, R.i, p);
        var e = 1 - Math.pow(1 - p, 2);
        if (s[3] && s[3].n && focus === k) {
          text(subEl, fmt(Math.round(s[3].n[0] + (s[3].n[1] - s[3].n[0]) * e)) + s[3].n[2]);
        }
        if (s[3] && s[3].m) {
          metric[s[3].m[0]] = Math.round(R.base + s[3].m[1] * e);
          if (focus === k) { text(subEl, fmt(metric[s[3].m[0]]) + ' ' + s[3].m[0]); }
        }
        if (p >= 1) { if (R.i + 1 < n) { begin(k, R, R.i + 1); } else { finish(k, R); } }
      }
      total += R.i < 0 ? 0 : Math.min(n, R.i + (R.i < n ? Math.min(1, (vt - R.t0) / R.plan.steps[R.i][1]) : 0)) / n;
    });
    if (outboundAt > -1 && meetIdx < MEETINGS.length && vt - outboundAt >= MEETINGS[meetIdx][0]) {
      metric.meetings++;
      log('meeting', 'booked · ' + MEETINGS[meetIdx][1]);
      meetIdx++;
    }
    Object.keys(metric).forEach(function (m) {
      if (shown[m] !== metric[m]) {
        var el = metricEl[m];
        shown[m] = metric[m];
        text(el, fmt(shown[m]));
        el.classList.add('is-bump');
        clearTimeout(el._t);
        el._t = setTimeout(function () { el.classList.remove('is-bump'); }, 450);
      }
    });
    if (!unwinding && doneAt < 0) {
      var frac = total / keys.length;
      text(pn, String(Math.round(frac * 100)));
      lightTicks(Math.round(frac * ticks.length));
    }
    if (doneCount === keys.length && meetIdx >= MEETINGS.length && doneAt < 0) {
      doneAt = vt;
      slept.classList.remove('ops-running');
      slept.classList.add('run-seen', 'is-complete');
      text(pn, '100'); lightTicks(ticks.length);
      swap(kEl, 'Run complete'); swap(stepEl, '3 decisions for you'); text(subEl, 'nothing else waiting on you');
      log('run', 'run complete · nothing waiting on you but three decisions');
    }
    /* after the hold the arcs wind back, then the next run starts */
    if (doneAt > -1 && !unwinding && vt - doneAt > HOLD) {
      unwinding = true;
      dial.classList.add('is-unwind');
      slept.classList.remove('is-complete');
      keys.forEach(function (k) { rings[k].fills.forEach(function (f) { f.style.strokeDashoffset = '100'; }); });
      lightTicks(0); text(pn, '0');
      swap(kEl, 'Next run'); swap(stepEl, 'Loading the plan'); text(subEl, ' ');
    }
    if (unwinding && vt - doneAt > HOLD + UNWIND) {
      unwinding = false;
      dial.classList.remove('is-unwind');
      reset();
    }
    raf = requestAnimationFrame(frame);
  }

  function run(on) {
    live = on;
    if (on && !started) {
      started = true;
      slept.classList.add('run-ready');
      reset();
      dial.classList.add('is-in');
      /* the dial finishes arriving before the first steps start */
      setTimeout(function () {
        dial.classList.remove('is-armed', 'is-in');
        if (live && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      }, 1300);
      return;
    }
    if (on && started && !raf && !dial.classList.contains('is-armed')) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }
  dial.classList.add('is-armed');
  new IntersectionObserver(function (e) {
    var x = e[0], need = Math.min(x.boundingClientRect.height, innerHeight) * 0.4;
    run(x.isIntersecting && x.intersectionRect.height >= need);
  }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1] }).observe(dial);
  })();

  /* ---- the system: five capabilities, one open at a time --------------
     CSS does the moving; this decides which card is open. The open card's
     timer is a CSS animation, so when it ends the next card opens, and
     pausing it (pointer over the row, or the frame off screen) is exact.
     Hover opens a card after a short beat, so sweeping the pointer across
     the row doesn't set every card flapping; click, tap, focus and Enter
     open one at once. */
  (function fold() {
  var row = document.querySelector('.fold');
  if (!row) { return; }
  var cards = [].slice.call(row.querySelectorAll('.fold-card'));
  var intent = 0;
  function show(i) {
    cards.forEach(function (c, k) {
      c.classList.toggle('is-open', k === i);
      c.setAttribute('aria-expanded', k === i ? 'true' : 'false');
    });
  }
  cards.forEach(function (c, i) {
    c.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse') { return; }
      clearTimeout(intent);
      intent = setTimeout(function () { show(i); }, 160);
    });
    c.addEventListener('pointerleave', function () { clearTimeout(intent); });
    c.addEventListener('click', function () { clearTimeout(intent); show(i); });
    c.addEventListener('focus', function () { show(i); });
    c.addEventListener('keydown', function (e) {
      var k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (k) { e.preventDefault(); cards[(i + k + cards.length) % cards.length].focus(); }
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(i); }
    });
    c.querySelector('.fold-bar i').addEventListener('animationend', function () {
      if (c.classList.contains('is-open')) { show((i + 1) % cards.length); }
    });
  });
  row.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { row.classList.add('is-held'); } });
  row.addEventListener('pointerleave', function () { row.classList.remove('is-held'); });
  if (calmMotion || !window.IntersectionObserver) { return; }

  row.classList.add('is-armed');
  var arrived = false;
  new IntersectionObserver(function (e) {
    var x = e[0], on = x.isIntersecting && x.intersectionRect.height >= Math.min(x.boundingClientRect.height, innerHeight) * 0.4;
    row.classList.toggle('is-live', on);
    if (on && !arrived) {
      arrived = true;
      row.classList.add('is-in');
      /* once the cards have landed, drop the arrival's staggered delays */
      setTimeout(function () { row.classList.remove('is-armed', 'is-in'); }, 1600);
    }
  }, { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1] }).observe(row);
  })();

  /* ---- integrations: the theatre ----------------------------------------
     One frame, four scenes. On a laptop the frame pins and the scroll
     position picks the scene; the change itself is a timed transition, so a
     scene is never left half-drawn if the reader stops scrolling mid-way.

     Each scene's logos travel their path as SMIL, paused unless that scene
     is on screen. The list item whose logo is passing the focus point is
     lit — the timeline is read four times a second, and a chip's progress
     is ((t - begin) mod dur) / dur. */
  (function theatre() {
  var th = document.querySelector('.theatre');
  if (!th) { return; }
  var runway = th.querySelector('.th-runway');
  var frame  = th.querySelector('.th-frame');
  var scenes = [].slice.call(th.querySelectorAll('.th-scene'));
  var rail   = [].slice.call(th.querySelectorAll('.th-rail button'));
  var N = scenes.length;

  scenes.forEach(function (s) {
    [].forEach.call(s.querySelectorAll('.lt-wall, .if-list'), function (wall) {
      [].forEach.call(wall.children, function (li, i) { li.style.setProperty('--n', i); });
    });
  });

  function flowOf(scene) {
    var svg   = scene.querySelector('.th-svg');
    var timed = !!(svg && svg.pauseAnimations && svg.getCurrentTime);
    var dur   = parseFloat(scene.getAttribute('data-dur')) || 20;
    var focus = parseFloat(scene.getAttribute('data-focus')) || 0.5;
    var attr  = scene.getAttribute('data-by') === 'c' ? 'data-c' : 'data-k';
    var win   = attr === 'data-c' ? 0.03 : 0.06;
    var chips = [].slice.call(scene.querySelectorAll('.chip'));
    var begin = chips.map(function (c) { return parseFloat(c.getAttribute('data-b')) || 0; });
    var marks = {};
    [].forEach.call(scene.querySelectorAll('.th-in [data-k]'), function (el) {
      var k = el.getAttribute('data-k');
      (marks[k] = marks[k] || []).push(el);
    });
    var lit = null, poll = null, sized = false, live = false;
    if (timed) { try { svg.pauseAnimations(); } catch (e) { timed = false; } }

    /* the spotlight (CRMs) and the router (models) present whichever logo is
       arriving, lifting its mark and name from its own tile in the wall.
       The router's tasks are the site's own words for what the agents do. */
    var feature = scene.querySelector('.th-feature'), router = scene.querySelector('.th-router');
    var board = scene.querySelector('.crm-board') ? crmBoard(scene) : null;
    var TASKS = { llm: ['Write the outreach', 'Draft the reply in your voice', 'Summarise the call', 'Score the intent'],
                  agent: ['Research the account', 'Run the follow-up', 'Book the meeting'],
                  data: ['Find the accounts', 'Pull the pipeline', 'Check the forecast'] };
    var CATNAME = { llm: 'LLM', agent: 'Agent', data: 'Data' }, turn = { llm: 0, agent: 0, data: 0 };
    function present(key) {
      var card = feature || router;
      var src = card && scene.querySelector('.lt[data-k="' + key + '"]');
      if (!src) { return; }
      var mk = src.querySelector('.lt-m'), word = mk.classList.contains('lt-m--word');
      var slot = card.querySelector('.tf-mark');
      card.style.setProperty('--ac', src.style.getPropertyValue('--ac'));
      if (word) { slot.textContent = src.getAttribute('data-name'); } else { slot.innerHTML = mk.innerHTML; }
      slot.classList.toggle('tf-mark--word', word);
      card.querySelector('.tf-name').textContent = src.getAttribute('data-name');
      if (router) {
        var c = src.getAttribute('data-c'), list = TASKS[c] || TASKS.llm;
        router.querySelector('.tr-task').textContent = list[turn[c] % list.length];
        turn[c] = (turn[c] || 0) + 1;
        router.querySelector('.tr-cat').textContent = CATNAME[c] || '';
      }
      card.classList.remove('is-swap'); void card.offsetWidth; card.classList.add('is-swap');
    }

    function size() {                   /* each pill fitted to its rendered name */
      if (sized) { return; }
      sized = true;
      chips.forEach(function (c) {
        var t = c.querySelector('.chip-tx');
        if (!t) { return; }
        var w = 0;
        try { w = t.getComputedTextLength(); } catch (e) { /* not laid out yet */ }
        if (!w) { sized = false; return; }
        var m = c.querySelector('.chip-mark');
        var pad = 13, lead = m ? 25 : 0, W = pad + lead + w + pad, x0 = -W / 2;
        [].forEach.call(c.querySelectorAll('rect'), function (r) {
          r.setAttribute('x', x0.toFixed(1)); r.setAttribute('width', W.toFixed(1));
        });
        if (m) { m.setAttribute('x', (x0 + pad).toFixed(1)); }
        t.setAttribute('x', (x0 + pad + lead).toFixed(1));
      });
    }
    function light(key) {
      if (key === lit) { return; }
      if (lit && marks[lit]) { marks[lit].forEach(function (el) { el.classList.remove('is-on'); }); }
      lit = key;
      if (key && marks[key]) { marks[key].forEach(function (el) { el.classList.add('is-on'); }); }
      if (key) { present(key); }
    }
    function tick() {
      var t = svg.getCurrentTime(), best = -1, gap = 1;
      for (var i = 0; i < chips.length; i++) {
        var p = ((((t - begin[i]) % dur) + dur) % dur) / dur;
        var d = Math.abs(p - focus);
        if (d < gap) { gap = d; best = i; }
      }
      light(best > -1 && gap < win ? chips[best].getAttribute(attr) : null);
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { sized = false; if (live) { size(); } });
    }
    return {
      run: function (on) {
        live = on;
        if (on) { size(); }
        if (board) { board.run(on && !calmMotion); }
        if (!timed) { return; }
        if (on && !calmMotion) {
          try { svg.unpauseAnimations(); } catch (e) { /* leave it */ }
          if (!poll) { tick(); poll = setInterval(tick, 250); }
        } else {
          try { svg.pauseAnimations(); } catch (e) { /* leave it */ }
          if (poll) { clearInterval(poll); poll = null; }
          if (on) { tick(); }
        }
      }
    };
  }
  var flows = scenes.map(flowOf);

  var stat = th.querySelector('.th-stat b[data-count]'), counted = false;
  function countStat() {
    if (counted || !stat) { return; }
    counted = true;
    var to = +stat.getAttribute('data-count'), t0 = 0;
    stat.textContent = '0';
    function step(now) {
      if (!t0) { t0 = now; }
      var p = Math.min(1, (now - t0) / 1500);
      stat.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) { requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
    setTimeout(function () { stat.textContent = String(to); }, 1900);   /* throttled tab: never leave it part-way */
  }

  var staged = matchMedia('(min-width: 901px)').matches && !calmMotion && !!window.IntersectionObserver;

  /* ---- stacked (phones, reduced motion): each scene runs while seen ---- */
  if (!staged) {
    scenes.forEach(function (s, i) {
      if (!window.IntersectionObserver) { return; }
      new IntersectionObserver(function (e) { flows[i].run(e[0].isIntersecting); if (i === 0 && e[0].isIntersecting) { countStat(); } },
        { rootMargin: '80px 0px' }).observe(s);
    });
    [].forEach.call(th.querySelectorAll('[data-go]'), function (b) {
      b.addEventListener('click', function () {
        scenes[+b.getAttribute('data-go')].scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
    return;
  }

  th.classList.add('is-staged');
  var gl = stageGL(frame.querySelector('.th-gl'), scenes.map(function (s) {
    return [s.getAttribute('data-img'), s.getAttribute('data-img-hd')];
  }));
  if (gl) { th.classList.add('has-gl'); }

  var cur = -1, live = false, leaveTimers = [];
  function show(i) {
    if (i === cur) { return; }
    var prev = cur;
    cur = i;
    scenes.forEach(function (s, k) {
      clearTimeout(leaveTimers[k]);
      s.classList.toggle('is-active', k === i);
      if (k === prev) {
        s.classList.add('is-leaving');
        leaveTimers[k] = setTimeout(function () { s.classList.remove('is-leaving'); }, 950);
      } else if (k !== i) {
        s.classList.remove('is-leaving');
      }
    });
    rail.forEach(function (b, k) { b.classList.toggle('is-active', k === i); });
    if (i === 0) { setTimeout(countStat, 900); }
    if (prev > -1) { flows[prev].run(false); }
    if (live) { flows[i].run(true); }
    if (gl) { gl.to(i); }
  }

  var rTop = 0, span = 1, pin = 0, target = 0;
  onScroll({
    measure: function () {
      pin  = parseFloat(getComputedStyle(frame).top) || 0;
      rTop = runway.getBoundingClientRect().top + (window.scrollY || window.pageYOffset);
      span = Math.max(1, runway.offsetHeight - frame.offsetHeight);
      if (gl) { gl.resize(); }
    },
    frame: function (y) {
      var P = Math.min(1, Math.max(0, (y + pin - rTop) / span));
      for (var k = 0; k < rail.length; k++) {
        rail[k].style.setProperty('--f', Math.min(1, Math.max(0, P * N - k)).toFixed(3));
      }
      target = Math.min(N - 1, Math.floor(P * N));
      if (cur > -1) { scenes[cur].style.setProperty('--t', Math.min(1, Math.max(0, P * N - cur)).toFixed(3)); }
      if (live && target !== cur) { show(target); }
    }
  });

  /* the first scene plays its entrance when the frame arrives, not at load */
  new IntersectionObserver(function (e) {
    live = e[0].isIntersecting;
    if (live) {
      if (cur === -1) { show(target); } else { flows[cur].run(true); }
      if (gl) { gl.play(); }
    } else {
      if (cur > -1) { flows[cur].run(false); }
      if (gl) { gl.pause(); }
    }
  }, { rootMargin: '0px' }).observe(runway);

  function jump(i) {
    var y = rTop - pin + span * ((i + 0.5) / N);
    scrollTo({ top: y, behavior: 'smooth' });
  }
  rail.forEach(function (b, k) { b.addEventListener('click', function () { jump(k); }); });
  [].forEach.call(th.querySelectorAll('.th-in [data-go]'), function (b) {
    b.addEventListener('click', function () { jump(+b.getAttribute('data-go')); });
  });
  })();

  /* ---- 02 · the live pipeline -------------------------------------------
     Four moves on a loop — a new lead arrives, a lead qualifies, a meeting is
     booked, a rep closes a deal in the CRM — which keeps every column
     populated forever. The first three are written to the CRM (↑); the win
     is read back from it (↓). Each move goes to the next of the ten CRMs,
     lit in the wall below. Every card that moves or shuffles is FLIP-
     animated — measured, moved, then played back from where it was — so
     nothing ever jumps. Deals are illustrative. */
  function crmBoard(scene) {
    var board = scene.querySelector('.crm-board');
    var lists = [].slice.call(board.querySelectorAll('.cb-list'));
    var counts = [].slice.call(board.querySelectorAll('.cb-n'));
    var sync = board.querySelector('.cb-sync'), mark = board.querySelector('.cb-mark'), crmName = board.querySelector('.cb-crm');
    var toast = board.querySelector('.cb-toast'), arrow = toast.querySelector('.cb-arrow');
    var msg = toast.querySelector('.cb-msg'), ms = toast.querySelector('.cb-ms');
    var tiles = [].slice.call(scene.querySelectorAll('.lt-wall .lt'));
    var POOL = [['Northwind Logistics', 'VP Revenue', '$58k'], ['Corvus Payments', 'Head of Sales', '$42k'],
                ['Harbourline Ports', 'COO', '$74k'], ['Fernwood Capital', 'CFO', '$88k'],
                ['Meridian Labs', 'Head of Ops', '$31k'], ['Alder Street', 'Founder', '$22k'],
                ['Quillon Energy', 'VP Revenue', '$67k']];
    var pool = 0, crm = 0, step = 0, timer = null, live = false, easing = 'cubic-bezier(.16,1,.3,1)';

    function restart(el) { el.classList.remove('is-swap'); void el.offsetWidth; el.classList.add('is-swap'); }
    function recount() { lists.forEach(function (l, i) { counts[i].textContent = String(l.children.length); }); }
    function nextCrm() {
      var t = tiles[crm++ % tiles.length], word = t.querySelector('.lt-m--word');
      tiles.forEach(function (x) { x.classList.toggle('is-on', x === t); });
      board.style.setProperty('--ac', t.style.getPropertyValue('--ac'));
      mark.innerHTML = word ? '' : t.querySelector('.lt-m').innerHTML;
      mark.classList.toggle('is-word', !!word);
      crmName.textContent = t.getAttribute('data-name');
      restart(sync);
      return t.getAttribute('data-name');
    }
    function say(read, where, what) {
      toast.classList.toggle('is-read', read);
      arrow.textContent = read ? '↓' : '↑';
      msg.innerHTML = (read ? 'Read from ' : 'Written to ') + '<b></b> · ';
      msg.querySelector('b').textContent = where;
      msg.appendChild(document.createTextNode(what));
      ms.textContent = (0.2 + ((step * 7) % 6) / 10).toFixed(1) + 's';
      restart(toast);
    }
    /* measure every card, change the DOM, then play each from where it was */
    function flip(mutate, mover, read) {
      var cards = [].slice.call(board.querySelectorAll('.cb-card'));
      var before = cards.map(function (c) { return c.getBoundingClientRect(); });
      mutate();
      cards.forEach(function (c, i) {
        if (!c.isConnected) { return; }
        var a = before[i], b = c.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
        if (c === mover) {
          c.classList.remove('is-synced');
          c.classList.toggle('is-read', !!read);
          c.classList.add('is-moving');
          c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(1)' },
                     { transform: 'translate(' + (dx * 0.5) + 'px,' + (dy * 0.5 - 14) + 'px) scale(1.06)', offset: 0.45 },
                     { transform: 'none' }], { duration: 950, easing: easing }).onfinish = function () {
            c.classList.remove('is-moving'); c.classList.add('is-synced');
          };
        } else if (dx || dy) {
          c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }],
                    { duration: 700, easing: easing });
        }
      });
      recount();
    }
    function card(co, role, value, agent) {
      var li = document.createElement('li');
      li.className = 'cb-card';
      li.innerHTML = '<span class="cb-co"></span><span class="cb-meta"></span>' +
                     '<span class="cb-foot"><i class="cb-ag"></i><i class="cb-ok"></i></span>';
      li.querySelector('.cb-co').textContent = co;
      li.querySelector('.cb-meta').textContent = role + ' · ' + value;
      li.querySelector('.cb-ag').textContent = agent;
      return li;
    }
    function advance(from, to, agent, read, verb) {
      var c = lists[from].lastElementChild;           /* the oldest in the column */
      if (!c) { return false; }
      var where = nextCrm();
      c.querySelector('.cb-ag').textContent = agent;
      flip(function () { lists[to].insertBefore(c, lists[to].firstChild); }, c, read);
      say(read, where, verb.replace('%', c.querySelector('.cb-co').textContent));
      return true;
    }
    function tick() {
      step++;
      var won = lists[3];
      if (won.children.length > 2) {                  /* the oldest win leaves quietly */
        var gone = won.lastElementChild;
        gone.animate([{ opacity: 1 }, { opacity: 0, transform: 'translate3d(0,8px,0)' }], { duration: 380 })
          .onfinish = function () { flip(function () { gone.remove(); }); };
      }
      switch (step % 4) {
        case 1: {
          var p = POOL[pool++ % POOL.length], c = card(p[0], p[1], p[2], 'Growth'), where = nextCrm();
          flip(function () { lists[0].insertBefore(c, lists[0].firstChild); });
          c.animate([{ opacity: 0, transform: 'translate3d(0,-14px,0) scale(.96)' }, { opacity: 1, transform: 'none' }],
                    { duration: 700, easing: easing }).onfinish = function () { c.classList.add('is-synced'); };
          say(false, where, 'new lead created for ' + p[0]);
          break;
        }
        case 2: advance(1, 2, 'Outbound', false, '% moved to Meeting booked'); break;
        case 3: advance(0, 1, 'Growth', false, '% qualified on fit and intent'); break;
        default: advance(2, 3, 'Your rep', true, 'your rep marked % won');
      }
    }
    function loop() { if (!live) { return; } tick(); timer = setTimeout(loop, 2500); }
    return {
      run: function (on) {
        live = on;
        if (on && !timer) { if (!crm) { nextCrm(); } timer = setTimeout(loop, 1100); }
        if (!on && timer) { clearTimeout(timer); timer = null; }
      }
    };
  }

  /* ---- the theatre's WebGL stage -----------------------------------------
     Draws the four photographs, and does two things CSS cannot:

     · each scene is alive — heat shimmer and a breathing glow on the sun,
       fog rolling through the valley, a patch of sun crossing the dunes,
       light travelling through the ribbon's fins;
     · scenes change with an ember burn: a noise-broken edge sweeps across
       the frame (out from the sun, down the valley, left to right into the
       ribbon), scorching just ahead of itself and glowing white-hot at the
       seam, while the old scene recedes and the new one settles out of a
       zoom.

     Photos are mapped with the same centre-crop maths as background-size:
     cover and the SVG's xMidYMid slice, so the logo paths stay on their
     features. Renders only while the theatre is on screen, at the display's
     own resolution up to 2 device pixels. Each photograph comes in two sizes
     and the 3200px one is fetched only when the frame draws wider than 1600
     device pixels, so on a Retina screen the texture is never magnified. */
  function stageGL(canvas, srcs) {
    if (!canvas) { return null; }
    var g = null;
    try { g = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'high-performance' }); }
    catch (e) { g = null; }
    if (!g) { return null; }

    var VS = 'attribute vec2 aPos;varying vec2 vUv;void main(){vUv=aPos*.5+.5;gl_Position=vec4(aPos,0.,1.);}';
    var FS = [
      'precision highp float;',
      'varying vec2 vUv;',
      'uniform sampler2D uA,uB;',
      'uniform vec2 uRes,uSzA,uSzB,uOrigin;',
      'uniform float uProg,uEase,uTime,uSA,uSB,uMode,uDir;',
      'float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
      'float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);',
      '  return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.02+vec2(17.1,9.3);a*=.5;}return v;}',
      'vec2 cover(vec2 uv,vec2 sz,float zoom){float ca=uRes.x/uRes.y,ia=sz.x/sz.y;vec2 p=uv-.5;',
      '  if(ca>ia)p.y*=ia/ca;else p.x*=ca/ia;return p/zoom+.5;}',
      'vec3 alive(sampler2D t,float s,vec2 uv){',
      '  float T=uTime;',
      '  if(s<.5){',                                   /* the sun */
      '    vec2 c=vec2(.4906,.70);float d=distance(uv*vec2(1.78,1.),c*vec2(1.78,1.));',
      '    float near=smoothstep(.6,.0,d)*smoothstep(.38,.5,uv.y);',
      '    uv.x+=(noise(vec2(uv.y*70.,T*1.6))-.5)*.0022*near;',
      '    vec3 col=texture2D(t,uv).rgb;',
      '    col+=vec3(1.,.42,.16)*exp(-d*d*8.)*(.14+.07*sin(T*.9));',
      '    return col;}',
      '  if(s<1.5){',                                  /* the valley */
      '    vec3 col=texture2D(t,uv).rgb;',
      '    float f=fbm(vec2(uv.x*2.4-T*.024,uv.y*5.5+T*.005));',
      '    float band=smoothstep(.08,.3,uv.y)*smoothstep(.72,.45,uv.y);',
      '    return mix(col,vec3(.93,.89,.82),f*f*band*.46);}',
      '  if(s<2.5){',                                  /* the dunes */
      '    vec3 col=texture2D(t,uv).rgb;',
      '    float lx=fract(T*.016)*1.6-.3;',
      '    float pa=exp(-((uv.x-lx)*(uv.x-lx)*14.+(uv.y-.3)*(uv.y-.3)*60.));',
      '    float sand=smoothstep(.46,.36,uv.y);',
      '    col+=vec3(1.,.84,.62)*pa*sand*.26;',
      '    col+=vec3(.95)*(noise(uv*vec2(260.,120.)+T*vec2(3.,.5))-.5)*.03*sand;',
      '    return col;}',
      '  vec3 col=texture2D(t,uv).rgb;',                 /* the ribbon */
      '  float lum=dot(col,vec3(.3,.59,.11));',
      '  float bx=fract(T*.075)*1.7-.35;',
      '  float b=exp(-pow((uv.x-bx-(uv.y-.5)*.25)*5.,2.));',
      '  return col+col*b*smoothstep(.12,.7,lum)*1.3+vec3(1.,.72,.5)*b*smoothstep(.35,.9,lum)*.24;}',
      'void main(){',
      '  vec2 s=vUv;',
      '  if(uProg>=1.){gl_FragColor=vec4(alive(uB,uSB,cover(s,uSzB,1.)),1.);return;}',
      '  float asp=uRes.x/uRes.y,gr;',
      '  if(uMode<.5)gr=clamp(distance(s*vec2(asp,1.),uOrigin*vec2(asp,1.))/(asp*.9),0.,1.);',
      '  else if(uMode<1.5)gr=1.-s.y;',
      '  else gr=s.x;',
      '  if(uDir<0.)gr=1.-gr;',
      '  float m=clamp(gr*.64+fbm(s*vec2(asp,1.)*3.4+3.7)*.36,0.,1.);',
      '  float w=.048,th=uProg*(1.+2.*w)-w;',
      '  float k=smoothstep(th-w,th+w,m);',              /* 1: the old scene still stands */
      '  float band=1.-abs(k*2.-1.);',
      '  vec2 dist=(vec2(noise(s*22.+uTime*2.),noise(s*22.-uTime*2.))-.5)*.03*band;',
      '  vec3 A=alive(uA,uSA,cover(s+dist,uSzA,1.+.045*uEase));',
      '  vec3 B=alive(uB,uSB,cover(s-dist*.6,uSzB,1.09-.09*uEase));',
      '  vec3 col=mix(B,A,k);',
      '  col*=1.-.5*smoothstep(.12,1.,band)*k;',        /* scorched just ahead of the seam */
      '  vec3 ember=mix(vec3(1.,.28,.07),vec3(1.,.9,.7),pow(band,5.));',
      '  col+=ember*pow(band,2.6)*1.35;',
      '  gl_FragColor=vec4(col,1.);}'
    ].join('\n');

    function sh(type, src) {
      var o = g.createShader(type);
      g.shaderSource(o, src); g.compileShader(o);
      return g.getShaderParameter(o, g.COMPILE_STATUS) ? o : null;
    }
    var vs = sh(g.VERTEX_SHADER, VS), fs = sh(g.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { return null; }
    var pr = g.createProgram();
    g.attachShader(pr, vs); g.attachShader(pr, fs); g.linkProgram(pr);
    if (!g.getProgramParameter(pr, g.LINK_STATUS)) { return null; }
    g.useProgram(pr);

    var buf = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
    var aPos = g.getAttribLocation(pr, 'aPos');
    g.enableVertexAttribArray(aPos);
    g.vertexAttribPointer(aPos, 2, g.FLOAT, false, 0, 0);

    var U = {};
    ['uA', 'uB', 'uRes', 'uSzA', 'uSzB', 'uOrigin', 'uProg', 'uEase', 'uTime', 'uSA', 'uSB', 'uMode', 'uDir']
      .forEach(function (n) { U[n] = g.getUniformLocation(pr, n); });

    /* a dark 1px placeholder until each photograph arrives */
    var tex = [], size = [], got = [], hd = false;
    function load(i, level) {                     /* level 1: 1600px, level 2: 3200px */
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () {
        (img.decode ? img.decode() : Promise.resolve()).catch(function () {}).then(function () {
          if (level <= got[i]) { return; }          /* the sharper copy got here first */
          got[i] = level;
          g.bindTexture(g.TEXTURE_2D, tex[i]);
          g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, true);
          g.texImage2D(g.TEXTURE_2D, 0, g.RGB, g.RGB, g.UNSIGNED_BYTE, img);
          size[i] = [img.naturalWidth, img.naturalHeight];
          draw(performance.now());
        });
      };
      img.src = srcs[i][level - 1];
    }
    /* widest the photo is drawn, in device pixels, through the cover crop */
    function need() {
      var w = canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 2);
      var h = canvas.clientHeight * Math.min(window.devicePixelRatio || 1, 2);
      return Math.max(w, h * 16 / 9);
    }
    function upgrade() {
      if (hd || need() <= 1600) { return; }
      hd = true;
      srcs.forEach(function (s, i) { if (s[1]) { load(i, 2); } });
    }
    srcs.forEach(function (s, i) {
      var t = g.createTexture();
      g.bindTexture(g.TEXTURE_2D, t);
      g.texImage2D(g.TEXTURE_2D, 0, g.RGB, 1, 1, 0, g.RGB, g.UNSIGNED_BYTE, new Uint8Array([6, 8, 11]));
      [g.TEXTURE_WRAP_S, g.TEXTURE_WRAP_T].forEach(function (p) { g.texParameteri(g.TEXTURE_2D, p, g.CLAMP_TO_EDGE); });
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
      tex[i] = t; size[i] = [1, 1]; got[i] = 0;
    });
    upgrade();
    srcs.forEach(function (s, i) { if (!hd || !s[1]) { load(i, 1); } });

    var a = 0, b = 0, t0 = -1e9, DUR = 1650, mode = 0, dir = 1, origin = [0.5, 0.68];
    var raf = 0, playing = false, start = performance.now();

    /* where the sun sits on screen, through the same cover crop */
    function sunOnScreen() {
      var ca = canvas.width / canvas.height, ia = size[0][0] / size[0][1], x = 0.4906, y = 0.70;
      if (ca > ia) { y = (y - 0.5) / (ia / ca) + 0.5; } else { x = (x - 0.5) / (ca / ia) + 0.5; }
      return [x, y];
    }
    function progress(now) { return Math.min(1, Math.max(0, (now - t0) / DUR)); }
    function inOut(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
    function outCubic(x) { return 1 - Math.pow(1 - x, 3); }

    function draw(now) {
      var p = inOut(progress(now));
      g.viewport(0, 0, canvas.width, canvas.height);
      g.activeTexture(g.TEXTURE0); g.bindTexture(g.TEXTURE_2D, tex[a]); g.uniform1i(U.uA, 0);
      g.activeTexture(g.TEXTURE1); g.bindTexture(g.TEXTURE_2D, tex[b]); g.uniform1i(U.uB, 1);
      g.uniform2f(U.uRes, canvas.width, canvas.height);
      g.uniform2f(U.uSzA, size[a][0], size[a][1]);
      g.uniform2f(U.uSzB, size[b][0], size[b][1]);
      g.uniform2f(U.uOrigin, origin[0], origin[1]);
      g.uniform1f(U.uProg, p);
      g.uniform1f(U.uEase, outCubic(progress(now)));
      g.uniform1f(U.uTime, (now - start) / 1000);
      g.uniform1f(U.uSA, a); g.uniform1f(U.uSB, b);
      g.uniform1f(U.uMode, mode); g.uniform1f(U.uDir, dir);
      g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
    }
    function loop(now) {
      if (!playing) { raf = 0; return; }
      draw(now);
      raf = requestAnimationFrame(loop);
    }
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (w && h && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; }
      upgrade();
      draw(performance.now());
    }
    resize();

    return {
      resize: resize,
      play: function () { if (!playing) { playing = true; resize(); raf = requestAnimationFrame(loop); } },
      pause: function () { playing = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } },
      /* to scene i. A change arriving mid-burn starts from whichever scene
         is mostly showing, so nothing ever snaps back. */
      to: function (i) {
        var now = performance.now();
        var from = progress(now) < 0.5 ? a : b;
        if (t0 < 0 || from === i) { a = b = i; t0 = now - DUR; draw(now); return; }
        a = from; b = i; t0 = now;
        var lo = Math.min(a, b), hi = Math.max(a, b);
        dir = b > a ? 1 : -1;
        if (hi - lo !== 1) { mode = 0; origin = [0.5, 0.5]; }       /* a jump: burn out from the centre */
        else if (lo === 0) { mode = 0; origin = sunOnScreen(); }    /* out of the sun */
        else if (lo === 1) { mode = 1; }                            /* down the valley */
        else { mode = 2; }                                          /* left to right, into the ribbon */
        if (!playing) { draw(now); }
      }
    };
  }

  /* ---- pause anything that is off screen -----------------------------
     The SVG water is SMIL, so it pauses through the timeline API; the rest
     are CSS animations paused by dropping the .is-live class. */
  // var fx = document.querySelector('.fx-defs');   // only the ocean used it
  // var stages = document.querySelectorAll('.oceanwrap, .final, .planwrap, .bento');        // was: includes .oceanwrap, .planwrap
  var stages = document.querySelectorAll('.final, .bento');
  if (window.IntersectionObserver && stages.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle('is-live', e.isIntersecting);
        // if (fx && fx.pauseAnimations && e.target.classList.contains('oceanwrap')) {
        // try { e.isIntersecting ? fx.unpauseAnimations() : fx.pauseAnimations(); }
        // catch (err) { /* older engines: leave it running */ }
        // }
      });
    }, { rootMargin: '150px 0px' });
    [].forEach.call(stages, function (el) { io.observe(el); });
  }

  // DISABLED PRICING carousel — commented out on request, not deleted
  // /* ---- pricing: four plans, five seconds each, looping ----------------
     // Chained timeouts rather than setInterval, so pausing can bank the time
     // already served instead of restarting the hold. The bar animation is
     // paused in CSS at the same moment, which keeps the two in step. */
  // var planwrap = document.getElementById('planwrap');
  // if (planwrap) {
    // var plans = [].slice.call(planwrap.querySelectorAll('.plan'));
    // var bars  = [].slice.call(planwrap.querySelectorAll('.plan-nav button'));
    // var HOLD  = 5000;
    // var idx = 0, timer = null, startedAt = 0, remaining = HOLD;
    // var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
//
    // function paint() {
      // plans.forEach(function (p, i) {
        // p.classList.toggle('is-on', i === idx);
        // if (i === idx) { p.removeAttribute('aria-hidden'); }
        // else { p.setAttribute('aria-hidden', 'true'); }
      // });
      // bars.forEach(function (b, i) { b.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
    // }
    // function start() {
      // if (still) { return; }
      // startedAt = Date.now();
      // timer = setTimeout(function () { go(idx + 1); }, remaining);
    // }
    // function stop() {
      // if (timer) { clearTimeout(timer); timer = null; remaining -= Date.now() - startedAt; }
      // if (remaining < 250) { remaining = HOLD; }
    // }
    // function go(next) {
      // if (timer) { clearTimeout(timer); timer = null; }
      // idx = (next + plans.length) % plans.length;   /* wraps -> loops forever */
      // remaining = HOLD;
      // paint();
      // start();
    // }
//
    // bars.forEach(function (b, i) {
      // b.addEventListener('click', function () { go(i); });
    // });
    // planwrap.addEventListener('pointerenter', function () { stop(); planwrap.classList.add('is-held'); });
    // planwrap.addEventListener('pointerleave', function () { planwrap.classList.remove('is-held'); start(); });
    // planwrap.addEventListener('focusin',  function () { stop(); planwrap.classList.add('is-held'); });
    // planwrap.addEventListener('focusout', function () { planwrap.classList.remove('is-held'); start(); });
    // document.addEventListener('visibilitychange', function () {
      // if (document.hidden) { stop(); planwrap.classList.add('is-held'); }
      // else { planwrap.classList.remove('is-held'); start(); }
    // });
//
    // paint();
    // start();
//
    // /* the annual switch is one decision, so every slide reflects it */
    // var annual = false;
    // planwrap.addEventListener('click', function (e) {
      // if (!e.target.closest('[data-annual]')) { return; }
      // annual = !annual;
      // planwrap.querySelectorAll('[data-annual]').forEach(function (t) {
        // t.setAttribute('aria-pressed', annual ? 'true' : 'false');
      // });
      // planwrap.querySelectorAll('.plan-amt b[data-m]').forEach(function (el) {
        // el.textContent = annual ? el.getAttribute('data-y') : el.getAttribute('data-m');
        // var small = el.nextElementSibling;
        // if (small) { small.textContent = annual ? '/month, billed yearly' : '/month'; }
      // });
    // });
  // }

  /* ---- Connect with Marten ------------------------------------------- */
  var overlay = document.getElementById('connect');
  if (!overlay) { return; }
  var steps = overlay.querySelectorAll('.cstep');
  var back  = overlay.querySelector('.cback');
  var opener = null;

  function show(name) {
    clearIntro();
    for (var i = 0; i < steps.length; i++) {
      steps[i].classList.toggle('on', steps[i].getAttribute('data-step') === name);
    }
    back.classList.toggle('on', name !== 'menu' && name !== 'intro');
    var live = overlay.querySelector('.cstep.on');
    var f = live && live.querySelector('input, select, button');
    if (f) { setTimeout(function () { f.focus(); }, 340); }
  }
  var introTimer = null;
  function clearIntro() { if (introTimer) { clearTimeout(introTimer); introTimer = null; } }

  function open(name) {
    opener = document.activeElement;
    overlay.hidden = false;
    /* Force a style flush so the transition has a start state to run from.
       requestAnimationFrame is not safe here: if it is throttled (background
       tab, reduced frame rate) the class never lands and the dialog stays
       invisible while still trapping scroll. */
    void overlay.offsetWidth;
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    name = name || 'intro';
    show(name);
    /* MARA introduces itself, then hands over on its own. Any click or key
       press takes over, so nobody is made to wait for it. */
    clearIntro();
    if (name === 'intro') {
      introTimer = setTimeout(function () { show('menu'); }, 7600);
      /* hovering the intro cancels the hand-off: the reader is engaged, so let
         them finish and press Continue themselves */
      var intro = overlay.querySelector('.cstep[data-step="intro"]');
      if (intro) { intro.addEventListener('mouseenter', clearIntro, { once: true }); }
    }
  }
  function close() {
    clearIntro();
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { overlay.hidden = true; }, 440);
    if (opener && opener.focus) { opener.focus(); }
  }

  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-connect]');
    if (o) { e.preventDefault(); open(o.getAttribute('data-connect')); return; }
    var g = e.target.closest('[data-goto]');
    if (g && overlay.contains(g)) { show(g.getAttribute('data-goto')); return; }
    if (e.target.closest('[data-cclose]') || e.target === overlay) { close(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) { close(); }
  });

  overlay.addEventListener('submit', function (e) {
    e.preventDefault();
    show('done');
  });
})();
