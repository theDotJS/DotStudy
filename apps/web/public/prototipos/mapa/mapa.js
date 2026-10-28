// Mapa de Níveis: mockup.
// `progressoInicial` tem a mesma forma da resposta de GET /me/progress (docs/contrato-api.md),
// para que a tela real só troque esta constante por um fetch.

const NOTA_DE_CORTE = 70
const QUESTOES_POR_NIVEL = 5

// Trilha de exemplo. A matéria real é definida pela Gabrielly (docs/formato-do-conteudo.md).
const trilha = {
    titulo: 'Normalização de Banco de Dados',
    descricao: 'Como organizar tabelas para que um dado nunca se repita nem se contradiga.',
}

const progressoInicial = {
    trilhaId: 'trilha-exemplo',
    niveis: [
        { nivelId: 'n1', ordem: 1, titulo: 'O que é um banco relacional', estado: 'concluido', melhorPercentual: 100 },
        { nivelId: 'n2', ordem: 2, titulo: 'Tabelas, linhas e colunas', estado: 'concluido', melhorPercentual: 80 },
        { nivelId: 'n3', ordem: 3, titulo: 'Chave primária', estado: 'concluido', melhorPercentual: 80 },
        { nivelId: 'n4', ordem: 4, titulo: 'Chave estrangeira', estado: 'concluido', melhorPercentual: 100 },
        { nivelId: 'n5', ordem: 5, titulo: 'Dependência funcional', estado: 'disponivel', melhorPercentual: null },
        { nivelId: 'n6', ordem: 6, titulo: 'Primeira Forma Normal (1FN)', estado: 'bloqueado', melhorPercentual: null },
        { nivelId: 'n7', ordem: 7, titulo: 'Segunda Forma Normal (2FN)', estado: 'bloqueado', melhorPercentual: null },
        { nivelId: 'n8', ordem: 8, titulo: 'Terceira Forma Normal (3FN)', estado: 'bloqueado', melhorPercentual: null },
        { nivelId: 'n9', ordem: 9, titulo: 'Forma Normal de Boyce-Codd', estado: 'bloqueado', melhorPercentual: null },
        { nivelId: 'n10', ordem: 10, titulo: 'Normalizando um caso real', estado: 'bloqueado', melhorPercentual: null },
    ],
}

// Deslocamento horizontal de cada nível, em px. Repete a cada 8 para formar a curva.
const CURVA = [0, 70, 110, 70, 0, -70, -110, -70]

const ICONES = {
    concluido: 'fa-solid fa-check',
    disponivel: 'fa-solid fa-star',
    bloqueado: 'fa-solid fa-lock',
}

// Orelhas de gato por cima de cada bolinha. A base de cada orelha entra no círculo,
// então não aparece emenda; a cor vem do estado do nó (mapa.css, .orelha).
const ORELHAS = `
    <svg class="orelhas" viewBox="0 0 100 50" aria-hidden="true">
        <path class="orelha" d="M12 50 L17 6 Q18 1 22 4 L46 46 Z"/>
        <path class="orelha" d="M88 50 L83 6 Q82 1 78 4 L54 46 Z"/>
        <path class="orelha-dentro" d="M20 40 L21.5 14 L36 38 Z"/>
        <path class="orelha-dentro" d="M80 40 L78.5 14 L64 38 Z"/>
    </svg>`

let niveis = clonar(progressoInicial.niveis)

const corpo = document.body
const caminho = document.querySelector('.caminho')
const lista = document.querySelector('.niveis')
const trilhoBase = document.querySelector('.trilho-base')
const trilhoFeito = document.querySelector('.trilho-feito')
const patas = document.querySelector('.patas')
const balao = document.querySelector('.balao')
const aviso = document.querySelector('.aviso')
const botaoMenu = document.querySelector('.botao-menu')
const menuFundo = document.querySelector('.menu-fundo')
const botaoContinuar = document.querySelector('.botao-continuar')

