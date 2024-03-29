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
            }
        }
    }
}

module.exports = roleDefenderHealer;