import cv2
import numpy as np
import json
import os

# Function to process the image and export the JSON file
def process_image(img, output_folder, filename):
    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply binary thresholding
    _, binary = cv2.threshold(gray, lower_thresh, upper_thresh, cv2.THRESH_BINARY)

    # Process the binary image and store the results in an array
    column_positions = []
    for col in range(binary.shape[1]):
        black_pixels = np.where(binary[:, col] == 0)[0]
        if len(black_pixels) > 0:
            column_positions.append(int(np.min(black_pixels)))
        else:
            column_positions.append(-1)  # No black pixel in the column

    # Export the results to a JSON file
    output_filename = os.path.join(output_folder, os.path.splitext(filename)[0] + ".json")
    json_data = {
        "input_image": filename,
        "values": column_positions
    }
    with open(output_filename, 'w') as json_file:
        json.dump(json_data, json_file)

if __name__ == "__main__":
    input_folder = "public"
    output_folder = "public"

    cv2.namedWindow('Image', cv2.WINDOW_NORMAL)
    cv2.createTrackbar('Lower', 'Image', 0, 255, lambda x: None)
    cv2.createTrackbar('Upper', 'Image', 255, 255, lambda x: None)

    # Iterate through all image files in the input folder
    for filename in os.listdir(input_folder):
        if filename.endswith(('.jpg', '.jpeg', '.png', '.bmp')):
            image_path = os.path.join(input_folder, filename)
            img = cv2.imread(image_path)

            # Resize the image if it's larger than 1920px width
            if img.shape[1] > 1920:
                img = cv2.resize(img, (1920, int(1920 / img.shape[1] * img.shape[0])))

            while True:
                # Get current threshold values
                lower_thresh = cv2.getTrackbarPos('Lower', 'Image')
                upper_thresh = cv2.getTrackbarPos('Upper', 'Image')

                # Display the image with adjustable threshold
                # cv2.imshow('Image', img)

                # Convert the image to grayscale
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

                # Apply binary thresholding
                _, binary = cv2.threshold(gray, lower_thresh, upper_thresh, cv2.THRESH_BINARY)
                cv2.imshow('Image', binary)

                k = cv2.waitKey(1) & 0xFF
                if k == 27:  # ESC key to exit
                    break
                elif k == 13:  # ENTER key to process and export results
                    process_image(img, output_folder, filename)
                    break

    cv2.destroyAllWindows()
