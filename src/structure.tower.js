const structureTower = {
    /** @param {structureTower} tower **/
    run: function (tower) {
        if (tower.structureType !== STRUCTURE_TOWER){
            console.log("WARNING!!!! NON-TOWER STRUCTURE IS BEING LOOPED THROUGH structure.tower");
        }
        const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (tower.store[RESOURCE_ENERGY] > tower.store.getCapacity(RESOURCE_ENERGY)/2){
            const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL && ( structure.hits < 250000 )
            });
            if(closestDamagedStructure && closestHostile === null) {
                tower.repair(closestDamagedStructure);
            }
        }

        
        if (closestHostile) {
            tower.attack(closestHostile);
        } else {
            const closestDamagedScreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (creep) => creep.hits < creep.hitsMax
            });
            if (closestDamagedScreep) {
                tower.heal(closestDamagedScreep);
            }
        }
    }
}

module.exports = structureTower;