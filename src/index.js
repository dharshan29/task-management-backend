'use strict';
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
// Load environment variables from .env file
dotenv.config();

require("./config/mongoose");

const app = express();
const PORT = process.env.PORT || 5200;
const PATH_NAME = process.env.PATH_NAME || "/api";

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.options('*', cors());
app.use(bodyParser.json());

// Routes

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');


app.use(PATH_NAME, authRoutes);
app.use(PATH_NAME, taskRoutes);

// GET API
app.get('/', (req, res) => {
    res.send('This is a GET API');
  });
  
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});