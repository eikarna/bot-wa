import {WAMessage} from "@whiskeysockets/baileys";
import {sendMessageWTyping} from "../functions/functions.js";
import ping from '../libraries/ping.js';

const commandHandler = async (sock: any, msg: WAMessage, command: string) => {
    console.log("Detected command:", command);
    switch (command) {
        case 'ping':
            await sendMessageWTyping(sock, {text: `Pong! from Bun\n\n${JSON.stringify(await ping(), null, 4)}`}, msg.key?.remoteJid!);
            break;
        // @ts-ignore
        case 'menu':
        case 'help':
        case 'bantuan':
            const listCommand = `- help, bantuan, menu
            - ping`;
            await sendMessageWTyping(sock, {text: `Selamat datang di Bot WhatsApp pintar! Berikut adalah perintah yang tersedia:\n\n${listCommand}`}, msg.key?.remoteJid!);
            break;
        default:
            break;
    }
}

export {
    commandHandler
}