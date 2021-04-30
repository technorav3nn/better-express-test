// Requiring Modules

const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const translate = require('@vitalets/google-translate-api');
const rateLimit = require("express-rate-limit");
// app.set('trust proxy', 1);

const reqobj = {
  rateLimit: `You have reached the limit of requests (3 max every 5 seconds)`
}

const limiter = rateLimit({
  windowMs: 5000, // 15 minutes
  max: 3, // limit each IP to 100 requests per windowMs
  message:
    JSON.stringify(reqobj)
});

const app = express();
const PORT = 3000;

app.use(limiter);
app.use(express.static('public'));app.use('/images', express.static('images'));

app.set('json spaces', 2)
const uploadFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed! nuk if this is you my guy chill pls.................'));
  }
  cb(null, true);
}


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/upload');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    },
    
});

const upload = multer({
  storage: storage,
  fileFilter: uploadFilter
})
const uploadDir = fs.readdirSync(__dirname+'/public/images/upload')


app.get('/upload', (req, res) => {
  const key = req.query.key
  const apikeys = [
    'ab2x',
    '23sx',
    '88jx',
    '1xvx',
    'whitelistKey1',
  ]

  if(!apikeys.includes(key) || !key){
    res.send({
      status: "You need a correct api key"
    })
    return
  }
  res.sendFile(__dirname + '/upload.html');
})

const toobj = {
  status: "complete"
}

app.post('/uploadcomplete', upload.single('file'), (req, res) => {
res.send({
  status: "complete"
})
})

app.get('/uploads', (req, res) => {
  res.send({
    stupid: "its /uploads/all or /uploads/random you doofus",
  })
})

app.get('/uploads/:option', function(req, res){

  const randomOptionTest = [
    'random',
    'randomized',
    'rand',
    'r'
  ]
  const listOptionTest = [
    'all',
    'listall',
    'list',
    'every',
    'array',
    'everything',
    'entire',
    'folder'
  ]

  if(randomOptionTest.includes(req.params.option)){

  const randomFrom = Math.floor(Math.random() * uploadDir.length)
  const randomImage = uploadDir[randomFrom]
  const fullImageUrl = req.protocol + '://' + req.get('host') + '/images/upload/'+randomImage

  res.send({
    image: `${fullImageUrl}`
  })
  } else if(listOptionTest.includes(req.params.option)){
    const uploadUpdateDir = fs.readdirSync(__dirname+'/public/images/upload')
    const allofImages = req.protocol + '://' + req.get('host') + '/images/upload/'
    const pushedArr = []
    const testbruh = uploadUpdateDir.forEach(element => {
      pushedArr.push(allofImages+element)
    })

    res.send({
      images: pushedArr
    })
 
  } else {
    res.send({
      error: {
        type: "invalid option",
        status: "400",
        tip: "this means you chose an incorrect parameter. do /random or /all",
      }
    })
  }
})

// "sogga" endpoint 1
app.get('/sogga', function(req, res){
  let dir1 = 'images'
  let random = Math.floor(Math.random() * 11)

  if ( random == 0) random++
  
  let fullUrl = req.protocol + '://' + req.get('host') + '/images/sogga/'+random+'.jpg'

  console.log(fullUrl)
  res.send({ soggaImages: `${fullUrl}`
  });

})  
// "floppa" endpoint 2
app.get('/floppa', (req, res) => {
  let random2 = Math.floor(Math.random() * 3)
  if(random2 == 0 ) random2++

  let dir2 = req.protocol + '://' + req.get('host') +'/images/floppa/'+random2+'.jpg'
  res.send({
    floppaImages: `${dir2}`
  })
})
// starter endpoint
app.get('/', function(req, res){
  res.send({
    warn: "/translate?lang=es&q=hello, /sogga, /floppa"
  })
});




// translate using "/api" endpoint

app.get('/api/translate', async (req, res) => {

  let lang = req.query.lang
  let q = req.query.q
 translate(q, {to: lang}).then(s => {
    res.send({
      translatedText: {
        text: s.text,
        fromLanguage: s.from.language.iso,
        toLanguage: lang,  
        }
    })
  }).catch(err => res.send({error: `Error occured, most likely invalid language. Error: ${err}`}))
})

// 404 Not Found
app.use(function (req,res,next){
	res.status(404).sendFile(path.join(__dirname + '/index.html'))
});

// 500 Internal Server
app.use(function (req,res,next){
  res.status(500).send({
      "Internal Server Error":"500",
      "Debug Info:": {
        "USER-AGENT":`${req.get('user-agent')}`,
        "PATH": `${req.path}`,
        "METHOD": `${req.method}`,
    }
  })
});

// Server setup
app.listen(PORT, () => {
  console.log(`Running server on PORT ${PORT}...`);
})