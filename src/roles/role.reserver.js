const roleReserver = {
    run: function (creep) {
        if (creep.memory.initiated === undefined) {
            creep.memory.initiated = true;
            creep.memory.sourceRoom = null;
        }

        creep.sos();

        if (creep.room.name !== creep.memory.sourceRoom) {
            creep.travelTo(new RoomPosition(25, 25, creep.memory.sourceRoom), { visualizePathStyle: { stroke: '#ffaa00' }, reusePath: 50 });
        } else {
            if (creep.room.controller) {
                if (creep.reserveController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffaa00' }, reusePath: 50 });
                }
            }
        }
    }
}
module.exports = roleReserver;