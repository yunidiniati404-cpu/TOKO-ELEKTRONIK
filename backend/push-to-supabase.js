const mysql = require('mysql2/promise');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function pushDataToSupabase() {
  let connection;

  try {
    // Connect to MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'toko_elektronik',
    });

    console.log('Connected to MySQL database');

    // Push Users
    console.log('Pushing users...');
    const [users] = await connection.execute('SELECT * FROM users');
    for (const user of users) {
      const { id, ...userData } = user; // Exclude id for auto-increment
      const { error } = await supabase
        .from('users')
        .insert(userData);
      if (error) {
        console.error('Error inserting user:', error);
      } else {
        console.log(`Inserted user: ${user.username}`);
      }
    }

    // Push Products
    console.log('Pushing products...');
    const [products] = await connection.execute('SELECT * FROM products');
    for (const product of products) {
      const { id, ...productData } = product; // Exclude id
      const { error } = await supabase
        .from('products')
        .insert(productData);
      if (error) {
        console.error('Error inserting product:', error);
      } else {
        console.log(`Inserted product: ${product.name}`);
      }
    }

    // Push Orders
    console.log('Pushing orders...');
    const [orders] = await connection.execute('SELECT * FROM orders');
    for (const order of orders) {
      const { id, ...orderData } = order; // Exclude id
      const { error } = await supabase
        .from('orders')
        .insert(orderData);
      if (error) {
        console.error('Error inserting order:', error);
      } else {
        console.log(`Inserted order: ${order.order_number}`);
      }
    }

    console.log('Data push completed successfully!');

  } catch (error) {
    console.error('Error during data push:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('MySQL connection closed');
    }
  }
}

pushDataToSupabase();