const hello = require('./hello')
const ping = require('./ping')


module.exports = function(router){
  hello(router)
  ping(router)
}