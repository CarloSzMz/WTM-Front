let tokenusu = sessionStorage.getItem("tokenusu");
let datosUser = [];
let carrito = [];
let pedidos = [];
let btnLogout = document.getElementById("btnlogout");
let btnCompra = document.getElementById("confirmarCompra");
let divcarrito = document.getElementById("productosCarrito");
let btnCesta = document.getElementById("btnirCesta");
let url_site = "http://52.205.64.156";

//console.log(tokenusu);

//LLAMA A LAS FUNCIONES
function cargarDatos() {
  cargarNav();
  cargarCarrito();
  cargarPERFIL();
  cargarPedidos();
}

//CARGA LA NAVBAR
function cargarNav() {
  $("#nav").append(
    `<a class="nav-link active" href="../index.html">
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
    <a href="./perfil.html" class="text-decoration-none text-dark">Ver artículos en tu Cesta</a>
    </button>
    <button class="w-100 btn btn-outline-secondary rounded-2 mt-3"> 
    <a href="./pasarela/pasarela.html" class="text-decoration-none text-dark">Realizar Pedido</a>
    </button>
    `;
    $("#bodyCarrito").empty().append(cad);
  }
}

function cargarPedidos() {
  $.ajax({
    type: "GET",
    url: url_site + `/api/ver_pedidos`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + tokenusu,
    },
    success: function (response) {
      data = JSON.parse(JSON.stringify(response));
      pedidos = data.data;
      //console.log(pedidos);

      cargarTablaPedidos();
    },
  });
}

function formatearFechaHora(fechaHora) {
  // Convertir la cadena de fecha y hora a un objeto Date
  var fecha = new Date(fechaHora);
  // Obtener los componentes de la fecha y hora
  var dia = fecha.getDate();
  var mes = fecha.getMonth() + 1; // ¡Recuerda que los meses en JavaScript son base 0!
  var año = fecha.getFullYear() % 100; // Obtiene los últimos dos dígitos del año
  var horas = fecha.getHours();
  var minutos = fecha.getMinutes();
  var segundos = fecha.getSeconds();

  // Agregar ceros iniciales si es necesario
  dia = dia < 10 ? "0" + dia : dia;
  mes = mes < 10 ? "0" + mes : mes;
  año = año < 10 ? "0" + año : año;
  horas = horas < 10 ? "0" + horas : horas;
  minutos = minutos < 10 ? "0" + minutos : minutos;
  segundos = segundos < 10 ? "0" + segundos : segundos;

  // Devolver la fecha y hora formateada
  return dia + "/" + mes + "/" + año + " | " + horas + ":" + minutos;
}

function cargarTablaPedidos() {
  let cadena = ``;
  if (pedidos.length == 0) {
    $("#pedidosusuario").append(
      `<div class="d-flex flex-column align-items-center justify-content-center mt-2">
        <button class="btn btn-dark " style="border-radius: 50%; width: 50px; height: 50px; pointer-events: none;">
          <i class="fa-solid fa-rotate-right text-light"></i>
        </button>
        <h5 class="mt-2">Aún no has hecho ningun pedido</h5>
      </div>
     `
    );
  } else {
    cadena += `
    <table class="table table-striped table-hover mt-2" style="border-radius:10px; overflow:hidden;">
      <th>Nº Pedido</th>
      <th class=" text-center">Estado</th>
      <th class=" text-center">Fecha Pedido</th>
      <th class=" text-center">Total</th>
      <th></th>
  `;
    var estado = "";
    pedidos.forEach((pedido) => {
      var fecha = "";
      fecha = formatearFechaHora(pedido.created_at);
      if (pedido.status == 1) {
        estado = "recibido";
      } else if (pedido.status == 2) {
        estado = "enviado";
      }
      cadena += `
                  <tr  class=" text-center">
                    <td  class=" text-start ">
                        <p>${pedido.id} </p>
                    </td>
                    <td>
                     <p>${estado}</p>
                     <td>
                     <p>${fecha}</p></td>
                    <td>${pedido.total_price}€</td>
                    <td>
                      <button type="button" class="btn btn-outline-dark float-end" onclick="abrirModalPedido(${pedido.id})" data-bs-toggle="modal" data-bs-target="#modalPedido">
                        <i class="gg-file-document"></i>
                      </button>
                    </td>
                  </tr>
    `;
    });

    cadena += `</table>
  
  
  `;
    $("#pedidosusuario").append(cadena);
  }
}

