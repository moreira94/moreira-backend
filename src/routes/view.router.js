import { Router } from "express";
import ProductManagerMongo from "../Dao/productManagerMongo.js";
import CartManagerMongo from "../Dao/cartManagerMongo.js";

const router = Router();

let productManager = new ProductManagerMongo();
let cartManager = new CartManagerMongo()

router.get('/', async (req, res) => {

    res.render('home'
    )
}); 

router.get('/products', async (req, res) => {
    const {limit, numPage} = req.query;
    const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, totalDocs } = await productManager.getProducts(limit, numPage )
    const cantProducts = totalDocso99
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

router.get('/carts/:cid', async (req, res) => {
    try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    const products = cart.products;
    console.log(products);
    res.render('cart', {products: products})
}
catch (error) { 
    console.log(error);
    res.render('error', {error})

}})

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