import pyrealsense2 as rs
import numpy as np
import cv2
import random
import time

# Configure depth and color streams
pipeline = rs.pipeline()
config = rs.config()
config.enable_stream(rs.stream.depth, 640, 480, rs.format.z16, 30)
config.enable_stream(rs.stream.color, 640, 480, rs.format.bgr8, 30)

# Start streaming
pipeline.start(config)

# Generate four random points
points = [(random.randint(0, 639), random.randint(0, 479)) for _ in range(4)]

# Initialize timer
last_time = time.time()

try:
    while True:
        # Wait for a coherent pair of frames: depth and color
        frames = pipeline.wait_for_frames()
        depth_frame = frames.get_depth_frame()
        color_frame = frames.get_color_frame()
        if not depth_frame or not color_frame:
            continue

        # Convert images to numpy arrays
        depth_image = np.asanyarray(depth_frame.get_data())
        color_image = np.asanyarray(color_frame.get_data())

        # Apply colormap on depth image (image must be converted to 8-bit per pixel first)
        depth_colormap = cv2.applyColorMap(cv2.convertScaleAbs(depth_image, alpha=0.03), cv2.COLORMAP_JET)

        # Process each random point
        for i, (x, y) in enumerate(points):
            distance_meters = depth_frame.get_distance(x, y)
            distance_inches = distance_meters * 39.37  # Convert meters to inches
            distance_text = f"P{i+1}: {distance_inches:.2f} inches"

            # Display the distance on the color image
            cv2.putText(color_image, distance_text, (x+10, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1, cv2.LINE_AA)
            
            # Draw a circle at each point
            cv2.circle(color_image, (x, y), 5, (0, 0, 255), -1)
            cv2.circle(depth_colormap, (x, y), 5, (255, 255, 255), -1)

        # Print distances approximately every 5 seconds
        current_time = time.time()
        if current_time - last_time >= 5:
            for i, (x, y) in enumerate(points):
                distance_meters = depth_frame.get_distance(x, y)
                distance_inches = distance_meters * 39.37
                print(f"P{i+1}: {distance_inches:.2f} inches at ({x}, {y})")
            last_time = current_time

        # Show images
        cv2.imshow('RealSense - Color', color_image)
        cv2.imshow('RealSense - Depth', depth_colormap)

        # Press 'q' to quit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
finally:
    # Stop streaming
    pipeline.stop()
    cv2.destroyAllWindows()
