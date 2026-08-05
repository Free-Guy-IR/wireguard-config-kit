import type { JsonValue, WireGuardCoreConfig, WireGuardValidationIssue } from "./types.js";
export type WireGuardCoreDraft = {
    readonly interfaceName: string;
    readonly privateKey: string;
    readonly publicKey: string;
    readonly preSharedKey: string;
    readonly listenPort: number | string;
    readonly address: readonly string[];
    readonly extra: Record<string, JsonValue>;
};
export type CreateDefaultWireGuardCoreDraftOptions = Partial<Omit<WireGuardCoreDraft, "publicKey" | "extra">> & {
    readonly publicKey?: string;
    readonly extra?: Record<string, JsonValue>;
};
export type WireGuardCoreFieldKey = "interfaceName" | "privateKey" | "publicKey" | "preSharedKey" | "listenPort" | "address" | "extra";
export type WireGuardCoreFormFieldInput = "text" | "secret" | "readonly" | "number" | "string-array" | "json-object";
export type WireGuardCoreFormField = {
    readonly key: WireGuardCoreFieldKey;
    readonly configKey?: string;
    readonly label: string;
    readonly input: WireGuardCoreFormFieldInput;
    readonly required: boolean;
    readonly readOnly?: boolean;
    readonly placeholder?: string;
};
export type WireGuardCoreFieldVisibility = Record<WireGuardCoreFieldKey, boolean>;
export type WireGuardCoreFormCapabilities = {
    readonly fieldOrder: readonly WireGuardCoreFieldKey[];
    readonly fields: Record<WireGuardCoreFieldKey, WireGuardCoreFormField>;
    readonly defaults: Pick<WireGuardCoreDraft, "interfaceName" | "listenPort" | "address">;
};
export declare function createDefaultWireGuardCoreDraft(options?: CreateDefaultWireGuardCoreDraftOptions): WireGuardCoreDraft;
export declare function syncWireGuardCoreDraftPublicKey(draft: WireGuardCoreDraft): WireGuardCoreDraft;
export declare function getWireGuardCoreFormCapabilities(): WireGuardCoreFormCapabilities;
export declare function getWireGuardCoreFieldVisibility(_draft?: WireGuardCoreDraft, _capabilities?: WireGuardCoreFormCapabilities): WireGuardCoreFieldVisibility;
export declare function validateWireGuardCoreDraft(draft: WireGuardCoreDraft): WireGuardValidationIssue[];
export declare function createWireGuardCoreConfigFromDraft(draft: WireGuardCoreDraft): WireGuardCoreConfig;
export declare function generateWireGuardCoreConfigJsonFromDraft(draft: WireGuardCoreDraft, space?: number): string;
//# sourceMappingURL=form.d.ts.map