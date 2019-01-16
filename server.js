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

require('./models/Schemas')
const User = mongoose.model('User')
// const Exercise = mongoose.model('Exercise')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/exercise/users', (req, res) => {
  User
  .find({})
  .select("_id username")
  .then(user => {
    res.json(user)
  })
});

app.post('/api/exercise/new-user', (req, res) => {
  const newUser = {
    username: req.body.username,
  }
  new User(newUser)
    .save()
    .then(user => {
      res.json(user)
    })
})

app.post('/api/exercise/add', (req, res) => {
  const newExercise = {
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date ? new Date(req.body.date).toDateString() : new Date(Date.now()).toDateString()
  }
  User
  .findOne({_id: req.body.userId})
  .then(user => {
    user.exercise.push(newExercise)
    user.save()
    .then(user => {
      res.json({
        _id: req.body.userId,
        username: user.username,
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date ? new Date(req.body.date).toDateString() : new Date(Date.now()).toDateString()
      })
    })
  })
})

app.get('/api/exercise/log', (req, res) => {
  // const options = {
  //   from: req.query.from,
  //   to: req.query.to,
  //   count: req.query.limit
  // }
  User
  .find({_id: req.query.userId}, {"exercise.date": {"$gte": req.query.from, "$lt": req.query.to}})
  // .find({"exercise.date": {"$gte": req.query.from, "$lt": req.query.to}})
  // .limit({exercise: req.query.limit})
  // .select("_id username exercise.description exercise.duration exercise.date")
  .then(user => {
    res.json(user)
  })
})


const listener = app.listen(3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
