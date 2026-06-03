console.log("BOT PORNIT")

const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const pino = require("pino")

async function start() {
    console.log("INIT...")

    const { state, saveCreds } = await useMultiFileAuthState("auth")

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: "silent" })
    })

    
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