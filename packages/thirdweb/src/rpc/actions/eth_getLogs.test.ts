import { describe, it, expect } from "vitest";
import { getRpcClient } from "../rpc.js";
import { FORKED_ETHEREUM_CHAIN } from "~test/chains.js";
import { TEST_CLIENT } from "~test/test-clients.js";
import { eth_getLogs } from "./eth_getLogs.js";

const rpcClient = getRpcClient({
  chain: FORKED_ETHEREUM_CHAIN,
  client: TEST_CLIENT,
});

describe("eth_getLogs", () => {
  it("should return unparsed logs, without events", async () => {
    const logs = await eth_getLogs(rpcClient);
    expect(logs).toMatchInlineSnapshot(`[]`);
  });
});