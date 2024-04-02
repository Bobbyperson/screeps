const roleTruck = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.depositing === undefined) {
            creep.memory.depositing = false;
            creep.memory.centralizer = false;
        }

        if (creep.memory.depositing && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.depositing = false;
        }

        if (!creep.memory.depositing && creep.store.getFreeCapacity() === 0) {
            creep.memory.depositing = true;
        }

        if (creep.renew()) {
            return;
        }

        if (!creep.memory.depositing) {
            var source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: (resource) => resource.resourceType === RESOURCE_ENERGY && resource.amount >= creep.store.getFreeCapacity()});
            if (source) {
                creep.memory.centralizer = false;
                if (creep.pickup(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(source, {reusePath: 25});
                }
            } else if (!source) {
                source = creep.pos.findClosestByPath(FIND_RUINS, {filter: (ruin) => ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0});
            } else if (!source) {
                source = creep.pos.findClosestByPath(FIND_TOMBSTONES, {filter: (tombstone) => tombstone.store.getUsedCapacity(RESOURCE_ENERGY) > 0});
            }
            if (source) {
                creep.memory.centralizer = false;
                if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(source, {reusePath: 25});
                }
            } else {
                source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: (resource) => resource.resourceType === RESOURCE_ENERGY});
                if (source) {
                    creep.memory.centralizer = false;
                    if (creep.pickup(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.travelTo(source, {reusePath: 25});
                    }
                } else {
                    creep.memory.centralizer = true;
                }
            }
            if (creep.memory.centralizer) {
                creep.withdrawFromFullest([STRUCTURE_CONTAINER]);
            }
        } else {
            if (!creep.memory.centralizer) {
                creep.depositToMany([STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_SPAWN, STRUCTURE_EXTENSION]);
            } else {
                creep.depositToMany([STRUCTURE_STORAGE, STRUCTURE_SPAWN, STRUCTURE_EXTENSION]);
            }
        }
    }
};

module.exports = roleTruck;