const express = require('express');
const router = express.Router();
const db = require('../database/blog');

// Redirect root to posts list
router.get('/', (req, res) => {
   res.redirect('/posts');
});

// List all posts
router.get('/posts', async (req, res) => {
   const [posts] = await db.query(
      'SELECT posts.*, author.name FROM posts INNER JOIN author ON posts.author_id = author.id'
   );
   console.log(posts);
   res.render('posts-list.ejs', { posts });
});

// Render new post form
router.get('/new-post', async (req, res) => {
   const [authors] = await db.query('SELECT * FROM author');
   res.render('create-post.ejs', { authors });
});

// Create new post
router.post('/posts', async (req, res) => {
   const data = [
      req.body.title,
      req.body.summary,       // description
      req.body.content,       // content
      req.body.author         // author_id
   ];
   await db.query(
      'INSERT INTO posts (title, description, content, author_id) VALUES (?)',
      [data]
   );
   res.redirect('/posts');
});

// View a single post
router.get('/posts/:id', async (req, res) => {
   const postId = req.params.id;
   const query = `
        SELECT posts.*, author.name AS author_name, author.email AS author_email 
        FROM posts 
        INNER JOIN author ON posts.author_id = author.id 
        WHERE posts.id = ?
    `;
   const [post] = await db.query(query, [postId]);
   if (!post || post.length === 0) {
      return res.status(404).render('404');
   }

   const { marked } = require('marked'); // 顶部引入 marked

   const postdata = {
      ...post[0],
      content: marked.parse(post[0].content), // 将 Markdown 转成 HTML
      date: post[0].date ? post[0].date.toISOString() : null,
      humanreadabledate: post[0].created_at.toLocaleDateString('en-US', {
         weekday: 'long',
         month: 'long',
         year: 'numeric',
         day: 'numeric'
      })

   };

   res.render('post-detail.ejs', { post: postdata });
});

// Render edit post form
router.get('/posts/:id/edit', async (req, res) => {
   const query = `SELECT * FROM posts WHERE id = ?`;
   const [post] = await db.query(query, [req.params.id]);
   if (!post || post.length === 0) {
      return res.status(404).render('404');
   }
   res.render('update-post.ejs', { post: post[0] });
});

// Update post
router.post('/posts/:id/edit', async (req, res) => {
   const query = `
        UPDATE posts 
        SET title = ?, description = ?, content = ? 
        WHERE id = ?
    `;
   await db.query(query, [
      req.body.title,
      req.body.summary,
      req.body.content,
      req.params.id
   ]);
   res.redirect('/posts');
});

// Delete post
router.post('/posts/:id/delete', async (req, res) => {
   const query = `DELETE FROM posts WHERE id = ?`;
   await db.query(query, [req.params.id]);
   res.redirect('/posts');
});

module.exports = router;
