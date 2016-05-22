// Functions needed for controlling
/*
    SETTINGS:
        drone height
        drone speed
        coordinates of unique identifers
        starting position
*/
/*
    drone_startUp();
    drone_rotate(angle); // -360 to 360
    drone_travel(distance); // moves forwards this distance
    drone_findPosition();
    drone_gotoPosition(x, y);
    drone_land();
*/

var SETTINGS = {
    speed: 0.025,
    rotateCoefficient: 100,
    speedCoefficient: 1000,
    height: undefined,
    startingPosition: {
        x: 0,
        y: 0
    },
    identifiers: [],
    outputImage: './test_images/out.jpg',
    saveImage: './test_images/save.jpg'
};

// Requires
var http = require('http');

var cv = require('opencv');
var arDrone = require('ar-drone');

var DRONE = arDrone.createClient();
DRONE.config('general:navdata_demo', 'FALSE');

var Drone = function() {
    this.pos = {
        x: 0,
        y: 0,
        ori: 0 // orientation -180 - 180
    };
};

Drone.prototype.takeoff = function() {
    DRONE.after(1000, function() {
            this.takeoff();
        })
        .after(4000, function() {});
};

Drone.prototype.land = function() {
    DRONE.after(2000, function() {
        this.stop();
        this.land();
    });
};

Drone.prototype.rotate = function(angle) {
    // turns to the angle given
    // angle should be between 180 and -180
    DRONE.after(0, function() {})
        .after(time, function() {
            this.stop();
        });
};

Drone.prototype.findPosition = function() {
    // finds position with detection_interface
    // turns around a target until it see a target
    // finds distance
};

Drone.prototype.travel = function(feet) {
    // moves this distance forwards (inches)
    // find distance to travel
    var distance = SETTINGS.speedCoefficient * feet;
    DRONE.after(0, function() {
            this.front(SETTINGS.speed);
        })
        .after(distance, function() {
            this.stop();
        });
};

Drone.prototype.goto = function() {
    this.getDistance(function(data) {
        var feet = data.distance / 12;
        feet = feet - 2;
        DRONE.travel(feet);
    });
};

Drone.prototype.startVideoCapture = function() {
    var s = new cv.ImageStream();
    s.on('data', function(matrix) {
        matrix.save(SETTINGS.outputImage);
    });
    DRONE.getPngStream().pipe(s);
};

Drone.prototype.saveImage = function() {
    cv.readImage(SETTINGS.outputImage, function(err, im) {
        if (err) throw err;
        if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');
        im.save(SETTINGS.saveImage);
        //console.log('Image saved to ' + imageName);
    });
};

Drone.prototype.stream = function() {
    require('ar-drone-png-stream')(DRONE, {
        port: 3000
    });
};

Drone.prototype.getDistance = function(callback) {
    http.get({
        hostname: 'localhost',
        port: 3000,
        path: '/',
        agent: false // create a new agent just for this one request
    }, function(res) {
        // Do stuff with response
        res.setEncoding('utf8');
        res.on('data', function(body) {
            var data = JSON.parse(body);
            callback(data);
        });
    });
};

Drone.prototype.wait = function(time) {
    DRONE.after(time, function() {});
};

var drone = new Drone();
drone.stream();
drone.wait(5000);
drone.takeoff();
drone.travel(8);
drone.land();
