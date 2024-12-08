import {isJidNewsletter, WAMessage} from "@whiskeysockets/baileys";
import config from '../../config/bot.json' assert {type: "json"};
import {commandHandler} from './commands.js';

const messageHandler = async (sock: any, msg: WAMessage) => {
    if (!isJidNewsletter(msg.key?.remoteJid!)) {
        await sock!.readMessages([msg.key])
        const messageBody = msg.message?.extendedTextMessage?.text || msg.message?.conversation || msg.message?.documentMessage?.caption || msg.message?.videoMessage?.caption || msg.message?.imageMessage?.caption || "";
        const prefix = config.prefix;
        const isCommand = prefix.includes(messageBody[0]);
        if (isCommand) {
            await commandHandler(sock, msg, messageBody.substring(1, messageBody.length));
        }
        // await sendMessageWTyping(sock, { text: 'Hello there! from WhiskeySockets with Bun' }, msg.key.remoteJid!);
    }
}

export {
    messageHandler
}