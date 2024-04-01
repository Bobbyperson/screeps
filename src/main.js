var roleHarvester = require('./roles/role.harvester');
var roleUpgrader = require('./roles/role.upgrader');
var roleBuilder = require('./roles/role.builder');
var roleRepair = require('./roles/role.repair');
var roleHauler = require('./roles/role.hauler');
var roleWallRepair = require('./roles/role.wallRepair');
var roleTruck = require('./roles/role.truck');
var roleLinkSlave = require('./roles/role.linkSlave');
var roleLDHarvester = require('./roles/role.ldharvester')
var roleCentralizer = require('./roles/role.centralizer');
var roleScout = require('./roles/role.scout');
var roleLDTruck = require('./roles/role.ldtruck');
var roleReserver = require('./roles/role.reserver');
var StorageAnalyzer = require('./utils/storageAnalyzer');
var structureTower = require('./structure.tower')
var roleDefender = require('./roles/role.defender');
var roleDefenderHealer = require('./roles/role.defenderHealer');
var excuseMe = require('./utils/excuseMe');
var profiler = require('./utils/screeps-profiler');
var { calculateFreeSpaces, getBodyCost } = require('./utils/utils');
require('./utils/stuckRepather');
require('./utils/Traveler');
require('./utils/jobs.common');
require('./spawner.extension');

let newName;
let name;
console.log(`${Game.time} Script reload`);

