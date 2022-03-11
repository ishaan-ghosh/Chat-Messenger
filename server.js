/* Author: Ishaan Ghosh
File: translate.js
Course: CSc 337 Fall 21
Desc: This is the JS file responsible for setting up a the server-side client of the Chatty app.
      It utilizes express for server setup and MongoDB for database work (saving chats).*/

// Importing helper libraries for database and server setup
const mongoose = require('mongoose');
const express = require('express');

// Starting server
const app = express();

// Connecting to mongoDB Atlas database
const db  = mongoose.connection;
// const mongoDBURL = 'mongodb://127.0.0.1:27017/chatty';
const uri = "mongodb+srv://ish:chattydbpassword@chatty.irxu7.mongodb.net/chatty?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true });
db.once('open', _ => {
    console.log('Database connected:', uri)
  })
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// The schema for messages, each message has a timestamp, the authors alias and the message contents
var Schema = mongoose.Schema;
var mesSchema = new Schema({
  time: String,
  alias: String,
  message: String
});
// Setting up model with collections
var ChatMessage = mongoose.model('ChatMessageCol', mesSchema );

// Serving static wepage
app.use(express.static('public_html'));

// Method that sends a user input message to the database for saving, it is called
// by the client-side code using the URL.
app.post('/chats/post/:alias/:message', (req, res) => {
    res.statusCode = 200;
    var messages = req.params.alias + ": " + req.params.message;
    // Create variable to save current date and time as text
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var now = date+' '+time;
    // Create new message instance and set fields
    const message = new ChatMessage ({
        time: now,
        alias: req.params.alias,
        message: req.params.message
      })
    // Save newly created instance to database
    message.save(function (error) {
        if (error) console.error(error)
      })
    res.end(messages);
});

// Method that retrieves all chats from database, formats them to string and sends it
// as result to request. 
app.get('/chats', (req, res) => {
    res.statusCode = 200;
    messagesText = "";
    // Retrieve chat from database
    var messages = mongoose.model('ChatMessageCol', mesSchema );
    messages.find({}, "time alias message", function (error, result) {
        if (error) {
            console.error(error)
            return;
        } else {
            // From chats array returned by database, cycle through and format
            // data into messagesText string. 
            for (var i in result) {
                messagesText += result[i].alias.bold();
                messagesText += ": ";
                messagesText += result[i].message;
                messagesText += "<br>";
            }
            // Send the resultant string back to where request came from.
            res.end(messagesText);
        }
      });
});

const port = 3000;
app.listen(port, () => {
  console.log('server has started on port ' + port);
});

