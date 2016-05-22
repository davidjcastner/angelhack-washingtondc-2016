var arDrone = require('ar-drone');
var client = arDrone.createClient();

require('ar-drone-png-stream')(client, {
    port: 8000
});

var takeoffAndLand = function() {
    client
        .after(2000, function() {
            this.takeoff();
        })
        .after(8000, function() {
            this.stop();
            this.land();
        });
};

takeoffAndLand();
//client.on('navdata', console.log);
