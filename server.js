const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const users = [];

// ROTA PARA FAZER O REGISTO //
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    const user = { email, password };
    users.push(user);
    console.log('Usuário registrado:', user); // UM LOG PARA VER OS USUÁRIOS REGISTRADOS
    res.status(201).send('User registered');
});

// ROTA PARA FAZER O LOGIN //
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        const token = jwt.sign({ email }, 'segredoJWT', { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).send('Credenciais inválidas.');
});

// MIDDLEWARE PARA AUTENTICAÇÃO JWT //
const autenticarJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).send('Token não fornecido.');
    try {
        const dados = jwt.verify(token, 'segredoJWT');
        req.user = dados;
        next();
    } catch {
        res.status(403).send('Token inválido.');
    }
};

// ROTA PROTEGIDA DE MÚSICAS //
app.get('/musicas', autenticarJWT, (req, res) => {
    res.json([
        { id: 1, titulo: 'Música A', artista: 'DJ A' },
        { id: 2, titulo: 'Música B', artista: 'DJ B' },
    ]);
});

// ROTA PARA SERVER E O FRONT-END //
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});

// ROTA PARA VER OS USUÁRIOS REGISTRADOS // 
app.get('/usuarios', (req, res) => {
    res.json(users);
});