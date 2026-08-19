/* Twinkling star field — pure vanilla JS, no dependencies */
(function () {
  var canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var W, H, stars = [], raf;

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
    var count = Math.min(350, Math.floor((W * H) / 4500));

    for (var i = 0; i < count; i++) {
      var tinted = Math.random() > 0.65;
      var hueVal = 32;
      var randHue = Math.random();
      if (randHue < 0.35) {
        hueVal = 32;   // warm peach gold
      } else if (randHue < 0.70) {
        hueVal = 255;  // periwinkle lavender
      } else {
        hueVal = 345;  // blush rose
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
