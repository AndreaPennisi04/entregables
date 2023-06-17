const socket = io();

socket.on("newProductMessage", (data) => {
  console.log(data);
});

const saveForm = async () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnailUrl").value;
  const code = document.getElementById("code").value;
  const stock = document.getElementById("stock").value;

  const data = { title, description, price, thumbnail, code, stock };

  const rawStr = JSON.stringify(data);

  await fetch("http://localhost:8080/api/product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: rawStr,
  });
};

let user;
const chatbox = document.getElementById("message-text");

Swal.fire({
  title: "Hello!",
  imageUrl:
    "https://media.istockphoto.com/id/1130049427/photo/low-key-photo-of-suv-kia-sportage-2-0-crdi-awd-or-4x4-a-dark-picture-so-that-you-can-only-see.jpg?s=612x612&w=0&k=20&c=hpPpvAKKJMFLB5pAsf3a9YHqOAwUCPTHvUQflHeZmf4=",
  imageWidth: 300,
  imageHeight: 200,
  imageAlt: "Custom image",
  text: "You are in Product Form. Please enter your username",
  input: "text",
  inputAttributes: {
    autocapitalize: "off",
  },
  showCancelButton: true,
  confirmButtonText: "confirm",
  showLoaderOnConfirm: true,
  preConfirm: (login) => {
    return fetch(`//api.github.com/users/${login}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .catch((error) => {
        Swal.showValidationMessage(`Request failed: ${error}`);
      });
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire({
      title: `${result.value.login}'s avatar`,
      imageUrl: result.value.avatar_url,
    });
    socket.emit("autenticated", user);
  }
});

messagetext.addEventListener("keyio", (evt) => {
  if (evt.key === "Enter") {
    if (messagetext.value.trim().length > 0) {
      socket.emit("message", { user, message: messagetext.value });
      messagetext.value = " ";
    }
  }
});

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let messages = " ";
  data.forEach((message) => {
    messages += `${message.user} says: ${message.message}</br>`;
  });
  log.innerHTML = messages;
});

socket.on("newUserConnected", (data) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmationButton: false,
    timer: 3000,
    title: `${data} is connected`,
    icon: "success",
  });
});
