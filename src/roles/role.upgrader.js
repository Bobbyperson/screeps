const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
            creep.memory.upgrading = true;
        }

        if (!creep.memory.upgrading) {
            creep.withdrawFromAny();
        } else {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE){
                creep.travelTo(creep.room.controller);
            } else {
                creep.giveWay({pos: creep.room.controller.pos, range: 3 });
            }
        }
    }
};
module.exports = roleUpgrader;