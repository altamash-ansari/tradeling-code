const hello = require('./hello')
const ping = require('./ping')
const starWars = require('./sw')

module.exports = function(router){
  hello(router)
  ping(router)
  starWars(router)
}