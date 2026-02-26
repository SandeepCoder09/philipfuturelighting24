
const token = localStorage.getItem("token");

/* ===== Redirect if not logged in ===== */
if (!token) {
  window.location.href = "../auth/index.html";
}

/* ===== Product Image Map ===== */
const productImages = {
  "0.5W LED Bulb": "../assets/bulb0.5watts.jpg",
  "5W Smart Bulb": "../assets/bulb5watts.jpg",
  "10W LED Bulb": "../assets/bulb10watts.webp",
  "Decorative Light": "../assets/philips-health.jpg"
};

/* ===== Back Button ===== */
function goBack() {
  window.history.back();
}

/* ===== Format Date & Time ===== */
function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

/* ===== Load Products ===== */
async function loadProducts() {

  const container = document.getElementById("productsContainer");
  const loading = document.getElementById("loading");

  if (!container || !loading) return;

  try {
    const response = await fetch(`${API}/products/my`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    loading.style.display = "none";
    container.innerHTML = "";

    if (!response.ok || !data.success) {
      container.innerHTML = `<p>${data.message || "Failed to load products."}</p>`;
      return;
    }

    if (!data.products || data.products.length === 0) {
      container.innerHTML = "<p>No products purchased yet.</p>";
      return;
    }

    data.products.forEach(product => {

      const imageSrc =
        productImages[product.name] ||
        "../assets/bulb0.5watts.jpg";

      const purchasedDate = formatDateTime(product.createdAt);

      const card = `
        <div class="product-card">

          <div class="product-image">
            <img src="${imageSrc}" alt="${product.name}">
          </div>

          <div class="product-info">

            <div class="product-title">
              ${product.name}
            </div>

            <div class="product-row">
              <i class="fa-solid fa-tag"></i>
              Price: <span class="highlight">₹${product.price}</span>
            </div>

            <div class="product-row">
              <i class="fa-solid fa-wallet"></i>
              Earned: <span class="highlight">₹${product.totalEarned}</span>
            </div>

            <div class="product-row">
              <i class="fa-solid fa-calendar"></i>
              Purchased: <span class="highlight">${purchasedDate}</span>
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

/* ===== Initialize ===== */
loadProducts();