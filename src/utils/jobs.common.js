class JobsCommon {
    /**
     * get energy from storage
     * @param creep
     * @returns void
     */
    static withdrawFromStorage(creep) {
        if (creep.withdraw(creep.room.storage) === ERR_NOT_IN_RANGE) {
            creep.travelTo(creep.room.storage, { reusePath: 10 });
        }
    }

    /**
     * get energy from any
     * @param creep
     * @returns boolean
     */
    static withdrawFromAny(creep) {
        var storage;
        if (!creep.memory.destination) {
            storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => (s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_CONTAINER) && s.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getCapacity()
            });;
            if (!storage) {
                storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType === STRUCTURE_SPAWN) && s.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getCapacity()
                });
            }
            if (!storage) return false;
            creep.memory.destination = storage.id;
        }
        const destination = Game.getObjectById(creep.memory.destination);
        if (creep.withdraw(destination, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.travelTo(destination, { reusePath: 10 });
        } else {
            delete creep.memory.destination;
        }
        return true;
    }

    /**
     * deposit to storage
     * @param creep
     * @returns void
     */
    static depositToStorage(creep) {
        const storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => (s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_SPAWN) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (creep.transfer(storage) === ERR_NOT_IN_RANGE) {
            creep.travelTo(storage, { reusePath: 10 });
        }
    }

    /**
     * deposit to spawn
     * @param creep
     * @returns void
     */
    static depositToSpawner(creep) {
        const spawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => (s.structureType === STRUCTURE_EXTENSION || s.structureType === STRUCTURE_SPAWN) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        })
        if (creep.transfer(spawn) === ERR_NOT_IN_RANGE) {
            creep.travelTo(spawn, { reusePath: 10 });
        }
    }

    /**
     * deposit to any
     * @param creep
     * @returns void
     */
    static depositToAny(creep) {
        const storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => (s.structureType === STRUCTURE_STORAGE || s.structureType === STRUCTURE_CONTAINER || s.structureType === STRUCTURE_SPAWN || s.structureType === STRUCTURE_TOWER) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.travelTo(storage, { reusePath: 10 });
        }
    }

    /**
     * deposit to any
     * @param creep
     * @returns boolean
     */
    static withdrawFromMany(creep, types) {
        var storage;
        if (!creep.memory.destination) {
            storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => types.includes(s.structureType) && s.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getCapacity()
            });
            if (!storage) return false;
            creep.memory.destination = storage.id;
        }
        const destination = Game.getObjectById(creep.memory.destination);
        if (creep.withdraw(destination, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE && destination.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getCapacity()) {
            creep.travelTo(destination, { reusePath: 10 });
        } else {
            delete creep.memory.destination;
        }
        return true;
    }

    /**
     * deposit to any
     * @param creep
     * @returns boolean
     */
    static depositToMany(creep, types) {
        var storage;
        if (!creep.memory.destination) {
            storage = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => types.includes(s.structureType) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            if (!storage) return false;
            creep.memory.destination = storage.id;
        }
        const destination = Game.getObjectById(creep.memory.destination);
        if (creep.transfer(destination, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.travelTo(destination, { reusePath: 10 });
        } else {
            delete creep.memory.destination;
        }
        return true;
    }

    /**
     * go to spawner and renew if needed
     * @param creep
     * @returns boolean
     */
    static renew(creep) {
        if (creep.memory.renewing && creep.ticksToLive > 1400) {
            creep.memory.renewing = false;
        }
        if (creep.ticksToLive < 150 || creep.memory.renewing) {
            creep.say('renew');
            creep.memory.renewing = true;
            const spawns = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_SPAWN
            });

            if (spawns.length === 0) {
                return false;
            }
            const spawn = spawns[0];

            if (spawn.spawning) {
                return false;
            }

            if (spawn.renewCreep(creep) === ERR_NOT_IN_RANGE) {
                creep.travelTo(spawn, { reusePath: 10 });
            }
            return true;
        }
        return false;
    }
    
    /**
     * put sos in room memory for defender to come
     * @param creep
     * @returns boolean
     */
    static sos(creep) {
        if (creep.hits < creep.hitsMax) {
            creep.room.memory.sos = true;
            return true;
        }
        return false;
    }

}

exports.JobsCommon = JobsCommon;
Creep.prototype.withdrawFromAny = function () {
    return JobsCommon.withdrawFromAny(this);
};
Creep.prototype.withdrawFromStorage = function () {
    return JobsCommon.withdrawFromStorage(this);
};
Creep.prototype.depositToStorage = function () {
    return JobsCommon.depositToStorage(this);
};
Creep.prototype.depositToSpawner = function () {
    return JobsCommon.depositToSpawner(this);
};
Creep.prototype.depositToAny = function () {
    return JobsCommon.depositToAny(this);
};
Creep.prototype.withdrawFromMany = function (types) {
    return JobsCommon.withdrawFromMany(this, types);
};
Creep.prototype.depositToMany = function (types) {
    return JobsCommon.depositToMany(this, types);
};
Creep.prototype.renew = function () {
    return JobsCommon.renew(this);
};
Creep.prototype.sos = function () {
    return JobsCommon.sos(this);
}