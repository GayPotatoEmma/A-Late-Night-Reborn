/* Macro copy buttons - click to copy pre content to clipboard */
(function () {
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }

  function showCopied(btn, ok) {
    btn.textContent = ok ? 'Copied!' : 'Copy failed';
    btn.classList.toggle('copied', ok);
    if (typeof window.alnrToast === 'function') {
      window.alnrToast(ok ? 'Macro copied to clipboard' : 'Could not copy macro', ok ? 'success' : 'error');
    }
    setTimeout(function () {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  }

  document.querySelectorAll('.macro-copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('.macro-box');
      var pre = box ? box.querySelector('pre') : null;
      if (!pre) return;
      var text = pre.textContent || '';
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(text).then(function () {
          showCopied(btn, true);
        }).catch(function () {
          showCopied(btn, fallbackCopy(text));
        });
      } else {
        showCopied(btn, fallbackCopy(text));
      }
    });
  });
})();
