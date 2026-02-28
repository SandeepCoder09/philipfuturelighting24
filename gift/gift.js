

const redeemBtn = document.getElementById("redeemBtn");
const giftInput = document.getElementById("giftCodeInput");

const popup = document.getElementById("customPopup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupIcon = document.getElementById("popupIcon");
const popupOkBtn = document.getElementById("popupOkBtn");

/* =============================
   AUTO UPPERCASE
============================= */
giftInput.addEventListener("input", function () {
  this.value = this.value.toUpperCase();
});

/* =============================
   POPUP
============================= */
function showPopup(type, title, message) {

  popupTitle.innerText = title;
  popupMessage.innerText = message;

  popupIcon.className = "fa-solid";

  const colors = {
    success: "#22c55e",
    error: "#ef4444",
    warning: "#facc15",
    info: "#3b82f6"
  };

  const icons = {
    success: "fa-circle-check",
    error: "fa-circle-xmark",
    warning: "fa-triangle-exclamation",
    info: "fa-circle-info"
  };

  popupIcon.classList.add(icons[type] || icons.info);
  popupIcon.style.color = colors[type] || colors.info;

  popup.style.display = "flex";
}


popupOkBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

/* =============================
   VERIFY SESSION (FIXED)
============================= */
async function verifyUserSession() {

  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const res = await authFetch("/users/profile");

    if (res.status === 401) {
      return false;
    }

    return res.ok;

  } catch {
    return false;
  }
}

/* =============================
   UPDATE WALLET UI
============================= */
function updateWalletUI(newBalance) {
  const walletElement = document.getElementById
  ("walletBalance");
  if (walletElement) {
    walletElement.innerText = "₹" + newBalance;
  }


}


/* =============================
   REDEEM GIFT (FIXED)
============================= */
redeemBtn.addEventListener("click", async () => {

  const code = giftInput.value.trim();

  if (!code) {
    showPopup("warning", "Missing Code", "Please enter gift code.");
    return;
  }


  const isLoggedIn = await verifyUserSession();

  if (!isLoggedIn) {
    showPopup("error", "Session Expired", "Please login again.");
    setTimeout(() => {
      window.location.href = "../auth/index.html";
    }, 1200);
    return;
  }

  redeemBtn.disabled = true;
  redeemBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;

  try {

    const res = await authFetch("/gift/claim", {
      method: "POST",
      body: JSON.stringify({ code })
    });

    const data = await res.json();

    if (res.ok) {

      showPopup("success", "Congratulations 🎉", data.message);


      if (data.wallet !== undefined) {
        updateWalletUI(data.wallet);
      }

      giftInput.value = "";

    } else {

      showPopup("error", "Failed", data.message || "Invalid gift code");

    }

  } catch {

    showPopup("error", "Server Error", "Please try again later.");

  }

  redeemBtn.disabled = false;
  redeemBtn.innerHTML = `<i class="fa-solid fa-check"></i> Claim Reward`;

});