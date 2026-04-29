let _nextId = 1;

/**
 * Minimal Entity–Component–System framework.
 *
 * Entity  : integer ID
 * Component: plain-object data stored by name
 * System  : external logic that calls ecs.query(…) each frame
 */
export class ECS {
    constructor() {
        this.entities   = new Map(); // id → Set<compName>
        this.components = new Map(); // compName → Map<id, data>
    }

    createEntity() {
        const id = _nextId++;
        this.entities.set(id, new Set());
        return id;
    }

    destroyEntity(id) {
        const names = this.entities.get(id);
        if (!names) return;
        for (const n of names) this.components.get(n)?.delete(id);
        this.entities.delete(id);
    }

    addComponent(entityId, name, data) {
        if (!this.components.has(name)) this.components.set(name, new Map());
        this.components.get(name).set(entityId, data);
        this.entities.get(entityId)?.add(name);
        return data;
    }

    getComponent(entityId, name) {
        return this.components.get(name)?.get(entityId);
    }

    removeComponent(entityId, name) {
        this.components.get(name)?.delete(entityId);
        this.entities.get(entityId)?.delete(name);
    }

    hasComponent(entityId, name) {
        return this.entities.get(entityId)?.has(name) ?? false;
    }

    /** Returns array of { id, compA, compB, … } for all entities with every listed component. */
    query(...names) {
        const result = [];
        for (const [id, owned] of this.entities) {
            if (!names.every(n => owned.has(n))) continue;
            const row = { id };
            for (const n of names) row[n] = this.components.get(n).get(id);
            result.push(row);
        }
        return result;
    }
}
