// Botón para ocultar y mostrar el menú lateral en pantallas grandes.
// En el móvil no hace falta: Material ya tiene su propio botón de menú.
(function () {
  var CLAVE = "menu-oculto";

  function leerPreferencia() {
    try { return localStorage.getItem(CLAVE) === "1"; } catch (e) { return false; }
  }

  function guardarPreferencia(oculto) {
    try { localStorage.setItem(CLAVE, oculto ? "1" : "0"); } catch (e) { /* sin almacenamiento: no pasa nada */ }
  }

  function aplicar(oculto, boton) {
    document.body.classList.toggle("menu-oculto", oculto);
    if (boton) {
      boton.setAttribute("aria-expanded", oculto ? "false" : "true");
      boton.title = oculto ? "Mostrar menú" : "Ocultar menú";
    }
  }

  function iniciar() {
    var cabecera = document.querySelector(".md-header__inner");
    if (!cabecera || document.querySelector(".boton-menu")) return;

    var boton = document.createElement("button");
    boton.className = "md-header__button md-icon boton-menu";
    boton.type = "button";
    boton.setAttribute("aria-label", "Mostrar u ocultar el menú");
    boton.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"/></svg>';

    var logo = cabecera.querySelector(".md-logo");
    cabecera.insertBefore(boton, logo ? logo.nextSibling : cabecera.firstChild);

    aplicar(leerPreferencia(), boton);

    boton.addEventListener("click", function () {
      var oculto = !document.body.classList.contains("menu-oculto");
      aplicar(oculto, boton);
      guardarPreferencia(oculto);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
