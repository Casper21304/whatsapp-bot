const {
default: makeWASocket,
useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const pino = require("pino")
const qrcode = require("qrcode-terminal")

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

sock.ev.on("connection.update", (update) => {

const { connection, qr } = update

console.log("STATUS:", connection)

if(qr){

console.log("\nSCAN QR BELOW:\n")

qrcode.generate(qr, { small: true })

}

if(connection === "open"){
console.log("CONNECTED SUCCESSFULLY 🎉")
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

// HELP
if(text === "/help"){
await sock.sendMessage(from,{
text:`🤖 COMENZI:

/help
/glume
/compatibilitate`
})
}

// GLUME
if(text === "/glume"){

const jokes = [
"JavaScript rulează doar când vrea el 😆",
"Bug-ul e feature ascuns 😂",
"Am șters codul și a mers mai bine 🤡"
]

await sock.sendMessage(from,{
text: jokes[Math.floor(Math.random()*jokes.length)]
})

}

// COMPATIBILITATE
if(text.startsWith("/compatibilitate")){

const percent = Math.floor(Math.random()*100)

await sock.sendMessage(from,{
text:`💘 Compatibilitate: ${percent}%`
})

}

})

}

start()