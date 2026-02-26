window.addEventListener("load", function() {
    const loader = document.getElementById("pageLoader");
    loader.style.opacity = "0";
    loader.style.transition = "0.5s ease";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  });