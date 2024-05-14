import { cartsModel } from "./models/carts.models.js";

export default class CartManagerMongo {
    constructor() {
      this.carts = [];
      
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
        const newCart= { products: []
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
        let cartsById = await cartsModel.findById(cid);
        if (!cartsById) return res.send('El cart seleccionado no existe')
        await cartsModel.deleteOne({_id: cid});
        const newCart = new cartsModel({ _id: cid });
        const result = await newCart.save();
        return result;
    }

  addProductToCart = async(cid, pid) => {
    let cartsById = await cartsModel.findById(cid);
    if (!cartsById) return res.send('El cart seleccionado no existe')
        const result = await cartsModel.updateOne({_id: cid}, {$push: {products: pid}});
    return result;
  }
  deleteProductFromCart = async(cid, pid) => {
    let cartsById = await cartsModel.findById(cid);
    if (!cartsById) return res.send('El cart seleccionado no existe')
        const result = await cartsModel.updateOne({_id: cid}, {$pull: {products: pid}});
    return result;

  }
}