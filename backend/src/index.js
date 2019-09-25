const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

// Divide o servidor para que ele suporte tanto requisições HTTP como WebSocket
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Conexão com banco de dados - MongoDB
mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-64cnu.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
});

// Repassa a informação do io para todas as rotas
app.use((req, res, next) => {
    req.io = io;

    next();
});

// Permite que todos os endereços possam acessar o backend
app.use(cors());

app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads', 'resized')));

app.use(require('./routes'))

server.listen(process.env.PORT || 3333);