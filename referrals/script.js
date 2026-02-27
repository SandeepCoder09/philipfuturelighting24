document.addEventListener("DOMContentLoaded", initReferralPage);

/* =====================================================
   INITIALIZE PAGE
===================================================== */
async function initReferralPage() {
  const token = localStorage.getItem("token");

  if (!token) {
    redirectToLogin();
    return;
  }

  try {
    const user = await fetchProfile(token);
    generateReferralLink(user.userId);
  } catch (error) {
    console.error("Referral Page Error:", error);
    redirectToLogin();
  }
}


/* =====================================================
   FETCH USER PROFILE
===================================================== */
async function fetchProfile(token) {
  const response = await fetch(`${API}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Profile fetch failed");
  }

  const data = await response.json();

  if (!data.user) {
    throw new Error("User not found");
  }

  return data.user;
}


/* =====================================================
   GENERATE REFERRAL LINK
===================================================== */
function generateReferralLink(userId) {
  const domain = window.location.origin;
  const referralLink = `${domain}/auth/register.html?invite=${userId}`;

  const input = document.getElementById("referralLink");
  const copyBtn = document.getElementById("copyBtn");

  if (input) {
    input.value = referralLink;
  }

  if (copyBtn) {
    copyBtn.onclick = async () => {
      try {
        await navigator.clipboard.writeText(referralLink);
        showToast("Referral link copied!");
      } catch (error) {
        showToast("Copy failed");
      }
    };
  }
}


/* =====================================================
   TOAST MESSAGE
===================================================== */
function showToast(message) {
  const toast = document.createElement("div");
  toast.innerText = message;

  toast.style.position = "fixed";
  toast.style.bottom = "100px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#00B4FF";
  toast.style.color = "#fff";
  toast.style.padding = "10px 18px";
  toast.style.borderRadius = "25px";
  toast.style.fontSize = "13px";
  toast.style.zIndex = "9999";
  toast.style.boxShadow = "0 6px 20px rgba(0,0,0,0.4)";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}


/* =====================================================
   REDIRECT TO LOGIN
===================================================== */
function redirectToLogin() {
  localStorage.removeItem("token");
  window.location.href = "../auth/index.html";
}