function showPhilipsPopup(title, message, type = "info") {
    let overlay = document.createElement("div");
    overlay.className = "philips-popup-overlay active";
  
    overlay.innerHTML = `
      <div class="philips-popup">
        <h3>${title}</h3>
        <p>${message}</p>
        <button onclick="this.closest('.philips-popup-overlay').remove()">OK</button>
      </div>
    `;
  
    document.body.appendChild(overlay);
  }