// blog.js（改为连接本地数据库）
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',           // 默认 XAMPP 用户名
  password: '',           // empty if no password
  database: 'blog_app',   // database name
  port: 3306,         
});

module.exports = pool;
