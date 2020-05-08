const BigchainDB = require('bigchaindb-driver');
const bip39 = require('bip39')

const API_PATH = 'http://localhost:9984/api/v1/'
const conn = new BigchainDB.Connection(API_PATH)

const nTokens = 10000

const mUintArr = new Uint8Array([...Buffer.from('foobarfoobarfoobarfoobarfoobarfo')]);
const tokenCreator = new BigchainDB
  .Ed25519Keypair(mUintArr)
export const generatorPubkey = tokenCreator.publicKey
console.log(`Public key is ${generatorPubkey}`);

async function tokenLaunch() {
  const asset = {
    token: 'Dumbcoin',
    number_tokens: nTokens
  };
  const metadata = {
    lastModified: new Date().toString(),
    isDumbcoin: true
  };
  const outputArr = [BigchainDB.Transaction.makeOutput(BigchainDB.Transaction
    .makeEd25519Condition(tokenCreator.publicKey), nTokens.toString())];
  const tx = BigchainDB.Transaction.makeCreateTransaction(
    asset,
    metadata,
    outputArr,
    tokenCreator.publicKey
  );
  const txSigned = BigchainDB.Transaction
    .signTransaction(tx, tokenCreator.privateKey)
  let txnId;
  await conn.postTransactionCommit(txSigned)
    .then(res => {
      console.log(`------------------------------`);
      console.log(`Result: ${JSON.stringify(res, null, 1)}`);
      console.log(`------------------------------`);
      txnId = txSigned.id
    })
    .catch(err => {
      throw err;
    })
  return txnId;
}

console.log('Launching Dumbcoin using bigchaindb!');
tokenLaunch()
  .then(
    txnId => {
      console.log(`First transaction id is ${txnId}`);
    }
  )
  .catch(err => {
    console.log(`Error launching Dumbcoin: ${JSON.stringify(err)}`);
  });
