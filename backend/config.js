import dotenv from 'dotenv';

dotenv.config();

export default {
    PORT: process.env.PORT || 5000,
    MONGODB_URL1: process.env.MONGODB_URL || 'mongodb://localhost/MiniBunnyMo',
    MONGODB_URL: process.env.MONGODB_URL || 'mongodb+srv://zejunWang:jackcaI1!@bunnycluster.gx7o1.mongodb.net/<dbname>?retryWrites=true&w=majority',
    JWT_SECRET: process.env.JWT_SECRET || 'somethingsecret'
    
};