profiler.enable()
module.exports.loop = function () {
    profiler.wrap(function () {
        // Main.js logic should go here.
        handleDeadCreeps();

        analyzeStorage();

        const screepTypes = {
            harvester: {
                role: 'harvester',
                //body: [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,CARRY],
                body: [MOVE, WORK, WORK],
                desiredAmount: 0,
                priority: 1,
            },
            upgrader: {
                role: 'upgrader',
                // body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
                body: getCreepBody({ WORK: 4, CARRY: 4, MOVE: 4 }),
                // body: [MOVE,CARRY,WORK],
                desiredAmount: 4,
                priority: 3,
            },
            builder: {
                role: 'builder',
                //body: [MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY],
                body: getCreepBody({ WORK: 4, CARRY: 4, MOVE: 4 }),
                desiredAmount: 1,
                spawnCondition: _.filter(Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES)).length > 0,
                priority: 4,
            },
            repairer: {
                role: 'repairer',
                // body: [MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY],
                body: getCreepBody({ WORK: 4, CARRY: 4, MOVE: 4 }),
                desiredAmount: 0,
                spawnCondition: _.filter(Game.spawns['Spawn1'].room.find(FIND_STRUCTURES), (s) => (((s.structureType !== STRUCTURE_WALL && s.hits <= 250000) || (s.structureType !== STRUCTURE_RAMPART && s.hits <= 220000)) && s.hits < s.hitsMax)).length > 4,
                priority: 3,
            },
            hauler: {
                role: 'hauler',
                // body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
                body: getCreepBody({ CARRY: 6, MOVE: 3 }),
                desiredAmount: 2,
                priority: 2,
            },
            wallRepair: {
                role: 'wallRepair',
                // body: [MOVE, MOVE, MOVE, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
                body: getCreepBody({ WORK: 4, CARRY: 4, MOVE: 4 }),
                desiredAmount: 1,
                // spawnCondition: _.filter(Game.spawns['Spawn1'].room.find(FIND_STRUCTURES), (s) => ((s.structureType === STRUCTURE_WALL && s.hits <= 250000) || (s.structureType === STRUCTURE_RAMPART && s.hits <= 220000))).length > 1,
                priority: 6,
            },
            truck: {
                role: 'truck',
                // body: [CARRY, MOVE, CARRY, MOVE],
                body: getCreepBody({ CARRY: 4, MOVE: 2 }),
                desiredAmount: 4,
                spawnCondition: _.filter(Game.spawns['Spawn1'].room.find(FIND_DROPPED_RESOURCES)).length > 0,
                priority: 2,
            },
            linkSlave: {
                role: 'linkSlave',
                body: [WORK, CARRY, MOVE],
                desiredAmount: 0,
                priority: 8,
            },
            LDHarvester: {
                role: 'LDHarvester',
                // body: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                body: getCreepBody({ WORK: 6, MOVE: 3 }),
                // body: [WORK,CARRY,MOVE,MOVE],
                spawnCondition: _.filter(Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS)).length === 0 && _.filter(Memory.rooms, (room) => room.sos).length === 0,
                desiredAmount: 0,
                priority: 10,
            },
            LDTruck: {
                role: 'LDTruck',
                body: getCreepBody({ CARRY: 8, MOVE: 8 }),
                spawnCondition: _.filter(Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS)).length === 0 && _.filter(Memory.rooms, (room) => room.sos).length === 0,
                desiredAmount: 0,
                priority: 11,
            },
            centralizer: {
                role: 'centralizer',
                // body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
                body: getCreepBody({ CARRY: 8, MOVE: 4 }),
                desiredAmount: 0,
                priority: 98,
            },
            defender: {
                role: 'defender',
                // body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE],
                body: getCreepBody({ TOUGH: 5, RANGED_ATTACK: 3, MOVE: 8 }),
                desiredAmount: 3,
                spawnCondition: _.filter(Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS)).length > 0 || _.filter(Memory.rooms, (room) => room.sos).length > 0,
                priority: 10,
            },
            defenderHealer: {
                role: 'defenderHealer',
                // body: [HEAL, HEAL, HEAL, HEAL, MOVE, MOVE],
                body: getCreepBody({ HEAL: 4, MOVE: 4 }),
                desiredAmount: _.filter(Game.creeps, (creep) => creep.memory.role === 'defender').length,
                spawnCondition: _.filter(Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS)).length > 0 || _.filter(Memory.rooms, (room) => room.sos).length > 0,
                priority: 9,
            },
            scout: {
                role: 'scout',
                body: [MOVE],
                desiredAmount: 1,
                spawnCondition: _.filter(Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS)).length === 0,
                priority: 99,
            },
            reserver: {
                role: 'reserver',
                body: getCreepBody({ CLAIM: 2, MOVE: 2 }),
                desiredAmount: 0,
                spawnCondition: _.filter(Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS)).length === 0 && _.filter(Memory.rooms, (room) => room.sos).length === 0,
                priority: 100,
            }
        };

        let freeSpaces = 0;
        const sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
        for (const source of sources) {
            freeSpaces += calculateFreeSpaces(source);
        }
        screepTypes.harvester.desiredAmount = sources.length;

        let desiredLDHarvesters = 0;
        const adjacentRooms = Game.map.describeExits(Game.spawns['Spawn1'].room.name);
        for (var room in adjacentRooms) {
            room = directionToAdjacentRoom(Game.spawns['Spawn1'].room.name, room);
            if (Memory.rooms[room] && Memory.rooms[room].sources) {
                const sources = Memory.rooms[room].sources;
                desiredLDHarvesters += sources.length;
            }
        }
        screepTypes.LDHarvester.desiredAmount = desiredLDHarvesters;
        screepTypes.LDTruck.desiredAmount = desiredLDHarvesters;
        screepTypes.reserver.desiredAmount = desiredLDHarvesters;

        for (const role in screepTypes) {
            if (screepTypes.hasOwnProperty(role)) {
                // Calculate and assign the amountAlive property
                screepTypes[role].screepsAlive = _.filter(Game.creeps, (creep) => creep.memory.role === screepTypes[role].role && creep.ticksToLive > screepTypes[role].body.length * 3);
                if (role === 'harvester' || role === 'LDHarvester' || role === 'LDTruck' || role === 'reserver') {
                    screepTypes[role].screepsAlive = _.filter(Game.creeps, (creep) => creep.memory.role === screepTypes[role].role);
                }
            }
        }
        // if (Game.time % 10 === 0) {
            doSpawning(screepTypes);
        // }

        const spawn = Game.spawns['Spawn1'];
        if (spawn && Game.time % 500 === 0) {
            planRoadsFromSpawn(spawn);
        }

        const towers = Game.spawns['Spawn1'].room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.structureType === STRUCTURE_TOWER
        });
        for (var tower of towers) {
            structureTower.run(tower);
        }

        runCreeps();


    });
}

function runCreeps() {
    excuseMe.clearNudges();
    for (name in Game.creeps) {
        const creep = Game.creeps[name];
        if (!creep.spawning) {
            switch (creep.memory.role) {
                case 'harvester':
                    roleHarvester.run(creep);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep);
                    break;
                case 'builder':
                    roleBuilder.run(creep);
                    break;
                case 'repairer':
                    roleRepair.run(creep);
                    break;
                case 'hauler':
                    roleHauler.run(creep);
                    break;
                case 'wallRepair':
                    roleWallRepair.run(creep);
                    break;
                case 'truck':
                    roleTruck.run(creep);
                    break;
                case 'linkSlave':
                    roleLinkSlave.run(creep);
                    break;
                case 'LDHarvester':
                    roleLDHarvester.run(creep);
                    break;
                case 'centralizer':
                    roleCentralizer.run(creep);
                    break;
                case 'defender':
                    roleDefender.run(creep);
                    break;
                case 'defenderHealer':
                    roleDefenderHealer.run(creep);
                    break;
                case 'scout':
                    roleScout.run(creep);
                    break;
                case 'LDTruck':
                    roleLDTruck.run(creep);
                    break;
                case 'reserver':
                    roleReserver.run(creep);
                    break;
                default:
                    console.log('Creep role not found!');
                    break;
            }
        }
    }
}

