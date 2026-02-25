
import os
from rembg import remove
from PIL import Image
from pathlib import Path

# Configuration
INPUT_DIR = '/Users/sumash/Developer/remotion-projects/KALEIDANOVA/public/assets/generated/soregayasashisa_magic_backup'
OUTPUT_DIR = '/Users/sumash/Developer/remotion-projects/KALEIDANOVA/public/assets/generated/soregayasashisa_magic_nobg'

def process_images():
    # Create output directory if it doesn't exist
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
    
    # Get all PNG files
    files = [f for f in os.listdir(INPUT_DIR) if f.lower().endswith('.png')]
    total = len(files)
    
    print(f"Found {total} images to process in {INPUT_DIR}")
    print(f"Output directory: {OUTPUT_DIR}")
    
    for i, filename in enumerate(files):
        input_path = os.path.join(INPUT_DIR, filename)
        output_path = os.path.join(OUTPUT_DIR, filename)
        
        # Skip if already exists (optional, but good for resuming)
        if os.path.exists(output_path):
            print(f"[{i+1}/{total}] Skipping {filename} (already exists)")
            continue
            
        print(f"[{i+1}/{total}] Processing {filename}...")
        
        try:
            with open(input_path, 'rb') as i_file:
                with open(output_path, 'wb') as o_file:
                    input_data = i_file.read()
                    output_data = remove(input_data)
                    o_file.write(output_data)
        except Exception as e:
            print(f"Error processing {filename}: {e}")

    print("Batch processing complete!")

if __name__ == '__main__':
    process_images()
