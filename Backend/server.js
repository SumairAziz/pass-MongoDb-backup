const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb'); 
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

// Connecting to the MongoDB Client
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectDB();

// App & Database
const dbName = process.env.DB_NAME;
const app = express();
const port =process.env.PORT|| 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Get all the passwords
app.get('/', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.find({}).toArray();
        res.json(findResult);
    } catch (error) {
        res.status(500).send({ success: false, message: 'Error fetching passwords' });
    }
});

// Save a password
app.post('/', async (req, res) => { 
    try {
        const password = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const insertResult = await collection.insertOne(password);
        res.send({ success: true, result: insertResult });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Error saving password' });
    }
});

// Delete a password by id
app.delete('/', async (req, res) => { 
    try {
        const { id } = req.body;
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const deleteResult = await collection.deleteOne({ id });
        res.send({ success: true, result: deleteResult });
    } catch (error) {
        res.status(500).send({ success: false, message: 'Error deleting password' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
