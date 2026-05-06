
/* ===== LOGIN FUNC ===== */

async function login() {

  event.preventDefault();
  
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login failed");
      return;
    }

    // save user data
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("username", data.name);

    alert("Login successful 🎉");

    // redirect to home
    window.location.href = "index.html";

  } catch (err) {
    console.log(err);
    alert("Something went wrong");
  }
}