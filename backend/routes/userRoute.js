import express from 'express';
import User from '../models/userModel';
import { getToken } from '../util';

const userRoute = express.Router();

//create a route from admin
userRoute.get("/createadmin", async (req, res) => {
    try {
        const user = new User({
            name: 'Zejun',
            email: 'wangzejunnina@gmail.com',
            password: '1234',
            isAdmin: true
        });
        let newUser = await user.save();
        res.send({msg: "hehe2", newUser: newUser});

    } catch (error) {
        res.send({msg: error.message + "wwtttff"});
    }
});

userRoute.post("/signin", async (req, res) => {
    try {
        const signinUser = await User.findOne({
            email: req.body.email,
            password: req.body.password,
          });
          if (signinUser) {
            res.send({
              _id: signinUser.id,
              name: signinUser.name,
              email: signinUser.email,
              isAdmin: signinUser.isAdmin,
              token: getToken(signinUser),
            });
          } else {
            res.status(401).send({ message: 'Invalid Email or Password.' });
          }
    } catch (error) {
        res.status(500).send({ message: 'Server error' });
    }
  });

  userRoute.post("/register", async (req, res) => {
      try {
        console.log("aaa");
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        console.log("bbb");
        let newUser = await user.save();
        console.log("ccc");
        if (newUser) {
          console.log('new name is ', newUser.name);
          res.send({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
            token: getToken(newUser),
          });
        } else {
          res.status(401).send({ message: 'Invalid User Info' });
        }
    } catch (error) {
        res.status(500).send({msg: error.message});
    }
  });
 
export default userRoute;