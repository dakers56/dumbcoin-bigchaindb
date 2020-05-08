const BigchainDB = require('bigchaindb-driver')
const bip39 = require('bip39')

const API_PATH = 'http://localhost:9984/api/v1/'
const conn = new BigchainDB.Connection(API_PATH)

const nTokens = 10000
let tokensLeft
const mnemonicArr = bip39.generateMnemonic().slice(0, 32);
const mUintArr = new Uint8Array([...Buffer.from(mnemonicArr)]);
const tokenCreator = new BigchainDB
  .Ed25519Keypair(mUintArr)
let createTxId
async function tokenLaunch() {
  // Construct a transaction payload
  const tx = BigchainDB.Transaction.makeCreateTransaction({
    token: 'TT (Tutorial Tokens)',
    number_tokens: nTokens
  },
    // Metadata field, contains information about the transaction itself
    // (can be `null` if not needed)
    {
      datetime: new Date().toString()
    },
    // Output: Divisible asset, include nTokens as parameter
    [BigchainDB.Transaction.makeOutput(BigchainDB.Transaction
      .makeEd25519Condition(tokenCreator.publicKey), nTokens.toString())],
    tokenCreator.publicKey
  )

  // Sign the transaction with the private key of the token creator
  const txSigned = BigchainDB.Transaction
    .signTransaction(tx, tokenCreator.privateKey)

  // Send the transaction off to BigchainDB
  let txnId;
  await conn.postTransactionCommit(txSigned)
    .then(res => {
      createTxId = res.id
      tokensLeft = nTokens
      // txSigned.id corresponds to the asset id of the tokens
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