let noDoBalao = null
let temporizadorAviso = null
// Quando um nível é aprovado, as patinhas a partir deste ponto do trilho "pisam" em sequência.
let patasNovasDesde = null

function clonar(valor) {
    return JSON.parse(JSON.stringify(valor))
}

function acertos(percentual) {
    return Math.round((percentual / 100) * QUESTOES_POR_NIVEL)
}

function nivelAtual() {
    return niveis.find((nivel) => nivel.estado === 'disponivel')
}

// ---------- Desenho do caminho ----------

function desenhar({ concluido, liberado, tremido } = {}) {
    fecharBalao()
    lista.innerHTML = ''

    niveis.forEach((nivel, indice) => {
        const x = CURVA[indice % CURVA.length]
        const lado = x > 0 ? 'esquerda' : 'direita'

        const item = document.createElement('li')
        item.className = `nivel nivel-${nivel.estado}`
        if (nivel.ordem === concluido) item.classList.add('recem-concluido')
        if (nivel.ordem === liberado) item.classList.add('recem-liberado')
        if (nivel.ordem === tremido) item.classList.add('tremer')

        const ancora = document.createElement('div')
        ancora.className = 'nivel-ancora'
        ancora.style.setProperty('--x', x)

        // RN-07: nível bloqueado não é clicável, então nem vira botão.
        const no = document.createElement(nivel.estado === 'bloqueado' ? 'span' : 'button')
        no.className = `no no-${nivel.estado}`
        no.dataset.ordem = nivel.ordem
        no.innerHTML = `${ORELHAS}<i class="${ICONES[nivel.estado]}" aria-hidden="true"></i>`

        if (nivel.estado === 'bloqueado') {
            no.setAttribute('role', 'img')
            no.setAttribute('aria-label', `Nível ${nivel.ordem}, ${nivel.titulo}: bloqueado`)
            no.title = `Conclua o nível ${nivel.ordem - 1} para liberar`
        } else {
            no.type = 'button'
            no.setAttribute('aria-haspopup', 'dialog')
            no.setAttribute('aria-label', `Nível ${nivel.ordem}, ${nivel.titulo}: ${nivel.estado === 'concluido' ? `concluído com ${nivel.melhorPercentual}%` : 'disponível'}`)
            no.addEventListener('click', (evento) => {
                evento.stopPropagation()
                alternarBalao(no, nivel)
            })
        }

        if (nivel.estado === 'concluido') {
            no.insertAdjacentHTML('beforeend', `<span class="nota" aria-hidden="true">${nivel.melhorPercentual}%</span>`)
        }

        if (nivel.estado === 'disponivel') {
            no.insertAdjacentHTML('beforeend', '<span class="convite" aria-hidden="true">Começar</span>')
        }

        const rotulo = document.createElement('span')
        rotulo.className = `rotulo rotulo-${lado}`
        rotulo.setAttribute('aria-hidden', 'true')
        rotulo.innerHTML = `<span class="rotulo-ordem">Nível ${nivel.ordem}</span><span class="rotulo-titulo">${nivel.titulo}</span>`

        ancora.append(no, rotulo)
        item.append(ancora)
        lista.append(item)
    })

    lista.append(criarFim())
    atualizarCartao()
    posicionar()
}

function criarFim() {
    const indice = niveis.length
    const x = CURVA[indice % CURVA.length]
    const lado = x > 0 ? 'esquerda' : 'direita'
    const completa = niveis.every((nivel) => nivel.estado === 'concluido')

    const item = document.createElement('li')
    item.className = 'nivel nivel-fim'
    item.innerHTML = `
        <div class="nivel-ancora" style="--x: ${x}">
            <span class="no no-fim${completa ? ' aberto' : ''}" role="img" aria-label="${completa ? 'Trilha concluída' : 'Fim da trilha'}">
                ${ORELHAS}
                <i class="fa-solid fa-trophy" aria-hidden="true"></i>
            </span>
            <span class="rotulo rotulo-${lado}" aria-hidden="true">
                <span class="rotulo-ordem">Fim da trilha</span>
                <span class="rotulo-titulo">${completa ? 'Trilha concluída!' : `Conclua os ${niveis.length} níveis`}</span>
            </span>
        </div>`
    return item
}

