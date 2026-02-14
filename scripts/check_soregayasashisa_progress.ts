
import fs from 'fs';
import path from 'path';
import { LYRIC_GROUPS } from '../src/compositions/Soregayasashisa/lyrics';

const GENERATED_DIR = path.join(process.cwd(), 'public/assets/generated/soregayasashisa');

async function checkProgress() {
    console.log(`Checking progress for ${LYRIC_GROUPS.length} scenes...`);
    
    if (!fs.existsSync(GENERATED_DIR)) {
        console.log(`Directory not found: ${GENERATED_DIR}`);
        return;
    }

    const files = fs.readdirSync(GENERATED_DIR);
    const existingIndices = new Set<number>();

    files.forEach(file => {
        const match = file.match(/scene_(\d+)\.png/);
        if (match) {
            existingIndices.add(parseInt(match[1], 10));
        }
    });

    const missingIndices: number[] = [];
    for (let i = 0; i < LYRIC_GROUPS.length; i++) {
        if (!existingIndices.has(i)) {
            missingIndices.push(i);
        }
    }

    console.log(`Total Lyric Groups: ${LYRIC_GROUPS.length}`);
    console.log(`Generated Images: ${existingIndices.size}`);
    console.log(`Missing Images: ${missingIndices.length}`);
    
    if (missingIndices.length > 0) {
        console.log(`Missing Scene Indices: ${missingIndices.join(', ')}`);
    } else {
        console.log("All scenes are generated!");
    }
}

checkProgress();
