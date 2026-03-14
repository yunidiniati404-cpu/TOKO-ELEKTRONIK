const mysql = require("mysql2/promise");
require("dotenv").config();

async function migrateDatabase() {
  let connection;

  try {
    console.log("🔄 Starting database migration...");

    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "toko_elektronik",
    });

    console.log("✅ Connected to database");

    // Create backup
    console.log("📦 Creating backup of existing products...");
    await connection.execute("CREATE TABLE IF NOT EXISTS products_backup AS SELECT * FROM products");
    console.log("✅ Backup created");

    // Add new columns
    console.log("🔧 Adding new columns...");
    await connection.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS name VARCHAR(255)");
    await connection.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR(255)");
    await connection.execute("ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT");
    console.log("✅ New columns added");

    // Migrate data
    console.log("📝 Migrating data...");
    await connection.execute(`
      UPDATE products SET
        name = COALESCE(name, title),
        brand = COALESCE(brand, author),
        description = CONCAT('Produk elektronik dari ', COALESCE(author, 'Brand'), ': ', COALESCE(title, 'Product'))
      WHERE name IS NULL OR brand IS NULL
    `);
    console.log("✅ Data migrated");

    // Update column types
    console.log("🔄 Updating column types...");
    await connection.execute("ALTER TABLE products MODIFY COLUMN price VARCHAR(20) NOT NULL");
    await connection.execute("ALTER TABLE products MODIFY COLUMN rating VARCHAR(10)");
    console.log("✅ Column types updated");

    // Update indexes
    console.log("📊 Updating indexes...");
    try {
      await connection.execute("DROP INDEX idx_price ON products");
    } catch (e) {
      // Index might not exist, ignore error
    }
    await connection.execute("CREATE INDEX IF NOT EXISTS idx_brand ON products (brand)");
    console.log("✅ Indexes updated");

    // Insert new electronics data
    console.log("📱 Inserting electronics products...");
    const electronicsProducts = [
      ["ASUS ROG Strix G15", "ASUS", "18999000.00", "laptops", "https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png", "4.7", 234, 15, "ASUS ROG Strix G15 gaming laptop dengan RTX 4070, AMD Ryzen 9, layar 165Hz 15.6 inci, dan sistem pendingin yang powerful."],
      ["Google Pixel 8 Pro", "Google", "12999000.00", "smartphones", "https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png", "4.5", 178, 8, "Google Pixel 8 Pro dengan kamera computational photography terbaik, Tensor G3 chip, 7 tahun update OS, dan baterai tahan seharian."],
      ["Sony A7R V Mirrorless", "Sony", "89999000.00", "accessories", "https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png", "4.9", 89, 5, "Kamera mirrorless profesional Sony A7R V dengan sensor 61MP full-frame, video 4K 60p, autofocus AI, dan stabilisasi gambar 8-stop."],
      ["Microsoft Surface Pro 9", "Microsoft", "16999000.00", "tablets", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882", "4.6", 312, 12, "Microsoft Surface Pro 9 dengan Intel Core i7, RAM 16GB, SSD 256GB, dan Surface Pen. 2-in-1 laptop yang powerful dan versatile."],
      ["Bose QuietComfort Earbuds II", "Bose", "3499000.00", "audio", "https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png", "4.7", 456, 18, "Bose QuietComfort Earbuds II dengan noise cancelling 11 level, baterai 6 jam, dan kualitas suara Bose yang legendaris."],
      ["Logitech MX Master 3S", "Logitech", "1299000.00", "accessories", "https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png", "4.8", 678, 10, "Logitech MX Master 3S wireless mouse dengan scroll wheel elektromagnetik, koneksi multi-device, dan presisi tracking luar biasa."],
      ["OnePlus 12", "OnePlus", "8999000.00", "smartphones", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882", "4.4", 267, 15, "OnePlus 12 dengan Snapdragon 8 Gen 3, fast charging 100W, kamera Hasselblad, dan OxygenOS yang smooth. Flagship killer terbaik."],
      ["Apple Watch Ultra 2", "Apple", "12999000.00", "accessories", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882", "4.7", 198, 8, "Apple Watch Ultra 2 dengan chip S9, GPS presisi, health monitoring lengkap, dan ketahanan ekstrem untuk petualangan outdoor."],
      ["Razer Blade 16", "Razer", "35999000.00", "laptops", "https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png", "4.8", 145, 10, "Razer Blade 16 gaming laptop dengan RTX 4090, Intel Core i9, layar 16 inci QHD+ 240Hz, dan keyboard RGB per-key."],
      ["Samsung Galaxy Tab S9+", "Samsung", "13999000.00", "tablets", "https://images.samsung.com/is/image/samsung/p6pim/id/ls49cg954elxzd/gallery/id-c49g95t-odyssey-g9-gaming-monitor-ls49cg954elxzd-535571082?$650_519_PNG$", "4.5", 223, 12, "Samsung Galaxy Tab S9+ dengan S Pen, layar 12.4 inci Dynamic AMOLED 2X, Snapdragon 8 Gen 2, dan S Pen yang presisi."],
      ["JBL PartyBox 110", "JBL", "4999000.00", "audio", "https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png", "4.6", 389, 20, "JBL PartyBox 110 portable party speaker dengan 160W output, bass yang powerful, lighting effects, dan baterai tahan 12 jam."],
      ["Anker PowerCore 26800", "Anker", "599000.00", "accessories", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882", "4.7", 892, 25, "Power bank 26800mAh dengan fast charging 22.5W, 3 port output, dan teknologi PowerIQ untuk charging yang optimal."],
      ["Nintendo Switch OLED", "Nintendo", "4999000.00", "gaming", "https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png", "4.8", 567, 15, "Nintendo Switch OLED dengan layar 7 inci OLED yang vibrant, storage 64GB, dan desain yang lebih nyaman untuk gaming portabel."],
      ["DJI Mini 3 Pro Drone", "DJI", "8999000.00", "accessories", "https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png", "4.7", 234, 10, "DJI Mini 3 Pro drone dengan kamera 48MP, video 4K, flight time 34 menit, dan fitur active track untuk fotografi aerial."],
      ["GoPro HERO11 Silver", "GoPro", "3999000.00", "accessories", "https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png", "4.6", 345, 12, "GoPro HERO11 Silver dengan video 5.3K, foto 27MP, waterproof 33ft, dan HyperSmooth 5.0 untuk video stabil."],
      ["Apple AirPods Pro (2nd Gen)", "Apple", "3499000.00", "audio", "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882", "4.8", 678, 8, "AirPods Pro generasi kedua dengan active noise cancelling yang ditingkatkan, adaptive transparency, dan audio spatial."],
      ["Samsung 49\" Odyssey G9", "Samsung", "18999000.00", "accessories", "https://images.samsung.com/is/image/samsung/p6pim/id/ls49cg954elxzd/gallery/id-c49g95t-odyssey-g9-gaming-monitor-ls49cg954elxzd-535571082?$650_519_PNG$", "4.9", 189, 20, "Monitor gaming ultrawide 49 inci dengan resolusi Dual QHD, refresh rate 240Hz, dan curvature 1000R untuk immersive gaming."],
      ["Sony PlayStation 5 Slim", "Sony", "6999000.00", "gaming", "https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png", "4.8", 892, 5, "PlayStation 5 Slim dengan SSD 1TB, ray tracing, 4K gaming, dan desain yang lebih compact namun tetap powerful."],
      ["Logitech G915 TKL Keyboard", "Logitech", "2999000.00", "accessories", "https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png", "4.7", 456, 15, "Mechanical gaming keyboard tenkeyless dengan switch low-profile, lighting RGB, dan konektivitas wireless 2.4GHz."],
      ["Canon EOS R6 Mark II", "Canon", "34999000.00", "accessories", "https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png", "4.8", 123, 8, "Kamera mirrorless full-frame dengan sensor 24.2MP, video 4K 60p, autofocus 1053-point, dan stabilisasi gambar 8-stop."],
      ["Razer DeathAdder V3 Pro", "Razer", "1499000.00", "accessories", "https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png", "4.6", 567, 10, "Gaming mouse wireless dengan sensor Focus Pro 30K, switch optik, dan baterai tahan hingga 90 jam."],
      ["BenQ PD2700U Monitor", "BenQ", "5999000.00", "accessories", "https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png", "4.5", 234, 12, "Monitor profesional 27 inci 4K UHD dengan color accuracy 100% sRGB, HDR10, dan konektivitas lengkap untuk content creator."]
    ];

    for (const product of electronicsProducts) {
      await connection.execute(
        "INSERT INTO products (name, brand, price, category, image, rating, reviews, discount, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id=id",
        product
      );
    }
    console.log("✅ Electronics products inserted");

    // Verify migration
    const [result] = await connection.execute("SELECT COUNT(*) as total FROM products");
    console.log(`📊 Total products: ${result[0].total}`);

    const [sample] = await connection.execute("SELECT name, brand, price, category FROM products LIMIT 3");
    console.log("📋 Sample products:");
    sample.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} by ${product.brand} - ${product.category}`);
    });

    console.log("✅ Database migration completed successfully!");

  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

migrateDatabase();