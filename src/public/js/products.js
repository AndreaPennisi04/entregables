const createCart = async () => {
  const response = await fetch(`/api/v1/cart`, { method: "POST" });
  const data = await response.json();
  if (!data || data.status === "error" || !data.payload || !data.payload._id) {
    throw new Error(`something went wrong ${data.payload || ""}`);
  }
  cartId = data.payload._id;
  return cartId;
};

const addToCart = async (productId) => {
  try {
    let resCart = await fetch(`/api/v1/cart`, { method: "GET" });

    let dataCart = await resCart.json();
    if (!dataCart || dataCart.status === "error") {
      throw new Error(`something went wrong ${dataCart.payload || ""}`);
    }
    let [cart] = dataCart.payload;
    let cartId;

    if (!cart) {
      cartId = await createCart();
    } else {
      cartId = cart._id;
    }

    const response = await fetch(`/api/v1/cart/${cartId}/product/${productId}`, { method: "POST" });
    const data = await response.json();
    if (!data || data.status === "error" || !data.payload) {
      throw new Error(`something went wrong ${data.payload || ""}`);
    }

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `Your product has been added`,
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    Swal.fire({
      position: "top-end",
      icon: "error",
      title: `Something went wrong `,
      showConfirmButton: false,
      error: error,
      timer: 1500,
    });
  }
};
