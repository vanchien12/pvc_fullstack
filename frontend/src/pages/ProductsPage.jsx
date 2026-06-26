// frontend/src/pages/ProductsPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { api } from "../api";

const CATEGORIES = ["Tất cả", "Áo", "Quần", "Giày", "Túi"];
const SORTS = [
  { value:"", label:"Mặc định" },
  { value:"price_asc", label:"Giá thấp → cao" },
  { value:"price_desc", label:"Giá cao → thấp" },
  { value:"rating", label:"Đánh giá cao nhất" },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "Tất cả");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category && category !== "Tất cả") params.set("category", category);
    if (sort) params.set("sort", sort);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    api.get(`/products?${params}`)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [category, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div style={{ fontFamily:"'Segoe UI', sans-serif", background:"#f8fafc", minHeight:"100vh" }}>
      <Navbar />
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Tất cả sản phẩm</h1>
          <p style={styles.sub}>{products.length} sản phẩm tìm thấy</p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} style={styles.searchRow}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Tìm kiếm sản phẩm..."
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>Tìm kiếm</button>
        </form>

        <div style={styles.layout}>
          {/* Sidebar Filter */}
          <aside style={styles.sidebar}>
            <div style={styles.filterBox}>
              <h3 style={styles.filterTitle}>Danh mục</h3>
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  style={{ ...styles.catBtn, ...(category === c ? styles.catBtnActive : {}) }}
                >
                  {c}
                </button>
              ))}
            </div>
            <div style={styles.filterBox}>
              <h3 style={styles.filterTitle}>Khoảng giá</h3>
              <input type="number" placeholder="Giá thấp nhất" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={styles.priceInput} />
              <input type="number" placeholder="Giá cao nhất" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ ...styles.priceInput, marginTop:8 }} />
              <button onClick={fetchProducts} style={styles.applyBtn}>Áp dụng</button>
            </div>
            <div style={styles.filterBox}>
              <h3 style={styles.filterTitle}>Sắp xếp</h3>
              {SORTS.map(s => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  style={{ ...styles.catBtn, ...(sort === s.value ? styles.catBtnActive : {}) }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Product Grid */}
          <main style={{ flex:1 }}>
            {loading ? (
              <div style={styles.grid}>
                {[...Array(8)].map((_, i) => <div key={i} style={styles.skeleton} />)}
              </div>
            ) : products.length === 0 ? (
              <div style={styles.empty}>
                <span style={{ fontSize:64 }}>😕</span>
                <p style={{ color:"#64748b", fontSize:18 }}>Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <div style={styles.grid}>
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding:"32px 80px" },
  header: { marginBottom:24 },
  title: { fontSize:32, fontWeight:800, color:"#0f172a", margin:"0 0 4px" },
  sub: { color:"#64748b", margin:0 },
  searchRow: { display:"flex", gap:12, marginBottom:32 },
  searchInput: { flex:1, padding:"12px 20px", borderRadius:12, border:"2px solid #e2e8f0", fontSize:15, outline:"none" },
  searchBtn: { background:"#6366f1", color:"#fff", border:"none", padding:"12px 28px", borderRadius:12, fontWeight:700, cursor:"pointer", fontSize:15 },
  layout: { display:"flex", gap:32 },
  sidebar: { width:220, flexShrink:0 },
  filterBox: { background:"#fff", borderRadius:16, padding:20, marginBottom:16, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
  filterTitle: { fontSize:15, fontWeight:700, color:"#0f172a", margin:"0 0 14px" },
  catBtn: { display:"block", width:"100%", textAlign:"left", padding:"9px 14px", borderRadius:8, border:"none", background:"transparent", color:"#475569", cursor:"pointer", fontSize:14, marginBottom:4 },
  catBtnActive: { background:"#ede9fe", color:"#6366f1", fontWeight:700 },
  priceInput: { width:"100%", padding:"9px 12px", border:"1px solid #e2e8f0", borderRadius:8, fontSize:14, boxSizing:"border-box" },
  applyBtn: { marginTop:12, width:"100%", padding:"10px", background:"#6366f1", color:"#fff", border:"none", borderRadius:8, fontWeight:600, cursor:"pointer" },
  grid: { display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 },
  skeleton: { height:340, background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", borderRadius:16 },
  empty: { textAlign:"center", padding:"80px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:12 },
};