// src/pages/CreatePost.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import Header from "../components/Header";  // 引入 Header 组件
import "./CreatePost.css";  // 保证样式一致

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    author_id: ""
  });

  const [authors, setAuthors] = useState([]);
  const editorRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/author") // 确保后端有这个接口
      .then(res => res.json())
      .then(data => setAuthors(data))
      .catch(err => console.error("Failed to fetch authors:", err));
  }, []);

  useEffect(() => {
    if (editorRef.current) return;
    const easyMDE = new EasyMDE({
      element: document.getElementById("markdown-editor"),
      spellChecker: false,
      minHeight: "300px",
      autofocus: true,
      autosave: { enabled: false },
    });

    editorRef.current = easyMDE;

    easyMDE.codemirror.on("change", () => {
      setForm(prev => ({
        ...prev,
        content: easyMDE.value()
      }));
    });
  }, []);

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await fetch("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    navigate("/");
  };

  return (
    <div>
      <Header /> {/* 引入 Header */}
      <main className="container">
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Summary</label>
          <input
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <label htmlFor="author">Author</label>
          <select
            id="author"
            name="author_id"
            value={form.author_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Author --</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>

          <label htmlFor="markdown-editor">Content</label>
          <textarea id="markdown-editor" />

          <button type="submit">Create Post</button>
        </form>
      </main>
    </div>
  );
}
