// Função de login
function login() {
    const loginInput = document.getElementById('login').value;
    const passwordInput = document.getElementById('password').value;
    const loginError = document.getElementById('login-error');

    if (loginInput === 'neliolima598' && passwordInput === 'Nelio1302109') {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('area-trabalho').style.display = 'block';
        document.getElementById('resultado-correcao').style.display = 'block';
    } else {
        loginError.textContent = 'Login ou senha incorretos.';
    }
}

CKEDITOR.replace('editor');

function aplicarNormasTCC() {
    const texto = CKEDITOR.instances.editor.getData();
    let erros = [];
    let textoFormatado = texto;

    // Verificação de margens
    if (!texto.startsWith("   ")) {
        erros.push({ mensagem: "Margens incorretas (devem começar com 3 espaços).", posicao: 0 });
    }

    // Verificação de fonte e tamanho
    if (!verificarFonte(texto, "Arial", "12pt")) {
        erros.push({ mensagem: "Fonte incorreta (deve ser Arial 12pt).", posicao: 0 });
    }

    // Verificação de espaçamento entre linhas
    if (!verificarEspacamento(texto, 1.5)) {
        erros.push({ mensagem: "Espaçamento entre linhas incorreto (deve ser 1.5).", posicao: 0 });
    }

    // Verificação de citações
    const errosCitacao = verificarCitacoes(texto);
    erros = erros.concat(errosCitacao);

    // Verificação de referências
    const errosReferencias = verificarReferencias(texto);
    erros = erros.concat(errosReferencias);

    // Verificação de formatação de títulos
    const errosTitulos = verificarTitulos(texto);
    erros = erros.concat(errosTitulos);

    // Feedback visual
    erros.forEach(erro => {
        textoFormatado = destacarErro(textoFormatado, erro.mensagem, erro.posicao);
    });

    CKEDITOR.instances.editor.setData(textoFormatado);

    // Sugestões de correção
    let sugestoes = erros.map(erro => {
        return `<div class="sugestao-correcao">
            <strong>Erro:</strong> ${erro.mensagem}<br>
            <strong>Sugestão:</strong> ${gerarSugestao(erro.mensagem)}
        </div>`;
    }).join('');

    document.getElementById('resultado-verificacao').innerHTML = sugestoes;
}

function verificarFonte(texto, fonte, tamanho) {
    const style = CKEDITOR.instances.editor.document.getBody().getStyle('font-family');
    const size = CKEDITOR.instances.editor.document.getBody().getStyle('font-size');
    return style === fonte && size === tamanho;
}

function verificarEspacamento(texto, espacamento) {
    const line_height = CKEDITOR.instances.editor.document.getBody().getStyle('line-height');
    return line_height === espacamento.toString();
}

function verificarCitacoes(texto) {
    let erros = [];
    const citacoes = texto.match(/\([A-ZÀ-Ú][a-zà-ú]+, \d{4}\)/g);
    if (citacoes) {
        citacoes.forEach(citacao => {
            if (!/^[A-ZÀ-Ú][a-zà-ú]+, \d{4}$/.test(citacao.substring(1, citacao.length - 1))) {
                erros.push({ mensagem: `Citação "${citacao}" com formato incorreto.`, posicao: texto.indexOf(citacao) });
            }
        });
    }
    return erros;
}

function verificarReferencias(texto) {
    let erros = [];
    const referencias = texto.match(/^[A-ZÀ-Ú]+\s[A-ZÀ-Ú.]+, [A-ZÀ-Ú][a-zà-ú]+. [A-ZÀ-Ú][a-zà-ú]+. \d{4}.*$/gm);
    if (referencias) {
        referencias.forEach(referencia => {
            if (!/^[A-ZÀ-Ú]+\s[A-ZÀ-Ú.]+, [A-ZÀ-Ú][a-zà-ú]+. [A-ZÀ-Ú][a-zà-ú]+. \d{4}.*$/.test(referencia)) {
                erros.push({ mensagem: `Referência "${referencia}" com formato incorreto.`, posicao: texto.indexOf(referencia) });
            }
        });
    }
    return erros;
}

function verificarTitulos(texto) {
    let erros = [];
    const titulos = texto.match(/^([1-9]\.?)+ [A-ZÀ-Ú].*$/gm);
    if (titulos) {
        titulos.forEach(titulo => {
            if (!/^([1-9]\.?)+ [A-ZÀ-Ú].*$/.test(titulo)) {
                erros.push({ mensagem: `Título "${titulo}" com formato incorreto.`, posicao: texto.indexOf(titulo) });
            }
        });
    }
    return erros;
}

function destacarErro(texto, mensagem, posicao) {
    const inicio = texto.substring(0, posicao);
    const fim = texto.substring(posicao);
    const erro = fim.substring(0, fim.indexOf(mensagem) + mensagem.length);
    return inicio + `<span class="erro-destacado">${erro}</span>` + fim.substring(erro.length);
}

function gerarSugestao(mensagem) {
    if (mensagem.includes("Margens")) {
        return "Adicione 3 espaços no início do parágrafo.";
    } else if (mensagem.includes("Fonte")) {
        return "Altere a fonte para Arial 12pt.";
    } else if (mensagem.includes("Espaçamento")) {
        return "Defina o espaçamento entre linhas para 1.5.";
    } else if (mensagem.includes("Citação")) {
        return "Verifique o formato da citação. Deve ser (Autor, Ano).";
    } else if (mensagem.includes("Referência")) {
        return "Verifique o formato da referência. Exemplo: AUTOR, A. Título. Ano.";
    } else if (mensagem.includes("Título")) {
        return "Verifique o formato do título. Exemplo: 1. Título Principal.";
    }
    return "Verifique o erro e corrija conforme necessário.";
}
