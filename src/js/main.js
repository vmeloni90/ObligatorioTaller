const baseUrl = "https://dwallet.develotion.com";
let token = obtenerSesionUsuario();
let idUser = obteneridUsuario();

const $ = {};

iniciarApp();

// INICIAR LA APP
function iniciarApp() {
  precargarValores();
  guardarElemento();
  agregarEventos();
}

function precargarValores() {
  precargarSelectDepartamentos();
  precargaSelectCiudades();
}

//*****************Precarga Rubros***********************/
//*******************************************************/
function precargaSelectRubros() {
  const headers = {
    "Content-Type": "application/json",
    apikey: token,
  };

  fetch(`${baseUrl}/rubros.php`, {
    method: "GET",
    headers: headers,
  })
    .then(getJsonBody)
    .then(listaRubros)
    .catch(mostrarError);
}

// then rubros
function listaRubros(rubro) {
  escribirSelectRubros(rubro);
}

function ordenarRubros(jsonResponse) {
  const rub = jsonResponse;
  return rub.sort(function (rub1, rub2) {
    if (rub1.nombre > rub2.nombre) {
      return 1;
    }
    if (rub1.nombre < rub2.nombre) {
      return -1;
    }
    return 0;
  });
}

// Escribir rubros html
function escribirSelectRubros(jsonResponse) {
  const rub = jsonResponse.rubros;
  let rubrosGastos = "";
  let rubrosIngresos = "";

  const rubrosOrdenados = ordenarRubros(rub);

  for (let rubro of rubrosOrdenados) {
    if (rubro.tipo == "gasto") {
      rubrosGastos += `<ion-select-option value=${rubro.id}>${rubro.nombre}</ion-select-option>`;
    } else if (rubro.tipo == "ingreso") {
      rubrosIngresos += `<ion-select-option value=${rubro.id}>${rubro.nombre}</ion-select-option>`;
    }
  }
  document.querySelector("#selRubros").innerHTML = rubrosGastos;
  document.querySelector("#selCategoria").innerHTML = rubrosIngresos;
}

//*************----Precarga Departamentos----*************/
//*******************************************************/
function precargarSelectDepartamentos() {
  const headers = {
    "Content-Type": "application/json",
  };

  fetch(`${baseUrl}/departamentos.php`, {
    method: "GET",
    headers: headers,
  })
    .then(getJsonBody)
    .then(departamento)
    .catch(mostrarError);
}

// then departamento
function departamento(departamento) {
  escribirSelectDepartamentos(departamento);
}

// ordener departamentos a-z
function ordenarDepartamentos(jsonResponse) {
  const deptos = jsonResponse;
  return deptos.sort(function (deptos1, deptos2) {
    if (deptos1.nombre > deptos2.nombre) {
      return 1;
    }
    if (deptos1.nombre < deptos2.nombre) {
      return -1;
    }
    return 0;
  });
}

// Escribir departamento html
function escribirSelectDepartamentos(jsonResponse) {
  const deptos = jsonResponse.departamentos;
  let optionsHtml = "";
  const departamentosOrdenados = ordenarDepartamentos(deptos);

  for (let departamento of departamentosOrdenados) {
    optionsHtml += `<ion-select-option value=${departamento.id}>${departamento.nombre}</ion-select-option>`;
  }

  document.querySelector("#selDepartamento").innerHTML = optionsHtml;
}

//*****************Precarga Ciudades***********************/
//*******************************************************/
function precargaSelectCiudades() {
  let idDepart = document.getElementById("selDepartamento");
  idDepart.addEventListener("ionChange", function () {
    const headers = {
      "Content-Type": "application/json",
    };

    const params = {
      idDepartamento: `${idDepart.value}`,
    };

    fetch(crearUrl(`${baseUrl}/ciudades.php`, params), {
      method: "GET",
      headers: headers,
    })
      .then(getJsonBody)
      .then(ciudad)
      .catch(mostrarError);
  });
}

// then ciudad
function ciudad(ciudad) {
  escribirSelectCiudad(ciudad);
}

