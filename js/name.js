const firstName = localStorage.getItem("firstName");
if (firstName) {
  document.getElementById("welcome-msg").textContent = `Welcome, ${firstName}`;
}