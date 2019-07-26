const mongoose = require("./connection.js");

const schema = new mongoose.Schema({
    username:String,
    age:Number,
    tel:String,
    gender:String,
    des:String,
    email:String
});


const Student = mongoose.model("students",schema);

module.exports = Student;
