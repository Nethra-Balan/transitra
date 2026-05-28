import mongoose from 'mongoose';
import app from './src/app.js';
import { config } from './src/config/index.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('✓ MongoDB connected successfully');

    // Start Express server
    const PORT = config.server.port;
    app.listen(PORT, () => {
      console.log(`✓ Transitra backend server running on port ${PORT}`);
      console.log(`Environment: ${config.server.nodeEnv}`);
      console.log(`API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
