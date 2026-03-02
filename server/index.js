require('dotenv').config();
const express = require('express');
const corsMiddleware = require('./middleware/cors');
const plaidRoutes = require('./routes/plaid');
const calendarRoutes = require('./routes/google-calendar');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(corsMiddleware);
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/plaid', plaidRoutes);
app.use('/api/calendar', calendarRoutes);

app.listen(PORT, () => {
  console.log(`Life OS Server running on port ${PORT}`);
});
