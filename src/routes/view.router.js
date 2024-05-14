import { Router } from "express";
import ProductManagerMongo from "../Dao/productManagerMongo.js";

const router = Router();

let productManager = new ProductManagerMongo();

router.get('/', async (req, res) => {
    const products = await productManager.getProducts()
let cantProducts = products.length
    res.render('home', {
        products,
        cantProducts,
    })
}); 

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts', {
        products,

    }  )})

    router.get('/chat', (req, res) => {
        // const {socketServer} = req;
        res.render('chat', {

        })
    })

export default router; 