// Mede o centro de cada nó já posicionado e desenha o trilho de patinhas por eles.
function posicionar() {
    const base = caminho.getBoundingClientRect()
    const nos = [...lista.querySelectorAll('.no')]
    const centros = nos.map((no) => {
        const caixa = no.getBoundingClientRect()
        return {
            x: caixa.left - base.left + caixa.width / 2,
            y: caixa.top - base.top + caixa.height / 2,
            // offsetWidth ignora o scale das animações de carimbo/liberação.
            raio: no.offsetWidth / 2,
        }
    })

    if (centros.length === 0) return

    const atual = nivelAtual()
    const indiceAtual = atual ? atual.ordem - 1 : niveis.length

    trilhoBase.setAttribute('d', curvaPor(centros))
    trilhoFeito.setAttribute('d', curvaPor(centros.slice(0, indiceAtual + 1)))

    // O trilho feito é o começo exato do trilho base, então o comprimento dele diz até onde pintar.
    const feito = trilhoFeito.getAttribute('d') ? trilhoFeito.getTotalLength() : 0
    desenharPatas(centros, feito)

    if (noDoBalao) posicionarBalao(noDoBalao)
}

// Espalha patinhas ao longo da curva, alternando esquerda e direita como pegadas,
// e pula os trechos que ficam por baixo das bolinhas: acima, as orelhas; abaixo, a nota.
function desenharPatas(centros, feito) {
    const total = trilhoBase.getTotalLength()
    const passo = 22
    const tamanho = 15
    let lado = 1
    let novas = 0
    let html = ''

    const coberto = (ponto) => centros.some((c) => {
        const folga = ponto.y < c.y ? c.raio * 0.65 + 6 : 16
        return Math.hypot(c.x - ponto.x, c.y - ponto.y) < c.raio + folga
    })

    for (let s = passo / 2; s < total; s += passo) {
        const ponto = trilhoBase.getPointAtLength(s)
        if (coberto(ponto)) continue

        const adiante = trilhoBase.getPointAtLength(Math.min(s + 1, total))
        const angulo = Math.atan2(adiante.y - ponto.y, adiante.x - ponto.x)
        const x = ponto.x + Math.cos(angulo + Math.PI / 2) * 5 * lado
        const y = ponto.y + Math.sin(angulo + Math.PI / 2) * 5 * lado
        lado = -lado

        const classes = ['pata']
        let estilo = ''
        if (s <= feito) {
            classes.push('feita')
            if (patasNovasDesde !== null && s > patasNovasDesde) {
                classes.push('nova')
                estilo = ` style="--atraso: ${novas++ * 70}ms"`
            }
        }

        // A patinha do símbolo aponta para cima (-90°); somar 90° alinha os dedos com o sentido do caminho.
        const giro = (angulo * 180) / Math.PI + 90
        html += `<g class="${classes.join(' ')}"${estilo} transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${giro.toFixed(1)})">`
            + `<use href="#pata" x="${-tamanho / 2}" y="${-tamanho / 2}" width="${tamanho}" height="${tamanho}"/></g>`
    }

    patas.innerHTML = html
    patasNovasDesde = null
}

function curvaPor(pontos) {
    if (pontos.length < 2) return ''
    let d = `M ${pontos[0].x} ${pontos[0].y}`
    for (let i = 1; i < pontos.length; i++) {
        const de = pontos[i - 1]
        const para = pontos[i]
        const meio = (para.y - de.y) / 2
        d += ` C ${de.x} ${de.y + meio}, ${para.x} ${para.y - meio}, ${para.x} ${para.y}`
    }
    return d
}

// ---------- Balão do nível ----------

