let tokenusu = sessionStorage.getItem("tokenusu");
let url_site = "http://52.205.64.156";

window.onload = cargarDatos();

function cargarDatos() {
  cargarNav();
  if (tokenusu != null) {
    cargarCarrito();
  }
}

function cargarNav() {
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
    $("#nav").append(
      `
        <a class="nav-link active" href="../index.html">
        <button class="navbar-toggler mx-2 d-flex flex-column align-items-center">
          <i class="gg-home text-light mt-2"></i>
          <span class="text-light text-center fs-6 mt-2">Inicio</span>
        </button>
      </a>
  
      <a class="nav-link active" href="../perfil/perfil.html">
        <button class="navbar-toggler mx-2 d-flex flex-column align-items-center">
            <i class="fa-solid fa-user text-light"></i>
            <span class="text-light text-center fs-6 mt-2">Perfil</span>
        </button>
      </a>
    `
    );
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

function cargarCarrito() {
  let cad = ``;
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
                    <button class="w-100 btn btn-outline-secondary rounded-2 mt-3"> 
                    <a href="../perfil/pasarela/pasarela.html" class="text-decoration-none text-dark">Realizar Pedido</a>
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
            <a href="../perfil/perfil.html" class="text-decoration-none text-dark">Ver artículos en tu Cesta</a>
            </button>
            `;
        $("#bodyCarrito").append(cad);
      }
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
          //console.log(response);
          window.location.reload();
        },
      });
    });
  });
}
