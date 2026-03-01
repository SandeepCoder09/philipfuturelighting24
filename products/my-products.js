/* ===============================
   MY PRODUCTS PAGE (COLLECT + TIMER)
=============================== */

document.addEventListener("DOMContentLoaded", loadProducts);

// Backend base (important for Vercel + localhost)
const BACKEND_BASE = API_BASE.replace("/api", "");

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

  try {

    const response = await authFetch("/products/my");

    const data = await response.json();

    loading.style.display = "none";
    container.innerHTML = "";

    if (!response.ok || !data.success) {
      container.innerHTML = `<p>${data.message || "Failed to load products."}</p>`;
      return;
    }

    if (!data.products || data.products.length === 0) {
      if (emptyState) emptyState.style.display = "block";
      return;
    }



    data.products.forEach(product => {

      const now = new Date();
      const endDate = new Date(product.endDate);

      const isExpired = now > endDate;



      const purchasedDate = new Date(product.purchaseDate)
        .toLocaleDateString("en-IN");

      // 🔥 Calculate 24h collect logic
      const last = product.lastEarningDate
        ? new Date(product.lastEarningDate)
        : new Date(product.purchaseDate);

      const nextCollectAt = new Date(last.getTime() + 24 * 60 * 60 * 1000);
      const canCollect = now >= nextCollectAt && !isExpired;

      // Image URL
      const imageSrc = product.image
        ? `${BACKEND_BASE}/uploads/${product.image}`
        : `${BACKEND_BASE}/uploads/default-product.png`;

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="card-image">
          <img src="${imageSrc}" alt="${product.name}" loading="lazy">
        </div>

        <div class="card-content">

          <div class="card-text">
            <h2>${product.name}</h2>

            <p class="price">Price: ₹${product.price}</p>
            <p class="daily-earning">Daily Income: ₹${product.dailyEarning}</p>

            <p class="product-row">
              Earned: <span class="highlight">₹${product.totalEarned}</span>
            </p>

            <p class="product-row">
              Purchased: ${purchasedDate}
            </p>

            <p class="product-row">
              ${isExpired
          ? `Expired on: ${endDate.toLocaleDateString("en-IN")}`
          : `Valid Till: ${endDate.toLocaleDateString("en-IN")}`
        }
            </p>
          </div>

          <div class="collect-section">

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
    setupCollectButtons();

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

    const interval = setInterval(() => {

      const now = new Date();
      const diff = targetTime - now;

      if (diff <= 0) {
        clearInterval(interval);

        el.innerHTML = `
          <button class="collect-btn" data-id="${el.dataset.id}">
            Collect
          </button>
        `;

        setupCollectButtons();
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      el.innerText = `${hours}h ${minutes}m ${seconds}s`;

    }, 1000);
  });
}


/* ===============================
   COLLECT BUTTON
=============================== */

function setupCollectButtons() {

  document.querySelectorAll(".collect-btn").forEach(button => {

    button.addEventListener("click", async function () {

      const id = this.dataset.id;

      this.disabled = true;
      this.innerText = "Collecting...";

      try {

        const res = await authFetch(`/products/collect/${id}`, {
          method: "POST"
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Failed to collect");
          this.disabled = false;
          this.innerText = "Collect";
          return;
        }

        alert(`₹${data.amount} credited successfully!`);

        // 🔁 Reload to reset timer
        loadProducts();

      } catch (err) {
        alert("Network error");
        this.disabled = false;
        this.innerText = "Collect";
      }
    });
  });
}