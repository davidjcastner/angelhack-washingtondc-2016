var arDrone = require('ar-drone');
var client = arDrone.createClient();

client.after(0, function() {
    this.stop();
    this.land();
});
