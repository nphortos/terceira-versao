const parametros = new Set(['busca', 'precoMin', 'precoMax', 'disponivel', 'ordem']);
const ordens = {
    'preco-asc': (a, b) => a.price - b.price,
    'preco-desc': (a, b) => b.price - a.price,
    'nome-asc': (a, b) => a.name.localeCompare(b.name, 'pt-BR'),
    'nome-desc': (a, b) => b.name.localeCompare(a.name, 'pt-BR')
};

class FiltroInvalido extends Error {}

function normalizar(texto) {
    return texto.normalize('NFD').replace(/\p{M}/gu, '').toLocaleLowerCase('pt-BR');
}

function filtrarProdutos(produtos, query) {
    for (const [chave, valor] of Object.entries(query)) {
        if (!parametros.has(chave)) throw new FiltroInvalido(`Parâmetro desconhecido: ${chave}.`);
        if (typeof valor !== 'string' || !valor.trim()) {
            throw new FiltroInvalido(`Informe um único valor não vazio para ${chave}.`);
        }
    }
    function preco(chave) {
        if (query[chave] === undefined) return undefined;
        const valor = query[chave];
        if (!/^\d+(?:\.\d{1,2})?$/.test(valor) || !Number.isFinite(Number(valor))) {
            throw new FiltroInvalido(`${chave} deve ser um preço não negativo, com até duas casas decimais e ponto como separador.`);
        }
        return Number(valor);
    }
    const minimo = preco('precoMin');
    const maximo = preco('precoMax');
    if (minimo !== undefined && maximo !== undefined && minimo > maximo) {
        throw new FiltroInvalido('precoMin não pode ser maior que precoMax.');
    }
    if (query.disponivel !== undefined && !['true', 'false'].includes(query.disponivel)) {
        throw new FiltroInvalido('disponivel deve ser true ou false.');
    }
    if (query.ordem !== undefined && !Object.hasOwn(ordens, query.ordem)) {
        throw new FiltroInvalido('ordem deve ser preco-asc, preco-desc, nome-asc ou nome-desc.');
    }
    const busca = query.busca === undefined ? '' : normalizar(query.busca.trim());
    const resultado = produtos.filter(produto =>
        (!busca || normalizar(`${produto.name} ${produto.desc}`).includes(busca)) &&
        (minimo === undefined || produto.price >= minimo) &&
        (maximo === undefined || produto.price <= maximo) &&
        (query.disponivel === undefined || produto.available === (query.disponivel === 'true'))
    );
    // filter cria uma nova lista: ordenar a consulta não altera o catálogo original.
    if (query.ordem !== undefined) resultado.sort(ordens[query.ordem]);
    return resultado;
}

module.exports = { filtrarProdutos, FiltroInvalido };
