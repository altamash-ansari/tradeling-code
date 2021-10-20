const express = require('express')
const controllers = require('./controllers')
const router = express.Router()

const app = express()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// mount the router on the app
app.use('/', router)

controllers(router)

const server = app.listen(process.env.HTTP_PORT || 8001, () => {
  console.log(`Server started`)
})