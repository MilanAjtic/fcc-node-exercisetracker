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
const User2 = mongoose.model('User2')
const Exercise2 = mongoose.model('Exercise2')

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
  new User2(newUser)
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
  User2
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
  new Exercise2(exercise)
  .save()
  .then(e => {
    User2
      .findOne(
        {_id: req.body.userId}
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
  const obj = {
    user: req.query.userId,
  }
  let date = {}
  if (req.query.from && req.query.to) {
    date["$gt"] = req.query.from
    date["$lt"] = req.query.to
    obj.date = date
  } 
  else if (req.query.from) {
    date["$gt"] = req.query.from
    obj.date = date
  }
  else if (req.query.to) {
    date["$lt"] = req.query.to
    obj.date = date
  }
  Exercise2
    .find(obj)
    .limit(parseInt(req.query.limit))
    .select("description duration date")
    .then(exercises => {
      User2
      .findOne(
        {_id: req.query.userId}
      )
      .exec()
      .then(u => {
        const obj = {
          _id: req.query.userId,
          count: exercises.length,
          from: req.query.from,
          to: req.query.to,
          log: []
        }
        res.json(
          exercises.length != 0 
          ? {
            ...obj,
            username: u.username,
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
      })
    }).catch(err => console.error(err))
})


// za glitch mora da bude process.env.PORT ili 3000
const listener = app.listen(3001, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
