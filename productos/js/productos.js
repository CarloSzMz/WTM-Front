let tokenusu = sessionStorage.getItem("tokenusu");
let FiltroCategoria = sessionStorage.getItem("FiltroCategoria");
//console.log("Categoria Seleccionada: " + FiltroCategoria);

let productos = [];
let productosCamisteas = [];
let productosSudaderas = [];
let carrito = [];
let url_site = "http://52.205.64.156";

//LLAMA A LAS FUNCIONES
function cargarDatos() {
  cargarNav();
  cargarProductos();
  CargarFiltros();
  //CargarFiltros();
  if (tokenusu != null) {
    cargarCarrito();
  }
}

function cargarNav() {
  //Añadir btn inicio
  $("#nav").append(
    `
    <a class="nav-link active" href="../index.html">
    <button class="navbar-toggler mx-2 d-flex flex-column align-items-center">
      <i class="gg-home text-light mt-2"></i>
      <span class="text-light text-center fs-6 mt-2">Inicio</span>
    </button>
  </a>`
  );
  //comprobar token acceso
  if (tokenusu == null) {
    $("#nav").append(
      `<a class="nav-link active mx-2 text-light" aria-current="page" href="../login & register/login.html">
      <button class="navbar-toggler mx-2 d-flex flex-column align-items-center">
        <span class="text-light text-center fs-6 mt-2">Iniciar Sesión</span>
      </button>
    </a>`
    );
    $("#bodyCarrito").append(`<h4>Inicia Sesión para ver tu carrito</h4>`);
  } else {
    $("#nav").append(`
    <a class="nav-link active" href="../perfil/perfil.html">
      <button class="navbar-toggler mx-2 d-flex flex-column align-items-center">
          <i class="fa-solid fa-user text-light"></i>
          <span class="text-light text-center fs-6 mt-2">Perfil</span>
      </button>
    </a>
    `);
  }
  $("#nav").append(
    ` <button
      class="navbar-toggler mx-2 d-flex flex-column align-items-center"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasNavbar"
      aria-controls="offcanvasNavbar"
      aria-label="Toggle navigation"
    >
    <i class="gg-shopping-cart text-light"></i>
    <span class="text-light text-center fs-6 mt-2">Cesta</span>
    </button>`
  );
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

      carritoOffCanvas();
      deleteprodCarritoNose();
    },
  });
}

//añadir listener al btn borrar del carrito
function deleteprodCarritoNose() {
  carrito.forEach((producto, index) => {
    cont = index;
    btnBorrardelCarro = document.getElementById("borrarDelCarrito" + cont);
    btnBorrardelCarro.addEventListener("click", () => {
      $.ajax({
        type: "DELETE",
        url: url_site + `/api/eliminarProdCarrito`,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + tokenusu,
        },
        data: {
          id: producto.IdCesta,
        },
        success: function (response) {
          console.log(response);
          window.location.reload();
        },
      });
    });
  });
}

function carritoOffCanvas() {
  let cad = ``;

  precioTotal = 0;

  if (carrito.length == 0) {
    $("#bodyCarrito").append(
      `
        <button class="btn btn-secondary " style="border-radius: 50%; width: 50px; height: 50px; pointer-events: none;">
           <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        <h4>Tu carrito está vacío</h4>
        <p class="text-center w-75">Explora los artículos a buen precio que tenemos para ti</p>
        <button class="btn btn-info rounded-3">
            <a href="../index.html" class="text-decoration-none text-dark">Explorar Articulos</a>
        </button>
      `
    );
  } else {
    cad += `      
        <div class="d-flex flex-column w-100 mb-2">
      `;
    cont = 0;
    carrito.forEach((producto) => {
      precioTotal += producto.total;
      cad += `
        <div class="d-flex flex-row w-100">
          <div class="p-2 w-25">
            <img src="../img/productos/${
              producto.ImgArticulo
            }" alt="imgenArticulo" width="50px" class="rounded mr-5">
          </div>
          <div class="w-50">
            <p>
            ${producto.NombreArticulo} 
            <br> 
            ${producto.total / producto.quantity}€
            </p>
            <p>Unidades: <strong>${producto.quantity}</strong></p>
          </div>
          <div>
              <button class="btn d-flex float-end" type="submit" id="borrarDelCarrito${cont}">
                <i class="fa-solid fa-trash"></i>
              </button>
          </div>
        </div>          
        `;

      //sumo variable para el id del btn
      cont++;
    });

    cad += `
      </div>
      <hr style="border-top: 1px dotted #000; width:100%;">
      <p class="w-100">Total (IVA Incluido) <span class="float-end h3">${precioTotal}€</span></p>
      <button class="w-100 btn btn-outline-secondary rounded-2"> 
      <a href="../perfil/cesta/cesta.html" class="text-decoration-none text-dark">Ver artículos en tu Cesta</a>
      </button>
      <button class="w-100 btn btn-outline-secondary rounded-2 mt-3"> 
      <a href="../perfil/pasarela/pasarela.html" class="text-decoration-none text-dark">Realizar Pedido</a>
      </button>
      `;
    $("#bodyCarrito").empty().append(cad);
  }
}

