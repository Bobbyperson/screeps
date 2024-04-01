const roleDefenderHealer = {
    run: function(creep) {

        // retreat if low health
        if (creep.hits < creep.hitsMax * 0.5) {
            creep.heal(creep);
        } else {
            const target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (creep) => creep.hits < creep.hitsMax
            });
            if(target) {
                if(creep.heal(target) === ERR_NOT_IN_RANGE) {
                    creep.travelTo(target);
                }
            } else {
                var goingHome = true;
                if (creep.room.memory.sos) {
                    delete creep.room.memory.sos;
                }

                for (const room in Memory.rooms) {
                    if (Memory.rooms[room].sos) {
                        creep.travelTo(new RoomPosition(25, 25, room));
                        goingHome = false;
                        break;
                    }
                }

                if (creep.room.name === creep.memory.home) {
                    goingHome = false;
                }

                if (goingHome) {
                    creep.travelTo(Game.spawns['Spawn1']);
                }
            }
            creep.giveWay();
        }
    }
}

module.exports = roleDefenderHealer;