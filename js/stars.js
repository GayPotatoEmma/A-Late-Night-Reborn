/* Whimsical Canvas Background - Night-time Stars & Daytime Clouds / Sun Motes */
(function () {
  var canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var W, H, stars = [], dayMotes = [], clouds = [], raf;
  var shootingStar = null;
  var nextShootingStarTime = Date.now() + Math.random() * 4000 + 3000;

  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var isReducedMotion = reducedMotionQuery.matches;

  if (reducedMotionQuery.addEventListener) {
    reducedMotionQuery.addEventListener('change', function (e) {
      isReducedMotion = e.matches;
      if (isReducedMotion) {
        cancelAnimationFrame(raf);
        shootingStar = null;
        drawStaticFrame();
      } else {
        cancelAnimationFrame(raf);
        draw();
      }
    });
  }

  function init() {
    var dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    ctx.scale(dpr, dpr);

    // 1. Night Stars Initialization
    stars = [];
    shootingStar = null;
    var count = Math.min(350, Math.floor((W * H) / 4500));

    for (var i = 0; i < count; i++) {
      var tinted = Math.random() > 0.65;
      var hueVal = 35;
      var randHue = Math.random();
      if (randHue < 0.35) {
        hueVal = 35;   // warm star gold (#e4c090)
      } else if (randHue < 0.70) {
        hueVal = 272;  // periwinkle purple (#a078c0)
      } else {
        hueVal = 355;  // pastel peach rose (#fcd4c8)
      }

      stars.push({
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    Math.random() * 1.6 + 0.4,
        a:    Math.random() * 0.75 + 0.15,
        da:   (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        dy:   -(Math.random() * 0.15 + 0.04),
        dx:   (Math.random() - 0.5) * 0.08,
        hue:  tinted ? hueVal : -1
      });
    }

    // 2. Daytime Sun Motes & Drifting Pastel Clouds Initialization
    dayMotes = [];
    var moteCount = Math.min(65, Math.floor((W * H) / 15000));
    for (var j = 0; j < moteCount; j++) {
      dayMotes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2.5 + 0.8,
        a: Math.random() * 0.55 + 0.15,
        da: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        dx: (Math.random() - 0.5) * 0.12,
        dy: -(Math.random() * 0.22 + 0.06),
        color: Math.random() > 0.45 ? 'rgba(228, 192, 144, ' : 'rgba(252, 212, 200, '
      });
    }

    clouds = [];
    var cloudCount = 5;
    for (var k = 0; k < cloudCount; k++) {
      clouds.push({
        x: Math.random() * (W + 400) - 200,
        y: Math.random() * (H * 0.42) + 30,
        scale: Math.random() * 0.45 + 0.7,
        speed: Math.random() * 0.18 + 0.08,
        color: k % 2 === 0 ? 'rgba(252, 212, 200, 0.20)' : 'rgba(196, 175, 230, 0.18)'
      });
    }
  }

  function spawnShootingStar() {
    if (isReducedMotion) return;
    var startX = Math.random() * (W * 0.6) + (W * 0.1);
    var startY = Math.random() * (H * 0.35);
    var angle = (Math.random() * 20 + 25) * (Math.PI / 180);
    var speed = Math.random() * 8 + 11;
    var len = Math.random() * 70 + 75;
    var lifeMax = Math.random() * 35 + 40;

    var isGold = Math.random() > 0.4;
    var headColor = isGold ? 'rgba(252, 224, 180, ' : 'rgba(252, 212, 200, ';

    shootingStar = {
      x: startX,
      y: startY,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      len: len,
      life: 0,
      lifeMax: lifeMax,
      headColor: headColor
    };
  }

  function updateAndDrawShootingStar() {
    if (isReducedMotion) return;
    var now = Date.now();
    if (!shootingStar && now > nextShootingStarTime) {
      spawnShootingStar();
      nextShootingStarTime = now + Math.random() * 10000 + 8000;
    }

    if (!shootingStar) return;

    shootingStar.life += 1.5;
    shootingStar.x += shootingStar.dx * 1.5;
    shootingStar.y += shootingStar.dy * 1.5;

    var progress = shootingStar.life / shootingStar.lifeMax;
    var alpha = 1;
    if (progress < 0.22) {
      alpha = progress / 0.22;
    } else if (progress > 0.68) {
      alpha = (1 - progress) / 0.32;
    }

    if (shootingStar.life >= shootingStar.lifeMax || shootingStar.x > W + 100 || shootingStar.y > H + 100) {
      shootingStar = null;
      return;
    }

    var speedMag = Math.hypot(shootingStar.dx, shootingStar.dy);
    var tailX = shootingStar.x - (shootingStar.dx / speedMag) * shootingStar.len;
    var tailY = shootingStar.y - (shootingStar.dy / speedMag) * shootingStar.len;

    var grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
    grad.addColorStop(0, shootingStar.headColor + (alpha * 0.95).toFixed(3) + ')');
    grad.addColorStop(0.35, shootingStar.headColor + (alpha * 0.35).toFixed(3) + ')');
    grad.addColorStop(1, shootingStar.headColor + '0)');

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(shootingStar.x, shootingStar.y);
    ctx.lineTo(tailX, tailY);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(shootingStar.x, shootingStar.y, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = shootingStar.headColor + alpha.toFixed(3) + ')';
    ctx.shadowColor = 'rgba(252, 212, 200, 0.85)';
    ctx.shadowBlur = 9;
    ctx.fill();
    ctx.restore();
  }

  function drawCloud(c) {
    ctx.save();
    ctx.fillStyle = c.color;
    ctx.beginPath();
    var x = c.x, y = c.y, s = c.scale;
    ctx.arc(x, y, 38 * s, 0, Math.PI * 2);
    ctx.arc(x + 28 * s, y - 20 * s, 30 * s, 0, Math.PI * 2);
    ctx.arc(x + 60 * s, y - 14 * s, 34 * s, 0, Math.PI * 2);
    ctx.arc(x + 90 * s, y, 35 * s, 0, Math.PI * 2);
    ctx.arc(x + 45 * s, y + 12 * s, 38 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawLightMode() {
    // 1. Clouds
    for (var k = 0; k < clouds.length; k++) {
      var c = clouds[k];
      drawCloud(c);
      if (!isReducedMotion) {
        c.x += c.speed;
        if (c.x > W + 220) {
          c.x = -220;
          c.y = Math.random() * (H * 0.42) + 30;
        }
      }
    }

    // 2. Sun Motes
    for (var j = 0; j < dayMotes.length; j++) {
      var m = dayMotes[j];
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
      ctx.fillStyle = m.color + m.a.toFixed(3) + ')';
      ctx.shadowColor = 'rgba(252, 212, 200, 0.45)';
      ctx.shadowBlur = 7;
      ctx.fill();

      if (!isReducedMotion) {
        m.a += m.da;
        if (m.a > 0.72) { m.a = 0.72; m.da = -Math.abs(m.da); }
        if (m.a < 0.12) { m.a = 0.12; m.da =  Math.abs(m.da); }

        m.x += m.dx;
        m.y += m.dy;
        if (m.y < -10) { m.y = H + 10; m.x = Math.random() * W; }
        if (m.x < -10) { m.x = W + 10; }
        if (m.x > W + 10) { m.x = -10; }
      }
    }
  }

  function drawDarkMode() {
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.hue >= 0
        ? 'hsla(' + s.hue + ', 80%, 84%, ' + s.a.toFixed(3) + ')'
        : 'rgba(255, 255, 255, ' + s.a.toFixed(3) + ')';
      ctx.fill();

      if (!isReducedMotion) {
        s.a += s.da;
        if (s.a > 0.95) { s.a = 0.95; s.da = -Math.abs(s.da); }
        if (s.a < 0.12) { s.a = 0.12; s.da =  Math.abs(s.da); }

        s.x += s.dx;
        s.y += s.dy;
        if (s.y < -5) { s.y = H + 5; s.x = Math.random() * W; }
        if (s.x < -5) { s.x = W + 5; }
        if (s.x > W + 5) { s.x = -5; }
      }
    }

    if (!isReducedMotion) {
      updateAndDrawShootingStar();
    }
  }

  function isLiteTheme() {
    var theme = document.documentElement.getAttribute('data-theme') || 'dark';
    return theme.indexOf('lite') !== -1;
  }

  function drawStaticFrame() {
    ctx.clearRect(0, 0, W, H);
    if (isLiteTheme()) return;
    var theme = document.documentElement.getAttribute('data-theme') || 'dark';
    var isLight = theme.indexOf('light') === 0;
    if (isLight) {
      drawLightMode();
    } else {
      drawDarkMode();
    }
  }

  var TARGET_FPS = 30;
  var FRAME_INTERVAL = 1000 / TARGET_FPS;
  var lastFrameTime = 0;

  function draw(timestamp) {
    if (isReducedMotion || isLiteTheme()) {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, W, H);
      return;
    }

    raf = requestAnimationFrame(draw);

    var now = timestamp || performance.now();
    var elapsed = now - lastFrameTime;

    if (elapsed >= FRAME_INTERVAL) {
      lastFrameTime = elapsed > 1000 ? now : now - (elapsed % FRAME_INTERVAL);
      drawStaticFrame();
    }
  }

  init();
  draw();

  window.addEventListener('resize', function () {
    cancelAnimationFrame(raf);
    init();
    lastFrameTime = performance.now();
    draw();
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else if (!isReducedMotion && !isLiteTheme()) {
      cancelAnimationFrame(raf);
      lastFrameTime = performance.now();
      draw();
    }
  });

  if (window.MutationObserver) {
    var themeObserver = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === 'data-theme') {
          cancelAnimationFrame(raf);
          if (isLiteTheme()) {
            ctx.clearRect(0, 0, W, H);
          } else if (isReducedMotion) {
            shootingStar = null;
            drawStaticFrame();
          } else {
            lastFrameTime = performance.now();
            draw();
          }
        }
      });
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
})();
