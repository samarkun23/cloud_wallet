import axios from 'axios';
import './App.css'
import {Transaction, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Connection} from '@solana/web3.js'


const fromPubkey = new PublicKey("7ozL17LzUqfMV1yKqn1dKjUQkxuehrScdZVX26HrGDWX")
function App() {

  const connection = new Connection("https://api.devnet.solana.com");

  async function sendSol() {
    const ix = SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey:  new PublicKey("3TdHMbqcvkAmmZZjmMbUrUjiVBz155KomddiK2ZHNRov") ,
      lamports: 0.01 * LAMPORTS_PER_SOL
    })
    const tx = new Transaction().add(ix);
    // so here i create a transaction but i don't have my private key so i don't sign the tx so i need to send it to backend and some how req to my backend to sign this on my behafe . 
    // we cannot send the random object over there the backend might be in python so we need to send some string or bytes and send that 
    const { blockhash } = await connection.getLatestBlockhash()
    tx.recentBlockhash = blockhash
    tx.feePayer = fromPubkey

    const serializedTx = tx.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    })

    console.log(serializedTx);

    await axios.post("/api/v1/txn/sign", {
      message: serializedTx,
      retry : false
    })

  }

  return (
    <>
      <div style={{ display : 'flex' , gap: '10px', }}>
        <input type="text" placeholder='Amount' />
        <input type="text" placeholder='Address' />
        <button onClick={sendSol}>Submit</button>
      </div>
    </>
  )
}

export default App
