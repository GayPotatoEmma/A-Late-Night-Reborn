/* Macro copy buttons & client language selector (Phantom Actions + Status EXD) */
(function () {
  var LANG_STORAGE_KEY = 'alnr-macro-lang';
  var ROMAN_TO_NUM = { I: '1', II: '2', III: '3', IV: '4', V: '5' };
  var PHANTOM_LANGS = [
    { code: 'en', label: 'EN', prefix: 'Phantom Action ', useRoman: true },
    { code: 'de', label: 'DE', prefix: 'Phantomkommando ', useRoman: false },
    { code: 'fr', label: 'FR', prefix: 'Action de soutien ', useRoman: false },
    { code: 'jp', label: 'JP', prefix: 'サポートアクション', useRoman: false }
  ];

  // Official FFXIV EXD Status sheet names (exdschema@2), recipient buff IDs where distinct
  var STATUS_I18N = {
    // Sage
    'Eukrasian Diagnosis':    { de: 'Eukratische Diagnose', fr: 'Diagnosis eucrasique', jp: 'エウクラシア・ディアグノシス' },
    'Differential Diagnosis': { de: 'Exakte Eukratische Diagnose', fr: 'Eudiagnosis eucrasique', jp: 'エウクラシア・ディアグノシス［強］' },
    'Eukrasian Prognosis':    { de: 'Eukratische Prognose', fr: 'Prognosis eucrasique', jp: 'エウクラシア・プログノシス' },
    'Holos':                  { de: 'Holos', fr: 'Holos', jp: 'ホーリズム' },
    'Holosakos':              { de: 'Holos (Barriere)', fr: 'Holos', jp: 'ホーリズム［バリア］' },
    'Haima':                  { de: 'Haima', fr: 'Haima', jp: 'ハイマ' },
    'Haimatinon':             { de: 'Haimatinon', fr: 'Haimatinon', jp: 'ハイマの印' },
    'Kerachole':              { de: 'Kerachole', fr: 'Kerachole', jp: 'ケーラコレ' },
    'Kerakeia':               { de: 'Kerakeia', fr: 'Kerakeia', jp: 'ケーラコレ［回］' },
    'Taurochole':             { de: 'Taurochole', fr: 'Taurochole', jp: 'タウロコレ' },
    'Krasis':                 { de: 'Krasis', fr: 'Krasis', jp: 'クラーシス' },
    'Autophysis':             { de: 'Autophysis', fr: 'Autophysis', jp: 'ピュシスII［被］' },
    'Physis II':              { de: 'Physis II', fr: 'Physis II', jp: 'ピュシスII' },
    'Philosophia':            { de: 'Philosophia', fr: 'Philosophia', jp: 'フィロソフィア' },
    'Eudaimonia':             { de: 'Eudaimonie', fr: 'Eudémonisme', jp: 'エウダイモニア' },
    // Scholar
    'Galvanize':              { de: 'Dynamisieren', fr: 'Réconfort', jp: '鼓舞' },
    'Catalyze':               { de: 'Katalyse', fr: 'Exhortation', jp: '激励' },
    'Sacred Soil':            { de: 'Geweihte Erde', fr: 'Dogme de survie', jp: '野戦治療の陣：効果' },
    'Seraphic Veil':          { de: 'Schleier der Seraphim', fr: 'Voile séraphique', jp: 'セラフィックヴェール' },
    'Whispering Dawn':        { de: 'Erhebendes Flüstern', fr: "Murmure de l'aurore", jp: '光の囁き' },
    'Fey Illumination':       { de: 'Illumination', fr: 'Illumination féerique', jp: 'フェイイルミネーション' },
    'Seraphism':              { de: 'Seraphenbelehrt', fr: 'Aura séraphique', jp: 'セラフィズム：効果' },
    'Protraction':            { de: 'Protraktion', fr: 'Loi de la protraction', jp: '生命回生法' },
    'Excogitation':           { de: 'Weise Voraussicht', fr: "Traité de l'excogitation", jp: '深謀遠慮の策' },
    'Expedience':             { de: 'Sturm', fr: 'Thèse des rafales hurlantes', jp: '疾風の計' },
    'Desperate Measures':     { de: 'Drang', fr: 'Thèse des flots impétueux', jp: '怒濤の計' },
    'Fey Union':              { de: 'Feenbund', fr: 'Union féérique', jp: 'フェイユニオン［被］' },
    // Astrologian
    'Aspected Helios':        { de: 'Aspektierter Helios', fr: 'Hélios aspecté', jp: 'アスペクト・ヘリオス' },
    'Aspected Benefic':       { de: 'Harmonischer Orbis', fr: 'Bienfaisance aspectée', jp: 'アスペクト・ベネフィク' },
    'Intersection':           { de: 'Kongruenz', fr: 'Rencontre céleste', jp: '星天交差' },
    'Opposition':             { de: 'Opposition', fr: 'Opposition céleste', jp: '星天対抗' },
    'Helios Conjunction':     { de: 'Helios in Konjunktion', fr: 'Hélios combiné', jp: 'コンジャンクション・ヘリオス' },
    'Collective Unconscious': { de: 'Numinosum', fr: 'Inconscient collectif (effet)', jp: '運命の輪：効果' },
    'Wheel of Fortune':       { de: 'Numinosum', fr: 'Inconscient collectif', jp: '運命の輪' },
    'Horoscope':              { de: 'Horoskop', fr: 'Horoscope', jp: 'ホロスコープ' },
    'Neutral Sect':           { de: 'Neutral', fr: 'Adepte de la neutralité', jp: 'ニュートラルセクト' },
    'Exaltation':             { de: 'Exaltation', fr: 'Exaltation', jp: 'エクザルテーション' },
    'The Arrow':              { de: 'Pfeil', fr: 'La Flèche', jp: 'オシュオンの矢' },
    'The Spire':              { de: 'Turm', fr: 'La Tour', jp: 'ビエルゴの塔' },
    'The Bole':               { de: 'Eiche', fr: 'Le Tronc', jp: '世界樹の幹' },
    'The Ewer':               { de: 'Krug', fr: "L'Aiguière", jp: 'サリャクの水瓶' },
    // White Mage
    'Temperance':             { de: 'Linderung', fr: 'Tempérance', jp: 'テンパランス：効果' },
    'Divine Caress':          { de: 'Göttliche Umarmung (Barriere)', fr: 'Caresse divine', jp: 'ディヴァインカレス［バリア］' },
    'Medica III':             { de: 'Resega', fr: 'Méga Médica', jp: 'メディガ' },
    'Divine Benison':         { de: 'Göttlicher Segen', fr: 'Faveur divine', jp: 'ディヴァインベニゾン' },
    'Aquaveil':               { de: 'Wasserschleier', fr: 'Aquavoile', jp: 'アクアヴェール' },
    'Regen':                  { de: 'Regena', fr: 'Récup', jp: 'リジェネ' },
    'Confession':             { de: 'Vollkommener Ablass', fr: 'Indulgence plénière', jp: 'インドゥルゲンティア' },
    'Asylum':                 { de: 'Refugium', fr: 'Asile', jp: 'アサイラム：効果' }
  };

  function translatePhantomMacro(enText, langCode) {
    var cfg = PHANTOM_LANGS.find(function (l) { return l.code === langCode; }) || PHANTOM_LANGS[0];
    if (cfg.code === 'en') return enText;
    return enText.replace(/"Phantom Action (I|II|III|IV|V)"/g, function (_, roman) {
      var num = ROMAN_TO_NUM[roman] || roman;
      return '"' + cfg.prefix + (cfg.useRoman ? roman : num) + '"';
    });
  }

  function translateStatusMacro(enText, langCode) {
    if (langCode === 'en') return enText;
    return enText.replace(/(\/statusoff\s+")([^"]+)(")/g, function (full, pre, name, post) {
      var entry = STATUS_I18N[name];
      if (!entry || !entry[langCode]) return full;
      return pre + entry[langCode] + post;
    });
  }

  function initMacroLangSwitchers() {
    var boxes = document.querySelectorAll('.macro-box[data-macro-i18n]');
    if (!boxes.length) return;

    var saved = 'en';
    try {
      var s = localStorage.getItem(LANG_STORAGE_KEY);
      if (s && PHANTOM_LANGS.some(function (l) { return l.code === s; })) saved = s;
    } catch (e) {}

    function applyLang(code) {
      boxes.forEach(function (box) {
        var pre = box.querySelector('pre');
        var mode = box.getAttribute('data-macro-i18n');
        if (pre && pre.dataset.enTemplate) {
          pre.textContent = mode === 'status'
            ? translateStatusMacro(pre.dataset.enTemplate, code)
            : translatePhantomMacro(pre.dataset.enTemplate, code);
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
