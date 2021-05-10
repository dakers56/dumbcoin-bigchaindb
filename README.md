# Dumbcoin for BigchainDB

Unsurprisingly, this project is a stupidly simple attempt at creating a cryptocurrency using BigchainDB for educational purposes.

## How it Works

This project leverages divisible assets in BigchainDB. Thus each asset represents a certain number of tokens. Transactions can divide these tokens.

To perform a token creation event, use `launch.js`.

To transfer tokens from one user to another, run `transfer.js RECIPIENT_PUBLIC_KEY SENDER_PRIVATE_KEY NUM_TOKENS PARENT_TRANSACTION_ID SENDER_PUBLIC_KEY OUTPUT_INDEX`. `PARENT_TRANSACTION_ID` is the transaction which created the input which will be spent. `OUTPUT_INDEX` is the index in the previous transaction of the input that will be spent.
Note that this script implicitly assumes a single input, but could be extended to perform more complicated functionality in a natural fashion by taking in the appropriate keypair info and making small modifications to the code.