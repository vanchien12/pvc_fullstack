import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useCart } from "../context/CartContext";
import "./ProductList.css";

const ProductList = () => {
  // React State: danh sách sản phẩm, ban đầu rỗng
  const [products, setProducts] = useState([]);

  // React State: trạng thái loading (trải nghiệm thật khi gọi API)
  const [loading, setLoading] = useState(true);

  // React Hook useContext (qua custom hook useCart): lấy hàm addToCart
  // dùng chung toàn app, không cần truyền props qua nhiều cấp
  const { addToCart } = useCart();

  // React Hook useEffect: chạy 1 lần khi component được mount ([] = dependency rỗng)
  // Mô phỏng việc gọi API lấy danh sách sản phẩm (ở đây dùng mock data products.json)
  useEffect(() => {
    // import động file JSON - giống cách gọi API trả về data
    import("../data/products.json").then((data) => {
      // Giả lập độ trễ mạng 500ms để thấy rõ trạng thái loading
      setTimeout(() => {
        setProducts(data.default);
        setLoading(false);
      }, 500);
    });
  }, []); // mảng dependency rỗng -> chỉ chạy 1 lần sau khi render lần đầu

  // Hiển thị trạng thái loading
  if (loading) {
    return <p className="product-list__loading">Đang tải sản phẩm...</p>;
  }

  return (
    <section className="product-list">
      <h2 className="product-list__title">Sản phẩm nổi bật</h2>

      <div className="product-list__grid">
        {/* Array Mapping: lặp qua mảng products, mỗi item render 1 ProductCard */}
        {products.map((product) => (
          <ProductCard
            key={product.id} // key bắt buộc khi render danh sách trong React
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
