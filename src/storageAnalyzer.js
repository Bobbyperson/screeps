class StorageAnalyzer {
    constructor(memoryKey, nTicks) {
        this.memoryKey = memoryKey;
        this.nTicks = nTicks;
        if (!Memory[this.memoryKey]) {
            Memory[this.memoryKey] = {
                tickData: [],
                rateOfChange: 0,
            };
        }
    }

    analyze(room) {
        const { storage } = room;
        if (!storage) {
            console.log("No storage found in room.");
            return;
        }

        const { tickData } = Memory[this.memoryKey];

        // Record the current tick's storage data
        const currentTickData = {
            tick: Game.time,
            storedEnergy: storage.store[RESOURCE_ENERGY],
        };
        tickData.push(currentTickData);

        // Remove tick data older than N ticks
        while (tickData[0].tick < Game.time - this.nTicks) {
            tickData.shift();
        }

        // Calculate the rate of change in storage
        if (tickData.length > 1) {
            const startTickData = tickData[0];
            const endTickData = tickData[tickData.length - 1];
            const energyChange = endTickData.storedEnergy - startTickData.storedEnergy;
            const tickChange = endTickData.tick - startTickData.tick;
            Memory[this.memoryKey].rateOfChange = energyChange / tickChange;
        }
    }

    getRateOfChange() {
        return Memory[this.memoryKey].rateOfChange;
    }
}

module.exports = StorageAnalyzer;