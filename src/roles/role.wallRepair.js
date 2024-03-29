const roleWallRepair = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.repairing && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.repairing = false;
            creep.memory.repairTarget = null;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.repairing && creep.store.getFreeCapacity() === 0) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }

        // if low on health, go to spawn
        if (creep.hits < creep.hitsMax) {
            const spawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (s) => s.structureType === STRUCTURE_SPAWN
            });
            if (spawn) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(spawn);
                }
            }
        } else {

            if (creep.memory.repairing) {
                const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.hits <= 220000 && (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART)
                });
                if (structure) {
                    if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                        creep.travelTo(structure);
                    } else {
                        creep.giveWay({pos: structure.pos, range: 3});
                    }
                } else {
                    var structures;
                    if (!creep.memory.repairTarget) {
                        structures = creep.room.find(FIND_STRUCTURES, {
                            filter: (s) => s.hits < s.hitsMax && (s.structureType === STRUCTURE_WALL || s.structureType === STRUCTURE_RAMPART)
                        });
                        structures.sort((a, b) => a.hits - b.hits);
                        if (structures.length > 0) {
                            creep.memory.repairTarget = structures[0].id;
                        }
                    } else {
                        structures = [Game.getObjectById(creep.memory.repairTarget)];
                    }


                    if (structures.length > 0) {
                        if (creep.repair(structures[0]) === ERR_NOT_IN_RANGE) {
                            creep.travelTo(structures[0], {range: 3, reusePath: 20});
                        } else {
                            creep.giveWay({pos: structures[0].pos, range: 3});
                        }
                    }
                }
            } else {
                creep.withdrawFromMany([STRUCTURE_CONTAINER, STRUCTURE_STORAGE]);
            }
        }
    }
};

module.exports = roleWallRepair;