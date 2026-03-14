import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { formatRupiah } from "../utils/formatCurrency";
import "./Products.css";

function Products() {
  const { addToCart } = useContext(CartContext);
  const [products, setproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk generate SVG placeholder image
  const generatePlaceholderImage = (title, brand, color = "#007aff") => {
    const encodedTitle = encodeURIComponent(title.substring(0, 20));
    const encodedBrand = encodeURIComponent(brand);
    const svgString = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color}" stop-opacity="0.8" />
          <stop offset="100%" style="stop-color:${color}" stop-opacity="0.4" />
        </linearGradient>
      </defs>
      <rect width="300" height="200" fill="url(#grad)" rx="8"/>
      <circle cx="150" cy="80" r="25" fill="white" opacity="0.9"/>
      <rect x="125" y="110" width="50" height="8" fill="white" opacity="0.9" rx="4"/>
      <rect x="135" y="125" width="30" height="6" fill="white" opacity="0.7" rx="3"/>
      <text x="150" y="170" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="12" font-weight="bold">${encodedBrand}</text>
      <text x="150" y="185" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="10">${encodedTitle}</text>
    </svg>`;
    return `data:image/svg+xml;base64,${btoa(svgString)}`;
  };

  // Fetch products dari API saat component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/products");
        
        if (!response.ok) {
          throw new Error("Gagal fetch produk");
        }

        const data = await response.json();
        // Map backend data format to frontend expected format
        const mappedData = data.map(product => ({
          id: product.id,
          title: product.name,
          author: product.brand,
          price: parseFloat(product.price),
          category: product.category,
          image: product.image,
          rating: parseFloat(product.rating),
          reviews: product.reviews,
          discount: product.discount,
          description: product.description || `${product.name} dari ${product.brand}`
        }));
        setproducts(mappedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Gagal memuat produk. Pastikan backend running di port 5000");
        // Fallback ke data lokal jika backend tidak berjalan
        setproducts([
          {
            id: 1,
            title: "MacBook Pro 16\" M3 Max",
            author: "Apple",
            price: 45000000,
            category: "laptops",
            image: generatePlaceholderImage("MacBook Pro 16\" M3 Max", "Apple", "#1a73e8"),
            rating: 4.9,
            reviews: 156,
            discount: 8,
            description: "MacBook Pro 16 inci dengan chip M3 Max terbaru, layar Liquid Retina XDR 16.2 inci, RAM 32GB, SSD 1TB. Performa luar biasa untuk kreator profesional."
          },
          {
            id: 2,
            title: "iPhone 15 Pro Max 1TB",
            author: "Apple",
            price: 22999000,
            category: "smartphones",
            image: generatePlaceholderImage("iPhone 15 Pro Max 1TB", "Apple", "#007aff"),
            rating: 4.8,
            reviews: 289,
            discount: 5,
            description: "iPhone 15 Pro Max dengan penyimpanan 1TB, chip A17 Pro, kamera 48MP, dan Action Button. Desain titanium yang elegan dan tahan lama."
          },
          {
            id: 3,
            title: "Samsung Galaxy S24 Ultra",
            author: "Samsung",
            price: 19999000,
            category: "smartphones",
            image: generatePlaceholderImage("Galaxy S24 Ultra", "Samsung", "#1428a0"),
            rating: 4.7,
            reviews: 345,
            discount: 12,
            description: "Samsung Galaxy S24 Ultra dengan S Pen, kamera 200MP, layar Dynamic AMOLED 2X 6.8 inci, dan baterai 5000mAh. Flagship Android terbaik."
          },
          {
            id: 4,
            title: "Sony WH-1000XM5 Wireless",
            author: "Sony",
            price: 4999000,
            category: "audio",
            image: generatePlaceholderImage("WH-1000XM5 Wireless", "Sony", "#000000"),
            rating: 4.9,
            reviews: 512,
            discount: 15,
            description: "Headphone wireless premium dengan noise cancelling terbaik, baterai 30 jam, fast charging 3 menit untuk 3 jam, dan kualitas suara Hi-Res Audio."
          },
          {
            id: 5,
            title: "Dell XPS 13 Plus",
            author: "Dell",
            price: 18999000,
            category: "laptops",
            image: generatePlaceholderImage("XPS 13 Plus", "Dell", "#007db8"),
            rating: 4.6,
            reviews: 198,
            discount: 10,
            description: "Dell XPS 13 Plus dengan layar InfinityEdge 13.4 inci 3.5K, prosesor Intel Core i7-1360P, RAM 16GB, SSD 512GB. Laptop premium ultrabook."
          },
          {
            id: 6,
            title: "iPad Pro 12.9\" M2",
            author: "Apple",
            price: 17999000,
            category: "tablets",
            image: generatePlaceholderImage("iPad Pro 12.9\" M2", "Apple", "#1a73e8"),
            rating: 4.8,
            reviews: 267,
            discount: 7,
            description: "iPad Pro 12.9 inci dengan chip M2, layar Liquid Retina XDR, Apple Pencil Pro, dan Magic Keyboard. Alat produktivitas ultimate."
          },
          {
            id: 7,
            title: "Samsung Galaxy Buds2 Pro",
            author: "Samsung",
            price: 2299000,
            category: "audio",
            image: generatePlaceholderImage("Galaxy Buds2 Pro", "Samsung", "#1428a0"),
            rating: 4.6,
            reviews: 423,
            discount: 20,
            description: "Galaxy Buds2 Pro dengan active noise cancelling 2X lebih baik, audio 360, baterai 8 jam, dan fitur kesehatan seperti pelacakan tidur."
          },
          {
            id: 8,
            title: "Apple Magic Keyboard",
            author: "Apple",
            price: 1999000,
            category: "accessories",
            image: generatePlaceholderImage("Magic Keyboard", "Apple", "#007aff"),
            rating: 4.5,
            reviews: 189,
            discount: 0,
            description: "Magic Keyboard dengan desain tipis, baterai tahan lama, dan koneksi wireless yang stabil. Kompatibel dengan semua perangkat Apple."
          },
          {
            id: 9,
            title: "ASUS ROG Strix G15",
            author: "ASUS",
            price: 18999000,
            category: "laptops",
            image: generatePlaceholderImage("ROG Strix G15", "ASUS", "#ff6b35"),
            rating: 4.7,
            reviews: 234,
            discount: 15,
            description: "ASUS ROG Strix G15 gaming laptop dengan RTX 4070, AMD Ryzen 9, layar 165Hz 15.6 inci, dan sistem pendingin yang powerful."
          },
          {
            id: 10,
            title: "Google Pixel 8 Pro",
            author: "Google",
            price: 12999000,
            category: "smartphones",
            image: generatePlaceholderImage("Pixel 8 Pro", "Google", "#4285f4"),
            rating: 4.5,
            reviews: 178,
            discount: 8,
            description: "Google Pixel 8 Pro dengan kamera computational photography terbaik, Tensor G3 chip, 7 tahun update OS, dan baterai tahan seharian."
          },
          {
            id: 11,
            title: "Sony A7R V Mirrorless",
            author: "Sony",
            price: 89999000,
            category: "accessories",
            image: generatePlaceholderImage("A7R V Mirrorless", "Sony", "#000000"),
            rating: 4.9,
            reviews: 89,
            discount: 5,
            description: "Kamera mirrorless profesional Sony A7R V dengan sensor 61MP full-frame, 4K 60p, autofocus AI, dan stabilisasi gambar 8-stop."
          },
          {
            id: 12,
            title: "Microsoft Surface Pro 9",
            author: "Microsoft",
            price: 16999000,
            category: "tablets",
            image: generatePlaceholderImage("Surface Pro 9", "Microsoft", "#0078d4"),
            rating: 4.6,
            reviews: 312,
            discount: 12,
            description: "Microsoft Surface Pro 9 dengan Intel Core i7, RAM 16GB, SSD 256GB, dan Surface Pen. 2-in-1 laptop yang powerful dan versatile."
          },
          {
            id: 13,
            title: "Bose QuietComfort Earbuds II",
            author: "Bose",
            price: 3499000,
            category: "audio",
            image: generatePlaceholderImage("QuietComfort Earbuds II", "Bose", "#000000"),
            rating: 4.7,
            reviews: 456,
            discount: 18,
            description: "Bose QuietComfort Earbuds II dengan noise cancelling 11 level, baterai 6 jam, dan kualitas suara Bose yang legendaris."
          },
          {
            id: 14,
            title: "Logitech MX Master 3S",
            author: "Logitech",
            price: 1299000,
            category: "accessories",
            image: generatePlaceholderImage("MX Master 3S", "Logitech", "#00b8d4"),
            rating: 4.8,
            reviews: 678,
            discount: 10,
            description: "Logitech MX Master 3S wireless mouse dengan scroll wheel elektromagnetik, koneksi multi-device, dan presisi tracking luar biasa."
          },
          {
            id: 15,
            title: "OnePlus 12",
            author: "OnePlus",
            price: 8999000,
            category: "smartphones",
            image: generatePlaceholderImage("OnePlus 12", "OnePlus", "#eb0028"),
            rating: 4.4,
            reviews: 267,
            discount: 15,
            description: "OnePlus 12 dengan Snapdragon 8 Gen 3, fast charging 100W, kamera Hasselblad, dan OxygenOS yang smooth. Flagship killer terbaik."
          },
          {
            id: 16,
            title: "Apple Watch Ultra 2",
            author: "Apple",
            price: 12999000,
            category: "accessories",
            image: generatePlaceholderImage("Watch Ultra 2", "Apple", "#007aff"),
            rating: 4.7,
            reviews: 198,
            discount: 8,
            description: "Apple Watch Ultra 2 dengan chip S9, GPS presisi, health monitoring lengkap, dan ketahanan ekstrem untuk petualangan outdoor."
          },
          {
            id: 17,
            title: "Razer Blade 16",
            author: "Razer",
            price: 35999000,
            category: "laptops",
            image: generatePlaceholderImage("Razer Blade 16", "Razer", "#00ff41"),
            rating: 4.8,
            reviews: 145,
            discount: 10,
            description: "Razer Blade 16 gaming laptop dengan RTX 4090, Intel Core i9, layar 16 inci QHD+ 240Hz, dan keyboard RGB per-key."
          },
          {
            id: 18,
            title: "Samsung Galaxy Tab S9+",
            author: "Samsung",
            price: 13999000,
            category: "tablets",
            image: generatePlaceholderImage("Galaxy Tab S9+", "Samsung", "#1428a0"),
            rating: 4.5,
            reviews: 223,
            discount: 12,
            description: "Samsung Galaxy Tab S9+ dengan S Pen, layar 12.4 inci Dynamic AMOLED 2X, Snapdragon 8 Gen 2, dan S Pen yang presisi."
          },
          {
            id: 19,
            title: "JBL PartyBox 110",
            author: "JBL",
            price: 4999000,
            category: "audio",
            image: generatePlaceholderImage("PartyBox 110", "JBL", "#ff6b35"),
            rating: 4.6,
            reviews: 389,
            discount: 20,
            description: "JBL PartyBox 110 portable party speaker dengan 160W output, bass yang powerful, lighting effects, dan baterai tahan 12 jam."
          },
          {
            id: 20,
            title: "Anker PowerCore 26800",
            author: "Anker",
            price: 599000,
            category: "accessories",
            image: generatePlaceholderImage("PowerCore 26800", "Anker", "#00b8d4"),
            rating: 4.7,
            reviews: 892,
            discount: 25,
            description: "Power bank 26800mAh dengan fast charging 22.5W, 3 port output, dan teknologi PowerIQ untuk charging yang optimal."
          },
          {
            id: 21,
            title: "Nintendo Switch OLED",
            author: "Nintendo",
            price: 4999000,
            category: "gaming",
            image: "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_limit,w_500/ncom/en_US/switch/site-design-update/oled-model-switch",
            rating: 4.8,
            reviews: 567,
            discount: 15,
            description: "Nintendo Switch OLED dengan layar 7 inci OLED yang vibrant, storage 64GB, dan desain yang lebih nyaman untuk gaming portabel."
          },
          {
            id: 22,
            title: "DJI Mini 3 Pro Drone",
            author: "DJI",
            price: 8999000,
            category: "accessories",
            image: "https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png",
            rating: 4.7,
            reviews: 234,
            discount: 10,
            description: "DJI Mini 3 Pro drone dengan kamera 48MP, video 4K, flight time 34 menit, dan fitur active track untuk fotografi aerial."
          },
          {
            id: 23,
            title: "GoPro HERO11 Silver",
            author: "GoPro",
            price: 3999000,
            category: "accessories",
            image: "https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png",
            rating: 4.6,
            reviews: 345,
            discount: 12,
            description: "GoPro HERO11 Silver dengan video 5.3K, foto 27MP, waterproof 33ft, dan HyperSmooth 5.0 untuk video stabil."
          },
          {
            id: 24,
            title: "Apple AirPods Pro (2nd Gen)",
            author: "Apple",
            price: 3499000,
            category: "audio",
            image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882",
            rating: 4.8,
            reviews: 678,
            discount: 8,
            description: "AirPods Pro generasi kedua dengan active noise cancelling yang ditingkatkan, adaptive transparency, dan audio spatial."
          },
          {
            id: 25,
            title: "Samsung 49\" Odyssey G9",
            author: "Samsung",
            price: 18999000,
            category: "accessories",
            image: "https://images.samsung.com/is/image/samsung/p6pim/id/ls49cg954elxzd/gallery/id-c49g95t-odyssey-g9-gaming-monitor-ls49cg954elxzd-535571082?$650_519_PNG$",
            rating: 4.9,
            reviews: 189,
            discount: 20,
            description: "Monitor gaming ultrawide 49 inci dengan resolusi Dual QHD, refresh rate 240Hz, dan curvature 1000R untuk immersive gaming."
          },
          {
            id: 26,
            title: "Sony PlayStation 5 Slim",
            author: "Sony",
            price: 6999000,
            category: "gaming",
            image: "https://gmedia.playstation.com/is/image/SIEPDC/ps5-slim-console-horizontal-product-shot-01-ps5-en-14sep23?$native$",
            rating: 4.8,
            reviews: 892,
            discount: 5,
            description: "PlayStation 5 Slim dengan SSD 1TB, ray tracing, 4K gaming, dan desain yang lebih compact namun tetap powerful."
          },
          {
            id: 27,
            title: "Logitech G915 TKL Keyboard",
            author: "Logitech",
            price: 2999000,
            category: "accessories",
            image: "https://resource.logitechg.com/w_692,c_limit,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g915-tkl/g915-tkl-keyboard-gallery-1.png?v=1",
            rating: 4.7,
            reviews: 456,
            discount: 15,
            description: "Mechanical gaming keyboard tenkeyless dengan switch low-profile, lighting RGB, dan konektivitas wireless 2.4GHz."
          },
          {
            id: 28,
            title: "Canon EOS R6 Mark II",
            author: "Canon",
            price: 34999000,
            category: "accessories",
            image: "https://www.canon.co.id/media/migration/catalog/products/cameras/eos-r-series/eos-r6-mark-ii/eos-r6-mark-ii_front_800x800.png",
            rating: 4.8,
            reviews: 123,
            discount: 8,
            description: "Kamera mirrorless full-frame dengan sensor 24.2MP, video 4K 60p, autofocus 1053-point, dan stabilisasi gambar 8-stop."
          },
          {
            id: 29,
            title: "Razer DeathAdder V3 Pro",
            author: "Razer",
            price: 1499000,
            category: "accessories",
            image: "https://assets.razerzone.com/eeimages/support/products/1759/1759_deathadder_v3_pro.png",
            rating: 4.6,
            reviews: 567,
            discount: 10,
            description: "Gaming mouse wireless dengan sensor Focus Pro 30K, switch optik, dan baterai tahan hingga 90 jam."
          },
          {
            id: 30,
            title: "BenQ PD2700U Monitor",
            author: "BenQ",
            price: 5999000,
            category: "accessories",
            image: "https://www.benq.com/en-id/monitor/designer/pd2700u/product/product-shot/pd2700u-product-shot-1.jpg",
            rating: 4.5,
            reviews: 234,
            discount: 12,
            description: "Monitor profesional 27 inci 4K UHD dengan color accuracy 100% sRGB, HDR10, dan konektivitas lengkap untuk content creator."
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (book) => {
    addToCart(book);
  };

  const getDiscountedPrice = (price, discount) => {
    return Math.round(price * (1 - discount / 100));
  };

  return (
    <div className="products-container">
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat produk...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <h2>Terjadi Kesalahan</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Coba Lagi</button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="products-grid">
            {products.length === 0 ? (
              <div className="no-products">
                <h3>Tidak ada produk ditemukan</h3>
                <p>Coba refresh halaman</p>
              </div>
            ) : (
              products.map((book) => (
                <div key={book.id} className="book-card">
                  <div className="book-image-wrapper">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="book-image"
                      onError={(e) => {
                        e.target.src = generatePlaceholderImage(book.title, book.author || "Brand");
                      }}
                    />
                    {book.discount > 0 && (
                      <div className="discount-badge">-{book.discount}%</div>
                    )}
                    <div className="book-overlay">
                      <button
                        className="quick-view-btn"
                      >
                        👁️ Lihat Detail
                      </button>
                    </div>
                  </div>

                  <div className="book-info">
                    <h3>{book.title}</h3>
                    <p className="author">{book.author}</p>

                    <div className="rating">
                      <span className="stars">⭐ {book.rating}</span>
                      <span className="reviews">({book.reviews})</span>
                    </div>

                    <div className="price-section">
                      {book.discount > 0 ? (
                        <>
                          <p className="original-price">
                            {formatRupiah(book.price)}
                          </p>
                          <p className="discounted-price">
                            {formatRupiah(getDiscountedPrice(book.price, book.discount))}
                          </p>
                        </>
                      ) : (
                        <p className="price">
                          {formatRupiah(book.price)}
                        </p>
                      )}
                    </div>

                    <button
                      className="add-cart-btn"
                      onClick={() => handleAddToCart(book)}
                    >
                      🛒 Tambah Keranjang
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Products;
