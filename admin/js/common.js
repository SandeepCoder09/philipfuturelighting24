// ==============================
// Sidebar Toggle
// ==============================
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) {
    sidebar.classList.toggle("active");
  }
}

// ==============================
// Logout
// ==============================
function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "login.html";
}

// ==============================
// Protect Admin Pages
// ==============================
document.addEventListener("DOMContentLoaded", function () {

  const token = localStorage.getItem("adminToken");

  const currentPath = window.location.pathname;

  const isLoginPage = currentPath.includes("login.html");

  // If NOT login page & no token → redirect
  if (!token && !isLoginPage) {
    window.location.href = "login.html";
  }

  // If already logged in & on login page → go dashboard
  if (token && isLoginPage) {
    window.location.href = "index.html";
  }

});

// ==============================
// Auto Highlight Active Menu
// ==============================
document.addEventListener("DOMContentLoaded", function () {

  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".sidebar nav a");

  navLinks.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    }
  });

});
