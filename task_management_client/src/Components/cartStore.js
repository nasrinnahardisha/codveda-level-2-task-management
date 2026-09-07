const CART_KEY = "bazar_cart";

// ১. কার্ট ডেটা গেট করা
export function getCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    return [];
  }
}

// ২. কার্টে প্রোডাক্ট অ্যাড করা
export function addToCart(product, quantity = 1) {
  const cart = getCart();
  const existing = cart.find((item) => item.product_id === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      product_id: product.id,
      product_name: product.name,
      price: product.discounted_price || product.price,
      image_url: product.image_url,
      unit: product.unit,
      quantity,
    });
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

// ৩. টোটাল আইটেম কাউন্ট করা
export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

// ৪. কার্টের প্রোডাক্টের পরিমাণ (Quantity) আপডেট করা (CheckOut-এর জন্য দরকারি)
export function updateCartQuantity(productId, newQuantity) {
  let cart = getCart();

  if (newQuantity <= 0) {
    // পরিমাণ ০ বা তার কম হলে কার্ট থেকে রিমুভ করে দেবে
    cart = cart.filter((item) => item.product_id !== productId);
  } else {
    // অন্যথায় পরিমাণ আপডেট করবে
    const item = cart.find((item) => item.product_id === productId);
    if (item) item.quantity = newQuantity;
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
}

// ৫. কার্ট থেকে সুনির্দিষ্ট একটি প্রোডাক্ট ডিলিট করা (CheckOut-এর জন্য দরকারি)
export function removeFromCart(productId) {
  const cart = getCart();
  const filteredCart = cart.filter((item) => item.product_id !== productId);

  localStorage.setItem(CART_KEY, JSON.stringify(filteredCart));
  window.dispatchEvent(new Event("cart-updated"));
}

// ৬. সম্পূর্ণ কার্ট ক্লিয়ার করা (অর্ডার সফল হওয়ার পর ডিলিট করার জন্য দরকারি)
export function clearCart() {
  localStorage.removeItem(CART_KEY);
  window.dispatchEvent(new Event("cart-updated"));
}
