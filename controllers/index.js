const hello = require('./hello')
const ping = require('./ping')
const starWars = require('./sw')
const closestTargetNumbers = require('./closest-target-numbers')


module.exports = function(router){
  hello(router)
  ping(router)
  starWars(router)
  closestTargetNumbers(router)
}