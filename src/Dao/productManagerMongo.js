import { productModel } from "./models/products.models.js";

export default class ProductManagerMongo {
  constructor() {
    this.products = [];

  }


  getProducts = async () => {
    try {
      const products = await productModel.find({}).lean();
      return products;
    }
    catch (err) {
      const products = []
      return products
    }
  };

  addProduct = async ({ title, price, code, stock, description, category, thumbnails }) => {
    let productStatus = true;
    const newProduct = {
      title,
      description,
      code,
      price,
      status: productStatus,
      stock,
      category,
      thumbnails
    }
    if (!title || !price || !code || !stock || !description || !thumbnails  ) {
      return await console.log("Asegurate de incluir todas las propiedades en el objeto!");
    }
      const products = await productModel.find({}).lean();
      if (products.some(product => product.code === code)) {
        return await console.log("Este código de producto ya existe");
      }

      const result = await productModel.create(newProduct)

      return result;
    };
  
   getProductsById = async(pid) => {
      try {
        let productById = await productModel.findById(pid)
        return productById
      } 
      catch {
        return console.log(`El producto con el id ${pid} no existe`)
      }
    };
  
  
    async deleteProduct(id) {
      const result = await productModel.deleteOne({ _id: id })
      return result
    }

    updateProduct = async (id, { title, description, price, thumbnails, code, stock, category }) => {
      let productStatus = true;
      const productToUpdate = {
        title,
        description,
        price,
        thumbnails,
        code,
        status: productStatus,
        stock,
        category
      };
      if (!title || !description || !price || !thumbnails || !code || !stock || !category) return res.send({ status: 'error', error: 'falta completar algunos campos' })

      const result = await productModel.updateOne({ _id: id }, productToUpdate)
      return result
    }

  }
