
const BigchainDB = require('bigchaindb-driver');
const check = require('check-types');

const transformSeedToArr = (seed) => {
    return new Uint8Array([...Buffer.from(seed)]);
};

const generateKeypair = (seed) => {
    const arr = check.assigned(seed) ? transformSeedToArr(padOrTrimSeed(seed)) : undefined;
    return new BigchainDB.Ed25519Keypair(arr);
}

const padOrTrimSeed = (seed) => {
    let finalSeed = seed;
    while(seed.length < 32) seed += '0';
    return seed.slice(0, 32);
}

const seed = process.argv.length > 2 ? process.argv[2] : undefined;
console.log(`Generating keypair with seed ${seed}`);
console.log(`Keypair: ${JSON.stringify(generateKeypair(seed))}`);