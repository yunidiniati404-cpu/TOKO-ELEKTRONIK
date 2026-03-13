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

-- Products Table (8 default books)
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255),
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50),
  image VARCHAR(500),
  rating DECIMAL(3, 1),
  reviews INT DEFAULT 0,
  discount INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_price (price)
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

-- Insert Default Products (8 Books)
INSERT INTO products (title, author, price, category, image, rating, reviews, discount) VALUES
('MacBook Pro 14"', 'Apple', 22500000, 'laptops', 'https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1212345/MacBook-Pro-14.webp', 4.9, 128, 5),
('iPhone 15 Pro', 'Apple', 18999000, 'smartphones', 'https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234567/iPhone-15-Pro.webp', 4.8, 245, 8),
('Samsung Galaxy S24', 'Samsung', 16999000, 'smartphones', 'https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234568/Galaxy-S24.webp', 4.7, 189, 12),
('Sony WH-1000XM5 Headphones', 'Sony', 4499000, 'audio', 'https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234569/Sony-Headphones.webp', 4.9, 356, 15),
('Dell XPS 13 Laptop', 'Dell', 16500000, 'laptops', 'https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234570/Dell-XPS.webp', 4.6, 142, 10),
('iPad Pro 12.9\"', 'Apple', 15999000, 'tablets', 'https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234571/iPad-Pro.webp', 4.8, 213, 7),
('Samsung Galaxy Buds', 'Samsung', 1999000, 'audio', 'https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234572/Galaxy-Buds.webp', 4.6, 298, 20),
('Magic Mouse', 'Apple', 1799000, 'accessories', 'https://images-cdn.ubuy.com/images/products/64bf0cdc9d2c920cb1234573/Magic-Mouse.webp', 4.5, 167, 0)
ON DUPLICATE KEY UPDATE id=id;

-- Verify Setup
SELECT '✅ Database setup complete!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_products FROM products;
SELECT COUNT(*) as total_orders FROM orders;
