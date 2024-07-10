import cv2 as cv
import numpy as np
import time

# Open webcam
cap = cv.VideoCapture(0)

# Create a tracker object
tracker = cv.TrackerMIL_create()

# Get initial frame for ROI selection
ret, frame = cap.read()
if not ret:
    print("Failed to read from the webcam.")
    cap.release()
    exit()

# Select ROI for tracker from the first frame
bbox = cv.selectROI("Frame", frame, fromCenter=False, showCrosshair=True)
tracker.init(frame, bbox)

# Function to simulate depth measurement (since regular webcams don't provide depth data)
def calculate_depth(x, y, w, h):
    # Placeholder function: for real applications, use a stereo camera or other depth sensor
    # For demonstration, we'll return a dummy depth value
    return 50.0  # Assume a fixed distance of 50 inches for simplicity

# Initialize variables for updating distance
last_update_time = time.time()
update_interval = 5  # seconds
distance_inches = calculate_depth(bbox[0], bbox[1], bbox[2], bbox[3])

try:
    while True:
        # Read each frame from the webcam
        ret, frame = cap.read()
        if not ret:
            break

        # Update the tracker with the current frame
        ret, bbox = tracker.update(frame)
        if ret:
            # Draw bounding box
            x, y, w, h = map(int, bbox)
            cv.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

            # Calculate the center of the bounding box
            center_x = x + w // 2
            center_y = y + h // 2
            cv.circle(frame, (center_x, center_y), 5, (0, 0, 255), -1)

            # Update the distance every 5 seconds
            current_time = time.time()
            if current_time - last_update_time >= update_interval:
                distance_inches = calculate_depth(center_x, center_y, w, h)
                last_update_time = current_time

                # Print the distance in the terminal
                distance_text = f"Distance: {distance_inches:.2f} inches"
                print(distance_text)

        # Show images
        cv.imshow("Tracking", frame)

        # Press 'q' to quit
        if cv.waitKey(1) & 0xFF == ord('q'):
            break

finally:
    # Release webcam
    cap.release()
    cv.destroyAllWindows()
