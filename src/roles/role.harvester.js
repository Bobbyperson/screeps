const roleHarvester = {
    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.using === undefined) {
            const sources = creep.room.find(FIND_SOURCES);
            for (let i = 0; i < sources.length; i++) {
                const creepsUsing = _.filter(Game.creeps, (creep) => creep.memory.using === sources[i].id);
                const freeSpaces = calculateFreeSpaces(sources[i]);
                if (creepsUsing.length < freeSpaces) {
                    creep.memory.using = sources[i].id;
                    break;
                }
            }
        }

        const source = Game.getObjectById(creep.memory.using);
        if (source && (creep.store.getFreeCapacity() > 0 || creep.store.getCapacity() === null)) {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.travelTo(source);
            }
        } else {
            const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (structure.structureType === STRUCTURE_CONTAINER ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_STORAGE) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    );
                },
            });
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(target);
                }
            }
        }
    }
};

module.exports = roleHarvester;