function doSpawning(screepTypes) {
    let spawnPriority = 999;
    if (!Game.spawns['Spawn1'].spawning) {
        for (const role in screepTypes) {
            let shouldSpawn = true;
            if (screepTypes[role].hasOwnProperty('spawnCondition')) {
                if (screepTypes[role].spawnCondition === false) {
                    shouldSpawn = false;
                }
            }
            if (screepTypes[role].screepsAlive.length < screepTypes[role].desiredAmount && shouldSpawn === true && screepTypes[role].priority <= spawnPriority) {
                var newName;
                var counter = 0;
                var done = false;
                while (!done) {
                    done = true;
                    for (const creep in Game.creeps) {
                        if (creep === role + counter) {
                            done = false;
                            counter++;
                            break;
                        }
                    }
                    console.log('done: ' + done + ' counter: ' + counter + ' role: ' + role);
                }
                newName = role + counter;
                spawnPriority = screepTypes[role].priority;
                //console.log(`Spawning new ${role}: ` + newName);
                if (role === 'harvester') {
                    const sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
                    var desired;
                    var desiredBody;
                    var freeSpaces = 1;
                    for (let i = 0; i < sources.length; i++) {
                        const creepsUsing = _.filter(Game.creeps, (creep) => creep.memory.using === sources[i].id);
                        // freeSpaces = calculateFreeSpaces(sources[i]);
                        if (creepsUsing.length < 1) {
                            desired = sources[i].id;
                            break;
                        }
                    }
                    desiredBody = getCreepBody({ WORK: 5, CARRY: 1, MOVE: 3 });
                    // to empty out a source, 5 total WORK body parts are needed, take away body parts the more free spaces there are
                    // switch (freeSpaces) {
                    //     case 1:
                    //         desiredBody = getCreepBody({WORK: 6, MOVE: 2});
                    //         break;
                    //     case 2:
                    //         desiredBody = [MOVE, WORK, WORK, MOVE, WORK];
                    //         break;
                    //     default:
                    //         desiredBody = [MOVE, WORK, WORK];
                    //         break;
                    // }
                    Game.spawns['Spawn1'].spawnCreep(desiredBody, newName,
                        { memory: { role: role, using: desired } });
                } else if (role === 'LDHarvester' || role === 'LDTruck' || role === 'reserver') {
                    // get adjacent rooms
                    // check if there are sources in room using memory.rooms
                    // 3 ld harvesters per source, check amount using creep memory

                    const adjacentRooms = Game.map.describeExits(Game.spawns['Spawn1'].room.name);
                    var desired;
                    var desiredRoom;
                    for (var room in adjacentRooms) {
                        room = directionToAdjacentRoom(Game.spawns['Spawn1'].room.name, room);
                        if (Memory.rooms[room] && Memory.rooms[room].sources) {
                            const sources = Memory.rooms[room].sources;
                            for (let i = 0; i < sources.length; i++) {
                                const creepsUsing = _.filter(Game.creeps, (creep) => creep.memory.assignedSource === sources[i] && creep.memory.role === role);
                                if (creepsUsing.length < 1) {
                                    desired = sources[i];
                                    desiredRoom = room;
                                    break;
                                }
                            }
                        }
                    }
                    Game.spawns['Spawn1'].spawnCreep(screepTypes[role].body, newName,
                        { memory: { role: role, homeRoom: Game.spawns['Spawn1'].room.name, assignedSource: desired, sourceRoom: desiredRoom, initiated: true } });
                } else {
                    Game.spawns['Spawn1'].spawnCreep(screepTypes[role].body, newName,
                        { memory: { role: role } });
                }
            }
        }
    }

    if (Game.spawns['Spawn1'].spawning) {
        const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role + ` (${Game.spawns['Spawn1'].spawning.remainingTime - 1}t)`,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }
}

function handleDeadCreeps() {
    for (name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing dead creep memory:', name);
        }
    }
}

