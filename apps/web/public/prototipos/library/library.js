const botao = document.querySelector('.botao-menu')
const menuLateral = document.querySelector('.menu-lateral')
       

botao.addEventListener('click', () => {
    menuLateral.classList.toggle('ativo')
})
