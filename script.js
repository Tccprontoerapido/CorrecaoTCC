document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('login-form');
    const areaTrabalho = document.getElementById('area-trabalho');
    const resultadoCorrecao = document.getElementById('resultado-correcao');
    const loginError = document.getElementById('login-error');
    const editor = document.getElementById('editor');
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", function() {
            localStorage.removeItem("userToken");
            window.location.href = "login.html";
        });
    }

    window.onload = function() {
        if (!localStorage.getItem("userToken")) {
            window.location.href = "login.html";
        }
    };

    if (editor) {
        CKEDITOR.replace('editor', {
            extraPlugins: 'divarea,pagebreak',
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
                { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
                '/',
                { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                { name: 'colors', items: ['TextColor', 'BGColor'] },
                { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
                { name: 'about', items: ['About'] }
            ]
        });
    }

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

    window.aplicarNormasTCC = function() {
        const texto = CKEDITOR.instances.editor.getData();
        let erros = [];
        let textoFormatado = texto;

        if (!texto.startsWith("   ")) {
            erros.push({ mensagem: "Margens incorretas (devem começar com 3 espaços).", posicao: 0 });
        }

        if (!verificarFonte(texto, "Arial", "12pt")) {
            erros.push({ mensagem: "Fonte incorreta (deve ser Arial 12pt).", posicao: 0 });
        }

        if (!verificarEspacamento(texto, 1.5)) {
            erros.push({ mensagem: "Espaçamento entre linhas incorreto (deve ser 1.5).", posicao: 0 });
        }

        const errosCitacao = verificarCitacoes(texto);
        erros = erros.concat(errosCitacao);

        const errosReferencias = verificarReferencias(texto);
        erros = erros.concat(errosReferencias);

        const errosTitulos = verificarTitulos(texto);
        erros = erros.concat(errosTitulos);

        erros.forEach(erro => {
            textoFormatado = destacarErro(textoFormatado, erro.mensagem, erro.posicao);
        });

        CKEDITOR.instances.editor.setData(textoFormatado);

        let sugestoes = erros.map(erro => {
            return `<div class="sugestao-correcao">
                <strong>Erro:</strong> ${erro.mensagem}<br>
                <strong>Sugestão:</strong> ${gerarSugestao(erro.mensagem)}
            </div>`;
        }).join('');

        document.getElementById('resultado-verificacao').innerHTML = sugestoes;
    };

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
        const docDefinition = {
            content: texto
        };
        pdfMake.createPdf(docDefinition).download('trabalho.pdf');
    };
});
