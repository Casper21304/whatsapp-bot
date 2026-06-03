byconsole.log("BOT PORNIT")

const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const pino = require("pino")

async function start() {
    console.log("INIT...")

    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const { state, saveCreds } = await useMultiFileAuthState("auth")

const sock = makeWASocket({
    auth: state,
    browser: ["Bot", "Chrome", "1.0"],
    logger: pino({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

    
const QRCode = require("qrcode")

sock.ev.on("connection.update", async (update) => {

const { connection, qr } = update

console.log("STATUS:", connection)

if(qr){

console.log("QR RECEIVED")

await QRCode.toString(
qr,
{
type:"terminal",
small:true
}
).then(console.log)

}

})

    console.log("WAITING QR...")
}

start()