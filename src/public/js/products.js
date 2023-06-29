const createCart = async () => {
  const response = await fetch(`/api/v1/cart`, { method: "POST" });
  const data = await response.json();
  if (!data || data.status === "error" || !data.payload || !data.payload._id) {
    throw new Error(`something went wrong ${data.payload || ""}`);
  }
  cartId = data.payload._id;
  console.log(`created a new cart id ${cartId}`);
  sessionStorage.setItem("cartId", cartId);
  return cartId;
};

const addToCart = async (productId) => {
  try {
    let cartId = sessionStorage.getItem("cartId");
    if (!cartId) {
      cartId = await createCart();
    }

    const response = await fetch(`/api/v1/cart/${cartId}/product/${productId}`, { method: "POST" });
    const data = await response.json();
    if (!data || data.status === "error" || !data.payload) {
      throw new Error(`something went wrong ${data.payload || ""}`);
    }
    console.log(data.payload);
  } catch (error) {
    console.error(error);
  }
};
