/* ===============================
   PAGE LOADER
================================ */
window.addEventListener("load", function () {
  const loader = document.getElementById("pageLoader");
  if (!loader) return;

  loader.style.opacity = "0";
  loader.style.transition = "0.5s ease";

  setTimeout(() => {
    loader.style.display = "none";
  }, 500);
});


/* ===============================
   LIVE TRANSACTION TICKER (API)
================================ */

document.addEventListener("DOMContentLoaded", async function () {

  const tickerTrack = document.getElementById("tickerTrack");
  if (!tickerTrack) return;

  let data = null;

  /* ===== API FALLBACK LIST ===== */
  const API_URLS = [
    "http://localhost:5001/api/live",               // local first
    "https://philips-backend.onrender.com/api/live" // production fallback
  ];

  /* ===== TRY BOTH APIS ===== */
  for (const url of API_URLS) {
    try {
      const res = await fetch(url);
      const result = await res.json();

      if (result.success && result.data) {
        data = result.data;
        console.log("Using API:", url);
        break;
      }
    } catch (err) {
      console.warn("Failed API:", url);
    }
  }

  if (!data) {
    console.error("All APIs failed");
    return;
  }

  /* ===== DUPLICATE FOR SMOOTH LOOP ===== */
  const allItems = [...data, ...data];

  /* ===== RENDER ITEMS ===== */
  allItems.forEach(txn => {
    const div = document.createElement("div");
    div.className = "ticker-item";

    div.innerHTML = `
      ${txn.name}
      <span class="${txn.type === "Withdraw" ? "withdraw" : "recharge"}">
        ${txn.type}
      </span>
      ₹${txn.amount}
      <span class="success">${txn.status}</span>
    `;

    tickerTrack.appendChild(div);
  });

  /* ===== SMOOTH INFINITE SCROLL ===== */
  let pos = 0;
  const speed = 0.4;

  function animateTicker() {
    pos += speed;

    if (pos >= tickerTrack.scrollHeight / 2) {
      pos = 0;
    }

    tickerTrack.style.transform = `translateY(-${pos}px)`;
    requestAnimationFrame(animateTicker);
  }

  animateTicker();

});