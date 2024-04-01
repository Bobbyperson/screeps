const roleScout = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (!creep.memory.desiredRoom) {
            creep.memory.desiredRoom = creep.room.name
            creep.notifyWhenAttacked(false);
        }

        const phrases = ["Friendly!", "Scouting!", "No harm!", "Unarmed!", "Peaceful!", "Exploring!", "No threat!", creep.memory.desiredRoom];

        creep.say(phrases[Math.floor(Math.random() * phrases.length)], true);

        if (!Memory.rooms) {
            Memory.rooms = {}; // Ensure the Memory.rooms object exists
        }

        if (!Memory.rooms[creep.room.name]) {
            Memory.rooms[creep.room.name] = {}; // Initialize the room object if it doesn't exist
        }

        if (creep.memory.desiredRoom === creep.room.name) {
            Memory.rooms[creep.room.name].scouted = true;
            Memory.rooms[creep.room.name].hostile = creep.room.find(FIND_HOSTILE_STRUCTURES).length > 0 || creep.room.find(FIND_HOSTILE_CREEPS).length > 0;
            Memory.rooms[creep.room.name].friendly = creep.room.controller && (creep.room.controller.my || (creep.room.controller.reservation && creep.room.controller.reservation.username === "Bobbyperson"));

            // add each source id to memory
            Memory.rooms[creep.room.name].sources = creep.room.find(FIND_SOURCES).map(source => source.id);

            // pick random room and go
            const exits = Game.map.describeExits(creep.room.name);

            // make sure room is same status as current room
            for (const exit in exits) {
                if (Game.map.getRoomStatus(exits[exit]).status !== Game.map.getRoomStatus(creep.room.name).status) {
                    delete exits[exit];
                }
            }

            const targetRoom = exits[Object.keys(exits)[Math.floor(Math.random() * Object.keys(exits).length)]];
            creep.memory.desiredRoom = targetRoom;
        } else {
                if (creep.room.controller && creep.room.controller.sign && !creep.room.controller.my && !Memory.rooms[creep.room.name].hostile) {
                    if (creep.signController(creep.room.controller, "") === ERR_NOT_IN_RANGE) {
                        creep.travelTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' }, reusePath: 50 });
                    } // anti-propaganda
                } else {
                    creep.travelTo(new RoomPosition(25, 25, creep.memory.desiredRoom), { visualizePathStyle: { stroke: '#ffaa00' }, reusePath: 50, ignoreRoads: true, ignoreSwamps: true });
                }
        }
    }
};

module.exports = roleScout;
