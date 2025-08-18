const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || true, // allow all in dev
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// --- health route (for quick testing)(yeh just quick testing ke liye hi)
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});


// --- (placeholder) API mount points — we’ll add files later
// app.use('/auth', require('./routes/authRoutes'));
app.use('/problems', require('./routes/problemRoutes'));
app.use('/attempts', require('./routes/attemptRoutes'));
app.use('/hints', require('./routes/hintRoutes'));
app.use('/code', require('./routes/codeRoutes'));
// app.use('/assist', require('./routes/assistRoutes'));
// app.use('/analytics', require('./routes/analyticsRoutes'));

// --- 404 + error handlers
app.use(notFound);
app.use(errorHandler);

// --- start server + connect DB
const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`[API] Listening on http://localhost:${PORT}`);
  await connectDB(process.env.MONGODB_URI);
});