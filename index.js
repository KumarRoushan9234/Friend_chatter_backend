import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/authRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json()); //to extract the json in this app
app.use(cookieParser()); //allows us to use cookie parser

// app.use(cors());

// configured CORS
const corsOptions = {
  origin: 'http://localhost:3000', 
  // Allow frontend origin
  credentials: true, 
  // Allow cookies and other credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], 
  // Allowed headers
};
app.use(cors(corsOptions));


connectDB();

app.use('/api/auth', userRoutes);
app.use('/api/message', messageRoutes);

app.get("/", (req, res) => {
  console.log("Home");
  res.status(200).json({ message: "Welcome to the Chat App API!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);