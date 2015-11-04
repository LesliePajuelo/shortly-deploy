var app = require('./server.js');

 var port = 4568;
//Set server to listen on an environment-specific port or default to provided port;
app.listen(process.env.PORT || port);

console.log('Server now listening on port ' + port);
