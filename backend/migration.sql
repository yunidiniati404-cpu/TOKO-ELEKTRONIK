-- Migration Script: Update Products Table for Electronics
-- Run this script to migrate existing database to new electronics schema

USE toko_elektronik;

-- Create backup of existing products table
CREATE TABLE IF NOT EXISTS products_backup AS SELECT * FROM products;

-- Add new columns
ALTER TABLE products
ADD COLUMN IF NOT EXISTS name VARCHAR(255),
ADD COLUMN IF NOT EXISTS brand VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT;

-- Migrate data from old columns to new columns
UPDATE products SET
  name = COALESCE(name, title),
  brand = COALESCE(brand, author),
  description = CONCAT('Produk elektronik dari ', COALESCE(author, 'Brand'), ': ', COALESCE(title, 'Product'))
WHERE name IS NULL OR brand IS NULL;

-- Change price column type from DECIMAL to VARCHAR
ALTER TABLE products MODIFY COLUMN price VARCHAR(20) NOT NULL;

-- Change rating column type from DECIMAL to VARCHAR
ALTER TABLE products MODIFY COLUMN rating VARCHAR(10);

-- Drop old columns (uncomment when ready to drop)
-- ALTER TABLE products DROP COLUMN title, DROP COLUMN author;

-- Update indexes
DROP INDEX IF EXISTS idx_price ON products;
CREATE INDEX IF NOT EXISTS idx_brand ON products (brand);

-- Verify migration
SELECT '✅ Database migration complete!' as status;
SELECT COUNT(*) as total_products FROM products;
SELECT name, brand, price, category FROM products LIMIT 5;