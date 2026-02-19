import express from 'express'
import dotenv from 'dotenv'
import { userModel } from './model.js';
import { Keypair, Connection, Transaction, PublicKey } from '@solana/web3.js';
import jwt from 'jsonwebtoken'
import bs58 from 'bs58'
import cors from 'cors'

dotenv.config();
const connection = new Connection("https://api.devnet.solana.com");

const app = express();
app.use(cors())
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    //validate the input check if the user is exist and hashed the password 

    const keypair = new Keypair();// this create a public and private key basically craete a wallet

    await userModel.create({
        username,
        password,
        publicKey: keypair.publicKey.toString(),
        privateKey: keypair.secretKey.toString() // [1,4,63,2,2,4,6,2,2]
    })

    res.json({
        message: keypair.publicKey.toString()
    })
})

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await userModel.findOne({
        username: username,
        password: password
    })

    if (user) {
        const JWT_SECRET = process.env.JWT_SECRET
        const token = jwt.sign({
            id: user
        }, JWT_SECRET!)

        return res.json({ token })
    } else {
        res.status(403).json({
            message: "Credentials are incorrect"
        })
    }

    res.json({
        message: "SignIn"
    })
})

app.post("/api/v1/sign", async (req, res) => {
    const serializedTransaction = req.body.message;

    // here we are recreating the transaction object 
    const tx = Transaction.from(Buffer.from(serializedTransaction))

    // const user = await userModel.find({
    //     where: {
    //         _id: ""
    //     }
    // })
    // const privateKey = user.privateKey;

    // we received token we need to sign this transaction now
    //
    // const keypair = Keypair.fromSecretKey(); // here you can pass the private key but we don't write the logic for put it in the db so i init the random private keypair. for now

    const PrivateKey = String(process.env.PRIVATE_KEY!);

    const keypair = Keypair.fromSecretKey(bs58.decode(PrivateKey));

    const {blockhash} = await connection.getRecentBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = keypair.publicKey 

    tx.sign(keypair)

    // sign using the keypair now we need to send it to the block chain 

    const signature = await connection.sendTransaction(tx, [keypair]);
    console.log(signature);

    res.json({
        message: "SignUP"
    })
})

app.get("/api/v1/txn", (req, res) => {
    res.json({
        message: "SignUP"
    })
})


app.listen(3000, () => {
    console.log("Server running on port 3000");
})
