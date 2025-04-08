// blog.js（改为连接本地数据库）
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',           // 默认 XAMPP 用户名
  password: '',           // 如果你没设置密码就留空
  database: 'blog_app',   // 你要创建的数据库名字
  port: 3306,             // 默认端口
});

module.exports = pool;
