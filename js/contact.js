// A Late Night Reborn - Public Website Contact Form

(function () {
    function getApiUrl() {
        let stored = localStorage.getItem('alnr_api_url');
        if (stored && (stored.includes('workers.dev') || (!window.location.hostname.includes('localhost') && stored.includes('localhost')))) {
            localStorage.removeItem('alnr_api_url');
            stored = null;
        }
        if (stored) return stored.replace(/\/+$/, '');
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://127.0.0.1:5000';
        }
        return 'https://api.alatenightreborn.com';
    }

    function initContactForms() {
        const forms = document.querySelectorAll('.contact-form, #contact-form');
        forms.forEach(form => {
            if (form.__initialized) return;
            form.__initialized = true;

            const nameInput = form.querySelector('[name="character_name"]') || form.querySelector('#contact-name');
            const contactInput = form.querySelector('[name="contact_info"]') || form.querySelector('#contact-info');
            const messageInput = form.querySelector('[name="message"]') || form.querySelector('#contact-message');
            const hpInput = form.querySelector('[name="hp"]') || form.querySelector('#contact-hp');
            const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-submit-contact');
            const statusBox = form.querySelector('.contact-status') || form.parentElement.querySelector('.contact-status') || document.getElementById('contact-status');

            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                const name = nameInput ? nameInput.value.trim() : '';
                const contact = contactInput ? contactInput.value.trim() : '';
                const message = messageInput ? messageInput.value.trim() : '';
                const hp = hpInput ? hpInput.value.trim() : '';

                if (name.length < 2) {
                    showStatus('Please enter your character or display name (at least 2 characters).', 'error');
                    if (nameInput) nameInput.focus();
                    return;
                }

                if (message.length < 5) {
                    showStatus('Please enter a message of at least 5 characters.', 'error');
                    if (messageInput) messageInput.focus();
                    return;
                }

                const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s infinite linear;">sync</span> Sending...';
                }
                showStatus('', '');

                try {
                    const res = await fetch(`${getApiUrl()}/api/public/contact`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: JSON.stringify({
                            character_name: name,
                            contact_info: contact,
                            message: message,
                            hp: hp
                        })
                    });

                    const data = await res.json().catch(() => ({}));

                    if (res.ok && data.ok) {
                        showStatus(data.message || 'Your message has been sent successfully! Our administration team will review it shortly.', 'success');
                        form.reset();
                    } else {
                        showStatus(data.error || 'Failed to send message. Please try again later.', 'error');
                    }
                } catch (err) {
                    showStatus('Network error while sending message. Please try again later or reach out on Discord.', 'error');
                } finally {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalBtnContent;
                    }
                }
            });

            function showStatus(text, type) {
                if (!statusBox) return;
                if (!text) {
                    statusBox.style.display = 'none';
                    statusBox.className = 'contact-status';
                    statusBox.innerHTML = '';
                    return;
                }
                statusBox.style.display = 'flex';
                statusBox.className = `contact-status status-alert ${type}`;
                const icon = type === 'success' ? 'check_circle' : 'error';
                statusBox.innerHTML = `<span class="material-symbols-outlined">${icon}</span> <span>${text}</span>`;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactForms);
    } else {
        initContactForms();
    }
})();
