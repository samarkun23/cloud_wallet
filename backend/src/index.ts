import express from 'express'
import dotenv from 'dotenv'
import { userModel } from './model.js';
import { Keypair } from '@solana/web3.js';
import jwt from 'jsonwebtoken'

dotenv.config();

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async(req, res) => {
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

    if(user){
        const JWT_SECRET = process.env.JWT_SECRET
        const token = jwt.sign({
            id: user
        }, JWT_SECRET!)

        return res.json({token})
    }else{
        res.status(403).json({
            message: "Credentials are incorrect"
        })
    }

    res.json({
        message: "SignIn"
    })
})

app.post("/api/v1/sign", (req, res) => {
    
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
