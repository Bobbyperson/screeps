const roleRepair = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.using === undefined) {
            creep.memory.using = null;
        }

        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.repairing = false;
            creep.memory.using = null;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() === 0) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }

        if (creep.memory.repairing) {
            let structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL && s.structureType !== STRUCTURE_RAMPART && s.hits <= 250000
            });
            const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_CONTAINER && s.hits <= 50000
            });
            //const rempart = creep.pos.findClosestByPath(FIND_STRUCTURES, )
            if (container !== null) {
                structure = container;
            }
            if (structure !== undefined) {
                repair = creep.repair(structure);
                if (repair === ERR_NOT_IN_RANGE) {
                    creep.travelTo(structure);
                }
            }
        } else {
            const source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (i) => (i.structureType === STRUCTURE_STORAGE || i.structureType === STRUCTURE_CONTAINER || i.structureType == STRUCTURE_SPAWN) &&
                    i.store[RESOURCE_ENERGY] > 0
            });
            if ((creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)) {
                creep.travelTo(source);
            }
        }
    }
};

module.exports = roleRepair;