document
  .querySelector("ion-router")
  .addEventListener("ionRouteDidChange", manejarRuta);

function manejarRuta(event) {
  const path = event.detail.to;
  console.log("ruta", path);

  ocultarPageActiva();
  switch (path) {
    case "/":
      document.querySelector("#page-home").classList.add("page-activa");
      break;
    case "/registro":
      document.querySelector("#page-registro").classList.add("page-activa");
      break;
    case "/login":
      document.querySelector("#page-login").classList.add("page-activa");
      break;
  }
}

function ocultarPageActiva() {
  const $pageActive = document.querySelector(".page-activa");
  if ($pageActive) {
    $pageActive.classList.remove("page-activa");
  }
}

// Ocultar y mostrar el password
document.getElementById("mostrar_pwd").onclick = function () {
  //si el elemento tiene como atributo icon fa-eye lo cambio a fa-eye-slash y viceversa.
  if (this.getAttribute("name") == "eye-outline") {
    this.setAttribute("name", "eye-off-outline");
    //cambio tipo de input a password.
    document.getElementById("inp_password").type = "password";
  } else {
    //ver password
    this.setAttribute("name", "eye-outline");
    //cambio tipo de input a text.
    document.getElementById("inp_password").type = "text";
  }
};
