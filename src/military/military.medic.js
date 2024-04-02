const militaryMedic = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.squadID === undefined) {
            console.log("Warning! Medic without squadID!");
            return;
        }
        var next_move = creep.memory.squads[creep.memory.squadID].next_move;
        if (next_move === undefined) {
            console.log("Warning! Medic without next_move!");
        }
        if (Game.creeps[creep.memory.squads[creep.memory.squadID].leader] === undefined) {
            // retreat
            creep.travelTo(Game.spawns['Spawn1']);
        } else {
            var leader = Game.creeps[creep.memory.squads[creep.memory.squadID].leader];
            if (!creep.pos.isNearTo(leader)) {
                creep.travelTo(leader);
            } else {
                creep.move(next_move);
                creep.heal(leader);
            }
        }
        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
    }
};

module.exports = militaryMedic;