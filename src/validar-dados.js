function validarDados({ produtos, servicos, catalogos }) {
    function texto(value, field) {
        if (typeof value !== 'string' || !value.trim()) throw new Error(field + ': informe um texto não vazio.');
    }
    function imagem(value, field) {
        texto(value, field);
        if (/^\/?assets\/[a-z0-9-]+\.(?:png|webp)$/.test(value)) return;
        try {
            const address = new URL(value);
            if (address.protocol === 'https:' && address.hostname) return;
        } catch {}
        throw new Error(field + ': use uma imagem de assets/ ou um endereço HTTPS válido.');
    }
    function registros(entries, file, fields) {
        if (!Array.isArray(entries)) throw new Error(file + ': informe uma lista.');
        const ids = new Set();
        entries.forEach((entry, index) => {
            const field = `${file}[${index}]`;
            if (!entry || Array.isArray(entry) || typeof entry.id !== 'string' || !/^[a-z0-9-]+$/.test(entry.id) || ids.has(entry.id)) throw new Error(field + ': id inválido ou repetido.');
            ids.add(entry.id);
            fields.forEach(name => name === 'img' ? imagem(entry[name], field + '.' + name) : texto(entry[name], field + '.' + name));
        });
        return ids;
    }
    registros(produtos, 'dados/produtos.json', ['name', 'desc', 'img']);
    produtos.forEach((produto, index) => {
        if (!Number.isFinite(produto.price) || produto.price < 0 || typeof produto.available !== 'boolean' || typeof produto.placeholder !== 'boolean') {
            throw new Error(`dados/produtos.json[${index}]: confira price, available e placeholder.`);
        }
    });
    const ids = registros(servicos, 'dados/servicos.json', ['title', 'short', 'body', 'img']);
    if (!catalogos || typeof catalogos !== 'object' || Array.isArray(catalogos)) throw new Error('dados/catalogos.json: informe um objeto com os catálogos.');
    for (const id of Object.keys(catalogos)) if (!ids.has(id)) throw new Error('dados/catalogos.json: categoria sem serviço correspondente: ' + id);
    for (const id of ids) {
        if (!Array.isArray(catalogos[id]) || !catalogos[id].length) throw new Error('dados/catalogos.json: falta o catálogo de ' + id);
        catalogos[id].forEach((item, index) => {
            const field = `dados/catalogos.json.${id}[${index}]`;
            if (!item || Array.isArray(item)) throw new Error(field + ': use campos name, desc e img.');
            texto(item.name, field + '.name');
            texto(item.desc, field + '.desc');
            if (item.img !== undefined) imagem(item.img, field + '.img');
        });
    }
}

module.exports = { validarDados };
