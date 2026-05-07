import { describe, expect, it } from "bun:test";
import {
  createWireGuardCorePayload,
  createWireGuardCoreConfig,
  generateWireGuardCoreConfigJson,
  generateWireGuardKeyPair,
  getWireGuardPublicKey,
  validateWireGuardCoreConfig
} from "../src/index.js";

const knownPrivateKey = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
const knownPublicKey = "L+V9o0fNYkMVKNqsX7spBzD/9oSvxM/C7ZCZX1jLO3Q=";
const knownPreSharedKey = "AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE=";

describe("wireguard-config-kit", () => {
  it("creates default WireGuard core config JSON", () => {
    const config = createWireGuardCoreConfig({ privateKey: knownPrivateKey });

    expect(config).toEqual({
      interface_name: "wg0",
      private_key: knownPrivateKey,
      listen_port: 51820,
      address: ["10.0.0.1/8"]
    });
    expect(config).not.toHaveProperty("public_key");

    const json = generateWireGuardCoreConfigJson({ privateKey: knownPrivateKey });
    expect(JSON.parse(json)).toEqual(config);
  });

  it("generates valid key pairs and derives public keys from private keys", () => {
    const keyPair = generateWireGuardKeyPair();

    expect(validateWireGuardCoreConfig({
      interface_name: "wg0",
      private_key: keyPair.privateKey,
      listen_port: 51820,
      address: ["10.0.0.1/8"]
    }).ok).toBe(true);
    expect(getWireGuardPublicKey(keyPair.privateKey)).toBe(keyPair.publicKey);
    expect(getWireGuardPublicKey(knownPrivateKey)).toBe(knownPublicKey);
  });

  it("rejects invalid interface names, ports, keys, and addresses", () => {
    const valid = {
      interface_name: "wg0",
      private_key: knownPrivateKey,
      listen_port: 51820,
      address: ["10.0.0.1/8"]
    };

    expect(validateWireGuardCoreConfig({ ...valid, interface_name: "" }).ok).toBe(false);
    expect(validateWireGuardCoreConfig({ ...valid, interface_name: "wg,0" }).ok).toBe(false);
    expect(validateWireGuardCoreConfig({ ...valid, interface_name: "wg<=>0" }).ok).toBe(false);
    expect(validateWireGuardCoreConfig({ ...valid, listen_port: 0 }).ok).toBe(false);
    expect(validateWireGuardCoreConfig({ ...valid, listen_port: 65536 }).ok).toBe(false);
    expect(validateWireGuardCoreConfig({ ...valid, listen_port: 51820.5 }).ok).toBe(false);
    expect(validateWireGuardCoreConfig({ ...valid, private_key: "not-a-key" }).ok).toBe(false);
    expect(validateWireGuardCoreConfig({ ...valid, address: ["10.0.0.1/33"] }).ok).toBe(false);
    expect(validateWireGuardCoreConfig({ ...valid, address: ["999.0.0.1/8"] }).ok).toBe(false);
  });

  it("accepts an empty address list", () => {
    const config = createWireGuardCoreConfig({
      privateKey: knownPrivateKey,
      address: []
    });

    expect(config.address).toEqual([]);
  });

  it("validates and preserves optional pre_shared_key", () => {
    const config = createWireGuardCoreConfig({
      privateKey: knownPrivateKey,
      preSharedKey: knownPreSharedKey
    });

    expect(config.pre_shared_key).toBe(knownPreSharedKey);
    expect(validateWireGuardCoreConfig({ ...config, pre_shared_key: "bad" }).ok).toBe(false);
  });

  it("preserves extra JSON fields for forward compatibility", () => {
    const config = createWireGuardCoreConfig({
      privateKey: knownPrivateKey,
      extra: {
        peer_keepalive_seconds: 25,
        metadata: {
          owner: "panel"
        }
      }
    });

    expect(config.peer_keepalive_seconds).toBe(25);
    expect(config.metadata).toEqual({ owner: "panel" });
  });

  it("creates a WireGuard core payload for /api/core", () => {
    const payload = createWireGuardCorePayload({
      name: "wg-core",
      privateKey: knownPrivateKey
    });

    expect(payload).toMatchObject({
      name: "wg-core",
      type: "wg",
      exclude_inbound_tags: [],
      fallbacks_inbound_tags: [],
      config: {
        interface_name: "wg0",
        private_key: knownPrivateKey,
        listen_port: 51820,
        address: ["10.0.0.1/8"]
      }
    });
  });
});
