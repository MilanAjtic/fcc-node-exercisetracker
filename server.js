const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')
require('dotenv').config()

const mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true
 }).then(() => {
  console.log('MongoDB connected.')
}).catch(err => console.log(err))  

require('./Schemas')
const User = mongoose.model('User')
const Exercise = mongoose.model('Exercise')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Task 1
app.post('/api/exercise/new-user', (req, res) => {
  const newUser = {
    username: req.body.username,
  }
  new User(newUser)
    .save()
    .then(user => {
      res.json({
        username: user.username,
        _id: user._id
      })
    })
})

// Task 2
app.get('/api/exercise/users', (req, res) => {
  User
    .find({})
    .select("username")
    .then(user => {
      res.json(user)
    })
});

// Task 3
app.post('/api/exercise/add', (req, res) => {
  const exercise = {
    user: req.body.userId,
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date ? new Date(req.body.date).toDateString() : new Date(Date.now()).toDateString()
  }
  new Exercise(exercise)
  .save()
  .then(e => {
    User
      .findOneAndUpdate(
        {_id: req.body.userId},
        {$push: {exercises: e}}
      )
      .exec()
      .then(u => {
        res.json({
          username: u.username,
          description: e.description,
          duration: e.duration,
          _id: e.user,
          date: e.date
        })
    })
  })
})

// Tasks 4 and 5
app.get('/api/exercise/log', (req, res) => {
  Exercise
    .find({
      user: req.query.userId,
      date: {"$gt": req.query.from, "$lt": req.query.to}
    })
    .limit(parseInt(req.query.limit))
    .populate({
      path: 'user',
      select: 'username'
    })
    .select("description duration date")
    .then(exercises => {
      const obj = {
        _id: req.query.userId,
        count: exercises.length,
        from: req.query.from,
        to: req.query.to,
        log: []
      }
      res.json(
        exercises.length !== 0 
        ? {
          ...obj,
          username: exercises[0].user.username,
          log: exercises.map((e) => {
            return {
              description: e.description,
              duration: e.duration,
              date: e.date
            }
          })
        } 
        : obj
        )
    }).catch(err => console.error(err))
})

// za glitch mora da bude process.env.PORT ili 3000
const listener = app.listen(3001, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
