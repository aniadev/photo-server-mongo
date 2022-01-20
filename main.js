//=============================================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./config/db');
database.connect();
const app = express();
const port = 9000;
const Photos = require('./Models/Photos');
// multer for multipart-form
const multer = require('multer');
const upload = multer();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    cors: {
      origin: '*',
    },
  })
);
app.get('/photo/:id', (req, res) => {
  Photos.findById(req.params.id)
    .then((photo) => {
      let img = Buffer.from(
        photo.data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''),
        'base64'
      );
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length,
      });
      res.end(img);
    })
    .catch((err) => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
app.get('/api/photo/:id', (req, res) => {
  Photos.findById(req.params.id)
    .then((photo) => {
      res.json({
        success: true,
        message: 'get photo by id',
        name: photo.name,
        data: photo.data,
      });
    })
    .catch((err) => {
      res.json({
        success: false,
        message: err.message,
      });
    });
});
app.post('/upload', upload.none(), async (req, res) => {
  // console.log(req.body);
  let imgData = req.body;
  // let imgData;
  if (imgData) {
    let newPhoto = new Photos(imgData);
    newPhoto
      .save()
      .then((result) => {
        console.log('Image saved');
        res.json({
          success: true,
          message: 'upload successful',
          imgId: result._id,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({
          success: false,
          message: err.message,
        });
      });
  }
});

// app.use(express.static(__dirname + '/public'));
app.get('/upload', (req, res) => {
  res.sendFile('./public/index.html', { root: __dirname });
});
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Photo Server Api',
    api: {
      upload: '/upload',
      view: '/photo/:id',
      getRawData: '/api/photo/:id',
    },
  });
});

app.listen(process.env.PORT || port, () =>
  console.log(`App listening on port ${process.env.PORT || port}!`)
);
