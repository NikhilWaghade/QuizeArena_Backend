const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const teamRoutes = require('./routes/teamRoutes');
const competitionRoutes = require('./routes/competitionRoutes');
const questionRoutes = require('./routes/questionRoutes');
const hostRoutes = require('./routes/hostRoutes');

const app = express();

// Enable global middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/host', hostRoutes);

module.exports = app;
