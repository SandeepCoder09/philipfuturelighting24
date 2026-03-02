document.addEventListener("DOMContentLoaded", () => {
    loadUsdtRecharges();
    initModalSystem();
  });
  
  let allUsdtDeposits = [];
  let confirmCallback = null;
  
  /* ==========================================
     LOAD DATA
  ========================================== */
  
  async function loadUsdtRecharges() {
  
    const tbody = document.getElementById("usdtTableBody");
    if (!tbody) return;
  
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="table-empty">Loading...</td>
      </tr>
    `;
  
    try {
  
      const response = await authFetch("/admin/usdt-deposits");
      if (!response.ok) throw new Error("Failed");
  
      allUsdtDeposits = await response.json();
      renderUsdtTable();
  
    } catch (error) {
  
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="table-empty">
            Failed to load deposits
          </td>
        </tr>
      `;
    }
  }
  
  /* ==========================================
     RENDER TABLE
  ========================================== */
  
  function renderUsdtTable() {
  
    const tbody = document.getElementById("usdtTableBody");
    const searchInput = document.getElementById("searchUsdt");
    const statusSelect = document.getElementById("usdtStatusFilter");
  
    if (!tbody) return;
  
    const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
    const statusFilter = statusSelect ? statusSelect.value : "";
  
    let filtered = allUsdtDeposits.filter(dep => {
  
      const matchesSearch =
        dep.userId.toString().includes(searchValue) ||
        (dep.txnHash && dep.txnHash.toLowerCase().includes(searchValue));
  
      const matchesStatus =
        !statusFilter ||
        (dep.status && dep.status.toLowerCase() === statusFilter);
  
      return matchesSearch && matchesStatus;
    });
  
    if (!filtered.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="table-empty">
            No USDT deposits found
          </td>
        </tr>
      `;
      return;
    }
  
    tbody.innerHTML = "";
  
    filtered.forEach(dep => {
  
      const tr = document.createElement("tr");
      const status = dep.status ? dep.status.toLowerCase() : "pending";
  
      tr.innerHTML = `
        <td>${dep.userId}</td>
  
        <td style="word-break:break-all;">
          ${dep.txnHash || "-"}
        </td>
  
        <td style="color:#00c6ff;">
          USDT ${formatMoney(dep.amount)}
        </td>
  
        <td>
          <span class="table-status ${getStatusClass(status)}">
            ${status.toUpperCase()}
          </span>
        </td>
  
        <td>
          ${formatDate(dep.createdAt)}
        </td>
  
        <td>
          ${status === "pending" ? `
            <button class="table-btn btn-approve"
              onclick="confirmApprove('${dep._id}')">
              Approve
            </button>
  
            <button class="table-btn btn-reject"
              onclick="confirmReject('${dep._id}')">
              Reject
            </button>
          ` : "-"}
        </td>
      `;
  
      tbody.appendChild(tr);
    });
  }
  
  /* ==========================================
     MODAL SYSTEM
  ========================================== */
  
  function initModalSystem() {
  
    const confirmBtn = document.getElementById("modalConfirmBtn");
    if (!confirmBtn) return;
  
    confirmBtn.addEventListener("click", () => {
      if (confirmCallback) confirmCallback();
      closeModal();
    });
  }
  
  function openModal(title, message, isDanger, callback) {
  
    const modal = document.getElementById("confirmModal");
    const confirmBtn = document.getElementById("modalConfirmBtn");
  
    if (!modal || !confirmBtn) return;
  
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalMessage").innerText = message;
  
    confirmBtn.classList.remove("danger");
    if (isDanger) confirmBtn.classList.add("danger");
  
    confirmCallback = callback;
    modal.classList.add("active");
  }
  
  function closeModal() {
    const modal = document.getElementById("confirmModal");
    if (modal) modal.classList.remove("active");
    confirmCallback = null;
  }
  
  /* ==========================================
     APPROVE FLOW
  ========================================== */
  
  function confirmApprove(id) {
  
    openModal(
      "Approve Deposit",
      "Are you sure you want to approve this USDT deposit?",
      false,
      async () => {
        await approveDeposit(id);
      }
    );
  }
  
  async function approveDeposit(id) {
  
    try {
  
      const response = await authFetch(`/admin/usdt-approve/${id}`, {
        method: "POST"
      });
  
      if (!response.ok) throw new Error("Failed");
  
      showToast("Deposit approved", "success");
      loadUsdtRecharges();
  
    } catch (error) {
      showToast("Approval failed", "error");
    }
  }
  
  /* ==========================================
     REJECT FLOW
  ========================================== */
  
  function confirmReject(id) {
  
    openModal(
      "Reject Deposit",
      "Are you sure you want to reject this USDT deposit?",
      true,
      async () => {
        await rejectDeposit(id);
      }
    );
  }
  
  async function rejectDeposit(id) {
  
    try {
  
      const response = await authFetch(`/admin/usdt-reject/${id}`, {
        method: "POST"
      });
  
      if (!response.ok) throw new Error("Failed");
  
      showToast("Deposit rejected", "warning");
      loadUsdtRecharges();
  
    } catch (error) {
      showToast("Rejection failed", "error");
    }
  }
  
  /* ==========================================
     STATUS STYLE
  ========================================== */
  
  function getStatusClass(status) {
  
    if (!status) return "status-pending";
  
    if (status === "approved") return "status-success";
    if (status === "rejected") return "status-rejected";
    if (status === "failed") return "status-rejected";
  
    return "status-pending";
  }
  
  /* ==========================================
     UTILITIES
  ========================================== */
  
  function formatDate(date) {
    return new Date(date).toLocaleString("en-IN");
  }
  
  function formatMoney(amount) {
    return Number(amount || 0).toLocaleString("en-IN");
  }