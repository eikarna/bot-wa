import wa from '@whiskeysockets/baileys';
const { delay, makeCacheableSignalKeyStore, proto } = wa;
import { makeWASocket, AnyMessageContent, WAMessageContent, WAMessageKey } from '@whiskeysockets/baileys'
import NodeCache from "node-cache";

// @ts-ignore
const waSocket = function(version: makeWASocket.WAVersion, logger: logger, usePairingCode: boolean, state: makeWASocket.AuthenticationState, msgRetryCounterCache: NodeCache, store: any) {
    // @ts-ignore
    return makeWASocket({
        version,
        logger,
        printQRInTerminal: !usePairingCode,
        auth: {
            creds: state.creds,
            /** caching makes the store faster to send/recv messages */
            keys: makeCacheableSignalKeyStore(state.keys, logger),
        },
        msgRetryCounterCache,
        generateHighQualityLinkPreview: true,
        // ignore all broadcast messages -- to receive the same
        // comment the line below out
        // shouldIgnoreJid: jid => isJidBroadcast(jid),
        // implement to handle retries & poll updates
        getMessage: createGetMessageFunction(store),
    })
}

const createGetMessageFunction = (store?: any) => {
    return async (key: WAMessageKey): Promise<WAMessageContent | undefined> => {
        if (store) {
            const msg = await store.loadMessage(key.remoteJid!, key.id!)
            return msg?.message || undefined
        }
        return proto.Message.fromObject({})
    }
}

const getMessage = async(store: any, key: WAMessageKey): Promise<WAMessageContent | undefined> => {
    if(store) {
        const msg = await store.loadMessage(key.remoteJid!, key.id!)
        return msg?.message || undefined
    }

    // only if store is present
    return proto.Message.fromObject({})
}

const sendMessageWTyping = async(sock: any, msg: AnyMessageContent, jid: string) => {
    await sock.presenceSubscribe(jid)
    await delay(500)

    await sock.sendPresenceUpdate('composing', jid)
    await delay(2000)

    await sock.sendPresenceUpdate('paused', jid)

    await sock.sendMessage(jid, msg)
}

export {
    sendMessageWTyping, getMessage, waSocket }