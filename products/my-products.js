/* ===============================
   MY PRODUCTS PAGE (FIXED)
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
      container.innerHTML = "<p>No products purchased yet.</p>";
      return;
    }

    const productImages = {
      "0.5W LED Bulb": "../assets/bulb0.5watts.jpg",
      "5W Smart Bulb": "../assets/bulb5watts.jpg",
      "10W LED Bulb": "../assets/bulb10watts.webp",
      "Decorative Light": "../assets/philips-health.jpg"
    };

    data.products.forEach(product => {

      const imageSrc =
        productImages[product.name] ||
        "../assets/bulb0.5watts.jpg";

      const purchasedDate = new Date(product.createdAt)
        .toLocaleString("en-IN");

      const card = `
        <div class="product-card">

          <div class="product-image">
            <img src="${imageSrc}" alt="${product.name}">
          </div>

          <div class="product-info">
            <div class="product-title">${product.name}</div>
            <div class="product-row">
              Price: ₹${product.price}
            </div>

            <div class="product-row">
              Earned: ₹${product.totalEarned}
            </div>

            <div class="product-row">
              Purchased: ${purchasedDate}
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