// ordener ciudades a-z
function ordenarCidades(jsonResponse) {
  const ciuda = jsonResponse;
  return ciuda.sort(function (ciuda1, ciuda2) {
    if (ciuda1.nombre > ciuda2.nombre) {
      return 1;
    }
    if (ciuda1.nombre < ciuda2.nombre) {
      return -1;
    }
    return 0;
  });
}
function escribirSelectCiudad(jsonResponse) {
  console.log("ciudades", jsonResponse);
  const ciudades = jsonResponse.ciudades;
  let optionsHtml = "";
  const ciudadOrdenados = ordenarCidades(ciudades);

  for (let ciudad of ciudadOrdenados) {
    optionsHtml += `<ion-select-option value=${ciudad.id}">${ciudad.nombre}</ion-select-option>`;
  }

  document.querySelector("#selCiudad").innerHTML = optionsHtml;
}

/* ------------------------------------------------------------------------------------------------------ */
/* ------------------------------------------------------------------------------------------------------ */

// GUARDAR ELEMENTOS
function guardarElemento() {
  $.ionRouter = document.querySelector("ion-router");
  $.menuPrincipal = document.querySelector("ion-menu");
  $.formRegistro = document.querySelector("#formRegistrarUsuario");
  $.formLogin = document.querySelector("#formLoginUsuario");
  $.formNuevoIngreso = document.querySelector("#formNuevoIngreso");
  $.formNuevoGasto = document.querySelector("#formNuevoGasto");
  $.rubros = document.querySelectorAll("#cargaRubros");
  $.logOut = document.querySelectorAll("#btnLogOut");
  $.modalMovimiento = document.querySelector("#modalMovimiento");
}

// AGREGAR EVENTOS
function agregarEventos() {
  $.ionRouter.addEventListener("ionRouteDidChange", manejarRuta);
  $.menuPrincipal
    .querySelectorAll("ion-item")
    .forEach(($item) => $item.addEventListener("click", cerrarMenuPrincipal));
  $.formRegistro.addEventListener("submit", manejarRegistroUsuario);
  $.formLogin.addEventListener("submit", manejarLoginUsuario);
  $.formNuevoIngreso.addEventListener("submit", manejarIngreso);
  $.formNuevoGasto.addEventListener("submit", manejarGasto);
  $.rubros.forEach((rubro) => {
    rubro.addEventListener("click", precargaSelectRubros);
  });
  $.logOut.forEach((btn) => {
    btn.addEventListener("click", manejarLogOut);
  });

  $.modalMovimiento
    .querySelector("#btnCerrarModal")
    .addEventListener("click", cerrarModal);
}

// MANEJAR REGISTRO USUARIO
function manejarRegistroUsuario(e) {
  e.preventDefault();
  const datos = obtenerDatosRegistro();
  registrarUsuario(datos);
}

// OBTENER REGISTRO USUARIO
function obtenerDatosRegistro() {
  return {
    usuario: $.formRegistro.querySelector("#inpUsuario").value,
    password: $.formRegistro.querySelector("#inpPassword").value,
    idDepartamento: $.formRegistro.querySelector("#selDepartamento").value,
    idCiudad: $.formRegistro.querySelector("#selCiudad").value,
  };
}

// MANEJAR LOGIN USUARIO
function manejarLoginUsuario(e) {
  e.preventDefault();
  const datos = obtenerDatosLogin();
  // validamos
  loginUsuario(datos);
}

// OBTENER LOGIN USUARIO
function obtenerDatosLogin() {
  return {
    user: $.formLogin.querySelector("#inpUsuario").value,
    pass: $.formLogin.querySelector("#inpPassword").value,
  };
}

// MANEJO RUTAS
function manejarRuta(event) {
  const path = event.detail.to;
  const sesionValida = validarSesion(path);

  if (sesionValida) {
    ocultarPageActiva();

    switch (path) {
      case "/":
        mostrarPaginas("#page-login");
        break;
      case "/registro":
        mostrarPaginas("#page-registro");
        break;
      case "/menu":
        mostrarPaginas("#page-menu");
        break;
      case "/ingresos":
        mostrarPaginas("#page-ingresos");
        break;
      case "/gastos":
        mostrarPaginas("#page-gastos");
        break;
      case "/movimientos":
        iniciarPageListadoMovimientos();
        mostrarPaginas("#page-movimientos");
        break;
    }
  }
}

