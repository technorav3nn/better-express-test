const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
  
// Defining port number
const PORT = process.env.PORT                  

// Function to serve all static files
// inside public directory.
app.use(express.static('public'));  
app.use('/images', express.static('images')); 
  
app.get('/', function(req, res){
  let dir1 = 'images'
  let random = Math.floor(Math.random() * 3)
  
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + 'images/'+random+'.jpg'
  //first commit
  console.log(fullUrl)
  res.send({ link: `${fullUrl}`
  });
})  

app.use(function (req,res,next){
	res.status(404).sendFile(path.join(__dirname + '/index.html'))
});

// Server setup
app.listen(PORT, () => {
  console.log(`Running server on PORT ${PORT}...`);
})