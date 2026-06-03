const {
default: makeWASocket,
useMultiFileAuthState
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

const { connection } = update

console.log("STATUS:", connection)

if(connection === "open"){
console.log("CONNECTED 🎉")
}

})

}

start()