var server = require('node-static')
var file = new server.Server('./')

require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response)
  }).resume()
}).listen(3000)

console.log('serving files at http://localhost:3000')
