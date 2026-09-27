(function () {
  // ---------- mobile menu ----------
  var btn = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var SVGNS = 'http://www.w3.org/2000/svg';
  function el(name, attrs, parent) {
    var e = document.createElementNS(SVGNS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  // ---------- mountain ridges behind the hero ----------
  var ridges = document.querySelector('.ridges');
  if (ridges) {
    var W = 1440, H = 600;
    ridges.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    ridges.setAttribute('preserveAspectRatio', 'none');
    var seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var layers = [
      { base: 250, amp: 120, rough: 26, color: '#1d232b', op: 0.85 },
      { base: 330, amp: 100, rough: 20, color: '#171c23', op: 0.92 },
      { base: 420, amp: 80, rough: 14, color: '#12161c', op: 0.96 },
      { base: 500, amp: 55, rough: 10, color: '#0e1217', op: 1 }
    ];
    layers.forEach(function (L, i) {
      var pts = [], x = 0, y = L.base;
      var phase = rnd() * 6, freq = 0.0028 + i * 0.0009;
      for (x = 0; x <= W; x += 12) {
        y = L.base - Math.sin(x * freq + phase) * L.amp * (0.55 + 0.45 * Math.sin(x * 0.0011 + i)) + (rnd() - 0.5) * L.rough;
        // rising slope toward the right, like the reference
        y -= (x / W) * (140 - i * 25);
        pts.push(x + ',' + y.toFixed(1));
      }
      el('path', { d: 'M0,' + H + ' L' + pts.join(' L') + ' L' + W + ',' + H + ' Z', fill: L.color, opacity: L.op }, ridges);
    });
  }

  // ---------- trade network map ----------
  var map = document.querySelector('.netmap');
  if (map) {
    // equirectangular window: lon -56..150, lat 72..-30
    var LON0 = -56, LON1 = 150, LAT0 = 72, LAT1 = -30, S = 2.4;
    var MW = (LON1 - LON0) * S, MH = (LAT0 - LAT1) * S;
    map.setAttribute('viewBox', '0 0 ' + MW + ' ' + MH);
    function P(lon, lat) { return [(lon - LON0) * S, (LAT0 - lat) * S]; }

    // coarse land mask so the dot field hints at continents without drawing a map
    var land = [
      [-100, -80, 15, 60], [-80, -60, 10, 50], [-82, -35, -38, 12], [-18, 50, -35, 37],
      [-10, 40, 36, 60], [5, 40, 55, 70], [40, 150, 45, 72], [35, 60, 12, 42], [60, 145, 20, 45],
      [68, 90, 8, 30], [95, 110, 0, 25], [105, 125, -8, 5], [130, 150, -38, -12], [114, 130, -35, -18], [130, 145, 30, 45]
    ];
    function isLand(lon, lat) {
      for (var i = 0; i < land.length; i++) {
        var b = land[i];
        if (lon >= b[0] && lon <= b[1] && lat >= b[2] && lat <= b[3]) return true;
      }
      return false;
    }
    function inRussia(lon, lat) {
      return (lon >= 30 && lon <= 150 && lat >= 50 && lat <= 72) || (lon >= 38 && lon <= 60 && lat >= 44 && lat < 50) || (lon >= 130 && lon <= 142 && lat >= 42 && lat < 50);
    }
    var dots = el('g', {}, map);
    for (var lon = LON0 + 2.5; lon < LON1; lon += 5) {
      for (var lat = LAT0 - 2.5; lat > LAT1; lat -= 5) {
        if (!isLand(lon, lat)) continue;
        var p = P(lon, lat);
        el('circle', { cx: p[0], cy: p[1], r: inRussia(lon, lat) ? 1.6 : 1.2, 'class': inRussia(lon, lat) ? 'ru-dot' : 'grid-dot' }, dots);
      }
    }

    var hub = { name: 'Moscow', lon: 37.6, lat: 55.75 };
    var inner = [
      { name: 'St Petersburg', lon: 30.3, lat: 59.9 },
      { name: 'Kazan', lon: 49.1, lat: 55.8 },
      { name: 'Yekaterinburg', lon: 60.6, lat: 56.8 },
      { name: 'Novosibirsk', lon: 82.9, lat: 55.0 },
      { name: 'Vladivostok', lon: 131.9, lat: 43.1 }
    ];
    var origins = [
      { name: 'Istanbul', lon: 29.0, lat: 41.0, note: 'Textiles, food, home goods' },
      { name: 'Seoul', lon: 127.0, lat: 37.5, note: 'Beauty, appliances, electronics' },
      { name: 'Shanghai', lon: 121.5, lat: 31.2, note: 'Electronics, components, machinery' },
      { name: 'Tokyo', lon: 139.7, lat: 35.7, note: 'Machinery, auto parts, consumer tech' },
      { name: 'Mumbai', lon: 72.9, lat: 19.0, note: 'Pharma, food, textiles' },
      { name: 'Dubai', lon: 55.3, lat: 25.2, note: 'Trading hub, brand owners' },
      { name: 'Ho Chi Minh', lon: 106.7, lat: 10.8, note: 'Food, apparel, furniture' },
      { name: 'Jakarta', lon: 106.8, lat: -6.2, note: 'Food, cosmetics, raw materials' },
      { name: 'Cairo', lon: 31.2, lat: 30.0, note: 'Food, agriculture' },
      { name: 'Almaty', lon: 76.9, lat: 43.2, note: 'Regional partners, logistics' },
      { name: 'São Paulo', lon: -46.6, lat: -23.5, note: 'Food, beverages, cosmetics' }
    ];

    var arcs = el('g', {}, map);
    var nodesG = el('g', {}, map);
    var H0 = P(hub.lon, hub.lat);

    // domestic links (Russia as a network, not a block of colour)
    var prev = P(inner[0].lon, inner[0].lat);
    el('path', { d: 'M' + prev + ' L' + H0, 'class': 'ru-link' }, arcs);
    inner.slice(1).forEach(function (c) {
      var q = P(c.lon, c.lat);
      el('path', { d: 'M' + H0 + ' Q' + ((H0[0] + q[0]) / 2) + ',' + (Math.min(H0[1], q[1]) - 18) + ' ' + q, 'class': 'ru-link' }, arcs);
    });

    var caption = document.querySelector('.map-caption');
    var defaultCaption = caption ? caption.innerHTML : '';

    origins.forEach(function (o, i) {
      var a = P(o.lon, o.lat);
      var mx = (a[0] + H0[0]) / 2, my = (a[1] + H0[1]) / 2;
      var dist = Math.hypot(a[0] - H0[0], a[1] - H0[1]);
      var c = [mx, my - dist * 0.32];
      var d = 'M' + a + ' Q' + c + ' ' + H0;
      var base = el('path', { d: d, 'class': 'arc' }, arcs);
      var flow = el('path', { d: d, 'class': 'arc flow' }, arcs);
      flow.style.animationDelay = (-i * 0.37) + 's';

      var pkt = el('circle', { r: 1.8, 'class': 'pkt' }, arcs);
      var am = el('animateMotion', { dur: (4 + (i % 4)) + 's', repeatCount: 'indefinite', path: d, begin: (-i * 0.9) + 's' }, pkt);

      var g = el('g', { 'class': 'node', tabindex: '0' }, nodesG);
      el('circle', { cx: a[0], cy: a[1], r: 7, 'class': 'halo' }, g);
      el('circle', { cx: a[0], cy: a[1], r: 2.6, 'class': 'core' }, g);
      var right = o.lon < 100 || o.name === 'Jakarta';
      var lx = a[0] + (right ? 8 : -8), ly = a[1] + 3, anchor = right ? 'start' : 'end';
      if (o.name === 'Seoul') { ly = a[1] - 7; }
      if (o.name === 'Tokyo') { lx = a[0]; ly = a[1] + 15; anchor = 'middle'; }
      var t = el('text', { x: lx, y: ly, 'text-anchor': anchor }, g);
      t.textContent = o.name;

      function on() {
        base.classList.add('hot'); g.classList.add('hot');
        if (caption) caption.innerHTML = '<b>' + o.name + ' → Russia</b> &nbsp;·&nbsp; ' + o.note;
      }
      function off() {
        base.classList.remove('hot'); g.classList.remove('hot');
        if (caption) caption.innerHTML = defaultCaption;
      }
      g.addEventListener('mouseenter', on); g.addEventListener('focus', on);
      g.addEventListener('mouseleave', off); g.addEventListener('blur', off);
    });

    inner.forEach(function (c) {
      var q = P(c.lon, c.lat);
      var g = el('g', { 'class': 'node' }, nodesG);
      el('circle', { cx: q[0], cy: q[1], r: 1.8, 'class': 'core' }, g);
    });
    var hg = el('g', { 'class': 'node hub' }, nodesG);
    el('circle', { cx: H0[0], cy: H0[1], r: 6, 'class': 'halo' }, hg);
    el('circle', { cx: H0[0], cy: H0[1], r: 3.6, 'class': 'core' }, hg);
    var ht = el('text', { x: H0[0] + 9, y: H0[1] - 6 }, hg);
    ht.textContent = 'Russia';
    ht.style.fill = '#c8a96a';
  }

  // ---------- product accordion ----------
  document.querySelectorAll('.product button').forEach(function (b) {
    b.addEventListener('click', function () {
      var p = b.closest('.product');
      var open = p.classList.toggle('open');
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  // ---------- forms ----------
  var params = new URLSearchParams(location.search);
  var svc = params.get('service');
  if (svc) {
    var input = document.querySelector('input[name="need"][value="' + svc + '"]');
    if (input) input.checked = true;
  }

  document.querySelectorAll('form[data-endpoint]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var done = document.querySelector(form.getAttribute('data-done'));
      var endpoint = form.getAttribute('data-endpoint');
      var showDone = function () {
        form.style.display = 'none';
        if (done) done.classList.add('show');
      };
      if (endpoint.indexOf('YOUR_FORM_ID') !== -1) {
        // Placeholder until a real form endpoint is connected
        alert('This form is not connected yet.');
        return;
      }
      fetch(endpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { if (r.ok) showDone(); else alert('Something went wrong. Please try again later.'); })
        .catch(function () { alert('Something went wrong. Please try again later.'); });
    });
  });
})();