function planRoadsFromSpawn(spawn) {
    // Define the starting point for road construction
    const startPoint = spawn.pos;

    // Identify key points: resources, controller, extensions, and storage
    const resources = spawn.room.find(FIND_SOURCES);
    const controller = spawn.room.controller;
    const extensions = spawn.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });
    const storage = spawn.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_STORAGE }
    });


    // Combine all key points into an array for easy iteration
    const keyPoints = resources.concat(controller, extensions, storage);

    // Plan roads to each key point
    keyPoints.forEach(point => {
        if (point) { // Check if the point exists to avoid errors
            const path = PathFinder.search(startPoint, { pos: point.pos, range: 1 }, {
                // Room-specific conditions can be added here for pathfinding
                roomCallback: roomName => {
                    let room = Game.rooms[roomName];
                    if (!room) return;
                    let costs = new PathFinder.CostMatrix;

                    room.find(FIND_STRUCTURES).forEach(struct => {
                        if (struct.structureType === STRUCTURE_ROAD) {
                            // Favor existing roads. They will be set with a lower cost, encouraging reuse.
                            costs.set(struct.pos.x, struct.pos.y, 1);
                        } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                            (struct.structureType !== STRUCTURE_RAMPART ||
                                !struct.my)) {
                            // Can't walk through non-walkable buildings
                            costs.set(struct.pos.x, struct.pos.y, 0xff);
                        }
                    });
                    return costs;
                }
            });

            // Place construction sites for roads along the path
            for (let i = 0; i < path.path.length; i++) {
                const pos = path.path[i];
                spawn.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
            }
            // Place roads around the spawn
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i !== 0 || j !== 0) {
                        spawn.room.createConstructionSite(spawn.pos.x + i, spawn.pos.y + j, STRUCTURE_ROAD);
                    }
                }
            }


        }
    });
}

function analyzeStorage() {
    for (const roomName in Game.rooms) {
        if (Game.rooms[roomName] && Game.rooms[roomName].storage) {
            const storageAnalyzer = new StorageAnalyzer('Storage_' + roomName, 1000);
            storageAnalyzer.analyze(Game.rooms[roomName]);
            const storage = Game.rooms[roomName].storage;
            const rateOfChange = storageAnalyzer.getRateOfChange().toFixed(2); // Fixed to 2 decimal places for readability

            // Create a visual in the room of the storage
            new RoomVisual(roomName).text(
                `ΔEnergy: ${rateOfChange}/tick`,
                storage.pos.x - 2,
                storage.pos.y - 1.5, // Position the text just above the storage
                {
                    align: 'left',
                    color: 'white',
                    font: 0.5
                }
            );
            if (rateOfChange < 0) {
                new RoomVisual(roomName).text(
                    'Depleted in: ' + Math.floor(storage.store[RESOURCE_ENERGY] / Math.abs(rateOfChange)) + ' ticks',
                    storage.pos.x - 2,
                    storage.pos.y - 1,
                    {
                        align: 'left',
                        color: 'red',
                        font: 0.5
                    }
                );
            } else {
                new RoomVisual(roomName).text(
                    'Filled in: ' + Math.floor((storage.storeCapacity - storage.store[RESOURCE_ENERGY]) / rateOfChange) + ' ticks',
                    storage.pos.x - 2,
                    storage.pos.y - 1,
                    {
                        align: 'left',
                        color: 'lime',
                        font: 0.5
                    }
                );
            }
        }
    }
}

function directionToAdjacentRoom(roomName, direction) {
    // get poles and coords from name
    var coords = roomName.match('([WE])(\\d+)([NS])(\\d+)');
    var we = coords[1];
    var x = parseInt(coords[2]);
    var ns = coords[3];
    var y = parseInt(coords[4]);
    switch (direction) {
        case '1':
            if (ns === 'N') {
                y -= 1;
            } else {
                y += 1;
            }
            break;
        case '3':
            if (we === 'W') {
                x -= 1;
            } else {
                x += 1;
            }
            break;
        case '5':
            if (ns === 'N') {
                y += 1;
            } else {
                y -= 1;
            }
            break;
        case '7':
            if (we === 'W') {
                x += 1;
            } else {
                x -= 1;
            }
            break;
        default:
            return false;
    }
    if (x == 0) {
        if (we === 'W') {
            we = 'E';
        } else {
            we = 'W';
        }
    }
    if (y == 0) {
        if (ns === 'N') {
            ns = 'S';
        } else {
            ns = 'N';
        }
    }
    return we + x + ns + y;
}

function getCreepBody(arrayBodyparts) {
    return _.reduce(arrayBodyparts, (result, bodypartCount, bodypartName) => result.concat(new Array(bodypartCount).fill(global[bodypartName])), []);
}