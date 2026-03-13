# 🛒 TOKO ELEKTRONIK - Full Stack E-Commerce

Aplikasi toko elektronik modern dengan teknologi full-stack yang dibangun menggunakan React.js, Node.js, Express.js, dan MySQL.

## ✨ Fitur Utama

### 🖥️ Frontend (React.js)
- **Authentication**: Login dan Register dengan JWT
- **Dashboard**: Overview penjualan dan statistik
- **Product Catalog**: Katalog produk elektronik lengkap
- **Shopping Cart**: Keranjang belanja dengan persistensi
- **Order History**: Riwayat pesanan pengguna
- **Profile Management**: Pengelolaan profil pengguna
- **Responsive Design**: UI modern dan responsif

### 🔧 Backend (Node.js + Express.js)
- **RESTful API**: API endpoints lengkap
- **Authentication**: JWT token-based authentication
- **Database**: MySQL dengan connection pooling
- **File Upload**: Support untuk upload gambar produk
- **Error Handling**: Comprehensive error handling
- **CORS**: Cross-origin resource sharing

### 🗄️ Database (MySQL)
- **Auto Setup**: Script setup database otomatis
- **User Management**: Tabel users dengan authentication
- **Product Management**: Katalog produk elektronik
- **Order Management**: Sistem order dan cart
- **Data Seeding**: Data awal untuk testing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 atau lebih baru)
- MySQL Server
- Git

### Installation

1. **Clone Repository**
   ```bash
   git clone https://github.com/yunidiniati404-cpu/TOKO-ELEKTRONIK.git
   cd TOKO-ELEKTRONIK
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Setup database (jalankan MySQL terlebih dahulu)
   # Jalankan script setup database
   ```

3. **Setup Frontend**
   ```bash
   cd ../
   npm install
   ```

4. **Environment Variables**
   Buat file `.env` di folder backend:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=toko_elektronik
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

### Running the Application

1. **Start MySQL Server**
2. **Start Backend**:
   ```bash
   cd backend
   npm start
   # atau untuk development:
   npm run dev
   ```
3. **Start Frontend**:
   ```bash
   npm start
   ```

Aplikasi akan berjalan di:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Struktur Project

```
TOKO-ELEKTRONIK/
├── backend/
│   ├── server.js              # Main server file
│   ├── database.sql           # Database schema
│   ├── package.json
│   └── QUICK_START.md         # Backend setup guide
├── src/
│   ├── components/            # Reusable components
│   ├── pages/                 # Page components
│   │   ├── Dashboard.jsx      # Admin dashboard
│   │   ├── Books.jsx          # Product catalog
│   │   ├── Login.jsx          # Authentication
│   │   ├── ShoppingCart.jsx   # Cart management
│   │   └── ...
│   ├── context/               # React context
│   ├── utils/                 # Utility functions
│   └── App.jsx               # Main app component
├── public/                    # Static assets
└── package.json
```

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI Framework
- **React Router** - Client-side routing
- **CSS3** - Styling dengan animations
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin handling

### Database
- **MySQL** - Relational database
- **Connection Pooling** - Optimized connections

## 📊 Fitur Produk

- ✅ 12+ Produk elektronik lengkap
- ✅ Gambar produk dengan SVG placeholders
- ✅ Deskripsi detail produk
- ✅ Rating dan ulasan
- ✅ Harga dengan diskon
- ✅ Filter berdasarkan kategori
- ✅ Search functionality
- ✅ Responsive grid layout

## 🔐 Authentication

- **Register**: Buat akun baru
- **Login**: Masuk dengan email/username dan password
- **JWT Tokens**: Secure authentication
- **Protected Routes**: Route protection
- **Session Management**: Persistent login state

## 🎨 UI/UX Features

- **Modern Design**: Clean dan professional
- **Animations**: Smooth transitions dan hover effects
- **Responsive**: Mobile-first design
- **Dark Theme**: Background gradient
- **Loading States**: Loading indicators
- **Error Handling**: User-friendly error messages

## 📈 Dashboard Features

- **Statistics**: Total produk, users, orders, revenue
- **Charts**: Visual data representation
- **Quick Actions**: Direct navigation buttons
- **Real-time Updates**: Live data dari database

## 🛒 Shopping Features

- **Product Catalog**: Grid layout dengan gambar
- **Add to Cart**: One-click add functionality
- **Cart Management**: Update quantity, remove items
- **Order History**: Track previous orders
- **Checkout Process**: Complete order flow

## 🔧 Development

### Available Scripts

```bash
# Backend
npm start          # Start production server
npm run dev        # Start development server with nodemon

# Frontend
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Database Setup

1. Install MySQL Server
2. Create database: `toko_elektronik`
3. Run the SQL script in `backend/database.sql`
4. Update connection config in backend

## 🚀 Deployment

### Backend Deployment
```bash
# Build and deploy
npm run build
# Upload to server
# Configure environment variables
# Start with PM2 or similar
```

### Frontend Deployment
```bash
npm run build
# Upload build folder to web server
# Configure nginx/apache for SPA routing
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**yunidiniati404-cpu**
- GitHub: [@yunidiniati404-cpu](https://github.com/yunidiniati404-cpu)
- Email: yunidiniati404@gmail.com

## 🙏 Acknowledgments

- React.js documentation
- Node.js community
- MySQL documentation
- Open source contributors

---

⭐ **Star this repo** if you found it helpful!