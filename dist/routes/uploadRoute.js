"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _multer = _interopRequireDefault(require("multer"));

var _path = _interopRequireDefault(require("path"));

var _crypto = _interopRequireDefault(require("crypto"));

var _multerGridfsStorage = _interopRequireDefault(require("multer-gridfs-storage"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//to generate file name
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
var mongodbUrl = _config["default"].MONGODB_URL; //create storage and upload variable

var storage = new _multerGridfsStorage["default"]({
  url: mongodbUrl,
  file: function file(req, _file) {
    return new Promise(function (resolve, reject) {
      //crypto.randomBytes is used to generate names
      _crypto["default"].randomBytes(16, function (err, buf) {
        if (err) {
          return reject(err);
        }

        var filename = buf.toString('hex') + _path["default"].extname(_file.originalname);

        var fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
var upload = (0, _multer["default"])({
  storage: storage
});

var uploadRoute = _express["default"].Router(); //upload.single('image') allows only 1 file to be uploaded, the file name is 'image' from the frontend


uploadRoute.post('/', upload.single('image'), function (req, res) {
  res.json({
    file: req.file
  });
});
var _default = uploadRoute;
exports["default"] = _default;