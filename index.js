const express = require('express');
const app = express();
const mysql2 = require('mysql2');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connection to the database
const db = mysql2.createConnection({
  host: 'lanchonete-bd.mysql.uhserver.com',
  database: 'lanchonete_bd',
  password: 'Leandro171716@',
  user: 'leandroafonso',
});

// Test the database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Routes
app.get('/produtos', (req, res) => {
  const form = `
    <form action="/create" method="POST">
      <input type="text" name="nome_produto" placeholder="Nome do Produto">
      <input type="text" name="valor_produto" placeholder="Valor do Produto">
      <input type="text" name="url_produto" placeholder="URL do Produto">
      <button type="submit">Enviar</button>
    </form>
  `;
  res.send(form);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/create', (req, res) => {
  const nome_produto = req.body.nome_produto;
  const valor_produto = req.body.valor_produto;
  const url_produto = req.body.url_produto;

  console.log('Nome do produto:', nome_produto);
  // Verificar se nome_produto não está vazio
  if (!nome_produto) {
    return res.status(400).send('Nome do produto não pode ser vazio.');
  }

  db.query(
    'INSERT INTO produtos (nome_produto, valor_produto, url_produto) VALUES (?, ?, ?)',
    [nome_produto, valor_produto, url_produto],
    (err, result) => {
      if (err) {
        console.error('Erro ao inserir os valores:', err);
        res.status(500).send('Erro ao inserir os valores');
      } else {
        console.log('Valores inseridos com sucesso:', result);
        res.redirect('/');
      }
    }
  );
});

app.listen(3000, () => console.log('Listening on port 3000'));
