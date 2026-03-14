import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { formatRupiahShort } from "../utils/formatCurrency";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { orders, user } = useContext(CartContext);
  const [stats, setStats] = useState({
    totalproducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch statistics dari API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsRes = await fetch("http://localhost:5000/api/products");
        const products = productsRes.ok ? await productsRes.json() : [];
        
        // Hitung revenue dari orders di context
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        setStats({
          totalproducts: products.length || 8,
          totalUsers: 1, // Minimal ada 1 user (yang login)
          totalOrders: orders.length || 0,
          totalRevenue: totalRevenue || 0
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Fallback values
        setStats({
          totalproducts: 8,
          totalUsers: 1,
          totalOrders: orders.length || 0,
          totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0) || 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [orders]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Selamat Datang, Di Toko Elektronik Kami! 👋</h2>
          <p>Anda telah berhasil login ke sistem ELECTRONIC STORE kami.</p>
        </div>

        <div className="menu-container">
          <h3>Menu Utama</h3>
          <div className="menu-buttons">
            <button className="menu-btn" onClick={() => navigate("/products")}>
              � Jelajahi Elektronik
            </button>
            <button className="menu-btn" onClick={() => navigate("/cart")}>
              🛒 Keranjang Belanja
            </button>
            <button className="menu-btn" onClick={() => navigate("/orders")}>
              📦 Riwayat Pesanan
            </button>
            <button className="menu-btn" onClick={() => navigate("/profile")}>
              👤 Profil Saya
            </button>
          </div>
        </div>

        <div className="info-section">
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
