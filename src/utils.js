// const StorageAnalyzer = require("./storageAnalyzer");
class utils {
    static transferEnergyToClosestLink(room) {
        const storage = room.storage;
        if (!storage) {
            console.log('No storage found in room', room.name);
            return;
        }

        const links = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_LINK }
        });

        if (links.length < 2) {
            console.log('Not enough links found in room', room.name);
            return;
        }

        const closestLinkToStorage = storage.pos.findClosestByRange(links);

        links.forEach(link => {
            if (link.id !== closestLinkToStorage.id && link.store[RESOURCE_ENERGY] > 0) {
                const transferAmount = Math.min(
                    link.store[RESOURCE_ENERGY],
                    closestLinkToStorage.store.getFreeCapacity(RESOURCE_ENERGY)
                );

                if (transferAmount > 0) {
                    link.transferEnergy(closestLinkToStorage, transferAmount);
                }
            }
        });
    }

}

/**
 * Calculates the number of free spaces around a given source where a creep can stand.
 * @param {Source} source - The source object to check around.
 * @returns {number} - The number of free spaces around the source.
 */
function calculateFreeSpaces(source) {
    const terrain = source.room.getTerrain();
    let freeSpaces = 0;

    // Check all adjacent positions
    for (let x = source.pos.x - 1; x <= source.pos.x + 1; x++) {
        for (let y = source.pos.y - 1; y <= source.pos.y + 1; y++) {
            // Ensure we're not looking outside the room bounds
            if (x >= 0 && x < 50 && y >= 0 && y < 50) {
                // PLAIN and SWAMP are considered free spaces, WALL is not
                if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
                    freeSpaces++;
                }
            }
        }
    }

    return freeSpaces;
}

/**
 * Calculate the cost of a body part array.
 */
function getBodyCost(body) {
    return body.reduce((cost, part) => cost + BODYPART_COST[part], 0);
  }

module.exports = { calculateFreeSpaces, getBodyCost };