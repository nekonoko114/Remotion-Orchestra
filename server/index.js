
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Paths
const ROOT_DIR = path.resolve(__dirname, '..');
const BATTLE_JSON_PATH = path.join(ROOT_DIR, 'battle.json');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - ${res.statusCode}`);
    });
    next();
});
app.use('/assets', express.static(PUBLIC_DIR));

// API Routes

// 1. List Projects
app.get('/api/projects', (req, res) => {
    const projectsDir = path.join(ROOT_DIR, 'projects');
    if (!fs.existsSync(projectsDir)) {
        fs.mkdirSync(projectsDir);
    }
    const files = fs.readdirSync(projectsDir)
        .filter(file => file.endsWith('.json'))
        .map(file => {
            const filePath = path.join(projectsDir, file);
            let templateId = 'JOL-Battle-Kawaii';
            let name = file.replace('.json', '');
            try {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                if (data.templateId) templateId = data.templateId;
                if (data.name) name = data.name;
            } catch (e) {}

            return {
                id: file,
                name: name,
                templateId: templateId,
                updatedAt: fs.statSync(filePath).mtime
            };
        });
    res.json(files);
});

// Available templates (Composition IDs from Root.tsx)
const TEMPLATES = [
    // --- JOL Battle Series ---
    { id: 'JOL-Battle-Kawaii', name: 'Battle Kawaii (Default)', description: 'Pop and cute battle style' },
    { id: 'JOL-Battle-Inferno', name: 'Battle Inferno', description: 'Intense fire style' },
    { id: 'JOL-Battle-Water', name: 'Battle Water', description: 'Cool water style' },
    { id: 'JOL-Battle-Crystal', name: 'Battle Crystal', description: 'Shiny crystal style' },
    { id: 'JOL-Battle', name: 'Battle Standard', description: 'Standard crystal battle' },
    
    // --- JOL Ranking Series ---
    { id: 'JOL-Ranking-Vertical', name: 'JOL Ranking Vertical', description: 'Standard vertical ranking' },
    { id: 'JOL-Ranking-time', name: 'JOL Ranking Time', description: 'Time-based ranking layout' },
    { id: 'JOL-Video', name: 'JOL Video', description: 'General purpose 60fps video' },

    // --- TikTok Liver Series ---
    { id: 'TikTokBattle', name: 'TikTok Battle', description: 'TikTok specific battle layout' },
    { id: 'TikTokRanking', name: 'TikTok Ranking', description: 'TikTok specific ranking layout' },
    { id: 'TikTokAutoCut', name: 'TikTok AutoCut', description: 'Automated cutting composition' },
    { id: 'LiverFormatter', name: 'Liver Formatter', description: 'Jump cut automation for streams' },
    { id: 'CatRabbitEnjoy', name: 'Cat & Rabbit Enjoy', description: 'Automated character animation' },

    // --- VFX & Storytelling ---
    { id: 'CyberpunkBattle', name: 'Cyberpunk Battle', description: 'Neon cyberpunk style' },
    { id: 'CatsAdventure', name: 'Cats Adventure', description: 'Storytelling adventure style' },
    { id: 'ThreeDTextScene', name: '3D Text Scene', description: '3D Text rendering scene' },
    { id: 'VFXShowreel', name: 'VFX Showreel', description: 'Showcase of visual effects' },
    { id: 'EffectsCatalog', name: 'Effects Catalog', description: 'Catalog of available effects' },
    
    // --- Utility & Testing ---
    { id: 'JsonDrivenVideo', name: 'JSON Driven Video', description: 'Fully JSON configured video' },
    { id: 'PCRanking', name: 'PC Ranking', description: 'Horizontal ranking layout' },
    { id: 'AssetCatalog', name: 'Asset Catalog', description: 'List of all assets' },
];

app.get('/api/templates', (req, res) => {
    res.json(TEMPLATES);
});

// 2. Get Project
app.get('/api/projects/:id', (req, res) => {
    const filePath = path.join(ROOT_DIR, 'projects', req.params.id);
    if (fs.existsSync(filePath)) {
        const config = fs.readFileSync(filePath, 'utf-8');
        res.json(JSON.parse(config));
    } else {
        res.status(404).json({ error: 'Project not found' });
    }
});

// 3. Create Project
app.post('/api/projects', (req, res) => {
    const { name, templateId } = req.body;
    const projectsDir = path.join(ROOT_DIR, 'projects');
    const safeName = name.replace(/[^a-z0-9-]/gi, '_').toLowerCase();
    const filename = `${safeName}.json`;
    const filePath = path.join(projectsDir, filename);

    if (fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'Project already exists' });
    }

    // Load initial data based on template (currently only supports copying default as base config)
    // IMPORTANT: We inject the selected templateId into the project JSON so Remotion knows what to render
    let initialData = {};
    const defaultPath = path.join(projectsDir, 'default.json');
    
    if (fs.existsSync(defaultPath)) {
        initialData = JSON.parse(fs.readFileSync(defaultPath, 'utf-8'));
    }

    const newProjectData = {
        ...initialData,
        name: name,
        templateId: templateId || 'JOL-Battle-Kawaii', // The core field linking to Root.tsx
        createdAt: new Date().toISOString()
    };
    
    fs.writeFileSync(filePath, JSON.stringify(newProjectData, null, 2));
    res.json({ success: true, id: filename });
});

// 4. Update Project
app.post('/api/projects/:id', (req, res) => {
    const filePath = path.join(ROOT_DIR, 'projects', req.params.id);
    try {
        fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
        res.json({ success: true, message: 'Project saved' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 3. Generate Audio
app.post('/api/generate-audio', (req, res) => {
    const { text, character } = req.body;
    const scriptPath = path.join(ROOT_DIR, 'scripts/gen_audio.py');
    const outDir = path.join(PUBLIC_DIR, 'audio/narration');
    
    if (!fs.existsSync(outDir)) {
        shell.mkdir('-p', outDir);
    }

    const cmd = `python3 "${scriptPath}" --text "${text}" --character "${character}" --out "${outDir}"`;
    if (shell.exec(cmd).code !== 0) {
        return res.status(500).json({ error: 'Audio generation failed' });
    }
    res.json({ success: true, message: 'Audio generated' });
});

// 4. List Assets
app.get('/api/assets', (req, res) => {
    const listFiles = (dir, category, baseRoute) => {
        if (!fs.existsSync(dir)) return [];
        return fs.readdirSync(dir)
            .filter(file => !file.startsWith('.') && !file.endsWith('.json') && !file.endsWith('.csv'))
            .map(file => ({
                name: file,
                category,
                url: `/assets/${baseRoute}/${file}`,
                path: `${baseRoute}/${file}`
            }));
    };

    const icons = listFiles(path.join(PUBLIC_DIR, 'video-factory/images/icons'), 'Icon', 'video-factory/images/icons');
    const narrations = listFiles(path.join(PUBLIC_DIR, 'audio/narration'), 'Narration', 'audio/narration');
    const music = listFiles(path.join(PUBLIC_DIR, 'assets/audio/music'), 'Music', 'assets/audio/music');

    res.json({ 
        images: icons, 
        audio: [...narrations, ...music] 
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Orchestra Controller running at http://localhost:${PORT}`);
});
