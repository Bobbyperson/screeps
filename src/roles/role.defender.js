const roleDefender = {
    run: function(creep) {

        // retreat if low health
        if (creep.hits < creep.hitsMax * 0.5) {
            creep.travelTo(Game.spawns['Spawn1']);
            creep.giveWay();
        } else {
            const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target) {
                if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(target);
                } else {
                    creep.giveWay({pos: target.pos, range: 3});
                }
            } else {
                creep.giveWay();
            }
        }
    }
}

module.exports = roleDefender;