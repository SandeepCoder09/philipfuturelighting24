async function loadProfile() {
    const token = localStorage.getItem("token");
  
    if (!token) {
      window.location.href = "../auth/index.html";
      return;
    }
  
    try {
      const res = await fetch(
        "https://philips-backend.onrender.com/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
  
      const data = await res.json();
  
      if (data.user) {
  
        // Show mobile
        document.getElementById("mobile").innerText =
          data.user.mobile;
  
        // Use MongoDB _id as UID
        const uid = data.user._id;
  
        document.getElementById("uid").innerText = uid;
  
        // Optional: Show short username
        document.getElementById("username").innerText =
          "User" + uid.slice(-5);
  
      } else {
        alert("Session expired. Login again.");
        logout();
      }
  
    } catch (error) {
      alert("Server error");
    }
  }
  
  function logout() {
    localStorage.removeItem("token");
    window.location.href = "../auth/index.html";
  }
  
  loadProfile();