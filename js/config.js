// A Late Night Reborn - Shared Public Configuration
(function () {
  var PROD_API_URL = 'https://api.alatenightreborn.com';

  function getApiUrl(allowLocalOverride) {
    if (allowLocalOverride) {
      try {
        var stored = localStorage.getItem('alnr_api_url');
        if (stored && (stored.indexOf('workers.dev') !== -1 || (window.location.hostname.indexOf('localhost') === -1 && stored.indexOf('localhost') !== -1))) {
          localStorage.removeItem('alnr_api_url');
          stored = null;
        }
        if (stored) return stored.replace(/\/+$/, '');
      } catch (e) {}
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://127.0.0.1:5000';
      }
    }
    return PROD_API_URL;
  }

  window.ALNR_CONFIG = {
    DISCORD_CLIENT_ID: '1526282207185080411',
    API_URL: PROD_API_URL,
    getApiUrl: getApiUrl
  };
})();
