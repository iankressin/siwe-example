import express, { Request, Response } from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { generateNonce, SiweMessage } from 'siwe'

const app = express()
const nonces = new Map()

app.use(cors())
app.use(express.json())


app.get('/nonce/:userAddress', (req: Request, res: Response) => {
    const { userAddress } = req.params

    const nonce = generateNonce()

    nonces.set(userAddress.toLowerCase(), nonce)

    res.json({ nonce })
})

app.post('/login', async (req: Request, res: Response) => {
    const { signature, message } = req.body

    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.validate(signature)
    const nonce = nonces.get(fields.address.toLowerCase())

    if (fields.nonce !== nonce)
        return res.status(422).json({ message: 'Invalid nonce' })

    res.json({
        jwt: jwt.sign({ ...fields }, 'secret_key')
    })
})

app.listen(8000, () => console.log('Listening...'))
