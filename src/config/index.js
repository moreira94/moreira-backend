import {connect} from 'mongoose';
import dotenv from 'dotenv' 
dotenv.config()


export const objectConfig = {
    port:  process.env.PORT || 8080,
    mongo: process.env.MONGO_URL,
    jwtKey: process.env.JWT_PRIVATE_KEY,
    adminMail: process.env.ADMIN_EMAIL,
    adminPass: process.env.ADMIN_PASSWORD
};

export const connectDB = async ()  => {
    await connect(objectConfig.mongo + '@backend.flriqtn.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Backend');}