function cargarProductos() {
  $.ajax({
    type: "GET",
    url: url_site + `/api/productos`,
    dataType: "json",
    success: function (response) {
      data = JSON.parse(JSON.stringify(response));
      productos = data.data;

      // Filtrar los productos en base al category_id
      productos.forEach(function (producto) {
        if (producto.category_id === 1) {
          productosCamisteas.push(producto);
        } else if (producto.category_id === 2) {
          productosSudaderas.push(producto);
        }
      });

      distribuirProductosCamiestas();
      distribuirProductosSudaderas();
    },
  });
}

//CARGAR FILTRO CATEGORIAS
function CargarFiltros() {
  // Verificar el valor y marcar el checkbox correspondiente
  if (FiltroCategoria === "sudaderas") {
    $("#sudaderasCheckbox").prop("checked", true);
    $("#mostrarSudaderas").removeClass("d-none");
    $("#mostrarCamisetas").addClass("d-none");
  } else if (FiltroCategoria === "camisetas") {
    $("#camisetasCheckbox").prop("checked", true);
    $("#mostrarSudaderas").addClass("d-none");
    $("#mostrarCamisetas").removeClass("d-none");
  } else if (FiltroCategoria === null) {
    $("#mostrarSudaderas").removeClass("d-none");
    $("#mostrarCamisetas").removeClass("d-none");
  }
}

function distribuirProductosCamiestas() {
  var cadena = ``;
  productosCamisteas.forEach((articulo) => {
    cadena += `
    <div class="card m-2" style="width: 18rem; cursor:pointer;" onclick="envioProductos(${articulo.id})">
        <img src="../img/productos/${articulo.url_img}" class="card-img-top imagen_categorias" alt="img camiseta" >
        <div class="card-body d-flex flex-column justify-content-center">
          <h5>${articulo.name}</h5>
          <p class="text-secondary">${articulo.Precio}€</p>
        </div>
    </div>
    `;
  });

  $("#productosCamisetasDiv").html(cadena);
}

function distribuirProductosSudaderas() {
  var cadena = ``;
  productosSudaderas.forEach((articulo) => {
    cadena += `
    <div class="card m-2" style="width: 18rem; cursor:pointer;" onclick="envioProductos(${articulo.id})">
        <img src="../img/productos/${articulo.url_img}" class="card-img-top imagen_categorias" alt="img sudadera" >
        <div class="card-body d-flex flex-column justify-content-center">
          <h5>${articulo.name}</h5>
          <p class="text-secondary">${articulo.Precio}€</p>
        </div>
    </div>
    `;
  });

  $("#productosSudaderasDiv ").html(cadena);
}

//FUNCION QUE LLEVA AL DETALLE DE LOS PRODUCTOS
function envioProductos(id) {
  sessionStorage.setItem("ProductoSelected", id);
  window.location.replace("./detalle/detalle.html");
}

//CAMBIO DE ICONOS AL DESPLEGAR FILTROS
$(document).ready(function () {
  // Cambiar el icono de la flecha al abrir y cerrar el menú desplegable de "Ropa"
  $("#ropaSubmenu").on("show.bs.collapse", function () {
    $("#ropaSubmenuIcon").removeClass("gg-arrow-down").addClass("gg-arrow-up");
  });

  $("#ropaSubmenu").on("hide.bs.collapse", function () {
    $("#ropaSubmenuIcon").removeClass("gg-arrow-up").addClass("gg-arrow-down");
  });

  // Cambiar el icono de la flecha al abrir y cerrar el menú desplegable de "Filtrar por precio"
  $("#precioSubmenu").on("show.bs.collapse", function () {
    $("#precioSubmenuIcon")
      .removeClass("gg-arrow-down")
      .addClass("gg-arrow-up");
  });

  $("#precioSubmenu").on("hide.bs.collapse", function () {
    $("#precioSubmenuIcon")
      .removeClass("gg-arrow-up")
      .addClass("gg-arrow-down");
  });
});

$(document).ready(function () {
  // Evento change para los checkboxes de sudaderas y camisetas
  $("#sudaderasCheckbox, #camisetasCheckbox").change(function () {
    // Actualizar el valor de FiltroCategoria en sessionStorage
    if (
      $("#sudaderasCheckbox").is(":checked") &&
      !$("#camisetasCheckbox").is(":checked")
    ) {
      sessionStorage.setItem("FiltroCategoria", "sudaderas");
      //console.log("click en sudaderas");
      $("#mostrarSudaderas").removeClass("d-none");
      $("#mostrarCamisetas").addClass("d-none");
    } else if (
      !$("#sudaderasCheckbox").is(":checked") &&
      $("#camisetasCheckbox").is(":checked")
    ) {
      //console.log("click en camisetas");
      sessionStorage.setItem("FiltroCategoria", "camisetas");
      $("#mostrarCamisetas").removeClass("d-none");
      $("#mostrarSudaderas").addClass("d-none");
    } else {
      // Si ambos checkboxes están seleccionados o ninguno está seleccionado, establecer sessionStorage a null
      sessionStorage.removeItem("FiltroCategoria");
      $("#mostrarCamisetas").removeClass("d-none");
      $("#mostrarSudaderas").removeClass("d-none");
    }
  });
});
window.onload = cargarDatos();
