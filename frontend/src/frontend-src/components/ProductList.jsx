import useProducts from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import ProductCard from "./ProductCard";
import ProductFilter from "./ProductFilter";
import "./ProductList.css";

const ProductList = () => {
  // Custom hook: tách toàn bộ logic ra khỏi UI
  const {
    loading,
    error,
    filteredProducts,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    totalFound,
    totalAll,
  } = useProducts();

  // useContext: lấy addToCart từ CartContext
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="product-list__loading">
        <div className="product-list__spinner" />
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return <p className="product-list__error">⚠️ {error}</p>;
  }

  return (
    <section className="product-list" id="products">
      <h2 className="product-list__title">Sản phẩm</h2>

      {/* Component Filter: Search + Category + Sort */}
      <ProductFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOption={sortOption}
        setSortOption={setSortOption}
        categories={categories}
        totalFound={totalFound}
        totalAll={totalAll}
      />

      {/* Danh sách sản phẩm đã lọc */}
      {filteredProducts.length === 0 ? (
        <div className="product-list__empty">
          <p>😕 Không tìm thấy sản phẩm nào phù hợp.</p>
          <button
            className="product-list__reset-btn"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Tất cả");
              setSortOption("default");
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <div className="product-list__grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductList;
