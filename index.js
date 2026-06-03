const {
default: makeWASocket,
useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const QRCode = require("qrcode")
const express = require("express")

const app = express()
let latestQR = null

app.get("/", (req,res)=>{
res.send("<h1>Bot online</h1><p>QR: /qr</p>")
})

app.get("/qr", (req,res)=>{
if(!latestQR) return res.send("QR not ready")
res.send(`<img src="${latestQR}" style="width:300px"/>`)
})

app.listen(3000)

async function start(){

console.log("BOT START")

const { state, saveCreds } =
await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state,
browser:["Bot","Chrome","1.0"],
logger:pino({ level:"silent" })
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", async (update) => {

const { connection, qr } = update

console.log("STATUS:", connection)

if(qr){

latestQR = await QRCode.toDataURL(qr)
console.log("QR UPDATED → open /qr")
}

if(connection === "open"){
console.log("CONNECTED 🎉")
}

})

}

start()