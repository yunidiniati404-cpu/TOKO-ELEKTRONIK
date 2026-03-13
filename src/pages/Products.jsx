import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { formatRupiah } from "../utils/formatCurrency";
import "./Products.css";

function Products() {
  const { addToCart } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setBooks(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Gagal memuat produk. Pastikan backend running di port 5000");
        // Fallback ke data lokal jika backend tidak berjalan
        setBooks([
          {
            id: 1,
            title: "MacBook Pro 14\"",
            author: "Apple",
            price: 22500000,
            category: "laptops",
            image: "https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1212345/MacBook-Pro-14.webp",
            rating: 4.9,
            reviews: 128,
            discount: 5,
          },
          {
            id: 2,
            title: "iPhone 15 Pro",
            author: "Apple",
            price: 18999000,
            category: "smartphones",
            image: "https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234567/iPhone-15-Pro.webp",
            rating: 4.8,
            reviews: 245,
            discount: 8,
          },
          {
            id: 3,
            title: "Samsung Galaxy S24",
            author: "Samsung",
            price: 16999000,
            category: "smartphones",
            image: "https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234568/Galaxy-S24.webp",
            rating: 4.7,
            reviews: 189,
            discount: 12,
          },
          {
            id: 4,
            title: "Sony WH-1000XM5 Headphones",
            author: "Sony",
            price: 4499000,
            category: "audio",
            image: "https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234569/Sony-Headphones.webp",
            rating: 4.9,
            reviews: 356,
            discount: 15,
          },
          {
            id: 5,
            title: "Dell XPS 13 Laptop",
            author: "Dell",
            price: 16500000,
            category: "laptops",
            image: "https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234570/Dell-XPS.webp",
            rating: 4.6,
            reviews: 142,
            discount: 10,
          },
          {
            id: 6,
            title: "iPad Pro 12.9\"",
            author: "Apple",
            price: 15999000,
            category: "tablets",
            image: "https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234571/iPad-Pro.webp",
            rating: 4.8,
            reviews: 213,
            discount: 7,
          },
          {
            id: 7,
            title: "Samsung Galaxy Buds",
            author: "Samsung",
            price: 1999000,
            category: "audio",
            image: "https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234572/Galaxy-Buds.webp",
            rating: 4.6,
            reviews: 298,
            discount: 20,
          },
          {
            id: 8,
            title: "Magic Mouse",
            author: "Apple",
            price: 1799000,
            category: "accessories",
            image: "https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234573/Magic-Mouse.webp",
            rating: 4.5,
            reviews: 167,
            discount: 0,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { value: "semua", label: "Semua Elektronik" },
    { value: "laptops", label: "Laptops" },
    { value: "smartphones", label: "Smartphones" },
    { value: "tablets", label: "Tablets" },
    { value: "audio", label: "Audio" },
    { value: "accessories", label: "Aksesoris" },
  ];

  const filteredBooks =
    selectedCategory === "semua"
      ? books
      : books.filter((book) => book.category === selectedCategory);

  const handleAddToCart = (book) => {
    addToCart(book);
  };

  const getDiscountedPrice = (price, discount) => {
    return Math.round(price * (1 - discount / 100));
  };

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Koleksi Elektronik Kami</h1>
        <p>Temukan berbagai pilihan produk elektronik terbaik Anda</p>
      </div>

      <div className="products-filter">
        <h3>Kategori</h3>
        <div className="filter-buttons">
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`filter-btn ${
                selectedCategory === cat.value ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book-card">
            <div className="book-image-wrapper">
              <img
                src={book.image}
                alt={book.title}
                className="book-image"
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
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="no-results">
          <p>Tidak ada elektronik dalam kategori ini</p>
        </div>
      )}
    </div>
  );
}

export default Products;
