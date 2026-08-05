import { generateKeyPair, scalarMultBase } from "@stablelib/x25519";
import { base64ToBytes, bytesToBase64, normalizeWireGuardKey } from "./base64.js";
import { assertValidWireGuardCoreConfig } from "./validation.js";
const defaultAddress = ["10.0.0.1/8"];
export function generateWireGuardKeyPair() {
    const keyPair = generateKeyPair();
    return {
        privateKey: bytesToBase64(keyPair.secretKey),
        publicKey: bytesToBase64(keyPair.publicKey)
    };
}
export function getWireGuardPublicKey(privateKey) {
    const normalizedPrivateKey = normalizeWireGuardKey(privateKey, "wireguard private_key");
    return bytesToBase64(scalarMultBase(base64ToBytes(normalizedPrivateKey)));
}
function configFromOptions(options = {}) {
    const privateKey = options.privateKey ?? generateWireGuardKeyPair().privateKey;
    const config = {
        ...(options.extra ?? {}),
        interface_name: options.interfaceName ?? "wg0",
        private_key: privateKey,
        listen_port: options.listenPort ?? 51820,
        address: [...(options.address ?? defaultAddress)]
    };
    if (options.preSharedKey !== undefined) {
        config.pre_shared_key = options.preSharedKey;
    }
    return config;
}
export function createWireGuardCoreConfig(options = {}) {
    return assertValidWireGuardCoreConfig(configFromOptions(options));
}
export function generateWireGuardCoreConfigJson(options = {}) {
    const { space = 2, ...configOptions } = options;
    return JSON.stringify(createWireGuardCoreConfig(configOptions), null, space);
}
export function createWireGuardCorePayload(options = {}) {
    const { name = "wireguard_core", ...configOptions } = options;
    return {
        name,
        type: "wg",
        config: createWireGuardCoreConfig(configOptions),
        exclude_inbound_tags: [],
        fallbacks_inbound_tags: []
    };
}
//# sourceMappingURL=core.js.map