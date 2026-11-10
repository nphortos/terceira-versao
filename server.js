const express = require('express');
const path = require('node:path');
const api = require('./src/rotas/api');
const paginas = require('./src/rotas/paginas');

const app = express();

app.use('/api', api);

// Publica apenas os arquivos do site, sem expor os arquivos do servidor.
for (const directory of ['css', 'js', 'assets']) {
    app.use('/' + directory, express.static(path.join(__dirname, directory)));
}

app.use('/', paginas);

app.use((req, res) => {
    res.status(404).type('text').send('Página ou arquivo não encontrado.');
});

app.use((err, req, res, next) => {
    console.error('Erro ao atender requisição:', err);
    if (res.headersSent) return next(err);
    res.status(500).type('text').send('Não foi possível atender à solicitação.');
});

if (require.main === module) {
    const port = Number(process.env.PORT || 3000);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        console.error('PORT deve ser um número inteiro entre 1 e 65535.');
        process.exit(1);
    }

    const server = app.listen(port);
    server.on('listening', () => {
        console.log(`NAPORTA disponível em http://localhost:${port}`);
    });

    server.on('error', err => {
        console.error('Não foi possível iniciar o servidor:', err.message);
        process.exit(1);
    });
}

module.exports = app;
