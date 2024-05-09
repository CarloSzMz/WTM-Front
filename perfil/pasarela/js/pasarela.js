let url_site = "http://52.205.64.156";
let tokenusu = sessionStorage.getItem("tokenusu");
let carrito = [];
let datosUser = [];
let total_price = 0;
let btnCompra = document.getElementById("btnCompra");

//CAMBIAR BORDE DE LAS CAJAS
$(document).ready(function () {
  $("#tarjetaDivVisa, #tarjetaDivBizum, #tarjetaDivPaypal").click(function () {
    // Verificar si el div clicado ya tiene la clase de borde negro
    if (!$(this).hasClass("border border-black")) {
      $(".bg-secondary-subtle").removeClass("border border-black"); // Eliminar la clase de borde negro de todos los divs
      $(this).addClass("border border-black"); // Agregar la clase de borde negro al div clicado
    }
  });
});

//LLAMA A LAS FUNCIONES
function cargarDatos() {
  cargarNav();
  cargarCarrito();
  cargarUser();
}

//CARGA LA NAVBAR
function cargarNav() {
  $("#nav").append(
    `<a class="nav-link active" href="../../index.html">
      <button class="navbar-toggler mx-2 d-flex flex-column align-items-center">
        <i class="gg-home text-light mt-2"></i>
        <span class="text-light text-center fs-6 mt-2">Inicio</span>
      </button>
    </a>
    
    <button
      class="navbar-toggler mx-2 d-flex flex-column align-items-center"
      type="button"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasNavbar"
      aria-controls="offcanvasNavbar"
      aria-label="Toggle navigation"
    >
      <i class="gg-shopping-cart text-light"></i>
      <span class="text-light text-center fs-6 mt-2">Cesta</span>
    </button>
    `
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
      rellenarDivCobro();
    },
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
          <a href="../../index.html" class="text-decoration-none text-dark">Explorar Articulos</a>
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
          <img src="../../img/productos/${
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
    <a href="../perfil.html" class="text-decoration-none text-dark">Ver artículos en tu Cesta</a>
    </button>
    `;
    $("#bodyCarrito").empty().append(cad);
  }
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
          //console.log(response);
          window.location.reload();
        },
      });
    });
  });
}

//añadir los articulos de la cesta para pagar
function rellenarDivCobro() {
  var sinIva = 0;
  cadena = ``;

  carrito.forEach((articulo) => {
    cadena += `
    <div class="d-flex flex-row w-100 border-bottom border-dark">
      <div class="d-flex flex-column w-100">
        <span>${articulo.NombreArticulo}</span>
        <span class="text-secondary fs-6">x${articulo.quantity}ud</span>
      </div>
      <span class="float-end text-secondary">${articulo.total}€</span>
    </div>
    `;
    total_price += articulo.total;
  });
  IVA = total_price * 0.21;
  $("#ProductosPedido").html(cadena);
  $("#SinIVA").html(IVA + "€");
  $("#TotalPrice").html(total_price.toFixed(2) + "€");
}

//ver los datos de usuario
function cargarUser() {
  $.ajax({
    type: "GET",
    url: url_site + `/api/get_user`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + tokenusu,
    },
    success: function (response) {
      datosUser = response.data;
      console.log(datosUser);
      if (datosUser.name != null) {
        $("#nombreCompletoInput").val(datosUser.name);
      }
      if (datosUser.calle != null) {
        $("#DireccionInput").val(datosUser.calle);
      }
      if (datosUser.provincia != null) {
        $("#ProvinciaInput").val(datosUser.provincia);
      }
    },
  });
}

//BOTON QUE REALIZA LA COMPRA
btnCompra.addEventListener("click", (event) => {
  event.preventDefault();

  //calcular precio total
  let precio_total = 0;
  carrito.forEach((element) => {
    precio_total += element.total;
  });

  //Copmrobar que hay datos de facturacion
  if (
    $("#DireccionInput").val() == null ||
    $("#ProvinciaInput").val() == null
  ) {
    alert("Se necesitan los datos de facturacción");
    } else {
    //confirmar creacion de pedido
    var confirmacion = confirm(
      "¿Estás seguro de que deseas realizar la compra?"
    );

    if (confirmacion) {
      $.ajax({
        type: "POST",
        url: url_site + `/api/create_pedido`,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + tokenusu,
        },
        data: {
          total_price: precio_total,
          basket: JSON.stringify(carrito),
        },
        success: function (response) {
          window.location.replace("../perfil.html");
        },
      });
    } else {
      return false;
    }
  }
});

window.onload = cargarDatos();
