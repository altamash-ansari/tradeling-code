module.exports = function(router) {
  router.get("/hello", (request, response) =>{
    return response.send("Hello world!")
  })

  router.post("/hello", (request, response) =>{
    return response.send(`Server Response: ${request.body.msg}`)
  })
}