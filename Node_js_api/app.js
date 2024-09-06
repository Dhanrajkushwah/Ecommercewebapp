const express = require('express');
const app = express();
const port = 5000;
const router = require('./routes'); // Ensure this is the correct path
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files (uploads folder)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', router);

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://Contas:nuouP4MyDhH0q3E4@cluster0.gkkofhc.mongodb.net/EcomerceData3', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
