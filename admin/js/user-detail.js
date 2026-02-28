/* =====================================================
   USER DETAIL PAGE
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
  
    if (!userId) {
      if (typeof showToast === "function") {
        showToast("Invalid user link", "error");
      }
      setTimeout(() => {
        window.location.href = "users.html";
      }, 1000);
      return;
    }
  
    init(userId);
  });
  
  
  /* =====================================================
     INIT
  ===================================================== */
  async function init(userId) {
    try {
      showLoading(true);
  
      await Promise.all([
        loadUserRisk(userId),
        loadUserActivity(userId)
      ]);
  
    } catch (err) {
      console.error("Initialization error:", err);
      showToast("Failed to load user data", "error");
    } finally {
      showLoading(false);
    }
  }
  
  
  /* =====================================================
     LOAD USER RISK
  ===================================================== */
  async function loadUserRisk(userId) {
  
    // ✅ REMOVE /api
    const res = await authFetch(`/admin/user-risk/${userId}`);
  
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch user risk data");
    }
  
    const data = await res.json();
  
    renderProfile(data.user);
    renderFinancial(data);
    renderDevices(data.devices || []);
    renderReferrals(data.referrals || []);
  }
  
  
  /* =====================================================
     LOAD USER ACTIVITY
  ===================================================== */
  async function loadUserActivity(userId) {
  
    // ✅ REMOVE /api
    const res = await authFetch(`/admin/user-activity/${userId}`);
  
    if (!res.ok) {
      console.warn("Activity API not ready");
      return;
    }
  
    const logs = await res.json();
    renderTimeline(logs || []);
  }
  
  
  /* =====================================================
     RENDER PROFILE
  ===================================================== */
  function renderProfile(user) {
    const el = document.getElementById("profileData");
    if (!el) return;
  
    el.innerHTML = `
      <p><strong>Name:</strong> ${user?.name || "-"}</p>
      <p><strong>Phone:</strong> ${user?.mobile || "-"}</p>
      <p><strong>Status:</strong> ${user?.isBanned ? "BANNED" : "Active"}</p>
      <p><strong>Last Login:</strong> ${formatDate(user?.lastLogin)}</p>
      <p><strong>Ban Reason:</strong> ${user?.banReason || "None"}</p>
    `;
  }
  
  
  /* =====================================================
     RENDER FINANCIAL
  ===================================================== */
  function renderFinancial(data) {
    setText("totalRecharge", `Recharge: ₹${formatMoney(data.totalRecharge)}`);
    setText("totalWithdraw", `Withdraw: ₹${formatMoney(data.totalWithdraw)}`);
    setText("netResult", `Net: ₹${formatMoney(data.net)}`);
    setText("riskScore", `Risk Score: ${data.user?.riskScore || 0}`);
  }
  
  
  /* =====================================================
     RENDER DEVICES
  ===================================================== */
  function renderDevices(devices) {
    const tbody = document.querySelector("#deviceTable tbody");
    if (!tbody) return;
  
    if (!devices.length) {
      tbody.innerHTML = `<tr><td colspan="4">No device history</td></tr>`;
      return;
    }
  
    tbody.innerHTML = devices.map(d => `
      <tr>
        <td>${d.ipAddress || "-"}</td>
        <td>${d.deviceInfo || "-"}</td>
        <td>${d.userAgent || "-"}</td>
        <td>${formatDate(d.loginAt)}</td>
      </tr>
    `).join("");
  }
  
  
  /* =====================================================
     RENDER REFERRALS
  ===================================================== */
  function renderReferrals(referrals) {
    const el = document.getElementById("referralTree");
    if (!el) return;
  
    if (!referrals.length) {
      el.innerHTML = "No referrals";
      return;
    }
  
    el.innerHTML = referrals
      .map(r => `<div>• ${r.name || "Unnamed"} (${r.userId})</div>`)
      .join("");
  }
  
  
  /* =====================================================
     RENDER TIMELINE
  ===================================================== */
  function renderTimeline(logs) {
    const timeline = document.getElementById("activityTimeline");
    if (!timeline) return;
  
    if (!logs.length) {
      timeline.innerHTML = "No activity logs";
      return;
    }
  
    timeline.innerHTML = logs.map(log => `
      <div class="timeline-item">
        <div><strong>${log.message || "Activity"}</strong></div>
        <div style="font-size:13px;color:#666;">
          ${log.type || "-"}
        </div>
        <div style="font-size:12px;color:#999;">
          ${formatDate(log.date)}
        </div>
      </div>
    `).join("");
  }
  
  
  /* =====================================================
     UTILITIES
  ===================================================== */
  
  function formatDate(date) {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-GB");
  }
  
  function formatMoney(amount) {
    return Number(amount || 0).toLocaleString("en-IN");
  }
  
  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  }
  
  function showLoading(state) {
    const container = document.querySelector(".risk-container");
    if (!container) return;
    container.style.opacity = state ? "0.5" : "1";
  }