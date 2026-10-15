var url = "https://script.google.com/macros/s/AKfycbwwEiY4B0qW7q91j9qVX5VYqz2PvTfSdFygqLTcGDRR5qEew2LfNF_0aOGmSm_4gM_q/exec";

var productos = [];

// Cargar inventario al iniciar
fetch(url)
    .then(function(respuesta) {
        return respuesta.json();
    })
    .then(function(datos) {
        productos = datos;
        mostrarTodo();
    });

function mostrarTodo() {
    mostrarProductos(productos);
}

// Filtro: Stock menor o igual a 10 piezas (Bajo stock)
function mostrarBajoStock() {
    var productosFiltrados = [];
    for (var i = 0; i < productos.length; i++) {
        if (Number(productos[i][1]) <= 10) {
            productosFiltrados.push(productos[i]);
        }
    }
    mostrarProductos(productosFiltrados);
}

// Filtro: Stock mayor a 20 piezas (Para Almacenista)
function mostrarStockMayor20() {
    var productosFiltrados = [];
    for (var i = 0; i < productos.length; i++) {
        if (Number(productos[i][1]) > 20) {
            productosFiltrados.push(productos[i]);
        }
    }
    mostrarProductos(productosFiltrados);
}

// Filtro: Precio mayor a $50 (Para Cliente)
function mostrarPrecioMayor50() {
    var productosFiltrados = [];
    for (var i = 0; i < productos.length; i++) {
        var precioLimpio = Number(String(productos[i][2]).replace('$', ''));
        if (precioLimpio > 50) {
            productosFiltrados.push(productos[i]);
        }
    }
    mostrarProductos(productosFiltrados);
}

// Filtro: Precio menor o igual a $50 (Para Cliente)
function mostrarPrecioMenor50() {
    var productosFiltrados = [];
    for (var i = 0; i < productos.length; i++) {
        var precioLimpio = Number(String(productos[i][2]).replace('$', ''));
        if (precioLimpio <= 50) {
            productosFiltrados.push(productos[i]);
        }
    }
    mostrarProductos(productosFiltrados);
}

function mostrarProductos(lista) {
    // Si es la página del Administrador (usa tabla)
    var tbody = document.getElementById("inventario"); 
    if (tbody) {
        tbody.innerHTML = "";
        for (var i = 0; i < lista.length; i++) {
            var tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${lista[i][0] || ''}</td>
                <td>$${lista[i][2] || ''}</td>
                <td>${lista[i][1] || ''}</td>
            `;
            tbody.appendChild(tr);
        }
        return;
    }

    // Si es la página de Cliente o Almacenista (usa contenedor div)
    var contenedor = document.getElementById("productos");
    if (contenedor) {
        contenedor.innerHTML = "";
        for (var i = 0; i < lista.length; i++) {
            contenedor.innerHTML +=
                "<p style='padding: 8px; border-bottom: 1px solid #ddd;'>" +
                "<strong>Producto:</strong> " + lista[i][0] + 
                " | <strong>Precio:</strong> $" + lista[i][2] + 
                " | <strong>Stock:</strong> " + lista[i][1] +
                "</p>";
        }
    }
}

// Captura el envío del formulario de administrador para guardarlo en Google Sheets
document.addEventListener("DOMContentLoaded", function() {
  var form = document.getElementById("formAgregar");
  if (form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();

      var nombre = document.getElementById("nombre").value;
      var precio = document.getElementById("precio").value;
      var stock = document.getElementById("stock").value;

      var datosNuevoProducto = {
        nombre: nombre,
        precio: precio,
        stock: stock
      };

      fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datosNuevoProducto)
      })
      .then(function() {
        alert("¡Producto guardado con éxito!");
        form.reset();
        location.reload();
      })
      .catch(function(error) {
        console.error("Error al guardar:", error);
        alert("Hubo un error al guardar el producto.");
      });
    });
  }
});