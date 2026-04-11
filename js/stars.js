/* Twinkling star field — pure vanilla JS, no dependencies */
(function () {
  var canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var W, H, stars = [], raf;

  function init() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = [];

    var count = Math.min(320, Math.floor((W * H) / 5800));

    for (var i = 0; i < count; i++) {
      var tinted = Math.random() > 0.88;
      stars.push({
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    Math.random() * 1.2 + 0.15,
        a:    Math.random(),
        da:   (Math.random() * 0.007 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        hue:  tinted ? (Math.random() > 0.5 ? 215 : 268) : -1
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
        ? 'hsla(' + s.hue + ',65%,82%,' + s.a.toFixed(3) + ')'
        : 'rgba(255,255,255,' + s.a.toFixed(3) + ')';
      ctx.fill();

      s.a += s.da;
      if (s.a > 1)    { s.a = 1;    s.da = -Math.abs(s.da); }
      if (s.a < 0.04) { s.a = 0.04; s.da =  Math.abs(s.da); }
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
