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

// Requires
var detection = require('./detection_interface.js');
var arDrone = require('ar-drone');

var Drone;

var DRONE_POSITION = {
    x: 0,
    y: 0,
    ori: 0 // orientation 0-360
};

// queue for executing drone commands
var DroneQueue = [];

var drone_startUp = function() {
    Drone = arDrone.createClient();
    Drone
        .after(2000, function() {
            this.takeoff();
        })
        .after(2000, drone_findPosition);
    drone_gotoPosition(startingPosition);
};

var drone_rotate = function(angle) {
    //
};

var drone_travel = function(distance) {
    //
};

var drone_findPosition = function() {
    // finds position and updates drone position
    // rotates around scanning for identifiers
};

var drone_gotoPosition = function(x, y) {
    // find angle necessary to turn
    var angle;
    drone_turnAngle(angle);
    // find distance to travel
    var distance;
    drone_travel(distance);
};
