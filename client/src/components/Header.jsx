// components/Header.jsx
import { Link } from "react-router-dom";

export default function Header({ theme, toggleTheme }) {
  return (
    <header>
      <h1>MyBlog</h1>
      <nav>
        <Link to="/posts">All Posts</Link>
        <Link to="/posts/create">Create Post</Link>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </nav>
    </header>
  );
}
