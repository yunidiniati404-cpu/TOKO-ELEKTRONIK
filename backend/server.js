// Backend server for TOKO ELEKTRONIK API
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: "/api/swagger.json",
  },
}));

// Swagger JSON
app.get("/api/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production";

// Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "toko_elektronik",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Connection Pool without database selection (for initial setup)
const setupPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware: Verify JWT Token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token tidak valid" });
  }
};

// Middleware: Verify Admin Role
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Hanya admin yang dapat mengakses endpoint ini" });
  }
  next();
};

// Initialize Database
const initDatabase = async () => {
  try {
    const dbName = process.env.DB_NAME || "toko_elektronik";
    console.log("\n🔄 Initializing database...");
    console.log(`   Host: ${process.env.DB_HOST || "localhost"}`);
    console.log(`   User: ${process.env.DB_USER || "root"}`);
    console.log(`   Database: ${dbName}\n`);
    
    let connection = await setupPool.getConnection();
    
    // Create database if not exists
    console.log(`📦 Creating database '${dbName}' if not exists...`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Database '${dbName}' ready`);
    
    connection.release();
    
    // Now connect to the database
    connection = await pool.getConnection();
    
    // Create users table with role
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(15),
        address TEXT,
        profilePhoto LONGTEXT,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create products table with new schema
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(255),
        price VARCHAR(20) NOT NULL,
        category VARCHAR(50),
        image VARCHAR(500),
        rating VARCHAR(10),
        reviews INT DEFAULT 0,
        discount INT DEFAULT 0,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_brand (brand)
      )
    `);

    // Create orders table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(20) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        items JSON NOT NULL,
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'Dalam Pengiriman',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Check if admin user exists
    const [users] = await connection.execute("SELECT * FROM users WHERE username = ?", ["admin"]);
    
    if (users.length === 0) {
      console.log("📝 Creating default admin user...");
      const hashedPassword = await bcrypt.hash("123", 10);
      await connection.execute(
        "INSERT INTO users (username, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)",
        ["admin", "admin@tokoelektronik.com", hashedPassword, "+62812345678", "Jl. Elektronik No. 123, Jakarta", "admin"]
      );
      console.log("✅ Admin user created (username: admin, password: 123)");
    }

    // Check if products exist
    const [products] = await connection.execute("SELECT COUNT(*) as count FROM products");
    if (products[0].count === 0) {
      console.log("� Inserting default electronics products...");
      const defaultProducts = [
        ["MacBook Pro 16\" M3 Max", "Apple", "45000000.00", "laptops", "https://images.samsung.com/is/image/samsung/p6pim/id/ls49cg954elxzd/gallery/id-c49g95t-odyssey-g9-gaming-monitor-ls49cg954elxzd-535571082?$650_519_PNG$", "4.9", 156, 8, "MacBook Pro 16 inci dengan chip M3 Max terbaru, layar Liquid Retina XDR 16.2 inci, RAM 32GB, SSD 1TB. Performa luar biasa untuk kreator profesional."],
        ["iPhone 15 Pro Max 1TB", "Apple", "22999000.00", "smartphones", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882", "4.8", 289, 5, "iPhone 15 Pro Max dengan penyimpanan 1TB, chip A17 Pro, kamera 48MP, dan Action Button. Desain titanium yang elegan dan tahan lama."],
        ["Samsung Galaxy S24 Ultra", "Samsung", "19999000.00", "smartphones", "https://images.samsung.com/is/image/samsung/p6pim/id/ls49cg954elxzd/gallery/id-c49g95t-odyssey-g9-gaming-monitor-ls49cg954elxzd-535571082?$650_519_PNG$", "4.7", 345, 12, "Samsung Galaxy S24 Ultra dengan S Pen, kamera 200MP, layar Dynamic AMOLED 2X 6.8 inci, dan baterai 5000mAh. Flagship Android terbaik."],
        ["Sony WH-1000XM5 Wireless", "Sony", "4999000.00", "audio", "https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png", "4.9", 512, 15, "Headphone wireless premium dengan noise cancelling terbaik, baterai 30 jam, fast charging 3 menit untuk 3 jam, dan kualitas suara Hi-Res Audio."],
        ["Dell XPS 13 Plus", "Dell", "18999000.00", "laptops", "https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png", "4.6", 198, 10, "Dell XPS 13 Plus dengan layar InfinityEdge 13.4 inci 3.5K, prosesor Intel Core i7-1360P, RAM 16GB, SSD 512GB. Laptop premium ultrabook."],
        ["iPad Pro 12.9\" M2", "Apple", "17999000.00", "tablets", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882", "4.8", 267, 7, "iPad Pro 12.9 inci dengan chip M2, layar Liquid Retina XDR, Apple Pencil Pro, dan Magic Keyboard. Alat produktivitas ultimate."],
        ["Samsung Galaxy Buds2 Pro", "Samsung", "2299000.00", "audio", "https://images.samsung.com/is/image/samsung/p6pim/id/ls49cg954elxzd/gallery/id-c49g95t-odyssey-g9-gaming-monitor-ls49cg954elxzd-535571082?$650_519_PNG$", "4.6", 423, 20, "Galaxy Buds2 Pro dengan active noise cancelling 2X lebih baik, audio 360, baterai 8 jam, dan fitur kesehatan seperti pelacakan tidur."],
        ["Apple Magic Keyboard", "Apple", "1999000.00", "accessories", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882", "4.5", 189, 0, "Magic Keyboard dengan desain tipis, baterai tahan lama, dan koneksi wireless yang stabil. Kompatibel dengan semua perangkat Apple."]
      ];

      for (const product of defaultProducts) {
        await connection.execute(
          "INSERT INTO products (name, brand, price, category, image, rating, reviews, discount, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
          product
        );
      }
      console.log("✅ Default electronics products inserted (8 products)");
    }

    connection.release();
    console.log("✅ Database initialized successfully!\n");
  } catch (error) {
    console.error("\n❌ Database initialization error:");
    console.error("   Error Code:", error.code || "UNKNOWN");
    console.error("   Error Message:", error.message || error);
    console.error("\n💡 Troubleshooting:");
    
    if (error.code === "PROTOCOL_CONNECTION_LOST") {
      console.error("   → MySQL connection was lost");
      console.error("   → Make sure MySQL server is running");
    } else if (error.code === "ECONNREFUSED") {
      console.error("   → MySQL server refused connection");
      console.error("   → Start MySQL: XAMPP Control Panel → Start MySQL");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("   → Authentication failed");
      console.error("   → Check DB_USER and DB_PASSWORD in .env file");
      console.error("   → Default: DB_USER=root, DB_PASSWORD=(empty)");
    } else if (error.code === "ER_BAD_DB_ERROR") {
      console.error("   → Database does not exist and cannot be created");
      console.error("   → Check database permissions");
    }
    
    console.error("\n   📋 Current .env configuration:");
    console.error(`   DB_HOST=${process.env.DB_HOST || "localhost"}`);
    console.error(`   DB_USER=${process.env.DB_USER || "root"}`);
    console.error(`   DB_NAME=${process.env.DB_NAME || "toko_elektronik"}\n`);
  }
};

// Routes: Authentication

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register user baru
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Username atau email sudah terdaftar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Register
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const connection = await pool.getConnection();

    // Check if user exists
    const [existingUser] = await connection.execute(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(400).json({ error: "Username atau email sudah terdaftar" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await connection.execute(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, "user"]
    );

    connection.release();
    res.status(201).json({ message: "Registrasi berhasil" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registrasi gagal" });
  }
});

// Login
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login dan dapatkan JWT Token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Username atau password salah
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const connection = await pool.getConnection();

    const [users] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    connection.release();

    if (users.length === 0) {
      return res.status(401).json({ error: "Username atau password salah" });
    }

    const user = users[0];

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Username atau password salah" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        profilePhoto: user.profilePhoto,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login gagal" });
  }
});

