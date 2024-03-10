const mongoose =require('mongoose');
require('dotenv').config();
const db = process.env.DATA_BASE ;
console.log(db)
mongoose.connect(`mongodb://localhost:27017/${db}`)
.then(()=>console.log("connection is successful"))
.catch((err)=>console.log("no connection"));
module.exports = mongoose.connection;