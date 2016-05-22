var cv = require('opencv');
var arDrone = require('ar-drone');
var client = arDrone.createClient();

var tempImage = './test_images/out.jpg';

var startVideoCapture = function() {
    var s = new cv.ImageStream();
    s.on('data', function(matrix) {
        matrix.save(tempImage);
    });
    client.getPngStream().pipe(s);
};

var lower_threshold = [128, 128, 128];
var upper_threshold = [255, 255, 255];

var saveImage = function(imageName) {
    cv.readImage(tempImage, function(err, im) {
        if (err) throw err;
        if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');
        im.save(imageName);
        console.log('Image saved to ' + imageName);
    });
};

var checkImage = function() {
    var output = './detect.jpg';
    cv.readImage(tempImage, function(err, im) {
        if (err) throw err;
        if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');

        im.inRange(lower_threshold, upper_threshold);
        im.save(output);
        console.log('Image saved to ' + output);
    });
};

var grayScale = function() {
    var output = './grayScale.jpg';
    cv.readImage(tempImage, function(err, im) {
        if (err) throw err;
        if (im.width() < 1 || im.height() < 1) throw new Error('Image has no size');
        im.convertGrayscale();
        im.save(output);
        console.log('Image saved to ' + output);
    });
};

var detectShapes = function() {
    var output = './shapes.png';

    var lowThresh = 0;
    var highThresh = 100;
    var nIters = 2;
    var minArea = 2000;

    var BLUE = [0, 255, 0]; // B, G, R
    var RED = [0, 0, 255]; // B, G, R
    var GREEN = [0, 255, 0]; // B, G, R
    var WHITE = [255, 255, 255]; // B, G, R

    cv.readImage(tempImage, function(err, im) {
        if (err) throw err;

        width = im.width();
        height = im.height();
        if (width < 1 || height < 1) throw new Error('Image has no size');

        var out = new cv.Matrix(height, width);
        im.convertGrayscale();
        im_canny = im.copy();
        im_canny.canny(lowThresh, highThresh);
        im_canny.dilate(nIters);

        contours = im_canny.findContours();

        for (i = 0; i < contours.size(); i++) {

            if (contours.area(i) < minArea) continue;

            var arcLength = contours.arcLength(i, true);
            contours.approxPolyDP(i, 0.01 * arcLength, true);

            switch (contours.cornerCount(i)) {
                case 3:
                    out.drawContour(contours, i, GREEN);
                    break;
                case 4:
                    out.drawContour(contours, i, RED);
                    break;
                default:
                    out.drawContour(contours, i, WHITE);
            }
        }

        out.save(output);
        console.log('Image saved to ' + output);
    });
};

startVideoCapture();
//setInterval(detectShapes, 1000);
//detectShapes();
setTimeout(saveImage, 2000, './test_images/calibrate.jpg');
