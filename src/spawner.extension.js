class SpawnerExtension {
    /**
     * get energy from storage
     * @param spawn
     * @returns int
     */
    static canSpawn(spawn, body) {
        spawn.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType === STRUCTURE_EXTENSION && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        });
        // sum total energy in extensions
        let total = 0;
        extensions.forEach(extension => {
            total += extension.store.getFreeCapacity(RESOURCE_ENERGY);
        });
        if (total > this.bodyCost(body)) {
            return true;
        }
        return false;
    }

    static bodyCost(body) {
        let cost = 0;
        body.forEach(part => {
            cost += BODYPART_COST[part];
        });
        return cost;
    }
}

exports.SpawnerExtension = SpawnerExtension;
StructureSpawn.prototype.canSpawn = function () {
    return StructureSpawn.canSpawn(this, body);
};