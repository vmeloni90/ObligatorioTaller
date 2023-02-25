const baseUrl2 = "https://dwallet.develotion.com";

inicializarApp();

function inicializarApp() {
  precargarValores();
}

function precargarValores() {
  precargarSelectDepartamentos();
  precargaSelectCiudades();
}

// precarga select departamentos
function precargarSelectDepartamentos() {
  const headers = {
    "Content-Type": "application/json",
  };

  fetch(`${baseUrl2}/departamentos.php`, {
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
  console.log("departamentos", jsonResponse);
  const deptos = jsonResponse.departamentos;
  let optionsHtml = "";
  const departamentosOrdenados = ordenarDepartamentos(deptos);

  for (let departamento of departamentosOrdenados) {
    optionsHtml += `<ion-select-option value=${departamento.id}>${departamento.nombre}</ion-select-option>`;
  }

  document.querySelector("#selDepartamento").innerHTML = optionsHtml;
}

// Escribir ciudad html
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

// precarga select departamentos
function precargaSelectCiudades() {
  let idDepart = document.getElementById("selDepartamento");
  idDepart.addEventListener("ionChange", function () {
    console.log(idDepart.value);

    const headers = {
      "Content-Type": "application/json",
    };

    fetch(
      `https://dwallet.develotion.com/ciudades.php?idDepartamento=${idDepart.value}`,
      {
        method: "GET",
        headers: headers,
      }
    )
      .then(getJsonBody)
      .then(ciudad)
      .catch(mostrarError);
  });
}

// then ciudad
function ciudad(ciudad) {
  escribirSelectCiudad(ciudad);
}

// ordener departamentos a-z
function ordenarCiudad(jsonResponse) {
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

// ordener departamentos a-z
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

// MOSTRAR ERRORES
function mostrarError(error) {
  console.warn(error);
}

// GET JSON
function getJsonBody(response) {
  // podemos validar el status
  return response.json();
}
