# NAPORTA

## Executar localmente

Requisito: Node.js 22 ou superior, com npm.

Na pasta do projeto, instale as dependências e inicie o servidor:

```sh
npm ci
npm start
```

Acesse http://localhost:3000 no navegador.

No PowerShell com bloqueio de scripts, use `npm.cmd ci` e `npm.cmd start`.

Para desenvolvimento com reinício automático:

```sh
npm run dev
```

A porta padrão é 3000 e pode ser alterada pela variável de ambiente `PORT`.
Execute o projeto pelo servidor; abrir apenas o arquivo `index.html` não é suficiente.
