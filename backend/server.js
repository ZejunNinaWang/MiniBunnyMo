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

const mongodbUrl = config.MONGODB_URL;
let gfs;
//Connect to MongoDB
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(()=> {
    console.log("db connected success");
  })
  .catch(() => {console.log("lalalalalalalal")});

mongoose.connection.on('connected', () => {
    console.log('Connection opened');
    //Init stream
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
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

app.get('/api/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});

//config server to serve files inside uploads folder
// app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));

app.use(express.static(path.join(__dirname, '/../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
});

app.listen(config.PORT, () => {console.log("Server started at http://localhost:5000")});