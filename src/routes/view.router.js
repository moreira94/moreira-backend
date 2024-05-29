import { Router } from "express";
import ProductManagerMongo from "../Dao/productManagerMongo.js";
import CartManagerMongo from "../Dao/cartManagerMongo.js";
import { UsersManagerMongo } from "../Dao/usersManagerMongo.js";
import auth from '../middlewares/auth.middleware.js';


const router = Router();

let productManager = new ProductManagerMongo();
let cartManager = new CartManagerMongo()

router.get('/', async (req, res) => {

    res.render('login'
    )
}); 

router.get('/products', async (req, res) => {
    const {limit, sort} = req.query;
    const numPage = req.query.page;
    const { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage, totalPages, totalDocs } = await productManager.getProducts(limit, numPage, sort )
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
        numPage,
        limit,
        user: req.session.user
    
    } )
})

router.get('/carts/:cid', async (req, res) => {
    try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);
    const products = cart.products;
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

    router.get('/login', (req, res) => {
        res.render('login')
    } )

    router.get('/register', (req, res) => {
        res.render('register')
    } )


    router.get('/users', auth, async (req, res) => {
        const {numPage, limit} = req.query
       
        const userService = new UsersManagerMongo()
        const  { docs, page, hasPrevPage, hasNextPage, prevPage, nextPage } = await userService.getUsers({limit, numPage })
    
        res.render('users', {
            users: docs,
            page, 
            hasNextPage,
            hasPrevPage,
            nextPage,
            prevPage
        })
    })


export default router; 