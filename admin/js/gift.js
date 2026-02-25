const token = localStorage.getItem("adminToken");
const giftTable = document.getElementById("giftTable");

// ================= CREATE GIFT =================
async function createGift() {

  const code = document.getElementById("giftCode").value.trim();
  const amountPerUser = document.getElementById("amountPerUser").value;
  const totalAmount = document.getElementById("totalAmount").value;

  if (!code || !amountPerUser || !totalAmount) {
    showToast("All fields are required", "error");
    return;
  }

  try {

    const res = await fetch(`${API}/gift/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        code,
        amountPerUser,
        totalAmount
      })
    });

    const data = await res.json();

    if (res.ok) {
      showToast("Gift created successfully", "success");
      loadGifts();
    } else {
      showToast(data.message, "error");
    }

  } catch (error) {
    showToast("Server error", "error");
  }
}

// ================= LOAD GIFTS =================
async function loadGifts() {

  try {

    const res = await fetch(`${API}/gift/all`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const gifts = await res.json();

    giftTable.innerHTML = "";

    gifts.forEach(gift => {

      const remainingTime = getRemainingTime(gift.expiresAt);
      const status = gift.active ? "Active" : "Inactive";
      const statusClass = gift.active ? "status-success" : "status-rejected";

      giftTable.innerHTML += `
        <tr>
          <td>${gift.code}</td>
          <td>₹${gift.amountPerUser}</td>
          <td>₹${gift.totalAmount}</td>
          <td>₹${gift.remainingAmount}</td>
          <td>${remainingTime}</td>
          <td class="${statusClass}">${status}</td>
        </tr>
      `;
    });

  } catch (error) {
    showToast("Failed to load gifts", "error");
  }
}

// ================= TIME LEFT =================
function getRemainingTime(expiry) {

  const now = new Date();
  const end = new Date(expiry);

  const diff = end - now;

  if (diff <= 0) return "Expired";

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return `${minutes}m ${seconds}s`;
}

loadGifts();
setInterval(loadGifts, 10000);