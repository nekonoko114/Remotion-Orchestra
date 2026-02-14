import { staticFile } from 'remotion';

// Import visual components if needed for type definitions, 
// using string identifiers to avoid circular dependencies if simple mapping is preferred.
import { QuietNight } from './BackgroundScenes/QuietNight';
import { CyberChorus } from './BackgroundScenes/CyberChorus';
import { DigitalRain } from './BackgroundScenes/DigitalRain';
import { GoldRush } from './BackgroundScenes/GoldRush';
import { KaleidoNova } from './BackgroundScenes/KaleidoNova';

export type SectionType = 'intro' | 'verse' | 'chorus' | 'bridge' | 'outro';
export type SceneId = 'QuietNight' | 'CyberChorus' | 'DigitalRain' | 'GoldRush' | 'KaleidoNova';

export interface TimelineSection {
    id: string;
    type: SectionType;
    start: number; // seconds
    end: number;   // seconds
    sceneId: SceneId;
    component: React.FC<{ beat?: number }>;
    // Character settings
    characterImage?: string;
    characterLayout?: 'center' | 'left' | 'right' | 'hidden';
    characterAnimation?: 'fade' | 'slide' | 'none';
    // Effect settings
    showSpeedLines?: boolean;
    showSpeedSlash?: boolean;
}

export const TIMELINE: TimelineSection[] = [
    {
        id: 'A-Melody',
        type: 'verse',
        start: 0,
        end: 52.7,
        sceneId: 'QuietNight',
        component: QuietNight,
        characterImage: staticFile('nova-chracter-02.png'),
        characterLayout: 'center',
        characterAnimation: 'fade',
        showSpeedLines: false, // Calm
        showSpeedSlash: false,
    },
    {
        id: 'Chorus-A',
        type: 'chorus',
        start: 52.7,
        end: 79.6,
        sceneId: 'QuietNight',
        component: QuietNight,
        characterImage: staticFile('nova-chracter-02.png'),
        characterLayout: 'center', // Maybe slightly offset in future?
        characterAnimation: 'slide',
        showSpeedLines: true, // High energy
        showSpeedSlash: true,
    },
    {
        id: 'B-Melody',
        type: 'verse',
        start: 79.6,
        end: 105.1,
        sceneId: 'DigitalRain',
        component: DigitalRain,
        characterImage: staticFile('nova-chracter-02.png'),
        characterLayout: 'left', // Shift for variety
        characterAnimation: 'fade',
        showSpeedLines: false,
        showSpeedSlash: false,
    },
    {
        id: 'Chorus-B',
        type: 'chorus',
        start: 105.1,
        end: 145.7,
        sceneId: 'QuietNight',
        component: QuietNight,
        characterImage: staticFile('nova-chracter-02.png'),
        characterLayout: 'center',
        characterAnimation: 'slide',
        showSpeedLines: true,
        showSpeedSlash: true,
    },
    {
        id: 'Last-Chorus',
        type: 'chorus',
        start: 145.7,
        end: 999.0, // Until end
        sceneId: 'QuietNight',
        component: QuietNight,
        characterImage: staticFile('nova-chracter-02.png'),
        characterLayout: 'center',
        characterAnimation: 'slide',
        showSpeedLines: true,
        showSpeedSlash: true,
    },
];

// Helper to find current section
export const getCurrentSection = (time: number): TimelineSection | undefined => {
    return TIMELINE.find(section => time >= section.start && time < section.end);
};
