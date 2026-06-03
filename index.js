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

    sock.ev.on("creds.update", saveCreds)

    sock.ev.on("connection.update", (c) => {
        console.log("STATUS:", c.connection)
    })

    console.log("WAITING QR...")
}

start()