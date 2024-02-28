// server.js

const path = require('path');
//gets location of path 
const { connectToDatabase, closeDatabaseConnection } = require(path.join(__dirname, 'db'));

const express = require('express');
const app = express();

app.post('/submit-survey', async (req, res) => {
    // Handle form submission and interact with the database here
    //POST request with fields we want to store in the database in requets body
    res.send('Survey submitted successfully!');
});


// Connect to MongoDB when the server starts
connectToDatabase();

// Close MongoDB connection when the server is stopped
process.on('SIGINT', async () => {
    await closeDatabaseConnection();
    process.exit();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