// Routes: Products

// Get all products
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Dapatkan semua produk
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Daftar semua produk
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get("/api/products", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [products] = await connection.execute("SELECT * FROM products");
    connection.release();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil produk" });
  }
});

// Add product (Admin only)
/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Tambah produk baru (Admin only)
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - brand
 *               - price
 *               - category
 *               - image
 *             properties:
 *               name:
 *                 type: string
 *                 example: MacBook Pro 16" M3 Max
 *               brand:
 *                 type: string
 *                 example: Apple
 *               price:
 *                 type: string
 *                 example: 45000000.00
 *               category:
 *                 type: string
 *                 enum: [laptops, smartphones, tablets, audio, gaming, accessories]
 *                 example: laptops
 *               image:
 *                 type: string
 *                 example: https://images.samsung.com/...
 *               rating:
 *                 type: string
 *                 example: 4.9
 *               reviews:
 *                 type: integer
 *                 example: 156
 *               discount:
 *                 type: integer
 *                 example: 8
 *               description:
 *                 type: string
 *                 example: MacBook Pro 16 inci dengan chip M3 Max terbaru...
 *     responses:
 *       201:
 *         description: Produk berhasil ditambahkan
 *       401:
 *         description: Tidak authorized
 *       403:
 *         description: Hanya admin yang bisa menambah produk
 */
