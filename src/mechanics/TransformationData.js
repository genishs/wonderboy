/**
 * Wonder Boy (1986) - Transformation System
 * 7 animal forms with unique abilities
 */

export const TRANSFORMATION_FORMS = {
    lion: {
        id: 'lion',
        name: 'Lion',
        color: '#DAA520',
        abilities: ['charge', 'ground_slam', 'roar'],
        speedMultiplier: 1.2,
        jumpMultiplier: 1.1,
        attackRange: 2,
        description: 'Strong ground attacks, faster movement'
    },
    eagle: {
        id: 'eagle',
        name: 'Eagle',
        color: '#8B4513',
        abilities: ['fly', 'dive', 'talons'],
        speedMultiplier: 1.0,
        jumpMultiplier: 1.3,
        canFly: true,
        flightDuration: 180, // frames
        description: 'Can fly short distances, higher jumps'
    },
    seal: {
        id: 'seal',
        name: 'Seal',
        color: '#708090',
        abilities: ['slide', 'roll', 'water_speed'],
        speedMultiplier: 1.5,
        jumpMultiplier: 0.7,
        slideDuration: 120,
        description: 'Fast sliding on ground and water'
    },
    pig: {
        id: 'pig',
        name: 'Pig',
        color: '#FFC0CB',
        abilities: ['snout', 'dirt_spray', 'ground_bash'],
        speedMultiplier: 0.9,
        jumpMultiplier: 0.9,
        attackRange: 1.5,
        description: 'Slower but can break certain obstacles'
    },
    hawk: {
        id: 'hawk',
        name: 'Hawk',
        color: '#00BFFF',
        abilities: ['soar', 'peck', 'sky_attack'],
        speedMultiplier: 1.1,
        jumpMultiplier: 1.2,
        canFly: true,
        flightDuration: 150,
        description: 'Soar over obstacles, quick attacks'
    },
    whale: {
        id: 'whale',
        name: 'Whale',
        color: '#4682B4',
        abilities: ['water_jump', 'tail_slap', 'bubble_blow'],
        speedMultiplier: 1.3,
        jumpMultiplier: 1.4,
        description: 'Super high jumps, water-based attacks'
    },
    dragon: {
        id: 'dragon',
        name: 'Dragon',
        color: '#DC143C',
        abilities: ['fire_breath', 'fly', 'tail_sweep', 'earthquake'],
        speedMultiplier: 1.3,
        jumpMultiplier: 1.5,
        canFly: true,
        flightDuration: 240,
        attackRange: 3,
        description: 'Ultimate form - fire breath and flight'
    }
};

// Transformation requirements
export const TRANSFORMATION_REQUIREMENTS = {
    lion:   { level: 1, area: 1, required_powerups: ['Hammer'] },
    eagle:  { level: 2, area: 2, required_powerups: ['Fairy'] },
    seal:   { level: 3, area: 3, required_powerups: ['Mushroom'] },
    pig:    { level: 4, area: 5, required_powerups: ['Milk'] },
    hawk:   { level: 5, area: 7, required_powerups: ['Skateboard'] },
    whale:  { level: 6, area: 9, required_powerups: ['Fruit'] },
    dragon: { level: 7, area: 10, required_powerups: ['Dragon Scale'] }
};

// Form-specific enemy weaknesses
export const FORM_WEAKNESSES = {
    lion:   ['slime', 'bat', 'scorpion', 'skeleton'],
    eagle:  ['bat', 'bird', 'ghost'],
    seal:   ['fish', 'piranha', 'slime'],
    pig:    ['skeleton', 'mummy', 'demon'],
    hawk:   ['bat', 'bird', 'scorpion'],
    whale:  ['fish', 'piranha', 'ghost'],
    dragon: ['demon', 'robot', 'skeleton', 'mummy']
};

// Transformation animation frames per form
export const TRANSFORMATION_ANIMATIONS = {
    lion:   { run: 8, jump: 4, attack: 6, transform: 30 },
    eagle:  { run: 6, jump: 8, attack: 5, transform: 30, fly: 12 },
    seal:   { run: 4, jump: 3, attack: 4, transform: 30, slide: 10 },
    pig:    { run: 6, jump: 5, attack: 5, transform: 30 },
    hawk:   { run: 6, jump: 6, attack: 4, transform: 30, fly: 10 },
    whale:  { run: 8, jump: 10, attack: 6, transform: 30 },
    dragon: { run: 10, jump: 8, attack: 8, transform: 30, fly: 15 }
};

// Power-up durations (in seconds)
export const POWERUP_DURATIONS = {
    hammer:     30,
    skateboard: 45,
    fairy:      10,
    mushroom:   30,
    milk:       1, // instant restore
    fruit:      1  // instant restore
};

// Form change sequence (must be collected in order)
export const TRANSFORMATION_SEQUENCE = ['lion', 'eagle', 'seal', 'pig', 'hawk', 'whale', 'dragon'];
