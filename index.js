const express = require("express")
const QRCode = require("qrcode")

const {
default: makeWASocket,
useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const pino = require("pino")

const app = express()

let qrImage = null

// ================= WEB =================
app.get("/", (req,res)=>{
res.send("🤖 Bot running")
})

app.get("/qr", (req,res)=>{
if(!qrImage){
return res.send("<h2>QR încă nu este generat...</h2>")
}

res.send(`
<h2>Scanează QR:</h2>
<img src="${qrImage}" width="300"/>
`)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>console.log("WEB ON PORT", PORT))


// ================= BOT =================
async function start(){

console.log("BOT START")

const { state, saveCreds } =
await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state,
browser:["Bot","Chrome","1.0"],
logger:pino({ level:"silent" }),
printQRInTerminal:false
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", async (update)=>{

const { connection, qr } = update

console.log("STATUS:", connection)

// 👉 transform QR în imagine web
if(qr){
qrImage = await QRCode.toDataURL(qr)
console.log("QR READY → /qr")
}

if(connection === "open"){
console.log("CONNECTED 🎉")
qrImage = null
}

})

}

start()