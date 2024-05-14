import { Schema, model } from "mongoose";

const cartsCollection = 'carts'

const cartsSchema = new Schema({
    products: Array,  
    },
)

export const cartsModel = model(cartsCollection, cartsSchema)