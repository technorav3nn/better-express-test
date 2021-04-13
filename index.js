const express = require('express')
const fs = require('fs')

const app = express();
  
// Defining port number
const PORT = 3000;                  

// Function to serve all static files
// inside public directory.
app.use(express.static('public'));  
app.use('/images', express.static('images')); 
  
app.get('/', function(req, res){
  let dir1 = 'images'
  let random = Math.floor(Math.random() * 3)
  
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl + 'images/'+random+'.jpg'

  console.log(fullUrl)
  res.send({ link: `${fullUrl}`
  });


})  
// Server setup
app.listen(PORT, () => {
  console.log(`Running server on PORT ${PORT}...`);
})