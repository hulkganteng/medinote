const mysql = require('mysql2');
require('dotenv').config();  // Memuat variabel dari file .env

// Membuat koneksi ke database MySQL
const db = mysql.createConnection({
  host: process.env.HOST,       // Menggunakan HOST dari .env
  user: process.env.USER,       // Menggunakan USER dari .env
  password: process.env.PASSWORD, // Menggunakan PASSWORD dari .env
  database: process.env.DATABASE  // Menggunakan DATABASE dari .env
});

// Menghubungkan ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);  // Jika koneksi gagal, keluar dari aplikasi
  }
  console.log('Connected to the database');
});

module.exports = db;
