# WireGuard Config Kit

`wireguard-config-kit` is a small TypeScript package for generating and validating WireGuard core configuration JSON.

It targets a minimal WireGuard backend core config shape, not Xray's WireGuard inbound schema.

## Install

```powershell
bun install
```

## Usage

```ts
import {
  createDefaultWireGuardCoreDraft,
  createWireGuardCorePayload,
  createWireGuardCoreConfig,
  createWireGuardCoreConfigFromDraft,
  generateWireGuardCoreConfigJson,
  generateWireGuardKeyPair,
  getWireGuardCoreFormCapabilities,
  getWireGuardPublicKey,
  validateWireGuardCoreDraft,
  validateWireGuardCoreConfig
} from "wireguard-config-kit";

const keyPair = generateWireGuardKeyPair();

const config = createWireGuardCoreConfig({
  interfaceName: "wg0",
  privateKey: keyPair.privateKey,
  listenPort: 51820,
  address: ["10.0.0.1/8"]
});

const json = generateWireGuardCoreConfigJson({ privateKey: keyPair.privateKey });
const publicKey = getWireGuardPublicKey(config.private_key);
const validation = validateWireGuardCoreConfig(config);

const payload = createWireGuardCorePayload({
  name: "wireguard_core",
  privateKey: keyPair.privateKey
});
```

Generated core config JSON is ready to paste into a core config editor or send as the `config` field in `/api/core`.

Default generated config:

```json
{
  "interface_name": "wg0",
  "private_key": "<generated>",
  "listen_port": 51820,
  "address": ["10.0.0.1/8"]
}
```

`public_key` is intentionally omitted from the persisted config. It can be derived from `private_key`; use `getWireGuardPublicKey()` when the UI needs to display it.

## Form Flow

Use the form helpers when a UI owns editable drafts and needs field metadata before compiling to core JSON:

```ts
const capabilities = getWireGuardCoreFormCapabilities();
const draft = createDefaultWireGuardCoreDraft();
const issues = validateWireGuardCoreDraft(draft);

if (issues.length === 0) {
  const config = createWireGuardCoreConfigFromDraft(draft);
}
```

The form draft includes a read-only `publicKey` field for display. It is never written into the generated core config.

## Validation

Validation mirrors the backend `WireGuardConfig` rules:

- `interface_name` is required and cannot contain `,` or `<=>`.
- `private_key` and `pre_shared_key` must decode to exactly 32 bytes.
- `listen_port` must be an integer from `1` to `65535`.
- `address` must be an array of IP interface strings and may be empty.
- Extra JSON fields are preserved for forward compatibility.
