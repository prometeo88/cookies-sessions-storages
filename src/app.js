const express = require("express");
const expressHandlebars = require("express-handlebars");
const http = require("http");
const socketIo = require("socket.io");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");

// Configuración de la aplicación
const app = express();
const PORT = 8080;
const server = http.createServer(app);
const io = socketIo(server);

// Modelos
const messagesModel = require('./dao/models/messages.model.js');

// Middleware
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuración de Handlebars
app.engine('handlebars', expressHandlebars.engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// Rutas
const productsRouter = require("./routes/products.routers.js");
const cartsRouter = require("./routes/carts.routers.js");
const viewsRouter = require("./routes/views.js");
const usersRouter = require("./routes/users.routers.js");
const messagesRouter = require("./routes/messages.routers.js");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", usersRouter);
app.use("/api/messages", messagesRouter);

// Conexión a la base de datos
const conectarBase = async () => {
  try {
    await mongoose.connect('mongodb+srv://fullua:123456789fullua@fedeu.z6zxkgk.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=FedeU');
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error en la conexión de la base de datos", error);
  }
};
conectarBase();

// Configuración de Socket.io
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado con éxito");

  // Enviar mensajes previos al nuevo cliente
  messagesModel.find().then(messages => {
    messages.forEach(msg => {
      socket.emit('message', msg);
    });
  });

  // Manejar nuevo mensaje
  socket.on('message', async (data) => {
    console.log(data);
    const newMessage = new messagesModel(data);
    await newMessage.save();
    io.emit('message', data);
  });
});

app.set("io", io);

// Inicio del servidor
server.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
