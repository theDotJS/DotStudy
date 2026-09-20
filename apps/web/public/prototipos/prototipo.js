/* =============================================================
   DotStudy - prototipo. Comportamento compartilhado.

   O CSS ja tinha as classes .ativo escritas, mas nao existia nenhum
   arquivo .js no projeto: o menu nunca abria. Este arquivo fecha isso.
   ============================================================= */

(function () {
  "use strict";

  // ---- Menu lateral ----
  var botao = document.querySelector(".botao-menu");
  var menu = document.querySelector(".menu-lateral");
  var conteudo = document.querySelector(".conteudo");

  function alternarMenu() {
    var aberto = menu.classList.toggle("ativo");
    botao.classList.toggle("ativo", aberto);
    if (conteudo) {
      conteudo.classList.toggle("ativo", aberto);
    }
    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
  }

  if (botao && menu) {
    botao.addEventListener("click", alternarMenu);

    // Esc fecha o menu. Sem isso, quem abre por teclado fica preso.
    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && menu.classList.contains("ativo")) {
        alternarMenu();
        botao.focus();
      }
    });
  }

  // ---- Campos que aceitam somente digitos ----
  // Estava como atributo oninput="" dentro do HTML. Saiu do markup.
  var camposNumericos = document.querySelectorAll("[data-somente-digitos]");
  Array.prototype.forEach.call(camposNumericos, function (campo) {
    campo.addEventListener("input", function () {
      campo.value = campo.value.replace(/[^0-9]/g, "");
    });
  });
})();
