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
        navegar("/");
        break;
      case "/menu":
        if(token != "" && idUser!="") {
          mostrarPaginas("#page-menu");
        }else{
          navegar("/");
        }
        break;
      case "/ingresos":
        if(token != "" && idUser!="") {
          mostrarPaginas("#page-ingresos");
        }else{
          navegar("/");
        }
        break;
      case "/gastos":
        if(token != "" && idUser!="") {
          mostrarPaginas("#page-gastos");
        }else{
          navegar("/");
        }
        break;
      case "/movimientos":
        if(token != "" && idUser!="") {
          iniciarPageListadoMovimientos();
          mostrarPaginas("#page-movimientos");
        }else{
          navegar("/");
        }
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
function escribirMovimiento(jsonResponse, tipo) {
  let movimientos = jsonResponse.movimientos;
  let movimientosHtml = "";
  let totalIngresos =0;
  let totalGastos = 0;
  let categoriaIngreso = [7, 8, 9, 10, 11, 12];
  let categoriaGasto = [1, 2, 3, 4, 5,6]; 
  let colorRubro;
  let textoRubro;

  for (let movimiento of movimientos) {
    if(categoriaIngreso.indexOf(movimiento.categoria) != -1 && (typeof tipo === 'undefined' || tipo.toLowerCase() == "ingreso")){
      totalIngresos += movimiento.total;
      colorRubro = "success";
      textoRubro = "Ingreso";
      movimientosHtml += generarMovimientoHtml(movimiento, colorRubro, textoRubro);

    }else if(categoriaGasto.indexOf(movimiento.categoria) != -1 && (typeof tipo === 'undefined' || tipo.toLowerCase() == "gasto")) {
      totalGastos += movimiento.total;
      colorRubro = "danger";
      textoRubro = "Gasto";
      movimientosHtml += generarMovimientoHtml(movimiento, colorRubro, textoRubro);

    }

  }
  let subTotal = totalIngresos -totalGastos;
  document.querySelector("#listadoMovimientos").innerHTML =  
  /*html*/ `  
  <ion-row size="3">
    <ion-button onClick="filtrarIngresos()"
    size="medium"
    expand="block"
    shape="round" color = "success">Ingresos
    <ion-icon name="trending-up-outline" slot="end"></ion-icon>
    </ion-button> 
    <ion-button onClick="filtrarGastos()"
    size="medium" 
    expand="block"
    shape="round" color ="danger">Gastos
    <ion-icon
      name="trending-down-outline"
      slot="end"></ion-icon>
    </ion-button>
    <ion-button onClick="obtenerMovimientos()"
    size="medium" 
    expand="block"
    shape="round">Todos los Movimientos
    <ion-icon
      name="swap-horizontal-outline"
      slot="end"></ion-icon>
    </ion-button>
  </ion-row>`+ movimientosHtml + 
  /*html*/ ` 
  <ion-card>
    <ion-card-header>
      <ion-card-title color="success">Total Ingresos: ${totalIngresos}</ion-card-title>
      <ion-card-title color="danger">Total Gastos: ${totalGastos}</ion-card-title>
      <ion-card-title color="dark">Saldo Restante: ${subTotal}</ion-card-title>
    </ion-card-header>
  </ion-card> `;
}

function generarMovimientoHtml(movimiento, colorRubro, textoRubro) {
  return /*html*/ `
  <ion-card>
  <ion-card-header>
  <ion-card-title color="${colorRubro}">${textoRubro}</ion-card-title>
    <ion-card-title>${movimiento.concepto}</ion-card-title>
    <ion-card-subtitle><strong>Fecha: </strong>${movimiento.fecha}</ion-card-subtitle>
    <ion-card-subtitle><strong>Total: $ </strong>${movimiento.total}</ion-card-subtitle>
  </ion-card-header>
  <ion-card-content>
  <ion-grid>
  <ion-row>
    <ion-col></ion-col>
    <ion-col size="1">
      <ion-button size="medium" color="danger" onClick="deleteMovimiento(${movimiento.id})">
      <ion-icon name="trash"></ion-icon>
      </ion-button>
    </ion-col>
  </ion-row>
</ion-grid>
  </ion-card-content>
</ion-card>
`;
}

function iniciarPageListadoMovimientos() {
  obtenerMovimientos();
}

// Funcion que elimina movimiento a partir del botón de eliminar del html, donde se pasa por parámetro
// el id del movimiento en cuestión.
function deleteMovimiento(id) {
  const headers = {
    "Content-Type": "application/json",
    "apikey": token,
  };

  const data = {
    idMovimiento: id,
  };

  fetch(`${baseUrl}/movimientos.php`, {
    method: "DELETE",
    headers: headers,
    body: JSON.stringify(data),
  })
  .then(getJsonBody)
  .then(verificarEliminacion)
  .catch(mostrarError);
}

// Verificamos el codigo de respuesta de la api, si es un 200 (qes decir que elimino el movimiento)
// recargo la pagina de movimientos y muestro mensaje de exito.
function verificarEliminacion(movimientoEliminado) {
  if (movimientoEliminado.codigo === 200) {
    //vuelvo a cosultar los movimientos, verificando asi que se haya eliminado de la lista
    obtenerMovimientos();
    mostrarToastSuccess("Movimiento Eliminado Correctamente");
  } else {
    throw movimientoEliminado.error;
  }

}

function filtrarIngresos() {
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
 .then(function (rawResponse) {
  return rawResponse.json();
})
.then(function (jsonResponse) {
  if (jsonResponse.codigo === 200) {
    escribirMovimiento(jsonResponse, "ingreso");
  } else {
    throw jsonResponse.mensaje;
  }
})
.catch(mostrarError);
}

function filtrarGastos() {
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
  .then(function (rawResponse) {
   return rawResponse.json();
 })
 .then(function (jsonResponse) {
   if (jsonResponse.codigo === 200) {
     escribirMovimiento(jsonResponse, "gasto");
   } else {
     throw jsonResponse.mensaje;
   }
 })
 .catch(mostrarError);
 }


// --------------------------------------------
// -------------- Log out ---------------------
// --------------------------------------------
function manejarLogOut() {
  localStorage.clear();
  token = obtenerSesionUsuario();
  idUser = obteneridUsuario();
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
function mostrarToastError(mensaje) {
  mostrarToast(mensaje, "danger");
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
  mostrarToastError(error)
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
