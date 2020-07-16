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
    
        const newUser = await user.save();
        res.send(newUser);

    } catch (error) {
        res.send({msg: error.message});
    }
})

userRoute.post('/signin', async (req, res) => {
    //send query to db
    const signinUser = User.findOne({
        email: req.body.email,
        password: req.body.password
    });
    if(signinUser){
        res.send({
            _id: signinUser.id,
            name: signinUser.name,
            email: signinUser.email,
            isAdmin: signinUser.isAdmin,

            token: getToken(signinUser)

        })
    }
    else
    {
        res.status(401).send({msg: 'Invalid Email or Password.'});
    }
    
})
 
export default userRoute;