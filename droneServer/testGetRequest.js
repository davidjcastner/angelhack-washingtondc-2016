var http = require('http');

http.get({
    hostname: 'localhost',
    port: 8000,
    path: '/',
    agent: false // create a new agent just for this one request
}, function(res) {
    // Do stuff with response
    res.setEncoding('utf8');
    res.on('data', function(body) {
        console.log(body);
    });
});
