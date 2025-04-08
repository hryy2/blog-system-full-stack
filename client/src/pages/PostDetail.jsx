// pages/PostDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../components/Header";  // 引入 Header 组件
import './PostDetail.css';

export default function PostDetail() {
  const { id } = useParams();  // 获取文章 ID
  const [post, setPost] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    fetch(`http://localhost:3000/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data))
      .catch(err => console.error("Failed to fetch post:", err));
  }, [id]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts(posts.filter(post => post.id !== id)); // 本地删除列表中的 post
      } else {
        console.error("Delete failed");
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  if (!post) {
    return <p>Loading...</p>;
  }

  return (
    <div data-theme={theme}>
      <Header theme={theme} toggleTheme={toggleTheme} /> {/* 使用 Header 组件 */}

      <main>
        <article className="post-detail">
          <h2>{post.title}</h2>
          <div className="meta">
            By {post.author_name || "Anonymous"} | 
            {new Date(post.created_at).toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
          <div className="content" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="actions">
            <Link to={`/posts/${post.id}/edit`} className="edit-btn">Edit</Link>
            <button className="delete-btn" onClick={() => handleDelete(post.id)}>Delete</button>
          </div>
        </article>
      </main>
    </div>
  );
}
