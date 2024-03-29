const roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.transfer && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.transfer = false;
        }
        if (!creep.memory.transfer && creep.store.getFreeCapacity() === 0) {
            creep.memory.transfer = true;
        }

        if (!creep.memory.transfer) {
            creep.withdrawFromMany([STRUCTURE_CONTAINER, STRUCTURE_STORAGE]);
        } else {
            if (!creep.depositToMany([STRUCTURE_EXTENSION, STRUCTURE_SPAWN])) {
                creep.depositToMany([STRUCTURE_TOWER]);
            }
        }
    }
};

module.exports = roleHauler;
