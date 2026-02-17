import express from 'express'
import dotenv from 'dotenv'

dotenv.config();

const app = express();

app.post("/api/v1/signup", (req, res) => {
    res.json({
        message: "SignUP"
    })
})

app.post("/api/v1/signin", (req, res) => {
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
