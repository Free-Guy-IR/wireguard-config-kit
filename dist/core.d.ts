import type { CreateWireGuardCoreConfigOptions, CreateWireGuardCorePayloadOptions, GenerateWireGuardCoreConfigJsonOptions, WireGuardCoreConfig, WireGuardCorePayload, WireGuardKeyPair } from "./types.js";
export declare function generateWireGuardKeyPair(): WireGuardKeyPair;
export declare function getWireGuardPublicKey(privateKey: string): string;
export declare function createWireGuardCoreConfig(options?: CreateWireGuardCoreConfigOptions): WireGuardCoreConfig;
export declare function generateWireGuardCoreConfigJson(options?: GenerateWireGuardCoreConfigJsonOptions): string;
export declare function createWireGuardCorePayload(options?: CreateWireGuardCorePayloadOptions): WireGuardCorePayload;
//# sourceMappingURL=core.d.ts.map