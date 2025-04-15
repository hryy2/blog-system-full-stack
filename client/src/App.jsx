import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostList from "./pages/PostList";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import PostDetail from "./pages/PostDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/posts/:id" element={<PostDetail />} />
<Route path="/posts/:id/edit" element={<EditPost />} />
<Route path="/posts/:id/delete" element={<PostList />} />
      </Routes>
    </Router>
  );
}

export default App;
