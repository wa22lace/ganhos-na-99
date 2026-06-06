const campos = {
    kmInicial: document.querySelector('#km-inicial input'),
    kmFinal: document.querySelector('#km-final input'),
    kmQueimado: document.querySelector('#km-queimado input'),
    gastoPorKm: document.querySelector('#gasto-por-km input'),
    gastosCombustivel: document.querySelector('#gastos-combustivel input'),
    ganhos: document.querySelector('#ganhos input'),
    gastos: document.querySelector('#gastos input'),
    santander: document.querySelector('#conta-santander input'),
    dinheiro: document.querySelector('#caixa-dinheiro input'),
    bancoBrasil: document.querySelector('#banco-do-brasil input'),
    metaDiaria: document.querySelector('#meta-diaria input'),
    faltaMeta: document.querySelector('#falta-meta input'),
    lucroDia: document.querySelector('#lucro-dia input'),
    saldo: document.querySelector('#saldo input')
};

const divSaldo = document.querySelector('#saldo');
const btnLimpar = document.querySelector('#btn-limpar');

function formatarBR(valor) {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pegarNumero(input) {
    return parseFloat(input.value) || 0;
}

function setarResultado(input, valor) {
    input.value = valor? formatarBR(valor) : '';
    input.dataset.valor = valor;
}

function temDados() {
    // Verifica se tem algum campo editável preenchido
    return pegarNumero(campos.kmInicial) > 0 ||
           pegarNumero(campos.kmFinal) > 0 ||
           pegarNumero(campos.gastoPorKm) > 0 ||
           pegarNumero(campos.ganhos) > 0 ||
           pegarNumero(campos.gastos) > 0 ||
           pegarNumero(campos.santander) > 0 ||
           pegarNumero(campos.dinheiro) > 0 ||
           pegarNumero(campos.bancoBrasil) > 0 ||
           pegarNumero(campos.metaDiaria) > 0;
}

function atualizarVisibilidade() {
    if (temDados()) {
        divSaldo.classList.remove('oculto');
        btnLimpar.classList.remove('oculto');
    } else {
        divSaldo.classList.add('oculto');
        btnLimpar.classList.add('oculto');
    }
}

function calcular() {
    const kmInicial = pegarNumero(campos.kmInicial);
    const kmFinal = pegarNumero(campos.kmFinal);
    const gastoPorKm = pegarNumero(campos.gastoPorKm);
    const ganhos = pegarNumero(campos.ganhos);
    const gastos = pegarNumero(campos.gastos);
    const santander = pegarNumero(campos.santander);
    const dinheiro = pegarNumero(campos.dinheiro);
    const bancoBrasil = pegarNumero(campos.bancoBrasil);
    const metaDiaria = pegarNumero(campos.metaDiaria);

    // 1. KM Rodados
    const kmQueimado = kmFinal >= kmInicial? kmFinal - kmInicial : 0;
    campos.kmQueimado.value = kmQueimado? kmQueimado.toFixed(1) : '';

    // 2. Gastos com Combustível
    const gastosCombustivel = gastoPorKm * kmQueimado;
    setarResultado(campos.gastosCombustivel, gastosCombustivel);

    // 3. Lucro do Dia
    const lucroDia = ganhos - gastos - gastosCombustivel;
    setarResultado(campos.lucroDia, lucroDia);
    campos.lucroDia.classList.toggle('negativo', lucroDia < 0);

    // 4. Falta pra Meta
    const faltaMeta = metaDiaria - lucroDia;
    setarResultado(campos.faltaMeta, faltaMeta > 0? faltaMeta : 0);
    campos.faltaMeta.classList.toggle('negativo', faltaMeta <= 0);

    // 5. Saldo Total
    const totalContas = santander + dinheiro + bancoBrasil;
    const saldo = totalContas + lucroDia;
    setarResultado(campos.saldo, saldo);
    campos.saldo.classList.toggle('negativo', saldo < 0);

    atualizarVisibilidade();
    salvarTudo();
}

function salvarTudo() {
    Object.keys(campos).forEach(key => {
        const input = campos[key];
        if (!input.readOnly && input.value) {
            localStorage.setItem(key, input.value);
        }
    });
}

function carregarTudo() {
    Object.keys(campos).forEach(key => {
        const input = campos[key];
        const valorSalvo = localStorage.getItem(key);
        if (valorSalvo &&!input.readOnly) {
            input.value = valorSalvo;
        }
    });
}

function limparTudo() {
    if (confirm('Apagar todos os dados do dia?')) {
        localStorage.clear();
        Object.keys(campos).forEach(key => {
            if (!campos[key].readOnly) {
                campos[key].value = '';
            }
        });
        calcular();
    }
}

// Trava campos de resultado
['kmQueimado', 'gastosCombustivel', 'faltaMeta', 'lucroDia', 'saldo'].forEach(key => {
    campos[key].readOnly = true;
});

// Eventos
document.querySelectorAll('input:not([readonly])').forEach(input => {
    input.addEventListener('input', calcular);
});

btnLimpar.addEventListener('click', limparTudo);

// Inicia
window.addEventListener('DOMContentLoaded', () => {
    carregarTudo();
    calcular();
    atualizarVisibilidade();
});
