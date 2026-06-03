const {
default: makeWASocket,
useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const QRCode = require("qrcode")

async function start(){

console.log("BOT STARTING...")

const { state, saveCreds } =
await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state,
browser: ["Bot","Chrome","1.0"],
logger: pino({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", async (update) => {

const { connection, qr } = update

console.log("STATUS:", connection)

if(qr){

console.log("\nOPEN THIS QR (URL IMAGE):\n")

const url = await QRCode.toDataURL(qr)

console.log(url)

}

if(connection === "open"){
console.log("CONNECTED 🎉")
}

})

sock.ev.on("messages.upsert", async ({ messages }) => {

const m = messages[0]
if(!m.message) return

const text =
m.message.conversation ||
m.message.extendedTextMessage?.text

if(!text) return

const from = m.key.remoteJid

if(text === "/help"){
await sock.sendMessage(from,{
text:`🤖 COMENZI:

/help
/glume
/compatibilitate`
})
}

if(text === "/glume"){

const jokes = [
"JavaScript are bug-uri infinite 😂",
"Am șters codul și a mers mai bine 🤡",
"Debugging = crime investigation 🔍"
]

await sock.sendMessage(from,{
text: jokes[Math.floor(Math.random()*jokes.length)]
})

}

if(text.startsWith("/compatibilitate")){

const percent = Math.floor(Math.random()*100)

await sock.sendMessage(from,{
text:`💘 Compatibilitate: ${percent}%`
})

}

})

}

start()