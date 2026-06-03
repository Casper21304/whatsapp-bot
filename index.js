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
logger:pino({ level:"silent" })
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("connection.update", async () => {

if(!sock.authState.creds.registered){

const phoneNumber = "40760335381"

console.log("TRYING PAIRING...")

setTimeout(async () => {

try {

const code =
await sock.requestPairingCode(phoneNumber)

console.log("\nPAIRING CODE:\n", code)

} catch (e) {

console.log("PAIRING ERROR:", e?.message || e)

}

}, 3000)

}

})

}

start()