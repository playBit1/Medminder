const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const medManagerRoutes = require('./routes/medManagerRoutes');
const mongoose = require('mongoose');


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set ('views', path.join(__dirname, 'public', 'views'));

mongoose.connect('mongodb+srv://rootuser:WZqD1gPKvGm1THS9@restapi.ipm2yta.mongodb.net/RestAPI', {});

// Route to render the index.ejs on the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // You need to adjust the data passed to the template as per your actual data handling
});
// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/medManager', medManagerRoutes);

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
