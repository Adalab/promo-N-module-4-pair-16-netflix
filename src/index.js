const express = require('express');
const cors = require('cors');
const dataBase = require('better-sqlite3');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

const movies = require('./data/movies.json');

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

//configurar base de datos
const db = new dataBase('./src/database.db', { verbose: console.log });

server.get('/movies', (req, res) => {
  //declarar la query
  const query = db.prepare('SELECT * FROM movies ORDER by name DESC');
  //ejecutar la query
  const moviesDatabase = query.all();

  const genderFilterParam = req.query.gender;
  const filterMovies = moviesDatabase.filter((movie) => {
    if (genderFilterParam === undefined || genderFilterParam === '') {
      return movie;
    } else {
      return genderFilterParam === movie.gender;
    }
  });
  const response = {
    success: true,
    movies: filterMovies,
  };
  console.log(filterMovies);
  res.json(response);
});

server.get('/movie/:id', (req, res) => {
  const paramsId = req.params.id;
  console.log('Params ID', paramsId);
  const foundMovie = movies.find((movie) => movie.id === req.params.id);
  console.log(foundMovie);
});

//endpoint de SignUp=acceso
server.post('/user/signUp', (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;
  //verificar que los datos se introduzcan correctamente
  if (
    email === '' ||
    email === undefined ||
    pass === '' ||
    pass === undefined
  ) {
    res.json({ error: true, message: 'Introduzca correctamente los datos' });
  }
  const querySignUp = db.prepare('SELECT * FROM users WHERE email=?');
  const userFound = querySignUp.get(email);
  //comprobar si el usuario existe, si no, lo insertamos en la db
  if (userFound === undefined) {
    const query = db.prepare('INSERT INTO users (email, pass) values(?,?)');

    const userInsert = query.run(email, pass);
    res.json({
      error: false,
      userId: userInsert.lastInsertRowid,
    });
  } else {
    res.json({
      error: true,
      message: 'Usuaro ya existe',
    });
  }
});

const staticServerPathWeb = './src/public-react'; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWeb));

const staticServerPathImage = './src/public-movies-images'; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathImage));
