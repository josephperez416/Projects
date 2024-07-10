import cv2
from rembg import remove
from PIL import Image
import numpy as np

# Start the webcam feed
cap = cv2.VideoCapture(0)

try:
    while True:
        # Capture frame-by-frame
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame")
            break

        # Convert the BGR image to RGB and then to a PIL Image
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(frame_rgb)

        # Remove the background from the PIL Image
        pil_img_no_bg = remove(pil_img)

        # Convert back to an OpenCV image (BGR)
        img_no_bg = np.array(pil_img_no_bg)[:, :, ::-1].copy()  # RGB to BGR

        # Display the resulting frame
        cv2.imshow('Frame without Background', img_no_bg)

        # Break the loop when 'q' is pressed
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

finally:
    # When everything done, release the capture
    cap.release()
    cv2.destroyAllWindows()
