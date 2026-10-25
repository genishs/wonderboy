/**
 * Wonder Boy (1986) - Area Progression Data
 * 10 Areas × 4 Rounds = 40 total rounds
 * Boss fights at rounds: 4, 8, 12, 16, 20, 24, 28, 32, 36, 40
 */

export const WONDER_BOY_AREAS = {
    // Area 1: Village Outskirts (Forest theme)
    1: {
        name: 'Area 1: Village Outskirts',
        theme: 'forest',
        bgColor: '#5C94FC',
        music: 'area1',
        boss: 'Stone Golem',
        rounds: 4,
        stages: [
            { id: '1-1', cols: 64, rows: 12, type: 'platforming' },
            { id: '1-2', cols: 64, rows: 12, type: 'platforming' },
            { id: '1-3', cols: 64, rows: 12, type: 'platforming' },
            { id: '1-4', cols: 80, rows: 12, type: 'boss' }
        ]
    },
    // Area 2: Deep Cave (Cavern theme)
    2: {
        name: 'Area 2: Deep Cave',
        theme: 'cave',
        bgColor: '#1A1A2E',
        music: 'area2',
        boss: 'Cave Titan',
        rounds: 4,
        stages: [
            { id: '2-1', cols: 64, rows: 12, type: 'platforming' },
            { id: '2-2', cols: 64, rows: 12, type: 'platforming' },
            { id: '2-3', cols: 64, rows: 12, type: 'platforming' },
            { id: '2-4', cols: 80, rows: 12, type: 'boss' }
        ]
    },
    // Area 3: River Delta (Water theme)
    3: {
        name: 'Area 3: River Delta',
        theme: 'water',
        bgColor: '#4DA6FF',
        music: 'area3',
        boss: 'River Serpent',
        rounds: 4,
        stages: [
            { id: '3-1', cols: 64, rows: 12, type: 'platforming' },
            { id: '3-2', cols: 64, rows: 12, type: 'platforming' },
            { id: '3-3', cols: 64, rows: 12, type: 'platforming' },
            { id: '3-4', cols: 80, rows: 12, type: 'boss' }
        ]
    },
    // Area 4: Castle Entrance (Boss area)
    4: {
        name: 'Area 4: Castle Entrance',
        theme: 'castle',
        bgColor: '#2A2A4E',
        music: 'area4',
        boss: 'Stone Golem',
        rounds: 4,
        stages: [
            { id: '4-1', cols: 64, rows: 12, type: 'platforming' },
            { id: '4-2', cols: 64, rows: 12, type: 'platforming' },
            { id: '4-3', cols: 64, rows: 12, type: 'platforming' },
            { id: '4-4', cols: 80, rows: 12, type: 'boss' }
        ]
    },
    // Areas 5-10 will be added later
    5: { name: 'Area 5: Desert Ruins', theme: 'desert', bgColor: '#E8A87C', music: 'area5', boss: 'Sand Worm', rounds: 4, stages: [] },
    6: { name: 'Area 6: Frozen Mountains', theme: 'frozen', bgColor: '#A8D0E6', music: 'area6', boss: 'Ice Giant', rounds: 4, stages: [] },
    7: { name: 'Area 7: Sky Islands', theme: 'sky', bgColor: '#F0F8FF', music: 'area7', boss: 'Sky Dragon', rounds: 4, stages: [] },
    8: { name: 'Area 8: Volcano', theme: 'volcano', bgColor: '#3D0000', music: 'area8', boss: 'Fire Giant', rounds: 4, stages: [] },
    9: { name: 'Area 9: Magical Forest', theme: 'magical', bgColor: '#9370DB', music: 'area9', boss: 'Magical Beast', rounds: 4, stages: [] },
    10: { name: 'Area 10: King\'s Castle', theme: 'kingcastle', bgColor: '#4B0000', music: 'area10', boss: 'King', rounds: 4, stages: [] }
};

// Transformation items available in each area (rounds 1-3)
export const TRANSFORMATION_ITEMS = {
    lion:    { area: 1, name: 'Lion Mask', form: 'Lion' },
    eagle:   { area: 2, name: 'Eagle Feather', form: 'Eagle' },
    seal:    { area: 3, name: 'Seal Scale', form: 'Seal' },
    pig:     { area: 5, name: 'Pig Tusk', form: 'Pig' },
    hawk:    { area: 7, name: 'Hawk Talon', form: 'Hawk' },
    whale:   { area: 9, name: 'Whale Pearl', form: 'Whale' },
    dragon:  { area: 10, name: 'Dragon Scale', form: 'Dragon' }
};

