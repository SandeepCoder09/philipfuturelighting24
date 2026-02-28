/* ==========================================
   PHILIPS THEMED POPUP
========================================== */

function showPhilipsPopup(title, message, type = "info") {

    // Remove existing popup if already open
    const existing = document.querySelector(".philips-popup-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "philips-popup-overlay active";

    overlay.innerHTML = `
      <div class="philips-popup ${type}">
        <h3>${title}</h3>
        <p>${message}</p>
        <button>OK</button>
      </div>
    `;

    document.body.appendChild(overlay);

    const popup = overlay.querySelector(".philips-popup");
    const button = overlay.querySelector("button");

    // Close on button click
    button.addEventListener("click", () => {
        overlay.remove();
    });

    // Close on outside click
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}