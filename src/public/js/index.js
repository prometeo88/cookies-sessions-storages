const socket = io();

const deleteForm = document.getElementById("deleteForm");

document.addEventListener("DOMContentLoaded", () => {
  deleteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const id = document.getElementById("idDelete").value;

    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });

      if (response.ok) {
        console.log("SOCKET: PRODUCTO ELIMINADO CON EXITO");
      } else {
        console.log("SOCKET: ERRROR AL ELIMINAR EL PRODUCTO");
      }
    } catch (error) {
      console.log("CATCH: ERROR AL ELIMINAR EL PRODUCTO");
    }
  });
});

socket.on("productDeleted", (productId) => {
  console.log(`Producto con ID ${productId} eliminado en tiempo real`);
  loadRealTimeProducts();
});

async function loadRealTimeProducts() {
  try {
    const response = await fetch("/api/products");
    if (response.ok) {
      const products = await response.json();
      renderProducts(products);
    } else {
      console.error("Error al cargar productos:", response.statusText);
    }
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

function renderProducts(products) {
  const productList = document.querySelector("ul");
  productList.innerHTML = "";

  products.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Nombre: ${product.title} ID: ${product.id}`;
    productList.appendChild(listItem);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const addForm = document.getElementById("addForm");

  addForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const code = document.getElementById("code").value;
    const price = parseFloat(document.getElementById("price").value);
    const status = true;
    const category = document.getElementById("category").value;
    const stock = parseInt(document.getElementById("stock").value);

    const newProduct = {
      title,
      description,
      code,
      price,
      status,
      category,
      stock,
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        console.log("Producto agregado con éxito.");
        loadRealTimeProducts();
      } else {
        console.error("Error al agregar producto:", response.statusText);
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });
});
