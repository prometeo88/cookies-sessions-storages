const express = require('express');
const userModel = require('../dao/models/user.model');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let users = await userModel.find();
        res.send({ result: "success", payload: users });
    } catch (error) {
        console.error("Error cargar usuarios", error);
        res.status(500).send({ result: "error", message: "Error del servidor al cargar usuario" });
    }
});

router.post('/', async (req, res) => {
    try {
        let { nombre, apellido, email } = req.body;

        if (!nombre || !apellido || !email) {
            return res.status(400).send({ result: "error", message: "Faltan datos de usuarios" });
        }

        let result = await userModel.create({ nombre, apellido, email });
        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error('Error al crear el usuario', error);
        res.status(500).send({ result: "error", message: "Error interno al crear USUARIO" });
    }
});

router.put('/:uid', async (req, res) => {
    try {
        const userId = req.params.uid;
        const updatedUser = req.body;

        const result = await userModel.findByIdAndUpdate(userId, updatedUser, { new: true });

        if (!result) {
            return res.status(404).send({ result: "error", message: "Usuario no encontrado" });
        }

        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error('Error al modificar el USUARIO', error);
        res.status(500).send({ result: "error", message: "Error interno al MODIFICAR USUARIO" });
    }
});

router.delete('/:uid', async (req, res) => {
    try {
        const userId = req.params.uid;
        const result = await userModel.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).send({ result: "error", message: "Error USUARIO NO ENCONTRADO" });
        }

        res.send({ result: "success", payload: result });
    } catch (error) {
        console.error('Error al ELIMINAR EL USUARIO', error);
        res.status(500).send({ result: "error", message: "ERROR INTERNO AL ELIMINAR EL USUARIO" });
    }
});

module.exports = router;