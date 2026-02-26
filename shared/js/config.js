(function () {
    const host = window.location.hostname;
  
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.startsWith("10.") ||
      host.startsWith("192.168.") ||
      host.endsWith(".local");
  
    window.API = isLocal
      ? "http://localhost:5001/api"
      : "https://philips-backend.onrender.com/api";
  
    console.log("Using API:", window.API);
  })();