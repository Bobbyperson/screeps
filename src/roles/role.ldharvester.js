const roleLDHarvester = {
    run(creep) {
        // Initialize creep memory for new creeps
        if (creep.memory.initiated === undefined) {
            creep.memory.initiated = true;
            creep.memory.working = false;
            creep.memory.assignedSource = null;
            creep.memory.sourceRoom = null;
        }

        // Switch states
        if (!creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.working = true;
        }
        if (creep.memory.working && creep.store.getFreeCapacity() === 0) {
            creep.memory.working = false;
        }

        // Harvesting mode
        if (creep.memory.working) {
            if (!creep.memory.sourceRoom) {
                // Only assign a new source if it's not already heading to an external source
                creep.say('source');
                this.assignSource(creep);
            } else {
                // Move to source and harvest
                creep.say('harvest');
                this.harvestEnergy(creep);
            }
        } else {
            // Returning mode, deposit energy
            creep.say('deposit');
            this.depositEnergy(creep);
        }
    },

    assignSource(creep) {
        if (!creep.memory.homeRoom) {
            creep.memory.homeRoom = creep.room.name;
        }

        // If already has a valid assigned source and is in the correct room, exit the function
        if (creep.memory.assignedSource && creep.memory.sourceRoom === creep.room.name) {
            const currentSource = Game.getObjectById(creep.memory.assignedSource);
            if (currentSource && currentSource.energy > 0) {
                return;
            }
        }

        const targetRoomName = creep.memory.sourceRoom || this.findTargetRoom(creep);
        creep.memory.sourceRoom = targetRoomName;
        if (creep.room.name !== creep.memory.homeRoom) {
            const sources = creep.room.find(FIND_SOURCES);
            for (const source of sources) {
                creep.memory.assignedSource = source.id;
                creep.memory.sourceRoom = creep.room.name;
                return;
            }
        } else if (creep.room.name !== targetRoomName) {
            creep.travelTo(new RoomPosition(25, 25, targetRoomName), { visualizePathStyle: { stroke: '#ffaa00' } });
        } else {
            creep.say('bruh');
        }
    },

    findTargetRoom(creep) {
        // Example logic to determine the target room
        // This should be replaced with your logic on how to select the target room for harvesting
        // e.g., based on hardcoded values, memory entries, or dynamic conditions
        const exits = Game.map.describeExits(creep.room.name);
        // const targetRoom = exits[Object.keys(exits)[(Math.floor(Math.random * Object.keys(exits).length))]];
        const targetRoom = exits[Object.keys(exits)[0]]; // Example: takes the first found exit room
        return targetRoom;
    },


    harvestEnergy(creep) {
        const source = Game.getObjectById(creep.memory.assignedSource);
        if (source) {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.travelTo(source, { visualizePathStyle: { stroke: '#ffaa00' }, reusePath: 50 });
            }
        } else {
            creep.travelTo(new RoomPosition(25, 25, creep.memory.sourceRoom), { visualizePathStyle: { stroke: '#ffaa00' }, reusePath: 50 });
        }
    },

    depositEnergy(creep) {
        if (creep.room.name !== creep.memory.homeRoom) {
            creep.travelTo(new RoomPosition(25, 25, creep.memory.homeRoom), { visualizePathStyle: { stroke: '#ffffff' }, reusePath: 50 });
            return;
        }

        const depositTo = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (
                    (structure.structureType === STRUCTURE_CONTAINER ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_STORAGE) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                );
            }
        });
        if (depositTo) {
            if (creep.transfer(depositTo, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.travelTo(depositTo, { visualizePathStyle: { stroke: '#ffffff' }, reusePath: 50 });
            }
        } else {
            console.log('Error: Deposit not found for', creep.name);
            creep.say('No deposit');
        }
    },
};

module.exports = roleLDHarvester;
