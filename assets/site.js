// Mobile menu
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Preselect service on contact form from ?service=...
  var params = new URLSearchParams(location.search);
  var svc = params.get('service');
  if (svc) {
    var input = document.querySelector('input[name="need"][value="' + svc + '"]');
    if (input) input.checked = true;
  }

  // Brief form: send via Formspree-style endpoint if configured, otherwise mailto fallback
  var form = document.getElementById('brief');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var action = form.getAttribute('action') || '';
    var data = new FormData(form);
    var done = document.querySelector('.form-done');
    var showDone = function () {
      form.style.display = 'none';
      if (done) { done.classList.add('show'); done.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    };

    if (action.indexOf('YOUR_FORM_ID') === -1 && action.indexOf('http') === 0) {
      fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        .then(function (r) { if (r.ok) showDone(); else alert('Something went wrong. Please email me directly.'); })
        .catch(function () { alert('Something went wrong. Please email me directly.'); });
      return;
    }

    // Fallback: open the visitor's mail client with the brief filled in
    var lines = [];
    data.forEach(function (v, k) { if (v) lines.push(k + ': ' + v); });
    var to = form.getAttribute('data-email') || '';
    location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Russia entry brief') +
      '&body=' + encodeURIComponent(lines.join('\n'));
    showDone();
  });
})();
