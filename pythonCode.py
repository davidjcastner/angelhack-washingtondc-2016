import argparse
import cv2
import numpy as np

def find_maker(image):
    #Converts image into various formats
    color = cv2.cvtColor(image, cv2.Color_BGR2GRAY)
    grey = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(gray, 35, 125)
    
    # find the contours in the edged image and keep the largest one;
    # we'll assume that this is our piece of paper in the image
    (cnts, _) = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    c = max(cnts, key = cv2.contourArea)

//done
def distance_to_camera(knownWidth, focalLength, perWidth):

//done        
	# compute and return the distance from the maker to the camera
	return (knownWidth * focalLength) / perWidth
//done
# initialize the known distance from the camera to the object, which
# in this case is 24 inches
KNOWN_DISTANCE = 24.0
//done
# initialize the known object width, which in this case, the piece of
# paper is 12 inches wide
KNOWN_WIDTH = 4.75

# initialize the list of images that we'll be using
IMAGE_PATHS =  "calibrate.jpg"

while True:

    #grabes image to read
    image = cv2.imread(IMAGE_PATHS)
    #calls function that finds the object
    marker = find_marker(image)
    focalLength = (marker[1][0] * KNOWN_DISTANCE) / KNOWN_WIDTH
    
    #grab the current frame and initalize status
    (grabbed, frame) = camera.read()

##    #gets the image
##    find_maker(image)

##    # find the contours in the edged image and keep
##    (cnts, _) = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
##    c = max(cnts, key = cv2.contourArea)

    #loop over the contours
    for c in cnts:
        #approximate the contour
        peri = cv2.archLength(c, True)
        approx = cv2.approxPolyDP(c, 0.01 * peri, True)

        #ensure that the approximated conture is square
        if len(approx) >=4 and len(approx) <=6:            
            #use bonding box
            (x, y, w, h) = cv2.boundingRect(approx)
            aspectRatio = w / float (h)

            #compute solidity of the contour
            area = cv2.contourArea(c)
            hullArea = cv2.contourArea(cv2.convexHull(c))
            solidity = area / float(hullArea)

            #compute whether or not the width and height solidity and
            #aspect ratio of the contour falls within appropriate bounds
            keepDims = w > 25 and h > 25
            keepSolidity = solidity > 0.9
            keepAspectRatio = aspectRatio > =.8 and aspectRatio <= 1.2

            # ensure that the contour passes all our tests
            if keepDims and keepSolidity and keepAspectRatio:
                # draw an outline around the target and update the status
                # text
                cv2.drawContours(frame, [approx], -1, (0, 0, 255), 4)
                status = "Target(s) Acquired"

                # compute the center of the contour region and draw the
                # crosshairs
                M = cv2.moments(approx)
                (cX, cY) = (int(M["m10"] / M["m00"]), int(M["m01"] / M["m00"]))
                (startX, endX) = (int(cX - (w * 0.15)), int(cX + (w * 0.15)))
                (startY, endY) = (int(cY - (h * 0.15)), int(cY + (h * 0.15)))
                cv2.line(frame, (startX, cY), (endX, cY), (0, 0, 255), 3)
                cv2.line(frame, (cX, startY), (cX, endY), (0, 0, 255), 3)

                
