import express from 'express';
import User from '../models/userModel';
import { getToken, isAuth } from '../util';

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
              avatar: signinUser.avatar,
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


  //update
  userRoute.put('/:id', isAuth, async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.password = req.body.password || user.password;
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        isAdmin: updatedUser.isAdmin,
        token: getToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  });

  userRoute.post("/register", async (req, res) => {
      try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        let newUser = await user.save();
        if (newUser) {
          res.send({
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar,
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

userRoute.put('/:id/avatars', isAuth, async (req, res) => {
  console.log("in put avatars")
  const user = await User.findById(req.params.id);
  console.log("user is ", user)
  if(user){
    user.avatar = req.body.fileName || user.avatar;
    const updatedUser = await user.save();
    console.log("avatar updated")
    res.status(200).send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      isAdmin: updatedUser.isAdmin,
      token: getToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

 
export default userRoute;