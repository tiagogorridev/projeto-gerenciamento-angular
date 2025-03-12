const express = require('express');
const path = require('path');
const app = express();

// Serve os arquivos estáticos da pasta dist
app.use(express.static('./dist/projeto-gerenciamento-angular'));

// Envia o index.html para qualquer outra rota
app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/projeto-gerenciamento-angular/'}),
);

// Inicia o servidor na porta fornecida pelo Heroku ou na 8080
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});
