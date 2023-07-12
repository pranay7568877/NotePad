const express = require('express');
const multer = require('multer');
const mongodb = require('mongodb');

const app = express();
const port = 3000;

// Set up MongoDB connection
const MongoClient = mongodb.MongoClient;
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'ticket_tracker';

let db;

MongoClient.connect(mongoURL, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
  } else {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  }
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// API endpoint for adding a ticket
app.post('/api/tickets', upload.single('file'), (req, res) => {
  const { ticketNumber, ticketDetails } = req.body;
  const ticket = {
    ticketNumber,
    ticketDetails,
    image: req.file ? req.file.filename : '',
  };

  db.collection('tickets').insertOne(ticket, (err, result) => {
    if (err) {
      console.error('Error adding ticket to database:', err);
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send('Ticket added successfully');
    }
  });
});

// API endpoint for retrieving all tickets
app.get('/api/tickets', (req, res) => {
  db.collection('tickets')
    .find()
    .toArray((err, tickets) => {
      if (err) {
        console.error('Error retrieving tickets from database:', err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).json(tickets);
      }
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
