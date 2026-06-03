const {
default: makeWASocket,
useMultiFileAuthState,
DisconnectReason
} = require("@whiskeysockets/baileys")

const pino = require("pino")

async function start(){

console.log("BOT START")

const { state, saveCreds } =
await useMultiFileAuthState("auth")

const sock = makeWASocket({
auth: state,
browser:["Bot","Chrome","1.0"],
logger:pino({ level:"silent" }),
printQRInTerminal:true
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update",(update)=>{

const connection = update?.connection
const lastDisconnect = update?.lastDisconnect

if(!connection) return

console.log("STATUS:", connection)

if(connection === "open"){
console.log("CONNECTED 🎉")
}

if(connection === "close"){

const reason =
lastDisconnect?.error?.output?.statusCode

console.log("DISCONNECTED:", reason)

if(reason !== DisconnectReason.loggedOut){
setTimeout(() => start(), 5000)
}

}

})

}

start()