const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason
} = require("@whiskeysockets/baileys")

const pino = require("pino")

async function start(){

console.log("BOT PRO START")

const { state, saveCreds } =
await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state,
browser:["Bot","Chrome","1.0"],
logger:pino({ level:"silent" })
})

sock.ev.on("creds.update", saveCreds)

// ======================
// 📊 ACTIVITATE USERS
// ======================
const userMessages = {}

// ======================
// 👥 WELCOME GROUP
// ======================
sock.ev.on("group-participants.update", async (update)=>{

const groupId = update.id
const participants = update.participants

for(let p of participants){

if(update.action === "add"){

await sock.sendMessage(groupId,{
text:`👋 Bun venit @${p.split("@")[0]}!`
},{mentions:[p]})

userMessages[p] = userMessages[p] || 0
}

}

})

// ======================
// 💬 COMENZI + TRACKING
// ======================
sock.ev.on("messages.upsert", async ({ messages })=>{

const m = messages[0]
if(!m.message) return

const from = m.key.remoteJid
const sender = m.key.participant || m.key.remoteJid

const text =
m.message.conversation ||
m.message.extendedTextMessage?.text

if(!text) return

// TRACK MESSAGES
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
"JavaScript are viață proprie 😂",
"Bug-ul e doar o surpriză neașteptată 🤡",
"Codul merge… uneori 😆"
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

// TOP ACTIVITATE
if(text === "/top"){

let sorted = Object.entries(userMessages)
.sort((a,b)=>b[1]-a[1])
.slice(0,5)

let msg = "📊 TOP ACTIVITATE:\n\n"

for(let [user,count] of sorted){
msg += `👤 ${user.split("@")[0]} → ${count} mesaje\n`
}

await sock.sendMessage(from,{text:msg})
}

})

sock.ev.on("connection.update",(update)=>{

const { connection, lastDisconnect } = update

console.log("STATUS:", connection)

if(connection === "close"){

const reason =
lastDisconnect?.error?.output?.statusCode

console.log("DISCONNECTED:", reason)

if(reason !== DisconnectReason.loggedOut){
start()
}

}

if(connection === "open"){
console.log("CONNECTED 🎉 BOT PRO READY")
}

})

}

start()