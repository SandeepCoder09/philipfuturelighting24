/* ================================================================
   FORGOT PASSWORD — auth/forgot-password.js
   Features:
   - Math-based CAPTCHA (refresh on click)
   - Registered mobile only (API check)
   - OTP send → verify → new password flow
   - LED loading button
================================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ── BUILD UI DYNAMICALLY INTO .forgot-container ─────────────── */
    const container = document.querySelector(".forgot-container");
    if (!container) return;

    container.innerHTML = `
      <div class="forgot-header">
        <i class="fa-solid fa-mobile-screen-button"></i>
        <h2>Forgot Password</h2>
        <p>Enter your registered mobile number</p>
      </div>
  
      <!-- STEP 1: Mobile + Captcha -->
      <div id="step1">
        <div class="input-group" style="margin-bottom:14px">
          <i class="fa-solid fa-phone"></i>
          <input type="tel" id="mobileInput" placeholder="10-digit mobile number"
                 maxlength="10" inputmode="numeric"/>
        </div>
  
        <div class="captcha-row">
          <div class="captcha-box">
            <i class="fa-solid fa-shield-halved"></i>
            <input type="text" id="captchaInput" placeholder="Enter result" maxlength="3" inputmode="numeric"/>
          </div>
          <div class="captcha-display" id="captchaDisplay" title="Click to refresh">
            <span id="captchaText">?</span>
            <span class="refresh-icon">↻ tap</span>
          </div>
        </div>
  
        <button class="reset-btn" id="sendOtpBtn">
          <i class="fa-solid fa-paper-plane"></i>
          <span class="btn-text">Send OTP</span>
          <div class="led-dots hidden"><span></span><span></span><span></span></div>
        </button>
      </div>
  
      <!-- STEP 2: OTP + New Password (hidden initially) -->
      <div id="step2" class="otp-section">
        <p style="font-size:.82rem;color:var(--gray);text-align:center;margin-bottom:4px">
          OTP sent to <strong id="otpSentTo"></strong>
        </p>
  
        <div class="otp-row">
          <input type="password" maxlength="1" class="otp-box" inputmode="numeric"/>
          <input type="password" maxlength="1" class="otp-box" inputmode="numeric"/>
          <input type="password" maxlength="1" class="otp-box" inputmode="numeric"/>
          <input type="password" maxlength="1" class="otp-box" inputmode="numeric"/>
        </div>
  
        <div class="input-group" style="margin-top:4px">
          <i class="fa-solid fa-lock"></i>
          <input type="password" id="newPassword" placeholder="New password (min 6 chars)"/>
        </div>
  
        <div class="input-group">
          <i class="fa-solid fa-lock"></i>
          <input type="password" id="confirmNewPassword" placeholder="Confirm new password"/>
        </div>
  
        <button class="reset-btn" id="verifyOtpBtn">
          <i class="fa-solid fa-check-circle"></i>
          <span class="btn-text">Reset Password</span>
          <div class="led-dots hidden"><span></span><span></span><span></span></div>
        </button>
  
        <p style="text-align:center;font-size:.82rem;color:var(--gray);margin-top:4px">
          Didn't receive? <span id="resendLink"
            style="color:var(--blue);font-weight:700;cursor:pointer">Resend OTP</span>
          <span id="resendTimer" style="color:var(--gray);font-size:.8rem"></span>
        </p>
      </div>
  
      <div id="authMsg" class="auth-msg hidden"></div>
    `;

    /* ── CAPTCHA GENERATOR ──────────────────────────────────────── */
    let captchaAnswer = 0;

    function generateCaptcha() {
        const ops = ['+', '-', '×'];
        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b;

        if (op === '+') { a = rand(1, 30); b = rand(1, 30); captchaAnswer = a + b; }
        if (op === '-') { a = rand(10, 30); b = rand(1, a); captchaAnswer = a - b; }
        if (op === '×') { a = rand(2, 9); b = rand(2, 9); captchaAnswer = a * b; }

        document.getElementById('captchaText').textContent = `${a} ${op} ${b} = ?`;
        document.getElementById('captchaInput').value = '';
    }

    function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    generateCaptcha();
    document.getElementById('captchaDisplay').addEventListener('click', generateCaptcha);

    /* ── MOBILE INPUT ───────────────────────────────────────────── */
    const mobileInput = document.getElementById('mobileInput');
    mobileInput.addEventListener('input', () => {
        mobileInput.value = mobileInput.value.replace(/\D/g, '').slice(0, 10);
    });

    /* ── MESSAGE BOX ────────────────────────────────────────────── */
    function showMsg(text, type = 'error') {
        const box = document.getElementById('authMsg');
        box.textContent = text;
        box.className = `auth-msg ${type}`;
        setTimeout(() => box.classList.add('hidden'), 4000);
    }

    /* ── LOADING TOGGLE ─────────────────────────────────────────── */
    function setLoading(btnId, state) {
        const btn = document.getElementById(btnId);
        if (!btn) return;
        btn.disabled = state;
        btn.querySelector('.btn-text').classList.toggle('hidden', state);
        btn.querySelector('.led-dots').classList.toggle('hidden', !state);
    }

    /* ── STEP 1 — SEND OTP ──────────────────────────────────────── */
    document.getElementById('sendOtpBtn').addEventListener('click', async () => {
        const mobile = mobileInput.value.trim();
        const captchaVal = document.getElementById('captchaInput').value.trim();

        // Validation
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            showMsg('Enter a valid 10-digit Indian mobile number.'); return;
        }
        if (!captchaVal || parseInt(captchaVal) !== captchaAnswer) {
            showMsg('Incorrect captcha answer. Please try again.');
            generateCaptcha(); return;
        }

        setLoading('sendOtpBtn', true);

        try {
            const res = await authFetch('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ mobile: '+91' + mobile })
            });

            const data = await res.json().catch(() => ({}));

            setLoading('sendOtpBtn', false);

            if (!res.ok) {
                // If mobile is not registered the backend returns 404/400
                const msg = data.message || 'Mobile number not registered.';
                showMsg(msg); generateCaptcha(); return;
            }

            // Success → show step 2
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').classList.add('visible');
            document.getElementById('otpSentTo').textContent = '+91 ' + mobile;
            showMsg('OTP sent successfully!', 'success');
            document.querySelector('.otp-box').focus();
            startResendTimer();

        } catch (err) {
            setLoading('sendOtpBtn', false);
            showMsg('Server error. Please try again.');
        }
    });

    /* ── OTP BOXES ──────────────────────────────────────────────── */
    const otpBoxes = document.querySelectorAll('.otp-box');
    otpBoxes.forEach((box, i) => {
        box.addEventListener('input', () => {
            box.value = box.value.replace(/\D/g, '');
            if (box.value) {
                box.classList.add('filled');
                if (i < otpBoxes.length - 1) otpBoxes[i + 1].focus();
            } else {
                box.classList.remove('filled');
            }
        });
        box.addEventListener('keydown', e => {
            if (e.key === 'Backspace' && !box.value && i > 0) otpBoxes[i - 1].focus();
        });
    });

    function getOtp() {
        return Array.from(otpBoxes).map(b => b.value).join('');
    }

    /* ── STEP 2 — VERIFY OTP + RESET ───────────────────────────── */
    document.getElementById('verifyOtpBtn').addEventListener('click', async () => {
        const otp = getOtp();
        const newPwd = document.getElementById('newPassword').value.trim();
        const confirmPwd = document.getElementById('confirmNewPassword').value.trim();
        const mobile = mobileInput.value.trim();

        if (otp.length !== 4) { showMsg('Enter complete 4-digit OTP.'); return; }
        if (newPwd.length < 6) { showMsg('Password must be at least 6 characters.'); return; }
        if (newPwd !== confirmPwd) { showMsg('Passwords do not match.'); return; }

        setLoading('verifyOtpBtn', true);

        try {
            const res = await authFetch('/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({
                    mobile: '+91' + mobile,
                    otp,
                    newPassword: newPwd
                })
            });

            const data = await res.json().catch(() => ({}));
            setLoading('verifyOtpBtn', false);

            if (!res.ok) {
                showMsg(data.message || 'OTP verification failed.'); return;
            }

            showMsg('Password reset successfully! Redirecting...', 'success');
            setTimeout(() => { window.location.href = '../auth/index.html'; }, 1600);

        } catch (err) {
            setLoading('verifyOtpBtn', false);
            showMsg('Server error. Please try again.');
        }
    });

    /* ── RESEND TIMER ───────────────────────────────────────────── */
    let resendInterval = null;

    function startResendTimer() {
        let secs = 60;
        const link = document.getElementById('resendLink');
        const timer = document.getElementById('resendTimer');
        link.style.pointerEvents = 'none';
        link.style.opacity = '0.4';
        timer.textContent = ` (${secs}s)`;

        resendInterval = setInterval(() => {
            secs--;
            timer.textContent = ` (${secs}s)`;
            if (secs <= 0) {
                clearInterval(resendInterval);
                link.style.pointerEvents = '';
                link.style.opacity = '';
                timer.textContent = '';
            }
        }, 1000);
    }

    document.getElementById('resendLink').addEventListener('click', async () => {
        const mobile = mobileInput.value.trim();
        try {
            const res = await authFetch('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ mobile: '+91' + mobile })
            });
            if (res.ok) {
                showMsg('OTP resent!', 'success');
                otpBoxes.forEach(b => { b.value = ''; b.classList.remove('filled'); });
                otpBoxes[0].focus();
                startResendTimer();
            } else {
                showMsg('Failed to resend OTP.');
            }
        } catch { showMsg('Server error.'); }
    });

});