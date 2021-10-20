const express = require('express')

const app = express()

app.get("/greetings", (request, response) =>{
  return response.send("Hello world!")
})

const server = app.listen(process.env.HTTP_PORT || 8001, () => {
  console.log(`Server started`)
})