const roleDefender = {
    run: function(creep) {

        if (!creep.memory.home) {
            creep.memory.home = creep.room.name;
        }

        // retreat if low health
        if (creep.hits < creep.hitsMax * 0.5 || creep.retreating) {
            creep.retreating = true;
            creep.travelTo(Game.spawns['Spawn1']);
            creep.giveWay();
            if (creep.hits === creep.hitsMax) {
                creep.retreating = false;
            }
        } else {
            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target) {
                if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(target);
                } else {
                    creep.giveWay({pos: target.pos, range: 3});
                }
            } else {
                var goingHome = true;
                if (creep.room.memory.sos) {
                    delete creep.room.memory.sos;
                }

                if (creep.room.name === creep.memory.home) {
                    if (creep.pos.x < 5 || creep.pos.x > 44 || creep.pos.y < 5 || creep.pos.y > 44) {
                        creep.travelTo(Game.spawns['Spawn1']);
                    } else {
                        goingHome = false;
                    }
                }

                for (const room in Memory.rooms) {
                    if (Memory.rooms[room].sos) {
                        creep.travelTo(new RoomPosition(25, 25, room));
                        goingHome = false;
                        break;
                    }
                }

                if (goingHome) {
                    creep.travelTo(Game.spawns['Spawn1']);
                }
                creep.giveWay();
            }
        }
    }
}

module.exports = roleDefender;