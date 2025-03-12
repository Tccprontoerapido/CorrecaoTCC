CKEDITOR.replace('editor');

function verificarFormatacao() {
    const texto = CKEDITOR.instances.editor.getData();
    let erros = [];
    let textoFormatado = texto;

    if
