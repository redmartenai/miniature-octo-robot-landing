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
var ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]', '', 'miniature-octo-robot-landing.vercel.app'];
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

  /* ---- frame 1: pointer spotlight ------------------------------------
     The pointer position is written into --mx/--my. The night-graded photo
     is the base layer; .shine is the untouched photo, revealed through a
     radial mask centred on those coordinates. */
  var hero = document.querySelector('.hero');
  if (hero) {
    var queued = false, px = 50, py = 44;
    function paint() {
      queued = false;
      hero.style.setProperty('--mx', px.toFixed(2) + '%');
      hero.style.setProperty('--my', py.toFixed(2) + '%');
    }
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width) * 100;
      py = ((e.clientY - r.top) / r.height) * 100;
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    }, { passive: true });
    hero.addEventListener('pointerleave', function () {
      px = 50; py = 44;
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    });
  }

  // DISABLED CARD FAN interaction: commented out on request, not deleted
  // /* ---- frame 3: the card fan -----------------------------------------
     // Clicking a card makes it active: siblings step outwards, shrink and
     // fade, and the active card opens its numbered steps. */
  // var fan = document.getElementById('fan');
  // if (fan) {
    // var cards = [].slice.call(fan.querySelectorAll('.fcard'));
    // var active = 2;
//
    // function layout() {
      // var step = cards[0].getBoundingClientRect().width * 0.82;
      // if (!step) { step = 220; }
      // cards.forEach(function (c, i) {
        // var off = i - active, d = Math.abs(off);
        // c.style.setProperty('--x', (off * step).toFixed(1) + 'px');
        // c.style.setProperty('--s', (1 - d * 0.075).toFixed(3));
        // c.style.setProperty('--o', (1 - d * 0.17).toFixed(2));
        // c.style.setProperty('--z', String(10 - d));
        // c.classList.toggle('is-active', i === active);
        // c.setAttribute('aria-expanded', i === active ? 'true' : 'false');
      // });
    // }
    // cards.forEach(function (c, i) {
      // c.addEventListener('click', function () {
        // active = i;
        // layout();
        // /* The water filter is per-pixel CPU work. Hold it still for the length
           // of the card transition so the two are not competing for the frame. */
        // var svg = document.querySelector('.fx-defs');
        // if (svg && svg.pauseAnimations) {
          // try {
            // svg.pauseAnimations();
            // clearTimeout(c._fxTimer);
            // c._fxTimer = setTimeout(function () {
              // try { svg.unpauseAnimations(); } catch (e) {}
            // }, 620);
          // } catch (e) {}
        // }
      // });
    // });
    // layout();
    // addEventListener('resize', layout);
  // }

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

  /* ---- frame: the overnight run --------------------------------------
     One step per service, executed one after another, the way the agents
     actually run them: queued, running, done. A step holds for its own
     data-dur, so the
     cadence is uneven and reads as work rather than as a metronome.

     Chained timeouts, and the clock is banked on the way out, so scrolling
     away mid-step resumes that step where it stopped instead of restarting
     it. Nothing here writes a layout property: the sweep is a scaleX, the
     states are opacity, the check is a stroke offset. */
  (function nightRun() {
  var slept = document.getElementById('slept');
  if (slept && window.IntersectionObserver) {
    var list  = slept.querySelector('.nightline');
    var steps = [].slice.call(slept.querySelectorAll('.nightline li'));
    var fill  = slept.querySelector('.nrun-fill');
    var word  = slept.querySelector('.nrun-word');
    var count = slept.querySelector('.nrun-n');
    var calm  = matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Each step is a handful of jobs, not one action. The row's data-sub
       carries them; while the row runs they cycle underneath the label so the
       log reads as five channels doing a lot rather than five lines ticking. */
    var pools = steps.map(function (li) {
      return (li.getAttribute('data-sub') || '').split('|').filter(Boolean);
    });
    var subs = steps.map(function (li) { return li.querySelector('.nsub-t'); });

    if (steps.length && calm) {
      /* no motion: show the first job of each step and leave it there */
      subs.forEach(function (el, i) {
        if (el && pools[i][0]) { el.textContent = pools[i][0]; }
      });
    }

    if (steps.length && !calm) {
      var GAP = 150;                 /* handover between two steps */
      var REST = 1500;               /* beat on 'complete' before going again */
      var WIPE = 560;                /* the log clearing back down to queued */
      var at = 0;                    /* index of the step in flight */
      var phase = 'run';             /* run | gap | rest | wipe */
      var tid = null, began = 0, left = 0;
      var subTid = null, swapTid = null;

      /* A swap is out-and-back on one node rather than two crossfading nodes:
         one element, two transitions, no second line to lay out. */
      function subStop() {
        if (subTid) { clearInterval(subTid); subTid = null; }
        if (swapTid) { clearTimeout(swapTid); swapTid = null; }
      }
      function subShow(i, k) {
        var el = subs[i];
        if (!el || !pools[i][k]) { return; }
        var box = el.parentNode;
        box.classList.add('is-swap');
        swapTid = setTimeout(function () {
          el.textContent = pools[i][k];
          box.classList.remove('is-swap');
        }, 190);
      }
      /* how many jobs a step can show: as many as fit at a readable pace,
         so a short step shows two and a long one shows four */
      function subRun(i) {
        subStop();
        var el = subs[i], pool = pools[i];
        if (!el || !pool.length) { return; }
        var dur = parseInt(steps[i].getAttribute('data-dur'), 10) || 900;
        var n = pool.length;
        while (n > 1 && dur / n < 470) { n -= 1; }
        el.textContent = pool[0];
        if (n < 2) { return; }
        var k = 0;
        subTid = setInterval(function () {
          k += 1;
          if (k >= n) { subStop(); return; }
          subShow(i, k);
        }, Math.round(dur / n));
      }

      function label(t) { if (word) { word.textContent = t; } }
      function tally(n) {
        if (count) { count.textContent = String(n); }
        if (fill) { fill.style.transform = 'scaleX(' + (n / steps.length).toFixed(4) + ')'; }
      }

      /* rows back to queued and the readout back to zero, without touching
         the timer: the cycle uses this, and so does a full reset */
      function rewind() {
        subStop();
        steps.forEach(function (li, i) {
          li.classList.remove('is-running', 'is-done');
          li.style.removeProperty('--dur');
          var box = li.querySelector('.nsub');
          if (box) { box.classList.remove('is-swap'); }
          if (subs[i]) { subs[i].textContent = ''; }
        });
        tally(0);
      }

      function reset() {
        clear();
        at = 0; phase = 'run'; left = 0;
        slept.classList.remove('run-active', 'run-done');
        list.classList.remove('is-wiping');
        rewind();
        label('Queued');
      }

      /* A step's sweep is a transition, so it has to be started on a frame
         where the element is already in its from-state. Reading offsetWidth
         between the two writes forces that, which is cheaper and far more
         reliable than waiting on rAF: a throttled frame would otherwise
         leave the bar sitting at zero for the whole step. */
      function enter(i) {
        var li = steps[i];
        label('Running');
        li.classList.remove('is-done');
        li.style.setProperty('--dur', (li.getAttribute('data-dur') || 900) + 'ms');
        void li.offsetWidth;
        li.classList.add('is-running');
        subRun(i);
      }

      function settle(i) {
        var li = steps[i];
        subStop();
        li.classList.remove('is-running');
        li.classList.add('is-done');
        tally(i + 1);
      }

      function hold() {
        if (phase === 'gap')  { return GAP; }
        if (phase === 'rest') { return REST; }
        if (phase === 'wipe') { return WIPE; }
        return parseInt(steps[at].getAttribute('data-dur'), 10) || 900;
      }

      /* run -> gap -> run ... -> rest (all of them done) -> wipe -> run again.
         The loop never ends while the list is on screen: the agents do not
         stop overnight, so neither does the log. */
      function tick() {
        if (phase === 'run') {
          settle(at);
          at += 1;
          if (at >= steps.length) {
            slept.classList.remove('run-active');
            slept.classList.add('run-done', 'run-seen');
            label('Run complete');
            phase = 'rest';
          } else {
            phase = 'gap';
          }
        } else if (phase === 'gap') {
          phase = 'run';
          enter(at);
        } else if (phase === 'rest') {
          /* clear the log: is-wiping staggers the rows so it reads as a
             sweep down the list rather than every light going out at once */
          list.classList.add('is-wiping');
          rewind();
          slept.classList.remove('run-done');
          slept.classList.add('run-active');
          label('Running');
          phase = 'wipe';
        } else {
          list.classList.remove('is-wiping');
          at = 0;
          phase = 'run';
          enter(0);
        }
        left = hold();
        start();
      }

      function start() {
        if (!left) { left = hold(); }
        began = Date.now();
        tid = setTimeout(tick, left);
      }

      function clear() {
        subStop();
        if (!tid) { return; }
        clearTimeout(tid);
        tid = null;
        left -= Date.now() - began;
        if (left < 60) { left = 60; }
      }

      /* The list is watched, not the section. The section is taller than most
         viewports, so its top edge appears long before the steps do, starting
         there would burn half the run off screen.

         The test is visible pixels, not a ratio: a ratio compares the list to
         itself, so the same fraction means two rows on a laptop and half a row
         on a phone. ~160px is about two rows on any screen. */
      var SHOWN = 160;
      var runIO = new IntersectionObserver(function (entries) {
        var e = entries[0];
        if (e.intersectionRect.height >= Math.min(SHOWN, e.boundingClientRect.height)) {
          /* 'rest' is the beat on Run complete: leaving it un-lit is the point */
          if (phase !== 'rest') { slept.classList.add('run-active'); }
          if (!tid) {
            if (at === 0 && phase === 'run' && !left) { enter(0); left = hold(); }
            else if (phase === 'run' && subs[at] && !subs[at].textContent) { subRun(at); }
            start();
          }
        } else {
          clear();
          slept.classList.remove('run-active');   /* stops both pulses offscreen */
          /* scrolled clean past: rewind, so the next visit picks the log up
             from the top rather than mid-cycle */
          if (e.intersectionRatio === 0) { reset(); }
        }
      }, { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] });

      slept.classList.add('run-ready');
      reset();
      runIO.observe(list);
    }
  }
  })();

  /* ---- frame: the work under the log ---------------------------------
     The five rows above are the headline. Underneath them the agents keep a
     long tail of jobs running that nobody reads in the morning, and this is
     that tail: four slots, each swapping on its own clock out of step with
     the others and with the run above, plus two counters that never sit
    still. It does not stop on 'Run complete': that is the point of it.

     Its own observer, so it pauses when it leaves the viewport rather than
     spinning four rings and two intervals behind the fold. */
  (function bgWork() {
  var slept = document.getElementById('slept');
  var bg = slept && slept.querySelector('.nbg');
  if (!bg || !window.IntersectionObserver) { return; }

  var JOBS = [
    'Warming 6 sending domains',
    'Validating 208 email addresses',
    'Checking bounce rate \u00b7 0.4%',
    'A/B testing 6 subject lines',
    'Rotating the sending inboxes',
    'Refreshing OAuth token \u00b7 LinkedIn',
    'Watching daily invite limits \u00b7 4 seats',
    'Reading 41 new LinkedIn replies',
    'Checking WhatsApp template approvals',
    'Verifying 96 numbers for WhatsApp',
    'Answering 18 inbound WhatsApp threads',
    'Reading engagement on last week\u2019s posts',
    'Resizing 18 creatives per placement',
    'Scraping 12 competitor ad sets',
    'Rebuilding the retargeting audience',
    'Re-scoring 612 leads on fit',
    'Enriching 340 records \u00b7 Apollo',
    'De-duplicating 1,284 contacts',
    'Writing every reply back to the CRM',
    'Queueing 9 posts for your sign-off'
  ];

  var slots = [].slice.call(bg.querySelectorAll('.nbg-list li'));
  var live  = bg.querySelector('.nbg-live');
  var ops   = bg.querySelector('.nbg-ops');
  var calm  = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!slots.length) { return; }

  /* deal the pool out so no two slots ever hold the same job */
  var next = 0;
  var order = JOBS.slice();
  for (var i = order.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1)), t = order[i];
    order[i] = order[j]; order[j] = t;
  }
  function take() { var v = order[next % order.length]; next += 1; return v; }
  function paint(li, text) { li.querySelector('.nbg-t').textContent = text; }

  slots.forEach(function (li) { paint(li, take()); });

  if (calm) { return; }   /* dealt once, then left alone */

  /* one live handle per slot, plus one for the counters: the chain re-arms
     itself, so nothing here accumulates over a long visit */
  var cyc = [], swp = [], cnt = null;
  var opsN = 2417, liveN = 18;

  function swap(li, k) {
    li.classList.add('is-swap');
    swp[k] = setTimeout(function () {
      swp[k] = null;
      paint(li, take());
      li.classList.remove('is-swap');
    }, 240);
  }
  /* a fresh timeout per cycle rather than one setInterval: the gap is
     re-rolled every time, so the four slots drift apart instead of locking
     into a rhythm the eye can predict */
  function cycle(li, k, wait) {
    cyc[k] = setTimeout(function () {
      swap(li, k);
      cycle(li, k, 1900 + Math.random() * 2100);
    }, wait);
  }

  function counters() {
    cnt = setTimeout(function () {
      opsN += 1 + Math.floor(Math.random() * 4);
      if (ops) { ops.textContent = opsN.toLocaleString('en-US'); }
      if (Math.random() < 0.22) {
        liveN += Math.random() < 0.5 ? -1 : 1;
        if (liveN < 15) { liveN = 15; }
        if (liveN > 22) { liveN = 22; }
        if (live) { live.textContent = String(liveN); }
      }
      counters();
    }, 700 + Math.random() * 900);
  }

  var on = false;
  function play() {
    if (on) { return; }
    on = true;
    slept.classList.add('bg-active');
    slots.forEach(function (li, k) { cycle(li, k, 700 + k * 520 + Math.random() * 600); });
    counters();
  }
  function pause() {
    if (!on) { return; }
    on = false;
    slept.classList.remove('bg-active');
    clearTimeout(cnt); cnt = null;
    slots.forEach(function (li, k) {
      clearTimeout(cyc[k]); cyc[k] = null;
      clearTimeout(swp[k]); swp[k] = null;
      li.classList.remove('is-swap');
    });
  }

  new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { play(); } else { pause(); }
  }, { threshold: 0.15 }).observe(bg);
  })();

  /* ---- frame: the ascent ---------------------------------------------
     Two things, both one-shot or pausable.

     The light on the road is SMIL, so it pauses through the timeline API the
    same way the water does: a 13s loop is not worth running behind the
     viewport. The figures count up once, the first time the frame is seen,
     and never again: a number that re-counts every time you scroll past
     stops reading as a result and starts reading as a toy. */
  (function ascent() {
  var gal = document.querySelector('.gal');
  if (!gal || !window.IntersectionObserver) { return; }

  var run  = gal.querySelector('.gal-run');
  var figs = [].slice.call(gal.querySelectorAll('.figures b'));
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* "$148M+" -> prefix "$", 148, suffix "M+": so the shape of the label is
     preserved exactly and only the digits move */
  var counters = calm ? [] : figs.map(function (el) {
    var m = /^(\D*)([\d.]+)(.*)$/.exec(el.textContent.trim());
    if (!m) { return null; }
    var dot = m[2].indexOf('.');
    return { el: el, pre: m[1], to: parseFloat(m[2]), post: m[3],
             dp: dot < 0 ? 0 : m[2].length - dot - 1, done: el.textContent };
  }).filter(Boolean);

  var counted = false;
  function countUp() {
    if (counted || !counters.length) { return; }
    counted = true;
    var DUR = 1500, t0 = 0;
    function frame(now) {
      if (!t0) { t0 = now; }
      var p = Math.min(1, (now - t0) / DUR);
      var e = 1 - Math.pow(1 - p, 3);          /* ease out, lands softly */
      counters.forEach(function (c) {
        c.el.textContent = p < 1
          ? c.pre + (c.to * e).toFixed(c.dp) + c.post
          : c.done;                            /* the last frame is the real string */
      });
      if (p < 1) { requestAnimationFrame(frame); }
    }
    requestAnimationFrame(frame);
    /* rAF can be throttled to nothing in a background tab; make sure the
       figures are never left frozen part-way to their value */
    setTimeout(function () {
      counters.forEach(function (c) { c.el.textContent = c.done; });
    }, DUR + 400);
  }

  new IntersectionObserver(function (entries) {
    var e = entries[0];
    if (run && run.pauseAnimations) {
      try { e.isIntersecting ? run.unpauseAnimations() : run.pauseAnimations(); }
      catch (err) { /* older engines: leave the light running */ }
    }
    if (e.isIntersecting) { countUp(); }
  }, { threshold: [0, 0.2], rootMargin: '80px 0px' }).observe(gal);
  })();

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

  // DISABLED PRICING carousel: commented out on request, not deleted
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
    if (name === 'intro' && !(opener && opener.hasAttribute('data-manual-intro'))) {
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
    if (e.target.hasAttribute('data-demo-form')) {
      window.location.assign('https://calendly.com/gayathriaddepalli0/new-meeting?month=2026-09');
      return;
    }
    show('done');
  });
})();

