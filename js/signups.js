// Dynamic Run Signups Module for A Late Night Reborn

(function () {
    const DISCORD_CLIENT_ID = "1526282207185080411";
    
    // Auto-detect API URL: use local port 5000 if testing on localhost, otherwise fallback to worker/api
    function getApiUrl() {
        const stored = localStorage.getItem('alnr_api_url');
        if (stored) return stored.replace(/\/+$/, '');
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://127.0.0.1:5000';
        }
        return 'https://api.alatenightreborn.com';
    }

    let currentUser = null;
    let allEvents = [];
    let selectedEvent = null;
    let activeFilter = 'all';

    // ── Pre-defined Lists ────────────────────────────────────────────────────────
    const ALL_ROLES = [
        { id: 'Tank', label: 'Tank', class: 'role-tank' },
        { id: 'Regen Healer', label: 'Regen Healer', class: 'role-healer' },
        { id: 'Shield Healer', label: 'Shield Healer', class: 'role-healer' },
        { id: 'Melee DPS', label: 'Melee DPS', class: 'role-dps' },
        { id: 'Magical DPS', label: 'Magical DPS', class: 'role-dps' },
        { id: 'Physical Ranged DPS', label: 'Physical Ranged', class: 'role-dps' },
        { id: 'Any', label: 'Any Role', class: 'role-any' }
    ];

    const JOBS_BY_ROLE = {
        'Tank': ['Paladin', 'Warrior', 'Dark Knight', 'Gunbreaker', 'Any'],
        'Healer': ['White Mage', 'Scholar', 'Astrologian', 'Sage', 'Any'],
        'Melee DPS': ['Monk', 'Dragoon', 'Ninja', 'Samurai', 'Reaper', 'Viper', 'Any'],
        'Magical DPS': ['Black Mage', 'Summoner', 'Red Mage', 'Pictomancer', 'Any'],
        'Physical Ranged DPS': ['Bard', 'Machinist', 'Dancer', 'Any']
    };

    const PHANTOM_JOBS = [
        'Knight', 'Monk', 'Thief', 'Samurai', 'Berserker', 'Ranger', 'Time Mage', 
        'Chemist', 'Geomancer', 'Bard', 'Oracle', 'Cannoneer', 'Mystic Knight', 
        'Gladiator', 'Dancer', 'Black Mage', 'Blue Mage', 'Dragoon', 'Necromancer', 
        'Ninja', 'Red Mage', 'Summoner', 'White Mage'
    ];

    const PROG_OPTIONS = {
        'Chaotic': [
            'No Experience', 'Seen Phase 2 - Swaps', 'Seen Enrage', 
            'Cleared 1-4 times', 'Cleared 5+ times'
        ],
        'FT:B': [
            'No Experience', 'Seen Dead Stars', 'Seen Bridges', 'Seen Marble Dragon', 
            'Seen Magitaur', 'Clear Ready: Seen Magitaur - Holy Lance', 
            'Cleared 1-4 times', 'Cleared 5+ times'
        ],
        'FT:M': [
            'No Experience', 'Seen Twin Snakes', 'Seen Sword Dancer', 'Seen Platforms', 
            'Seen Necrophobia', 'Seen Index', 'Cleared 1-4 times', 'Cleared 5+ times'
        ],
        'BA': [
            'No Experience', 'Seen Raiden', 'Seen Absolute Virtue', 'Seen Ozma', 
            'Cleared 1-4 times', 'Cleared 5+ times'
        ]
    };

    // ── OAuth2 Flow Handlers ─────────────────────────────────────────────────────

    function getRedirectUri() {
        return window.location.origin + window.location.pathname;
    }

    function initiateDiscordLogin() {
        const redirect = encodeURIComponent(getRedirectUri());
        const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${redirect}&scope=identify`;
        window.location.href = oauthUrl;
    }

    function signOut() {
        localStorage.removeItem('alnr_session_token');
        currentUser = null;
        renderAuthBanner();
        renderFormInputs();
    }

    async function handleAuthCodeIfPresent() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (!code) return;

        // Clean query params from browser URL bar
        const cleanUrl = window.location.origin + window.location.pathname + (params.get('run') ? `?run=${params.get('run')}` : '');
        window.history.replaceState({}, document.title, cleanUrl);

        showStatusAlert('Authenticating with Discord...', 'info');

        try {
            const res = await fetch(`${getApiUrl()}/api/public/auth/discord`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code, redirect_uri: getRedirectUri() })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Discord authentication failed.');
            }

            const data = await res.json();
            localStorage.setItem('alnr_session_token', data.token);
            currentUser = data.user;
            showStatusAlert(`Welcome back, ${currentUser.global_name || currentUser.username}!`, 'success');
        } catch (err) {
            console.error('[Signups Auth]', err);
            showStatusAlert(`Login Error: ${err.message}`, 'error');
        }
    }

    async function verifyExistingSession() {
        const token = localStorage.getItem('alnr_session_token');
        if (!token) return;

        try {
            const res = await fetch(`${getApiUrl()}/api/public/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.authenticated) {
                    currentUser = data.user;
                }
            } else {
                localStorage.removeItem('alnr_session_token');
            }
        } catch (e) {
            console.warn('[Signups Auth] Could not verify existing session:', e);
        }
    }

    // ── Rendering Auth State ─────────────────────────────────────────────────────

    function renderAuthBanner() {
        const container = document.getElementById('auth-banner-container');
        if (!container) return;

        if (!currentUser) {
            container.innerHTML = `
                <div class="glass-card auth-banner-unauthed">
                    <div class="auth-info-left">
                        <div class="discord-logo-icon">
                            <svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                        </div>
                        <div>
                            <div style="font-weight: 700; font-size: 1.1rem; color: #ffffff;">Sign in with Discord</div>
                            <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">
                                Auto-fills your verified FFXIV character name & Discord username.
                            </div>
                        </div>
                    </div>
                    <button class="auth-btn-discord" id="btn-discord-login" type="button">
                        <span>Connect Discord</span>
                        <span class="material-symbols-outlined" style="font-size: 1.2rem;">login</span>
                    </button>
                </div>
            `;
            document.getElementById('btn-discord-login').onclick = initiateDiscordLogin;
        } else {
            const verifiedBadge = currentUser.is_verified 
                ? `<span class="badge-verified"><span class="material-symbols-outlined" style="font-size: 1rem;">verified</span> Verified Raider</span>`
                : `<span class="badge-unverified"><span class="material-symbols-outlined" style="font-size: 1rem;">warning</span> Unverified in Discord</span>`;

            const charInfo = currentUser.character_name 
                ? `Character: <strong style="color: #ffffff;">${escapeHtml(currentUser.character_name)}</strong> ${currentUser.server ? `(${escapeHtml(currentUser.server)})` : ''}`
                : `Character: <em>Not linked yet</em>`;

            container.innerHTML = `
                <div class="glass-card auth-banner-authed">
                    <div class="user-profile-strip">
                        <img src="${currentUser.avatar_url}" alt="Avatar" class="user-avatar-img">
                        <div class="user-details-box">
                            <div class="user-display-name">
                                <span>${escapeHtml(currentUser.global_name || currentUser.username)}</span>
                                ${verifiedBadge}
                            </div>
                            <div style="font-size: 0.84rem; color: var(--text-secondary);">
                                ${charInfo} • @${escapeHtml(currentUser.username)}
                            </div>
                        </div>
                    </div>
                    <button class="btn-signout" id="btn-discord-signout" type="button">Sign Out</button>
                </div>
            `;
            document.getElementById('btn-discord-signout').onclick = signOut;
        }
    }

    // ── Fetching & Rendering Events ──────────────────────────────────────────────

    function normalizeEvent(ev) {
        // 1. Detect Content Type
        let ct = ev.content_type;
        const text = ((ev.tab_name || '') + ' ' + (ev.name || '')).toUpperCase();

        if (text.includes('CHAOTIC') || text.includes('[C]')) {
            ct = 'Chaotic';
        } else if (text.includes('[FT:M]') || text.includes('FT:M') || text.includes('MAGIC')) {
            ct = 'FT:M';
        } else if (text.includes('[FT:B]') || text.includes('FT:B') || text.includes('BLOOD')) {
            ct = 'FT:B';
        } else if (text.includes('[BA]') || text.includes('BALDESION')) {
            ct = 'BA';
        } else if (!ct) {
            ct = 'Chaotic';
        }
        ev.content_type = ct;

        // 2. Category key for filter pills
        let catKey = 'chaotic';
        if (ct === 'FT:B') catKey = 'ftb';
        else if (ct === 'FT:M') catKey = 'ftm';
        else if (ct === 'BA') catKey = 'ba';
        ev.category_key = catKey;

        // 3. Detect Day
        if (!ev.day) {
            if (ev.tab_name) {
                const parts = ev.tab_name.replace(/[\[\]]/g, '').trim().split(/\s+/);
                const possibleDay = parts[parts.length - 1];
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                if (days.includes(possibleDay)) {
                    ev.day = possibleDay;
                }
            }
            if (!ev.day && ev.start_time) {
                const d = new Date(ev.start_time * 1000);
                ev.day = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
            }
        }

        return ev;
    }

    function cleanRunTitle(name) {
        if (!name) return 'Run';
        return name
            .replace(/^\[.*?\]\s*[-–:]?\s*/, '')
            .replace(/^(Forked Tower:\s*(Blood|Magic)|Cloud of Darkness\s*\(Chaotic\)|Baldesion Arsenal)\s*[-–:]?\s*/i, '')
            .trim() || name;
    }

    function formatRunDateTime(ev) {
        if (!ev) return '';
        if (!ev.start_time) return ev.start_time_formatted || '';
        const d = new Date(ev.start_time * 1000);

        // Local date parts
        const dayName = d.toLocaleDateString(undefined, { weekday: 'long' });
        const dayNum = d.getDate();
        const monthName = d.toLocaleDateString(undefined, { month: 'long' });

        // Local time: HH:mm
        const localHours = String(d.getHours()).padStart(2, '0');
        const localMins = String(d.getMinutes()).padStart(2, '0');
        const localTime = `${localHours}:${localMins}`;

        // Server time (UTC): e.g. 21ST or 21:30ST
        const utcHours = d.getUTCHours();
        const utcMins = d.getUTCMinutes();
        const serverTime = utcMins === 0 ? `${utcHours}ST` : `${utcHours}:${String(utcMins).padStart(2, '0')}ST`;

        return `${dayName}, ${dayNum} ${monthName} @ ${localTime} (${serverTime})`;
    }

    async function loadEvents() {
        const container = document.getElementById('runs-selection-container');
        if (!container) return;

        try {
            const res = await fetch(`${getApiUrl()}/api/public/events`);
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const data = await res.json();
            const raw = data.events || [];
            allEvents = raw.map(normalizeEvent);

            renderEventsGrid();
            checkUrlPreselection();
        } catch (e) {
            console.error('[Signups] Failed to fetch events:', e);
            container.innerHTML = `
                <div style="color: var(--text-muted); padding: 1.5rem; text-align: center;">
                    Could not load upcoming runs from server. Check connection or try refreshing.
                </div>
            `;
        }
    }

    function renderEventsGrid() {
        const grid = document.getElementById('runs-grid');
        if (!grid) return;

        const filtered = allEvents.filter(ev => {
            if (activeFilter === 'all') return true;
            return ev.category_key === activeFilter;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No upcoming runs found for this category.</div>`;
            return;
        }

        grid.innerHTML = filtered.map(ev => {
            const isSelected = selectedEvent && selectedEvent.id === ev.id;
            let typeBadgeClass = 'ftb';
            let badgeLabel = 'FT:B';
            if (ev.content_type === 'FT:M') {
                typeBadgeClass = 'ftm';
                badgeLabel = 'FT:M';
            } else if (ev.content_type === 'Chaotic') {
                typeBadgeClass = 'chaotic';
                badgeLabel = 'Chaotic';
            } else if (ev.content_type === 'BA') {
                typeBadgeClass = 'ba';
                badgeLabel = 'BA';
            }

            const statusBadge = ev.is_closed
                ? `<span class="run-closed-badge"><span class="material-symbols-outlined" style="font-size: 0.95rem;">lock</span> Closed (${ev.signup_count})</span>`
                : `<span class="run-card-count"><span class="material-symbols-outlined" style="font-size: 1rem;">group</span> ${ev.signup_count} signed up</span>`;

            return `
                <div class="run-select-card ${isSelected ? 'selected' : ''} ${ev.is_closed ? 'is-closed' : ''}" data-run-id="${ev.id}" title="${ev.is_closed ? 'Signups for this run are closed' : ''}">
                    <div class="run-card-top">
                        <span class="run-type-badge ${typeBadgeClass}">${badgeLabel}</span>
                        ${statusBadge}
                    </div>
                    <div class="run-card-title">${escapeHtml(cleanRunTitle(ev.name))}</div>
                    <div class="run-card-time">
                        <span class="material-symbols-outlined" style="font-size: 1rem;">schedule</span>
                        ${escapeHtml(formatRunDateTime(ev))}
                    </div>
                </div>
            `;
        }).join('');

        // Attach click handlers
        grid.querySelectorAll('.run-select-card').forEach(card => {
            card.onclick = () => {
                const runId = card.getAttribute('data-run-id');
                const target = allEvents.find(e => e.id === runId);
                if (!target) return;
                if (target.is_closed) {
                    showStatusAlert(`🔒 Signups for "${cleanRunTitle(target.name)}" have been closed by the hosts.`, 'error');
                    return;
                }
                selectRun(target);
            };
        });
    }

    function selectRun(ev) {
        if (ev.is_closed) {
            showStatusAlert(`🔒 Signups for "${cleanRunTitle(ev.name)}" are closed.`, 'error');
            return;
        }
        selectedEvent = ev;
        renderEventsGrid();
        
        // Show Form Card
        const formCard = document.getElementById('signup-form-card');
        if (formCard) {
            formCard.style.display = 'block';
            formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        document.getElementById('selected-run-banner').textContent = `${ev.content_type} — ${cleanRunTitle(ev.name)} (${formatRunDateTime(ev)})`;
        renderFormInputs();
    }

    function checkUrlPreselection() {
        const params = new URLSearchParams(window.location.search);
        const runId = params.get('run');
        if (runId && allEvents.length > 0) {
            const target = allEvents.find(e => e.id === runId);
            if (target) selectRun(target);
        }
    }

    // ── Dynamic Form Rendering ───────────────────────────────────────────────────

    function renderFormInputs() {
        if (!selectedEvent) return;

        const contentType = selectedEvent.content_type;

        // Auto-fill Character Name and Discord Name
        const nameInput = document.getElementById('input-char-name');
        const discordInput = document.getElementById('input-discord-name');

        if (currentUser) {
            if (currentUser.character_name) {
                nameInput.value = currentUser.character_name;
            }
            discordInput.value = currentUser.username;
            discordInput.disabled = true;
        } else {
            discordInput.disabled = false;
        }

        // Render Preferred Role Chips
        renderPreferredRoles();

        // Render Playable Roles Chips
        renderPlayableRoles();

        // Render Content-Specific Prog Points
        renderProgPoints(contentType);

        // Render Content-Specific Party Preferences
        renderPartyPreferences(contentType);

        // Render Dynamic Role / Job Sections
        updateDynamicRoleSections();
    }

    function renderPreferredRoles() {
        const container = document.getElementById('preferred-role-chips');
        if (!container) return;

        container.innerHTML = ALL_ROLES.map(r => `
            <button type="button" class="chip-btn ${r.class}" data-role="${r.id}">
                ${r.label}
            </button>
        `).join('');

        container.querySelectorAll('.chip-btn').forEach(btn => {
            btn.onclick = () => {
                container.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            };
        });

        // Default select 'Any'
        const defaultBtn = container.querySelector('[data-role="Any"]');
        if (defaultBtn) defaultBtn.classList.add('selected');
    }

    function renderPlayableRoles() {
        const container = document.getElementById('playable-roles-chips');
        if (!container) return;

        container.innerHTML = ALL_ROLES.map(r => `
            <button type="button" class="chip-btn ${r.class}" data-role="${r.id}">
                ${r.label}
            </button>
        `).join('');

        container.querySelectorAll('.chip-btn').forEach(btn => {
            btn.onclick = () => {
                const roleId = btn.getAttribute('data-role');
                if (roleId === 'Any') {
                    // Toggle Any
                    const isSelected = btn.classList.toggle('selected');
                    if (isSelected) {
                        container.querySelectorAll('.chip-btn:not([data-role="Any"])').forEach(b => b.classList.add('selected'));
                    }
                } else {
                    btn.classList.toggle('selected');
                }
                updateDynamicRoleSections();
            };
        });
    }

    function getSelectedPlayableRoles() {
        const container = document.getElementById('playable-roles-chips');
        if (!container) return [];
        return Array.from(container.querySelectorAll('.chip-btn.selected'))
            .map(b => b.getAttribute('data-role'));
    }

    function renderProgPoints(contentType) {
        const select = document.getElementById('input-prog-point');
        if (!select) return;

        const options = PROG_OPTIONS[contentType] || PROG_OPTIONS['Chaotic'];
        select.innerHTML = options.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('');
    }

    function renderPartyPreferences(contentType) {
        const select = document.getElementById('input-party-pref');
        if (!select) return;

        let options = [];
        if (contentType === 'Chaotic') {
            options = [
                { value: 'Any', label: 'Any Party' },
                { value: 'A', label: 'Party A' },
                { value: 'B', label: 'Party B' },
                { value: 'C', label: 'Party C' }
            ];
        } else {
            options = [
                { value: 'Any', label: 'Any Party' },
                { value: 'A', label: 'Party A' },
                { value: 'B', label: 'Party B' },
                { value: 'C', label: 'Party C' },
                { value: '1', label: 'Party 1' },
                { value: '2', label: 'Party 2' },
                { value: '3', label: 'Party 3' }
            ];
        }

        select.innerHTML = options.map(o => `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join('');
    }

    // ── Dynamic Jobs Sections (Chaotic / FT / BA) ────────────────────────────────

    function updateDynamicRoleSections() {
        if (!selectedEvent) return;
        const contentType = selectedEvent.content_type;
        const container = document.getElementById('dynamic-jobs-container');
        if (!container) return;

        container.innerHTML = '';

        if (contentType === 'Chaotic') {
            const selectedRoles = getSelectedPlayableRoles();
            let html = '';

            // 1. Tanks
            if (selectedRoles.includes('Tank') || selectedRoles.includes('Any')) {
                html += createJobChipsGroup('tanks', 'Tanks You Can Play', JOBS_BY_ROLE['Tank'], 'role-tank');
            }
            // 2. Healers
            if (selectedRoles.includes('Regen Healer') || selectedRoles.includes('Shield Healer') || selectedRoles.includes('Any')) {
                html += createJobChipsGroup('healers', 'Healers You Can Play', JOBS_BY_ROLE['Healer'], 'role-healer');
            }
            // 3. Melee DPS
            if (selectedRoles.includes('Melee DPS') || selectedRoles.includes('Any')) {
                html += createJobChipsGroup('melee_dps', 'Melee DPS You Can Play', JOBS_BY_ROLE['Melee DPS'], 'role-dps');
            }
            // 4. Magical DPS
            if (selectedRoles.includes('Magical DPS') || selectedRoles.includes('Any')) {
                html += createJobChipsGroup('magical_dps', 'Magical DPS You Can Play', JOBS_BY_ROLE['Magical DPS'], 'role-dps');
            }
            // 5. Physical Ranged DPS
            if (selectedRoles.includes('Physical Ranged DPS') || selectedRoles.includes('Any')) {
                html += createJobChipsGroup('phys_ranged_dps', 'Physical Ranged You Can Play', JOBS_BY_ROLE['Physical Ranged DPS'], 'role-dps');
            }

            container.innerHTML = html;
            attachJobChipHandlers();

        } else if (contentType === 'FT:B' || contentType === 'FT:M') {
            container.innerHTML = `
                <div class="dynamic-jobs-box">
                    <div class="jobs-role-title">
                        <span class="material-symbols-outlined">auto_fix_high</span> Phantom Jobs Experience
                    </div>
                    <div class="quick-toggle-actions">
                        <button type="button" class="btn-mini-toggle" onclick="toggleAllJobs('phantom_exp', true)">Select All</button>
                        <button type="button" class="btn-mini-toggle" onclick="toggleAllJobs('phantom_exp', false)">Clear</button>
                    </div>
                    <div class="chips-group" id="chips-phantom-exp">
                        ${PHANTOM_JOBS.map(j => `<button type="button" class="chip-btn" data-job="${escapeHtml(j)}">${escapeHtml(j)}</button>`).join('')}
                    </div>
                </div>

                <div class="dynamic-jobs-box">
                    <div class="jobs-role-title">
                        <span class="material-symbols-outlined">military_tech</span> Phantom Jobs Fully Leveled
                    </div>
                    <div class="quick-toggle-actions">
                        <button type="button" class="btn-mini-toggle" onclick="toggleAllJobs('phantom_lvl', true)">Select All</button>
                        <button type="button" class="btn-mini-toggle" onclick="toggleAllJobs('phantom_lvl', false)">Clear</button>
                    </div>
                    <div class="chips-group" id="chips-phantom-lvl">
                        ${PHANTOM_JOBS.map(j => `<button type="button" class="chip-btn" data-job="${escapeHtml(j)}">${escapeHtml(j)}</button>`).join('')}
                    </div>
                </div>
            `;
            attachPhantomChipHandlers();

        } else if (contentType === 'BA') {
            const logosActions = [
                'Perception (Finding Traps)', 
                'Spirit Dart (Vulnerability)', 
                'Feint (Evasion)', 
                'Dispel (Buff Removal)', 
                'Bravery (Buffs)', 
                'Refresh (Magia Wheel)'
            ];

            container.innerHTML = `
                <div class="dynamic-jobs-box">
                    <div class="jobs-role-title">
                        <span class="material-symbols-outlined">magic_button</span> Logos Actions Experience
                    </div>
                    <div class="chips-group" id="chips-logos-exp">
                        ${logosActions.map(a => `<button type="button" class="chip-btn" data-action="${escapeHtml(a)}">${escapeHtml(a)}</button>`).join('')}
                    </div>
                    
                    <div class="form-group" style="margin-top: 1.25rem; margin-bottom: 0;">
                        <label class="form-label">Would you like to try any new special Logos Actions?</label>
                        <select id="input-logos-try" class="input-select" style="max-width: 200px;">
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                </div>
            `;
            document.querySelectorAll('#chips-logos-exp .chip-btn').forEach(b => {
                b.onclick = () => b.classList.toggle('selected');
            });
        }
    }

    function createJobChipsGroup(groupId, title, jobs, roleClass) {
        return `
            <div class="dynamic-jobs-box">
                <div class="jobs-role-title">${escapeHtml(title)}</div>
                <div class="quick-toggle-actions">
                    <button type="button" class="btn-mini-toggle" onclick="toggleAllJobGroup('${groupId}', true)">Select All</button>
                    <button type="button" class="btn-mini-toggle" onclick="toggleAllJobGroup('${groupId}', false)">Clear</button>
                </div>
                <div class="chips-group" data-group="${groupId}">
                    ${jobs.map(j => `<button type="button" class="chip-btn ${roleClass}" data-job="${escapeHtml(j)}">${escapeHtml(j)}</button>`).join('')}
                </div>
            </div>
        `;
    }

    function attachJobChipHandlers() {
        document.querySelectorAll('.dynamic-jobs-box .chips-group .chip-btn').forEach(btn => {
            btn.onclick = () => btn.classList.toggle('selected');
        });
    }

    function attachPhantomChipHandlers() {
        document.querySelectorAll('#chips-phantom-exp .chip-btn, #chips-phantom-lvl .chip-btn').forEach(btn => {
            btn.onclick = () => btn.classList.toggle('selected');
        });
    }

    window.toggleAllJobGroup = function (groupId, state) {
        document.querySelectorAll(`.chips-group[data-group="${groupId}"] .chip-btn`).forEach(b => {
            b.classList.toggle('selected', state);
        });
    };

    window.toggleAllJobs = function (type, state) {
        const id = type === 'phantom_exp' ? 'chips-phantom-exp' : 'chips-phantom-lvl';
        document.querySelectorAll(`#${id} .chip-btn`).forEach(b => {
            b.classList.toggle('selected', state);
        });
    };

    // ── Form Submission ──────────────────────────────────────────────────────────

    async function submitSignup() {
        const alertBox = document.getElementById('signup-status-alert');
        const submitBtn = document.getElementById('btn-submit-form');

        if (!selectedEvent) {
            showStatusAlert('Please select an upcoming run first.', 'error');
            return;
        }

        if (selectedEvent.is_closed) {
            showStatusAlert(`🔒 Cannot submit: signups for "${selectedEvent.name}" have been closed by the hosts.`, 'error');
            return;
        }

        const charName = document.getElementById('input-char-name').value.trim();
        const discordName = document.getElementById('input-discord-name').value.trim();

        if (!charName) {
            showStatusAlert('Please enter your full in-game character name.', 'error');
            return;
        }

        if (!discordName) {
            showStatusAlert('Please enter your Discord username.', 'error');
            return;
        }

        const preferredRoleBtn = document.querySelector('#preferred-role-chips .chip-btn.selected');
        const preferredRole = preferredRoleBtn ? preferredRoleBtn.getAttribute('data-role') : 'Any';

        const playableRoles = getSelectedPlayableRoles();
        if (playableRoles.length === 0) {
            showStatusAlert('Please select at least one playable role.', 'error');
            return;
        }

        const payload = {
            event_id: selectedEvent.id,
            run_name: selectedEvent.name,
            start_time: selectedEvent.start_time,
            content_type: selectedEvent.content_type,
            day: selectedEvent.day,
            ingame_name: charName,
            discord_username: discordName,
            preferred_role: preferredRole,
            playable_roles: playableRoles,
            party_preference: document.getElementById('input-party-pref').value,
            prog_point: document.getElementById('input-prog-point').value,
            friend_group: document.getElementById('input-friend-group').value.trim(),
            notes: document.getElementById('input-notes').value.trim()
        };

        // Collect Content-Specific Fields
        if (selectedEvent.content_type === 'Chaotic') {
            function getGroupJobs(group) {
                return Array.from(document.querySelectorAll(`.chips-group[data-group="${group}"] .chip-btn.selected`))
                    .map(b => b.getAttribute('data-job'));
            }
            payload.tanks = getGroupJobs('tanks');
            payload.healers = getGroupJobs('healers');
            payload.melee_dps = getGroupJobs('melee_dps');
            payload.magical_dps = getGroupJobs('magical_dps');
            payload.phys_ranged_dps = getGroupJobs('phys_ranged_dps');

        } else if (selectedEvent.content_type === 'FT:B' || selectedEvent.content_type === 'FT:M') {
            payload.phantom_jobs_exp = Array.from(document.querySelectorAll('#chips-phantom-exp .chip-btn.selected')).map(b => b.getAttribute('data-job'));
            payload.phantom_jobs_lvl = Array.from(document.querySelectorAll('#chips-phantom-lvl .chip-btn.selected')).map(b => b.getAttribute('data-job'));

        } else if (selectedEvent.content_type === 'BA') {
            payload.logos_actions_exp = Array.from(document.querySelectorAll('#chips-logos-exp .chip-btn.selected')).map(b => b.getAttribute('data-action'));
            payload.logos_try_new = document.getElementById('input-logos-try').value;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-outlined" style="animation: spin 1s infinite linear;">sync</span> Submitting...`;

        const token = localStorage.getItem('alnr_session_token');

        try {
            const res = await fetch(`${getApiUrl()}/api/public/signups/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Submission failed');

            showStatusAlert(`🎉 ${data.message || 'Signup recorded successfully!'}`, 'success');
            loadMySignups();
            loadEvents(); // Refresh signup counts

        } catch (err) {
            console.error('[Signups Submit Error]', err);
            showStatusAlert(`Submission Error: ${err.message}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Submit Signup</span><span class="material-symbols-outlined">send</span>`;
        }
    }

    async function loadMySignups() {
        const token = localStorage.getItem('alnr_session_token');
        if (!token) return;

        const container = document.getElementById('my-signups-card');
        const list = document.getElementById('my-signups-list');
        if (!container || !list) return;

        try {
            const res = await fetch(`${getApiUrl()}/api/public/signups/my`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (data.signups && data.signups.length > 0) {
                    container.style.display = 'block';
                    list.innerHTML = data.signups.map(s => `
                        <div class="my-signup-item">
                            <div>
                                <strong style="color: var(--accent-rose);">${escapeHtml(s.tab_name)}</strong>
                                <span style="font-size: 0.85rem; color: var(--text-secondary); margin-left: 8px;">Character: ${escapeHtml(s.character_name)}</span>
                            </div>
                            <div style="font-size: 0.82rem; color: var(--accent-teal);">
                                Preferred: ${escapeHtml(s.preferred_role || 'Any')}
                            </div>
                        </div>
                    `).join('');
                } else {
                    container.style.display = 'none';
                }
            }
        } catch (e) {
            console.warn('[My Signups]', e);
        }
    }

    function showStatusAlert(msg, type) {
        const alertBox = document.getElementById('signup-status-alert');
        if (!alertBox) return;
        alertBox.className = `status-alert ${type}`;
        alertBox.innerHTML = `
            <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
            <span>${escapeHtml(msg)}</span>
        `;
        alertBox.style.display = 'flex';
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // ── Init on DOM Ready ────────────────────────────────────────────────────────

    document.addEventListener('DOMContentLoaded', async () => {
        // 1. Auth code check & verify session
        await handleAuthCodeIfPresent();
        if (!currentUser) {
            await verifyExistingSession();
        }
        renderAuthBanner();

        // 2. Load events
        loadEvents();
        loadMySignups();

        // 3. Category Filter Buttons
        document.querySelectorAll('.filter-pill').forEach(pill => {
            pill.onclick = () => {
                document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                activeFilter = pill.getAttribute('data-filter');
                renderEventsGrid();
            };
        });

        // 4. Submit button
        const submitBtn = document.getElementById('btn-submit-form');
        if (submitBtn) {
            submitBtn.onclick = submitSignup;
        }
    });
})();
