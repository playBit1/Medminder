const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to render the index.ejs on the root URL
app.get('/', (req, res) => {
  res.render('index', { medications: [] }); // You need to adjust the data passed to the template as per your actual data handling
});

// Routes
const medManagerRoutes = require('./routes/medManagerRoutes');
const { runDB } = require('./dbConnection');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use('/medManager', medManagerRoutes);

app.use('/auth', authRoutes);

app.use('/user', userRoutes);

server.listen(3000, () => {
  runDB();
  console.log('Server running on http://localhost:3000');
});
