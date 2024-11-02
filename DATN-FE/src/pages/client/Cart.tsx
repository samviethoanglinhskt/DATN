import React from "react";
import { useCart } from "./Cartshop";

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  if (cartItems.length === 0) {
    return <div>Giỏ hàng của bạn đang trống.</div>;
  }

  return (
    <div>
      <h1>Giỏ hàng</h1>
      <ul>
        {cartItems.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price} x {item.quantity}
            <button onClick={() => removeFromCart(item.id)}>Xóa</button>
          </li>
        ))}
      </ul>
      <button onClick={clearCart}>Xóa toàn bộ giỏ hàng</button>
    </div>
  );
};

export default Cart;
