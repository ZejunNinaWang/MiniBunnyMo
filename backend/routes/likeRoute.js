import express from 'express';
import Like from '../models/likeModel';
import { isAuth } from '../util';

const likeRoute = express.Router();

likeRoute.get('/:id', isAuth, async (req, res) => {
    try {
        const likes = await Like.find({
            userId: req.params.id
        }).sort({productId:1});
        res.send(likes);
        
    } catch (error) {
        res.status(500).send({msg: error.message});
    }

});

likeRoute.post('/', isAuth, async (req, res) => {
    try {
        const like = new Like({
            productId: req.body.productId,
            userId: req.body.userId
        });
        const newLike = await like.save();
        if(newLike){
            res.status(201).send({msg: "New Like Created", data: newLike});
        }
        else
        {
            res.status(500).send({msg: 'Error in Creating Like.'});
        }
        
    } catch (error) {
        res.status(500).send({msg: error.message});
    }
});

likeRoute.delete('/:userId/:productId', isAuth, async (req, res) => {
    try {
        const deletedLike = await Like.findOne({
            productId: req.params.productId,
            userId: req.params.userId
        })
        if(deletedLike){
            await deletedLike.remove();
            res.send({msg: "Like Removed."});
        }
        else
        {
            res.status(404).send({msg: 'Like Not Found'});
        }
        
    } catch (error) {
        res.status(500).send({msg: "Error in removing like "+error.message});
    }
});

export default likeRoute;