function alternarBalao(no, nivel) {
    if (noDoBalao === no) {
        fecharBalao()
        return
    }
    abrirBalao(no, nivel)
}

function abrirBalao(no, nivel) {
    const ultimo = nivel.ordem === niveis.length
    const proximo = ultimo ? 'concluir a trilha' : `liberar o nível ${nivel.ordem + 1}`
    const minimo = Math.ceil((NOTA_DE_CORTE / 100) * QUESTOES_POR_NIVEL)

    const texto = nivel.estado === 'concluido'
        ? `Sua melhor nota: <strong>${nivel.melhorPercentual}%</strong> (${acertos(nivel.melhorPercentual)} de ${QUESTOES_POR_NIVEL}). Refazer não diminui essa nota.`
        : `Leia o conteúdo e responda ${QUESTOES_POR_NIVEL} questões. Acerte ${minimo} para ${proximo}.`

    balao.innerHTML = `
        <button class="balao-fechar" type="button" aria-label="Fechar"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
        <p class="balao-ordem">Nível ${nivel.ordem} · ${nivel.estado === 'concluido' ? 'concluído' : 'disponível'}</p>
        <h3 class="balao-titulo" id="balao-titulo">${nivel.titulo}</h3>
        <p class="balao-texto">${texto}</p>
        <button class="botao ${nivel.estado === 'concluido' ? 'botao-secundario' : ''} balao-acao" type="button">
            ${nivel.estado === 'concluido' ? 'Refazer' : 'Começar'}
        </button>`
    balao.setAttribute('aria-labelledby', 'balao-titulo')
    balao.hidden = false
    noDoBalao = no
    no.setAttribute('aria-expanded', 'true')
    posicionarBalao(no)

    balao.querySelector('.balao-fechar').addEventListener('click', () => fecharBalao(true))
    balao.querySelector('.balao-acao').addEventListener('click', () => {
        fecharBalao()
        mostrarAviso(`No produto, este botão abre a Tela de Nível (<code>/nivel/${nivel.nivelId}</code>).`)
    })
    balao.querySelector('.balao-acao').focus()
}

function posicionarBalao(no) {
    const base = caminho.getBoundingClientRect()
    const caixa = no.getBoundingClientRect()
    const centroX = caixa.left - base.left + caixa.width / 2
    const meiaLargura = balao.offsetWidth / 2
    const esquerda = Math.min(Math.max(centroX, meiaLargura + 4), base.width - meiaLargura - 4)

    balao.style.left = `${esquerda}px`
    balao.style.top = `${caixa.bottom - base.top + 22}px`
    balao.style.setProperty('--seta', `${centroX - esquerda + meiaLargura}px`)
}

function fecharBalao(devolverFoco = false) {
    if (!noDoBalao) return
    noDoBalao.setAttribute('aria-expanded', 'false')
    if (devolverFoco) noDoBalao.focus()
    noDoBalao = null
    balao.hidden = true
}

document.addEventListener('click', (evento) => {
    if (noDoBalao && !balao.contains(evento.target)) fecharBalao()
})

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
        fecharBalao(true)
        fecharMenuSobreposto()
    }
})

// ---------- Cartão da trilha ----------

function atualizarCartao() {
    const feitos = niveis.filter((nivel) => nivel.estado === 'concluido').length
    const percentual = Math.round((feitos / niveis.length) * 100)
    const atual = nivelAtual()

    document.querySelector('.trilha-titulo').textContent = trilha.titulo
    document.querySelector('.trilha-descricao').textContent = trilha.descricao
    document.querySelector('.progresso-barra').style.width = `${percentual}%`
    document.querySelector('.progresso').setAttribute('aria-valuenow', percentual)
    document.querySelector('.progresso-texto').textContent = `${feitos} de ${niveis.length} níveis concluídos`

    botaoContinuar.disabled = !atual
    botaoContinuar.textContent = atual ? `Continuar: nível ${atual.ordem}` : 'Trilha concluída'
}

