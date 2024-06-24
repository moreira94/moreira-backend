import {connect} from 'mongoose';
import dotenv from 'dotenv' 
dotenv.config()


export const objectConfig = {
    port:  process.env.PORT || 8080,
    MONGO: process.env.MONGO,
    JWTKEY: process.env.JWT_PRIVATE_KEY

};

export const connectDB = async ()  => {
    await connect(objectConfig.MONGO + '@backend.flriqtn.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Backend');}

