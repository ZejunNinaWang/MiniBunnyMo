import express from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto'; //to generate file name
import GridFsStorage from 'multer-gridfs-storage';
import config from '../config';


// //create storage with Date.now().jpg as filename in /uploads folers
// const storage = multer.diskStorage({
//     destination(req, file, callback){
//         callback(null, 'uploads/');
//     },
//     filename(req, file, callback){
//         callback(null, Date.now() + '.jpg');
//     }
// })

// //create upload middleware
// const upload = multer({storage});


const mongodbUrl = config.MONGODB_URL;
//create storage and upload variable for storing product image
const storage = new GridFsStorage({
    url: mongodbUrl,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        //crypto.randomBytes is used to generate names
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
const upload = multer({ storage });







/* For uploading and storaing avatars */
const storageAvatar = new GridFsStorage({
  url: mongodbUrl,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      //crypto.randomBytes is used to generate names
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'avatars'
        };
        resolve(fileInfo);
      });
    });
  }
});
const uploadAvatar = multer({storage: storageAvatar});

const uploadRoute = express.Router();

//upload.single('image') allows only 1 file to be uploaded, the file name is 'image' from the frontend
uploadRoute.post('/', upload.single('image'), (req, res)=>{
  res.json({file: req.file});
})

uploadRoute.post('/avatars', uploadAvatar.single('image'), (req, res) => {
  res.json({file: req.file})
})



export default uploadRoute;