const express = require('express');
const cors = require('cors');

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

server.get('/movies', (req, res) => {
  const genderFilterParam = req.query.gender;
  console.log(genderFilterParam);
  console.log(req.query);
  const filterMovies = movies.filter((movie) => {
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
server.get('/movie/:movieId', (req, res) => {
  console.log(req.params);
});

const staticServerPathWeb = './src/public-react'; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathWeb));

const staticServerPathImage = './src/public-movies-images'; // En esta carpeta ponemos los ficheros estáticos
server.use(express.static(staticServerPathImage));
