const express = require("express");
const router = express.Router();
const fs_ = require("fs");


const productsModel = require("../dao/models/products.model.js");
const cartsModel = require("../dao/models/carts.model.js");


router.get('/', async (req, res) => {
  try {
      const { limit = 2, page = 1, sort, query } = req.query;

      
      let filter = {};
      if (query) {
          filter = { $or: [
              { title: { $regex: query, $options: 'i' } },
              { description: { $regex: query, $options: 'i' } },
              { category: { $regex: query, $options: 'i' } }
          ]};
      }


      const options = {
          limit: parseInt(limit, 10),
          page: parseInt(page, 10),
          sort: sort ? { title: parseInt(sort, 10) } : {}
           };
      

       const products = await productsModel.paginate(filter, options);
      products.prevLink = products.hasPrevPage ? `http://localhost:8080/?page=${products.prevPage}` : ``
      products.nextLink = products.hasNextPage ? `http://localhost:8080/?page=${products.nextPage}` : ``
      products.isValid = (page <= 0) || page > products.totalpages 
    

      res.render('home', { products: products });
  } catch (error) {
      console.log(error);
      res.status(500).send({ result: "error", message: "Error interno del servidor al obtener los productos" });
  }
});


router.get('/api/messages', (req, res) => {
  res.render('messages');
});


router.get('/products', async (req, res) => {
    try {
        const { limit = 5, page = 1, sort, query } = req.query;
  
        
        let filter = {};
        if (query) {
            filter = { $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]};
        }
  
  
        const options = {
            limit: parseInt(limit, 10),
            page: parseInt(page, 10),
            sort: sort ? { title: parseInt(sort, 10) } : {}
             };
        
  
         const products = await productsModel.paginate(filter, options);
        products.prevLink = products.hasPrevPage ? `http://localhost:8080/products/?page=${products.prevPage}` : ``
        products.nextLink = products.hasNextPage ? `http://localhost:8080/products/?page=${products.nextPage}` : ``
        products.isValid = (page <= 0) || page > products.totalpages 
      
  

  
        res.render('products', { products: products });
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "error", message: "Error interno del servidor al obtener los productos" });
    }
  });


router.get('/carts/:cid', async (req, res) => {
    try {
        const { limit = 2, page = 1 } = req.query;
        const cartId = req.params.cid;

            const options = {
            populate: 'products.product',
            limit: parseInt(limit, 10),
            page: parseInt(page, 10)
        };
        
        const cartProduct = await cartsModel.paginate({ _id: cartId}, options);

        if (!cartProduct.docs.length) {
            return res.status(404).send({ result: "error", message: "Carrito no encontrado" });
        }

        console.log('Limit:', limit);
        console.log('Page:', page);
        console.log('Cart Product:', cartProduct);


        cartProduct.prevLink = cartProduct.hasPrevPage ? `http://localhost:8080/carts/${cartId}?page=${cartProduct.prevPage}&limit=${limit}` : '';
        cartProduct.nextLink = cartProduct.hasNextPage ? `http://localhost:8080/carts/${cartId}?page=${cartProduct.nextPage}&limit=${limit}` : '';

        res.render('carrito', { cartProduct: cartProduct.docs[0], pagination: cartProduct });
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "error", message: "Error interno del servidor al obtener el carrito" });
    }
});

module.exports = router;

  

module.exports = router;
