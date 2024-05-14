import { Schema, model } from "mongoose";

const productCollection = 'products'

const productSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    thumbnails: String,
    code: String,
    status: Boolean,
    stock: Number,
    category: String,
    },
)

export const productModel = model(productCollection, productSchema)