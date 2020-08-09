import express from 'express';
import path from 'path';
import data from './data';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';

import Grid from 'gridfs-stream';
//import dotenv from 'dotenv';
import config from './config';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import orderRoute from './routes/orderRoute';
import uploadRoute from './routes/uploadRoute';
import likeRoute from './routes/likeRoute';

const mongodbUrl = config.MONGODB_URL;
let gfs;//For product images
let gfsAvatars;//For avatar images
//Connect to MongoDB
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(()=> {
    console.log("db connected success");
  })
  .catch(() => {console.log("db connection failed")});

mongoose.connection.on('connected', () => {
    console.log('Connection opened');
    //Init stream
    // gfs = Grid(mongoose.connection.db, mongoose.mongo);
    // gfs.collection('uploads');

    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });

    gfsAvatars = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'avatars'
    });
})

// let gfs;
// //create connection
// const conn = mongoose
//   .createConnection(mongodbUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   // .then(()=> {console.log("db connected success");})
//   // .catch(() => {console.log("lalalalalalalal")});

// conn.once('open', () => {
//     console.log('Connection opened');
//     //Init stream
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('uploads');
// })


/*to create server, use express module*/ 
const app = express();

/*Middleware*/ 
app.use(bodyParser.json());
app.use(methodOverride('_method'));//use query string to create form in order to make delete request

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use('/api/orders', orderRoute);
app.use("/api/uploads", uploadRoute);
app.use('/api/likes', likeRoute);

app.get('/api/image/:filename', (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    // Check if file
    if (!files[0] || files.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png') {
      // Read output to browser
      // const readstream = gfs.createReadStream(file.filename);
      // readstream.pipe(res);
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});


app.get('/api/avatars/:filename', (req, res) => {
  gfsAvatars.find({ filename: req.params.filename }).toArray((err, files) => {
    // Check if file
    if (!files[0] || files.length === 0) {
      return res.status(404).json({
        err: 'No file exist'
      });
    }

    // Check if image
    if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png') {
      gfsAvatars.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

//config server to serve files inside uploads folder
app.use('/models', express.static(path.join(__dirname, '/../models')));
app.use('/masks', express.static(path.join(__dirname, '/../mask_images')));


//Serve static assets if in production
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '/../frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
  });
  
}

app.listen(config.PORT, () => {console.log("Server started at http://localhost:5000")});
// app.listen(9229, () => {console.log("Server started at http://localhost:9229")});