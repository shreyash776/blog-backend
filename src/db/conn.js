const mongoose =require('mongoose');
require('dotenv').config();
const dbUri = process.env.DB_URI??"";
mongoose.connect(dbUri)
.then(()=>console.log("connection is successful"))
.catch((err)=>console.log("no connection", err));
module.exports = mongoose.connection;