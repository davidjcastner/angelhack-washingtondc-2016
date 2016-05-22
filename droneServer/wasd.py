import argparse
import cv2
import numpy as np


##when using for drone, comment out videos and switch everything to just images
##you have access to the inches variable to make decisions off of.



IMAGE_PATHS =  "C:/Users/Aide/Documents/GitHub/angelhack-washingtondc-2016/distance-to-camera/calibrate6.jpg"


inches = 0

def find_marker(image):
    #Converts image into various formats
    color = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(color, (5, 5), 0)
    edged = cv2.Canny(blurred, 35, 125)
    return edged
    
    # compute the bounding box of the of the paper region and return it
    #return cv2.minAreaRect(c)

def distance_to_camera(w):
   # compute and return the distance from the maker to the camera
    
        constant = 114
        print w
        print "pixel"
        inches = (4.75*(w/100.0))
        print inches
        print " inches"
        distance = constant / inches
        print distance
        print " distance"
        return distance

while True:
        #grabes image to read
        image = cv2.imread(IMAGE_PATHS)
       # (grabbed, image) = camera.read()
        edged = find_marker(image)
        status = "No Targets"
        
        # find contours in the edge map
        (cnts, _) = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE)
        
        #loop over the contours
        for c in cnts:
            #approximate the contour
            peri = cv2.arcLength(c, True)
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
                keepAspectRatio = aspectRatio >= 0.8 and aspectRatio <= 1.2

                # ensure that the contour passes all our tests
                if keepDims and keepSolidity and keepAspectRatio:
                    # draw an outline around the target and update the status
                    # text
                    cv2.drawContours(image, [approx], -1, (0, 0, 255), 4)
                    status = "Target(s) Acquired"

                    #gets distance
                    inches = distance_to_camera(w)
                    #print inches

                    # compute the center of the contour region and draw the
                    # crosshairs
                    M = cv2.moments(approx)
                    (cX, cY) = (int(M["m10"] / M["m00"]), int(M["m01"] / M["m00"]))
                    (startX, endX) = (int(cX - (w * 0.15)), int(cX + (w * 0.15)))
                    (startY, endY) = (int(cY - (h * 0.15)), int(cY + (h * 0.15)))
                    cv2.line(image, (startX, cY), (endX, cY), (0, 0, 255), 3)
                    cv2.line(image, (cX, startY), (cX, endY), (0, 0, 255), 3)

             
##            # draw the status text on the frame
##            cv2.putText(frame,   status, (20, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5,
##                    (0, 0, 255), 2)
        cv2.putText(image, "%.2fin" % inches,
                (image.shape[1] - 200, image.shape[0] - 20), cv2.FONT_HERSHEY_SIMPLEX,
                2.0, (0, 255, 0), 3)
        
        # show the frame and record if a key is pressed
        cv2.imshow("Frame", image)
        key = cv2.waitKey(1) & 0xFF

        # if the 'q' key is pressed, stop the loop
        if key == ord("q"):
                break

# cleanup the camera and close any open windows
camera.release()
cv2.destroyAllWindows()
