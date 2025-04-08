// pages/PostList.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header"; // 引入 Header 组件
import './PostList.css';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    fetch("http://localhost:3000/api/posts")
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Failed to fetch posts:", err));
  }, []);

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


  return (
    <div data-theme={theme}>
      <Header theme={theme} toggleTheme={toggleTheme} /> {/* 使用 Header 组件 */}

      <main>
        <h2>All Blog Posts</h2>
        {posts.length === 0 ? (
          <p className="empty">No blog posts found.</p>
        ) : (
          posts.map(post => (
            <div className="post-card" key={post.id}>
              <h3>{post.title}</h3>
              <div className="meta">
                By {post.name || "Anonymous"} |
                {new Date(post.created_at).toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
              <p className="description">
                {post.description && post.description.length > 0 ?
                  (post.description.length > 250 ? post.description.substring(0, 250) + '...' : post.description)
                  : <em>No summary available.</em>
                }
              </p>
              <div className="post-actions">
                <Link to={`/posts/${post.id}`}>View</Link>
                <Link to={`/posts/${post.id}/edit`}>Edit</Link>
                <button className="delete-btn" onClick={() => handleDelete(post.id)}>Delete</button>
              </div>

            </div>
          ))
        )}
      </main>
    </div>
  );
}
