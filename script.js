document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById('login-form');
    const areaTrabalho = document.getElementById('area-trabalho');
    const resultadoCorrecao = document.getElementById('resultado-correcao');
    const visualizacaoImpressao = document.getElementById('visualizacao-impressao');
    const printPreviewContent = document.getElementById('print-preview-content');
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

    if (!localStorage.getItem("userToken")) {
        loginForm.style.display = 'block';
        areaTrabalho.style.display = 'none';
        resultadoCorrecao.style.display = 'none';
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
                { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
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

    window.login = function() {
        const loginInput = document.getElementById('login').value;
        const passwordInput = document.getElementById('password').value;

        if (loginInput === 'neliolima598' && passwordInput === 'Nelio1302109') {
            localStorage.setItem("userToken", "token");
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
                    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
                    { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
                    { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
                    '/',
                    { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
                    { name: 'colors', items: ['TextColor', 'BGColor'] },
                    { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
                    { name: 'about', items: ['About'] }
                ]
            });
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

        const errosCitacao = verificarCitacoes(textoFormatado);
        erros = erros.concat(errosCitacao);

        const errosReferencias = verificarReferencias(textoFormatado);
        erros = erros.concat(errosReferencias);

        const errosTitulos = verificarTitulos(textoFormatado);
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

        // Exibir normas aplicadas e não aplicadas
        const normasAplicadas = [
            "NBR 6023 - Referências",
            "NBR 10520 - Citações",
            "NBR 14724 - Trabalhos acadêmicos"
        ];
        const normasNaoAplicadas = [
            "NBR 12225 - Coletâneas",
            "NBR 6024 - Numeração progressiva",
            "NBR 6028 - Resumos",
            "NBR 15437 - Pôsteres técnicos"
        ];

        document.getElementById('normas-aplicadas').innerHTML = `
            <h3>Normas Aplicadas</h3>
            <ul>${normasAplicadas.map(norma => `<li>${norma}</li>`).join('')}</ul>
        `;

        document.getElementById('normas-nao-aplicadas').innerHTML = `
            <h3>Normas Não Aplicadas</h3>
            <ul>${normasNaoAplicadas.map(norma => `<li>${norma}</li>`).join('')}</ul>
        `;
    };

    function aplicarNormasABNT(texto) {
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
        return `\n\n${texto}\n\n`;
    }

    function aplicarFonte(texto) {
        return `<span style="font-family: Arial; font-size: 12pt;">${texto}</span>`;
    }

    function aplicarEspacamento(texto) {
        return `<span style="line-height: 1.5;">${texto}</span>`;
    }

    function aplicarAlinhamento(texto) {
        return `<div style="text-align: justify;">${texto}</div>`;
    }

    function aplicarRecuoParagrafos(texto) {
        return texto.replace(/<p>/g, `<p style="text-indent: 1.25cm;">`);
    }

    function aplicarFormatacaoCitacoes(texto) {
        texto = texto.replace(/“([^”]+)”/g, `"<span style="font-size: 12pt;">$1</span>"`);
        texto = texto.replace(/“([^”]{3,})”/g, `<blockquote style="font-size: 10pt; margin-left: 4cm;">$1</blockquote>`);
        return texto;
    }

    function aplicarNumeracaoPaginas(texto) {
        const introducaoIndex = texto.indexOf("INTRODUÇÃO");
        let paginatedText = texto.slice(0, introducaoIndex);

        const remainingText = texto.slice(introducaoIndex).split('\n').map((line, index) => {
            if (index % 30 === 0 && index !== 0) {
                return `<div class="page-break"></div><div class="page-number">${Math.floor(index / 30) + 1}</div>${line}`;
            }
            return line;
        }).join('\n');

        return paginatedText + remainingText;
    }

    function aplicarFormatacaoTitulos(texto) {
        return texto.replace(/<h([1-6])>([^<]+)<\/h\1>/g, `<h$1 style="text-align: left;">$2</h$1>`);
    }

    function aplicarFormatacaoReferencias(texto) {
        return texto.replace(/<li>([^<]+)<\/li>/g, `<li style="line-height: 1;">${texto}</li>`);
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
        const plainText = decodeEntities(texto.replace(/<\/?[^>]+(>|$)/g, ""));

        const pdfDocGenerator = pdfMake.createPdf({ content: plainText });
        pdfDocGenerator.download('documento_ABNT.pdf');
    };

    window.visualizarImpressao = function() {
        const texto = aplicarNumeracaoPaginas(CKEDITOR.instances.editor.getData());
        printPreviewContent.innerHTML = texto;
        visualizacaoImpressao.style.display = 'block';
    };

    window.imprimir = function() {
        const printContents = document.getElementById('print-preview-content').innerHTML;
        const originalContents = document.body.innerHTML;

        document.body.innerHTML = printContents;
        const style = document.createElement('style');
        style.innerHTML = `
            @page {
                margin: 0;
            }
            body {
                margin: 1cm;
            }
            header, footer, .page-number {
                display: none;
            }
        `;
        document.head.appendChild(style);
        window.print();
        document.head.removeChild(style);
        document.body.innerHTML = originalContents;

        // Restaurar o conteúdo original e o estado do CKEditor
        visualizacaoImpressao.style.display = 'none';
        CKEDITOR.instances.editor.setData(printContents);
    };

    window.fecharVisualizacaoImpressao = function() {
        visualizacaoImpressao.style.display = 'none';
    };

    function decodeEntities(encodedString) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
        return textArea.value;
    }
});
