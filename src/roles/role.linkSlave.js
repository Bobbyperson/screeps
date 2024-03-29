const roleLinkSlave = {

    /** @param {Creep} creep **/
    run: function (creep) {
        const link = creep.room.storage.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {return (structure.structureType === STRUCTURE_LINK)}});
        const storage = creep.room.storage;
        if (link.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && creep.store[RESOURCE_ENERGY] === 0){
            if (creep.withdraw(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                creep.travelTo(link);
            }
        } else{
            if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                creep.travelTo(storage);
            }
        }
    }
};

module.exports = roleLinkSlave;