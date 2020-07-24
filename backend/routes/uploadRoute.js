import express from 'express';
import multer from 'multer';

//create storage with Date.now().jpg as filename in /uploads folers
const storage = multer.diskStorage({
    destination(req, file, callback){
        callback(null, 'uploads/');
    },
    filename(req, file, callback){
        callback(null, Date.now() + '.jpg');
    }
})

//create upload middleware
const upload = multer({storage});

const uploadRoute = express.Router();

//upload.single('image') allows only 1 file to be uploaded, the file name is 'image'
uploadRoute.post('/', upload.single('image'), (req, res)=>{
    res.send('/' + req.file.path);
})

export default uploadRoute;