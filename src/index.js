// import express package(commonJS syntax)
const express = require('express')
const bodyParser = require('body-parser');
const route = require('./routes/route');
const  mongoose = require('mongoose');
const ejs = require('ejs')
const path = require('path')
// instatiate the express app  
const app = express()
app.use(bodyParser.json());

app.engine('html' , ejs.renderFile)
app.set('view engine' , 'html')
app.set('views' , path.join(__dirname , '../views'))
   
mongoose.connect("mongodb+srv://Amitmaz96:FuYghhKoFzigilxK@cluster1.mdpsbcj.mongodb.net/urlDb")
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
   console.log('Express app running on port ' + (process.env.PORT || 3000))
}) 