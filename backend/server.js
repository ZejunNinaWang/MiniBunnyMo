import express from 'express';
import data from './data';
import dotenv from 'dotenv';
import config from './config';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute';
import bodyParser from 'body-parser';


dotenv.config();
const mongodbUrl = config.MONGODB_URL;
//Connect to MongoDB
mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).catch(error => console.log(error.reason));

/*to create server, use express module*/ 
const app = express();

app.use(bodyParser.json());
//The url fro userRoute is the concat: /api/users/createadmin
app.use("/api/users", userRoute);
//handle get request from at http://localhost:5000/api/products 
app.get("/api/products", (req, res) => {
    res.send(data.products);
});

app.get("/api/products/:id", (req, res) => {
    const productId = req.params.id;
    const product  = data.products.find( x => x._id === productId);
    if(product){
        res.send(product);
    }
    else
    {
        res.status(404).send({msg:"Product Not Found."});
    }
    
});

app.listen(5000, () => {console.log("Server started at http://localhost:5000")});