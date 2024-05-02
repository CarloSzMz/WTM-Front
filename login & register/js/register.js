let input_email = document.getElementById("input_email");
let input_passw = document.getElementById("input_passw");
let input_passw_confirm = document.getElementById("input_passw_confirm");
let input_nombre = document.getElementById("input_nombre");

let btnRegister = document.getElementById("btnRegister");

let url_site = `http://localhost:8000`;

btnRegister.addEventListener("click", (event) => {
  event.preventDefault();
  console.log(input_email.value);
  console.log(input_passw.value);
  console.log(input_passw_confirm.value);
  console.log(input_nombre.value);
  if (checkform() == true) {
    console.log("ta bien");

    $.ajax({
      type: "POST",
      url: url_site + `/api/register`,
      dataType: "json",
      data: {
        name: input_nombre.value,
        email: input_email.value,
        password: input_passw.value,
        password_confirmation: input_passw_confirm.value,
      },
      success: function (response) {
        //console.log(response);
        if (!$.trim(response)) {
          // alert('Datos incorrectos - Intente de nuevo para continuar');
          location.reload();
        } else {
          // console.log(response.access_token);
          //sessionStorage.setItem("tokenusu", response.access_token);
          console.log("funciona");
          //console.log(sessionStorage.getItem("tokenusu"));

          window.location.replace("./login.html");
        }
      },
    });
  } else {
    console.log("ta mal");
  }
});

function checkform() {
  let correct = false;
  if (input_passw.value === input_passw_confirm.value) {
    correct = true;
  }
  return correct;
}
