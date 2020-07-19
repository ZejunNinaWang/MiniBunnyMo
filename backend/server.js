import express from 'express';
//import path from 'path';
import data from './data';
//import dotenv from 'dotenv';
import config from './config';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute';
import bodyParser from 'body-parser';
import productRoute from './routes/productRoute';

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
//The url fro userRoute is the concat: /api/users/createadmin
// app.get("/api/users/createadmin", async (req, res) => {
//     try {
//         console.log("0000000000");
//         const user = new User({
//             name: 'Zejun',
//             email: 'wangzejunnina@gmail.com',
//             password: '1234',
//             isAdmin: true
//         });
        
//         console.log("11111111");
//         let newUser = await user.save();
//         console.log("2222222");
//         res.send({msg: "hehe", newUser: newUser});

//     } catch (error) {
//         res.send({msg: error.msg + "wwwttt"});
//     }
// });

// app.post("/api/users/signin", async (req, res) => {
//     console.log('aaaaaaaaa');
//     console.log("input email is ", req.body.email);
//     try {
//         console.log("before signinUser");
//         const signinUser = await User.find({
//             email: req.body.email,
//             password: req.body.password,
//           });
//           console.log('bbbbbbbbb');
//           if (signinUser) {
//             res.send({
//               _id: signinUser.id,
//               name: signinUser.name,
//               email: signinUser.email,
//               isAdmin: signinUser.isAdmin,
//               token: getToken(signinUser),
//             });
//           } else {
//             res.status(401).send({ message: 'Invalid Email or Password.' });
//           }
//     } catch (error) {
//         res.status(500).send({ message: 'Server error' });
//     }
//   });
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
//handle get request from at http://localhost:5000/api/products 
// app.get("/api/products", (req, res) => {
    
//     res.send(data.products);
// });

// app.get("/api/products/:id", (req, res) => {
//     const productId = req.params.id;
//     const product  = data.products.find( x => x._id === productId);
//     if(product){
//         res.send(product);
//     }
//     else
//     {
//         res.status(404).send({msg:"Product Not Found."});
//     }
    
// });

app.listen(config.PORT, () => {console.log("Server started at http://localhost:5000")});