const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const express = require("express")

const app = express()

let latestQR = null

app.get("/", (req,res)=>{
res.send("Bot online 🚀 - QR la /qr")
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
browser: ["Bot","Chrome","1.0"],
logger: pino({ level: "silent" }),
printQRInTerminal: false
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", async (update) => {

const { connection, qr, lastDisconnect } = update

console.log("STATUS:", connection)

if(qr && !latestQR){

latestQR = qr

console.log("QR READY → open /qr")
}

if(connection === "open"){
console.log("CONNECTED 🎉")
latestQR = null
}

if(connection === "close"){

const reason =
lastDisconnect?.error?.output?.statusCode

console.log("DISCONNECTED:", reason)

if(reason !== DisconnectReason.loggedOut){
console.log("RESTARTING...")
start()
}

}

})

}

start()