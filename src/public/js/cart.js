const loadCart = async () => {
  let cartId = sessionStorage.getItem("cartId");

  if (!cartId) {
    throw new Error("No cart found");
  }

  const response = await fetch(`/api/v1/cart/${cartId}`, { method: "GET" });
  const data = await response.json();
  if (!data || data.status === "error" || !data.payload || !data.payload._id) {
    throw new Error(`something went wrong ${data.payload || ""}`);
  }

  const productList = document.getElementById("productList");
  productList.innerHTML = "";
  for (const item of data.payload.products) {
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

loadCart();
