const socket = io();

socket.on("submit", (e) => {
  const login = document.getElementById("loginForm");
  e.preventDefault();
  const data = new FormData(login);
  const obj = {};
  dataforEach((value, key) => (obj[key] = value));
  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
      window.location.replace("/users");
    }
  });
});
