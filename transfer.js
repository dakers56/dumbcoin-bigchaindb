const BigchainDB = require('bigchaindb-driver');
const check = require('check-types');

if (process.argv.length < 3) throw Error("Must provide public key of recipient");
if (process.argv.length < 4) throw Error("Must provide private key of sender");
if (process.argv.length < 5) throw Error("Must amount of tokens to transfer");
if (process.argv.length < 6) throw Error("Must provide parent transaction id");
if (process.argv.length < 7) throw Error("Must provide sender's public key");

const recvUser = process.argv[2];
const sendPrivateKey = process.argv[3];
const amountToSend = parseInt(process.argv[4]);
const createTxId = process.argv[5];
const sendUser = process.argv[6];
const outputIndex = process.argv.length < 8 ? 0 : parseInt(process.argv[7]);

console.log(`Sending ${amountToSend} Dumbcoin tokens to ${recvUser}`);

console.log(`recvUser: ${process.argv[2]}`);
console.log(`sendPrivateKey: ${process.argv[3]}`);
console.log(`amountToSend: ${process.argv[4]}`);
console.log(`createTxId: ${process.argv[5]}`);
console.log(`sendUser: ${process.argv[6]}`);
console.log(`output index: ${process.argv[6]}`);

const API_PATH = 'http://localhost:9984/api/v1/';
const conn = new BigchainDB.Connection(API_PATH);

const makeOutput = (pubKey, amt) => {
    console.log(`making output for ${pubKey}, ${amt}`);
    const cond = BigchainDB.Transaction.makeEd25519Condition(pubKey);
    return BigchainDB.Transaction.makeOutput(cond, amt.toString());
}

const transferTokens = async () => {
    const txOutputs = await conn.getTransaction(createTxId);
    console.log(`Outputs: ${JSON.stringify(txOutputs, null, 2)}`);
    console.log('------------------');

    // Assuming that there was a single output to this txn
    const unspentOutputs = [{
        tx: txOutputs,
        output_index: outputIndex
    }];
    console.log(`Unspent outputs ${JSON.stringify(unspentOutputs)}`);
    console.log('------------------');
    const prevAmt = parseInt(txOutputs.outputs[outputIndex].amount);
    console.log(`Previous amount of tokens was: ${prevAmt}`);
    // There will be two outputs: the amount transferred, and the amount remaining from the source
    const outputs = [makeOutput(sendUser, prevAmt - amountToSend), makeOutput(recvUser, amountToSend)];
    outputs.forEach(x => {console.log(`Output: ${JSON.stringify(x)}`)});
    console.log('------------------');
    const createTranfer = BigchainDB.Transaction
        .makeTransferTransaction(
            unspentOutputs,
            outputs
        );
    console.log(`Transfer: ${JSON.stringify(createTranfer)}`);
    console.log('------------------');
    // Sign the transaction with the tokenCreator key
    const signedTransfer = BigchainDB.Transaction
        .signTransaction(createTranfer, sendPrivateKey);
    return conn.postTransactionCommit(signedTransfer);
}

transferTokens().then(res => {
    console.log(`------------------------------`);
    console.log(`Result: ${JSON.stringify(res, null, 2)}`);
    console.log(`------------------------------`);
})
    .catch(err => {
        console.log(`Error occurred while transferring tokens: ${JSON.stringify(err, null, 2)}`);
    })