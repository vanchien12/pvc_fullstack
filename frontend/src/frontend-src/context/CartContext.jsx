import { createContext, useContext, useState } from "react";

// React Hook: createContext - tạo một "kênh" chia sẻ state toàn cục
const CartContext = createContext();

// Custom hook để các component khác dùng context dễ dàng hơn
// (thay vì phải import useContext + CartContext ở mọi nơi)
export const useCart = () => useContext(CartContext);

// Provider component - bọc quanh App, cung cấp state + hàm cho mọi con cháu
export const CartProvider = ({ children }) => {
  // React State: mảng các sản phẩm đã thêm vào giỏ
  const [cartItems, setCartItems] = useState([]);

  // Arrow function: thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Nếu đã có, tăng số lượng (quantity)
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Nếu chưa có, thêm mới với quantity = 1
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Tổng số lượng sản phẩm trong giỏ (dùng cho badge ở Header)
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Giá trị được chia sẻ qua context
  const value = { cartItems, addToCart, cartCount };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
