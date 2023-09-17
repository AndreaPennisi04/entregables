const handleLogout = async () => {
  await fetch("/session/logout", { method: "GET" });
  window.location.replace("/login");
};

const handleCheckout = async () => {
  const bid = document.getElementById("bid").value;
  const response = await fetch(`/api/v1/bill/${bid}/begin-checkout`, { method: "POST" });
  const redirection = await response.json();
  window.location = redirection.location;
};