function abrirModalPedido(idPedido) {
  setTimeout(function () {
    $("#modalPedido").modal("show");
    llenarModalPedido(idPedido);
  }, 500); // Cambia este valor según lo necesario, por ejemplo, 500 para medio segundo
}

//FORMATEAR FECHA PARA VISUALIZACION DE PEDIDO
function formatearFechaHoraPedido(fecha) {
  // Crear un objeto de fecha a partir de la cadena proporcionada
  const fechaObj = new Date(fecha);

  // Obtener los componentes de fecha y hora
  const año = fechaObj.getFullYear();
  const mes = String(fechaObj.getMonth() + 1).padStart(2, "0"); // Sumar 1 al mes ya que los meses van de 0 a 11
  const dia = String(fechaObj.getDate()).padStart(2, "0");
  const horas = String(fechaObj.getHours()).padStart(2, "0");
  const minutos = String(fechaObj.getMinutes()).padStart(2, "0");

  // Crear la cadena de fecha y hora formateada
  const fechaFormateada = `${año}-${mes}-${dia} ${horas}:${minutos}`;

  return fechaFormateada;
}

//CARGAR MODAL DE VISUALIZACIÓN DE PEDIDO
function llenarModalPedido(idPedido) {
  //console.log("pedido cargado" + idPedido);
  var pedido = [];
  var articulosPedido = [];
  cadenapedido = ``;
  $.ajax({
    type: "POST",
    url: url_site + `/api/ver_pedido_especifico`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + tokenusu,
    },
    data: {
      pedido_id: idPedido,
    },
    success: function (response) {
      data = JSON.parse(JSON.stringify(response));
      pedido = data.Pedido;
      articulosPedido = data.ArticulosPedido;
      //console.log(pedido);
      //console.log(articulosPedido);
      var fechapedido = formatearFechaHoraPedido(pedido.created_at);
      var IVA = 0.21;
      var totalsinIVA = 0;
      cadenapedido += `
      
      <div class="container bg-secondary-subtle">
        <div class="container pt-4 pb-4">
            <img src="../img/logo_black.png" alt="logo" width="150px" class="float-end">
            <h4 style="font-size: 15px">${fechapedido}</h4>
            <h3>Confirmación de pedido</h3>
            <p class=" text-secondary">Su pedido ha sido procesado correctamente.<br>
                Gracias por comprar en Wear The Message</p>
            <aside class="float-end">
                <p>Identificador de pedido:</p>
                <p class="align-content-end" style="float: inline-end"><strong> ${pedido.OrderId}</strong></p>
            </aside>
            <table class="table table-striped table-hover">
                <th>Artículos seleccionados</th>
                <th>Base</th>
                <th>IVA</th>
                <th>Total</th>
                `;
      articulosPedido.forEach((item) => {
        //calcular precios
        SinIVA = (item.price - item.price * IVA) * item.quantity;
        TotalArticulo = item.price * item.quantity;
        totalsinIVA = SinIVA + totalsinIVA;
        //rellenar tabla
        cadenapedido += `
                <tr>
                 <td class="d-flex">
                     <p> <img src="../img/productos/${
                       item.url_img
                     }" alt="imgenArticulo"
                             width="50px" class="rounded mr-5"></p>
                     <p style="padding-left: 20px"><span
                             class="text-secondary fs-6">${
                               item.article_id
                             }</span><br>
                         <span class="fs-5">${item.name}</span><br>
                         <span class="text-secondary fs-6"> ${
                           item.price
                         }€ (IVA incluido) x ${item.quantity}ud.</span>
                     </p>
                 </td>
                 <td class="align-bottom text-secondary"> ${SinIVA.toFixed(
                   2
                 )}€</td>
                 <td class="align-bottom text-secondary">21,00%</td>
                 <td class="align-bottom">${TotalArticulo.toFixed(2)}€</td>
                </tr>
                `;
      });
      cadenapedido += `
                <tr>
                  <td style="padding-right: 30px"><strong><span class="float-end">TOTAL</span></strong></td>
                  <td>${totalsinIVA.toFixed(2)}€</td>
                  <td></td>
                  <td>${pedido.total_price.toFixed(2)}€</td>
                </tr>
                <tr>
                  <td style="padding-right: 30px"><strong> <span class="float-end">IMPORTE TOTAL </span></strong>
                  </br><span class="float-end text-secondary">(*IVA incl.)</span></td>
                  <td></td>
                  <td></td>
                  <td class="fs-4"><strong> ${pedido.total_price.toFixed(
                    2
                  )}€</strong></td>
                </tr>      
</table></div></div>
`;

      $("#modalContentPedido").html(cadenapedido);
    },
  });
}

