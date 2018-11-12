var express = require('express')
var app = express();
var path = require('path');
var api = require('./api');



app.set('view engine','jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(api);


app.listen(1339);