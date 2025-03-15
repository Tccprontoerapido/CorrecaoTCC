document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('login-form');
    const areaTrabalho = document.getElementById('area-trabalho');
    const resultadoCorrecao = document.getElementById('resultado-correcao');
    const loginError = document.getElementById('login-error');
    const editor = document.getElementById('editor');
    const logoutButton = document.getElementById("logoutButton");
    let tipoTrabalho = '';

    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            localStorage.removeItem("userToken");
            window.location.href = "login.html";
        });
    }

    window.onload = function() {
        if (!localStorage.getItem("userToken")) {
            window.location.href = "login.html";
        } else {
            loginForm.style.display = 'none';
            areaTrabalho.style.display = 'block';
            resultadoCorrecao.style.display = 'block';

            if (CKEDITOR.instances.editor) {
                CKEDITOR.instances.editor.destroy(true);
            }

            CKEDITOR.replace('editor', {
                height: 500,
                toolbar: [
                    { name: 'document', items: ['Source', '-', 'NewPage', 'Preview', '-', 'Templates'] },
                    { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
                    { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
                    { name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
                    '/',
                    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
                    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language'] },
                    { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
                    { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
                    '/',
                    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                    { name: 'colors', items: ['TextColor', 'BGColor'] },
                    { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
                    { name: 'about', items: ['About'] }
                ]
            });
        }
    };

    window.login = function() {
        const loginInput = document.getElementById('login').value;
        const passwordInput = document.getElementById('password').value;

        if (loginInput === 'neliolima598' && passwordInput === 'Nelio1302109') {
            localStorage.setItem("userToken", "token");
            loginForm.style.display = 'none';
            areaTrabalho.style.display = 'block';
            resultadoCorrecao.style.display = 'block';
        } else {
            loginError.textContent = 'Login ou senha incorretos.';
        }
    };

    window.selecionarTipoTrabalho = function() {
        tipoTrabalho = document.getElementById('tipo-trabalho').value;
    };

    window.aplicarNormasTCC = function() {
        const texto = CKEDITOR.instances.editor.getData();
        let erros = [];
        let textoFormatado = aplicarNormasABNT(texto);

        // Verificar erros no texto formatado
        const errosCitacao = verificarCitacoes(textoFormatado);
        erros = erros.concat(errosCitacao);

        const errosReferencias = verificarReferencias(textoFormatado);
        erros = erros.concat(errosReferencias);

        const errosTitulos = verificarTitulos(textoFormatado);
        erros = erros.concat(errosTitulos);

        // Destacar erros no texto
        erros.forEach(erro => {
            textoFormatado = destacarErro(textoFormatado, erro.mensagem, erro.posicao);
        });

        CKEDITOR.instances.editor.setData(textoFormatado);

        // Exibir sugestões de correção
        let sugestoes = erros.map(erro => {
            return `<div class="sugestao-correcao">
                <strong>Erro:</strong> ${erro.mensagem}<br>
                <strong>Sugestão:</strong> ${gerarSugestao(erro.mensagem)}
            </div>`;
        }).join('');

        document.getElementById('resultado-verificacao').innerHTML = sugestoes;
    };

    function aplicarNormasABNT(texto) {
        // Aplicar formatação ABNT
        texto = aplicarMargens(texto);
        texto = aplicarFonte(texto);
        texto = aplicarEspacamento(texto);
        texto = aplicarAlinhamento(texto);
        texto = aplicarRecuoParagrafos(texto);
        texto = aplicarFormatacaoCitacoes(texto);
        texto = aplicarNumeracaoPaginas(texto);
        texto = aplicarFormatacaoTitulos(texto);
        texto = aplicarFormatacaoReferencias(texto);
        return texto;
    }

    function aplicarMargens(texto) {
        // Adicionar margens no início e fim do texto
        return `\n\n${texto}\n\n`;
    }

    function aplicarFonte(texto) {
        // Definir a fonte como Arial 12pt
        return `<span style="font-family: Arial; font-size: 12pt;">${texto}</span>`;
    }

    function aplicarEspacamento(texto) {
        // Definir espaçamento entre linhas de 1.5
        return `<span style="line-height: 1.5;">${texto}</span>`;
    }

    function aplicarAlinhamento(texto) {
        // Definir alinhamento justificado para o texto
        return `<div style="text-align: justify;">${texto}</div>`;
    }

    function aplicarRecuoParagrafos(texto) {
        // Adicionar recuo de 1.25 cm na primeira linha de cada parágrafo
        return texto.replace(/<p>/g, `<p style="text-indent: 1.25cm;">`);
    }

    function aplicarFormatacaoCitacoes(texto) {
        // Formatar citações curtas e longas
        texto = texto.replace(/“([^”]+)”/g, `"<span style="font-size: 12pt;">$1</span>"`);
        texto = texto.replace(/“([^”]{3,})”/g, `<blockquote style="font-size: 10pt; margin-left: 4cm;">$1</blockquote>`);
        return texto;
    }

    function aplicarNumeracaoPaginas(texto) {
        // Adicionar numeração de páginas no canto superior direito
        return texto; // Implementar conforme necessário
    }

    function aplicarFormatacaoTitulos(texto) {
        // Formatar títulos com numeração progressiva
        return texto.replace(/<h([1-6])>([^<]+)<\/h\1>/g, `<h$1 style="text-align: left;">$2</h$1>`);
    }

    function aplicarFormatacaoReferencias(texto) {
        // Formatar referências com espaçamento simples
        return texto.replace(/<li>([^<]+)<\/li>/g, `<li style="line-height: 1;">$1</li>`);
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

    window.importarPDF = async function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async function() {
                const typedarray = new Uint8Array(this.result);
                const loadingTask = pdfjsLib.getDocument({ data: typedarray });
                const pdf = await loadingTask.promise;
                let combinedText = '';
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    combinedText += pageText + '\n\n';
                }
                CKEDITOR.instances.editor.setData(combinedText);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    window.salvarPDF = function() {
        const texto = CKEDITOR.instances.editor.getData();
        const plainText = texto.replace(/<\/?[^>]+(>|$)/g, ""); // Remove all HTML tags
        const docDefinition = {
            content: plainText
        };
        pdfMake.createPdf(docDefinition).download('trabalho.pdf');
    };
});
