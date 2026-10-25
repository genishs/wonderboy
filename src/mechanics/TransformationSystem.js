// 원작 Wonder Boy 변신 시스템 (7가지 동물 폼)
// owning agent: dev-lead

export const TRANSFORMATION_FORMS = {
    LION:   { id: 'lion',   name: '사자',  speed: 2.5,  jump: 11,  attack: 'melee',  description: '강력한 지상 공격' },
    EAGLE:  { id: 'eagle',  name: '독수리', speed: 2.8,  jump: 14,  attack: 'flight', description: '비행 능력' },
    SEAL:   { id: 'seal',   name: '물개',  speed: 2.2,  jump: 9,   attack: 'swim',   description: '우수한 수영' },
    PIG:    { id: 'pig',    name: '돼지',  speed: 2.0,  jump: 8,   attack: 'ram',    description: '지상 박치기 공격' },
    HAWK:   { id: 'hawk',   name: '매',    speed: 3.0,  jump: 13,  attack: 'fast',   description: '빠른 비행, 공중 공격' },
    WHALE:  { id: 'whale',  name: '고래',  speed: 1.8,  jump: 7,   attack: 'water',  description: '물 기반 공격' },
    DRAGON: { id: 'dragon', name: '용',    speed: 2.6,  jump: 12,  attack: 'fire',   description: '불 breath, 비행' }
};

export class TransformationSystem {
    constructor() {
        this.currentForm = 'HUMAN'; // 기본 폼
        this.transformationTimer = 0;
        this.forms = TRANSFORMATION_FORMS;
    }

    /**
     * 플레이어를 특정 폼으로 변신
     * @param {string} formId - 변신할 폼 ID (LION, EAGLE, SEAL 등)
     * @param {object} player - 플레이어 엔티티
     */
    transform(formId, player) {
        if (!this.forms[formId]) return false;

        this.currentForm = formId;
        this.transformationTimer = 1800; // 30초 (60fps 기준)

        // 폼에 따른 특성 적용
        const form = this.forms[formId];
        
        // 플레이어 속성 업데이트
        if (player.transform) {
            player.transform.speed = form.speed;
            player.transform.jumpPower = form.jump;
        }
        
        // 폼별 특수 능력 설정
        switch (formId) {
            case 'EAGLE':
            case 'HAWK':
            case 'DRAGON':
                player.canFly = true;
                player.flyDuration = 300; // 5초
                break;
            case 'SEAL':
            case 'WHALE':
                player.canSwim = true;
                player.swimSpeed = form.speed * 1.2;
                break;
            case 'PIG':
                player.canRam = true;
                player.ramDamage = 2;
                break;
            case 'DRAGON':
                player.canBurn = true;
                player.burnRange = 100;
                break;
        }

        return true;
    }

    /**
     * 변신 시간 업데이트
     * @param {number} dt - 경과 시간
     */
    update(dt) {
        if (this.transformationTimer > 0) {
            this.transformationTimer--;
        }
        
        // 시간 만료 시 기본 폼으로 복귀
        if (this.transformationTimer <= 0 && this.currentForm !== 'HUMAN') {
            this.revertToHuman();
        }
    }

    /**
     * 기본 폼(인간)으로 복귀
     */
    revertToHuman() {
        this.currentForm = 'HUMAN';
        this.transformationTimer = 0;
        
        // 모든 특수 능력 해제
        return {
            canFly: false,
            canSwim: false,
            canRam: false,
            canBurn: false
        };
    }
    
    /**
     * 랜덤 변신 폼 선택
     * @returns {string} 랜덤 폼 ID
     */
    getRandomForm() {
        const formIds = Object.keys(this.forms);
        const randomIndex = Math.floor(Math.random() * formIds.length);
        return formIds[randomIndex];
    }
    
    /**
     * 랜덤 폼으로 변신
     * @param {object} player - 플레이어 엔티티
     */
    transformRandomForm(player) {
        const randomForm = this.getRandomForm();
        this.transform(randomForm, player);
        return randomForm;
    }

    /**
     * 현재 폼 정보 반환
     */
    getCurrentForm() {
        return this.forms[this.currentForm] || this.forms['HUMAN'];
    }

    /**
     * 변신 아이템 획득
     * @param {string} itemId - 아이템 ID
     */
    collectTransformationItem(itemId) {
        const itemMap = {
            'lionMask':    'LION',
            'eagleFeather': 'EAGLE',
            'sealScale':   'SEAL',
            'pigTusk':     'PIG',
            'hawkTalon':   'HAWK',
            'whalePearl':  'WHALE',
            'dragonScale': 'DRAGON'
        };

        const formId = itemMap[itemId];
        if (formId) {
            return this.transform(formId);
        }
        return false;
    }

    /**
     * 변신 시간 퍼센트 반환 (0-100)
     */
    getTransformationTimePercent() {
        return (this.transformationTimer / 1800) * 100;
    }

    /**
     * 현재 변신 상태 확인
     */
    isTransformed() {
        return this.currentForm !== 'HUMAN';
    }
}