app.post("/api/products", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, brand, price, category, image, rating, reviews, discount, description } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      "INSERT INTO products (name, brand, price, category, image, rating, reviews, discount, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, brand, price, category, image, rating || "0", reviews || 0, discount || 0, description || ""]
    );

    const [newProduct] = await connection.execute(
      "SELECT * FROM products WHERE name = ? AND brand = ? ORDER BY id DESC LIMIT 1",
      [name, brand]
    );

    connection.release();
    res.status(201).json(newProduct[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menambah produk" });
  }
});

// Update product (Admin only)
/**
 * @swagger
 * /api/products/{productId}:
 *   put:
 *     summary: Update produk (Admin only)
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: MacBook Pro 16" M3 Max
 *               brand:
 *                 type: string
 *                 example: Apple
 *               price:
 *                 type: string
 *                 example: 45000000.00
 *               category:
 *                 type: string
 *                 enum: [laptops, smartphones, tablets, audio, gaming, accessories]
 *                 example: laptops
 *               image:
 *                 type: string
 *                 example: https://images.samsung.com/...
 *               rating:
 *                 type: string
 *                 example: 4.9
 *               reviews:
 *                 type: integer
 *                 example: 156
 *               discount:
 *                 type: integer
 *                 example: 8
 *               description:
 *                 type: string
 *                 example: MacBook Pro 16 inci dengan chip M3 Max terbaru...
 *     responses:
 *       200:
 *         description: Produk berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       401:
 *         description: Tidak authorized
 *       403:
 *         description: Hanya admin yang bisa update produk
 */
app.put("/api/products/:productId", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, brand, price, category, image, rating, reviews, discount, description } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      "UPDATE products SET name = ?, brand = ?, price = ?, category = ?, image = ?, rating = ?, reviews = ?, discount = ?, description = ? WHERE id = ?",
      [name, brand, price, category, image, rating, reviews, discount, description, productId]
    );

    const [updatedProduct] = await connection.execute(
      "SELECT * FROM products WHERE id = ?",
      [productId]
    );

    connection.release();
    res.json(updatedProduct[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal update produk" });
  }
});

// Delete product (Admin only)
/**
 * @swagger
 * /api/products/{productId}:
 *   delete:
 *     summary: Hapus produk (Admin only)
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: integer
 *         required: true
 *         example: 1
 *     responses:
 *       200:
 *         description: Produk berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Produk berhasil dihapus
 *       401:
 *         description: Tidak authorized
 *       403:
 *         description: Hanya admin yang bisa hapus produk
 */
app.delete("/api/products/:productId", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { productId } = req.params;
    const connection = await pool.getConnection();

    await connection.execute("DELETE FROM products WHERE id = ?", [productId]);

    connection.release();
    res.json({ message: "Produk berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal hapus produk" });
  }
});

// Routes: Orders

// Create order
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Buat order baru
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - total
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *               total:
 *                 type: number
 *                 example: 500000
 *     responses:
 *       201:
 *         description: Order berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Tidak authorized
 */
