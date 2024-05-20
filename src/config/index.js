import {connect} from 'mongoose';

const connectDB = ()  => {
    connect('mongodb+srv://moreirajuliangustavo:superyo94@backend.flriqtn.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Backend');}

export default connectDB;