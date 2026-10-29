const input = document.getElementById("user-input");
const button = document.getElementById("send-btn");
const chatBox = document.getElementById("chat-box");

function enviarMensagem() {
    const texto = input.value.trim();

    
    if (texto === "" || input.disabled) {
        return;
    }

    
    const mensagemUsuario = document.createElement("div");
    mensagemUsuario.classList.add("message", "user-message");
    mensagemUsuario.textContent = texto;
    chatBox.appendChild(mensagemUsuario);

    
    input.value = "";

   
    input.disabled = true;
    button.disabled = true;
    input.placeholder = "Aguarde a resposta...";

    
    chatBox.scrollTop = chatBox.scrollHeight;

   
    setTimeout(() => {
        const resposta = document.createElement("div");
        resposta.classList.add("message", "bot-message");
        resposta.textContent = "Ainda estou aprendendo! Em breve poderei responder sua dúvida.";
        
        chatBox.appendChild(resposta);

       
        chatBox.scrollTop = chatBox.scrollHeight;

       
        input.disabled = false;
        button.disabled = false;
        input.placeholder = "type your message...";
        input.focus(); 
    }, 700);
}

button.addEventListener("click", enviarMensagem);

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        
        event.preventDefault(); 
        enviarMensagem();
    }
});

const botao = document.querySelector('.botao-menu');
const menuLateral = document.querySelector('.menu-lateral');

botao.addEventListener('click', () => {
    menuLateral.classList.toggle('ativo');
});
