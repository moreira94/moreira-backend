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
            let cartsById = await cartsModel.findById(cid).populate('products.product');
            const products = cartsById.products.map((product) => {
                return {
                    _id: product._id,
                    quantity: product.quantity, 
                };
            });
            return { products };
        } catch {
            return console.log(`El cart con el id ${cid} no existe`);
        }
    };

    // getCartById = async (cid) => {
    //     try {
    //       let cartById = await cartsModel.findById(cid).populate('products.product');
    //       return cartById;
    //     } catch {
    //       return console.log(`El cart con el id ${cid} no existe`);
    //     }
    //   };

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
    updateCart = async(cid, pid, productCant) => {
        const cantidad = parseInt(productCant.quantity);
        console.log(cantidad);
        console.log(pid);
        const cart = await cartsModel.findById(cid);
        if (!cart) {
            return console.log('El carrito no existe');
        }
        const productInCart = cart.products.find(product => product._id.toString() === pid._id.toString());
        if (productInCart) {
            productInCart.quantity = cantidad;
            const result = await cart.save();
            return result;
        }
                }

    //     const cart = cid;
    //     const productToUpdate = cart.products.find(p => p._id.toString() === pid);
    //     if (productToUpdate) {
    //       productToUpdate = productCant;
    //       const result = await product.save();
    //       return result;
    //     }
    //   }

    addProductToCart = async (cid, pid) => {
        const cart = await cartsModel.findById(cid);
        if (!cart) {
            return console.log('El carrito no existe');
        }
        const productInCart = cart.products.find(product => product._id.toString() === pid.toString());
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

    }

}


