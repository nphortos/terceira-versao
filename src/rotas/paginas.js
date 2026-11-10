const express = require('express');
const path = require('node:path');
const catalogo = require('../catalogo');

const router = express.Router({ caseSensitive: true });
const indexFile = path.join(__dirname, '../../index.html');
const privateDirectories = new Set(['api', 'assets', 'css', 'js', 'dados', 'src', 'tests', 'verificacoes', 'documentacao', 'relatorios', 'node_modules']);

function sendPage(res, status = 200) {
    return res.status(status).sendFile(indexFile);
}

router.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next('router');
    const first = req.path.split('/').filter(Boolean)[0] || '';
    const extension = path.posix.extname(req.path);
    if (first.startsWith('.') || privateDirectories.has(first) || (extension && extension !== '.html')) {
        return next('router');
    }
    try {
        decodeURI(req.path);
    } catch {
        return sendPage(res, 400);
    }
    if (req.path.includes('//')) return sendPage(res, 404);
    next();
});

router.get([
    '/', '/index.html', '/cardapio', '/sobre', '/contato', '/carrinho',
    '/faq', '/envio', '/termos', '/privacidade'
], (req, res) => sendPage(res));

router.get('/produto/:id', (req, res) => {
    const exists = catalogo.produtos.some(item => item.id === req.params.id);
    sendPage(res, exists ? 200 : 404);
});

router.get(['/servico/:id', '/catalogo/:id'], (req, res) => {
    const exists = catalogo.servicos.some(item => item.id === req.params.id);
    sendPage(res, exists ? 200 : 404);
});

// Páginas inexistentes recebem 404 e usam a apresentação de erro do próprio site.
router.use((req, res) => sendPage(res, 404));
router.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    if (err.status === 400) return sendPage(res, 400);
    next(err);
});

module.exports = router;
