import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

app.use(express.json({ limit: '10mb' })); // Add size limit for security
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.get("/", (req, res) => {
  res.json({ 
    message: "Hello World!", 
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
  });
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;