/* ===============================
MY PRODUCTS PAGE (COLLECT + TIMER)
WITH CUSTOM TOAST
=============================== */

document.addEventListener("DOMContentLoaded", loadProducts);
const BACKEND_BASE = API_BASE.replace("/api", "");

/* ===============================
TOAST NOTIFICATION
=============================== */

function showToast(message, duration = 2500) {

  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

/* ===============================
LOAD PRODUCTS
=============================== */

async function loadProducts() {

  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../auth/index.html";
    return;
  }

  const container = document.getElementById("productsContainer");
  const loading = document.getElementById("loading");
  const emptyState = document.getElementById("emptyState");

  if (!container || !loading) return;

  loading.style.display = "block";
  container.innerHTML = "";
  if (emptyState) emptyState.style.display = "none";

  try {

    const response = await authFetch("/products/my");

    const data = await response.json();

    loading.style.display = "none";


    if (!response.ok || !data.success) {
      container.innerHTML = `< p > ${data.message || "Failed to load products."}</p > `;
      return;
    }

    if (!data.products || data.products.length === 0) {
      if (emptyState) emptyState.style.display = "block";
      return;
    }



    data.products.forEach(product => {

      const now = new Date();
      const purchaseDate = new Date(product.purchaseDate);
      const endDate = new Date(product.endDate);

      const isExpired = now > endDate;

      /* ===== Remaining Days ===== */

      const totalDays = Math.ceil(
        (endDate - purchaseDate) / (1000 * 60 * 60 * 24)
      );

      const remainingDays = Math.max(
        0,
        Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
      );

      /* ===== 24H Collect Logic ===== */

      const lastEarning = product.lastEarningDate
        ? new Date(product.lastEarningDate)
        : purchaseDate;

      const nextCollectAt = new Date(
        lastEarning.getTime() + 24 * 60 * 60 * 1000
      );

      const canCollect = now >= nextCollectAt && !isExpired;


      const imageSrc = product.image
        ? `${BACKEND_BASE}/uploads/${product.image} `
        : `${BACKEND_BASE} /uploads/default - product.png`;

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
      <div class="card-image" >
      <img src="${imageSrc}" alt="${product.name}" loading="lazy">
    </div>

    <div class="card-content">

      <div class="card-text">
        <h2>${product.name}</h2>

        <p class="price">Price: ₹${product.price}</p>

        <p class="product-row">
          Remaining:
          <span class="highlight">
            ${remainingDays}/${totalDays} Days
          </span>
        </p>

        <p class="product-row">
          Today Earn:
          <span class="highlight">
            ₹${canCollect ? product.dailyEarning : 0}
          </span>
        </p>

        <p class="product-row total-earned">
          Total Earned:
          <span class="highlight">
            ₹${product.totalEarned}
          </span>
        </p>
      </div>
      <div class="collect-section" id="collect-${product._id}">
        ${isExpired
          ? `<span class="status-badge status-expired">Expired</span>`
          : canCollect
            ? `<button class="collect-btn" data-id="${product._id}">
                    Collect
                 </button>`
            : `<div class="countdown"
                    data-id="${product._id}"
                    data-time="${nextCollectAt.toISOString()}">
                    Loading...
                 </div>`
        }
      </div>
    </div>
    `;

      container.appendChild(card);

    });

    startCountdowns();


  } catch (error) {

    console.error("Product Load Error:", error);
    loading.style.display = "none";
    container.innerHTML =
      "<p>Something went wrong. Please try again later.</p>";

  }
}


/* ===============================
COUNTDOWN TIMER
=============================== */

function startCountdowns() {

  const countdowns = document.querySelectorAll(".countdown");

  countdowns.forEach(el => {

    const targetTime = new Date(el.dataset.time);
    const productId = el.dataset.id;

    const interval = setInterval(() => {

      const now = new Date();
      const diff = targetTime - now;

      if (diff <= 0) {

        clearInterval(interval);

        const parent = document.getElementById(`collect - ${productId} `);
        if (!parent) return;

        parent.innerHTML = `
      < button class="collect-btn" data - id="${productId}" >
        Collect
      </button >
      `;


        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      el.innerText = `${hours}h ${minutes}m ${seconds} s`;

    }, 1000);

  });

}


/* ===============================
COLLECT BUTTON
=============================== */

document.addEventListener("click", async function (e) {

  if (!e.target.classList.contains("collect-btn")) return;

  const button = e.target;
  const id = button.dataset.id;

  button.disabled = true;
  button.innerText = "Collecting...";

  try {

    const res = await authFetch(`/ products / collect / ${id} `, {
      method: "POST"
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || "Failed to collect");
      button.disabled = false;
      button.innerText = "Collect";
      return;
    }

    showToast(`₹${data.amount} credited successfully!`);

    loadProducts();

  } catch (err) {

    showToast("Network error");

    button.disabled = false;
    button.innerText = "Collect";

  }

});

