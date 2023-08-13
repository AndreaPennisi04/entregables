const loadCart = async () => {
  let resCart = await fetch(`/api/v1/cart`, { method: "GET" });

  let dataCart = await resCart.json();
  if (!dataCart || dataCart.status === "error") {
    throw new Error(`something went wrong ${dataCart.payload || ""}`);
  }
  let [cart] = dataCart.payload;

  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  for (const item of cart.products) {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${item.product.title}</td>
          <td class="truncate">${item.product.description}</td>
          <td>$${item.product.price}</td>
          <td><img class="thumbnail-img" src="${item.product.thumbnail}" alt="Thumbnail"></td>
          <td>${item.product.code}</td>
          <td>${item.quantity}</td>
        `;
    productList.appendChild(row);
  }
};

const sayHi = async () => {
  const session = await fetch("/session", { method: "GET" });
  console.log(session);
  const user = await session.json();

  Swal.fire({
    title: `Greetings`,
    text: `This is your cart ${user.firstName || ""} ${user.lastName || ""}
    We saved it for you so you could use it later`,
    width: 600,
    padding: "3em",
    color: "#716add",
  });
};

const handleLogout = async () => {
  await fetch("/session/logout", { method: "GET" });
  window.location.replace("/login");
};

sayHi();
loadCart();
