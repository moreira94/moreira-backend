import { Router } from 'express';
import ProductManagerMongo from '../Dao/productManagerMongo.js';

const router = new Router();
let productManager = new ProductManagerMongo();

router.get('/', async (req, res) => {
    try {

    let products = await productManager.getProducts();
    res.send({status: 'success', payload: products})}
    catch (error) {
        res.send(console.log(error));
    }
});

router.post('/', async (req, res) => {
    let nuevoProducto = req.body;
    await productManager.addProduct(nuevoProducto);
    res.send("Producto agregado");
})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params
    const productById = await productManager.getProductsById(pid)
    res.send(productById)
    console.log(productById);
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const producToUpload = req.body;
    const result = await productManager.updateProduct({_id: pid}, producToUpload)
    res.send({status: 'success', payload: result})
})

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    const result = await productManager.deleteProduct({_id: pid})
    res.send({status: 'success', payload: result})
})

export default router;