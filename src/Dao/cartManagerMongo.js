import { cartsModel } from "./models/carts.models.js";
import { productModel } from "./models/products.models.js";


export default class CartManagerMongo {
    constructor() {
        this.model = cartsModel;

    }


    getCarts = async () => {
        try {
            const carts = await cartsModel.find({}).lean();
            return carts;
        }
        catch (err) {
            const carts = []
            return carts
        }
    };

    addCart = async () => {
        const newCart = {
            products: []
        }

        const result = await cartsModel.create(newCart)

        return result;
    };

    getCartById = async (cid) => {
        try {
            let cartsById = await cartsModel.findById(cid)
            return cartsById
        } catch {
            return console.log(`El cart con el id ${cid} no existe`)
        }
    };

    resetCart = async (cid) => {
        let cartsById = await cartsModel.findOneAndUpdate(
            { _id: cid },
            { $set: { products: [] } },
            { new: true }
        )
        return cartsById
    }

    // updateCart = async(cid, pid) => {
    //     const result = await cartsModel.findByIdAndUpdate(
    //         {_id: cid, 'products.product': pid},
    //         {$inc: {'products.$.quantity': 1}},
    //         {new: true, upsert: true}
    //     )
    //     if (result) return result;
    //     const newProductInCart = await cartsModel.findOneAndUpdate(
    //         {_id: cid},
    //         {$push: {products: {product: pid, quantity: 1}}},
    //         {new: true}
    //     )
    //     return newProductInCart;
    // }
    // updateCart = async(cid, pid) => {
    //     const product = await cartManager.getCartById(cid);
    //     const productToUpdate = product.products.find(p => p.product.toString() === pid);
    //     if (productToUpdate) {
    //       productToUpdate.quantity += 1;
    //       const result = await product.save();
    //       return result;
    //     } else {
    //       const newProductInCart = await cartManager.addProductToCart(cid, pid);
    //       return newProductInCart;
    //     }
    //   }

    addProductToCart = async (cid, pid) => {
        const cart = await cartsModel.findById(cid);
        if (!cart) {
            return console.log('El carrito no existe');
        }
        const productInCart = cart.products.find(product => product._id.toString() === pid._id.toString());
        if (productInCart) {
            productInCart.quantity += 1;
            const result = await cart.save();
            return result;
        } else {
            const newProductInCart = {
                _id: pid,
                quantity: 1
            }
            cart.products.push(newProductInCart);
            const result = await cart.save();
            return result;
        }
    }

    deleteProductFromCart = async (cid, pid) => {
        const cart = await cartsModel.findById(cid);
        if (!cart) {
            return console.log('El carrito no existe');
        }
        const productInCart = cart.products.find(product => product._id.toString() === pid);
        console.log(productInCart);
        if (productInCart) {
            productInCart.quantity -= 1;
            if (productInCart.quantity === 0) {
                cart.products.pull(productInCart);
                }
                const result = await cart.save();
                return result;
                }

        
        // let result = await cartsModel.findOneAndUpdate(
        //     { _id: cid },
        //     { $pull: { products: { product: pid } } },
        //     { new: true })
        // return result;
    }

}