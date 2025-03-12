document.getElementById('gerador-citacao').innerHTML = `
    <h2>Gerador de Citações</h2>
    <form id="form-citacao">
        <label for="autor">Autor:</label>
        <input type="text" id="autor" required><br>
        <label for="titulo">Título:</label>
        <input type="text" id="titulo" required><br>
        <label for="ano">Ano:</label>
        <input type="number" id="ano" required><br>
        <button type="button" onclick="gerarCitacao()">Gerar Citação</button>
    </form>
    <div id="resultado-citacao"></div>
`;

function gerarCitacao() {
    const autor = document.getElementById('autor').value;
    const titulo = document.getElementById('titulo').value;
    const ano = document.getElementById('ano').value;
    const citacao = `${autor} (${ano}). ${titulo}.`;
    document.getElementById('resultado-citacao').textContent = citacao;
}
