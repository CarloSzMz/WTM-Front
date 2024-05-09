let url_site = "http://52.205.64.156";


$(document).ready(function () {
  $("#formregister").submit(function (event) {
    event.preventDefault();

    // Obtener los valores de los campos
    let input_email = $("#input_email").val();
    let input_passw = $("#input_passw").val();
    let input_passw_confirm = $("#input_passw_confirm").val();
    let input_nombre = $("#input_nombre").val();

    // Verificar si las contraseñas coinciden
    if (input_passw === input_passw_confirm) {
      $.ajax({
        type: "POST",
        url: url_site + `/api/register`,
        dataType: "json",
        data: {
          name: input_nombre,
          email: input_email,
          password: input_passw,
          password_confirmation: input_passw_confirm
        },
        success: function (response) {
          if (!$.trim(response)) {
            location.reload();
          } else {
            window.location.replace("./login.html");
          }
        },
        error: function (xhr, status, error) {
          console.log(xhr.responseText);
          alert("Ocurrió un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.");
        }
      });
    } else {
      alert("Las contraseñas no coinciden");
    }
  });
});