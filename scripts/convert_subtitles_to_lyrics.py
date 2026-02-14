import json
import os

input_path = '/Users/sumash/Developer/remotion-projects/KALEIDANOVA/src/compositions/Soregayasashisa/subtitles.json'
output_path = '/Users/sumash/Developer/remotion-projects/KALEIDANOVA/src/compositions/Soregayasashisa/lyrics.ts'

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

lyrics = []
fps = 30

for seg in data['segments']:
    text = seg['text'].strip()
    start = seg['start']
    end = seg['end']
    
    # Simple logic to guess style based on time or text
    # Usually chorus starts around 50s and 130s?
    style = 'emotional'
    if 50 <= start <= 75 or 130 <= start <= 155:
        style = 'pop'
    elif 110 <= start <= 125:
        style = 'cinematic'
        
    line = f'\t{{ text: "{text}", startFrame: Math.round({start} * FPS), endFrame: Math.round({end} * FPS), style: "{style}" }},'
    lyrics.append(line)

content = f"""export interface LyricLine {{
	text: string;
	startFrame: number;
	endFrame: number;
	style?: 'emotional' | 'cinematic' | 'pop';
	color?: string;
}}

const FPS = {fps};

export const LYRICS: LyricLine[] = [
{chr(10).join(lyrics)}
];
"""

with open(output_path, 'w', encoding='utf-8') as f:
    f.write(content)
