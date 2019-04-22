const mongoose = require("mongoose"),
    DB_URL = "mongodb://localhost:27017/Blueprint";

//connect
mongoose.connect(DB_URL, { useNewUrlParser: true});

//success
mongoose.connection.on("connected", function(){
    console.log("Mongoose connection open to " + DB_URL);
})

//error
mongoose.connection.on("error", function(err){
    console.log("Mongoose connection error: " + err);
})

//disconnected
mongoose.connection.on("disconnected", function(){
    console.log("Mongoose connection disconnected");
})

module.exports = {mongoose};