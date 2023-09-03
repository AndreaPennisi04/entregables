async function handleSubmit() {
  try {
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    const data = {
      email: username.value,
      password: password.value,
    };

    const result = await fetch("/session/login", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (result.status === 204) {
      window.location.replace("/views/cart");
    } else {
      const messageLabel = document.getElementById("message");
      const { message } = await result.json();
      messageLabel.innerText = message;
    }
  } catch (error) {
    const messageLabel = document.getElementById("message");
    messageLabel.innerText = JSON.stringify(error);
  }
}

async function handleRegister() {
  window.location.replace("/register");
}

async function handleReset() {
  const result = await Swal.fire({
    title: "Password reset",
    imageUrl: "/images/password-reset.png",
    imageWidth: 300,
    imageAlt: "reset image",
    text: "Please enter your email",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    preConfirm: (username) => {
      if (!username) {
        Swal.showValidationMessage(`You need to provide an email`);
      }
    },
    showCancelButton: true,
    confirmButtonText: "Confirm",
    allowOutsideClick: true,
    allowEscapeKey: true,
  });

  const { value, isConfirmed } = result;

  if (isConfirmed) {
    const data = {
      email: value,
    };

    try {
      const result = await fetch("/session/password-reset/begin", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
        },
      });
      if (result.status === 204) {
        Swal.fire({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 6000,
          title: `If we have an account with that email you will receive a message shortly`,
          icon: "success",
        });
      } else {
        const messageLabel = document.getElementById("message");
        const { message } = await result.json();
        messageLabel.innerText = message;
      }
    } catch (error) {
      const messageLabel = document.getElementById("message");
      messageLabel.innerText = JSON.stringify(error);
    }
  }
}
