const btnCalcular = document.querySelector('#btn-calcular');

function calcular() {
    const contaSantander = document.querySelector('#conta-santander input');
    const caixaDinheiro = document.querySelector('#caixa-dinheiro input');
    const bancoBrasil = document.querySelector('#banco-do-brasil input');
    const saldo = document.querySelector('#saldo input');
    const kmInicial = document.querySelector('#km-inicial input');
    const kmFinal = document.querySelector('#km-final input');
    const kmQueimado = document.querySelector('#km-queimado input');

    // Pega os valores das 3 contas
    const valSantander = Number(contaSantander.value) || 0;
    const valDinheiro = Number(caixaDinheiro.value) || 0;
    const valBrasil = Number(bancoBrasil.value) || 0;
    const valKmInicial = Number(kmInicial.value) || 0;
    const valKmFinal = Number(kmFinal.value) || 0;

    // 1. Soma santander + dinheiro + banco do brasil
    const totalSaldo = valSantander + valDinheiro + valBrasil;
    saldo.value = totalSaldo.toFixed(2);

    // 2. Calcula km queimados
    if (valKmFinal >= valKmInicial) {
        kmQueimado.value = (valKmFinal - valKmInicial).toFixed(1);
    } else {
        kmQueimado.value = 0;
    }

    salvarTudo();
}

function salvarTudo() {
    const todosInputs = document.querySelectorAll('.container input');
    todosInputs.forEach(input => {
        const divPai = input.parentElement.id;
        if (divPai) {
            localStorage.setItem(divPai, input.value);
        }
    });
}

function carregarTudo() {
    const todosInputs = document.querySelectorAll('.container input');
    todosInputs.forEach(input => {
        const divPai = input.parentElement.id;
        const valorSalvo = localStorage.getItem(divPai);
        if (valorSalvo!== null) {
            input.value = valorSalvo;
        }
    });
}

// Trava os campos que são só resultado
document.querySelector('#saldo input').readOnly = true;
document.querySelector('#km-queimado input').readOnly = true;

// Evento do botão
btnCalcular.addEventListener('click', calcular);

// Carrega os dados quando abre a página
window.addEventListener('load', carregarTudo);