import cv2
import numpy as np


cap = cv2.VideoCapture(0)


frame_width = int(cap.get(3))
frame_height = int(cap.get(4))


fourcc = cv2.VideoWriter_fourcc(*'MP4V')
out = cv2.VideoWriter('blurred_background_webcam_output.mp4', fourcc, 20.0, (frame_width, frame_height))

while True:
    ret, frame = cap.read()
    if not ret:
        break

    center_x, center_y = frame_width // 2, frame_height // 2
    width, height = frame_width // 4, frame_height // 4 
    topLeft = (center_x - width // 2, center_y - height // 2)
    bottomRight = (center_x + width // 2, center_y + height // 2)


    mask = np.zeros(frame.shape, dtype=np.uint8)
    cv2.rectangle(mask, topLeft, bottomRight, (255, 255, 255), -1) 

    blurred_frame = cv2.GaussianBlur(frame, (21, 21), 0)

    masked = np.where(mask==np.array([255, 255, 255]), frame, blurred_frame)

    out.write(masked)

    cv2.imshow('Frame', masked)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
out.release()
cv2.destroyAllWindows()
