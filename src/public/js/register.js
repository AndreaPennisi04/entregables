const socket = io();

socket.on("registerForm", (e) => {
  const form = document.getElementById("register");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    dataforEach((value, key) => (obj[key] = value));
    console.log("Objeto formado");
    console.log(obj);
    fetch("/api/sessions/register", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-type": "application/json",
      },
    }).then(((result) => result.json()).then((json) => console.log(json)));
  });
});
