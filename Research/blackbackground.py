import cv2
import numpy as np

def isolate_subject_background_black(image_path):
    image = cv2.imread(image_path)
    
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    edges = cv2.Canny(blurred, 100, 200)
    
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    min_area_threshold = 1000  
    large_contours = [cnt for cnt in contours if cv2.contourArea(cnt) > min_area_threshold]
    
    if large_contours:
        mask = np.zeros_like(image)
        
        cv2.drawContours(mask, large_contours, -1, (255, 255, 255), thickness=cv2.FILLED)
        
        mask_gray = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
        
        final_image = np.zeros_like(image)
        final_image[mask_gray == 255] = image[mask_gray == 255]
        
        cv2.imshow('Final Image', final_image)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
    else:
        print("No large contours found.")

image_path = 'path_to_your_image.jpg'
isolate_subject_background_black(image_path)