// VALIDAR SESION
function validarSesion(path) {
  if (path !== "/" && path !== "/registro" && path !== "/menu") {
    if (token === undefined) {
      navegar("/");
      // sesion no valida
      return false;
    } else {
      // sesion valida
      return true;
    }
  } else {
    return true;
  }
}

// REGISTRAR USUARIO
function registrarUsuario(usuario) {
  const headers = {
    "Content-Type": "application/json",
  };

  const data = {
    usuario: usuario.usuario,
    password: usuario.password,
    idDepartamento: usuario.idDepartamento,
    idCiudad: usuario.idCiudad,
  };
  fetchUsuarios(data)
    .then(function (jsonReposponse) {
      if (jsonReposponse.codigo === 200) {
        navegar("/");
        mostrarToastSuccess("Usuario registrado con éxito");
      } else {
        throw jsonReposponse.mensaje;
      }
    })
    .catch(mostrarError);
}

// LOGIN USUARIO
function loginUsuario(usuario) {
  const headers = {
    "Content-Type": "application/json",
  };

  const data = {
    usuario: usuario.user,
    password: usuario.pass,
  };

  fetch(`${baseUrl}/login.php`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then(function (rawResponse) {
      return rawResponse.json();
    })
    .then(function (jsonReposponse) {
      console.log("login usuaio " + jsonReposponse);
      console.log("login usuaio " + jsonReposponse.id);

      if (jsonReposponse.codigo === 200) {
        guardarSesionUsuario(jsonReposponse.apiKey);
        guardarIdUsuario(jsonReposponse.id);
        navegar("/menu");
      } else {
        throw jsonReposponse.mensaje;
      }
    })
    .catch(mostrarError);
}

// OBTENER USUARIOS POR DEPARTAMENTOS
function obtenerUsuariosPorDepartamentos() {
  const headers = {
    "apikey": token,
    "Content-Type": "application/json",
  };

  fetch(`${baseUrl}/usuariosPorDepartamento.php`, {
    method: "GET",
    headers: headers,
  })
    .then(getJsonBody)
    .then(listaUsuariosPorDepartamentos)
    .catch(mostrarError);
}

// then usuariosPorDepartamentos
function listaUsuariosPorDepartamentos(usuariosPorDep) {
  console.log("usuariosPorDepartamentos", usuariosPorDep);
}

// OBTENER CAJEROS
function obtenerCajeros() {
  const headers = {
    "Content-Type": "application/json",
  };

  fetch(`${baseUrl}/cajeros.php`, {
    method: "GET",
    headers: headers,
  })
    .then(getJsonBody)
    .then(listaCajeros)
    .catch(mostrarError);
}

// then cajeros
function listaCajeros(cajeros) {
  console.log("cajeros", cajeros);
}

// Ocultar y mostrar el password
document.getElementById("mostrar_pwd").onclick = function () {
  //si el elemento tiene como atributo icon fa-eye lo cambio a fa-eye-slash y viceversa.
  if (this.getAttribute("name") == "eye-outline") {
    this.setAttribute("name", "eye-off-outline");
    //cambio tipo de input a password.
    document.getElementById("inpPassword").type = "password";
  } else {
    //ver password
    this.setAttribute("name", "eye-outline");
    //cambio tipo de input a text.
    document.getElementById("inpPassword").type = "submit";
  }
};

// GUARDAR TOKEN USUARIO
function guardarSesionUsuario(apiToken) {
  token = apiToken;
  guardarLocalStorage("tokenUsuario", token);
}

// OBTENER SESION USUARIO
function obtenerSesionUsuario() {
  return leerLocalStorage("tokenUsuario", "");
}

// GUARDAR ID USUARIO
function guardarIdUsuario(idUsuario) {
  idUser = idUsuario;
  guardarLocalStorage("idUsuario", idUser);
}

// OBTENER ID USUARIO
function obteneridUsuario() {
  return leerLocalStorage("idUsuario", "");
}

// --------------------------------------------
// -------- Manejar ingreso gasto -------------
// --------------------------------------------
function manejarIngreso(e) {
  e.preventDefault();
  const datos = obtenerDatosIngreso();
  registrarIngreso(datos);
}

function obtenerDatosIngreso() {
  return {
    idUsuario: idUser,
    concepto: $.formNuevoIngreso.querySelector("#inpConcepto").value,
    categoria: $.formNuevoIngreso.querySelector("#selCategoria").value,
    total: $.formNuevoIngreso.querySelector("#inpTotal").value,
    medio: $.formNuevoIngreso.querySelector("#selMedioPago").value,
    fecha: $.formNuevoIngreso.querySelector("#fechaIngreso").value,
  };
}

function registrarIngreso(ingreso) {
  const headers = {
    "Content-Type": "application/json",
    "apikey": token,
  };

  const data = {
    idUsuario: ingreso.idUsuario,
    concepto: ingreso.concepto,
    categoria: ingreso.categoria,
    total: ingreso.total,
    medio: ingreso.medio,
    fecha: ingreso.fecha,
  };

  fetch(`${baseUrl}/movimientos.php`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then(getJsonBody)
    .then(ingresos)
    .catch(mostrarError);
}

function ingresos(ingreso) {
  console.log("ingreso", ingreso);
  if (ingreso.codigo === 200) {
    navegar("/menu");
    mostrarToastSuccess("Ingreso agregado con éxito");
  } else {
    throw ingreso.error;
  }
}
// --------------------------------------------
// -------- Gastos -------------
// --------------------------------------------

function manejarGasto(e) {
  e.preventDefault();
  const datos = obtenerDatosGasto();
  registrarGasto(datos);
}

function obtenerDatosGasto() {
  return {
    idUsuario: idUser,
    concepto: $.formNuevoGasto.querySelector("#inpConcepto").value,
    rubro: $.formNuevoGasto.querySelector("#selRubros").value,
    total: $.formNuevoGasto.querySelector("#inpTotal").value,
    medio: $.formNuevoGasto.querySelector("#selMedioPago").value,
    fecha: $.formNuevoGasto.querySelector("#fechaGasto").value,
  };
}

function registrarGasto(gasto) {
  const headers = {
    "Content-Type": "application/json",
    "apikey": token,
  };

  const data = {
    idUsuario: gasto.idUsuario,
    concepto: gasto.concepto,
    categoria: gasto.rubro,
    total: gasto.total,
    medio: gasto.medio,
    fecha: gasto.fecha,
  };

  fetch(`${baseUrl}/movimientos.php`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then(getJsonBody)
    .then(gastos)
    .catch(mostrarError);
}

function gastos(gasto) {
  console.log("gasto", gasto);
  if (gasto.codigo === 200) {
    navegar("/menu");
    mostrarToastSuccess("Gasto agregado con éxito");
  } else {
    throw gasto.error;
  }
}

// --------------------------------------------
// -------- Obtener movimientos -------------
// --------------------------------------------

function obtenerMovimientos() {
  const headers = {
    "Content-Type": "application/json",
    "apikey": token,
  };

  const params = {
    idUsuario: idUser,
  };

  fetch(crearUrl(`${baseUrl}/movimientos.php`, params), {
    method: "GET",
    headers: headers,
    params: params,
  })
    .then(getJsonBody)
    .then(escribirMovimiento)
    .catch(mostrarError);
}

// then movimientos
function escribirMovimiento(jsonResponse) {
  console.log(jsonResponse);
  let movimientos = jsonResponse.movimientos;
  let movimientosHtml = "";

  for (let movimiento of movimientos) {
    movimientosHtml += generarMovimientoHtml(movimiento);
  }
  document.querySelector("#listadoMovimientos").innerHTML = movimientosHtml;
}

function generarMovimientoHtml(movimiento) {
  let colorRubro;
  let textoRubro;

  switch (movimiento.categoria) {
    case 1:
      colorRubro = "danger";
      textoRubro = "Gasto";
      break;
    case 2:
      colorRubro = "danger";
      textoRubro = "Gasto";
      break;
    case 3:
      colorRubro = "danger";
      textoRubro = "Gasto";
      break;
    case 4:
      colorRubro = "danger";
      textoRubro = "Gasto";
      break;
    case 5:
      colorRubro = "danger";
      textoRubro = "Gasto";
      break;
    case 6:
      colorRubro = "danger";
      textoRubro = "Gasto";
      break;

    default:
      colorRubro = "success";
      textoRubro = "Ingreso";
      break;
  }

  return /*html*/ `
  <ion-modal trigger="open-modal" id="modalMovimiento">
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button id="btnCerrarModal">Cancel</ion-button>
      </ion-buttons>
      <ion-title>Eliminar movimiento</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <ion-item>
    <ion-button id="">Eliminar movimiento</ion-button>
    </ion-item>
  </ion-content>
</ion-modal>
</ion-content>

  <ion-card color="${colorRubro}">
  <ion-card-header>
    <ion-card-title>${movimiento.concepto}</ion-card-title>
    <ion-card-subtitle><strong>Fecha: </strong>${movimiento.fecha}</ion-card-subtitle>
    <ion-card-subtitle><strong>Total: $ </strong>${movimiento.total}</ion-card-subtitle>
  </ion-card-header>
  <ion-card-content>
  <ion-grid>
  <ion-row>
    <ion-col>${textoRubro}</ion-col>
    <ion-col size="3">
      <ion-button size="small" color="warning" id="open-modal">
      <ion-icon name="skull-outline"></ion-icon>
      </ion-button>
    </ion-col>
  </ion-row>
</ion-grid>
  </ion-card-content>
</ion-card>
`;
}

function cerrarModal() {
  $.modalMovimiento.dismiss();
}

function iniciarPageListadoMovimientos() {
  obtenerMovimientos();
}

// --------------------------------------------
// -------------- Log out ---------------------
// --------------------------------------------
function manejarLogOut() {
  localStorage.clear();
  navegar("/");
}

// --------------------------------------------
// --------------- Utils ----------------------
// --------------------------------------------

function crearUrl(baseUrl, params) {
  const urlObj = new URL(baseUrl);
  urlObj.search = new URLSearchParams(params).toString();
  return urlObj.href;
}

function guardarLocalStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function leerLocalStorage(clave, valorPorDefecto) {
  const valorStorage = JSON.parse(localStorage.getItem(clave));

  if (valorStorage === null) {
    return valorPorDefecto;
  } else {
    return valorStorage;
  }
}

function fetchUsuarios(data) {
  return fetchPost(`${baseUrl}/usuarios.php`, data);
}
function fetchPost(url, data) {
  const headers = {
    "Content-Type": "application/json",
  };

  return fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  }).then(getJsonBody);
}
function mostrarToastSuccess(mensaje) {
  mostrarToast(mensaje, "success");
}
function mostrarToast(mensaje, color) {
  const $toast = document.createElement("ion-toast");
  $toast.message = mensaje;
  $toast.duration = 3000;
  $toast.color = color;

  document.body.appendChild($toast);
  $toast.present();
}

// MOSTRAR PAGINAS
function mostrarPaginas(id) {
  document.querySelector(id).classList.add("page-activa");
}

// NAVEGAR ENTRE LAS PAGINAS
function navegar(path) {
  $.ionRouter.push(path);
}

// MOSTRAR ERRORES
function mostrarError(error) {
  console.warn(error);
}

// GET JSON
function getJsonBody(response) {
  return response.json();
}

// Ocultar paginas
function ocultarPageActiva() {
  const $pageActive = document.querySelector(".page-activa");
  if ($pageActive) {
    $pageActive.classList.remove("page-activa");
  }
}

// CERRAR MENU PRINCIPAL AL SELECCIONAR UN ITEM
function cerrarMenuPrincipal() {
  $.menuPrincipal.close();
}
