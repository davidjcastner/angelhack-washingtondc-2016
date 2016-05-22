var arDrone = require('ar-drone');
var client = arDrone.createClient();
client.on('navdata', function(data) {
    //console.log(this);
    console.log(data.demo);
});

var calibrate = function() {
    client
        .after(2000, function() {
            this.takeoff();
        })
        .after(4000, function() {
            this.calibrate(0);
        })
        .after(8000, function() {
            this.stop();
            this.land();
        });
};

//calibrate();
//client.on('navdata', console.log);
