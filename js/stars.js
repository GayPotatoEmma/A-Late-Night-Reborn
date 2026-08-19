/* Twinkling star field with infrequent shooting star — pure vanilla JS */
(function () {
  var canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var W, H, stars = [], raf;
  var shootingStar = null;
  var nextShootingStarTime = Date.now() + Math.random() * 4000 + 3000;

  function init() {
    var dpr = window.devicePixelRatio || 1;
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';

    ctx.scale(dpr, dpr);

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
        dy:   -(Math.random() * 0.15 + 0.04), // gentle upward float
        dx:   (Math.random() - 0.5) * 0.08,
        hue:  tinted ? hueVal : -1
      });
    }
  }

  function spawnShootingStar() {
    var startX = Math.random() * (W * 0.6) + (W * 0.1);
    var startY = Math.random() * (H * 0.35);
    var angle = (Math.random() * 20 + 25) * (Math.PI / 180); // 25-45 deg slope
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
    var now = Date.now();
    if (!shootingStar && now > nextShootingStarTime) {
      spawnShootingStar();
      nextShootingStarTime = now + Math.random() * 10000 + 8000; // Spawns every 8 to 18 sec
    }

    if (!shootingStar) return;

    shootingStar.life++;
    shootingStar.x += shootingStar.dx;
    shootingStar.y += shootingStar.dy;

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

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.hue >= 0
        ? 'hsla(' + s.hue + ', 80%, 84%, ' + s.a.toFixed(3) + ')'
        : 'rgba(255, 255, 255, ' + s.a.toFixed(3) + ')';
      ctx.fill();

      s.a += s.da;
      if (s.a > 0.95) { s.a = 0.95; s.da = -Math.abs(s.da); }
      if (s.a < 0.12) { s.a = 0.12; s.da =  Math.abs(s.da); }

      s.x += s.dx;
      s.y += s.dy;
      if (s.y < -5) { s.y = H + 5; s.x = Math.random() * W; }
      if (s.x < -5) { s.x = W + 5; }
      if (s.x > W + 5) { s.x = -5; }
    }

    updateAndDrawShootingStar();

    raf = requestAnimationFrame(draw);
  }

  init();
  draw();

  window.addEventListener('resize', function () {
    cancelAnimationFrame(raf);
    init();
    draw();
  });
})();
