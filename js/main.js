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
  precargaSelectRubros();
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
  token = rubro.apikey;
  console.log(rubro);
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
  console.log("ordenados", jsonResponse);
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
  console.log("ordenadosCiudades", jsonResponse);
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
  $.logOut = document.querySelector("#btnLogOut");
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
  $.logOut.addEventListener("click", manejarLogOut);
}

// CERRAR MENU PRINCIPAL AL SELECCIONAR UN ITEM
function cerrarMenuPrincipal() {
  $.menuPrincipal.close();
}

// MANEJAR REGISTRO USUARIO
function manejarRegistroUsuario(e) {
  e.preventDefault();

  const datos = obtenerDatosRegistro();
  console.log("registro", datos);

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
  console.log("login", datos);

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
  console.log("ruta", path);

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

// MOSTRAR PAGINAS
function mostrarPaginas(id) {
  document.querySelector(id).classList.add("page-activa");
}

// NAVEGAR ENTRE LAS PAGINAS
function navegar(path) {
  $.ionRouter.push(path);
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

  fetch(`${baseUrl}/usuarios.php`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  })
    .then(getJsonBody)
    .then(registro)
    .catch(mostrarError);
}

// then Registro
function registro(registro) {
  console.log("registro", registro);
  if (registro.codigo === 200) {
    navegar("/");
  } else {
    throw registro.error;
  }
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
    .then(getJsonBody)
    .then(login)
    .catch(mostrarError);
}

// then Login  -
function login(responseJson) {
  console.log("then login", responseJson);
  if (responseJson.codigo === 200) {
    guardarSesionUsuario(responseJson.apiKey);
    guardarIdUsuario(responseJson.id);
    navegar("/menu");
  } else {
    throw login.error;
  }
}

// OBTENER USUARIOS POR DEPARTAMENTOS
function obtenerUsuariosPorDepartamentos() {
  const headers = {
    apikey: token,
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
  token = usuariosPorDep.apiKey;
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

// MOSTRAR ERRORES
function mostrarError(error) {
  console.warn(error);
}

// GET JSON
function getJsonBody(response) {
  // podemos validar el status
  return response.json();
}

// Ocultar paginas
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
  console.log("ingreso", datos);
  registrarIngreso(datos);
}

function obtenerDatosIngreso() {
  return {
    idUsuario: idUser,
    concepto: $.formNuevoIngreso.querySelector("#inpConcepto").value,
    categoria: $.formNuevoIngreso.querySelector("#selCategoria").value,
    total: $.formNuevoIngreso.querySelector("#inpTotal").value,
    medio: $.formNuevoIngreso.querySelector("#selMedioPago").value,
    //fecha:
  };
}

function registrarIngreso(ingreso) {
  const headers = {
    "Content-Type": "application/json",
    apikey: token,
  };

  const data = {
    concepto: ingreso.concepto,
    categoria: ingreso.categoria,
    total: ingreso.total,
    medio: ingreso.medio,
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
  token = ingreso.apikey;
  if (ingreso.codigo === 200) {
    navegar("/menu");
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
    //fecha:
  };
}

function registrarGasto(gasto) {
  const headers = {
    "Content-Type": "application/json",
    apikey: token,
  };

  const data = {
    concepto: gasto.concepto,
    rubro: gasto.rubro,
    total: gasto.total,
    medio: gasto.medio,
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
  token = gasto.apikey;
  if (gasto.codigo === 200) {
    navegar("/menu");
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
    apikey: token,
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
    .then((jsonResponse) => {
      escribirMovimiento(jsonResponse.movimientos);
    })
    .catch(mostrarError);
}

// then movimientos
function escribirMovimiento(movimientos) {
  token = movimientos.apikey;
  let movimientosHtml = "";

  for (let movimiento of movimientos) {
    movimientosHtml += generarMovimientoHtml(movimiento);
  }
  document.querySelector("#listadoMovimientos").innerHTML = movimientosHtml;
  console.log("movimientos", movimientos);
}

function generarMovimientoHtml(movimiento) {
  //let colorRubro;

  return /*html*/ `
  <ion-list>
  <ion-item>
    <ion-label>${movimiento.concepto}</ion-label>
    <ion-badge color="primary">${movimiento.categoria}</ion-badge>
  </ion-item>
</ion-list>
`;
}

function iniciarPageListadoMovimientos() {
  obtenerMovimientos();
}

// --------------------------------------------
// -------------- Log out ---------------------
// --------------------------------------------
function manejarLogOut() {
  token = null;
  guardarSesionUsuario(token);
  guardarIdUsuario(null);
  navegar("/");
}