botaoContinuar.addEventListener('click', (evento) => {
    evento.stopPropagation()
    const atual = nivelAtual()
    if (!atual) return
    const no = lista.querySelector(`.no[data-ordem="${atual.ordem}"]`)
    no.scrollIntoView({ behavior: 'smooth', block: 'center' })
    abrirBalao(no, atual)
})

// ---------- Aviso ----------

function mostrarAviso(html, tipo = '') {
    aviso.innerHTML = html
    aviso.className = `aviso visivel ${tipo}`
    clearTimeout(temporizadorAviso)
    temporizadorAviso = setTimeout(() => aviso.classList.remove('visivel'), 4200)
}

// ---------- Simulação (só no mockup) ----------
// Imita o que a API faz em POST /levels/:id/submit: aprovar conclui e libera o próximo
// na mesma operação (RN-12); reprovar não muda nada (RN-04).

function simular(acao) {
    const atual = nivelAtual()

    if (acao === 'reiniciar') {
        niveis = clonar(progressoInicial.niveis)
        desenhar()
        mostrarAviso('Progresso de volta ao estado inicial.')
        return
    }

    if (!atual) {
        mostrarAviso('Todos os níveis já estão concluídos. Use "Recomeçar".')
        return
    }

    if (acao === 'reprovar') {
        desenhar({ tremido: atual.ordem })
        mostrarAviso(`Você acertou <strong>3 de ${QUESTOES_POR_NIVEL} (60%)</strong>. A nota de corte é ${NOTA_DE_CORTE}%. Nada foi bloqueado: tente de novo quando quiser.`, 'erro')
        return
    }

    atual.estado = 'concluido'
    atual.melhorPercentual = Math.max(atual.melhorPercentual ?? 0, 80)
    const proximo = niveis[atual.ordem]
    if (proximo) proximo.estado = 'disponivel'

    patasNovasDesde = trilhoFeito.getTotalLength()
    desenhar({ concluido: atual.ordem, liberado: proximo?.ordem })

    const alvo = lista.querySelector(proximo ? `.no[data-ordem="${proximo.ordem}"]` : '.no-fim')
    setTimeout(() => alvo.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250)

    mostrarAviso(proximo
        ? `Nível ${atual.ordem} concluído com <strong>80%</strong> (4 de ${QUESTOES_POR_NIVEL}). Nível ${proximo.ordem} liberado.`
        : `Nível ${atual.ordem} concluído. <strong>Trilha concluída!</strong>`)
}

document.querySelectorAll('[data-simular]').forEach((botao) => {
    botao.addEventListener('click', (evento) => {
        evento.stopPropagation()
        simular(botao.dataset.simular)
    })
})

// ---------- Menu lateral ----------
// Em tela larga o menu começa aberto e empurra o conteúdo; em tela estreita ele cobre o conteúdo.

function telaLarga() {
    return window.matchMedia('(min-width: 1181px)').matches
}

function atualizarEstadoMenu() {
    const aberto = telaLarga() ? !corpo.classList.contains('menu-fechado') : corpo.classList.contains('menu-aberto')
    botaoMenu.setAttribute('aria-expanded', String(aberto))
    menuFundo.hidden = telaLarga() || !aberto
}

function fecharMenuSobreposto() {
    corpo.classList.remove('menu-aberto')
    atualizarEstadoMenu()
}

botaoMenu.addEventListener('click', () => {
    corpo.classList.toggle(telaLarga() ? 'menu-fechado' : 'menu-aberto')
    atualizarEstadoMenu()
})

menuFundo.addEventListener('click', fecharMenuSobreposto)
window.matchMedia('(min-width: 1181px)').addEventListener('change', atualizarEstadoMenu)

// ---------- Início ----------

new ResizeObserver(() => posicionar()).observe(caminho)
document.fonts.ready.then(posicionar)
atualizarEstadoMenu()
desenhar()
