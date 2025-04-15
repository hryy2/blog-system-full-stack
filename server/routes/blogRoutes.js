const express = require('express');
const router = express.Router();
const db = require('../database/blog');
const { marked } = require('marked');

router.get('/', (req, res) => {
  res.redirect('/posts');
});


// ==============================
// Author 相关接口
// ==============================

// 获取所有作者
router.get('/author', async (req, res) => {
  try {
    const [authors] = await db.query('SELECT * FROM author');
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch authors' });
  }
});

// 获取单个作者
router.get('/api/author/:id', async (req, res) => {
  try {
    const [author] = await db.query('SELECT * FROM author WHERE id = ?', [req.params.id]);
    if (!author || author.length === 0) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(author[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch author' });
  }
});

// 创建新作者
router.post('/api/author', async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Missing name or email' });
    }
    await db.query('INSERT INTO author (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ message: 'Author created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create author' });
  }
});



// API: 获取所有文章
router.get('/posts', async (req, res) => {
  try {
    const [posts] = await db.query(
      'SELECT posts.*, author.name FROM posts INNER JOIN author ON posts.author_id = author.id'
    );
    res.json(posts);  // 返回文章数据给前端
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// API: 获取单篇文章详情
router.get('/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const query = `
      SELECT posts.*, author.name AS author_name, author.email AS author_email
      FROM posts
      INNER JOIN author ON posts.author_id = author.id
      WHERE posts.id = ?
    `;
    const [post] = await db.query(query, [postId]);
    if (!post || post.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const postData = {
      ...post[0],
      // content: marked.parse(post[0].content),  // 将内容转为 HTML
      content: post[0].content, 
      date: post[0].date ? post[0].date.toISOString() : null,
      humanreadabledate: post[0].created_at.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        year: 'numeric',
        day: 'numeric'
      })
    };

    res.json(postData);  // 返回文章详情数据给前端
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post details' });
  }
});

// API: 创建新文章
router.post('/posts', async (req, res) => {
  try {
    const { title, description, content, author_id } = req.body;
    const data = [title, description, content, author_id];
    await db.query(
      'INSERT INTO posts (title, description, content, author_id) VALUES (?)',
      [data]
    );
    res.status(201).json({ message: 'Post created' });  // 返回创建成功的响应
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// API: 更新文章
router.put('/posts/:id/edit', async (req, res) => {
  try {
    const { title, description, content } = req.body;
    await db.query(
      'UPDATE posts SET title = ?, description = ?, content = ? WHERE id = ?',
      [title, description, content, req.params.id]
    );
    res.json({ message: 'Post updated' });  // 返回更新成功的响应
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// API: 删除文章
router.delete('/posts/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post deleted' });  // 返回删除成功的响应
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// ==============================
// RESTful API 接口
// ==============================

// 获取所有文章
router.get('/api/posts', async (req, res) => {
  try {
    const [posts] = await db.query('SELECT * FROM posts');
    res.json(posts);  // 返回文章列表给前端
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// 获取单篇文章
router.get('/api/posts/:id', async (req, res) => {
  try {
    const [post] = await db.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (!post || post.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post[0]);  // 返回单篇文章的数据
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// 创建新文章
router.post('/api/posts', async (req, res) => {
  try {
    const { title, description, content, author_id } = req.body;
    await db.query(
      'INSERT INTO posts (title, description, content, author_id) VALUES (?, ?, ?, ?)',
      [title, description, content, author_id]
    );
    res.status(201).json({ message: 'Post created' });  // 返回成功响应
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// 更新文章
router.put('/api/posts/:id/edit', async (req, res) => {
  try {
    const { title, description, content } = req.body;
    await db.query(
      'UPDATE posts SET title = ?, description = ?, content = ? WHERE id = ?',
      [title, description, content, req.params.id]
    );
    res.json({ message: 'Post updated' });  // 返回更新成功的响应
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// 删除文章
router.delete('/api/posts/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post deleted' });  // 返回删除成功的响应
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

module.exports = router;
