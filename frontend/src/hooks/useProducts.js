import { useState, useEffect, useMemo } from "react";
import { apiClient } from "../api/client";
import productsData from "../data/products.json";

// Custom Hook: tách logic fetch + filter + sort ra khỏi component
// Component chỉ cần gọi useProducts() và dùng kết quả, không cần biết chi tiết
const useProducts = () => {
  // --- State: dữ liệu gốc từ API ---
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- State: bộ lọc (Theory: Data handling) ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [sortOption, setSortOption] = useState("default");

  // useEffect: Axios GET - gọi API khi component mount
  // Nếu backend chưa chạy, fallback về mock data
  useEffect(() => {
    setLoading(true);
    setError(null);

    apiClient
      .get("/products")
      .then((data) => {
        setAllProducts(data);
      })
      .catch(() => {
        // Fallback: dùng mock data local khi backend chưa chạy
        setAllProducts(productsData);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // useMemo: tính toán danh sách đã lọc/sort chỉ khi dependency thay đổi
  // Tránh tính toán lại mỗi lần component re-render vì lý do khác
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // 1. Tìm kiếm theo tên (case-insensitive)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query)
      );
    }

    // 2. Lọc theo danh mục
    if (selectedCategory !== "Tất cả") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // 3. Sắp xếp
    switch (sortOption) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name, "vi"));
        break;
      default:
        break; // giữ thứ tự gốc
    }

    return result;
  }, [allProducts, searchQuery, selectedCategory, sortOption]);

  // Lấy danh sách category unique từ dữ liệu gốc
  const categories = useMemo(() => {
    const cats = [...new Set(allProducts.map((p) => p.category))];
    return ["Tất cả", ...cats];
  }, [allProducts]);

  return {
    loading,
    error,
    filteredProducts,
    categories,
    // Filter state & setters
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    // Thống kê
    totalFound: filteredProducts.length,
    totalAll: allProducts.length,
  };
};

export default useProducts;
