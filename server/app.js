const express = require('express');
const path = require('path');
const blogRoutes = require('./routes/blogRoutes');
const methodOverride = require('method-override');
const cors = require('cors'); // 导入 CORS 库

const app = express();

// Middleware
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(express.json()); // For parsing application/json bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (e.g. CSS files)

app.use(cors()); 

// Serve React app (production build)
if (process.env.NODE_ENV === 'production') {
  // Serve the production build of the React app
  app.use(express.static(path.join(__dirname, 'client', 'dist')));

  // Serve index.html for any other routes that are not API
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}

// API routes
app.use('/api', blogRoutes); // Add `/api` prefix for API routes


app.use('/api', require('./routes/blogRoutes'));


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  });
}


// Error handling
app.use(function (error, req, res, next) {
  // Default error handling function
  console.log(error);
  res.status(500).json({ error: 'Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
