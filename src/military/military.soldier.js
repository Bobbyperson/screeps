const militarySoldier = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.squadID === undefined) {
            console.log("Warning! Soldier without squadID!");
            return;
        }
        if (Memory.squads[creep.memory.squadID].targetRoom !== creep.room.name) {
            creep.travelTo(new RoomPosition(25, 25, Memory.squads[creep.memory.squadID].targetRoom));
            Memory.squads[creep.memory.squadID].next_move = creep.pos.getDirectionTo(new RoomPosition(25, 25, Memory.squads[creep.memory.squadID].targetRoom));
            return;
        } else {
            var targetSpawner = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
            var creepsInRange = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);

            if (targetSpawner) {
                var path = PathFinder.search(creep.pos, { pos: targetSpawner.pos, range: 1 }, {
                    roomCallback: function (roomName) {
                        let room = Game.rooms[roomName];
                        if (!room) return false;
                        let costs = new PathFinder.CostMatrix;

                        room.find(FIND_STRUCTURES).forEach(function (struct) {
                            if (struct.structureType === STRUCTURE_WALL || struct.structureType === STRUCTURE_RAMPART) {
                                // Calculate cost based on health, with a max cost of 255 and a min cost reflecting the health proportionally
                                let cost = Math.max(1, Math.min(255, Math.floor(255 * (struct.hits / struct.hitsMax))));
                                costs.set(struct.pos.x, struct.pos.y, cost);
                            }
                        });

                        return costs;
                    },
                });

                // Follow the path
                if (path.path.length > 0) {
                    creep.moveByPath(path.path);
                }

                // Dismantle or attack logic on the next tick could be added here if necessary
                // Check the next position in the path for a structure to dismantle
                if (path.path.length > 1) {
                    let nextPos = path.path[1]; // The immediate next position might be the current position of the creep
                    let structures = nextPos.lookFor(LOOK_STRUCTURES).filter(s => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART);

                    if (structures.length > 0) {
                        if (creep.dismantle(structures[0]) == ERR_NOT_IN_RANGE) {
                            // If not in range to dismantle, the creep should move closer
                            creep.moveTo(structures[0]);
                        }
                    }
                }
            }
        }
    }
};

module.exports = militarySoldier;