// Original Wonder Boy enemy list
export const ORIGINAL_ENEMIES = {
    'Red Slime':     { type: 'red_slime', hp: 1, speed: 1.5, color: '#FF0000' },
    'Blue Slime':    { type: 'blue_slime', hp: 1, speed: 1.5, color: '#0000FF' },
    'Bat':           { type: 'bat', hp: 1, speed: 2.5, color: '#4B0082' },
    'Scorpion':      { type: 'scorpion', hp: 2, speed: 2.0, color: '#8B0000' },
    'Skeleton':      { type: 'skeleton', hp: 2, speed: 1.8, color: '#F0E68C' },
    'Ghost':         { type: 'ghost', hp: 2, speed: 2.0, color: '#FFFFFF' },
    'Fish':          { type: 'fish', hp: 1, speed: 3.0, color: '#FF6347' },
    'Bird':          { type: 'bird', hp: 1, speed: 3.5, color: '#00CED1' },
    'Piranha':       { type: 'piranha', hp: 2, speed: 4.0, color: '#DC143C' },
    'Mummy':         { type: 'mummy', hp: 3, speed: 1.2, color: '#D2B48C' },
    'Demon':         { type: 'demon', hp: 3, speed: 2.5, color: '#800080' },
    'Robot':         { type: 'robot', hp: 4, speed: 2.0, color: '#708090' }
};

// Original power-ups
export const ORIGINAL_POWERUPS = {
    Hammer:     { type: 'hammer', duration: 30, power: 3, color: '#C0C0C0' },
    Skateboard: { type: 'skateboard', duration: 45, power: 0, color: '#FFD700' },
    Fairy:      { type: 'fairy', duration: 10, power: 0, color: '#FF69B4' },
    Mushroom:   { type: 'mushroom', duration: 30, power: 0, color: '#FF4500' },
    Milk:       { type: 'milk', restore: 25, points: 100, color: '#FFFFFF' },
    Fruit:      { type: 'fruit', restore: 10, points: 100, color: '#FF0000' }
};

// Area-specific configurations
export const AREA_THEMES = {
    forest: {
        groundColor: '#228B22',
        platformColor: '#8B4513',
        decoration: ['tree', 'rock', 'bush'],
        waterColor: '#1E90FF'
    },
    cave: {
        groundColor: '#696969',
        platformColor: '#4A4A4A',
        decoration: ['stalactite', 'stalagmite', 'mushroom'],
        waterColor: '#4682B4'
    },
    water: {
        groundColor: '#DEB887',
        platformColor: '#8B4513',
        decoration: ['reed', 'log', 'waterfall'],
        waterColor: '#87CEEB'
    },
    castle: {
        groundColor: '#778899',
        platformColor: '#696969',
        decoration: ['tower', 'arch', 'flag'],
        waterColor: '#000080'
    },
    desert: {
        groundColor: '#D2691E',
        platformColor: '#CD853F',
        decoration: ['cactus', 'ruins', 'pyramid'],
        waterColor: '#0000FF'
    },
    frozen: {
        groundColor: '#F0F8FF',
        platformColor: '#E0FFFF',
        decoration: ['ice', 'snowdrift', 'icicle'],
        waterColor: '#E0FFFF'
    },
    sky: {
        groundColor: '#FFFACD',
        platformColor: '#FAF0E6',
        decoration: ['cloud', 'floating_rock', 'feather'],
        waterColor: '#ADD8E6'
    },
    volcano: {
        groundColor: '#3D0000',
        platformColor: '#600000',
        decoration: ['lava', 'rock', 'steam'],
        waterColor: '#FF4500'
    },
    magical: {
        groundColor: '#4B0082',
        platformColor: '#8A2BE2',
        decoration: ['giant_mushroom', 'glow_plant', 'fairy_light'],
        waterColor: '#00CED1'
    },
    kingcastle: {
        groundColor: '#2A0000',
        platformColor: '#4A0000',
        decoration: ['throne', 'torch', 'armor'],
        waterColor: '#8B0000'
    }
};
