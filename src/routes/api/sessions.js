const express = require("express");
const userModel = require("../../dao/models/user.model");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firt_name, last_name, email, age, password } = req.body;
  try {
    const newUser = new userModel({
      firt_name,
      last_name,
      email,
      age,
      password,
    });

    await newUser.save();

    res.status(201).send({ result: "success", payload: newUser });
  } catch (error) {
    console.error("Error al registrar usuario", error);
    res
      .status(500)
      .send({ result: "error", message: "Error interno al REGISTRAR USUARIO" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.query;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ result: "error", message: "Usuario no encontrado" });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      age: user.age,
    };
    res.send("Login exitoso");
    res.redirect("/profile");

  } catch (error) {
    console.error("Error al iniciar sesión", error);
    res.status(500)
    res.send({ result: "error", message: "Error interno al INICIAR SESIÓN" });
  }
});


router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send(err);
    }
    res.send("Logout exitoso");
    res.redirect('/login')
  });
});

module.exports = router;