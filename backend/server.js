import express from 'express';
import path from 'path';
import data from './data';
//import dotenv from 'dotenv';
import config from './config';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute';
import bodyParser from 'body-parser';
import productRoute from './routes/productRoute';
import orderRoute from './routes/orderRoute';
import uploadRoute from './routes/uploadRoute';

const mongodbUrl = config.MONGODB_URL;
//Connect to MongoDB
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((ress)=> {console.log("db connected success")})
  .catch((error) => {console.log("lalalalalalalal")});

/*to create server, use express module*/ 
const app = express();

app.use(bodyParser.json());

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use('/api/orders', orderRoute);
app.use("/api/uploads", uploadRoute);

//config server to serve files inside uploads folder
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));

app.listen(config.PORT, () => {console.log("Server started at http://localhost:5000")});