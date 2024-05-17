let tokenusu = sessionStorage.getItem("tokenusu");
let carrito = [];
let btnCompra = document.getElementById("btnCompra");
let btnLogout = document.getElementById("btnlogout");

let basquet_id;
let totalPrice = 0;

let url_site = "http://52.205.64.156";

window.onload = cargarDatos();

//LLAMA A LAS FUNCIONES
function cargarDatos() {
  cargarCarrito();
}

//CARGA LOS PRODUCTOS DEL CARRITO PARA EL OFFCANVAS
function cargarCarrito() {
  $.ajax({
    type: "GET",
    url: url_site + `/api/ver_carrito`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + tokenusu,
    },
    success: function (response) {
      data = JSON.parse(JSON.stringify(response));
      carrito = data.data;
      console.log(carrito);

      rellenarDivCarrito();
    },
  });
}

btnCompra.addEventListener("click", (event) => {
  event.preventDefault();
  window.location.replace("../pasarela/pasarela.html");
});

function rellenarDivCarrito() {
  cadena = ``;
  totalPrice = 0;
  carrito.forEach((producto) => {
    cadena += `
        <div class="d-flex flex-row p-2">
            <div class="contenedor_img">
                <img src="../../img/productos/${
                  producto.ImgArticulo
                }" alt="" onclick="envioProductos(${
      producto.article_id
    })" class="imagen_categorias rounded">
            </div>
            <div class="contenedor_datos">
                <span class="fw-bold">${producto.NombreArticulo}</span>
                <div class="d-flex" style="height:100%; align-items:flex-end">
                    <button class="btn borrarDelCarrito" data-id="${
                      producto.id
                    }">
                        <i class="gg-trash"></i>
                    </button>
                    <span class="border-start border-black disabled text-secondary" style="padding-left:5px; cursor:pointer">
                        Mover a la lista de deseos
                    </span>
                </div>
            </div>
            <div class="contenedor_cantidad">
                <span class="fw-bold" style="margin-right:5px;">${
                  producto.total
                }€</span>
                <select class="select2 cantidad-select p-2" id="cantidad-${
                  producto.id
                }" data-basquetid="${producto.IdCesta}">
                ${generateOptions(producto.quantity, producto.Stock)}
                </select>
            </div>
        </div>
        <hr style="border-top: 1px dotted #000; width:100%;">

        `;
    totalPrice += producto.total;
  });

  $("#TotalPrice").html(totalPrice + "€");

  $("#cesta").html(cadena);
  asignarFunciones();

  $(".cantidad-select").each(function () {
    const basquet_id = $(this).data("basquetid");

    // Luego de añadir el HTML, inicializar Select2 y configurar el valor predeterminado
    $(this).select2().val($(this).val()).trigger("change");

    $(this).on("select2:select", function (e) {
      const nuevoValor = e.params.data.id;
      console.log(
        `El nuevo valor seleccionado para el producto con ID ${basquet_id} es: ${nuevoValor}`
      );

      $.ajax({
        type: "PUT",
        url: url_site + `/api/update_carrito`,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + tokenusu,
        },
        data: {
          basquet_id: basquet_id,
          quantity: nuevoValor,
        },
        success: function (response) {
          //console.log(response);
          cargarCarrito();
        },
      });
    });
  });
}

function generateOptions(selectedQuantity, maxQuantity) {
  let options = "";
  for (let i = 1; i <= maxQuantity; i++) {
    if (i === selectedQuantity) {
      options += `<option value="${i}" selected>${i}</option>`;
    } else {
      options += `<option value="${i}">${i}</option>`;
    }
  }
  return options;
}

function envioProductos(id) {
  sessionStorage.setItem("ProductoSelected", id);
  window.location.replace("../../productos/detalle/detalle.html");
}

function asignarFunciones() {
  // Añadir event listener para los botones de eliminar
  const botonesEliminar = document.querySelectorAll(".borrarDelCarrito");
  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", function () {
      const idProducto = this.getAttribute("data-id");

      $.ajax({
        type: "DELETE",
        url: url_site + `/api/eliminarProdCarrito`,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + tokenusu,
        },
        data: {
          id: idProducto,
        },
        success: function (response) {
          //console.log(response);
          cargarCarrito();
        },
      });
    });
  });
}

//BOTON QUE REALIZA EL CIERRE DE SESION
btnLogout.addEventListener("click", () => {
  //console.log("chauuuuuu");
  sessionStorage.removeItem("tokenusu");

  $.ajax({
    type: "GET",
    url: url_site + `/api/logout`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + tokenusu,
    },
    success: function (response) {
      //console.log(response);

      window.location.replace("../../index.html");
    },
  });
});
