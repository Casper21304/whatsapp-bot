const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const QRCode = require("qrcode")
const express = require("express")

const app = express()

let qrImage = null

app.get("/", (req,res)=>{
res.send("Bot online 🚀 - intră la /qr")
})

app.get("/qr", (req,res)=>{
if(!qrImage){
return res.send("<h2>QR nu este gata încă... așteaptă</h2>")
}
res.send(`<h2>Scanează QR:</h2><img src="${qrImage}" style="width:300px"/>`)
})

app.listen(3000, ()=>console.log("WEB STARTED"))

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

const { connection, qr, lastDisconnect } = update

console.log("STATUS:", connection)

if(qr){

try{
qrImage = await QRCode.toDataURL(qr)
console.log("QR UPDATED → /qr")
}catch(e){
console.log("QR ERROR", e.message)
}

}

if(connection === "open"){
console.log("CONNECTED 🎉")
qrImage = null
}

if(connection === "close"){

const reason =
lastDisconnect?.error?.output?.statusCode

console.log("DISCONNECTED:", reason)

if(reason !== DisconnectReason.loggedOut){
start()
}

}

})

}

start()