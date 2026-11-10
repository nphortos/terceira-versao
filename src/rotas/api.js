const express = require('express');
const catalogo = require('../catalogo');
const { filtrarProdutos, FiltroInvalido } = require('../filtros-produtos');

const router = express.Router();

router.get('/produtos', (req, res) => {
    try {
        res.json(filtrarProdutos(catalogo.produtos, req.query));
    } catch (err) {
        if (err instanceof FiltroInvalido) return res.status(400).json({ erro: err.message });
        throw err;
    }
});

router.get('/produtos/:id', (req, res) => {
    const produto = catalogo.produtos.find(item => item.id === req.params.id);
    if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
    res.json(produto);
});

router.get('/servicos', (req, res) => {
    res.json(catalogo.servicos);
});

router.get('/servicos/:id', (req, res) => {
    const servico = catalogo.servicos.find(item => item.id === req.params.id);
    if (!servico) return res.status(404).json({ erro: 'Serviço não encontrado.' });
    res.json(servico);
});

router.get('/servicos/:id/catalogo', (req, res) => {
    const servico = catalogo.servicos.find(item => item.id === req.params.id);
    if (!servico) return res.status(404).json({ erro: 'Serviço não encontrado.' });
    const itens = catalogo.catalogos[servico.id];
    if (!itens) return res.status(404).json({ erro: 'Catálogo não encontrado.' });
    res.json(itens);
});

// Respostas da API permanecem em JSON, inclusive para endereços inexistentes.
router.use((req, res) => {
    res.status(404).json({ erro: 'Endpoint da API não encontrado.' });
});

router.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    if (err.status === 400) {
        return res.status(400).json({ erro: 'Endereço de API inválido.' });
    }
    console.error('Erro ao atender requisição da API:', err);
    res.status(500).json({ erro: 'Não foi possível atender à solicitação.' });
});

module.exports = router;
