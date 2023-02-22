# Sign in with Ethereum example

This is a example of how an authentication could be implemented between client and server using [SIWE](https://github.com/spruceid/siwe) and Json Web Tokens

## Authentication flow

The flow of the information is the following:

1. It starts with the front-end application requesting access to the user's wallet
2. The client sends a request to the server requesting a nonce for that given wallet address
3. The server generates a nonce, store it for future validation and forward the nonce back to the client
4. The client builds the message to be signed by the user with the newly created nonce 
5. User signs the message requested by the client generating a signature
6. Signature is sent back to the server, where it verfies the validity of the signature using the nonce
7. If the signature is valid, a JWT is created and sent to the client, otherwise the request fails

## How to run

1. Run `npm install` inside both folders, backend and frontend
2. Run `npm run dev` on both folders

