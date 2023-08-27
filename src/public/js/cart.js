let currentCart;

const loadCart = async () => {
  let resCart = await fetch(`/api/v1/cart`, { method: "GET" });

  let dataCart = await resCart.json();
  if (!dataCart || dataCart.status === "error") {
    throw new Error(`something went wrong ${dataCart.payload || ""}`);
  }
  let [cart] = dataCart.payload;

  currentCart = cart;

  if (!currentCart) {
    return;
  }

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

const completePurchase = async () => {
  if (!currentCart || currentCart.products.lenght < 1) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: `You need to add items to cart first`,
      showConfirmButton: false,
      timer: 5000,
    });
    return;
  }

  const result = await fetch(`/api/v1/cart/${currentCart._id}/purchase`, { method: "POST" });
  const resultData = await result.json();
  const modalResult = await Swal.fire({
    title: `Purchase complete`,
    text: `Congratulations you copmleted your purchase 🎉 your order code is ${resultData.payload.code},
    click below to see your bill`,
    confirmButtonText: "Show bill",
    width: 600,
    padding: "3em",
    color: "#716add",
  });
  if (modalResult.isConfirmed) {
    window.location.replace(`/views/bill/${resultData.payload._id}`);
  }
};

const handleLogout = async () => {
  await fetch("/session/logout", { method: "GET" });
  window.location.replace("/login");
};

sayHi();
loadCart();
