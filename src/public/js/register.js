async function handleSubmit() {
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");

  const data = {
    email: username.value,
    password: password.value,
    firstName: firstName.value,
    lastName: lastName.value,
  };

  const result = await fetch("/session/register", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-type": "application/json",
    },
  });

  if (result.status === 204) {
    window.location.replace(" /views/cart");
  }
}
