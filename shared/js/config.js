const API = (() => {
  const host = window.location.hostname;

  // Local network (IP based)
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.startsWith("10.") ||
    host.startsWith("192.168.")
  ) {
    return "http://10.177.177.223:5001/api";  // your backend IP
  }

  // Production (Vercel / Render)
  return "https://philips-backend.onrender.com/api";
})();