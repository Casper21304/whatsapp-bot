const { default: makeWASocket,useMultiFileAuthState } = require("@whiskeysockets/baileys")
const pino = require("pino")

function rand(a){
return a[Math.floor(Math.random()*a.length)]
}

async function start(){

const { state, saveCreds } =
await useMultiFileAuthState("auth")

const sock = makeWASocket({

auth:state,

printQRInTerminal:true,

logger:pino({
level:"silent"
})

})

sock.ev.on(
"creds.update",
saveCreds
)

sock.ev.on(
"messages.upsert",
async ({messages})=>{

const m = messages[0]

if(!m.message) return

const text =
m.message.conversation ||
m.message.extendedTextMessage?.text

if(!text) return

const from =
m.key.remoteJid

if(text==="/help"){

await sock.sendMessage(
from,
{
text:
`🤖 COMENZI

/help
/glume
/compatibilitate`
}
)

}

if(text==="/glume"){

const jokes=[

"Bugurile nu dorm 😆",

"Internet instabil = character development",

"Coderii rezolvă probleme pe care le creează singuri"

]

await sock.sendMessage(
from,
{
text:rand(jokes)
}
)

}

if(
text.startsWith(
"/compatibilitate"
)
){

const p=
Math.floor(
Math.random()*100
)

await sock.sendMessage(
from,
{
text:
`❤️ Compatibilitate: ${p}%`
}
)

}

}
)

}

start()