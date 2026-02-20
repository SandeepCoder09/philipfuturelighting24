document.addEventListener("DOMContentLoaded", function () {

    const loadingScreen = document.getElementById("loadingScreen");
    const successPopup = document.getElementById("successPopup");
    const buyButtons = document.querySelectorAll(".subscribe-btn");
  
    function startProcess() {
      loadingScreen.classList.add("active");
  
      setTimeout(() => {
        loadingScreen.classList.remove("active");
        successPopup.classList.add("active");
      }, 2500); // 2.5 sec loading
    }
  
    function closePopup() {
      successPopup.classList.remove("active");
    }
  
    buyButtons.forEach(button => {
      button.addEventListener("click", startProcess);
    });
  
    window.closePopup = closePopup;
  
  });