const socket = io();
let user = "";

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

const showChatLoginForm = async () => {
  const result = await Swal.fire({
    title: "Hello!",
    imageUrl:
      "https://media.istockphoto.com/id/1130049427/photo/low-key-photo-of-suv-kia-sportage-2-0-crdi-awd-or-4x4-a-dark-picture-so-that-you-can-only-see.jpg?s=612x612&w=0&k=20&c=hpPpvAKKJMFLB5pAsf3a9YHqOAwUCPTHvUQflHeZmf4=",
    imageWidth: 300,
    imageHeight: 200,
    imageAlt: "Kia image",
    text: "Please enter your username",
    input: "text",
    inputAttributes: {
      autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Confirm",
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  const { value, isConfirmed } = result;

  if (isConfirmed) {
    user = value;
    socket.emit("authenticated", value);
  }
};

// SOCKET LISTENERS
socket.on("messageLogs", (data) => {
  let log = document.getElementById("messages-log");
  let messages = "";
  data.forEach((message) => {
    messages += `${message.user} says: ${message.content}</br>`;
  });
  log.innerHTML = messages;
});

socket.on("newUserConnected", (data) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    title: `${data} is connected`,
    icon: "success",
  });
});

// Message text enter listener
const messageText = document.getElementById("message-text");
messageText.addEventListener("keypress", (evt) => {
  if (evt.key === "Enter") {
    if (messageText.value.trim().length > 0) {
      socket.emit("message", { user, content: messageText.value });
      messageText.value = "";
    }
  }
});

showChatLoginForm();
