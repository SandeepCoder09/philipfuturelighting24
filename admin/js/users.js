const token = localStorage.getItem("adminToken");

if (!token) {
  window.location.href = "/admin/login.html";
}

let allUsers = [];

async function loadUsers() {
  try {
    const response = await fetch(`${API}/admin/users`, {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login.html";
      return;
    }

    allUsers = await response.json();
    renderUsers(allUsers);

  } catch (error) {
    console.error("Error loading users:", error);
  }
}

function renderUsers(users) {

  const table = document.getElementById("userTable");
  table.innerHTML = "";

  users.forEach(user => {

    const created = new Date(user.createdAt).toLocaleDateString();

    table.innerHTML += `
      <tr>
        <td>${user._id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.mobile}</td>
        <td>₹${user.walletBalance || 0}</td>
        <td>${created}</td>
      </tr>
    `;
  });
}

function searchUsers() {

  const keyword = document.getElementById("searchInput").value.toLowerCase();

  const filtered = allUsers.filter(user =>
    user.mobile?.toLowerCase().includes(keyword) ||
    user.email?.toLowerCase().includes(keyword) ||
    user._id?.toLowerCase().includes(keyword)
  );

  renderUsers(filtered);
}

loadUsers();
