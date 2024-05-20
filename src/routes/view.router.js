import { Router } from "express";
import ProductManagerMongo from "../Dao/productManagerMongo.js";

const router = Router();

let productManager = new ProductManagerMongo();

router.get('/', async (req, res) => {

    res.render('home'
    )
}); 

router.get('/products', async (req, res) => {
    const {numPage, limit} = req.query;
    const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, totalDocs } = await productManager.getProducts({limit, numPage })
    const cantProducts = totalDocs
    res.render('products', {
        products: docs, 
        page,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        totalPages,
        cantProducts,
        numPage
    } )
})

router.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts()

    res.render('realtimeproducts', {
        products,
    }  )})

    router.get('/chat', (req, res) => {
        // const {socketServer} = req;
        res.render('chat', {

        })
    })

export default router; 