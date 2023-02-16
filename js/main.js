const baseUrl = "https://dwallet.develotion.com/";
let token = obtenerSesionUsuario();

const $ = {};

iniciarApp();
function iniciarApp() {
  guardarElementos();
  agregarEventos();
}
function guardarElementos() {
  $.ionRouter = document.querySelector("ion-router");
  $.formRegistro = document.querySelector("#formRegistroUsuario");
  $.formLogin = document.querySelector("#formLoginUsuario");
}

function agregarEventos() {
  $.ionRouter.addEventListener("ionRouteDidChange", manejarRuta);
  $.formRegistro.addEventListener("submit", manejarRegistroUsuario);
  $.formLogin.addEventListener("submit", manejarLoginUsuario);
}

function manejarRegistroUsuario(event) {
  event.preventDefault();

  const datos = obtenerDatosRegistro();
  console.log("registro", datos);

  registrarUsuario(datos);
}

function registrarUsuario(usuario) {
  const headers = {
    "Content-Type": "application/json",
  };

  const data = {
    usuario: usuario.usuario,
    password: usuario.password,
    departamento: usuario.departamento,
    ciudad: usuario.ciudad,
    
  };

  fetch(`${baseUrl}/usuarios`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then(function (rawResponse) {
      return rawResponse.json();
    })
    .then(function (jsonReposponse) {
      console.log("then registro", jsonReposponse);
      if (jsonReposponse.error === "") {
        navegar("/login");
      } else {
        throw jsonReposponse.error;
      }
    })
    .catch(function (error) {
      console.warn(error);
    });
}

function navegar(path) {
  $.ionRouter.push(path);
}

function manejarLoginUsuario(event) {
  event.preventDefault();

  const datos = obtenerDatosLogin();
  console.log("login", datos);

  // Validamos

  loginUsuario(datos);
}

function obtenerDatosRegistro() {
  return {
    usuario: $.formRegistro.querySelector("#inpUsuario").value,
    password: $.formRegistro.querySelector("#inpPassword").value,
    departamento: $.formRegistro.querySelector("#selDepartamento").value,
    ciudad: $.formRegistro.querySelector("#selCiudad").value,
    
  };
}
function obtenerDatosLogin() {
  return {
    email: $.formLogin.querySelector("#inp_usuario").value,
    password: $.formLogin.querySelector("#inp_password").value,
  };
}


function manejarRuta(event) {
  const path = event.detail.to;
  console.log("ruta", path);

  ocultarPageActiva();
  switch (path) {
    case "/":
      mostrarPagina("#page-home");
      break;
    case "/registro":
      mostrarPagina("#page-registro");
      break;
    case "/login":
      mostrarPagina("#page-login");
      break;
  }
}

function loginUsuario(usuario) {
  const headers = {
    "Content-Type": "application/json",
  };

  const data = {
    email: usuario.email,
    password: usuario.password,
  };

  fetch(`${baseUrl}/usuarios/session`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then(function (rawResponse) {
      return rawResponse.json();
    })
    .then(function (jsonReposponse) {
      console.log("then login", jsonReposponse);
      if (jsonReposponse.error === "") {
        guardarSesionUsuario(jsonReposponse.data.token);
        navegar("/");
      } else {
        throw jsonReposponse.error;
      }
    })
    .catch(function (error) {
      console.warn(error);
    });
}

function ocultarPageActiva() {
  const $pageActive = document.querySelector(".page-activa");
  if ($pageActive) {
    $pageActive.classList.remove("page-activa");
  }
}

function mostrarPagina(id) {
  document.querySelector(id).classList.add("page-activa");
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

function obtenerSesionUsuario() {
  return leerLocalStorage("tokenUsuario", "");
}