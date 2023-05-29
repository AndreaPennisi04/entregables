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
