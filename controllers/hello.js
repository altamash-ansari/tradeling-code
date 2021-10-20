module.exports = function(router) {
  router.get("/hello", (request, response) =>{
    return response.send("Hello world!")
  })

  router.post("/hello", (request, response) =>{
    if(request.body && request.body.msg){
      return response.send(`Server Response: ${request.body.msg}`)
    }
    else{
      return response.status(400).send("Please send data in JSON body with field msg")
    }
  })
}