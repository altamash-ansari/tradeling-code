const axios = require("axios")
const _ = require("lodash")

module.exports = function (router) {
  router.get("/sw/chars-remote", async (request, response) => {
    let peoples

    try {
      peoples = await fetchSWData("http://swapi.dev/api/people/?page=1")
    } catch (error) {
      return response.status(422).send("Error fetching the data")
    }

    const names = peoples.map((people) => {
      return people.name
    })

    return response.json({
      names,
    })
  })

  router.get("/sw/starships-best", async (request, response) => {
    let starships

    try {
      starships = await fetchSWData("http://swapi.dev/api/starships/?page=1")
    } catch (error) {
      return response.status(422).send("Error fetching the data")
    }

    // Sorted the starships based on number of pilots in descending order
    const sortedPilotStarships = _.orderBy(
      starships,
      [
        function (o) {
          return o.pilots.length
        },
      ],
      ["desc"]
    )

    // First Starship will have most number of pilots
    const mostPilotStarship = sortedPilotStarships[0]
    let pilotNames = []

    try {
      for (let index = 0; index < mostPilotStarship.pilots.length; index++) {
        const pilotURL = mostPilotStarship.pilots[index]
        let pilot = await axios({
          url: pilotURL,
          method: "get",
          responseType: "json",
        })
  
        if(!pilot.data)
          throw new Error(`Pilot not found for ${pilotURL}`)
  
        pilotNames.push(pilot.data.name)
      }
    } catch (error) {
      return response.status(422).send("Error fetching the pilots data")
    }

    return response.json({
      ...mostPilotStarship,
      pilots:  pilotNames
    })
  })
}

function fetchSWData(url, mergedData = []) {
  return axios({
    url,
    method: "get",
    responseType: "json",
  }).then((response) => {
    if (!(response || response.data)) throw new Error("ERROR")

    const newMergedData = mergedData.concat(response.data.results)

    if (!response.data.next) return newMergedData

    return fetchSWData(response.data.next, newMergedData)
  })
}
