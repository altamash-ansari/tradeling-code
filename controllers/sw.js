const axios = require('axios')

module.exports = function (router) {
  router.get("/sw/chars-remote", (request, response) => {
    return fetchSWPeople("http://swapi.dev/api/people/?page=1")
    .then(mergedPeople => {
      const names = mergedPeople.map((people) =>{
        return people.name
      })

      return response.json({
        names
      })
    })
  })
}

function fetchSWPeople(url, mergedPeople = []){
  return axios({
    url,
    method: 'get',
    responseType: 'json'
  })
  .then((response) => {
    if(!(response || response.data))
      throw new Error("ERROR")

    const newMergedPeople = mergedPeople.concat(response.data.results)

    if(!response.data.next)
      return newMergedPeople

    return fetchSWPeople(response.data.next, newMergedPeople)
  })
}