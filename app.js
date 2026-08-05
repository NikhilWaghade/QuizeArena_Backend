const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();

// Enable global middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);

module.exports = app;
