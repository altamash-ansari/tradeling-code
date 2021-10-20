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

        if (!pilot.data) throw new Error(`Pilot not found for ${pilotURL}`)

        pilotNames.push(pilot.data.name)
      }
    } catch (error) {
      return response.status(422).send("Error fetching the pilots data")
    }

    return response.json({
      ...mostPilotStarship,
      pilots: pilotNames,
    })
  })

  router.get("/sw/planets-most", async (request, response) => {
    let planets

    try {
      planets = await fetchSWData("http://swapi.dev/api/planets/?page=1")
    } catch (error) {
      return response.status(422).send("Error fetching the data")
    }

    /**
     * Filter out planets which contain garbage data
     * some planets has "unkown" value for both rotation_period and orbital_period 
     * some planets has "0" value for both rotation_period and orbital_period 
     * */ 
    const filteredPlanets = _.filter(planets, function (o) {
      const rotationPeriod = _.toNumber(o.rotation_period)
      const orbitalPeriod = _.toNumber(o.orbital_period)

      const isNan = _.isNaN(rotationPeriod) && _.isNaN(orbitalPeriod)
      const isPositiveNumber = rotationPeriod > 0 && orbitalPeriod > 0

      return !isNan && isPositiveNumber
    })

    const biggestRatioPlanets = _.orderBy(
      filteredPlanets,
      [
        function (o) {
          return _.toNumber(o.orbital_period) / _.toNumber(o.rotation_period)
        },
      ],
      ["desc"]
    )

    const mostCharacterBornPlanets = _.orderBy(
      biggestRatioPlanets,
      [
        function (o) {
          return o.residents.length
        },
      ],
      ["desc"]
    )

    return response.json({
      biggest_ratio_planet: biggestRatioPlanets[0],
      most_character_born_planet: mostCharacterBornPlanets[0]
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
