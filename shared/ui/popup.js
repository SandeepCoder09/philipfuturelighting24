/* ==========================================
   PHILIPS THEMED POPUP
========================================== */

function showPhilipsPopup(title, message, type = "info") {

    // Remove existing popup if already open
    const existing = document.querySelector(".philips-popup-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "philips-popup-overlay active";

    const popup = document.createElement("div");
    popup.className = `philips-popup ${type}`;

    const heading = document.createElement("h3");
    heading.textContent = title;

    const description = document.createElement("p");
    description.textContent = message;

    const button = document.createElement("button");
    button.textContent = "OK";

    popup.appendChild(heading);
    popup.appendChild(description);
    popup.appendChild(button);
    overlay.appendChild(popup);

    document.body.appendChild(overlay);

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
