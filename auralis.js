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

  // DISABLED CARD FAN interaction — commented out on request, not deleted
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
     Six steps executed one after another, the way the agents actually run
     them: queued, running, done. A step holds for its own data-dur, so the
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

    if (steps.length && !calm) {
      var GAP = 150;                 /* handover between two steps */
      var REST = 1500;               /* beat on 'complete' before going again */
      var WIPE = 560;                /* the log clearing back down to queued */
      var at = 0;                    /* index of the step in flight */
      var phase = 'run';             /* run | gap | rest | wipe */
      var tid = null, began = 0, left = 0;

      function label(t) { if (word) { word.textContent = t; } }
      function tally(n) {
        if (count) { count.textContent = String(n); }
        if (fill) { fill.style.transform = 'scaleX(' + (n / steps.length).toFixed(4) + ')'; }
      }

      /* rows back to queued and the readout back to zero, without touching
         the timer — the cycle uses this, and so does a full reset */
      function rewind() {
        steps.forEach(function (li) {
          li.classList.remove('is-running', 'is-done');
          li.style.removeProperty('--dur');
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
         reliable than waiting on rAF — a throttled frame would otherwise
         leave the bar sitting at zero for the whole step. */
      function enter(i) {
        var li = steps[i];
        label('Running');
        li.classList.remove('is-done');
        li.style.setProperty('--dur', (li.getAttribute('data-dur') || 900) + 'ms');
        void li.offsetWidth;
        li.classList.add('is-running');
      }

      function settle(i) {
        var li = steps[i];
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

      /* run -> gap -> run ... -> rest (all six done) -> wipe -> run again.
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
             sweep down the list rather than six lights going out at once */
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
        if (!tid) { return; }
        clearTimeout(tid);
        tid = null;
        left -= Date.now() - began;
        if (left < 60) { left = 60; }
      }

      /* The list is watched, not the section. The section is taller than most
         viewports, so its top edge appears long before the steps do — starting
         there would burn half the run off screen.

         The test is visible pixels, not a ratio: a ratio compares the list to
         itself, so the same fraction means two rows on a laptop and half a row
         on a phone. ~160px is about two rows on any screen. */
      var SHOWN = 160;
      var runIO = new IntersectionObserver(function (entries) {
        var e = entries[0];
        if (e.intersectionRect.height >= Math.min(SHOWN, e.boundingClientRect.height)) {
          /* 'rest' is the beat on Run complete — leaving it un-lit is the point */
          if (phase !== 'rest') { slept.classList.add('run-active'); }
          if (!tid) {
            if (at === 0 && phase === 'run' && !left) { enter(0); left = hold(); }
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

  /* ---- frame: the ascent ---------------------------------------------
     Two things, both one-shot or pausable.

     The light on the road is SMIL, so it pauses through the timeline API the
     same way the water does — a 13s loop is not worth running behind the
     viewport. The figures count up once, the first time the frame is seen,
     and never again: a number that re-counts every time you scroll past
     stops reading as a result and starts reading as a toy. */
  (function ascent() {
  var gal = document.querySelector('.gal');
  if (!gal || !window.IntersectionObserver) { return; }

  var run  = gal.querySelector('.gal-run');
  var figs = [].slice.call(gal.querySelectorAll('.figures b'));
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* "$148M+" -> prefix "$", 148, suffix "M+" — so the shape of the label is
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
