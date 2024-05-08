const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to render the index.ejs on the root URL
app.get('/', (req, res) => {
    res.render('index', { medications: [] }); // You need to adjust the data passed to the template as per your actual data handling
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const medManagerRoutes = require('./routes/medManagerRoutes');
app.use('/medManager', medManagerRoutes);

server.listen(3000, () => console.log('Server running on http://localhost:3000'));