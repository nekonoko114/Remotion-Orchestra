
import argparse
import os
from datetime import datetime
from gtts import gTTS

def generate_audio(text, character_name, output_dir):
    """
    Generates an MP3 audio file from text using gTTS.
    """
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Generate filename
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"{character_name}_{timestamp}.mp3"
    filepath = os.path.join(output_dir, filename)

    print(f"Generating audio for {character_name}: '{text}'")
    
    try:
        # Generate audio
        tts = gTTS(text=text, lang='ja')
        tts.save(filepath)
        print(f" Successfully saved to: {filepath}")
        return filename
    except Exception as e:
        print(f"Error generating audio: {e}")
        return None

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate MP3 narration from text using gTTS.")
    parser.add_argument("--text", required=True, help="The text to speak.")
    parser.add_argument("--character", required=True, help="Name of the character (e.g., shiori).")
    parser.add_argument("--out", required=True, help="Output directory for the audio file.")

    args = parser.parse_args()

    generate_audio(args.text, args.character, args.out)