// Función para descargar el PDF del contenido del modal
document
  .getElementById("download-modal-pdf")
  .addEventListener("click", function () {
    const modalContent = document.getElementById("modalContentPedido");

    // Descargar la imagen y luego generar el PDF
    const imageUrl = "/img/logo_black.png";
    fetch(imageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const image = new Image();
        image.src = URL.createObjectURL(blob);

        image.onload = function () {
          // Insertar la imagen dentro del modal
          modalContent.querySelector("img").src = image.src;

          // Generar y descargar el PDF después de cargar la imagen
          html2pdf()
            .from(modalContent)
            .set({
              format: "a4",
              orientation: "landscape",
              filename: "WTM-Pedido.pdf",
            })
            .save();
        };
      });
  });

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

//CARGA LOS DATOS DEL USUARIO Y LOS MUESTRA
function cargarPERFIL() {
  $.ajax({
    type: "GET",
    url: url_site + `/api/get_user`,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + tokenusu,
    },
    success: function (response) {
      //console.log(response);
      datosUser = response.data;
      //console.log(datosUser);

      if (datosUser.calle == "") {
        $("#infoUsu").append(`
        <p><strong>Nombre:</strong> ${datosUser.name}</p>
        <p><strong>Email:</strong> ${datosUser.email}</p>
        `);
        $("#completaperfil").removeClass("d-none");
        rellenarPerfil();
      } else {
        $("#infoUsu").append(`
        <div class="row">
          <div class="col-sm-6">
            <p><strong>Nombre:</strong> ${datosUser.name}</p>
            <p><strong>Provincia:</strong> ${datosUser.provincia}</p>
            <p><strong>Email:</strong> ${datosUser.email}</p>
          </div>
          <div class="col-sm-6">
          <p><strong>Apellidos:</strong> ${datosUser.surname}</p>
            <p><strong>Calle:</strong> ${datosUser.calle}</p>  
          </div>
        </div>
        `);
      }
    },
  });
}

