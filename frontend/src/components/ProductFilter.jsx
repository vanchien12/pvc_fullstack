import "./ProductFilter.css";

// Component nhận toàn bộ filter state và setters qua props (từ useProducts hook)
const ProductFilter = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortOption,
  setSortOption,
  categories,
  totalFound,
  totalAll,
}) => {
  const sortOptions = [
    { value: "default", label: "Mặc định" },
    { value: "price_asc", label: "Giá: Thấp → Cao" },
    { value: "price_desc", label: "Giá: Cao → Thấp" },
    { value: "name_asc", label: "Tên A → Z" },
  ];

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="product-filter">
      {/* Row 1: Search bar + Sort */}
      <div className="product-filter__top">
        <div className="product-filter__search">
          <span className="product-filter__search-icon">🔍</span>
          <input
            type="text"
            className="product-filter__search-input"
            placeholder="Tìm sản phẩm theo tên, danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="product-filter__clear"
              onClick={handleClearSearch}
              aria-label="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>

        <select
          className="product-filter__sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Row 2: Category tabs */}
      <div className="product-filter__categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`product-filter__cat-btn ${
              selectedCategory === cat ? "product-filter__cat-btn--active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Row 3: Kết quả */}
      <p className="product-filter__result">
        {searchQuery || selectedCategory !== "Tất cả" ? (
          <>
            Tìm thấy <strong>{totalFound}</strong> / {totalAll} sản phẩm
            {searchQuery && (
              <span> cho "<em>{searchQuery}</em>"</span>
            )}
            {selectedCategory !== "Tất cả" && (
              <span> trong danh mục <em>{selectedCategory}</em></span>
            )}
          </>
        ) : (
          <>Hiển thị tất cả <strong>{totalAll}</strong> sản phẩm</>
        )}
      </p>
    </div>
  );
};

export default ProductFilter;
