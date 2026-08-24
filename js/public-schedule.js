// Compact Upcoming Runs Widget Script for Public Homepage (A-Late-Night-Reborn)

(function () {
    var defaultUrl = 'https://alnr-upcoming-runs.gaypotatoemma.workers.dev';
    var storedUrl = localStorage.getItem('alnr_api_url');
    if (storedUrl && (storedUrl.includes('localhost') || storedUrl.includes('127.0.0.1'))) {
        localStorage.removeItem('alnr_api_url');
        storedUrl = null;
    }
    var API_URL = storedUrl || defaultUrl;

    function parseRunName(rawName) {
        rawName = rawName || 'Run';
        var tag = 'Guild Run';
        var type = rawName;
        var tagClass = 'tag-default';

        var upper = rawName.toUpperCase();
        if (upper.includes('[FT:B]') || upper.includes('BLOOD')) {
            tag = 'FT:B';
            type = rawName.replace(/\[FT:B\]/gi, '').replace(/Forked Tower: Blood/gi, '').trim() || 'Run';
            tagClass = 'tag-ftb';
        } else if (upper.includes('[FT:M]') || upper.includes('MAGIC')) {
            tag = 'FT:M';
            type = rawName.replace(/\[FT:M\]/gi, '').replace(/Forked Tower: Magic/gi, '').trim() || 'Run';
            tagClass = 'tag-ftm';
        } else if (upper.includes('[BA]') || upper.includes('BALDESION')) {
            tag = 'BA';
            type = rawName.replace(/\[BA\]/gi, '').replace(/Baldesion Arsenal/gi, '').trim() || 'Run';
            tagClass = 'tag-ba';
        } else if (upper.includes('[C]') || upper.includes('CHAOTIC')) {
            tag = 'Chaotic';
            type = rawName.replace(/\[C\]/gi, '').replace(/Chaotic/gi, '').trim() || 'Run';
            tagClass = 'tag-chaotic';
        }

        if (!type || type.toLowerCase() === 'run') type = rawName;

        return { tag: tag, type: type, tagClass: tagClass };
    }

    function formatRunDate(unixSeconds) {
        if (!unixSeconds) return '';
        var d = new Date(unixSeconds * 1000);
        
        var mins = d.getMinutes();
        if (mins >= 58) {
            d.setMinutes(0);
            d.setHours(d.getHours() + 1);
        } else if (mins >= 28 && mins <= 29) {
            d.setMinutes(30);
        }

        var dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
        var day = String(d.getDate()).padStart(2, '0');
        var month = String(d.getMonth() + 1).padStart(2, '0');

        var hours = d.getHours();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        var timeMins = String(d.getMinutes()).padStart(2, '0');
        var timeStr = timeMins !== '00' ? (hours + ':' + timeMins + ' ' + ampm) : (hours + ' ' + ampm);

        return dayName + ' ' + day + '/' + month + ' ' + timeStr;
    }

    var allEvents = [];
    var currentPage = 0;
    var pageSize = 3;

    function renderPage() {
        var containerElem = document.getElementById('public-runs-container');
        var pageInfoElem = document.getElementById('public-runs-page-info');
        var prevBtn = document.getElementById('public-runs-prev-btn');
        var nextBtn = document.getElementById('public-runs-next-btn');

        if (!containerElem) return;

        var totalPages = Math.ceil(allEvents.length / pageSize) || 1;
        if (currentPage >= totalPages) currentPage = totalPages - 1;
        if (currentPage < 0) currentPage = 0;

        var startIdx = currentPage * pageSize;
        var pageEvents = allEvents.slice(startIdx, startIdx + pageSize);

        var html = '';
        pageEvents.forEach(function (ev) {
            var info = parseRunName(ev.name);
            var dateStr = formatRunDate(ev.start_time);
            var safeType = (info.type || '').replace(/"/g, '&quot;');

            html += '\
            <div class="public-run-card" title="' + safeType + '">\
                <div class="public-run-left">\
                    <span class="public-run-tag ' + info.tagClass + '">' + info.tag + '</span>\
                    <span class="public-run-type">' + info.type + '</span>\
                </div>\
                <div class="public-run-time">\
                    <span class="material-symbols-outlined public-run-time-icon">schedule</span> ' + dateStr + '\
                </div>\
            </div>';
        });

        containerElem.innerHTML = html;

        if (pageInfoElem) {
            pageInfoElem.textContent = totalPages > 1 ? (currentPage + 1) + ' / ' + totalPages : '';
        }

        if (prevBtn) prevBtn.disabled = (currentPage === 0);
        if (nextBtn) nextBtn.disabled = (currentPage >= totalPages - 1);
    }

    async function loadPublicUpcomingRuns() {
        var widgetElem = document.getElementById('public-upcoming-runs-widget');
        var prevBtn = document.getElementById('public-runs-prev-btn');
        var nextBtn = document.getElementById('public-runs-next-btn');

        if (!widgetElem) return;

        try {
            console.log('[ALNR Schedule] Fetching upcoming runs from:', API_URL);
            var res = await fetch(API_URL);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            var data = await res.json();

            if (!data.events || data.events.length === 0) {
                widgetElem.style.display = 'none';
                return;
            }

            allEvents = data.events;
            currentPage = 0;
            renderPage();
            widgetElem.style.display = 'block';

            if (prevBtn) {
                prevBtn.onclick = function () {
                    if (currentPage > 0) {
                        currentPage--;
                        renderPage();
                    }
                };
            }
            if (nextBtn) {
                nextBtn.onclick = function () {
                    if (currentPage < Math.ceil(allEvents.length / pageSize) - 1) {
                        currentPage++;
                        renderPage();
                    }
                };
            }

        } catch (err) {
            widgetElem.style.display = 'none';
        }
    }

    document.addEventListener('DOMContentLoaded', loadPublicUpcomingRuns);
})();
