import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EasyMDE from "easymde";
import "easymde/dist/easymde.min.css";
import Header from '../components/Header';  // 导入封装的 Header 组件
import './EditPost.css';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    description: "",
    content: ""
  });

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(res => res.json())
      .then(data => setPost(data));
  }, [id]);

  useEffect(() => {
    if (post.content !== "") {
      new EasyMDE({
        element: document.getElementById("content"),
        spellChecker: false,
        initialValue: post.content,
        toolbar: [
          "bold", "italic", "heading", "|",
          "quote", "unordered-list", "ordered-list", "|",
          "link", "image", "|", "preview", "side-by-side", "fullscreen", "|", "guide"
        ]
      });
    }
  }, [post.content]);
  
  function handleChange(e) {
    const { name, value } = e.target;
    setPost(prev => ({ ...prev, [name]: value || "" }));  // 防止值为 null 或 undefined
  }
  

  function handleSubmit(e) {
    e.preventDefault();
    const contentValue = document.querySelector("#content").value;
     // 检查是否正确传递了 summary
  console.log(post);  // 确保 summary 在这里有正确的值
    fetch(`/api/posts/${id}/edit`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...post,
        content: contentValue
      })
    }).then(() => navigate("/posts"));
  }

  return (
    <div>
      {/* 使用 Header 组件 */}
      <Header />

      <main className="container">
        <h2>Edit Post</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" value={post.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Summary</label>
            <input 
              type="text" 
              name="description" 
              value={post.description || ""}  // 确保 description 不是 null 或 undefined
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea id="content" name="content" />
          </div>
          <button type="submit" className="submit-btn">Update Post</button>
        </form>
      </main>
    </div>
  );
}
