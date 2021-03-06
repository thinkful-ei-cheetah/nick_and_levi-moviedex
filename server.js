require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const movies = require('./movies.json')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  // move to the next middleware
  next()
})

app.get('/movie', handleGetMovies)

function handleGetMovies(req, res) {
  let moviesRes = movies;
  let {genre, country, avg_vote} = req.query;

  if (genre) {
    moviesRes = moviesRes.filter(movie =>
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    )
  }

  if (country) {
    moviesRes = moviesRes.filter(movie =>
      movie.country.toLowerCase().includes(country.toLowerCase())
    )
  }

  if (avg_vote) {
    avg_vote = Number(avg_vote);
    moviesRes = moviesRes.filter(movie => {
        return movie.avg_vote >= avg_vote;
    })
  }

  res.json(moviesRes)
}

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})