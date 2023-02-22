<script lang="ts">
    import axios from 'axios'
    import detectEthereumProvider from '@metamask/detect-provider'
    import { SiweMessage } from 'siwe';
    import { Web3Provider } from '@ethersproject/providers'
    import { Signer } from 'ethers'

    const API_URL = 'http://localhost:8000'
    let signer: Signer
    let provider: Web3Provider
    let jwt: string

    const signIn = async () => {
        const signerAddress = await signer.getAddress()

        const nonce = await getNonce(signerAddress)
        const message = createMessage(signerAddress, nonce)
        const signature = await signer.signMessage(message)

        jwt = await login(signature, message, signerAddress)
    }

    const login = async (
        signature: string,
        message: string,
        signerAddress: string
    ): Promise<string> => {
        return (await axios.post(
            `${ API_URL }/login`,
            {
                signature,
                message,
                signerAddress,
            },
        )).data.jwt
    }

    const getNonce = async (signerAddress: string): Promise<string> => {
        if (!signer)
            throw new Error('Signer not initialized')

        return (await axios.get(`${ API_URL }/nonce/${ signerAddress }`)).data.nonce
    }

    const createMessage = (signerAddress: string, nonce: string): string => {
        return new SiweMessage({
            address: signerAddress,
            nonce,
            statement: 'Sign in with ethereum',
            uri: window.location.origin,
            domain: window.location.host,
            version: '1',
            chainId: '1',
        }).prepareMessage()
    }

    const connectWallet = async () => {
        const ethProvider = await detectEthereumProvider()
        provider = new Web3Provider(ethProvider)

        await provider.send('eth_requestAccounts', [])

        signer = provider.getSigner()
    }
</script>

{ #if !signer }
    <button on:click={connectWallet}>Connect wallet</button>
{ :else if signer && !jwt}
    <button on:click={signIn}>Sign in with Ethereum</button>
{ :else }
    <div>
        <h1>Authenticated</h1>
        <span>JWT: {jwt}</span>
    </div>
{ /if}

