document.getElementById('normas').innerHTML = `
    <h2>Normas</h2>
    <input type="text" id="busca-norma" oninput="buscarNorma()" placeholder="Buscar norma...">
    <ul id="lista-normas"></ul>
`;

const normas = [
    { "titulo": "NBR 6023", "descricao": "Informação e documentação - Referências - Elaboração", "detalhes": "Esta Norma especifica os elementos a serem incluídos em referências." },
    { "titulo": "NBR 10520", "descricao": "Informação e documentação - Citações em documentos - Apresentação", "detalhes": "Esta Norma especifica as características exigíveis para apresentação de citações em documentos." },
    { "titulo": "NBR 14724", "descricao": "Informação e documentação - Trabalhos acadêmicos - Apresentação", "detalhes": "Esta Norma especifica os princípios gerais para a elaboração de trabalhos acadêmicos." },
    { "titulo": "NBR 15287", "descricao": "Projeto de pesquisa - Apresentação", "detalhes": "Esta Norma estabelece os requisitos para apresentação de projetos de pesquisa." },
    { "titulo": "NBR 10719", "descricao": "Apresentação de relatórios técnico-científicos", "detalhes": "Esta Norma estabelece os requisitos para apresentação de relatórios técnico-científicos." },
    { "titulo": "NBR 12225", "descricao": "Coletâneas", "detalhes": "Esta Norma especifica os requisitos para apresentação de coletâneas." },
    { "titulo": "NBR 6024", "descricao": "Numeração progressiva das seções de um documento", "detalhes": "Esta Norma especifica o sistema de numeração progressiva das seções de um documento escrito." },
    { "titulo": "NBR 6028", "descricao": "Resumos", "detalhes": "Esta Norma especifica os requisitos para elaboração de resumos." },
    { "titulo": "NBR 15437", "descricao": "Pôsteres técnicos e científicos", "detalhes": "Esta Norma especifica os requisitos para apresentação de pôsteres técnicos e científicos." }
];

const listaNormas = document.getElementById('lista-normas');
normas.forEach(norma => {
    const item = document.createElement('li');
    item.textContent = `${norma.titulo}: ${norma.descricao}`;
    listaNormas.appendChild(item);
});

function buscarNorma() {
    const termoBusca = document.getElementById('busca-norma').value.toLowerCase();
    const normasFiltradas = normas.filter(norma =>
        norma.titulo.toLowerCase().includes(termoBusca) ||
        norma.descricao.toLowerCase().includes(termoBusca)
    );
    listaNormas.innerHTML = '';
    normasFiltradas.forEach(norma => {
        const item = document.createElement('li');
        item.textContent = `${norma.titulo}: ${norma.descricao}`;
        listaNormas.appendChild(item);
    });
}
