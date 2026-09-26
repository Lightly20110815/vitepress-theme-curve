/**
 * Minimal test suite for api/deepseek.ts in vitepress-theme-curve
 *
 * Verifies:
 * 1. Global fetch is mocked (no real network calls).
 * 2. Unknown or missing task returns 400.
 * 3. Invalid Origin on POST returns 403.
 * 4. Overlong content (>8000 chars) returns 400.
 * 5. Client-provided model, max_tokens, messages, and temperature are strictly ignored.
 * 6. Cache-Control headers are correctly set for cachable GET requests.
 */
import assert from "node:assert/strict";
import handler from "./api/deepseek.ts";

process.env.DEEPSEEK_API_KEY = "test-mock-key";

let lastUpstreamPayload = null;
let lastUpstreamHeaders = null;

// Mock global fetch to ensure zero real network calls
globalThis.fetch = async (url, init = {}) => {
  if (String(url).includes("api.deepseek.com")) {
    lastUpstreamPayload = JSON.parse(init.body || "{}");
    lastUpstreamHeaders = init.headers;

    const mockResponse = {
      id: "chatcmpl-test",
      object: "chat.completion",
      created: 1234567890,
      model: "deepseek-chat",
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: "Mocked DeepSeek response for vitepress-theme-curve",
          },
          finish_reason: "stop",
        },
      ],
      usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
    };

    return new Response(JSON.stringify(mockResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  throw new Error(`Unexpected unmocked fetch call to: ${url}`);
};

async function runTests() {
  console.log("--- Starting DeepSeek Proxy Tests (vitepress-theme-curve) ---");

  // Test 1: Missing task -> 400
  {
    const req = new Request("https://ddnsy.fun/api/deepseek", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://ddnsy.fun",
      },
      body: JSON.stringify({}),
    });
    const res = await handler(req);
    assert.equal(res.status, 400, "Missing task must return 400");
    const json = await res.json();
    assert.match(json.error, /task/i);
    console.log("✓ Test 1 Passed: Missing task returns 400");
  }

  // Test 2: Unknown task -> 400
  {
    const req = new Request("https://ddnsy.fun/api/deepseek", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://ddnsy.fun",
      },
      body: JSON.stringify({ task: "unauthorized-custom-task" }),
    });
    const res = await handler(req);
    assert.equal(res.status, 400, "Unknown task must return 400");
    const json = await res.json();
    assert.match(json.error, /unsupported/i);
    console.log("✓ Test 2 Passed: Unknown task returns 400");
  }

  // Test 3: Unauthorized origin on POST -> 403
  {
    const req = new Request("https://ddnsy.fun/api/deepseek", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://evil-site.com",
      },
      body: JSON.stringify({ task: "self-typing" }),
    });
    const res = await handler(req);
    assert.equal(res.status, 403, "Disallowed origin on POST must return 403");
    console.log("✓ Test 3 Passed: Unauthorized origin returns 403");
  }

  // Test 4: Overlong content (>8000 chars) -> 400
  {
    const req = new Request("https://ddnsy.fun/api/deepseek", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://ddnsy.fun",
      },
      body: JSON.stringify({
        task: "summary",
        content: "A".repeat(8001),
      }),
    });
    const res = await handler(req);
    assert.equal(res.status, 400, "Content > 8000 chars must return 400");
    const json = await res.json();
    assert.match(json.error, /limit/i);
    console.log("✓ Test 4 Passed: Overlong content returns 400");
  }

  // Test 5: Client-sent model, max_tokens, messages are ignored; upstream uses deepseek-chat and server-set limit
  {
    lastUpstreamPayload = null;
    const req = new Request("https://ddnsy.fun/api/deepseek", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://ddnsy.fun",
      },
      body: JSON.stringify({
        task: "self-typing",
        model: "attacker-chosen-model",
        max_tokens: 88888,
        temperature: 0.01,
        messages: [{ role: "user", content: "malicious injected prompt" }],
      }),
    });
    const res = await handler(req);
    assert.equal(res.status, 200, "Valid task with mocked fetch should succeed");
    assert.ok(lastUpstreamPayload, "Upstream payload should have been captured");
    assert.equal(
      lastUpstreamPayload.model,
      "deepseek-chat",
      "Upstream model must be deepseek-chat",
    );
    assert.equal(
      lastUpstreamHeaders["Authorization"],
      "Bearer test-mock-key",
      "Authorization header must contain Bearer key",
    );
    assert.equal(
      lastUpstreamPayload.max_tokens,
      200,
      "Upstream max_tokens must be server-enforced (200 for self-typing)",
    );
    assert.notEqual(
      lastUpstreamPayload.messages[0].content,
      "malicious injected prompt",
      "Client messages must be ignored",
    );
    console.log("✓ Test 5 Passed: Client model & max_tokens & messages are ignored");
  }

  // Test 6: GET request caching headers
  {
    const req = new Request("https://ddnsy.fun/api/deepseek?task=randomquote", {
      method: "GET",
      headers: {
        Origin: "https://ddnsy.fun",
      },
    });
    const res = await handler(req);
    assert.equal(res.status, 200);
    const cacheHeader = res.headers.get("Cache-Control");
    assert.ok(cacheHeader && cacheHeader.includes("s-maxage="), "Cache-Control header present");
    console.log("✓ Test 6 Passed: GET request sets Cache-Control s-maxage");
  }

  console.log("\nALL 6 TESTS PASSED SUCCESSFULLY! Mock fetch was verified.");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