app.post("/api/orders", verifyToken, async (req, res) => {
  try {
    const { items, total } = req.body;
    const connection = await pool.getConnection();

    const orderNumber = `ORD-${Date.now()}`;

    await connection.execute(
      "INSERT INTO orders (order_number, user_id, items, total) VALUES (?, ?, ?, ?)",
      [orderNumber, req.user.id, JSON.stringify(items), total]
    );

    const [newOrder] = await connection.execute(
      "SELECT * FROM orders WHERE order_number = ?",
      [orderNumber]
    );

    connection.release();

    const order = newOrder[0];
    res.status(201).json({
      ...order,
      items: JSON.parse(order.items),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Pemesanan gagal" });
  }
});

// Get user orders
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Dapatkan riwayat pesanan user
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar pesanan user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Tidak authorized
 */
app.get("/api/orders", verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [orders] = await connection.execute(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );

    connection.release();

    const formattedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items),
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil pesanan" });
  }
});

// Routes: Users

// Get user profile
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Dapatkan profil user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Data profil user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Tidak authorized
 *       404:
 *         description: User tidak ditemukan
 */
app.get("/api/users/profile", verifyToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [users] = await connection.execute(
      "SELECT id, username, email, phone, address, profilePhoto, role FROM users WHERE id = ?",
      [req.user.id]
    );

    connection.release();

    if (users.length === 0) {
      return res.status(404).json({ error: "User tidak ditemukan" });
    }

    res.json(users[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil profil" });
  }
});

// Update user profile
/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update profil user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               phone:
 *                 type: string
 *                 example: "081234567890"
 *               address:
 *                 type: string
 *                 example: Jakarta, Indonesia
 *               profilePhoto:
 *                 type: string
 *                 example: data:image/jpeg;base64,...
 *     responses:
 *       200:
 *         description: Profil berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Tidak authorized
 */
app.put("/api/users/profile", verifyToken, async (req, res) => {
  try {
    const { email, phone, address, profilePhoto } = req.body;
    const connection = await pool.getConnection();

    await connection.execute(
      "UPDATE users SET email = ?, phone = ?, address = ?, profilePhoto = ? WHERE id = ?",
      [email, phone, address, profilePhoto, req.user.id]
    );

    const [updatedUser] = await connection.execute(
      "SELECT id, username, email, phone, address, profilePhoto, role FROM users WHERE id = ?",
      [req.user.id]
    );

    connection.release();
    res.json(updatedUser[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Update profil gagal" });
  }
});

// Get all users (Admin only)
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Dapatkan semua user (Admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Tidak authorized
 *       403:
 *         description: Hanya admin yang bisa akses
 */
app.get("/api/users", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [users] = await connection.execute(
      "SELECT id, username, email, phone, role, created_at FROM users"
    );

    connection.release();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil daftar user" });
  }
});

/**
 * @swagger
 * /api/users/{userId}/role:
 *   put:
 *     summary: Update user role (Admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
app.put("/api/users/:userId/role", verifyToken, verifyAdmin, async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      "UPDATE users SET role = ? WHERE id = ?",
      [role, userId]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update role" });
  }
});

/**
 * @swagger
 * /api/orders/{orderId}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Dalam Pengiriman, Selesai, Dibatalkan]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
app.put("/api/orders/:orderId/status", verifyToken, verifyAdmin, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ["Pending", "Dalam Pengiriman", "Selesai", "Dibatalkan"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, orderId]
    );

    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Start Server
const PORT = process.env.PORT || 5000;
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log("\n" + "=".repeat(50));
    console.log("✅ Backend Server Ready!");
    console.log("=".repeat(50));
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📚 Admin: username: admin | password: 123`);
    console.log(`📖 API Docs: http://localhost:${PORT}/api-docs/`);
    console.log("=".repeat(50) + "\n");
  });
}).catch(error => {
  console.error("\n⚠️  Server failed to start due to database error");
  console.error("Please fix the issue above and restart\n");
  process.exit(1);
});
