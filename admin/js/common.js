// ==============================
// Sidebar Toggle
// ==============================
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.classList.toggle("active");
}

// ==============================
// Close Sidebar on Outside Click (Mobile Friendly)
// ==============================
document.addEventListener("click", function (event) {
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.querySelector(".menu-toggle");

  if (
    sidebar &&
    sidebar.classList.contains("active") &&
    !sidebar.contains(event.target) &&
    !toggleBtn.contains(event.target)
  ) {
    sidebar.classList.remove("active");
  }
});

// ==============================
// Logout Function
// ==============================
function logout() {
  localStorage.removeItem("adminToken");
  window.location.href = "../pages/login.html";
}

// ==============================
// Protect Admin Pages
// ==============================
document.addEventListener("DOMContentLoaded", function () {

  const token = localStorage.getItem("adminToken");

  // If on login page, skip protection
  const isLoginPage = window.location.pathname.includes("login.html");

  if (!token && !isLoginPage) {
    window.location.href = "../admin/login.html";
  }

});

// ==============================
// Auto Highlight Active Sidebar Link
// ==============================
document.addEventListener("DOMContentLoaded", function () {

  const currentPage = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".sidebar nav a");

  navLinks.forEach(link => {
    if (link.getAttribute("href").includes(currentPage)) {
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    }
  });

});
