const botao = document.querySelector('.botao-menu')
const menuLateral = document.querySelector('.menu-lateral')
const conteudo = document.querySelector('.conteudo') 
const World = document.querySelector('.World')       

botao.addEventListener('click', () => {
    menuLateral.classList.toggle('ativo')
    conteudo.classList.toggle('ativo')
    World.classList.toggle('ativo')
})
