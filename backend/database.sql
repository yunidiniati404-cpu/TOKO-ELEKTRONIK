-- Database Toko Elektronik Online Setup Script
-- Run this script in MySQL to initialize the database

-- Create Database
CREATE DATABASE IF NOT EXISTS toko_elektronik;
USE toko_elektronik;

-- Users Table (with role and profilePhoto)
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
);

-- Products Table (updated for electronics)
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
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  items JSON NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Dalam Pengiriman',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_order_number (order_number),
  INDEX idx_created_at (created_at)
);

-- Insert Default Admin User (password: 123, hashed with bcrypt)
INSERT INTO users (username, email, password, phone, address, role) VALUES (
  'admin',
  'admin@tokoelektronik.com',
  '$2a$10$mZPo3.tCXlhSZK0b3F.yQ.yVsD.Sg5YXQp5SLxqvpDhz7m0K7RP9K',
  '+62812345678',
  'Jl. Elektronik No. 123, Jakarta',
  'admin'
) ON DUPLICATE KEY UPDATE id=id;

-- Insert Default Products (30 electronics products)
INSERT INTO products (name, brand, price, category, image, rating, reviews, discount, description) VALUES
('MacBook Pro 16" M3 Max', 'Apple', '45000000.00', 'laptops', 'https://images.samsung.com/is/image/samsung/p6pim/id/ls49cg954elxzd/gallery/id-c49g95t-odyssey-g9-gaming-monitor-ls49cg954elxzd-535571082?$650_519_PNG$', '4.9', 156, 8, 'MacBook Pro 16 inci dengan chip M3 Max terbaru, layar Liquid Retina XDR 16.2 inci, RAM 32GB, SSD 1TB. Performa luar biasa untuk kreator profesional.'),
('iPhone 15 Pro Max 1TB', 'Apple', '22999000.00', 'smartphones', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882', '4.8', 289, 5, 'iPhone 15 Pro Max dengan penyimpanan 1TB, chip A17 Pro, kamera 48MP, dan Action Button. Desain titanium yang elegan dan tahan lama.'),
('Samsung Galaxy S24 Ultra', 'Samsung', '19999000.00', 'smartphones', 'https://images.samsung.com/is/image/samsung/p6pim/id/ls49cg954elxzd/gallery/id-c49g95t-odyssey-g9-gaming-monitor-ls49cg954elxzd-535571082?$650_519_PNG$', '4.7', 345, 12, 'Samsung Galaxy S24 Ultra dengan S Pen, kamera 200MP, layar Dynamic AMOLED 2X 6.8 inci, dan baterai 5000mAh. Flagship Android terbaik.'),
('Sony WH-1000XM5 Wireless', 'Sony', '4999000.00', 'audio', 'https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png', '4.9', 512, 15, 'Headphone wireless premium dengan noise cancelling terbaik, baterai 30 jam, fast charging 3 menit untuk 3 jam, dan kualitas suara Hi-Res Audio.'),
('Dell XPS 13 Plus', 'Dell', '18999000.00', 'laptops', 'https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png', '4.6', 198, 10, 'Dell XPS 13 Plus dengan layar InfinityEdge 13.4 inci 3.5K, prosesor Intel Core i7-1360P, RAM 16GB, SSD 512GB. Laptop premium ultrabook.'),
('iPad Pro 12.9" M2', 'Apple', '17999000.00', 'tablets', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882', '4.8', 267, 7, 'iPad Pro 12.9 inci dengan chip M2, layar Liquid Retina XDR, Apple Pencil Pro, dan Magic Keyboard. Alat produktivitas ultimate.'),
('Samsung Galaxy Buds2 Pro', 'Samsung', '2299000.00', 'audio', 'https://images.samsung.com/is/image/samsung/p6pim/id/ls49cg954elxzd/gallery/id-c49g95t-odyssey-g9-gaming-monitor-ls49cg954elxzd-535571082?$650_519_PNG$', '4.6', 423, 20, 'Galaxy Buds2 Pro dengan active noise cancelling 2X lebih baik, audio 360, baterai 8 jam, dan fitur kesehatan seperti pelacakan tidur.'),
('Apple Magic Keyboard', 'Apple', '1999000.00', 'accessories', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882', '4.5', 189, 0, 'Magic Keyboard dengan desain tipis, baterai tahan lama, dan koneksi wireless yang stabil. Kompatibel dengan semua perangkat Apple.'),
('ASUS ROG Strix G15', 'ASUS', '18999000.00', 'laptops', 'https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png', '4.7', 234, 15, 'ASUS ROG Strix G15 gaming laptop dengan RTX 4070, AMD Ryzen 9, layar 165Hz 15.6 inci, dan sistem pendingin yang powerful.'),
('Google Pixel 8 Pro', 'Google', '12999000.00', 'smartphones', 'https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png', '4.5', 178, 8, 'Google Pixel 8 Pro dengan kamera computational photography terbaik, Tensor G3 chip, 7 tahun update OS, dan baterai tahan seharian.'),
('Sony A7R V Mirrorless', 'Sony', '89999000.00', 'accessories', 'https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png', '4.9', 89, 5, 'Kamera mirrorless profesional Sony A7R V dengan sensor 61MP full-frame, video 4K 60p, autofocus AI, dan stabilisasi gambar 8-stop.'),
('Microsoft Surface Pro 9', 'Microsoft', '16999000.00', 'tablets', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882', '4.6', 312, 12, 'Microsoft Surface Pro 9 dengan Intel Core i7, RAM 16GB, SSD 256GB, dan Surface Pen. 2-in-1 laptop yang powerful dan versatile.'),
('Bose QuietComfort Earbuds II', 'Bose', '3499000.00', 'audio', 'https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png', '4.7', 456, 18, 'Bose QuietComfort Earbuds II dengan noise cancelling 11 level, baterai 6 jam, dan kualitas suara Bose yang legendaris.'),
('Logitech MX Master 3S', 'Logitech', '1299000.00', 'accessories', 'https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png', '4.8', 678, 10, 'Logitech MX Master 3S wireless mouse dengan scroll wheel elektromagnetik, koneksi multi-device, dan presisi tracking luar biasa.'),
('OnePlus 12', 'OnePlus', '8999000.00', 'smartphones', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882', '4.4', 267, 15, 'OnePlus 12 dengan Snapdragon 8 Gen 3, fast charging 100W, kamera Hasselblad, dan OxygenOS yang smooth. Flagship killer terbaik.'),
('Apple Watch Ultra 2', 'Apple', '12999000.00', 'accessories', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882', '4.7', 198, 8, 'Apple Watch Ultra 2 dengan chip S9, GPS presisi, health monitoring lengkap, dan ketahanan ekstrem untuk petualangan outdoor.'),
('Razer Blade 16', 'Razer', '35999000.00', 'laptops', 'https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png', '4.8', 145, 10, 'Razer Blade 16 gaming laptop dengan RTX 4090, Intel Core i9, layar 16 inci QHD+ 240Hz, dan keyboard RGB per-key.'),
('Samsung Galaxy Tab S9+', 'Samsung', '13999000.00', 'tablets', 'https://images.samsung.com/is/image/samsung/p6pim/id/ls49cg954elxzd/gallery/id-c49g95t-odyssey-g9-gaming-monitor-ls49cg954elxzd-535571082?$650_519_PNG$', '4.5', 223, 12, 'Samsung Galaxy Tab S9+ dengan S Pen, layar 12.4 inci Dynamic AMOLED 2X, Snapdragon 8 Gen 2, dan S Pen yang presisi.'),
('JBL PartyBox 110', 'JBL', '4999000.00', 'audio', 'https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png', '4.6', 389, 20, 'JBL PartyBox 110 portable party speaker dengan 160W output, bass yang powerful, lighting effects, dan baterai tahan 12 jam.'),
('Anker PowerCore 26800', 'Anker', '599000.00', 'accessories', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882', '4.7', 892, 25, 'Power bank 26800mAh dengan fast charging 22.5W, 3 port output, dan teknologi PowerIQ untuk charging yang optimal.'),
('Nintendo Switch OLED', 'Nintendo', '4999000.00', 'gaming', 'https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png', '4.8', 567, 15, 'Nintendo Switch OLED dengan layar 7 inci OLED yang vibrant, storage 64GB, dan desain yang lebih nyaman untuk gaming portabel.'),
('DJI Mini 3 Pro Drone', 'DJI', '8999000.00', 'accessories', 'https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png', '4.7', 234, 10, 'DJI Mini 3 Pro drone dengan kamera 48MP, video 4K, flight time 34 menit, dan fitur active track untuk fotografi aerial.'),
('GoPro HERO11 Silver', 'GoPro', '3999000.00', 'accessories', 'https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png', '4.6', 345, 12, 'GoPro HERO11 Silver dengan video 5.3K, foto 27MP, waterproof 33ft, dan HyperSmooth 5.0 untuk video stabil.'),
('Apple AirPods Pro (2nd Gen)', 'Apple', '3499000.00', 'audio', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2nd-gen-hero-select-202409?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1725492498882', '4.8', 678, 8, 'AirPods Pro generasi kedua dengan active noise cancelling yang ditingkatkan, adaptive transparency, dan audio spatial.'),
('Samsung 49" Odyssey G9', 'Samsung', '18999000.00', 'accessories', 'https://images.samsung.com/is/image/samsung/p6pim/id/ls49cg954elxzd/gallery/id-c49g95t-odyssey-g9-gaming-monitor-ls49cg954elxzd-535571082?$650_519_PNG$', '4.9', 189, 20, 'Monitor gaming ultrawide 49 inci dengan resolusi Dual QHD, refresh rate 240Hz, dan curvature 1000R untuk immersive gaming.'),
('Sony PlayStation 5 Slim', 'Sony', '6999000.00', 'gaming', 'https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png', '4.8', 892, 5, 'PlayStation 5 Slim dengan SSD 1TB, ray tracing, 4K gaming, dan desain yang lebih compact namun tetap powerful.'),
('Logitech G915 TKL Keyboard', 'Logitech', '2999000.00', 'accessories', 'https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png', '4.7', 456, 15, 'Mechanical gaming keyboard tenkeyless dengan switch low-profile, lighting RGB, dan konektivitas wireless 2.4GHz.'),
('Canon EOS R6 Mark II', 'Canon', '34999000.00', 'accessories', 'https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png', '4.8', 123, 8, 'Kamera mirrorless full-frame dengan sensor 24.2MP, video 4K 60p, autofocus 1053-point, dan stabilisasi gambar 8-stop.'),
('Razer DeathAdder V3 Pro', 'Razer', '1499000.00', 'accessories', 'https://www.dji.com/medias/en/products/mini-3-pro/gallery/DJI_Mini_3_Pro_Gallery_Image_01.png', '4.6', 567, 10, 'Gaming mouse wireless dengan sensor Focus Pro 30K, switch optik, dan baterai tahan hingga 90 jam.'),
('BenQ PD2700U Monitor', 'BenQ', '5999000.00', 'accessories', 'https://gopro.com/content/dam/gopro/products/hero11-silver/hero11-silver-front.png', '4.5', 234, 12, 'Monitor profesional 27 inci 4K UHD dengan color accuracy 100% sRGB, HDR10, dan konektivitas lengkap untuk content creator.')
ON DUPLICATE KEY UPDATE id=id;

-- Verify Setup
SELECT '✅ Database setup complete!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_orders FROM orders;
