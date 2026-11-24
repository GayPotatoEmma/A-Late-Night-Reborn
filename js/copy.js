/* Macro copy buttons & Phantom Action language selector */
(function () {
  var LANG_STORAGE_KEY = 'alnr-macro-lang';
  var ROMAN_TO_NUM = { I: '1', II: '2', III: '3', IV: '4', V: '5' };
  var PHANTOM_LANGS = [
    { code: 'en', label: 'EN', prefix: 'Phantom Action ', useRoman: true },
    { code: 'de', label: 'DE', prefix: 'Phantomkommando ', useRoman: false },
    { code: 'fr', label: 'FR', prefix: 'Action de soutien ', useRoman: false },
    { code: 'jp', label: 'JP', prefix: 'サポートアクション', useRoman: false }
  ];

  function translatePhantomMacro(enText, langCode) {
    var cfg = PHANTOM_LANGS.find(function (l) { return l.code === langCode; }) || PHANTOM_LANGS[0];
    if (cfg.code === 'en') return enText;
    return enText.replace(/"Phantom Action (I|II|III|IV|V)"/g, function (_, roman) {
      var num = ROMAN_TO_NUM[roman] || roman;
      return '"' + cfg.prefix + (cfg.useRoman ? roman : num) + '"';
    });
  }

  function initMacroLangSwitchers() {
    var boxes = document.querySelectorAll('.macro-box[data-macro-i18n="phantom"]');
    if (!boxes.length) return;

    var saved = 'en';
    try {
      var s = localStorage.getItem(LANG_STORAGE_KEY);
      if (s && PHANTOM_LANGS.some(function (l) { return l.code === s; })) saved = s;
    } catch (e) {}

    function applyLang(code) {
      boxes.forEach(function (box) {
        var pre = box.querySelector('pre');
        if (pre && pre.dataset.enTemplate) {
          pre.textContent = translatePhantomMacro(pre.dataset.enTemplate, code);
        }
        box.querySelectorAll('.macro-lang-btn').forEach(function (btn) {
          var active = btn.getAttribute('data-lang') === code;
          btn.classList.toggle('active', active);
          btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
      });
      try { localStorage.setItem(LANG_STORAGE_KEY, code); } catch (e) {}
    }

    boxes.forEach(function (box) {
      var pre = box.querySelector('pre');
      var copyBtn = box.querySelector('.macro-copy-btn');
      if (!pre || box.querySelector('.macro-toolbar')) return;

      pre.dataset.enTemplate = pre.textContent || '';
      box.classList.add('has-lang-bar');

      var toolbar = document.createElement('div');
      toolbar.className = 'macro-toolbar';

      var switcher = document.createElement('div');
      switcher.className = 'macro-lang-switcher';
      switcher.setAttribute('role', 'group');
      switcher.setAttribute('aria-label', 'Macro client language');

      PHANTOM_LANGS.forEach(function (l) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'macro-lang-btn';
        btn.setAttribute('data-lang', l.code);
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = l.label;
        btn.addEventListener('click', function () {
          applyLang(l.code);
        });
        switcher.appendChild(btn);
      });

      toolbar.appendChild(switcher);
      if (copyBtn) toolbar.appendChild(copyBtn);
      box.insertBefore(toolbar, pre);
    });

    applyLang(saved);
  }

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

  initMacroLangSwitchers();
})();
