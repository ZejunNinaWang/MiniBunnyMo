import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //reference to the User table
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, //reference to the Product table
});

//createIndex( { groupNumber: 1, lastname: 1, firstname: 1 }, { unique: true } )
likeSchema.index({userId: 1, productId: 1}, {unique: true});
const Like = mongoose.model("Like", likeSchema);


export default Like;

