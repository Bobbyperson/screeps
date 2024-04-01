const roleCentralizer = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.transfer && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.transfer = false;
        }
        if (!creep.memory.transfer && creep.store.getFreeCapacity() === 0) {
            creep.memory.transfer = true;
        }
        
        if (creep.renew()) {
            return;
        }

        if (!creep.memory.transfer) {
            creep.withdrawFromMany([STRUCTURE_CONTAINER]);
            creep.giveWay();
        } else {
            creep.depositToMany([STRUCTURE_STORAGE]);
            creep.giveWay();
        }
    }
};

module.exports = roleCentralizer;
