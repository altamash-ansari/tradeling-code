module.exports = function (router) {
  router.get("/ping", (request, response) => {
    if(request.body && request.body.msg){
      const res = {
        ...request.body,
        stamp: new Date().toISOString()
      }

      return response.json(res)
    }
    else{
      return response.status(400).send("Please send data in JSON body with field msg")
    }
  })
}