//MUESTRA EL FORMULARIO PARA TERMINAR DE RELLENAR EL PERFIL
function rellenarPerfil() {
  $("#completaperfil").append(`
  <h4>Acaba de rellenar tu perfil</h4>
  <form class="p-3" id="rellenarPerfilForm">
      <div class="form-group mt-2">
          <label for="nombre">Nombre:</label>
          <input
              type="text"
              class="form-control"
              id="nombre"
              placeholder="${datosUser.name}"
              required
          >
      </div>
      <div class="form-group mt-2">
          <label for="apellido">Apellido:</label>
          <input
              type="text"
              class="form-control"
              id="apellido"
              placeholder="Ingrese su apellido"
              required
          >
      </div>
      <div class="form-group mt-2">
          <label for="provincia">Provincia:</label>
          <input
              type="text"
              class="form-control"
              id="provincia"
              placeholder="Ingrese su provincia"
              required
          >
      </div>
      <div class="form-group mt-2">
          <label for="calle">Calle:</label>
          <input
              type="text"
              class="form-control"
              id="calle"
              placeholder="Ingrese su calle"
              required
          >
      </div>
      <button id="rellenarperfil" class="btn btn-primary mt-2" type="submit">Enviar</button>
  </form>`);

  $("#rellenarPerfilForm").submit(function (event) {
    event.preventDefault();
    //console.log($("#nombre").val() + $("#apellido").val() + $("#provincia").val() +  $("#calle").val());

    $.ajax({
      type: "PUT",
      url: url_site + `/api/update_user`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + tokenusu,
      },
      data: {
        name: $("#nombre").val(),
        surname: $("#apellido").val(),
        provincia: $("#provincia").val(),
        calle: $("#calle").val(),
      },
      success: function (response) {
        //console.log(response);
        window.location.replace("./perfil.html");
      },
    });
  });
}

//MUESTRA EL FORMULARIO DE CAMBIO DE DATOS DEL PERFIL
function rellenarCambioPerfil() {
  $("#completaperfil").append(`
  <h4>Cambia tu perfil</h4>
  <form class="p-3" id="formularioPerfil">
    <div class="form-group mt-2">
          <label for="nombre">Nombre:</label>
          <input
              type="text"
              class="form-control"
              id="nombre"
              placeholder="${datosUser.name}"
              required
          >
      </div>
      <div class="form-group mt-2">
          <label for="apellido">Apellido:</label>
          <input
              type="text"
              class="form-control"
              id="apellido"
              placeholder="${datosUser.surname}"
              required
          >
      </div>
      <div class="form-group mt-2">
          <label for="provincia">Provincia:</label>
          <input
              type="text"
              class="form-control"
              id="provincia"
              placeholder="${datosUser.provincia}"
              required
          >
      </div>
      <div class="form-group mt-2">
          <label for="calle">Calle:</label>
          <input
              type="text"
              class="form-control"
              id="calle"
              placeholder="${datosUser.calle}"
              required
          >
      </div>
      <button type="submit" id="cambioPerfil" class="btn btn-primary mt-2">Enviar</button>
  </form>`);

  $("#formularioPerfil").submit(function (event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional

    $.ajax({
      type: "PUT",
      url: url_site + `/api/update_user`,
      dataType: "json",
      headers: {
        Authorization: "Bearer " + tokenusu,
      },
      data: {
        name: $("#nombre").val(),
        surname: $("#apellido").val(),
        provincia: $("#provincia").val(),
        calle: $("#calle").val(),
      },
      success: function (response) {
        //console.log(response);
        window.location.replace("./perfil.html");
      },
    });
  });
}

btnCesta.addEventListener("click", () => {
  window.location.replace("./cesta/cesta.html");
});

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

      window.location.replace("../index.html");
    },
  });
});

let pulsado = false;
let contado = 0;

//COMPRUEBA SI YA TIENES EL PERFIL RELLENADO, EN ESE CASO LLAMA AL FORM
cambiarDatosPerfil.addEventListener("click", () => {
  if (datosUser.calle == "") {
  } else {
    if (pulsado == false && contado == 0) {
      $("#completaperfil").removeClass("d-none");
      pulsado = true;
      contado++;
      rellenarCambioPerfil();
    } else if (pulsado == false && contado != 0) {
      $("#completaperfil").removeClass("d-none");
      pulsado = true;
    } else if (pulsado == true) {
      $("#completaperfil").addClass("d-none");
      pulsado = false;
    }
  }
});

window.onload = cargarDatos();
