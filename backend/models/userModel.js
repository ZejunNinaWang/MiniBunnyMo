import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true, index: true, dropDups: true},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true, default: true}, //user is admin by default

    avatar: { type: String, required: false, default: '' }
});

const User = mongoose.model("User", userSchema);

export default User;