(function agentCarousel() {
  'use strict';
  var track = document.querySelector('.agent-grid');
  if (!track) { return; }
  var cards = Array.prototype.slice.call(track.querySelectorAll('.agent-card'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.agent-dots button'));
  var active = 0, timer = null, paused = false;
  function render(index) {
    active = (index + cards.length) % cards.length;
    cards.forEach(function (card, i) { card.classList.toggle('is-active', i === active); });
    dots.forEach(function (dot, i) { dot.setAttribute('aria-selected', i === active ? 'true' : 'false'); });
    var step = cards[0].getBoundingClientRect().width + 12;
    track.style.setProperty('--agent-shift', (track.parentElement.clientWidth / 2 - cards[0].getBoundingClientRect().width / 2 - active * step) + 'px');
  }
  function start() {
    clearInterval(timer);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(function () { if (!paused) { render(active + 1); } }, 4200);
    }
  }
  dots.forEach(function (dot, i) { dot.addEventListener('click', function () { render(i); start(); }); });
  track.addEventListener('mouseenter', function () { paused = true; });
  track.addEventListener('mouseleave', function () { paused = false; });
  track.addEventListener('focusin', function () { paused = true; });
  track.addEventListener('focusout', function () { paused = false; });
  addEventListener('resize', function () { render(active); });
  render(0);
  start();
})();
