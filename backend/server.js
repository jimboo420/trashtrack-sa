const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import route modules
const usersRoutes = require('./routes/users');
const pickupSchedulesRoutes = require('./routes/pickupSchedules');
const educationalContentRoutes = require('./routes/educationalContent');
const reportsRoutes = require('./routes/reports');
const reportSchedulesRoutes = require('./routes/reportSchedules');
const { seedDatabase } = require('./seed');

// Mount routes
app.use('/api/users', usersRoutes);
app.use('/api/pickup-schedules', pickupSchedulesRoutes);
app.use('/api/educational-content', educationalContentRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/report-schedules', reportSchedulesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Database seeding endpoint (development only)
app.post('/api/seed', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ error: 'Seeding not allowed in production' });
    }
    
    console.log('🌱 Starting database seeding via API...');
    await seedDatabase();
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    res.status(500).json({ error: 'Failed to seed database', details: error.message });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'TrashTrack API Server',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      pickupSchedules: '/api/pickup-schedules',
      educationalContent: '/api/educational-content',
      reports: '/api/reports',
      reportSchedules: '/api/report-schedules',
      health: '/health',
      seed: 'POST /api/seed (development only)'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TrashTrack API server running on port ${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`❤️  Health check at http://localhost:${PORT}/health`);
  console.log(`🌱 Seed endpoint at http://localhost:${PORT}/api/seed (POST, development only)`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;