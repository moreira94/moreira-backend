import {connect} from 'mongoose';

const connectDB = ()  => {
    connect('mongodb://127.0.0.1:27017')
}

export default connectDB;