const roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say('🔄 gather');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            // const ramparts = creep.room.find(FIND_STRUCTURES, {
            //     filter: (s) => s.hits < 1000 && s.structureType === STRUCTURE_RAMPART
            // });
            // if (ramparts.length){
            //     if (creep.repair(ramparts[0]) === ERR_NOT_IN_RANGE){
            //         creep.travelTo(ramparts[0]);
            //     }
            // } else {
                const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (target !== null) {
                    if ((creep.build(target) === ERR_NOT_IN_RANGE)) {
                        creep.travelTo(target, {visualizePathStyle: {stroke: '#ffffff'}, reusePath: 20});
                        creep.memory.using = target.id;
                    } else {
                        creep.giveWay({pos: target.pos, range: 3 });
                    }
                } else {
                    const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.hits < s.hitsMax && s.structureType !== STRUCTURE_WALL && s.hits <= 250000
                    });
                    if (structure) {
                        if (creep.repair(structure) === ERR_NOT_IN_RANGE) {
                            creep.travelTo(structure, {reusePath: 20});
                        } else {
                            creep.giveWay({pos: structure.pos, range: 3 });
                        }
                    } else {
                        creep.giveWay();
                    }
                // }
            }
        } else {
            var source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (i) => (i.structureType === STRUCTURE_STORAGE || i.structureType === STRUCTURE_CONTAINER) &&
                    i.store[RESOURCE_ENERGY] > 0
            });
            if (!source) {
                source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (i) => (i.structureType === STRUCTURE_SPAWN) &&
                        i.store[RESOURCE_ENERGY] > 0
                });
            }
            if ((creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE)) {
                creep.travelTo(source, {reusePath: 10});
            }
        }
    }
};

module.exports = roleBuilder;