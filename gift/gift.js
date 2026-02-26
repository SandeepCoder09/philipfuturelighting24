const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname.startsWith("10.");

const API = isLocal
  ? "http://localhost:5001/api"
  : "https://philips-backend.onrender.com/api";

const token = localStorage.getItem("token");

const redeemBtn = document.getElementById("redeemBtn");
const giftInput = document.getElementById("giftCodeInput");

const popup = document.getElementById("customPopup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupIcon = document.getElementById("popupIcon");
const popupOkBtn = document.getElementById("popupOkBtn");

// =============================
// AUTO UPPERCASE INPUT
// =============================
giftInput.addEventListener("input", function () {
  this.value = this.value.toUpperCase();
});

// =============================
// SHOW POPUP
// =============================
function showPopup(type, title, message) {

  popupTitle.innerText = title;
  popupMessage.innerText = message;

  popupIcon.className = "fa-solid";

  if (type === "success") {
    popupIcon.classList.add("fa-circle-check");
    popupIcon.style.color = "#22c55e";
  } else if (type === "error") {
    popupIcon.classList.add("fa-circle-xmark");
    popupIcon.style.color = "#ef4444";
  } else if (type === "warning") {
    popupIcon.classList.add("fa-triangle-exclamation");
    popupIcon.style.color = "#facc15";
  } else {
    popupIcon.classList.add("fa-circle-info");
    popupIcon.style.color = "#3b82f6";
  }

  popup.style.display = "flex";
}

// Close popup
popupOkBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

// =============================
// VERIFY USER SESSION
// =============================
async function verifyUserSession() {

  if (!token) return false;

  try {
    const res = await fetch(`${API}/users/profile`, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      return false;
    }

    return true;

  } catch (error) {
    return false;
  }
}

// =============================
// UPDATE WALLET UI + STORAGE
// =============================
function updateWalletUI(newBalance) {

  // Update wallet element if exists
  const walletElement = document.getElementById("walletBalance");
  if (walletElement) {
    walletElement.innerText = "₹" + newBalance;
  }

  // Update localStorage user object
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    parsedUser.wallet = newBalance;
    localStorage.setItem("user", JSON.stringify(parsedUser));
  }
}

// =============================
// REDEEM GIFT
// =============================
redeemBtn.addEventListener("click", async () => {

  const code = giftInput.value.trim();

  if (!code) {
    showPopup("warning", "Missing Code", "Please enter gift code.");
    return;
  }

  // 🔐 Check login & session
  const isLoggedIn = await verifyUserSession();

  if (!isLoggedIn) {
    showPopup("error", "Session Expired", "Please login again.");
    setTimeout(() => {
      window.location.href = "../auth/index.html";
    }, 1500);
    return;
  }

  redeemBtn.disabled = true;
  redeemBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;

  try {

    const res = await fetch(`${API}/gift/claim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ code })
    });

    const data = await res.json();

    if (res.ok) {

      showPopup("success", "Congratulations 🎉", data.message);

      // 🔥 Update wallet instantly
      if (data.wallet !== undefined) {
        updateWalletUI(data.wallet);
      }

      giftInput.value = "";

    } else {

      showPopup("error", "Failed", data.message);

    }

  } catch (error) {

    showPopup("error", "Server Error", "Please try again later.");

  }

  redeemBtn.disabled = false;
  redeemBtn.innerHTML = `<i class="fa-solid fa-check"></i> Claim Reward`;

});