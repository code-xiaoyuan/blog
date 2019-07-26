var express = require('express');
var bodyParser = require("body-parser");

var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));


var indexRouter = require('./routes/index');
app.use(indexRouter);


app.listen(3000,function(){
    console.log('node running');
});