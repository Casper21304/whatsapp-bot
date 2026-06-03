const express = require("express")
const QRCode = require("qrcode")

const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason
} = require("@whiskeysockets/baileys")

const pino = require("pino")

const app = express()

let qrImage = null

// ================= WEB =================
app.get("/", (req,res)=>{
res.send("🤖 WhatsApp Bot Running")
})

app.get("/qr", (req,res)=>{
if(!qrImage){
return res.send("<h2>QR încă nu este gata...</h2>")
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
sock.ev.on("messages.upsert", async ({ messages }) => {

const m = messages[0]
if(!m.message) return

const from = m.key.remoteJid
const sender = m.key.participant || m.key.remoteJid

const text =
m.message.conversation ||
m.message.extendedTextMessage?.text

if(!text) return

console.log("📩 MSG:", text)

// HELP
if(text === "/help"){
await sock.sendMessage(from,{
text:`🤖 COMENZI:

/help
/glume
/top`
})
}

// GLUME
if(text === "/glume"){
await sock.sendMessage(from,{
text:"😂 Glumă: codul merge doar când nu te uiți la el."
})
}

// TOP
if(text === "/top"){
await sock.sendMessage(from,{
text:"📊 Bot activ ✔ funcționează corect"
})
}

})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", async (update)=>{

const { connection, qr, lastDisconnect } = update

console.log("STATUS:", connection)

// 👉 QR transform în imagine reală
if(qr){
qrImage = await QRCode.toDataURL(qr)
console.log("QR UPDATED → /qr")
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