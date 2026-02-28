/* =====================================================
   SIDEBAR TOGGLE
===================================================== */
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.classList.toggle("active");
}


/* =====================================================
   LOGOUT
===================================================== */
function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "/admin/login.html";
}


/* =====================================================
   TOAST SYSTEM
===================================================== */
function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.classList.add("toast", `toast-${type}`);

  toast.innerHTML = `
    <span>${message}</span>
    <span class="toast-close">&times;</span>
  `;

  container.appendChild(toast);

  toast.querySelector(".toast-close")
    .addEventListener("click", () => toast.remove());

  setTimeout(() => {
    toast.remove();
  }, duration);
}


/* =====================================================
   REAL-TIME SOCKET SYSTEM (PRO VERSION)
===================================================== */
let socket;

function initSocket() {

  if (socket) return;

  socket = io(API_BASE, {
    transports: ["websocket", "polling"]
  });

  socket.on("connect", () => {
    console.log("🟢 Real-time Connected:", socket.id);
    socket.emit("join_admin_room");
  });

  socket.on("disconnect", () => {
    console.log("🔴 Real-time Disconnected");
  });

  /* 🔥 NEW USER */
  socket.on("user_registered", () => {
    console.log("👤 New user registered");
    showToast("New user registered", "success");

    if (typeof loadUsers === "function") loadUsers();
    if (typeof loadDashboard === "function") loadDashboard();
  });

  /* 🔥 NEW TRANSACTION */
  socket.on("transaction_updated", () => {
    console.log("💰 Transaction updated");
    showToast("New transaction received", "info");

    if (typeof loadTransactions === "function") loadTransactions();
    if (typeof loadDashboard === "function") loadDashboard();
  });

  /* 🔥 NEW WITHDRAWAL */
  socket.on("withdraw_updated", () => {
    console.log("💸 New withdrawal request");
    showToast("New withdrawal request", "warning");

    if (typeof loadWithdraws === "function") loadWithdraws();
    if (typeof loadDashboard === "function") loadDashboard();
  });

}


/* =====================================================
   DOM READY LOGIC
===================================================== */
document.addEventListener("DOMContentLoaded", function () {

  const token = localStorage.getItem("adminToken");
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.includes("login.html");

  // 🔐 Protect admin pages
  if (!token && !isLoginPage) {
    window.location.href = "login.html";
    return;
  }

  if (token && isLoginPage) {
    window.location.href = "index.html";
    return;
  }

  // 🔹 Highlight active menu
  const currentPage = currentPath.split("/").pop();
  const navLinks = document.querySelectorAll(".sidebar nav a");

  navLinks.forEach(link => {
    const href = link.getAttribute("href");

    if (
      href === currentPage ||
      href === `../${currentPage}` ||
      currentPath.includes(href)
    ) {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    }
  });

  // 🔥 Initialize socket (only if not login page)
  if (!isLoginPage) {
    initSocket();
  }

});