const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: 'https://todo-app-frontend-ssrp.onrender.com', // frontend origin
    credentials: true,               // allow cookies/headers
  })
);

// Middleware
app.use(express.json());

// Session Middleware (for Google OAuth)
app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,               
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);

//  Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(' MongoDB Connected'))
  .catch((err) => console.error(' MongoDB Connection Error:', err));

//  Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/todos', require('./routes/todo'));
app.use('/api/shared-tasks', require('./routes/sharedTask'));
app.use('/api/share', require('./routes/share'));

// Default Route
app.get('/', (req, res) => {
  res.send('Server is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
