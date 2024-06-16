const express = require('express');
const productsModel = require('../dao/models/products.model.js');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        
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
        products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products/?page=${products.prevPag}` : ``
        products.nextLink = products.hasNextPage ? `http://localhost:8080/api/products/?page=${products.nextPage}` : ``
        products.isValid = (page <= 0) || page > products.totalpages
        console.log(products.prevLink) 


        res.send({ result: "success", payload: products });
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "error", message: "Error interno del servidor al obtener los productos" });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        let product = await productsModel.findById(req.params.pid);
        if (product) {
            res.send({ result: "success", payload: product });
        } else {
            res.status(404).send({ result: "error", message: "Producto no encontrado por ID" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "error", message: "Error interno del servidor al obtener el producto por ID" });
    }
});

router.post('/', async (req, res) => {
    try {
        const productData = { ...req.body, status: true };
        let newProduct = new productsModel(productData);
        let savedProduct = await newProduct.save();
        res.send({ result: "success", payload: savedProduct });
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "error", message: "Error interno del servidor al crear el producto" });
    }
});

router.put('/:pid', async (req, res) => {
    try { 
        let updatedProduct = await productsModel.findByIdAndUpdate(req.params.pid, req.body, { new: true, runValidators: true });
    if (updatedProduct) {
        res.send({ result: "success", payload: updatedProduct });
    } else {
        res.status(404).send({ result: "error", message: "Producto no encontrado por ID" });
    }
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "error", message: "Error interno del servidor al actualizar el producto" });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        let deletedProduct = await productsModel.findByIdAndDelete(req.params.pid);
        if (deletedProduct) {
            res.send({ result: "success", payload: deletedProduct });
        } else {
            res.status(404).send({ result: "error", message: "Producto no encontrado por ID para eliminar" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ result: "error", message: "Error interno del servidor al eliminar el producto por ID" });
    }
});

module.exports = router;
