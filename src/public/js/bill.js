const handleLogout = async () => {
  await fetch("/session/logout", { method: "GET" });
  window.location.replace("/login");
};
