class SpawnerExtension {
    /**
     * get energy from storage
     * @param spawn
     * @returns int
     */
    static canSpawn(spawn, body) {
        if (spawn.spawning) return ERR_BUSY;
        if (!Game.spawns['Spawn1'].spawnCreep(body, 'Worker1', { dryRun: true }))  {
            return ERR_NOT_ENOUGH_ENERGY;
        }
        return OK;
    }
    static maxEnergy(spawn) {
        return spawn.room.energyCapacityAvailable;
    }
    static energy(spawn) {
        return spawn.room.energyAvailable;
    }
}

exports.SpawnerExtension = SpawnerExtension;
StructureSpawn.prototype.canSpawn = function () {
    return StructureSpawn.canSpawn(this, body);
};