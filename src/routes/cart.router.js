import { Router } from "express";
import ProductManagerMongo from "../Dao/productManagerMongo.js";
import CartManagerMongo from "../Dao/cartManagerMongo.js";

const router = new Router();
let cartManager = new CartManagerMongo();
let productManager = new ProductManagerMongo();
// let products = await productManager.getProducts();

router.get("/", async (req, res) => {
  const carts = await cartManager.getCarts();
  res.send(carts)
});

router.post("/", async (req, res) => {
  try {
    await cartManager.addCart()
    res.status(200).send("cart agregado");
  } catch {
    return res.status(400).send("No se pudo crear el carrito");
  }
});

router.get("/:cid", async (req, res) => {

    const { cid } = req.params;

    const cartById = await cartManager.getCartById(cid)
    res.status(200).send(cartById)

});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartManager.resetCart({_id: cid})
    res.send({status:"succes", payload: result})
  } catch(err) {
    console.log(err);
    res.status(400).send("No se pudieron eliminar los productos del carrito")
  }
})

router.post("/:cid/products/:pid", async (req, res) => {

  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.getCartById(cid);
    const product = await productManager.getProductsById(pid);
    const cartProduct = await cartManager.addProductToCart(cid, product);
    res.status(200).send(cartProduct);
      } catch(err) {
        console.log(err);
          res.status(400).send("No se pudo agregar el producto al carrito")
        }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    // const cart = await cartManager.getCartById(cid);
    // const product = await productManager.getProductsById(pid);
    const cartProduct = await cartManager.deleteProductFromCart(cid, pid);
    console.log(cartProduct);
    res.status(200).send(cartProduct);
    } catch(err) {
      console.log(err);
      res.status(400).send("No se pudo eliminar el producto del carrito")
      }


});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cantidad = req.body;
    const cart = await cartManager.getCartById(cid);
    const product = await productManager.getProductsById(pid);
    const cartProduct = await cartManager.updateCart(cart, product, cantidad);
    console.log(cartProduct);
    res.status(200).send(cartProduct);
    } catch(err) {
      console.log(err);
      res.status(400).send("No se pudo actualizar el producto del carrito")
      }


});

export default router;
