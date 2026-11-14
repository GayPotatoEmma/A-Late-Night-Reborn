// Dynamic Run Signups Module for A Late Night Reborn

(function () {
    const DISCORD_CLIENT_ID = "1526282207185080411";

    function getApiUrl() {
        return 'https://api.alatenightreborn.com';
    }

    let currentUser = null;
    let allEvents = [];
    let selectedEvent = null;
    let activeFilter = 'all';
    let mySignupsList = [];
    let activePrefsTab = 'Chaotic';
    let prefsModalInitialSnapshot = '';
    let phantomWarningContext = 'form'; // 'form' or 'modal'

    // ── Saved Preferences & Schema Versioning ────────────────────────────────────
    const PREFS_STORAGE_KEY = 'alnr_signup_preferences_v1';
    const CONTENT_TYPES = ['Chaotic', 'FT:B', 'FT:M', 'BA', 'DRS'];
    const CONTENT_SCHEMA_VERSIONS = {
        'Chaotic': 1,
        'FT:B': 1,
        'FT:M': 1,
        'BA': 1,
        'DRS': 1
    };

    const BA_LOGOS_ACTIONS = [
        'Perception (Finding Traps)',
        'Spirit Dart (Vulnerability)',
        'Feint (Evasion)',
        'Dispel (Buff Removal)',
        'Bravery (Buffs)',
        'Refresh (Magia Wheel)'
    ];

    const DRS_LOST_ACTIONS = [
        'Perception (Finding Traps)',
        'Rend Armor (Vulnerability)',
        'Banish (Phantom Vulnerability)',
        'Flare Star (BLM DoT)',
        'Dispel (Buff Removal)',
        'Cure IV (Party Bravery)'
    ];

    const DRS_DUEL_OPTIONS = [
        'No',
        "Yes and I'm experienced",
        "Yes but it's my first time"
    ];

    function getPartyOptionsForContent(contentType) {
        if (contentType === 'Chaotic') {
            return [
                { value: 'Any', label: 'Any Party' },
                { value: 'A', label: 'Party A' },
                { value: 'B', label: 'Party B' },
                { value: 'C', label: 'Party C' }
            ];
        } else if (contentType === 'DRS') {
            return [
                { value: 'Any', label: 'Any Party' },
                { value: 'A (Slimes)', label: 'A (Slimes)' },
                { value: 'B (Slimes)', label: 'B (Slimes)' },
                { value: 'C (Slimes)', label: 'C (Slimes)' },
                { value: '1 (Golems)', label: '1 (Golems)' },
                { value: '2 (Golems)', label: '2 (Golems)' },
                { value: '3 (Golems)', label: '3 (Golems)' }
            ];
        }
        return [
            { value: 'Any', label: 'Any Party' },
            { value: 'A', label: 'Party A' },
            { value: 'B', label: 'Party B' },
            { value: 'C', label: 'Party C' },
            { value: '1', label: 'Party 1' },
            { value: '2', label: 'Party 2' },
            { value: '3', label: 'Party 3' }
        ];
    }

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

    const REGEN_HEALER_JOBS = ['White Mage', 'Astrologian'];
    const SHIELD_HEALER_JOBS = ['Scholar', 'Sage'];

    const JOBS_BY_ROLE = {
        'Tank': ['Paladin', 'Warrior', 'Dark Knight', 'Gunbreaker'],
        'Healer': ['White Mage', 'Astrologian', 'Scholar', 'Sage'],
        'Melee DPS': ['Monk', 'Dragoon', 'Ninja', 'Samurai', 'Reaper', 'Viper'],
        'Magical DPS': ['Black Mage', 'Summoner', 'Red Mage', 'Pictomancer'],
        'Physical Ranged DPS': ['Bard', 'Machinist', 'Dancer']
    };

    const PHANTOM_JOBS = [
        'Bard', 'Berserker', 'Black Mage', 'Blue Mage', 'Cannoneer', 
        'Chemist', 'Dancer', 'Dragoon', 'Geomancer', 'Gladiator', 
        'Knight', 'Monk', 'Mystic Knight', 'Necromancer', 'Ninja', 
        'Oracle', 'Ranger', 'Red Mage', 'Samurai', 'Summoner', 
        'Thief', 'Time Mage', 'White Mage'
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
        ],
        'DRS': [
            'No Experience', 'Seen Trinity Seeker', "Seen Queen's Guard",
            'Seen Trinity Avowed', 'Seen the Queen', 'Cleared 1-4 times', 'Cleared 5+ times'
        ]
    };

    // ── OAuth2 Flow Handlers ─────────────────────────────────────────────────────

    function getRedirectUri() {
        return window.location.origin + window.location.pathname;
    }

    function generateOAuthState() {
        try {
            const array = new Uint8Array(16);
            window.crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        } catch (e) {
            return Math.random().toString(36).substring(2) + Date.now().toString(36);
        }
    }

    function initiateDiscordLogin() {
        const redirect = encodeURIComponent(getRedirectUri());
        const state = generateOAuthState();
        try {
            sessionStorage.setItem('alnr_oauth_state', state);
            const params = new URLSearchParams(window.location.search);
            const runToSave = (selectedEvent && selectedEvent.id) || params.get('event') || params.get('run');
            if (runToSave) {
                sessionStorage.setItem('alnr_oauth_run', runToSave);
            }
        } catch (e) {
            console.warn('[Signups Auth] Could not store oauth state:', e);
        }
        const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${redirect}&scope=identify&state=${encodeURIComponent(state)}`;
        window.location.href = oauthUrl;
    }

    async function signOut() {
        // 1. Invalidate session token on server and clear session cookies
        try {
            await fetch(`${getApiUrl()}/api/public/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include'
            });
        } catch (err) {
            console.warn('[Signups Auth] Logout request error:', err);
        }

        // 2. Wipe client storage & in-memory session
        localStorage.removeItem('alnr_session_token');
        try {
            sessionStorage.removeItem('alnr_oauth_state');
            sessionStorage.removeItem('alnr_oauth_run');
        } catch (e) {}
        currentUser = null;
        mySignupsList = [];

        // 3. Clear and hide "My Active Signups" list
        const mySignupsCard = document.getElementById('my-signups-card');
        const mySignupsListEl = document.getElementById('my-signups-list');
        if (mySignupsCard) mySignupsCard.style.display = 'none';
        if (mySignupsListEl) mySignupsListEl.innerHTML = '';

        // 4. Close any open Application Details modal & wipe body
        closeApplicationModal();
        const modalBody = document.getElementById('modal-details-body');
        if (modalBody) modalBody.innerHTML = '';

        // 5. Reset user input fields
        const charNameInput = document.getElementById('input-char-name');
        const discordInput = document.getElementById('input-discord-name');
        const friendGroupInput = document.getElementById('input-friend-group');
        const notesInput = document.getElementById('input-notes');
        if (charNameInput) charNameInput.value = '';
        if (discordInput) {
            discordInput.value = '';
            discordInput.disabled = false;
        }
        if (friendGroupInput) friendGroupInput.value = '';
        if (notesInput) notesInput.value = '';

        // 6. Reset already registered notice & status alerts
        const alreadyRegisteredBox = document.getElementById('signup-already-registered-box');
        if (alreadyRegisteredBox) alreadyRegisteredBox.style.display = 'none';
        hideStatusAlert();

        // 7. Re-render UI
        renderAuthBanner();
        renderFormInputs();
    }

    async function handleAuthCodeIfPresent() {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const state = params.get('state');
        if (!code) return;

        // Clean query params from browser URL bar immediately while preserving run/event if present
        let preservedRun = params.get('event') || params.get('run');
        try {
            if (!preservedRun) {
                preservedRun = sessionStorage.getItem('alnr_oauth_run');
            }
        } catch (e) {}
        const cleanUrl = window.location.origin + window.location.pathname + (preservedRun ? `?run=${encodeURIComponent(preservedRun)}` : '');
        window.history.replaceState({}, document.title, cleanUrl);

        // Verify OAuth state to prevent Login CSRF
        let storedState = null;
        try {
            storedState = sessionStorage.getItem('alnr_oauth_state');
            sessionStorage.removeItem('alnr_oauth_state');
        } catch (e) {}

        if (!state || !storedState || state !== storedState) {
            console.error('[Signups Auth] OAuth state verification failed.');
            showStatusAlert('Authentication failed: Security state verification mismatch. Please try signing in again.', 'error');
            return;
        }

        showStatusAlert('Authenticating with Discord...', 'info');

        try {
            const res = await fetch(`${getApiUrl()}/api/public/auth/discord`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify({ code: code, redirect_uri: getRedirectUri() })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Discord authentication failed.');
            }

            const data = await res.json();
            currentUser = data.user;
            showStatusAlert(`Welcome back, ${currentUser.global_name || currentUser.username}!`, 'success');
        } catch (err) {
            console.error('[Signups Auth]', err);
            showStatusAlert(`Login Error: ${err.message}`, 'error');
        }
    }

    async function verifyExistingSession() {
        try {
            const res = await fetch(`${getApiUrl()}/api/public/auth/me`, {
                credentials: 'include'
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
            container.innerHTML = '';
            container.style.display = 'none';
        } else if (!currentUser.is_in_guild) {
            container.style.display = 'block';
            container.innerHTML = `
                <div class="glass-card" style="border-color: rgba(245, 158, 11, 0.4); background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(20, 21, 50, 0.6) 100%); display: flex; align-items: center; justify-content: space-between; gap: 1.25rem; flex-wrap: wrap;">
                    <div class="auth-info-left">
                        <div>
                            <div style="font-weight: 700; font-size: 1.05rem; color: var(--text-primary);">Join us on Discord to Sign Up</div>
                            <div style="font-size: 0.86rem; color: var(--text-secondary); margin-top: 2px;">
                                You are connected as @${escapeHtml(currentUser.username)}, but not in the server. Please join <strong style="color: var(--accent-rose);">discord.gg/alnr</strong> to sign up.
                            </div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                        <a href="https://discord.gg/alnr" target="_blank" rel="noopener" class="auth-btn-discord" style="padding: 0.65rem 1.25rem;">
                            <span>Join server</span>
                            <span class="material-symbols-outlined" style="font-size: 1.1rem;">open_in_new</span>
                        </a>
                        <button class="btn-signout" id="btn-discord-signout" type="button">Sign Out</button>
                    </div>
                </div>
            `;
            document.getElementById('btn-discord-signout').onclick = signOut;
        } else {
            container.style.display = 'block';
            const verifiedBadge = currentUser.is_verified 
                ? `<span class="badge-verified"><span class="material-symbols-outlined" style="font-size: 1rem;">verified</span> Verified</span>`
                : `<span class="badge-unverified"><span class="material-symbols-outlined" style="font-size: 1rem;">warning</span> Unverified in Discord</span>`;

            const charInfo = currentUser.character_name 
                ? `Character: <strong style="color: var(--text-primary);">${escapeHtml(currentUser.character_name)}</strong> ${currentUser.server ? `(${escapeHtml(currentUser.server)})` : ''}`
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
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${(currentUser.can_access_dashboard || currentUser.dashboard_role || currentUser.is_owner) ? `
                        <a href="dashboard.html" class="btn-prefs-cog" id="btn-open-dashboard" aria-label="Dashboard" title="Dashboard" style="text-decoration: none;">
                            <span class="material-symbols-outlined">bolt</span>
                        </a>
                        ` : ''}
                        <button type="button" class="btn-prefs-cog" id="btn-open-prefs-modal" aria-label="Raid signup preferences" title="Saved Signup Preferences">
                            <span class="material-symbols-outlined">settings</span>
                            <span class="prefs-outdated-badge" id="prefs-outdated-badge" style="display: none;" title="Saved preferences need updating">!</span>
                        </button>
                        <button class="btn-signout" id="btn-discord-signout" type="button">Sign Out</button>
                    </div>
                </div>
            `;
            document.getElementById('btn-discord-signout').onclick = signOut;
            const openPrefsBtn = document.getElementById('btn-open-prefs-modal');
            if (openPrefsBtn) openPrefsBtn.onclick = () => openPrefsModal();
            updatePrefsCogBadge();
        }

        updateSignupAuthVisibility();
    }

    function updateSignupAuthVisibility() {
        const fieldsSection = document.getElementById('signup-fields-section');
        const connectPrompt = document.getElementById('signup-connect-prompt');
        const alreadyRegisteredBox = document.getElementById('signup-already-registered-box');
        const fullWarningBanner = document.getElementById('selected-run-full-warning');
        const fullWarningCounts = document.getElementById('selected-run-full-counts');
        const promptIcon = connectPrompt ? connectPrompt.querySelector('.signup-connect-icon') : null;
        const promptTitle = document.getElementById('signup-connect-title');
        const promptDesc = document.getElementById('signup-connect-desc');
        const promptAction = document.getElementById('signup-connect-action');

        let isAlreadySignedUp = false;

        if (currentUser && currentUser.is_in_guild) {
            if (connectPrompt) connectPrompt.style.display = 'none';

            // Check if user is already signed up for the selected run block
            const existingSignup = selectedEvent ? mySignupsList.find(s => {
                if (s.event_id && selectedEvent.id && s.event_id === selectedEvent.id) return true;
                if (s.run_key && selectedEvent.run_key && s.run_key === selectedEvent.run_key && (!s.content_type || s.content_type === selectedEvent.content_type)) return true;
                if (s.tab_name && selectedEvent.tab_name && s.tab_name === selectedEvent.tab_name) return true;
                return false;
            }) : null;

            if (existingSignup) {
                isAlreadySignedUp = true;
                if (fieldsSection) fieldsSection.style.display = 'none';
                if (alreadyRegisteredBox) {
                    alreadyRegisteredBox.style.display = 'flex';
                    const titleEl = document.getElementById('already-registered-title');
                    const descEl = document.getElementById('already-registered-desc');
                    const charText = existingSignup.character_name ? ` as <strong>${escapeHtml(existingSignup.character_name)}</strong>` : '';
                    if (titleEl) {
                        titleEl.innerHTML = `You're already signed up for this run${charText}.`;
                    }
                    if (descEl) {
                        descEl.innerHTML = `Need to change something? Please make a ticket in our <a href="https://discord.gg/alnr" target="_blank" rel="noopener" style="color: var(--accent-rose); font-weight: 600; text-decoration: underline;">Discord</a>.`;
                    }
                }
            } else {
                if (alreadyRegisteredBox) alreadyRegisteredBox.style.display = 'none';
                if (fieldsSection) fieldsSection.style.display = 'block';
            }

        } else if (currentUser && !currentUser.is_in_guild) {
            if (fieldsSection) fieldsSection.style.display = 'none';
            if (alreadyRegisteredBox) alreadyRegisteredBox.style.display = 'none';
            if (connectPrompt) {
                connectPrompt.style.display = 'flex';
                if (promptIcon) {
                    promptIcon.style.display = 'none';
                }
                if (promptTitle) promptTitle.textContent = 'Join us on Discord to Sign Up';
                if (promptDesc) {
                    promptDesc.innerHTML = `You are signed in as <strong>@${escapeHtml(currentUser.username)}</strong>, but you must be a member of the A Late Night Reborn Discord server so raid leads can contact you for rosters.`;
                }
                if (promptAction) {
                    promptAction.innerHTML = `
                        <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; align-items: center;">
                            <a href="https://discord.gg/alnr" target="_blank" rel="noopener" class="auth-btn-discord">
                                <span>Join server</span>
                                <span class="material-symbols-outlined" style="font-size: 1.1rem;">open_in_new</span>
                            </a>
                            <button type="button" class="btn-signout" id="btn-recheck-guild">Re-check Status</button>
                        </div>
                    `;
                    const recheckBtn = document.getElementById('btn-recheck-guild');
                    if (recheckBtn) {
                        recheckBtn.onclick = async () => {
                            recheckBtn.disabled = true;
                            recheckBtn.textContent = 'Checking...';
                            await verifyExistingSession();
                            renderAuthBanner();
                            if (currentUser && currentUser.is_in_guild) {
                                renderFormInputs();
                            }
                        };
                    }
                }
            }
        } else {
            if (fieldsSection) fieldsSection.style.display = 'none';
            if (alreadyRegisteredBox) alreadyRegisteredBox.style.display = 'none';
            if (connectPrompt) {
                connectPrompt.style.display = 'flex';
                if (promptIcon) {
                    promptIcon.style.display = '';
                    promptIcon.style.background = '#5865F2';
                    promptIcon.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>`;
                }
                if (promptTitle) promptTitle.textContent = 'Connect Discord to Sign Up';
                if (promptDesc) promptDesc.textContent = 'Please connect your Discord account to continue with your signup.';
                if (promptAction) {
                    promptAction.innerHTML = `
                        <button type="button" class="auth-btn-discord" id="btn-discord-login-inline">
                            <span>Connect Discord</span>
                            <span class="material-symbols-outlined" style="font-size: 1.2rem;">login</span>
                        </button>
                    `;
                    const inlineBtn = document.getElementById('btn-discord-login-inline');
                    if (inlineBtn) inlineBtn.onclick = initiateDiscordLogin;
                }
            }
        }

        if (fullWarningBanner) {
            if (selectedEvent && selectedEvent.is_roster_full && !isAlreadySignedUp) {
                const maxSlots = selectedEvent.max_slots || (selectedEvent.content_type === 'Chaotic' ? 24 : 48);
                const rosterCount = selectedEvent.roster_count || maxSlots;
                if (fullWarningCounts) {
                    fullWarningCounts.textContent = `${rosterCount}/${maxSlots}`;
                }
                fullWarningBanner.style.display = 'flex';
            } else {
                fullWarningBanner.style.display = 'none';
            }
        }
    }

    // ── Fetching & Rendering Events ──────────────────────────────────────────────

    function normalizeEvent(ev) {
        // 1. Detect Content Type
        let ct = ev.content_type;
        const text = ((ev.tab_name || '') + ' ' + (ev.name || '')).toUpperCase();

        if (text.includes('CHAOTIC') || text.includes('[C]')) {
            ct = 'Chaotic';
        } else if (text.includes('[DRS]') || text.includes('DRS') || text.includes('DELUBRUM')) {
            ct = 'DRS';
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
        else if (ct === 'DRS') catKey = 'drs';
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
            .replace(/^\[.*?\]\s*[-:]?\s*/, '')
            .replace(/^(Forked Tower:\s*(Blood|Magic)|Cloud of Darkness\s*\(Chaotic\)|Baldesion Arsenal|Delubrum Reginae\s*(?:\(Savage\))?)\s*[-:]?\s*/i, '')
            .trim() || name;
    }

    function formatRunDateTime(ev) {
        if (!ev) return '';
        if (!ev.start_time) return ev.start_time_formatted || '';

        // Normalize :58/:59 -> :00 next hour and :28/:29 -> :30 so 21:59 UTC displays cleanly as 22:00 UTC (22ST)
        let d = new Date(ev.start_time * 1000);
        d.setUTCSeconds(0, 0);
        const rawUtcMins = d.getUTCMinutes();
        if (rawUtcMins >= 58) {
            d = new Date(d.getTime() + (60 - rawUtcMins) * 60000);
        } else if (rawUtcMins >= 28 && rawUtcMins <= 29) {
            d = new Date(d.getTime() + (30 - rawUtcMins) * 60000);
        } else if (rawUtcMins <= 2) {
            d = new Date(d.getTime() - rawUtcMins * 60000);
        } else if (rawUtcMins >= 31 && rawUtcMins <= 32) {
            d = new Date(d.getTime() - (rawUtcMins - 30) * 60000);
        }

        // Local date parts
        const dayName = d.toLocaleDateString(undefined, { weekday: 'long' });
        const dayNum = d.getDate();
        const monthName = d.toLocaleDateString(undefined, { month: 'long' });

        // Local time: HH:mm
        const localHours = String(d.getHours()).padStart(2, '0');
        const localMins = String(d.getMinutes()).padStart(2, '0');
        const localTime = `${localHours}:${localMins}`;

        // Server time (UTC) rounded to nearest hour or half-hour: e.g. 22ST or 15:30ST
        let serverTime = ev.rounded_st || '';
        if (!serverTime) {
            const roundedHalfHrSec = Math.round((d.getTime() / 1000) / 1800) * 1800;
            const stDate = new Date(roundedHalfHrSec * 1000);
            const utcHours = stDate.getUTCHours();
            const utcMins = stDate.getUTCMinutes();
            serverTime = utcMins === 0 ? `${utcHours}ST` : `${utcHours}:${String(utcMins).padStart(2, '0')}ST`;
        }

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
            } else if (ev.content_type === 'DRS') {
                typeBadgeClass = 'drs';
                badgeLabel = 'DRS';
            }

            const isDisabled = Boolean(ev.is_closed || ev.is_cancelled);
            const maxSlots = ev.max_slots || (ev.content_type === 'Chaotic' ? 24 : 48);
            const rosterCount = ev.roster_count || maxSlots;
            const fullTooltip = `Main roster is full (${rosterCount}/${maxSlots}) - signups are still open for backups`;
            const statusBadge = ev.is_cancelled
                ? `<span class="run-cancelled-badge"><span class="material-symbols-outlined" style="font-size: 0.95rem;">cancel</span> Cancelled</span>`
                : ev.is_closed
                    ? `<span class="run-closed-badge"><span class="material-symbols-outlined" style="font-size: 0.95rem;">lock</span> Closed (${ev.signup_count})</span>`
                    : `<span class="run-card-count">${ev.is_roster_full ? `<span class="run-backups-icon" data-tooltip="${escapeHtml(fullTooltip)}" aria-label="${escapeHtml(fullTooltip)}"><span class="material-symbols-outlined">warning</span></span>` : ''}<span class="material-symbols-outlined" style="font-size: 1rem;">group</span> ${ev.signup_count} signed up</span>`;

            const cardTitleAttr = ev.is_cancelled
                ? 'This run has been cancelled'
                : (ev.is_closed ? 'Signups for this run are closed' : '');

            const matchedMySignup = currentUser ? mySignupsList.find(s =>
                (s.event_id && ev.id && s.event_id === ev.id) ||
                (s.run_key && ev.run_key && s.run_key === ev.run_key && (!s.content_type || s.content_type === ev.content_type)) ||
                (s.tab_name && ev.tab_name && s.tab_name === ev.tab_name)
            ) : null;

            let userPillHtml = '';
            if (matchedMySignup && !ev.is_cancelled) {
                if (matchedMySignup.roster_status === 'selected') {
                    const pLbl = matchedMySignup.assigned_party_label || 'Selected';
                    userPillHtml = `<span class="run-user-status-pill is-selected"><span class="material-symbols-outlined" style="font-size: 0.86rem;">verified</span> ${escapeHtml(pLbl)}</span>`;
                } else if (matchedMySignup.roster_status === 'standby') {
                    userPillHtml = `<span class="run-user-status-pill is-standby"><span class="material-symbols-outlined" style="font-size: 0.86rem;">hourglass_top</span> Backup</span>`;
                } else {
                    userPillHtml = `<span class="run-user-status-pill is-pending"><span class="material-symbols-outlined" style="font-size: 0.86rem;">check_circle</span> Signed Up</span>`;
                }
            }

            return `
                <div class="run-select-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'is-closed' : ''} ${ev.is_cancelled ? 'is-cancelled' : ''}" data-run-id="${ev.id}" role="button" tabindex="${isDisabled ? '-1' : '0'}" aria-disabled="${isDisabled ? 'true' : 'false'}" aria-pressed="${isSelected ? 'true' : 'false'}" title="${cardTitleAttr}">
                    <div class="run-card-top">
                        <div class="run-card-header-left">
                            <span class="run-type-badge ${typeBadgeClass}">${badgeLabel}</span>
                            <span class="run-card-title">${escapeHtml(cleanRunTitle(ev.name))}</span>
                        </div>
                        ${statusBadge}
                    </div>
                    <div class="run-card-time" style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                        <span style="display: inline-flex; align-items: center; gap: 5px;">
                            <span class="material-symbols-outlined" style="font-size: 0.95rem;">schedule</span>
                            ${escapeHtml(formatRunDateTime(ev))}
                        </span>
                        ${userPillHtml}
                    </div>
                </div>
            `;
        }).join('');

        // Attach click & keyboard handlers
        grid.querySelectorAll('.run-select-card').forEach(card => {
            function activateCard() {
                const runId = card.getAttribute('data-run-id');
                const target = allEvents.find(e => e.id === runId);
                if (!target) return;
                if (target.is_cancelled) {
                    showRunsSelectionAlert(`🚫 "${cleanRunTitle(target.name)}" has been cancelled.`, 'error');
                    return;
                }
                if (target.is_closed) {
                    showRunsSelectionAlert(`🔒 Signups for "${cleanRunTitle(target.name)}" have been closed by the hosts.`, 'error');
                    return;
                }
                hideRunsSelectionAlert();
                selectRun(target);
            }
            card.onclick = activateCard;
            card.onkeydown = (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    activateCard();
                }
            };
        });
    }

    function selectRun(ev) {
        if (ev.is_cancelled) {
            showRunsSelectionAlert(`🚫 "${cleanRunTitle(ev.name)}" has been cancelled.`, 'error');
            return;
        }
        if (ev.is_closed) {
            showRunsSelectionAlert(`🔒 Signups for "${cleanRunTitle(ev.name)}" are closed.`, 'error');
            return;
        }
        hideRunsSelectionAlert();
        hideStatusAlert();
        selectedEvent = ev;
        renderEventsGrid();
        
        // Show Form Card & Hide Desktop Empty Placeholder
        const emptyPlaceholder = document.getElementById('signup-empty-placeholder');
        if (emptyPlaceholder) {
            emptyPlaceholder.style.display = 'none';
        }
        const formCard = document.getElementById('signup-form-card');
        if (formCard) {
            formCard.style.display = 'block';
            if (window.innerWidth < 1024) {
                formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        document.getElementById('selected-run-banner').textContent = `${ev.content_type} | ${cleanRunTitle(ev.name)} (${formatRunDateTime(ev)})`;
        renderFormInputs();
        updateSignupAuthVisibility();
    }

    function checkUrlPreselection() {
        const params = new URLSearchParams(window.location.search);
        let runId = params.get('event') || params.get('run') || params.get('run_key');
        try {
            if (!runId) {
                runId = sessionStorage.getItem('alnr_oauth_run');
            }
            sessionStorage.removeItem('alnr_oauth_run');
        } catch (e) {}

        if (runId && allEvents.length > 0) {
            const target = allEvents.find(e => e.id === runId || (e.run_key && e.run_key === runId));
            if (target) {
                if (target.is_cancelled) {
                    showRunsSelectionAlert(`🚫 "${cleanRunTitle(target.name)}" has been cancelled.`, 'error');
                } else if (target.is_closed) {
                    showRunsSelectionAlert(`🔒 Signups for "${cleanRunTitle(target.name)}" have been closed by the hosts.`, 'error');
                } else {
                    hideRunsSelectionAlert();
                    if (target.category_key && activeFilter !== target.category_key) {
                        activeFilter = target.category_key;
                        document.querySelectorAll('.filter-pill').forEach(p => {
                            p.classList.toggle('active', p.getAttribute('data-filter') === target.category_key);
                        });
                        renderEventsGrid();
                    }
                    selectRun(target);
                }
            }
        }
    }

    // ── Dynamic Form Rendering ───────────────────────────────────────────────────

    function setChipSelected(btn, state) {
        btn.classList.toggle('selected', state);
        btn.setAttribute('aria-pressed', state ? 'true' : 'false');
    }

    function toggleChipSelected(btn) {
        const state = btn.classList.toggle('selected');
        btn.setAttribute('aria-pressed', state ? 'true' : 'false');
        return state;
    }

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

        // Reset Friend Group and Additional Notes
        const friendGroupInput = document.getElementById('input-friend-group');
        const notesInput = document.getElementById('input-notes');
        if (friendGroupInput) {
            friendGroupInput.value = '';
            validateFriendGroup();
        }
        if (notesInput) {
            notesInput.value = '';
            validateNotes();
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
        renderDynamicJobSections();

        // Update inline checkbox label & apply saved preferences if present
        const saveChkText = document.getElementById('chk-save-prefs-text');
        if (saveChkText) {
            saveChkText.textContent = `Save as my default preferences for ${contentType} on this device`;
        }
        applySavedPrefsToStep2Form(contentType);
    }

    function renderPreferredRoles() {
        const container = document.getElementById('preferred-role-chips');
        if (!container) return;

        container.innerHTML = ALL_ROLES.map(r => `
            <button type="button" class="chip-btn ${r.class}" data-role="${r.id}" aria-pressed="false">
                ${r.label}
            </button>
        `).join('');

        container.querySelectorAll('.chip-btn').forEach(btn => {
            btn.onclick = () => {
                container.querySelectorAll('.chip-btn').forEach(b => setChipSelected(b, false));
                setChipSelected(btn, true);

                const roleId = btn.getAttribute('data-role');
                const playableContainer = document.getElementById('playable-roles-chips');
                if (playableContainer && roleId) {
                    // Clear any playable role that was only active because of the previous preferred role
                    playableContainer.querySelectorAll('.chip-btn[data-auto-preferred="true"]').forEach(b => {
                        b.removeAttribute('data-auto-preferred');
                        setChipSelected(b, false);
                    });

                    if (roleId !== 'Any') {
                        const matchBtn = playableContainer.querySelector(`.chip-btn[data-role="${roleId}"]`);
                        if (matchBtn && !matchBtn.classList.contains('selected')) {
                            setChipSelected(matchBtn, true);
                            matchBtn.setAttribute('data-auto-preferred', 'true');
                        }
                    }
                    syncChaoticRoleVisibility();
                }
            };
        });

        // Default select 'Any'
        const defaultBtn = container.querySelector('[data-role="Any"]');
        if (defaultBtn) setChipSelected(defaultBtn, true);
    }

    function renderPlayableRoles() {
        const container = document.getElementById('playable-roles-chips');
        if (!container) return;

        container.innerHTML = ALL_ROLES.map(r => `
            <button type="button" class="chip-btn ${r.class}" data-role="${r.id}" aria-pressed="false">
                ${r.label}
            </button>
        `).join('');

        container.querySelectorAll('.chip-btn').forEach(btn => {
            btn.onclick = () => {
                const roleId = btn.getAttribute('data-role');
                btn.removeAttribute('data-auto-preferred');
                if (roleId === 'Any') {
                    // Toggle Any
                    const isSelected = toggleChipSelected(btn);
                    if (isSelected) {
                        container.querySelectorAll('.chip-btn:not([data-role="Any"])').forEach(b => {
                            b.removeAttribute('data-auto-preferred');
                            setChipSelected(b, true);
                        });
                    }
                } else {
                    toggleChipSelected(btn);
                }
                syncChaoticRoleVisibility();
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
        select.innerHTML = `<option value="" disabled selected>Select your progression point...</option>` +
            options.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('');
        select.value = '';
    }

    function renderPartyPreferences(contentType) {
        const container = document.getElementById('party-pref-chips');
        if (!container) return;

        const options = getPartyOptionsForContent(contentType);

        container.innerHTML = options.map(o => `
            <button type="button" class="chip-btn ${o.value === 'Any' ? 'selected' : ''}" data-party="${escapeHtml(o.value)}" aria-pressed="${o.value === 'Any' ? 'true' : 'false'}">
                ${escapeHtml(o.label)}
            </button>
        `).join('');

        container.querySelectorAll('.chip-btn').forEach(btn => {
            btn.onclick = () => {
                const partyVal = btn.getAttribute('data-party');
                const anyBtn = container.querySelector('[data-party="Any"]');
                const specificBtns = Array.from(container.querySelectorAll('.chip-btn:not([data-party="Any"])'));

                if (partyVal === 'Any') {
                    // Selecting Any Party deselects all specific party chips
                    if (anyBtn) setChipSelected(anyBtn, true);
                    specificBtns.forEach(b => setChipSelected(b, false));
                } else {
                    toggleChipSelected(btn);
                    const anySpecificSelected = specificBtns.some(b => b.classList.contains('selected'));
                    if (anySpecificSelected) {
                        if (anyBtn) setChipSelected(anyBtn, false);
                    } else {
                        // If all specific chips were deselected, fall back to Any Party
                        if (anyBtn) setChipSelected(anyBtn, true);
                    }
                }
            };
        });
    }

    function getSelectedPartyPreferences() {
        const container = document.getElementById('party-pref-chips');
        if (!container) return 'Any';

        const anyBtn = container.querySelector('[data-party="Any"]');
        if (anyBtn && anyBtn.classList.contains('selected')) {
            return 'Any';
        }

        const selected = Array.from(container.querySelectorAll('.chip-btn.selected:not([data-party="Any"])'))
            .map(b => b.getAttribute('data-party'));

        return selected.length > 0 ? selected.join(', ') : 'Any';
    }

    // ── Dynamic Jobs Sections (Chaotic / FT / BA) ────────────────────────────────

    function renderDynamicJobSections() {
        if (!selectedEvent) return;
        const contentType = selectedEvent.content_type;
        const container = document.getElementById('dynamic-jobs-container');
        if (!container) return;

        const playableHint = document.getElementById('playable-roles-hint');
        if (playableHint) {
            playableHint.style.display = (contentType === 'Chaotic') ? 'block' : 'none';
        }

        container.innerHTML = '';

        if (contentType === 'Chaotic') {
            let html = '';
            html += createJobChipsGroup('tanks', 'Tanks You Can Play', JOBS_BY_ROLE['Tank'], 'role-tank');
            html += createJobChipsGroup('healers', 'Healers You Can Play', JOBS_BY_ROLE['Healer'], 'role-healer');
            html += createJobChipsGroup('melee_dps', 'Melee DPS You Can Play', JOBS_BY_ROLE['Melee DPS'], 'role-dps');
            html += createJobChipsGroup('magical_dps', 'Magical DPS You Can Play', JOBS_BY_ROLE['Magical DPS'], 'role-dps');
            html += createJobChipsGroup('phys_ranged_dps', 'Physical Ranged You Can Play', JOBS_BY_ROLE['Physical Ranged DPS'], 'role-dps');

            container.innerHTML = html;
            attachJobChipHandlers();
            syncChaoticRoleVisibility();

        } else if (contentType === 'FT:B' || contentType === 'FT:M') {
            container.innerHTML = `
                <div class="phantom-jobs-dual-grid">
                    <div class="dynamic-jobs-box" data-pref-field="phantom_jobs_exp">
                        <div class="jobs-role-title">
                            <span class="material-symbols-outlined">auto_fix_high</span> Phantom Jobs Experience
                        </div>
                        <div class="form-hint" style="margin-bottom: 0.75rem;">Select the phantom jobs you have previously played in Forked Tower and feel experienced on.</div>
                        <div class="quick-toggle-actions">
                            <button type="button" class="btn-mini-toggle" data-toggle-target="chips-phantom-exp" data-toggle-state="true">Select All</button>
                            <button type="button" class="btn-mini-toggle" data-toggle-target="chips-phantom-exp" data-toggle-state="false">Clear</button>
                        </div>
                        <div class="chips-group" id="chips-phantom-exp">
                            ${PHANTOM_JOBS.map(j => `<button type="button" class="chip-btn" data-job="${escapeHtml(j)}" aria-pressed="false">${escapeHtml(j)}</button>`).join('')}
                        </div>
                    </div>

                    <div class="dynamic-jobs-box" data-pref-field="phantom_jobs_lvl">
                        <div class="jobs-role-title">
                            <span class="material-symbols-outlined">military_tech</span> Phantom Jobs Fully Leveled
                        </div>
                        <div class="form-hint" style="margin-bottom: 0.75rem;">You are required to have at least 6 phantom jobs leveled.</div>
                        <div class="quick-toggle-actions">
                            <button type="button" class="btn-mini-toggle" data-toggle-target="chips-phantom-lvl" data-toggle-state="true">Select All</button>
                            <button type="button" class="btn-mini-toggle" data-toggle-target="chips-phantom-lvl" data-toggle-state="false">Clear</button>
                        </div>
                        <div class="chips-group" id="chips-phantom-lvl">
                            ${PHANTOM_JOBS.map(j => `<button type="button" class="chip-btn" data-job="${escapeHtml(j)}" aria-pressed="false">${escapeHtml(j)}</button>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            attachPhantomChipHandlers();

        } else if (contentType === 'BA') {
            container.innerHTML = `
                <div class="dynamic-jobs-box">
                    <div class="form-group" data-pref-field="logos_actions_exp" style="margin-bottom: 1.25rem;">
                        <div class="jobs-role-title">
                            <span class="material-symbols-outlined">magic_button</span> Logos Actions Experience
                        </div>
                        <div class="chips-group" id="chips-logos-exp">
                            ${BA_LOGOS_ACTIONS.map(a => `<button type="button" class="chip-btn" data-action="${escapeHtml(a)}" aria-pressed="false">${escapeHtml(a)}</button>`).join('')}
                        </div>
                    </div>
                    
                    <div class="form-group" data-pref-field="logos_try_new" style="margin-bottom: 0;">
                        <label class="form-label" for="input-logos-try">Would you like to try any new special Logos Actions?</label>
                        <select id="input-logos-try" class="input-select" style="max-width: 200px;">
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                </div>
            `;
            document.querySelectorAll('#chips-logos-exp .chip-btn').forEach(b => {
                b.onclick = () => toggleChipSelected(b);
            });

        } else if (contentType === 'DRS') {
            container.innerHTML = `
                <div class="dynamic-jobs-box">
                    <div class="form-group" data-pref-field="lost_actions_exp" style="margin-bottom: 1.25rem;">
                        <div class="jobs-role-title">
                            <span class="material-symbols-outlined">magic_button</span> Lost Actions Experience
                        </div>
                        <div class="chips-group" id="chips-lost-exp">
                            ${DRS_LOST_ACTIONS.map(a => `<button type="button" class="chip-btn" data-action="${escapeHtml(a)}" aria-pressed="false">${escapeHtml(a)}</button>`).join('')}
                        </div>
                    </div>

                    <div class="form-grid-2" style="margin-bottom: 0;">
                        <div class="form-group" data-pref-field="lost_try_new" style="margin-bottom: 0;">
                            <label class="form-label" for="input-lost-try">Would you like to try any new special Lost Actions?</label>
                            <select id="input-lost-try" class="input-select">
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>

                        <div class="form-group" data-pref-field="duel" style="margin-bottom: 0;">
                            <label class="form-label" for="input-drs-duel">Would you like to do the Duel?</label>
                            <select id="input-drs-duel" class="input-select">
                                ${DRS_DUEL_OPTIONS.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('')}
                            </select>
                            <div class="form-hint">Optional 1v1 encounter. Winning grants a strong 2-hour buff, but dying locks you out of the rest of the run.</div>
                        </div>
                    </div>
                </div>
            `;
            document.querySelectorAll('#chips-lost-exp .chip-btn').forEach(b => {
                b.onclick = () => toggleChipSelected(b);
            });
        }
    }

    function syncChaoticRoleVisibility() {
        if (!selectedEvent || selectedEvent.content_type !== 'Chaotic') return;
        const selectedRoles = getSelectedPlayableRoles();
        const hasAny = selectedRoles.includes('Any');
        const hasRegen = hasAny || selectedRoles.includes('Regen Healer');
        const hasShield = hasAny || selectedRoles.includes('Shield Healer');

        const groups = [
            { id: 'tanks', active: hasAny || selectedRoles.includes('Tank') },
            { id: 'healers', active: hasRegen || hasShield },
            { id: 'melee_dps', active: hasAny || selectedRoles.includes('Melee DPS') },
            { id: 'magical_dps', active: hasAny || selectedRoles.includes('Magical DPS') },
            { id: 'phys_ranged_dps', active: hasAny || selectedRoles.includes('Physical Ranged DPS') }
        ];

        groups.forEach(g => {
            const el = document.querySelector(`.dynamic-jobs-box[data-role-group="${g.id}"]`);
            if (el) {
                el.style.display = g.active ? 'block' : 'none';
            }
        });

        const healersGroup = document.querySelector('#dynamic-jobs-container .chips-group[data-group="healers"]');
        if (healersGroup) {
            healersGroup.querySelectorAll('.chip-btn').forEach(btn => {
                const job = btn.getAttribute('data-job');
                const isAllowed = (REGEN_HEALER_JOBS.includes(job) && hasRegen) ||
                                  (SHIELD_HEALER_JOBS.includes(job) && hasShield);
                btn.style.display = isAllowed ? '' : 'none';
                if (!isAllowed && btn.classList.contains('selected')) {
                    setChipSelected(btn, false);
                }
            });
        }
    }

    function createJobChipsGroup(groupId, title, jobs, roleClass) {
        return `
            <div class="dynamic-jobs-box" data-role-group="${groupId}" data-pref-field="${groupId}">
                <div class="jobs-role-title">${escapeHtml(title)}</div>
                <div class="quick-toggle-actions">
                    <button type="button" class="btn-mini-toggle" data-toggle-group="${groupId}" data-toggle-state="true">Select All</button>
                    <button type="button" class="btn-mini-toggle" data-toggle-group="${groupId}" data-toggle-state="false">Clear</button>
                </div>
                <div class="chips-group" data-group="${groupId}">
                    ${jobs.map(j => `<button type="button" class="chip-btn ${roleClass}" data-job="${escapeHtml(j)}" aria-pressed="false">${escapeHtml(j)}</button>`).join('')}
                </div>
            </div>
        `;
    }

    function attachJobChipHandlers() {
        document.querySelectorAll('.dynamic-jobs-box .chips-group .chip-btn').forEach(btn => {
            btn.onclick = () => toggleChipSelected(btn);
        });
        document.querySelectorAll('.dynamic-jobs-box .btn-mini-toggle[data-toggle-group]').forEach(btn => {
            btn.onclick = () => {
                const groupId = btn.getAttribute('data-toggle-group');
                const state = btn.getAttribute('data-toggle-state') === 'true';
                document.querySelectorAll(`.chips-group[data-group="${groupId}"] .chip-btn`).forEach(b => {
                    if (state && b.style.display === 'none') {
                        setChipSelected(b, false);
                        return;
                    }
                    setChipSelected(b, state);
                });
            };
        });
    }

    function openPhantomExpWarningModal(context = 'form') {
        phantomWarningContext = context;
        const backdrop = document.getElementById('phantom-exp-warning-backdrop');
        if (!backdrop) return;
        backdrop.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closePhantomExpWarningModal() {
        const backdrop = document.getElementById('phantom-exp-warning-backdrop');
        if (!backdrop) return;
        backdrop.style.display = 'none';
        const prefsModal = document.getElementById('prefs-modal-backdrop');
        if (!prefsModal || prefsModal.style.display === 'none') {
            document.body.style.overflow = '';
        }
    }

    function confirmPhantomExpSelectAll() {
        const selector = phantomWarningContext === 'modal'
            ? '#prefs-chips-phantom-exp .chip-btn'
            : '#chips-phantom-exp .chip-btn';
        document.querySelectorAll(selector).forEach(b => {
            setChipSelected(b, true);
        });
        closePhantomExpWarningModal();
    }

    function attachPhantomChipHandlers() {
        document.querySelectorAll('#chips-phantom-exp .chip-btn, #chips-phantom-lvl .chip-btn').forEach(btn => {
            btn.onclick = () => toggleChipSelected(btn);
        });
        document.querySelectorAll('.dynamic-jobs-box .btn-mini-toggle[data-toggle-target]').forEach(btn => {
            btn.onclick = () => {
                const targetId = btn.getAttribute('data-toggle-target');
                const state = btn.getAttribute('data-toggle-state') === 'true';
                if (targetId === 'chips-phantom-exp' && state) {
                    openPhantomExpWarningModal();
                    return;
                }
                document.querySelectorAll(`#${targetId} .chip-btn`).forEach(b => {
                    setChipSelected(b, state);
                });
            };
        });
    }

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

        if (!currentUser) {
            showStatusAlert('Please connect your Discord account before submitting your signup.', 'error');
            return;
        }

        if (!currentUser.is_in_guild) {
            showStatusAlert('You must join the A Late Night Reborn Discord server (https://discord.gg/alnr) before submitting a signup.', 'error');
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
        if (!preferredRoleBtn) {
            showStatusAlert('Please select your preferred role.', 'error');
            return;
        }
        const preferredRole = preferredRoleBtn.getAttribute('data-role');

        const playableRoles = getSelectedPlayableRoles();
        if (playableRoles.length === 0) {
            showStatusAlert('Please select at least one playable role.', 'error');
            return;
        }

        const partyPref = getSelectedPartyPreferences();
        if (!partyPref) {
            showStatusAlert('Please select your party preference.', 'error');
            return;
        }

        const progSelect = document.getElementById('input-prog-point');
        const progPoint = progSelect ? progSelect.value : '';
        if (!progPoint) {
            showStatusAlert('Please select your furthest progression point.', 'error');
            if (progSelect) progSelect.focus();
            return;
        }

        const friendGroupInput = document.getElementById('input-friend-group');
        const notesInput = document.getElementById('input-notes');
        const friendGroupVal = friendGroupInput ? friendGroupInput.value.trim() : '';
        const notesVal = notesInput ? notesInput.value.trim() : '';

        if (!validateFriendGroup() || friendGroupVal.length > 30) {
            showStatusAlert('Friend group name cannot exceed 30 characters.', 'error');
            validateFriendGroup();
            if (friendGroupInput) friendGroupInput.focus();
            return;
        }

        if (!validateNotes() || notesVal.length > 200) {
            showStatusAlert('Additional notes cannot exceed 200 characters.', 'error');
            validateNotes();
            if (notesInput) notesInput.focus();
            return;
        }

        const payload = {
            event_id: selectedEvent.id,
            run_key: selectedEvent.run_key || '',
            run_name: selectedEvent.name,
            start_time: selectedEvent.start_time,
            content_type: selectedEvent.content_type,
            day: selectedEvent.day,
            tab_name: selectedEvent.tab_name,
            ingame_name: charName,
            discord_username: discordName,
            preferred_role: preferredRole,
            playable_roles: playableRoles,
            party_preference: partyPref,
            prog_point: progPoint,
            friend_group: friendGroupVal,
            notes: notesVal
        };

        // Collect & Validate Content-Specific Fields
        if (selectedEvent.content_type === 'Chaotic') {
            function getGroupJobs(group) {
                return Array.from(document.querySelectorAll(`.chips-group[data-group="${group}"] .chip-btn.selected`))
                    .filter(b => b.style.display !== 'none')
                    .map(b => b.getAttribute('data-job'));
            }
            payload.tanks = (playableRoles.includes('Tank') || playableRoles.includes('Any')) ? getGroupJobs('tanks') : [];
            payload.healers = (playableRoles.includes('Regen Healer') || playableRoles.includes('Shield Healer') || playableRoles.includes('Any')) ? getGroupJobs('healers') : [];
            payload.melee_dps = (playableRoles.includes('Melee DPS') || playableRoles.includes('Any')) ? getGroupJobs('melee_dps') : [];
            payload.magical_dps = (playableRoles.includes('Magical DPS') || playableRoles.includes('Any')) ? getGroupJobs('magical_dps') : [];
            payload.phys_ranged_dps = (playableRoles.includes('Physical Ranged DPS') || playableRoles.includes('Any')) ? getGroupJobs('phys_ranged_dps') : [];

            if ((playableRoles.includes('Tank') || playableRoles.includes('Any')) && payload.tanks.length === 0) {
                showStatusAlert('Please select at least one job you can play for Tanks.', 'error');
                return;
            }
            if ((playableRoles.includes('Regen Healer') || playableRoles.includes('Shield Healer') || playableRoles.includes('Any')) && payload.healers.length === 0) {
                showStatusAlert('Please select at least one job you can play for Healers.', 'error');
                return;
            }
            if ((playableRoles.includes('Melee DPS') || playableRoles.includes('Any')) && payload.melee_dps.length === 0) {
                showStatusAlert('Please select at least one job you can play for Melee DPS.', 'error');
                return;
            }
            if ((playableRoles.includes('Magical DPS') || playableRoles.includes('Any')) && payload.magical_dps.length === 0) {
                showStatusAlert('Please select at least one job you can play for Magical DPS.', 'error');
                return;
            }
            if ((playableRoles.includes('Physical Ranged DPS') || playableRoles.includes('Any')) && payload.phys_ranged_dps.length === 0) {
                showStatusAlert('Please select at least one job you can play for Physical Ranged DPS.', 'error');
                return;
            }

        } else if (selectedEvent.content_type === 'FT:B' || selectedEvent.content_type === 'FT:M') {
            payload.phantom_jobs_exp = Array.from(document.querySelectorAll('#chips-phantom-exp .chip-btn.selected')).map(b => b.getAttribute('data-job'));
            payload.phantom_jobs_lvl = Array.from(document.querySelectorAll('#chips-phantom-lvl .chip-btn.selected')).map(b => b.getAttribute('data-job'));

            if (payload.phantom_jobs_lvl.length < 6) {
                showStatusAlert('You are required to have at least 6 phantom jobs leveled. Please select at least 6 leveled jobs.', 'error');
                return;
            }

        } else if (selectedEvent.content_type === 'BA') {
            payload.logos_actions_exp = Array.from(document.querySelectorAll('#chips-logos-exp .chip-btn.selected')).map(b => b.getAttribute('data-action'));
            payload.logos_try_new = document.getElementById('input-logos-try').value;
        } else if (selectedEvent.content_type === 'DRS') {
            payload.lost_actions_exp = Array.from(document.querySelectorAll('#chips-lost-exp .chip-btn.selected')).map(b => b.getAttribute('data-action'));
            payload.lost_try_new = document.getElementById('input-lost-try').value;
            payload.duel = document.getElementById('input-drs-duel').value;
        }

        // Save preferences if checkbox is checked
        const savePrefsChk = document.getElementById('chk-save-prefs');
        if (savePrefsChk && savePrefsChk.checked) {
            const extracted = extractProfileFromStep2Form(selectedEvent.content_type);
            if (!extracted.error && extracted.profile) {
                savePreferencesForContent(selectedEvent.content_type, extracted.profile);
            }
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="material-symbols-outlined" style="animation: spin 1s infinite linear;">sync</span> Submitting...`;

        try {
            const res = await fetch(`${getApiUrl()}/api/public/signups/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                credentials: 'include',
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Submission failed');

            const cleanType = cleanRunTitle(selectedEvent.name);
            const runDisplayName = `${selectedEvent.content_type} ${cleanType}`;
            showStatusAlert(`🎉 Successfully signed up for ${runDisplayName} as ${charName}!`, 'success');
            await loadMySignups();
            loadEvents(); // Refresh signup counts

        } catch (err) {
            console.error('[Signups Submit Error]', err);
            showStatusAlert(err.message || 'Submission failed', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>Submit Signup</span><span class="material-symbols-outlined">send</span>`;
            updateSignupAuthVisibility();
        }
    }

    async function loadMySignups() {
        if (!currentUser) return;

        const container = document.getElementById('my-signups-card');
        const list = document.getElementById('my-signups-list');
        if (!container || !list) return;

        try {
            const res = await fetch(`${getApiUrl()}/api/public/signups/my`, {
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                const rawSignups = data.signups || [];
                // Only keep signups that have an active upcoming event attached
                mySignupsList = rawSignups.filter(s => {
                    if (s.event_id && allEvents.some(e => e.id === s.event_id)) {
                        return true;
                    }
                    if (s.run_key && allEvents.some(e => e.run_key === s.run_key && (!s.content_type || e.content_type === s.content_type))) {
                        return true;
                    }
                    if (s.tab_name && allEvents.some(e => e.tab_name === s.tab_name)) {
                        return true;
                    }
                    return false;
                });

                if (mySignupsList.length > 0) {
                    container.style.display = 'block';
                    list.innerHTML = mySignupsList.map((s, idx) => {
                        const matchedEvent = allEvents.find(e =>
                            (s.event_id && e.id === s.event_id) ||
                            (s.run_key && e.run_key === s.run_key && (!s.content_type || e.content_type === s.content_type)) ||
                            (s.tab_name && e.tab_name === s.tab_name)
                        );
                        
                        const contentType = (matchedEvent && matchedEvent.content_type) || s.content_type || (
                            s.tab_name.includes('[FT:M]') ? 'FT:M' :
                            s.tab_name.includes('[C]') ? 'Chaotic' :
                            s.tab_name.includes('[DRS]') ? 'DRS' :
                            s.tab_name.includes('[BA]') ? 'BA' : 'FT:B'
                        );

                        const rawName = (matchedEvent && matchedEvent.name) || s.run_name || s.tab_name;
                        const runTitle = cleanRunTitle(rawName);
                        const runTimeStr = formatRunDateTime(matchedEvent || s);
                        const isCancelled = Boolean((matchedEvent && matchedEvent.is_cancelled) || s.is_cancelled);

                        let typeBadgeClass = 'ftb';
                        let badgeLabel = 'FT:B';
                        if (contentType === 'FT:M') {
                            typeBadgeClass = 'ftm';
                            badgeLabel = 'FT:M';
                        } else if (contentType === 'Chaotic') {
                            typeBadgeClass = 'chaotic';
                            badgeLabel = 'Chaotic';
                        } else if (contentType === 'BA') {
                            typeBadgeClass = 'ba';
                            badgeLabel = 'BA';
                        } else if (contentType === 'DRS') {
                            typeBadgeClass = 'drs';
                            badgeLabel = 'DRS';
                        }

                        let rosterBannerHtml = '';
                        let quickLinksHtml = '';
                        if (!isCancelled) {
                            const rStatus = s.roster_status || 'pending';
                            if (rStatus === 'selected') {
                                const assignParts = [
                                    s.assigned_party_label || (s.assigned_party ? `Party ${s.assigned_party}` : ''),
                                    s.assigned_role || '',
                                    s.assigned_job || ''
                                ].filter(Boolean);
                                const assignSummary = assignParts.length > 0 ? assignParts.join(' • ') : 'Main Roster';
                                rosterBannerHtml = `
                                    <div class="my-signup-roster-banner is-selected">
                                        <span class="material-symbols-outlined">verified</span>
                                        <span>Selected: ${escapeHtml(assignSummary)}</span>
                                    </div>
                                `;
                            } else if (rStatus === 'standby') {
                                rosterBannerHtml = `
                                    <div class="my-signup-roster-banner is-standby">
                                        <span class="material-symbols-outlined">hourglass_top</span>
                                        <span>Backup</span>
                                    </div>
                                `;
                            } else {
                                rosterBannerHtml = `
                                    <div class="my-signup-roster-banner is-pending">
                                        <span class="material-symbols-outlined">schedule_send</span>
                                        <span>Signed Up - Roster Pending</span>
                                    </div>
                                `;
                            }

                            const linkItems = [];
                            if (s.roster_image_url) {
                                linkItems.push(`
                                    <a href="${escapeHtml(s.roster_image_url)}" target="_blank" rel="noopener noreferrer" class="my-signup-quick-link is-roster" onclick="event.stopPropagation()" onkeydown="event.stopPropagation()">
                                        <span class="material-symbols-outlined">grid_view</span>
                                        <span>View Roster</span>
                                    </a>
                                `);
                            }
                            if (s.gcal_url) {
                                linkItems.push(`
                                    <a href="${escapeHtml(s.gcal_url)}" target="_blank" rel="noopener noreferrer" class="my-signup-quick-link is-calendar" onclick="event.stopPropagation()" onkeydown="event.stopPropagation()">
                                        <span class="material-symbols-outlined">calendar_add_on</span>
                                        <span>Calendar</span>
                                    </a>
                                `);
                            }
                            if (linkItems.length > 0) {
                                quickLinksHtml = `<div class="my-signup-quick-links">${linkItems.join('')}</div>`;
                            }
                        }

                        return `
                            <div class="my-signup-item" data-signup-idx="${idx}" role="button" tabindex="0" title="Click to view full application details">
                                <div class="my-signup-item-top">
                                    <div class="my-signup-item-title-row">
                                        <span class="run-type-badge ${typeBadgeClass}">${badgeLabel}</span>
                                        <strong style="color: var(--text-primary); font-weight: 700; ${isCancelled ? 'text-decoration: line-through; opacity: 0.75;' : ''}">${escapeHtml(runTitle)}</strong>
                                        ${isCancelled ? `<span class="run-cancelled-badge"><span class="material-symbols-outlined" style="font-size: 0.9rem;">cancel</span> Cancelled</span>` : ''}
                                    </div>
                                    <span class="btn-view-application-more" aria-label="View application details" title="View application details">
                                        <span class="material-symbols-outlined">more_horiz</span>
                                    </span>
                                </div>
                                ${runTimeStr ? `
                                <div class="my-signup-item-time">
                                    <span class="material-symbols-outlined" style="font-size: 0.95rem; color: var(--accent-purple);">schedule</span>
                                    <span>${escapeHtml(runTimeStr)}</span>
                                </div>` : ''}
                                ${rosterBannerHtml}
                                <div class="my-signup-item-meta">
                                    Preferred: ${escapeHtml(s.preferred_role || 'Any')} | Party: ${escapeHtml(s.party_preference || 'Any')}
                                </div>
                                ${quickLinksHtml}
                            </div>
                        `;
                    }).join('');

                    list.querySelectorAll('.my-signup-item').forEach(item => {
                        const idx = parseInt(item.getAttribute('data-signup-idx'), 10);
                        item.onclick = () => {
                            if (mySignupsList[idx]) {
                                openApplicationModal(mySignupsList[idx]);
                            }
                        };
                        item.onkeydown = (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                if (mySignupsList[idx]) {
                                    openApplicationModal(mySignupsList[idx]);
                                }
                            }
                        };
                    });
                } else {
                    container.style.display = 'none';
                }
                updateSignupAuthVisibility();
                renderEventsGrid();
            }
        } catch (e) {
            console.warn('[My Signups]', e);
        }
    }

    // ── Application Details Modal ────────────────────────────────────────────────

    function openApplicationModal(signup) {
        const modalBackdrop = document.getElementById('application-modal-backdrop');
        const modalBody = document.getElementById('modal-details-body');
        const runTitle = document.getElementById('modal-run-title');
        const runSubtitle = document.getElementById('modal-run-subtitle');
        if (!modalBackdrop || !modalBody) return;

        const matchedEvent = allEvents.find(e =>
            (signup.event_id && e.id === signup.event_id) ||
            (signup.run_key && e.run_key === signup.run_key && (!signup.content_type || e.content_type === signup.content_type)) ||
            (signup.tab_name && e.tab_name === signup.tab_name)
        );
        const rawName = (matchedEvent && matchedEvent.name) || signup.run_name || signup.tab_name;
        const cleanName = cleanRunTitle(rawName);
        const contentType = (matchedEvent && matchedEvent.content_type) || signup.content_type || 'FT:B';

        let badgeClass = 'ftb';
        let badgeLabel = 'FT:B';
        if (contentType === 'FT:M') { badgeClass = 'ftm'; badgeLabel = 'FT:M'; }
        else if (contentType === 'Chaotic') { badgeClass = 'chaotic'; badgeLabel = 'Chaotic'; }
        else if (contentType === 'BA') { badgeClass = 'ba'; badgeLabel = 'BA'; }
        else if (contentType === 'DRS') { badgeClass = 'drs'; badgeLabel = 'DRS'; }

        runTitle.textContent = cleanName;
        const eventTimeStr = formatRunDateTime(matchedEvent || signup) || (signup.tab_name || '');
        runSubtitle.innerHTML = `<span class="run-type-badge ${badgeClass}">${badgeLabel}</span> <span>${escapeHtml(eventTimeStr)}</span>`;

        let contentSpecificHtml = '';

        if (contentType === 'Chaotic') {
            const roleJobs = [
                { label: 'Tanks', val: signup.tanks },
                { label: 'Healers', val: signup.healers },
                { label: 'Melee DPS', val: signup.melee },
                { label: 'Magical DPS', val: signup.magical },
                { label: 'Phys Ranged DPS', val: signup.phys_ranged }
            ].filter(j => j.val);

            if (roleJobs.length > 0) {
                contentSpecificHtml = `
                    <div class="modal-section">
                        <div class="modal-section-title">
                            <span class="material-symbols-outlined">swords</span> Job Selections
                        </div>
                        <div class="modal-jobs-grid">
                            ${roleJobs.map(j => `
                                <div class="modal-job-group">
                                    <span class="modal-sublabel">${escapeHtml(j.label)}:</span>
                                    <span class="modal-subvalue">${escapeHtml(j.val)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        } else if (contentType === 'FT:B' || contentType === 'FT:M') {
            contentSpecificHtml = `
                <div class="modal-section">
                    <div class="modal-section-title">
                        <span class="material-symbols-outlined">auto_fix_high</span> Phantom Jobs
                    </div>
                    <div class="modal-key-val">
                        <div class="modal-row">
                            <span class="modal-sublabel">Experience On:</span>
                            <span class="modal-subvalue">${escapeHtml(signup.phantom_exp || 'None specified')}</span>
                        </div>
                        <div class="modal-row">
                            <span class="modal-sublabel">Fully Leveled:</span>
                            <span class="modal-subvalue">${escapeHtml(signup.phantom_level || 'None')}</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (contentType === 'BA') {
            contentSpecificHtml = `
                <div class="modal-section">
                    <div class="modal-section-title">
                        <span class="material-symbols-outlined">magic_button</span> Logos Actions
                    </div>
                    <div class="modal-key-val">
                        <div class="modal-row">
                            <span class="modal-sublabel">Special Logos Experience:</span>
                            <span class="modal-subvalue">${escapeHtml(signup.logos_actions_exp || 'None specified')}</span>
                        </div>
                        <div class="modal-row">
                            <span class="modal-sublabel">Try New Special Logos:</span>
                            <span class="modal-subvalue">${escapeHtml(signup.logos_try_new || 'No')}</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (contentType === 'DRS') {
            contentSpecificHtml = `
                <div class="modal-section">
                    <div class="modal-section-title">
                        <span class="material-symbols-outlined">magic_button</span> Lost Actions & Duel
                    </div>
                    <div class="modal-key-val">
                        <div class="modal-row">
                            <span class="modal-sublabel">Special Lost Actions Experience:</span>
                            <span class="modal-subvalue">${escapeHtml(signup.lost_actions_exp || 'None specified')}</span>
                        </div>
                        <div class="modal-row">
                            <span class="modal-sublabel">Try New Special Lost Actions:</span>
                            <span class="modal-subvalue">${escapeHtml(signup.lost_try_new || 'No')}</span>
                        </div>
                        <div class="modal-row">
                            <span class="modal-sublabel">Duel Preference:</span>
                            <span class="modal-subvalue">${escapeHtml(signup.duel || 'No')}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        const isCancelledModal = Boolean((matchedEvent && matchedEvent.is_cancelled) || signup.is_cancelled);
        let modalRosterHtml = '';
        if (!isCancelledModal) {
            const rStatus = signup.roster_status || 'pending';
            const jobTypeLabel = signup.assigned_job_type || (
                contentType === 'Chaotic' ? 'Combat Job' :
                contentType === 'BA' ? 'Logos Action' :
                contentType === 'DRS' ? 'Lost Action' : 'Phantom Job'
            );

            const modalLinks = [];
            if (signup.roster_image_url) {
                modalLinks.push(`
                    <a href="${escapeHtml(signup.roster_image_url)}" target="_blank" rel="noopener noreferrer" class="my-signup-quick-link is-roster">
                        <span class="material-symbols-outlined">grid_view</span>
                        <span>View Full Roster Image</span>
                    </a>
                `);
            }
            if (signup.gcal_url) {
                modalLinks.push(`
                    <a href="${escapeHtml(signup.gcal_url)}" target="_blank" rel="noopener noreferrer" class="my-signup-quick-link is-calendar">
                        <span class="material-symbols-outlined">calendar_add_on</span>
                        <span>Add to Google Calendar</span>
                    </a>
                `);
            }
            const modalLinksRow = modalLinks.length > 0 ? `<div class="modal-roster-actions">${modalLinks.join('')}</div>` : '';

            if (rStatus === 'selected') {
                modalRosterHtml = `
                    <div class="modal-roster-card is-selected">
                        <div class="modal-roster-header">
                            <span class="modal-roster-status-title">
                                <span class="material-symbols-outlined">verified</span>
                                Selected for Main Roster
                            </span>
                        </div>
                        <div class="modal-roster-assign-grid">
                            <div class="modal-roster-assign-chip">
                                <span class="modal-sublabel">Assigned Party</span>
                                <strong class="modal-subvalue">${escapeHtml(signup.assigned_party_label || (signup.assigned_party ? `Party ${signup.assigned_party}` : 'Rostered'))}</strong>
                            </div>
                            <div class="modal-roster-assign-chip">
                                <span class="modal-sublabel">Assigned Role</span>
                                <strong class="modal-subvalue">${escapeHtml(signup.assigned_role || 'Assigned')}</strong>
                            </div>
                            ${signup.assigned_job ? `
                            <div class="modal-roster-assign-chip">
                                <span class="modal-sublabel">Assigned ${escapeHtml(jobTypeLabel)}</span>
                                <strong class="modal-subvalue">${escapeHtml(signup.assigned_job)}</strong>
                            </div>` : ''}
                        </div>
                        ${modalLinksRow}
                    </div>
                `;
            } else if (rStatus === 'standby') {
                modalRosterHtml = `
                    <div class="modal-roster-card is-standby">
                        <div class="modal-roster-header">
                            <span class="modal-roster-status-title">
                                <span class="material-symbols-outlined">hourglass_top</span>
                                Backup
                            </span>
                        </div>
                        <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.45;">
                            The main roster for this run has been posted and you are currently listed as a Backup. Hosts may reach out if a fill spot opens.
                        </div>
                        ${modalLinksRow}
                    </div>
                `;
            } else {
                modalRosterHtml = `
                    <div class="modal-roster-card is-pending">
                        <div class="modal-roster-header">
                            <span class="modal-roster-status-title">
                                <span class="material-symbols-outlined">schedule_send</span>
                                Signed Up - Roster Pending
                            </span>
                        </div>
                        <div style="font-size: 0.84rem; color: var(--text-secondary); line-height: 1.45;">
                            Your signup is recorded. Your party and role assignment will appear here once the host posts the roster.
                        </div>
                        ${modalLinksRow}
                    </div>
                `;
            }
        }

        modalBody.innerHTML = `
            <!-- Player Info -->
            <div class="modal-grid-2">
                <div class="modal-info-box">
                    <span class="modal-sublabel">Character Name</span>
                    <strong class="modal-subvalue-lg">${escapeHtml(signup.character_name || 'N/A')}</strong>
                </div>
                <div class="modal-info-box">
                    <span class="modal-sublabel">Discord Username</span>
                    <span class="modal-subvalue-lg">@${escapeHtml(signup.discord_username || 'N/A')}</span>
                </div>
            </div>

            ${modalRosterHtml}

            <div class="modal-sections-grid">
                <!-- Role & Party Info -->
                <div class="modal-section">
                    <div class="modal-section-title">
                        <span class="material-symbols-outlined">group</span> Roles & Parties
                    </div>
                    <div class="modal-key-val">
                        <div class="modal-row">
                            <span class="modal-sublabel">Preferred Role:</span>
                            <span class="modal-subvalue"><span class="badge-role-highlight">${escapeHtml(signup.preferred_role || 'Any')}</span></span>
                        </div>
                        <div class="modal-row">
                            <span class="modal-sublabel">Playable Roles:</span>
                            <span class="modal-subvalue">${escapeHtml(signup.playable_roles || 'Any')}</span>
                        </div>
                        <div class="modal-row">
                            <span class="modal-sublabel">Party Preference:</span>
                            <span class="modal-subvalue">${escapeHtml(signup.party_preference || 'Any')}</span>
                        </div>
                        <div class="modal-row">
                            <span class="modal-sublabel">Progression Point:</span>
                            <span class="modal-subvalue">${escapeHtml(signup.prog_point || 'Not specified')}</span>
                        </div>
                    </div>
                </div>

                ${contentSpecificHtml}
            </div>

            <!-- Team & Notes -->
            <div class="modal-section">
                <div class="modal-section-title">
                    <span class="material-symbols-outlined">chat</span> Additional Info
                </div>
                <div class="modal-key-val">
                    <div class="modal-row">
                        <span class="modal-sublabel">Friend Group:</span>
                        <span class="modal-subvalue">${escapeHtml(signup.friend_group || 'None specified')}</span>
                    </div>
                    <div class="modal-row" style="align-items: flex-start;">
                        <span class="modal-sublabel">Notes:</span>
                        <span class="modal-subvalue" style="white-space: pre-wrap;">${escapeHtml(signup.notes || 'None')}</span>
                    </div>
                    ${signup.timestamp ? `
                    <div class="modal-row">
                        <span class="modal-sublabel">Signed Up At:</span>
                        <span class="modal-subvalue" style="color: var(--text-muted); font-size: 0.85rem;">${escapeHtml(signup.timestamp)} UTC</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        modalBackdrop.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeApplicationModal() {
        const modalBackdrop = document.getElementById('application-modal-backdrop');
        if (!modalBackdrop) return;
        modalBackdrop.style.display = 'none';
        document.body.style.overflow = '';
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

    function hideStatusAlert() {
        const alertBox = document.getElementById('signup-status-alert');
        if (!alertBox) return;
        alertBox.style.display = 'none';
        alertBox.innerHTML = '';
    }

    function showRunsSelectionAlert(msg, type = 'error') {
        const alertBox = document.getElementById('runs-selection-alert');
        if (!alertBox) return;
        alertBox.className = `status-alert ${type}`;
        alertBox.innerHTML = `
            <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
            <span>${escapeHtml(msg)}</span>
        `;
        alertBox.style.display = 'flex';
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function hideRunsSelectionAlert() {
        const alertBox = document.getElementById('runs-selection-alert');
        if (!alertBox) return;
        alertBox.style.display = 'none';
        alertBox.innerHTML = '';
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

    // ── Field Character Limit Validations ────────────────────────────────────────

    function validateFriendGroup() {
        const input = document.getElementById('input-friend-group');
        const errEl = document.getElementById('error-friend-group');
        if (!input) return true;

        const len = input.value.length;
        if (len > 30) {
            input.classList.add('has-error');
            if (errEl) {
                errEl.style.display = 'flex';
                errEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1rem; vertical-align: middle;">error</span> Friend group name cannot exceed 30 characters (${len}/30).`;
            }
            return false;
        } else {
            input.classList.remove('has-error');
            if (errEl) {
                errEl.style.display = 'none';
                errEl.innerHTML = '';
            }
            return true;
        }
    }

    function validateNotes() {
        const input = document.getElementById('input-notes');
        const errEl = document.getElementById('error-notes');
        if (!input) return true;

        const len = input.value.length;
        if (len > 200) {
            input.classList.add('has-error');
            if (errEl) {
                errEl.style.display = 'flex';
                errEl.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1rem; vertical-align: middle;">error</span> Additional notes cannot exceed 200 characters (${len}/200).`;
            }
            return false;
        } else {
            input.classList.remove('has-error');
            if (errEl) {
                errEl.style.display = 'none';
                errEl.innerHTML = '';
            }
            return true;
        }
    }

    function setupCharacterLimitValidations() {
        const friendGroupInput = document.getElementById('input-friend-group');
        const notesInput = document.getElementById('input-notes');

        if (friendGroupInput) {
            friendGroupInput.addEventListener('input', validateFriendGroup);
        }
        if (notesInput) {
            notesInput.addEventListener('input', validateNotes);
        }
    }

    // ── Saved Preferences Storage & Schema Validation ────────────────────────────

    function loadSavedPreferencesStore() {
        try {
            const raw = localStorage.getItem(PREFS_STORAGE_KEY);
            if (!raw) return { version: 1, profiles: {} };
            const parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object' || typeof parsed.profiles !== 'object' || !parsed.profiles) {
                return { version: 1, profiles: {} };
            }
            return parsed;
        } catch (e) {
            console.warn('[Preferences] Could not load saved preferences:', e);
            return { version: 1, profiles: {} };
        }
    }

    function writeSavedPreferencesStore(store) {
        try {
            store.updated_at = new Date().toISOString();
            localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(store));
            updatePrefsCogBadge();
            renderEventsGrid();
        } catch (e) {
            console.error('[Preferences] Could not write saved preferences:', e);
        }
    }

    function savePreferencesForContent(contentType, profile) {
        const store = loadSavedPreferencesStore();
        const cleanProfile = Object.assign({}, profile, {
            schema_version: CONTENT_SCHEMA_VERSIONS[contentType] || 1
        });
        delete cleanProfile.friend_group;
        delete cleanProfile.notes;
        store.profiles[contentType] = cleanProfile;
        writeSavedPreferencesStore(store);
    }

    function clearPreferencesForContent(contentType) {
        const store = loadSavedPreferencesStore();
        delete store.profiles[contentType];
        writeSavedPreferencesStore(store);
    }

    function clearAllSavedPreferences() {
        try {
            localStorage.removeItem(PREFS_STORAGE_KEY);
        } catch (e) {}
        updatePrefsCogBadge();
        renderEventsGrid();
    }

    function validateSavedProfile(contentType, profile) {
        if (!profile || typeof profile !== 'object') {
            return { status: 'none', outdatedFields: [], sanitized: null };
        }

        const outdatedFields = [];
        const addOutdated = (key, label) => {
            if (!outdatedFields.some(f => f.key === key)) {
                outdatedFields.push({ key, label });
            }
        };

        const validRoleIds = ALL_ROLES.map(r => r.id);
        const validProgOptions = PROG_OPTIONS[contentType] || PROG_OPTIONS['Chaotic'];
        const validPartyValues = getPartyOptionsForContent(contentType).map(o => o.value);

        const sanitized = {
            schema_version: profile.schema_version
        };

        // 1. Preferred Role
        if (typeof profile.preferred_role === 'string' && validRoleIds.includes(profile.preferred_role)) {
            sanitized.preferred_role = profile.preferred_role;
        } else {
            sanitized.preferred_role = 'Any';
            addOutdated('preferred_role', 'Preferred Role');
        }

        // 2. Playable Roles
        if (Array.isArray(profile.playable_roles) && profile.playable_roles.length > 0) {
            const validPlayable = profile.playable_roles.filter(r => validRoleIds.includes(r));
            sanitized.playable_roles = validPlayable;
            if (validPlayable.length === 0 || validPlayable.length !== profile.playable_roles.length) {
                addOutdated('playable_roles', 'Playable Roles');
            }
        } else {
            sanitized.playable_roles = [];
            addOutdated('playable_roles', 'Playable Roles');
        }

        // 3. Prog Point
        if (typeof profile.prog_point === 'string' && validProgOptions.includes(profile.prog_point)) {
            sanitized.prog_point = profile.prog_point;
        } else {
            sanitized.prog_point = '';
            addOutdated('prog_point', 'Furthest Progression Point');
        }

        // 4. Party Preference
        if (typeof profile.party_preference === 'string' && profile.party_preference.trim()) {
            const parts = profile.party_preference.split(',').map(s => s.trim()).filter(Boolean);
            const validParts = parts.filter(p => validPartyValues.includes(p));
            if (validParts.length > 0 && validParts.length === parts.length) {
                sanitized.party_preference = validParts.join(', ');
            } else {
                sanitized.party_preference = validParts.length > 0 ? validParts.join(', ') : 'Any';
                addOutdated('party_preference', 'Party Preference');
            }
        } else {
            sanitized.party_preference = 'Any';
            addOutdated('party_preference', 'Party Preference');
        }

        // 5. Content-Specific Fields
        if (contentType === 'Chaotic') {
            const playable = sanitized.playable_roles;
            const hasAny = playable.includes('Any');
            const hasRegen = hasAny || playable.includes('Regen Healer');
            const hasShield = hasAny || playable.includes('Shield Healer');
            const allowedHealerJobs = [
                ...(hasRegen ? REGEN_HEALER_JOBS : []),
                ...(hasShield ? SHIELD_HEALER_JOBS : [])
            ];
            const roleGroups = [
                { key: 'tanks', label: 'Tanks You Can Play', allowedJobs: JOBS_BY_ROLE['Tank'], active: hasAny || playable.includes('Tank') },
                { key: 'healers', label: 'Healers You Can Play', allowedJobs: allowedHealerJobs, active: hasRegen || hasShield },
                { key: 'melee_dps', label: 'Melee DPS You Can Play', allowedJobs: JOBS_BY_ROLE['Melee DPS'], active: hasAny || playable.includes('Melee DPS') },
                { key: 'magical_dps', label: 'Magical DPS You Can Play', allowedJobs: JOBS_BY_ROLE['Magical DPS'], active: hasAny || playable.includes('Magical DPS') },
                { key: 'phys_ranged_dps', label: 'Physical Ranged You Can Play', allowedJobs: JOBS_BY_ROLE['Physical Ranged DPS'], active: hasAny || playable.includes('Physical Ranged DPS') }
            ];

            roleGroups.forEach(g => {
                const rawJobs = Array.isArray(profile[g.key]) ? profile[g.key] : [];
                const allowedJobs = g.allowedJobs || [];
                const validJobs = rawJobs.filter(j => allowedJobs.includes(j));
                sanitized[g.key] = validJobs;
                if (rawJobs.length !== validJobs.length || (g.active && validJobs.length === 0)) {
                    addOutdated(g.key, g.label);
                }
            });
        } else if (contentType === 'FT:B' || contentType === 'FT:M') {
            const rawExp = Array.isArray(profile.phantom_jobs_exp) ? profile.phantom_jobs_exp : null;
            if (rawExp) {
                const validExp = rawExp.filter(j => PHANTOM_JOBS.includes(j));
                sanitized.phantom_jobs_exp = validExp;
                if (validExp.length !== rawExp.length) {
                    addOutdated('phantom_jobs_exp', 'Phantom Jobs Experience');
                }
            } else {
                sanitized.phantom_jobs_exp = [];
                addOutdated('phantom_jobs_exp', 'Phantom Jobs Experience');
            }

            const rawLvl = Array.isArray(profile.phantom_jobs_lvl) ? profile.phantom_jobs_lvl : null;
            if (rawLvl) {
                const validLvl = rawLvl.filter(j => PHANTOM_JOBS.includes(j));
                sanitized.phantom_jobs_lvl = validLvl;
                if (validLvl.length !== rawLvl.length || validLvl.length < 6) {
                    addOutdated('phantom_jobs_lvl', 'Phantom Jobs Fully Leveled');
                }
            } else {
                sanitized.phantom_jobs_lvl = [];
                addOutdated('phantom_jobs_lvl', 'Phantom Jobs Fully Leveled');
            }
        } else if (contentType === 'BA') {
            const rawLogos = Array.isArray(profile.logos_actions_exp) ? profile.logos_actions_exp : null;
            if (rawLogos) {
                const validLogos = rawLogos.filter(a => BA_LOGOS_ACTIONS.includes(a));
                sanitized.logos_actions_exp = validLogos;
                if (validLogos.length !== rawLogos.length) {
                    addOutdated('logos_actions_exp', 'Logos Actions Experience');
                }
            } else {
                sanitized.logos_actions_exp = [];
                addOutdated('logos_actions_exp', 'Logos Actions Experience');
            }

            if (profile.logos_try_new === 'Yes' || profile.logos_try_new === 'No') {
                sanitized.logos_try_new = profile.logos_try_new;
            } else {
                sanitized.logos_try_new = 'No';
                addOutdated('logos_try_new', 'Try New Special Logos Actions');
            }
        } else if (contentType === 'DRS') {
            const rawLost = Array.isArray(profile.lost_actions_exp) ? profile.lost_actions_exp : null;
            if (rawLost) {
                const validLost = rawLost.filter(a => DRS_LOST_ACTIONS.includes(a));
                sanitized.lost_actions_exp = validLost;
                if (validLost.length !== rawLost.length) {
                    addOutdated('lost_actions_exp', 'Lost Actions Experience');
                }
            } else {
                sanitized.lost_actions_exp = [];
                addOutdated('lost_actions_exp', 'Lost Actions Experience');
            }

            if (profile.lost_try_new === 'Yes' || profile.lost_try_new === 'No') {
                sanitized.lost_try_new = profile.lost_try_new;
            } else {
                sanitized.lost_try_new = 'No';
                addOutdated('lost_try_new', 'Try New Special Lost Actions');
            }

            if (typeof profile.duel === 'string' && DRS_DUEL_OPTIONS.includes(profile.duel)) {
                sanitized.duel = profile.duel;
            } else {
                sanitized.duel = 'No';
                addOutdated('duel', 'Duel Preference');
            }
        }

        // 6. Schema Version Check
        const expectedSchema = CONTENT_SCHEMA_VERSIONS[contentType] || 1;
        if (profile.schema_version !== expectedSchema && outdatedFields.length === 0) {
            addOutdated('schema', 'Updated Questions');
        }

        return {
            status: outdatedFields.length > 0 ? 'outdated' : 'complete',
            outdatedFields,
            sanitized
        };
    }

    function getValidatedProfile(contentType) {
        const store = loadSavedPreferencesStore();
        const profile = store.profiles[contentType];
        return validateSavedProfile(contentType, profile);
    }

    function updatePrefsCogBadge() {
        const badge = document.getElementById('prefs-outdated-badge');
        const cogBtn = document.getElementById('btn-open-prefs-modal');
        if (!badge) return;

        const store = loadSavedPreferencesStore();
        const outdatedTypes = [];
        CONTENT_TYPES.forEach(ct => {
            if (store.profiles[ct]) {
                const check = validateSavedProfile(ct, store.profiles[ct]);
                if (check.status === 'outdated') {
                    outdatedTypes.push(ct);
                }
            }
        });

        if (outdatedTypes.length > 0) {
            badge.style.display = 'inline-flex';
            const msg = `Saved preferences need updating for: ${outdatedTypes.join(', ')}`;
            badge.title = msg;
            if (cogBtn) cogBtn.title = msg;
        } else {
            badge.style.display = 'none';
            if (cogBtn) cogBtn.title = 'Saved Signup Preferences';
        }
    }

    // ── Step 2 Form Auto-Fill & Outdated Field Highlighting ──────────────────────

    function clearFormOutdatedHighlights(rootEl) {
        if (!rootEl) return;
        rootEl.querySelectorAll('.field-outdated-highlight').forEach(el => {
            el.classList.remove('field-outdated-highlight');
        });
        rootEl.querySelectorAll('.field-outdated-tag').forEach(tag => {
            tag.remove();
        });
    }

    function highlightOutdatedFieldsInContainer(rootEl, outdatedFields) {
        if (!rootEl || !Array.isArray(outdatedFields)) return;
        outdatedFields.forEach(item => {
            const fieldBox = rootEl.querySelector(`[data-pref-field="${item.key}"]`);
            if (fieldBox) {
                fieldBox.classList.add('field-outdated-highlight');
                const labelEl = fieldBox.querySelector('.form-label, .jobs-role-title');
                if (labelEl && !labelEl.querySelector('.field-outdated-tag')) {
                    const tag = document.createElement('span');
                    tag.className = 'field-outdated-tag';
                    tag.innerHTML = `<span class="material-symbols-outlined" style="font-size: 0.85rem;">priority_high</span> Needs Update`;
                    labelEl.appendChild(tag);
                }
            }
        });
    }

    function applySavedPrefsToStep2Form(contentType) {
        const fieldsSection = document.getElementById('signup-fields-section');
        const banner = document.getElementById('prefs-form-banner');
        const saveChk = document.getElementById('chk-save-prefs');
        const saveChkText = document.getElementById('chk-save-prefs-text');
        const saveBtnInline = document.getElementById('btn-save-prefs-inline');
        clearFormOutdatedHighlights(fieldsSection);

        const check = getValidatedProfile(contentType);
        if (check.status === 'none' || !check.sanitized) {
            if (banner) {
                banner.style.display = 'none';
                banner.innerHTML = '';
            }
            if (saveChk) saveChk.checked = false;
            if (saveChkText) saveChkText.textContent = `Save as my default preferences for ${contentType} on this device`;
            if (saveBtnInline) {
                saveBtnInline.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1rem;">bookmark_add</span><span>Save Preferences</span>`;
            }
            return;
        }

        const p = check.sanitized;
        if (saveChk) saveChk.checked = true;
        if (saveChkText) saveChkText.textContent = `Keep my saved ${contentType} preferences updated when I submit`;
        if (saveBtnInline) {
            saveBtnInline.innerHTML = `<span class="material-symbols-outlined" style="font-size: 1rem;">bookmark_added</span><span>Update Saved Preferences</span>`;
        }

        // 1. Preferred Role
        const prefRoleContainer = document.getElementById('preferred-role-chips');
        if (prefRoleContainer && p.preferred_role) {
            prefRoleContainer.querySelectorAll('.chip-btn').forEach(b => {
                setChipSelected(b, b.getAttribute('data-role') === p.preferred_role);
            });
        }

        // 2. Playable Roles
        const playableContainer = document.getElementById('playable-roles-chips');
        if (playableContainer && Array.isArray(p.playable_roles)) {
            playableContainer.querySelectorAll('.chip-btn').forEach(b => {
                b.removeAttribute('data-auto-preferred');
                setChipSelected(b, p.playable_roles.includes(b.getAttribute('data-role')));
            });
        }

        // 3. Prog Point
        const progSelect = document.getElementById('input-prog-point');
        if (progSelect) {
            progSelect.value = p.prog_point || '';
        }

        // 4. Party Preference
        const partyContainer = document.getElementById('party-pref-chips');
        if (partyContainer && p.party_preference) {
            const parts = p.party_preference.split(',').map(s => s.trim()).filter(Boolean);
            partyContainer.querySelectorAll('.chip-btn').forEach(b => {
                setChipSelected(b, parts.includes(b.getAttribute('data-party')));
            });
        }

        // 5. Content-Specific Fields
        if (contentType === 'Chaotic') {
            syncChaoticRoleVisibility();
            ['tanks', 'healers', 'melee_dps', 'magical_dps', 'phys_ranged_dps'].forEach(group => {
                const jobs = Array.isArray(p[group]) ? p[group] : [];
                document.querySelectorAll(`#dynamic-jobs-container .chips-group[data-group="${group}"] .chip-btn`).forEach(b => {
                    setChipSelected(b, jobs.includes(b.getAttribute('data-job')));
                });
            });
        } else if (contentType === 'FT:B' || contentType === 'FT:M') {
            const expJobs = Array.isArray(p.phantom_jobs_exp) ? p.phantom_jobs_exp : [];
            const lvlJobs = Array.isArray(p.phantom_jobs_lvl) ? p.phantom_jobs_lvl : [];
            document.querySelectorAll('#chips-phantom-exp .chip-btn').forEach(b => {
                setChipSelected(b, expJobs.includes(b.getAttribute('data-job')));
            });
            document.querySelectorAll('#chips-phantom-lvl .chip-btn').forEach(b => {
                setChipSelected(b, lvlJobs.includes(b.getAttribute('data-job')));
            });
        } else if (contentType === 'BA') {
            const logosExp = Array.isArray(p.logos_actions_exp) ? p.logos_actions_exp : [];
            document.querySelectorAll('#chips-logos-exp .chip-btn').forEach(b => {
                setChipSelected(b, logosExp.includes(b.getAttribute('data-action')));
            });
            const trySelect = document.getElementById('input-logos-try');
            if (trySelect && p.logos_try_new) trySelect.value = p.logos_try_new;
        } else if (contentType === 'DRS') {
            const lostExp = Array.isArray(p.lost_actions_exp) ? p.lost_actions_exp : [];
            document.querySelectorAll('#chips-lost-exp .chip-btn').forEach(b => {
                setChipSelected(b, lostExp.includes(b.getAttribute('data-action')));
            });
            const trySelect = document.getElementById('input-lost-try');
            if (trySelect && p.lost_try_new) trySelect.value = p.lost_try_new;
            const duelSelect = document.getElementById('input-drs-duel');
            if (duelSelect && p.duel) duelSelect.value = p.duel;
        }

        // 6. Render Banner & Highlight Outdated Fields if any
        if (banner) {
            banner.style.display = 'flex';
            if (check.status === 'outdated') {
                banner.className = 'prefs-form-banner outdated';
                const fieldNames = check.outdatedFields.map(f => f.label).join(', ');
                banner.innerHTML = `
                    <div class="prefs-banner-text">
                        <span class="material-symbols-outlined" style="color: #f59e0b;">error</span>
                        <span><strong>Update Needed:</strong> Questions for ${escapeHtml(contentType)} have changed. Please review <strong>${escapeHtml(fieldNames)}</strong> below and save your preferences.</span>
                    </div>
                    <div class="prefs-banner-actions">
                        <button type="button" class="btn-prefs-banner-action" id="btn-banner-open-prefs">Open Preferences</button>
                    </div>
                `;
                highlightOutdatedFieldsInContainer(fieldsSection, check.outdatedFields);
            } else {
                banner.className = 'prefs-form-banner';
                banner.innerHTML = `
                    <div class="prefs-banner-text">
                        <span class="material-symbols-outlined" style="color: #2ecc71;">auto_awesome</span>
                        <span>Auto-filled from your saved <strong>${escapeHtml(contentType)}</strong> preferences.</span>
                    </div>
                    <div class="prefs-banner-actions">
                        <button type="button" class="btn-prefs-banner-action btn-prefs-banner-jump" id="btn-banner-jump-submit">
                            <span>Jump to Submit</span>
                            <span class="material-symbols-outlined" style="font-size: 0.95rem;">arrow_downward</span>
                        </button>
                        <button type="button" class="btn-prefs-banner-action" id="btn-banner-open-prefs">Edit Preferences</button>
                        <button type="button" class="btn-prefs-banner-action" id="btn-banner-reset-form">Reset Form</button>
                    </div>
                `;
            }

            const jumpSubmitBtn = document.getElementById('btn-banner-jump-submit');
            if (jumpSubmitBtn) {
                jumpSubmitBtn.onclick = () => {
                    const targetEl = document.getElementById('input-friend-group') || document.getElementById('btn-submit-form');
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                };
            }
            const openPrefsBtn = document.getElementById('btn-banner-open-prefs');
            if (openPrefsBtn) {
                openPrefsBtn.onclick = () => openPrefsModal(contentType);
            }
            const resetFormBtn = document.getElementById('btn-banner-reset-form');
            if (resetFormBtn) {
                resetFormBtn.onclick = () => {
                    renderPreferredRoles();
                    renderPlayableRoles();
                    renderProgPoints(contentType);
                    renderPartyPreferences(contentType);
                    renderDynamicJobSections();
                    clearFormOutdatedHighlights(fieldsSection);
                    banner.style.display = 'none';
                };
            }
        }
    }

    function extractProfileFromStep2Form(contentType) {
        const preferredRoleBtn = document.querySelector('#preferred-role-chips .chip-btn.selected');
        if (!preferredRoleBtn) {
            return { error: 'Please select your preferred role.' };
        }
        const preferredRole = preferredRoleBtn.getAttribute('data-role');

        const playableRoles = getSelectedPlayableRoles();
        if (playableRoles.length === 0) {
            return { error: 'Please select at least one playable role.' };
        }

        const progSelect = document.getElementById('input-prog-point');
        const progPoint = progSelect ? progSelect.value : '';
        if (!progPoint) {
            return { error: 'Please select your furthest progression point.' };
        }

        const partyPref = getSelectedPartyPreferences() || 'Any';

        const profile = {
            schema_version: CONTENT_SCHEMA_VERSIONS[contentType] || 1,
            preferred_role: preferredRole,
            playable_roles: playableRoles,
            prog_point: progPoint,
            party_preference: partyPref
        };

        if (contentType === 'Chaotic') {
            function getGroupJobs(group) {
                return Array.from(document.querySelectorAll(`#dynamic-jobs-container .chips-group[data-group="${group}"] .chip-btn.selected`))
                    .filter(b => b.style.display !== 'none')
                    .map(b => b.getAttribute('data-job'));
            }
            profile.tanks = (playableRoles.includes('Tank') || playableRoles.includes('Any')) ? getGroupJobs('tanks') : [];
            profile.healers = (playableRoles.includes('Regen Healer') || playableRoles.includes('Shield Healer') || playableRoles.includes('Any')) ? getGroupJobs('healers') : [];
            profile.melee_dps = (playableRoles.includes('Melee DPS') || playableRoles.includes('Any')) ? getGroupJobs('melee_dps') : [];
            profile.magical_dps = (playableRoles.includes('Magical DPS') || playableRoles.includes('Any')) ? getGroupJobs('magical_dps') : [];
            profile.phys_ranged_dps = (playableRoles.includes('Physical Ranged DPS') || playableRoles.includes('Any')) ? getGroupJobs('phys_ranged_dps') : [];

            if ((playableRoles.includes('Tank') || playableRoles.includes('Any')) && profile.tanks.length === 0) {
                return { error: 'Please select at least one job you can play for Tanks.' };
            }
            if ((playableRoles.includes('Regen Healer') || playableRoles.includes('Shield Healer') || playableRoles.includes('Any')) && profile.healers.length === 0) {
                return { error: 'Please select at least one job you can play for Healers.' };
            }
            if ((playableRoles.includes('Melee DPS') || playableRoles.includes('Any')) && profile.melee_dps.length === 0) {
                return { error: 'Please select at least one job you can play for Melee DPS.' };
            }
            if ((playableRoles.includes('Magical DPS') || playableRoles.includes('Any')) && profile.magical_dps.length === 0) {
                return { error: 'Please select at least one job you can play for Magical DPS.' };
            }
            if ((playableRoles.includes('Physical Ranged DPS') || playableRoles.includes('Any')) && profile.phys_ranged_dps.length === 0) {
                return { error: 'Please select at least one job you can play for Physical Ranged DPS.' };
            }
        } else if (contentType === 'FT:B' || contentType === 'FT:M') {
            profile.phantom_jobs_exp = Array.from(document.querySelectorAll('#chips-phantom-exp .chip-btn.selected')).map(b => b.getAttribute('data-job'));
            profile.phantom_jobs_lvl = Array.from(document.querySelectorAll('#chips-phantom-lvl .chip-btn.selected')).map(b => b.getAttribute('data-job'));
            if (profile.phantom_jobs_lvl.length < 6) {
                return { error: 'You are required to have at least 6 phantom jobs leveled.' };
            }
        } else if (contentType === 'BA') {
            profile.logos_actions_exp = Array.from(document.querySelectorAll('#chips-logos-exp .chip-btn.selected')).map(b => b.getAttribute('data-action'));
            const tryEl = document.getElementById('input-logos-try');
            profile.logos_try_new = tryEl ? tryEl.value : 'No';
        } else if (contentType === 'DRS') {
            profile.lost_actions_exp = Array.from(document.querySelectorAll('#chips-lost-exp .chip-btn.selected')).map(b => b.getAttribute('data-action'));
            const tryEl = document.getElementById('input-lost-try');
            const duelEl = document.getElementById('input-drs-duel');
            profile.lost_try_new = tryEl ? tryEl.value : 'No';
            profile.duel = duelEl ? duelEl.value : 'No';
        }

        return { profile };
    }

    function handleSavePrefsInline() {
        if (!selectedEvent) return;
        const contentType = selectedEvent.content_type;
        const result = extractProfileFromStep2Form(contentType);
        if (result.error) {
            showStatusAlert(result.error, 'error');
            return;
        }
        savePreferencesForContent(contentType, result.profile);
        applySavedPrefsToStep2Form(contentType);
        showStatusAlert(`Saved your default ${contentType} preferences on this device!`, 'success');
    }

    // ── Saved Preferences Modal Editor ───────────────────────────────────────────

    function showPrefsModalAlert(msg, type = 'info') {
        const alertEl = document.getElementById('prefs-modal-alert');
        if (!alertEl) return;
        alertEl.className = `status-alert ${type}`;
        alertEl.innerHTML = `
            <span class="material-symbols-outlined">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
            <span>${escapeHtml(msg)}</span>
        `;
        alertEl.style.display = 'flex';
    }

    function hidePrefsModalAlert() {
        const alertEl = document.getElementById('prefs-modal-alert');
        if (!alertEl) return;
        alertEl.style.display = 'none';
        alertEl.innerHTML = '';
    }

    function updatePrefsModalTabBadges() {
        const store = loadSavedPreferencesStore();
        CONTENT_TYPES.forEach(ct => {
            const statusSpan = document.querySelector(`.prefs-tab-status[data-tab-status="${ct}"]`);
            if (!statusSpan) return;
            const profile = store.profiles[ct];
            if (!profile) {
                statusSpan.className = 'prefs-tab-status';
                statusSpan.textContent = '';
                statusSpan.title = 'Not saved yet';
                return;
            }
            const check = validateSavedProfile(ct, profile);
            if (check.status === 'complete') {
                statusSpan.className = 'prefs-tab-status complete';
                statusSpan.textContent = '✓';
                statusSpan.title = 'Complete & ready for auto-fill';
            } else if (check.status === 'outdated') {
                statusSpan.className = 'prefs-tab-status outdated';
                statusSpan.textContent = '!';
                statusSpan.title = 'Needs update';
            } else {
                statusSpan.className = 'prefs-tab-status';
                statusSpan.textContent = '';
            }
        });
    }

    function openPrefsModal(initialTab) {
        const backdrop = document.getElementById('prefs-modal-backdrop');
        if (!backdrop) return;

        hidePrefsModalAlert();

        // Pick initial tab: explicit argument -> first outdated tab -> selectedEvent -> 'Chaotic'
        if (initialTab && CONTENT_TYPES.includes(initialTab)) {
            activePrefsTab = initialTab;
        } else {
            const store = loadSavedPreferencesStore();
            const firstOutdated = CONTENT_TYPES.find(ct => store.profiles[ct] && validateSavedProfile(ct, store.profiles[ct]).status === 'outdated');
            if (firstOutdated) {
                activePrefsTab = firstOutdated;
            } else if (selectedEvent && CONTENT_TYPES.includes(selectedEvent.content_type)) {
                activePrefsTab = selectedEvent.content_type;
            } else {
                activePrefsTab = 'Chaotic';
            }
        }

        renderPrefsModalTab(activePrefsTab);
        backdrop.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function getPrefsModalStateSnapshot() {
        const editor = document.getElementById('prefs-modal-editor');
        if (!editor) return '';
        const selectedChips = Array.from(editor.querySelectorAll('.chip-btn.selected'))
            .map(b => b.getAttribute('data-role') || b.getAttribute('data-job') || b.getAttribute('data-action') || b.getAttribute('data-party') || b.textContent.trim());
        const selects = Array.from(editor.querySelectorAll('select')).map(s => `${s.id}:${s.value}`);
        return JSON.stringify({ chips: selectedChips, selects });
    }

    function hasUnsavedPrefsModalChanges() {
        const backdrop = document.getElementById('prefs-modal-backdrop');
        if (!backdrop || backdrop.style.display === 'none') return false;
        if (!prefsModalInitialSnapshot) return false;
        return getPrefsModalStateSnapshot() !== prefsModalInitialSnapshot;
    }

    function closePrefsModal(force = false) {
        const backdrop = document.getElementById('prefs-modal-backdrop');
        if (!backdrop || backdrop.style.display === 'none') return;
        if (!force && hasUnsavedPrefsModalChanges()) {
            if (!window.confirm(`You have unsaved changes for ${activePrefsTab}. Close without saving?`)) {
                return;
            }
        }
        backdrop.style.display = 'none';
        document.body.style.overflow = '';
    }

    function syncPrefsModalChaoticVisibility() {
        const editor = document.getElementById('prefs-modal-editor');
        if (!editor || activePrefsTab !== 'Chaotic') return;
        const selectedRoles = Array.from(editor.querySelectorAll('#prefs-playable-roles-chips .chip-btn.selected'))
            .map(b => b.getAttribute('data-role'));
        const hasAny = selectedRoles.includes('Any');
        const hasRegen = hasAny || selectedRoles.includes('Regen Healer');
        const hasShield = hasAny || selectedRoles.includes('Shield Healer');

        const groups = [
            { id: 'tanks', active: hasAny || selectedRoles.includes('Tank') },
            { id: 'healers', active: hasRegen || hasShield },
            { id: 'melee_dps', active: hasAny || selectedRoles.includes('Melee DPS') },
            { id: 'magical_dps', active: hasAny || selectedRoles.includes('Magical DPS') },
            { id: 'phys_ranged_dps', active: hasAny || selectedRoles.includes('Physical Ranged DPS') }
        ];

        groups.forEach(g => {
            const el = editor.querySelector(`.dynamic-jobs-box[data-role-group="${g.id}"]`);
            if (el) {
                el.style.display = g.active ? 'block' : 'none';
            }
        });

        const healersGroup = editor.querySelector('.chips-group[data-prefs-group="healers"]');
        if (healersGroup) {
            healersGroup.querySelectorAll('.chip-btn').forEach(btn => {
                const job = btn.getAttribute('data-job');
                const isAllowed = (REGEN_HEALER_JOBS.includes(job) && hasRegen) ||
                                  (SHIELD_HEALER_JOBS.includes(job) && hasShield);
                btn.style.display = isAllowed ? '' : 'none';
                if (!isAllowed && btn.classList.contains('selected')) {
                    setChipSelected(btn, false);
                }
            });
        }
    }

    function renderPrefsModalTab(contentType) {
        activePrefsTab = contentType;
        hidePrefsModalAlert();
        updatePrefsModalTabBadges();

        // Update active tab button
        document.querySelectorAll('#prefs-content-tabs .prefs-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-pref-tab') === contentType);
        });

        const saveBtnText = document.getElementById('btn-prefs-save-tab-text');
        const clearBtnText = document.getElementById('btn-prefs-clear-tab-text');
        const clearBtn = document.getElementById('btn-prefs-clear-tab');
        if (saveBtnText) saveBtnText.textContent = `Save ${contentType} Preferences`;
        if (clearBtnText) clearBtnText.textContent = `Reset ${contentType} Preferences`;

        const check = getValidatedProfile(contentType);
        if (clearBtn) {
            clearBtn.style.display = check.status === 'none' ? 'none' : 'inline-flex';
        }
        const statusBanner = document.getElementById('prefs-modal-tab-status');
        if (statusBanner) {
            if (check.status === 'complete') {
                statusBanner.className = 'prefs-modal-status-banner complete';
                statusBanner.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined" style="font-size: 1.15rem;">check_circle</span>
                        <span><strong>${escapeHtml(contentType)} preferences saved!</strong> Your answers will automatically fill when selecting a run.</span>
                    </div>
                `;
            } else if (check.status === 'outdated') {
                const labels = check.outdatedFields.map(f => f.label).join(', ');
                statusBanner.className = 'prefs-modal-status-banner outdated';
                statusBanner.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined" style="font-size: 1.15rem; color: #f59e0b;">error</span>
                        <span><strong>Action Needed:</strong> Questions for ${escapeHtml(contentType)} changed. Please update: <strong>${escapeHtml(labels)}</strong> and click Save.</span>
                    </div>
                `;
            } else {
                statusBanner.className = 'prefs-modal-status-banner';
                statusBanner.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined" style="font-size: 1.15rem; color: var(--accent-purple);">info</span>
                        <span>No saved preferences for <strong>${escapeHtml(contentType)}</strong> yet. Configure your defaults below and click Save.</span>
                    </div>
                `;
            }
        }

        const editor = document.getElementById('prefs-modal-editor');
        if (!editor) return;

        const progOptions = PROG_OPTIONS[contentType] || PROG_OPTIONS['Chaotic'];
        const partyOptions = getPartyOptionsForContent(contentType);

        let contentSpecificHtml = '';
        if (contentType === 'Chaotic') {
            const createModalJobGroup = (groupId, title, jobs, roleClass) => `
                <div class="dynamic-jobs-box" data-role-group="${groupId}" data-pref-field="${groupId}">
                    <div class="jobs-role-title">${escapeHtml(title)}</div>
                    <div class="quick-toggle-actions">
                        <button type="button" class="btn-mini-toggle" data-prefs-toggle-group="${groupId}" data-toggle-state="true">Select All</button>
                        <button type="button" class="btn-mini-toggle" data-prefs-toggle-group="${groupId}" data-toggle-state="false">Clear</button>
                    </div>
                    <div class="chips-group" data-prefs-group="${groupId}">
                        ${jobs.map(j => `<button type="button" class="chip-btn ${roleClass}" data-job="${escapeHtml(j)}" aria-pressed="false">${escapeHtml(j)}</button>`).join('')}
                    </div>
                </div>
            `;
            contentSpecificHtml = `
                ${createModalJobGroup('tanks', 'Tanks You Can Play', JOBS_BY_ROLE['Tank'], 'role-tank')}
                ${createModalJobGroup('healers', 'Healers You Can Play', JOBS_BY_ROLE['Healer'], 'role-healer')}
                ${createModalJobGroup('melee_dps', 'Melee DPS You Can Play', JOBS_BY_ROLE['Melee DPS'], 'role-dps')}
                ${createModalJobGroup('magical_dps', 'Magical DPS You Can Play', JOBS_BY_ROLE['Magical DPS'], 'role-dps')}
                ${createModalJobGroup('phys_ranged_dps', 'Physical Ranged You Can Play', JOBS_BY_ROLE['Physical Ranged DPS'], 'role-dps')}
            `;
        } else if (contentType === 'FT:B' || contentType === 'FT:M') {
            const otherFt = contentType === 'FT:B' ? 'FT:M' : 'FT:B';
            const store = loadSavedPreferencesStore();
            const otherProfile = store.profiles[otherFt];
            const hasOtherLeveled = otherProfile && Array.isArray(otherProfile.phantom_jobs_lvl) && otherProfile.phantom_jobs_lvl.length > 0;

            contentSpecificHtml = `
                <div class="phantom-jobs-dual-grid">
                    <div class="dynamic-jobs-box" data-pref-field="phantom_jobs_exp">
                        <div class="jobs-role-title">
                            <span class="material-symbols-outlined">auto_fix_high</span> Phantom Jobs Experience (${escapeHtml(contentType)})
                        </div>
                        <div class="form-hint" style="margin-bottom: 0.75rem;">Select the phantom jobs you have previously played in ${escapeHtml(contentType)} and feel experienced on.</div>
                        <div class="quick-toggle-actions">
                            <button type="button" class="btn-mini-toggle" data-prefs-toggle-target="prefs-chips-phantom-exp" data-toggle-state="true">Select All</button>
                            <button type="button" class="btn-mini-toggle" data-prefs-toggle-target="prefs-chips-phantom-exp" data-toggle-state="false">Clear</button>
                        </div>
                        <div class="chips-group" id="prefs-chips-phantom-exp">
                            ${PHANTOM_JOBS.map(j => `<button type="button" class="chip-btn" data-job="${escapeHtml(j)}" aria-pressed="false">${escapeHtml(j)}</button>`).join('')}
                        </div>
                    </div>

                    <div class="dynamic-jobs-box" data-pref-field="phantom_jobs_lvl">
                        <div class="jobs-role-title">
                            <span class="material-symbols-outlined">military_tech</span> Phantom Jobs Fully Leveled
                        </div>
                        <div class="form-hint" style="margin-bottom: 0.75rem;">You are required to have at least 6 phantom jobs leveled.</div>
                        <div class="quick-toggle-actions">
                            <button type="button" class="btn-mini-toggle" data-prefs-toggle-target="prefs-chips-phantom-lvl" data-toggle-state="true">Select All</button>
                            <button type="button" class="btn-mini-toggle" data-prefs-toggle-target="prefs-chips-phantom-lvl" data-toggle-state="false">Clear</button>
                            ${hasOtherLeveled ? `<button type="button" class="btn-mini-toggle" id="btn-prefs-copy-other-ft" style="color: var(--accent-purple); border-color: rgba(178, 145, 247, 0.4);">Copy Leveled from ${escapeHtml(otherFt)}</button>` : ''}
                        </div>
                        <div class="chips-group" id="prefs-chips-phantom-lvl">
                            ${PHANTOM_JOBS.map(j => `<button type="button" class="chip-btn" data-job="${escapeHtml(j)}" aria-pressed="false">${escapeHtml(j)}</button>`).join('')}
                        </div>
                    </div>
                </div>
            `;
        } else if (contentType === 'BA') {
            contentSpecificHtml = `
                <div class="dynamic-jobs-box">
                    <div class="form-group" data-pref-field="logos_actions_exp" style="margin-bottom: 1.25rem;">
                        <div class="jobs-role-title">
                            <span class="material-symbols-outlined">magic_button</span> Logos Actions Experience
                        </div>
                        <div class="chips-group" id="prefs-chips-logos-exp">
                            ${BA_LOGOS_ACTIONS.map(a => `<button type="button" class="chip-btn" data-action="${escapeHtml(a)}" aria-pressed="false">${escapeHtml(a)}</button>`).join('')}
                        </div>
                    </div>
                    <div class="form-group" data-pref-field="logos_try_new" style="margin-bottom: 0;">
                        <label class="form-label" for="prefs-input-logos-try">Would you like to try any new special Logos Actions?</label>
                        <select id="prefs-input-logos-try" class="input-select" style="max-width: 200px;">
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                </div>
            `;
        } else if (contentType === 'DRS') {
            contentSpecificHtml = `
                <div class="dynamic-jobs-box">
                    <div class="form-group" data-pref-field="lost_actions_exp" style="margin-bottom: 1.25rem;">
                        <div class="jobs-role-title">
                            <span class="material-symbols-outlined">magic_button</span> Lost Actions Experience
                        </div>
                        <div class="chips-group" id="prefs-chips-lost-exp">
                            ${DRS_LOST_ACTIONS.map(a => `<button type="button" class="chip-btn" data-action="${escapeHtml(a)}" aria-pressed="false">${escapeHtml(a)}</button>`).join('')}
                        </div>
                    </div>
                    <div class="form-grid-2" style="margin-bottom: 0;">
                        <div class="form-group" data-pref-field="lost_try_new" style="margin-bottom: 0;">
                            <label class="form-label" for="prefs-input-lost-try">Would you like to try any new special Lost Actions?</label>
                            <select id="prefs-input-lost-try" class="input-select">
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </div>
                        <div class="form-group" data-pref-field="duel" style="margin-bottom: 0;">
                            <label class="form-label" for="prefs-input-drs-duel">Would you like to do the Duel?</label>
                            <select id="prefs-input-drs-duel" class="input-select">
                                ${DRS_DUEL_OPTIONS.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('')}
                            </select>
                            <div class="form-hint">Optional 1v1 encounter. Winning grants a strong 2-hour buff, but dying locks you out of the rest of the run.</div>
                        </div>
                    </div>
                </div>
            `;
        }

        editor.innerHTML = `
            <div class="form-group" data-pref-field="preferred_role">
                <label class="form-label">What is your preferred role?</label>
                <div class="chips-group" id="prefs-preferred-role-chips">
                    ${ALL_ROLES.map(r => `<button type="button" class="chip-btn ${r.class} ${r.id === 'Any' ? 'selected' : ''}" data-role="${r.id}" aria-pressed="${r.id === 'Any' ? 'true' : 'false'}">${r.label}</button>`).join('')}
                </div>
            </div>

            <div class="form-group" data-pref-field="playable_roles">
                <label class="form-label">What roles can you play?</label>
                <div class="chips-group" id="prefs-playable-roles-chips">
                    ${ALL_ROLES.map(r => `<button type="button" class="chip-btn ${r.class}" data-role="${r.id}" aria-pressed="false">${r.label}</button>`).join('')}
                </div>
                ${contentType === 'Chaotic' ? `<div class="form-hint">Selecting a role reveals only the jobs associated with that role below.</div>` : ''}
            </div>

            ${contentSpecificHtml}

            <div class="form-grid-2" style="margin-top: 1.25rem; margin-bottom: 0.25rem;">
                <div class="form-group" data-pref-field="prog_point" style="margin-bottom: 0;">
                    <label class="form-label" for="prefs-input-prog-point">Furthest Progression Point</label>
                    <select id="prefs-input-prog-point" class="input-select">
                        <option value="" disabled selected>Select your progression point...</option>
                        ${progOptions.map(opt => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('')}
                    </select>
                </div>

                <div class="form-group" data-pref-field="party_preference" style="margin-bottom: 0;">
                    <label class="form-label">Party Preference</label>
                    <div class="chips-group" id="prefs-party-pref-chips">
                        ${partyOptions.map(o => `<button type="button" class="chip-btn ${o.value === 'Any' ? 'selected' : ''}" data-party="${escapeHtml(o.value)}" aria-pressed="${o.value === 'Any' ? 'true' : 'false'}">${escapeHtml(o.label)}</button>`).join('')}
                    </div>
                    <div class="form-hint">Choose Any Party or select multiple parties.</div>
                </div>
            </div>
        `;

        // Attach interactive handlers inside modal editor
        const prefRoleContainer = document.getElementById('prefs-preferred-role-chips');
        const playableContainer = document.getElementById('prefs-playable-roles-chips');

        if (prefRoleContainer) {
            prefRoleContainer.querySelectorAll('.chip-btn').forEach(btn => {
                btn.onclick = () => {
                    prefRoleContainer.querySelectorAll('.chip-btn').forEach(b => setChipSelected(b, false));
                    setChipSelected(btn, true);
                    const roleId = btn.getAttribute('data-role');
                    if (playableContainer && roleId) {
                        playableContainer.querySelectorAll('.chip-btn[data-auto-preferred="true"]').forEach(b => {
                            b.removeAttribute('data-auto-preferred');
                            setChipSelected(b, false);
                        });
                        if (roleId !== 'Any') {
                            const matchBtn = playableContainer.querySelector(`.chip-btn[data-role="${roleId}"]`);
                            if (matchBtn && !matchBtn.classList.contains('selected')) {
                                setChipSelected(matchBtn, true);
                                matchBtn.setAttribute('data-auto-preferred', 'true');
                            }
                        }
                        syncPrefsModalChaoticVisibility();
                    }
                };
            });
        }

        if (playableContainer) {
            playableContainer.querySelectorAll('.chip-btn').forEach(btn => {
                btn.onclick = () => {
                    const roleId = btn.getAttribute('data-role');
                    btn.removeAttribute('data-auto-preferred');
                    if (roleId === 'Any') {
                        const isSelected = toggleChipSelected(btn);
                        if (isSelected) {
                            playableContainer.querySelectorAll('.chip-btn:not([data-role="Any"])').forEach(b => {
                                b.removeAttribute('data-auto-preferred');
                                setChipSelected(b, true);
                            });
                        }
                    } else {
                        toggleChipSelected(btn);
                    }
                    syncPrefsModalChaoticVisibility();
                };
            });
        }

        const partyContainer = document.getElementById('prefs-party-pref-chips');
        if (partyContainer) {
            partyContainer.querySelectorAll('.chip-btn').forEach(btn => {
                btn.onclick = () => {
                    const partyVal = btn.getAttribute('data-party');
                    const anyBtn = partyContainer.querySelector('[data-party="Any"]');
                    const specificBtns = Array.from(partyContainer.querySelectorAll('.chip-btn:not([data-party="Any"])'));
                    if (partyVal === 'Any') {
                        if (anyBtn) setChipSelected(anyBtn, true);
                        specificBtns.forEach(b => setChipSelected(b, false));
                    } else {
                        toggleChipSelected(btn);
                        const anySpecificSelected = specificBtns.some(b => b.classList.contains('selected'));
                        if (anyBtn) setChipSelected(anyBtn, !anySpecificSelected);
                    }
                };
            });
        }

        if (contentType === 'Chaotic') {
            editor.querySelectorAll('.dynamic-jobs-box .chips-group .chip-btn').forEach(btn => {
                btn.onclick = () => toggleChipSelected(btn);
            });
            editor.querySelectorAll('.btn-mini-toggle[data-prefs-toggle-group]').forEach(btn => {
                btn.onclick = () => {
                    const groupId = btn.getAttribute('data-prefs-toggle-group');
                    const state = btn.getAttribute('data-toggle-state') === 'true';
                    editor.querySelectorAll(`.chips-group[data-prefs-group="${groupId}"] .chip-btn`).forEach(b => {
                        if (state && b.style.display === 'none') {
                            setChipSelected(b, false);
                            return;
                        }
                        setChipSelected(b, state);
                    });
                };
            });
            syncPrefsModalChaoticVisibility();
        } else if (contentType === 'FT:B' || contentType === 'FT:M') {
            editor.querySelectorAll('#prefs-chips-phantom-exp .chip-btn, #prefs-chips-phantom-lvl .chip-btn').forEach(btn => {
                btn.onclick = () => toggleChipSelected(btn);
            });
            editor.querySelectorAll('.btn-mini-toggle[data-prefs-toggle-target]').forEach(btn => {
                btn.onclick = () => {
                    const targetId = btn.getAttribute('data-prefs-toggle-target');
                    const state = btn.getAttribute('data-toggle-state') === 'true';
                    if (targetId === 'prefs-chips-phantom-exp' && state) {
                        openPhantomExpWarningModal('modal');
                        return;
                    }
                    editor.querySelectorAll(`#${targetId} .chip-btn`).forEach(b => {
                        setChipSelected(b, state);
                    });
                };
            });
            const copyFtBtn = document.getElementById('btn-prefs-copy-other-ft');
            if (copyFtBtn) {
                copyFtBtn.onclick = () => {
                    const otherFt = contentType === 'FT:B' ? 'FT:M' : 'FT:B';
                    const store = loadSavedPreferencesStore();
                    const otherLvl = (store.profiles[otherFt] && Array.isArray(store.profiles[otherFt].phantom_jobs_lvl))
                        ? store.profiles[otherFt].phantom_jobs_lvl
                        : [];
                    editor.querySelectorAll('#prefs-chips-phantom-lvl .chip-btn').forEach(b => {
                        setChipSelected(b, otherLvl.includes(b.getAttribute('data-job')));
                    });
                    showPrefsModalAlert(`Copied ${otherLvl.length} leveled Phantom Jobs from ${otherFt}.`, 'info');
                };
            }
        } else if (contentType === 'BA') {
            editor.querySelectorAll('#prefs-chips-logos-exp .chip-btn').forEach(b => {
                b.onclick = () => toggleChipSelected(b);
            });
        } else if (contentType === 'DRS') {
            editor.querySelectorAll('#prefs-chips-lost-exp .chip-btn').forEach(b => {
                b.onclick = () => toggleChipSelected(b);
            });
        }

        // Pre-populate if saved profile exists
        if (check.sanitized) {
            const p = check.sanitized;
            if (prefRoleContainer && p.preferred_role) {
                prefRoleContainer.querySelectorAll('.chip-btn').forEach(b => {
                    setChipSelected(b, b.getAttribute('data-role') === p.preferred_role);
                });
            }
            if (playableContainer && Array.isArray(p.playable_roles)) {
                playableContainer.querySelectorAll('.chip-btn').forEach(b => {
                    setChipSelected(b, p.playable_roles.includes(b.getAttribute('data-role')));
                });
            }
            const progSelect = document.getElementById('prefs-input-prog-point');
            if (progSelect) progSelect.value = p.prog_point || '';

            if (partyContainer && p.party_preference) {
                const parts = p.party_preference.split(',').map(s => s.trim()).filter(Boolean);
                partyContainer.querySelectorAll('.chip-btn').forEach(b => {
                    setChipSelected(b, parts.includes(b.getAttribute('data-party')));
                });
            }

            if (contentType === 'Chaotic') {
                syncPrefsModalChaoticVisibility();
                ['tanks', 'healers', 'melee_dps', 'magical_dps', 'phys_ranged_dps'].forEach(group => {
                    const jobs = Array.isArray(p[group]) ? p[group] : [];
                    editor.querySelectorAll(`.chips-group[data-prefs-group="${group}"] .chip-btn`).forEach(b => {
                        setChipSelected(b, jobs.includes(b.getAttribute('data-job')));
                    });
                });
            } else if (contentType === 'FT:B' || contentType === 'FT:M') {
                const expJobs = Array.isArray(p.phantom_jobs_exp) ? p.phantom_jobs_exp : [];
                const lvlJobs = Array.isArray(p.phantom_jobs_lvl) ? p.phantom_jobs_lvl : [];
                editor.querySelectorAll('#prefs-chips-phantom-exp .chip-btn').forEach(b => {
                    setChipSelected(b, expJobs.includes(b.getAttribute('data-job')));
                });
                editor.querySelectorAll('#prefs-chips-phantom-lvl .chip-btn').forEach(b => {
                    setChipSelected(b, lvlJobs.includes(b.getAttribute('data-job')));
                });
            } else if (contentType === 'BA') {
                const logosExp = Array.isArray(p.logos_actions_exp) ? p.logos_actions_exp : [];
                editor.querySelectorAll('#prefs-chips-logos-exp .chip-btn').forEach(b => {
                    setChipSelected(b, logosExp.includes(b.getAttribute('data-action')));
                });
                const tryEl = document.getElementById('prefs-input-logos-try');
                if (tryEl && p.logos_try_new) tryEl.value = p.logos_try_new;
            } else if (contentType === 'DRS') {
                const lostExp = Array.isArray(p.lost_actions_exp) ? p.lost_actions_exp : [];
                editor.querySelectorAll('#prefs-chips-lost-exp .chip-btn').forEach(b => {
                    setChipSelected(b, lostExp.includes(b.getAttribute('data-action')));
                });
                const tryEl = document.getElementById('prefs-input-lost-try');
                if (tryEl && p.lost_try_new) tryEl.value = p.lost_try_new;
                const duelEl = document.getElementById('prefs-input-drs-duel');
                if (duelEl && p.duel) duelEl.value = p.duel;
            }

            if (check.status === 'outdated') {
                highlightOutdatedFieldsInContainer(editor, check.outdatedFields);
            }
        }

        prefsModalInitialSnapshot = getPrefsModalStateSnapshot();
    }

    function saveCurrentPrefsModalTab() {
        const contentType = activePrefsTab;
        const editor = document.getElementById('prefs-modal-editor');
        if (!editor) return;

        const prefRoleBtn = editor.querySelector('#prefs-preferred-role-chips .chip-btn.selected');
        if (!prefRoleBtn) {
            showPrefsModalAlert('Please select your preferred role.', 'error');
            return;
        }
        const preferredRole = prefRoleBtn.getAttribute('data-role');

        const playableRoles = Array.from(editor.querySelectorAll('#prefs-playable-roles-chips .chip-btn.selected'))
            .map(b => b.getAttribute('data-role'));
        if (playableRoles.length === 0) {
            showPrefsModalAlert('Please select at least one playable role.', 'error');
            return;
        }

        const progSelect = document.getElementById('prefs-input-prog-point');
        const progPoint = progSelect ? progSelect.value : '';
        if (!progPoint) {
            showPrefsModalAlert('Please select your furthest progression point.', 'error');
            if (progSelect) progSelect.focus();
            return;
        }

        const partyContainer = document.getElementById('prefs-party-pref-chips');
        let partyPref = 'Any';
        if (partyContainer) {
            const anyBtn = partyContainer.querySelector('[data-party="Any"]');
            if (!anyBtn || !anyBtn.classList.contains('selected')) {
                const selectedParties = Array.from(partyContainer.querySelectorAll('.chip-btn.selected:not([data-party="Any"])'))
                    .map(b => b.getAttribute('data-party'));
                partyPref = selectedParties.length > 0 ? selectedParties.join(', ') : 'Any';
            }
        }

        const profile = {
            schema_version: CONTENT_SCHEMA_VERSIONS[contentType] || 1,
            preferred_role: preferredRole,
            playable_roles: playableRoles,
            prog_point: progPoint,
            party_preference: partyPref
        };

        if (contentType === 'Chaotic') {
            const getJobs = (group) => Array.from(editor.querySelectorAll(`.chips-group[data-prefs-group="${group}"] .chip-btn.selected`))
                .filter(b => b.style.display !== 'none')
                .map(b => b.getAttribute('data-job'));
            profile.tanks = (playableRoles.includes('Tank') || playableRoles.includes('Any')) ? getJobs('tanks') : [];
            profile.healers = (playableRoles.includes('Regen Healer') || playableRoles.includes('Shield Healer') || playableRoles.includes('Any')) ? getJobs('healers') : [];
            profile.melee_dps = (playableRoles.includes('Melee DPS') || playableRoles.includes('Any')) ? getJobs('melee_dps') : [];
            profile.magical_dps = (playableRoles.includes('Magical DPS') || playableRoles.includes('Any')) ? getJobs('magical_dps') : [];
            profile.phys_ranged_dps = (playableRoles.includes('Physical Ranged DPS') || playableRoles.includes('Any')) ? getJobs('phys_ranged_dps') : [];

            if ((playableRoles.includes('Tank') || playableRoles.includes('Any')) && profile.tanks.length === 0) {
                showPrefsModalAlert('Please select at least one job you can play for Tanks.', 'error');
                return;
            }
            if ((playableRoles.includes('Regen Healer') || playableRoles.includes('Shield Healer') || playableRoles.includes('Any')) && profile.healers.length === 0) {
                showPrefsModalAlert('Please select at least one job you can play for Healers.', 'error');
                return;
            }
            if ((playableRoles.includes('Melee DPS') || playableRoles.includes('Any')) && profile.melee_dps.length === 0) {
                showPrefsModalAlert('Please select at least one job you can play for Melee DPS.', 'error');
                return;
            }
            if ((playableRoles.includes('Magical DPS') || playableRoles.includes('Any')) && profile.magical_dps.length === 0) {
                showPrefsModalAlert('Please select at least one job you can play for Magical DPS.', 'error');
                return;
            }
            if ((playableRoles.includes('Physical Ranged DPS') || playableRoles.includes('Any')) && profile.phys_ranged_dps.length === 0) {
                showPrefsModalAlert('Please select at least one job you can play for Physical Ranged DPS.', 'error');
                return;
            }
        } else if (contentType === 'FT:B' || contentType === 'FT:M') {
            profile.phantom_jobs_exp = Array.from(editor.querySelectorAll('#prefs-chips-phantom-exp .chip-btn.selected')).map(b => b.getAttribute('data-job'));
            profile.phantom_jobs_lvl = Array.from(editor.querySelectorAll('#prefs-chips-phantom-lvl .chip-btn.selected')).map(b => b.getAttribute('data-job'));
            if (profile.phantom_jobs_lvl.length < 6) {
                showPrefsModalAlert('You are required to have at least 6 phantom jobs leveled.', 'error');
                return;
            }
        } else if (contentType === 'BA') {
            profile.logos_actions_exp = Array.from(editor.querySelectorAll('#prefs-chips-logos-exp .chip-btn.selected')).map(b => b.getAttribute('data-action'));
            const tryEl = document.getElementById('prefs-input-logos-try');
            profile.logos_try_new = tryEl ? tryEl.value : 'No';
        } else if (contentType === 'DRS') {
            profile.lost_actions_exp = Array.from(editor.querySelectorAll('#prefs-chips-lost-exp .chip-btn.selected')).map(b => b.getAttribute('data-action'));
            const tryEl = document.getElementById('prefs-input-lost-try');
            const duelEl = document.getElementById('prefs-input-drs-duel');
            profile.lost_try_new = tryEl ? tryEl.value : 'No';
            profile.duel = duelEl ? duelEl.value : 'No';
        }

        savePreferencesForContent(contentType, profile);
        renderPrefsModalTab(contentType);
        showPrefsModalAlert(`Saved ${contentType} preferences!`, 'success');

        if (selectedEvent && selectedEvent.content_type === contentType) {
            applySavedPrefsToStep2Form(contentType);
        }
    }

    function clearCurrentPrefsModalTab() {
        const contentType = activePrefsTab;
        if (!window.confirm(`Reset your saved ${contentType} preferences on this device?`)) return;
        clearPreferencesForContent(contentType);
        renderPrefsModalTab(contentType);
        showPrefsModalAlert(`Reset saved preferences for ${contentType}.`, 'info');
        if (selectedEvent && selectedEvent.content_type === contentType) {
            renderFormInputs();
        }
    }

    // ── Cross-Device Transfer: Share Code & JSON Export/Import ───────────────────

    function encodePrefsShareCode() {
        const store = loadSavedPreferencesStore();
        const keys = Object.keys(store.profiles || {});
        if (keys.length === 0) return null;
        const jsonStr = JSON.stringify({ version: 1, profiles: store.profiles });
        const bytes = new TextEncoder().encode(jsonStr);
        let binary = '';
        bytes.forEach(b => { binary += String.fromCharCode(b); });
        const b64 = btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        return `ALNR1:${b64}`;
    }

    function decodeAndImportPrefsPayload(rawInput) {
        if (!rawInput || typeof rawInput !== 'string') {
            throw new Error('Please provide a valid share code or JSON payload.');
        }
        const trimmed = rawInput.trim();
        let parsed = null;

        if (trimmed.startsWith('ALNR1:')) {
            let b64 = trimmed.slice(6).trim().replace(/-/g, '+').replace(/_/g, '/');
            while (b64.length % 4 !== 0) b64 += '=';
            const binary = atob(b64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            const jsonStr = new TextDecoder().decode(bytes);
            parsed = JSON.parse(jsonStr);
        } else {
            parsed = JSON.parse(trimmed);
        }

        if (!parsed || typeof parsed !== 'object' || typeof parsed.profiles !== 'object' || !parsed.profiles) {
            throw new Error('Invalid preferences format.');
        }

        const store = loadSavedPreferencesStore();
        let importedCount = 0;

        CONTENT_TYPES.forEach(ct => {
            if (parsed.profiles[ct] && typeof parsed.profiles[ct] === 'object') {
                const check = validateSavedProfile(ct, parsed.profiles[ct]);
                if (check.sanitized) {
                    const toSave = Object.assign({}, check.sanitized);
                    // Preserve original schema version if outdated so user gets prompted to review any invalid field
                    if (check.status === 'complete') {
                        toSave.schema_version = CONTENT_SCHEMA_VERSIONS[ct] || 1;
                    }
                    store.profiles[ct] = toSave;
                    importedCount++;
                }
            }
        });

        if (importedCount === 0) {
            throw new Error('No recognized content profiles found in the imported data.');
        }

        writeSavedPreferencesStore(store);
        return importedCount;
    }

    // ── Init on DOM Ready ────────────────────────────────────────────────────────

    document.addEventListener('DOMContentLoaded', async () => {
        // 1. Category Filter Buttons
        document.querySelectorAll('.filter-pill').forEach(pill => {
            pill.onclick = () => {
                document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                activeFilter = pill.getAttribute('data-filter');
                renderEventsGrid();
            };
        });

        // 2. Character limit validation listeners
        setupCharacterLimitValidations();

        // 3. Submit & Inline Save Preferences buttons
        const submitBtn = document.getElementById('btn-submit-form');
        if (submitBtn) {
            submitBtn.onclick = submitSignup;
        }
        const savePrefsInlineBtn = document.getElementById('btn-save-prefs-inline');
        if (savePrefsInlineBtn) {
            savePrefsInlineBtn.onclick = handleSavePrefsInline;
        }

        // 4. Saved Preferences Modal listeners (attached immediately so modal works before runs finish loading)
        const openPrefsBtn = document.getElementById('btn-open-prefs-modal');
        const prefsModalBackdrop = document.getElementById('prefs-modal-backdrop');
        const prefsModalCloseBtn = document.getElementById('prefs-modal-close-btn');
        const prefsModalDismissBtn = document.getElementById('prefs-modal-dismiss-btn');
        if (openPrefsBtn) openPrefsBtn.onclick = () => openPrefsModal();
        if (prefsModalCloseBtn) prefsModalCloseBtn.onclick = () => closePrefsModal();
        if (prefsModalDismissBtn) prefsModalDismissBtn.onclick = () => closePrefsModal();
        if (prefsModalBackdrop) {
            prefsModalBackdrop.onclick = (e) => {
                if (e.target === prefsModalBackdrop) closePrefsModal();
            };
        }

        document.querySelectorAll('#prefs-content-tabs .prefs-tab-btn').forEach(tabBtn => {
            tabBtn.onclick = () => {
                const tab = tabBtn.getAttribute('data-pref-tab');
                if (!tab || tab === activePrefsTab) return;
                if (hasUnsavedPrefsModalChanges()) {
                    if (!window.confirm(`You have unsaved changes for ${activePrefsTab}. Switch to ${tab} without saving?`)) {
                        return;
                    }
                }
                renderPrefsModalTab(tab);
            };
        });

        const prefsSaveTabBtn = document.getElementById('btn-prefs-save-tab');
        const prefsClearTabBtn = document.getElementById('btn-prefs-clear-tab');
        if (prefsSaveTabBtn) prefsSaveTabBtn.onclick = saveCurrentPrefsModalTab;
        if (prefsClearTabBtn) prefsClearTabBtn.onclick = clearCurrentPrefsModalTab;

        // Share code & JSON Export/Import listeners
        const copyShareBtn = document.getElementById('btn-copy-share-code');
        const applyShareBtn = document.getElementById('btn-apply-share-code');
        const shareInput = document.getElementById('input-prefs-share-code');
        const exportJsonBtn = document.getElementById('btn-export-prefs-json');
        const importJsonBtn = document.getElementById('btn-import-prefs-json');
        const importFileInput = document.getElementById('input-import-prefs-file');
        const clearAllPrefsBtn = document.getElementById('btn-clear-all-prefs');

        if (copyShareBtn) {
            copyShareBtn.onclick = async () => {
                const code = encodePrefsShareCode();
                if (!code) {
                    showPrefsModalAlert('No saved preferences to export yet. Save at least one content tab first.', 'error');
                    return;
                }
                if (shareInput) shareInput.value = code;
                try {
                    await navigator.clipboard.writeText(code);
                    showPrefsModalAlert('Share code copied to clipboard! Paste it on your other device.', 'success');
                } catch (e) {
                    showPrefsModalAlert('Share code generated in the box above - copy it to use on another device.', 'info');
                }
            };
        }

        if (applyShareBtn) {
            applyShareBtn.onclick = () => {
                const val = shareInput ? shareInput.value.trim() : '';
                if (!val) {
                    showPrefsModalAlert('Please paste an ALNR1:... share code into the box first.', 'error');
                    return;
                }
                try {
                    const count = decodeAndImportPrefsPayload(val);
                    renderPrefsModalTab(activePrefsTab);
                    if (selectedEvent) applySavedPrefsToStep2Form(selectedEvent.content_type);
                    showPrefsModalAlert(`Successfully imported preferences for ${count} content type(s)!`, 'success');
                } catch (err) {
                    showPrefsModalAlert(`Import failed: ${err.message}`, 'error');
                }
            };
        }

        if (exportJsonBtn) {
            exportJsonBtn.onclick = () => {
                const store = loadSavedPreferencesStore();
                if (Object.keys(store.profiles || {}).length === 0) {
                    showPrefsModalAlert('No saved preferences to export yet. Save at least one content tab first.', 'error');
                    return;
                }
                const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'alnr-signup-preferences.json';
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                showPrefsModalAlert('Downloaded alnr-signup-preferences.json.', 'success');
            };
        }

        if (importJsonBtn && importFileInput) {
            importJsonBtn.onclick = () => importFileInput.click();
            importFileInput.onchange = (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const count = decodeAndImportPrefsPayload(String(reader.result || ''));
                        renderPrefsModalTab(activePrefsTab);
                        if (selectedEvent) applySavedPrefsToStep2Form(selectedEvent.content_type);
                        showPrefsModalAlert(`Successfully imported preferences for ${count} content type(s) from file!`, 'success');
                    } catch (err) {
                        showPrefsModalAlert(`JSON file import failed: ${err.message}`, 'error');
                    } finally {
                        importFileInput.value = '';
                    }
                };
                reader.readAsText(file);
            };
        }

        if (clearAllPrefsBtn) {
            clearAllPrefsBtn.onclick = () => {
                if (!window.confirm('Are you sure you want to delete all saved signup preferences on this device?')) return;
                clearAllSavedPreferences();
                if (shareInput) shareInput.value = '';
                renderPrefsModalTab(activePrefsTab);
                if (selectedEvent) renderFormInputs();
                showPrefsModalAlert('All saved preferences have been cleared from this device.', 'info');
            };
        }

        // 5. Application modal close listeners
        const modalBackdrop = document.getElementById('application-modal-backdrop');
        const modalCloseBtn = document.getElementById('modal-close-btn');
        const modalDismissBtn = document.getElementById('modal-dismiss-btn');
        if (modalCloseBtn) modalCloseBtn.onclick = closeApplicationModal;
        if (modalDismissBtn) modalDismissBtn.onclick = closeApplicationModal;
        if (modalBackdrop) {
            modalBackdrop.onclick = (e) => {
                if (e.target === modalBackdrop) closeApplicationModal();
            };
        }

        // 6. Phantom Job Experience warning modal listeners
        const phantomWarningBackdrop = document.getElementById('phantom-exp-warning-backdrop');
        const phantomWarningCloseBtn = document.getElementById('phantom-warning-close-btn');
        const phantomWarningCancelBtn = document.getElementById('phantom-warning-cancel-btn');
        const phantomWarningConfirmBtn = document.getElementById('phantom-warning-confirm-btn');
        if (phantomWarningCloseBtn) phantomWarningCloseBtn.onclick = closePhantomExpWarningModal;
        if (phantomWarningCancelBtn) phantomWarningCancelBtn.onclick = closePhantomExpWarningModal;
        if (phantomWarningConfirmBtn) phantomWarningConfirmBtn.onclick = confirmPhantomExpSelectAll;
        if (phantomWarningBackdrop) {
            phantomWarningBackdrop.onclick = (e) => {
                if (e.target === phantomWarningBackdrop) closePhantomExpWarningModal();
            };
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const phantomBackdrop = document.getElementById('phantom-exp-warning-backdrop');
                if (phantomBackdrop && phantomBackdrop.style.display !== 'none') {
                    closePhantomExpWarningModal();
                    return;
                }
                closeApplicationModal();
                closePrefsModal();
            }
        });

        // 8. Auth code check, verify session & load events
        await handleAuthCodeIfPresent();
        if (!currentUser) {
            await verifyExistingSession();
        }
        renderAuthBanner();
        updatePrefsCogBadge();

        await loadEvents();
        await loadMySignups();
    });
})();
