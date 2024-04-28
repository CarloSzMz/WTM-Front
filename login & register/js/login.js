let input_email = document.getElementById("input_email");
let input_passw = document.getElementById("input_passw");
let btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", (event) => {
  event.preventDefault();

  var email = input_email.value;
  // console.log(email);
  var password = input_passw.value;
  // console.log(password);

  $.ajax({
    type: "POST",
    url: `http://localhost:8000/api/login`,
    dataType: "json",
    data: {
      email: email,
      password: password,
    },
    success: function (response) {
      //console.log(response);
      if (!$.trim(response)) {
        // alert('Datos incorrectos - Intente de nuevo para continuar');
        location.reload();
      } else {
       // console.log(response.access_token);
        sessionStorage.setItem("tokenusu", response.access_token);

        //console.log(sessionStorage.getItem("tokenusu"));

        window.location.replace("../index.html");
      }
    },
  });
});
