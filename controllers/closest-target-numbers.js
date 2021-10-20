const _ = require("lodash")

module.exports = function (router) {
  router.get("/closets-number", (request, response) => {
    if (request.body && request.body.numbers && request.body.target) {
      const numbers = request.body.numbers
      const target = request.body.target

      if (_.isNaN(_.toNumber(target))) {
        return response.status(400).send("Target should be a number")
      }

      return response
        .json(findClosestNumber(numbers, target))
    } else {
      return response
        .status(400)
        .send("Please send data in JSON body with fields numbers and targets")
    }
  })
}

function findClosestNumber(numbers, target) {
  let closestSum = 0
  let number1, number2, number3
  
  numbers.sort((a, b) => a - b)

  for (let i = 0; i < numbers.length - 2; i++) {
    // Two indexes initially pointing at the last and the element next to the fixed element
    let index1 = i + 1,
      index2 = numbers.length - 1

    // While there could be more pairs to check
    while (index1 < index2) {
      // Calculate the sum of the current triplet
      let sum = numbers[i] + numbers[index1] + numbers[index2]

      // If the sum is more closer than the current closest sum
      if (Math.abs(1 * target - sum) < Math.abs(1 * target - closestSum)) {
        number1 = numbers[i]
        number2 = numbers[index1]
        number3 = numbers[index2]
        closestSum = sum
      }

      // If sum is greater then x then decrement the index2 to get a smaller sum
      if (sum > target) {
        index2--
      }

      // Else increment the index1 to get a larger sum
      else {
        index1++
      }
    }
  }

  return {
    closestSum,
    number1,
    number2,
    number3,
  }
}
