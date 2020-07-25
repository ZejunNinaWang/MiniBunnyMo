"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _data = _interopRequireDefault(require("./data"));

var _methodOverride = _interopRequireDefault(require("method-override"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _gridfsStream = _interopRequireDefault(require("gridfs-stream"));

var _config = _interopRequireDefault(require("./config"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _userRoute = _interopRequireDefault(require("./routes/userRoute"));

var _productRoute = _interopRequireDefault(require("./routes/productRoute"));

var _orderRoute = _interopRequireDefault(require("./routes/orderRoute"));

var _uploadRoute = _interopRequireDefault(require("./routes/uploadRoute"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//import dotenv from 'dotenv';
var mongodbUrl = _config["default"].MONGODB_URL;
var gfs; //Connect to MongoDB

_mongoose["default"].connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(function () {
  console.log("db connected success");
})["catch"](function () {
  console.log("lalalalalalalal");
});

_mongoose["default"].connection.on('connected', function () {
  console.log('Connection opened'); //Init stream

  gfs = (0, _gridfsStream["default"])(_mongoose["default"].connection.db, _mongoose["default"].mongo);
  gfs.collection('uploads');
}); // let gfs;
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


var app = (0, _express["default"])();
/*Middleware*/

app.use(_bodyParser["default"].json());
app.use((0, _methodOverride["default"])('_method')); //use query string to create form in order to make delete request

app.use("/api/users", _userRoute["default"]);
app.use("/api/products", _productRoute["default"]);
app.use('/api/orders', _orderRoute["default"]);
app.use("/api/uploads", _uploadRoute["default"]);
app.get('/api/image/:filename', function (req, res) {
  gfs.files.findOne({
    filename: req.params.filename
  }, function (err, file) {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    } // Check if image


    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      var readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
}); //config server to serve files inside uploads folder
// app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));

app.listen(_config["default"].PORT, function () {
  console.log("Server started at http://localhost:5000");
});