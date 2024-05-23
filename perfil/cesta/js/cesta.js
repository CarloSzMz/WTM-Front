let tokenusu = sessionStorage.getItem("tokenusu");
let carrito = [];
let productos = [];
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
      //console.log(carrito);

      rellenarDivCarrito();
      RecibirProductosrecomendados();
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
  if (carrito.length == 0) {
    cadena += `
      <div class="w-100 d-flex flex-column align-items-center justify-content-center mt-5">
        <i class="fa-solid fa-tag fa-3x"></i>
        <h4 class="mt-2">Tu cesta está vacía</h4>
        <span class="mt-3 w-50 text-center">No has añadido ningún producto a tu cesta todavía. ¡Navega por la web y encuentra ofertas increíbles!</span>
        <button class="btn btn-dark mt-3 p-3 rounded">
          <a href="../../productos/productos.html" class="text-decoration-none text-light">
            Descubirir prendas
          </a>
        </button>
      </div>
    `;
    $("#TotalPrice").html("0 €");

    $("#cesta").html(cadena);
    $("#btnCompra").addClass("disabled");

  } else {
    $("#btnCompra").removeClass("disabled");
    carrito.forEach((producto) => {
      cadena += `
          <div class="d-flex flex-row p-2">
              <div class="contenedor_img">
                  <img src="../../img/productos/${producto.ImgArticulo}" alt="" onclick="envioProductos(${producto.article_id})" class="imagen_categorias rounded">
              </div>
              <div class="contenedor_datos">
                  <span class="fw-bold">${producto.NombreArticulo}</span>
                  <div class="d-flex" style="height:100%; align-items:flex-end">
                      <button class="btn borrarDelCarrito" data-id="${producto.id}">
                          <i class="gg-trash"></i>
                      </button>
                      <span class="border-start border-black disabled text-secondary" style="padding-left:5px; cursor:pointer">
                          Mover a la lista de deseos
                      </span>
                  </div>
              </div>
              <div class="contenedor_cantidad">
                  <span class="fw-bold" style="margin-right:5px;">${producto.total}€</span>
                  <select class="select2 cantidad-select p-2" id="cantidad-${producto.id}" data-basquetid="${producto.IdCesta}">
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
        //console.log(          `El nuevo valor seleccionado para el producto con ID ${basquet_id} es: ${nuevoValor}`        );

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

function RecibirProductosrecomendados() {
  $.ajax({
    type: "GET",
    url: url_site + `/api/productos`,
    dataType: "json",
    success: function (response) {
      data = JSON.parse(JSON.stringify(response));
      productos = data.data;
      //console.log(productos);

      rellenarRecomendados();
    },
  });
}

function rellenarRecomendados() {
  cad = ``;

  //FILTRAR POR PRODUCTOS QUE NO ESTÁN EN LA CESTA
  const carritoIds = carrito.map(item => item.article_id);
  const productosNoEnCarrito = productos.filter(producto => !carritoIds.includes(producto.id)).slice(0, 2);

  //console.log("Productos no en el carrito:", productosNoEnCarrito);

  if (productosNoEnCarrito.length == 0) {
    $("#recomendadosTitulo").addClass("d-none");
    $("#productos_recomendados").addClass("d-none");
  } else {
    $("#recomendadosTitulo").removeClass("d-none");
    $("#productos_recomendados").removeClass("d-none");
    productosNoEnCarrito.forEach(producto => {

      cad += `
    <div class="d-flex flex-row p-2">
      <div class="contenedor_img">
          <img src="../../img/productos/${producto.url_img}" alt="" onclick="envioProductos(${producto.id})" class="imagen_categorias rounded">
      </div>
      <div class="contenedor_datos">
        <span class="fw-bold">${producto.name}</span>
        <div class="d-flex" style="height:100%; align-items:flex-end">
            <span><strong>${producto.Precio}€</strong></span>
        </div>
      </div>
      <div class="contenedor_cantidad">
        <form id="form-${producto.id}" style="display: none;">
          <input type="hidden" name="product_id" value="${producto.id}">
        </form>
        <span class="text-secondary d-flex mover-a-cesta" data-product-id="${producto.id}" style="padding-left:5px; cursor:pointer; font-size:13px">
          Mover a la cesta
        <i class="gg-arrow-up"></i>
        </span>
      </div>
    </div>
    <hr style="border-top: 1px dotted #000; width:100%;">
    `;
    });

    $("#productos_recomendados").html(cad);


    // Añadir el evento click a los spans para mover a la cesta
    $('.mover-a-cesta').on('click', function () {
      const productId = $(this).data('product-id');
      const recomendadoDiv = $(this).closest('.d-flex.flex-row.p-2'); // Encuentra el div que contiene el producto recomendado

      //console.log(productId);
      $.ajax({
        type: 'POST',
        url: url_site + '/api/add_carrito',
        headers: {
          Authorization: 'Bearer ' + tokenusu
        },
        data: {
          article_id: productId,
          quantity: 1,
        },
        success: function (response) {
          recomendadoDiv.hide(); // Oculta el div que contiene el producto recomendado
          cargarCarrito();
        },
        error: function (error) {
          console.error('Error al mover el producto a la cesta:', error);
        }
      });
    });
  }

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
