function createJob(type, id, workNeeded, roomPos){

}

function updateJob(){

}

function assignJobToCreep(jobID){

}

function getJobs(){

}

function checkIfJobExists(){

}

function scanForNewJobs(room){
    room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
}

const jobManager = {

    run: function (roomName) {
        const room = Game.rooms[roomName];
        if(Game.time % 10 === 0) {
            scanForNewJobs(room);
        }
    }
};

module.exports = jobManager;