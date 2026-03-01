/* ===============================
   MY PRODUCTS PAGE (FINAL)
=============================== */

document.addEventListener("DOMContentLoaded", loadProducts);

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

      const diffTime = endDate - now;
      const daysRemaining = Math.max(
        Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
        0
      );

      const purchasedDate = new Date(product.purchaseDate)
        .toLocaleDateString("en-IN");

      // ✅ Since same origin, just use /uploads
      const imageSrc = product.image
        ? `/uploads/${product.image}`
        : `/uploads/default-product.png`;

      const card = `
  <div class="card">

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
          : `Days Remaining: ${daysRemaining}`
        }
        </p>
      </div>

      <div class="card-action">
        <span class="status-badge ${isExpired ? "status-expired" : "status-active"}">
          ${isExpired ? "Expired" : "Active"}
        </span>
      </div>

    </div>
  </div>
`;

      container.insertAdjacentHTML("beforeend", card);
    });

  } catch (error) {
    console.error("Product Load Error:", error);
    loading.style.display = "none";
    container.innerHTML =
      "<p>Something went wrong. Please try again later.</p>";
  }
}

