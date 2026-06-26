// frontend/src/components/ProductCard.jsx
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div style={styles.card}>
      <Link to={`/products/${product.id}`} style={{ textDecoration:"none" }}>
        <div style={styles.imgWrap}>
          <img src={product.image} alt={product.name} style={styles.img} />
          <span style={styles.badge}>{product.category}</span>
        </div>
        <div style={styles.body}>
          <h3 style={styles.name}>{product.name}</h3>
          <p style={styles.desc}>{product.description}</p>
          <div style={styles.row}>
            <span style={styles.price}>{product.price.toLocaleString("vi-VN")}đ</span>
            <span style={styles.rating}>⭐ {product.rating}</span>
          </div>
          <span style={styles.stock}>Còn {product.stock} sản phẩm</span>
        </div>
      </Link>
      <button style={styles.addBtn} onClick={() => addItem(product)}>
        🛒 Thêm vào giỏ
      </button>
    </div>
  );
}

const styles = {
  card: { background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.08)", transition:"transform 0.2s, box-shadow 0.2s", display:"flex", flexDirection:"column" },
  imgWrap: { position:"relative", overflow:"hidden", height:220 },
  img: { width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.3s" },
  badge: { position:"absolute", top:12, left:12, background:"#6366f1", color:"#fff", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 },
  body: { padding:"14px 16px", flex:1 },
  name: { margin:"0 0 6px", fontSize:16, fontWeight:700, color:"#1e293b" },
  desc: { margin:"0 0 10px", fontSize:13, color:"#64748b", lineHeight:1.5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" },
  row: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 },
  price: { color:"#ef4444", fontWeight:700, fontSize:17 },
  rating: { fontSize:13, color:"#64748b" },
  stock: { fontSize:12, color:"#94a3b8" },
  addBtn: { margin:"0 16px 16px", padding:"10px", background:"#6366f1", color:"#fff", border:"none", borderRadius:10, cursor:"pointer", fontWeight:600, fontSize:14, transition:"background 0.2s" },
};