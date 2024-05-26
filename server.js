const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const cookieParser = require('cookie-parser');
const { runDB } = require('./dbConnection');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

// Routes
const medManagerRoutes = require('./routes/medManagerRoutes');
const symptomCheckerRoutes = require('./routes/symptom_checker_routes');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const dashboardRoutes = require('./routes/dashboard_routes');
const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');

app.use('/medManager', medManagerRoutes);

app.use('/symptomChecker', symptomCheckerRoutes);

app.use('/auth', authRoutes);

app.use('/user', userRoutes);

app.use('/dashboard', dashboardRoutes);

app.use('/forgotPassword', forgotPasswordRoutes);

server.listen(3000, () => {
  runDB();
  console.log('Server running on http://localhost:3000');
});
