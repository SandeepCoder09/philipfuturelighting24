/* ================================================================
   PHILIPS POPUP — shared/ui/popup.js
   Philips Lighting Style
   
   Usage:
     showPhilipsPopup("Title", "Message", "success" | "error" | "warning" | "info")
   
   Auto-injects required CSS if popup.css is not linked.
================================================================ */

(function () {

  /* ── ICON MAP ─────────────────────────────────────────────── */
  const ICON_MAP = {
    success: { icon: 'fa-circle-check', color: '#16a34a', bg: 'rgba(22,163,74,0.10)' },
    error: { icon: 'fa-circle-xmark', color: '#dc2626', bg: 'rgba(220,38,38,0.10)' },
    warning: { icon: 'fa-triangle-exclamation', color: '#c4ac00', bg: 'rgba(245,216,0,0.18)' },
    info: { icon: 'fa-circle-info', color: '#0033a0', bg: 'rgba(0,33,160,0.10)' },
  };

  /* ── MAIN FUNCTION ───────────────────────────────────────── */
  window.showPhilipsPopup = function (title, message, type = 'info') {

    // Remove any existing popup
    const existing = document.querySelector('.philips-popup-overlay');
    if (existing) existing.remove();

    const cfg = ICON_MAP[type] || ICON_MAP.info;

    /* ── OVERLAY ──────────────────────────────────────────── */
    const overlay = document.createElement('div');
    overlay.className = 'philips-popup-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(0, 7, 26, 0.72);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: __pp_bg_in 0.2s ease;
    `;

    /* ── BOX ──────────────────────────────────────────────── */
    const box = document.createElement('div');
    box.className = 'philips-popup-box';

    box.style.cssText = `
      background: #ffffff;
      border-radius: 18px;
      padding: 32px 28px 28px;
      max-width: 320px;
      width: 100%;
      text-align: center;
      box-shadow: 0 24px 64px rgba(0,0,0,0.35);
      border: 1px solid rgba(245,216,0,0.10);
      animation: __pp_rise 0.38s cubic-bezier(0.34,1.56,0.64,1);
      position: relative;
    `;

    /* ── ICON ─────────────────────────────────────────────── */
    const iconWrap = document.createElement('div');
    iconWrap.style.cssText = `
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: ${cfg.bg};
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 18px;
    `;

    const icon = document.createElement('i');
    icon.className = `fa-solid ${cfg.icon}`;
    icon.style.cssText = `
      font-size: 1.7rem;
      color: ${cfg.color};
    `;

    iconWrap.appendChild(icon);

    /* ── TITLE ────────────────────────────────────────────── */
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.cssText = `
      font-family: 'Barlow Condensed', 'Barlow', sans-serif;
      font-weight: 900;
      font-size: 1.2rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0d1b3e;
      margin: 0 0 9px;
      line-height: 1.15;
    `;

    /* ── MESSAGE ──────────────────────────────────────────── */
    const msgEl = document.createElement('p');
    msgEl.textContent = message;
    msgEl.style.cssText = `
      font-family: 'Barlow', sans-serif;
      font-size: 0.88rem;
      font-weight: 400;
      color: #6b7280;
      line-height: 1.65;
      margin: 0 0 24px;
    `;

    /* ── OK BUTTON ────────────────────────────────────────── */
    const btn = document.createElement('button');
    btn.textContent = 'OK';
    btn.style.cssText = `
      width: 100%;
      padding: 13px;
      border: none;
      border-radius: 9px;
      background: #0033a0;
      color: #ffffff;
      font-family: 'Barlow Condensed', 'Barlow', sans-serif;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.2s, transform 0.15s;
      box-shadow: 0 4px 14px rgba(0,33,160,0.30);
    `;

    btn.addEventListener('mouseenter', () => {
      btn.style.background = '#001f6b';
      btn.style.transform = 'translateY(-1px)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.background = '#0033a0';
      btn.style.transform = 'translateY(0)';
    });

    /* ── CLOSE BULB BADGE (decorative) ───────────────────── */
    const bulb = document.createElement('div');
    bulb.style.cssText = `
      position: absolute;
      top: -18px;
      right: 22px;
      width: 36px;
      height: 44px;
    `;
    bulb.innerHTML = `
      <div style="
        width:28px;height:32px;border-radius:50% 50% 30% 30%;
        background:radial-gradient(ellipse at 40% 30%,rgba(255,255,220,.95) 0%,#f5d800 50%,rgba(200,140,0,.5) 100%);
        box-shadow:0 0 18px rgba(245,216,0,.8),0 0 40px rgba(245,216,0,.4);
        margin:0 auto;animation:__pp_glow 2s ease-in-out infinite;
      "></div>
      <div style="width:18px;height:8px;background:linear-gradient(to bottom,rgba(245,216,0,.5),rgba(180,140,0,.7));margin:0 auto;border-radius:0 0 4px 4px;"></div>
      <div style="width:14px;height:10px;background:linear-gradient(to bottom,#b8860b,#6b4f10);margin:0 auto;border-radius:2px;"></div>
    `;

    /* ── ASSEMBLE ─────────────────────────────────────────── */
    box.appendChild(bulb);
    box.appendChild(iconWrap);
    box.appendChild(titleEl);
    box.appendChild(msgEl);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    /* ── INJECT KEYFRAMES (once) ──────────────────────────── */
    if (!document.getElementById('__pp_styles')) {
      const style = document.createElement('style');
      style.id = '__pp_styles';
      style.textContent = `
        @keyframes __pp_bg_in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes __pp_rise {
          from { transform: scale(0.82) translateY(24px); opacity: 0; }
          to   { transform: scale(1)    translateY(0);    opacity: 1; }
        }
        @keyframes __pp_glow {
          0%,100% { box-shadow: 0 0 18px rgba(245,216,0,.8), 0 0 40px rgba(245,216,0,.4); }
          50%      { box-shadow: 0 0 30px rgba(245,216,0,1),  0 0 70px rgba(245,216,0,.65); }
        }
        .philips-popup-overlay * { box-sizing: border-box; }
      `;
      document.head.appendChild(style);
    }

    /* ── CLOSE HANDLERS ───────────────────────────────────── */
    function closePopup() {
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.18s ease';
      setTimeout(() => overlay.remove(), 200);
    }

    btn.addEventListener('click', closePopup);

    // Close on backdrop click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePopup();
    });

    // Close on Escape key
    function onKeyDown(e) {
      if (e.key === 'Escape') { closePopup(); document.removeEventListener('keydown', onKeyDown); }
    }
    document.addEventListener('keydown', onKeyDown);

    // Focus button for accessibility
    setTimeout(() => btn.focus(), 50);
  };

})();