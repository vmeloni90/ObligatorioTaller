/*export function crearUrl(baseUrl, params) {
  const urlObj = new URL(baseUrl);
  urlObj.search = new URLSearchParams(params).toString();
  return urlObj.href;
}

export function guardarLocalStorage(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

export function leerLocalStorage(clave, valorPorDefecto) {
  const valorStorage = JSON.parse(localStorage.getItem(clave));

  if (valorStorage === null) {
    return valorPorDefecto;
  } else {
    return valorStorage;
  }
}*/
