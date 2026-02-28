document.addEventListener("DOMContentLoaded", () => {

  let allUsers = [];

  /* ================= LOAD USERS ================= */
  async function loadUsers() {
    try {

      // ✅ REMOVE /api (already inside API_BASE)
      const response = await authFetch(`/admin/users`);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      allUsers = await response.json();
      renderUsers(allUsers);

    } catch (error) {
      console.error("Error loading users:", error);
      showToast("Failed to load users", "error");
    }
  }


  /* ================= RENDER USERS ================= */
  function renderUsers(users) {

    const table = document.getElementById("userTable");
    if (!table) return;

    table.innerHTML = "";

    if (!users || users.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="9">No users found</td>
        </tr>
      `;
      return;
    }

    users.forEach(user => {

      const created = user.createdAt
        ? new Date(user.createdAt).toLocaleString("en-GB")
        : "-";

      const statusBadge = user.isBanned
        ? `<span class="badge badge-danger">Banned</span>`
        : `<span class="badge badge-success">Active</span>`;

      const detailsBtn = `
        <a href="user-detail.html?userId=${user.userId}">
          <button class="action-btn btn-info">Details</button>
        </a>
      `;

      let actionBtn = "";

      if (user.isAdmin) {
        actionBtn = `
          ${detailsBtn}
          <span style="color:orange;font-weight:bold;margin-left:8px;">
            Admin
          </span>
        `;
      } 
      else if (user.isBanned) {
        actionBtn = `
          ${detailsBtn}
          <button class="action-btn btn-unban"
            onclick="toggleBan(${user.userId}, false)">
            Unban
          </button>
        `;
      } 
      else {
        actionBtn = `
          ${detailsBtn}
          <button class="action-btn btn-ban"
            onclick="toggleBan(${user.userId}, true)">
            Ban
          </button>
        `;
      }

      table.innerHTML += `
        <tr>
          <td>${user.userId || "-"}</td>
          <td>${user.name || "-"}</td>
          <td>${user.mobile || "-"}</td>
          <td>₹${user.walletBalance || 0}</td>
          <td>₹${user.totalRecharge || 0}</td>
          <td>₹${user.totalWithdraw || 0}</td>
          <td>${statusBadge}</td>
          <td>${created}</td>
          <td>${actionBtn}</td>
        </tr>
      `;
    });
  }


  /* ================= SEARCH ================= */
  const searchInput = document.getElementById("searchInput");

  if (searchInput) {
    searchInput.addEventListener("input", searchUsers);
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") searchUsers();
    });
  }

  function searchUsers() {

    const keyword = searchInput.value.toLowerCase().trim();

    if (!keyword) {
      renderUsers(allUsers);
      return;
    }

    const filtered = allUsers.filter(user =>
      user.mobile?.toLowerCase().includes(keyword) ||
      user.name?.toLowerCase().includes(keyword) ||
      user.userId?.toString().includes(keyword)
    );

    renderUsers(filtered);
  }


  /* ================= BAN / UNBAN ================= */
  window.toggleBan = async function (userId, banned) {

    const confirmAction = confirm(
      banned
        ? "Are you sure you want to ban this user?"
        : "Are you sure you want to unban this user?"
    );

    if (!confirmAction) return;

    try {

      // ✅ REMOVE /api here also
      const response = await authFetch(
        `/admin/user/${userId}/ban`,
        {
          method: "PUT",
          body: JSON.stringify({ banned })
        }
      );

      if (!response.ok) {
        const result = await response.json();
        showToast(result.message || "Action failed", "error");
        return;
      }

      showToast(
        banned
          ? "User banned successfully"
          : "User unbanned successfully",
        "success"
      );

      loadUsers();

    } catch (error) {
      console.error("Ban error:", error);
      showToast("Server error", "error");
    }
  };


  /* ================= INITIAL LOAD ================= */
  loadUsers();

});