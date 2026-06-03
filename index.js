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
browser: ["Bot","Chrome","1.0"],
logger: pino({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

// CONEXIUNE
sock.ev.on("connection.update", async (update) => {

console.log("STATUS:", update.connection)

// dacă NU e logat → pairing code
if(!sock.authState.creds.registered){

const phoneNumber = "40760335381"

setTimeout(async () => {

try{

const code = await sock.requestPairingCode(phoneNumber)

console.log("PAIRING CODE:")
console.log(code)

}catch(e){
console.log("ERROR PAIRING:", e)
}

}, 3000)

}

})

}

start()