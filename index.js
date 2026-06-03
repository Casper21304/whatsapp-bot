const express = require("express")
const app = express()

const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason
} = require("@whiskeysockets/baileys")

const pino = require("pino")

// ======================
// WEB SERVER (Render fix)
// ======================
app.get("/", (req,res)=>{
res.send("🤖 WhatsApp Bot is running")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=>console.log("WEB ON PORT", PORT))

// ======================
// BOT LOGIC
// ======================

const userMessages = {}

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


// CONNECTION
sock.ev.on("connection.update",(update)=>{

const connection = update?.connection
const lastDisconnect = update?.lastDisconnect

if(connection){
console.log("STATUS:", connection)
}

if(connection === "open"){
console.log("CONNECTED 🎉")
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


// GROUP WELCOME
sock.ev.on("group-participants.update", async (update)=>{

if(update.action === "add"){

for(let p of update.participants){

await sock.sendMessage(update.id,{
text:`👋 Bun venit @${p.split("@")[0]}!`,
mentions:[p]
})

userMessages[p] = userMessages[p] || 0

}

}

})


// MESSAGES + COMMANDS
sock.ev.on("messages.upsert", async ({ messages })=>{

const m = messages[0]
if(!m.message) return

const from = m.key.remoteJid
const sender = m.key.participant || m.key.remoteJid

const text =
m.message.conversation ||
m.message.extendedTextMessage?.text

if(!text) return

// TRACK
userMessages[sender] = (userMessages[sender] || 0) + 1


// HELP
if(text === "/help"){
await sock.sendMessage(from,{
text:`🤖 COMENZI:

/help
/glume
/compatibilitate
/top`
})
}


// GLUME
if(text === "/glume"){

const jokes = [
"Codul merge doar după 10 restarturi 😂",
"Bug-ul e feature ascuns 🤡",
"JavaScript are personalitate 😆"
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


// TOP
if(text === "/top"){

let top = Object.entries(userMessages)
.sort((a,b)=>b[1]-a[1])
.slice(0,5)

let msg = "📊 TOP ACTIVITATE:\n\n"

for(let [user,count] of top){
msg += `👤 ${user.split("@")[0]} → ${count} mesaje\n`
}

await sock.sendMessage(from,{text:msg})
}

})

}

start()