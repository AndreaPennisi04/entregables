async function handleOnSubmit() {
  const messageLabel = document.getElementById("message");
  messageLabel.innerText = "";
  try {
    const token = document.getElementById("token");
    const password = document.getElementById("password");

    const data = {
      token: token.value,
      password: password.value,
    };

    const result = await fetch("/session/password-reset/complete", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (result.status === 204) {
      window.location.replace("/views/cart");
    } else {
      const { message } = await result.json();
      messageLabel.innerText = message;
    }
  } catch (error) {
    messageLabel.innerText = JSON.stringify(error);
  }
}
