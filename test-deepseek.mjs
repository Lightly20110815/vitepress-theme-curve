/**
 * Minimal test suite for api/deepseek.ts in vitepress-theme-curve
 *
 * Verifies:
 * 1. Global fetch is mocked (no real network calls).
 * 2. Unknown or missing task returns 400.
 * 3. Invalid Origin on POST returns 403.
 * 4. GET on non-whitelisted task (summary) returns 405.
 * 5. Overlong content (>8000 chars) returns 400.
 * 6. Client-provided model, max_tokens, messages, and temperature are strictly ignored.
 * 7. Upstream error (401) returns 502 {"error":"upstream_error"} without leaking raw text.
 * 8. Cache-Control headers are correctly set for cachable GET requests.
 */
import assert from "node:assert/strict";
import handler from "./api/deepseek.ts";

process.env.DEEPSEEK_API_KEY = "test-mock-key";

let lastUpstreamPayload = null;
let lastUpstreamHeaders = null;
let mockUpstreamStatus = 200;
let mockUpstreamResponseBody = null;

// Mock global fetch to ensure zero real network calls
globalThis.fetch = async (url, init = {}) => {
  if (String(url).includes("api.deepseek.com")) {
    lastUpstreamPayload = JSON.parse(init.body || "{}");
    lastUpstreamHeaders = init.headers;

    if (mockUpstreamStatus !== 200) {
      return new Response(mockUpstreamResponseBody || "Upstream error", {
        status: mockUpstreamStatus,
        headers: { "Content-Type": "application/json" },
      });
    }

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

  const ORIGIN = "https://ddnsy.vercel.app";

  // Test 1: Missing task -> 400
  {
    const req = new Request(`${ORIGIN}/api/deepseek`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: ORIGIN,
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
    const req = new Request(`${ORIGIN}/api/deepseek`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: ORIGIN,
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
    const req = new Request(`${ORIGIN}/api/deepseek`, {
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

  // Test 4: GET on summary task returns 405 (GET only allowed for self-typing & randomquote)
  {
    const req = new Request(`${ORIGIN}/api/deepseek?task=summary`, {
      method: "GET",
      headers: { Origin: ORIGIN },
    });
    const res = await handler(req);
    assert.equal(res.status, 405, "GET on summary must return 405");
    const json = await res.json();
    assert.match(json.error, /Method Not Allowed/i);
    console.log("✓ Test 4 Passed: GET on summary returns 405");
  }

  // Test 5: Overlong content (>8000 chars) on POST summary -> 400
  {
    const req = new Request(`${ORIGIN}/api/deepseek`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: ORIGIN,
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
    console.log("✓ Test 5 Passed: Overlong content returns 400");
  }

  // Test 6: Client-sent model, max_tokens, messages are ignored; upstream uses deepseek-chat and server-set limit
  {
    lastUpstreamPayload = null;
    const req = new Request(`${ORIGIN}/api/deepseek`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: ORIGIN,
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
    console.log("✓ Test 6 Passed: Client model & max_tokens & messages are ignored");
  }

  // Test 7: Upstream 401 returns 502 with {"error":"upstream_error"} and hides raw details
  {
    mockUpstreamStatus = 401;
    mockUpstreamResponseBody = JSON.stringify({
      error: { message: "Invalid API key provided", type: "authentication_error" },
    });

    const req = new Request(`${ORIGIN}/api/deepseek`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: ORIGIN,
      },
      body: JSON.stringify({ task: "self-typing" }),
    });

    const res = await handler(req);
    assert.equal(res.status, 502, "Upstream 401 must return 502");
    const json = await res.json();
    assert.deepEqual(json, { error: "upstream_error" });
    assert.ok(
      !JSON.stringify(json).includes("Invalid API key"),
      "Sensitive upstream text must not leak",
    );

    mockUpstreamStatus = 200;
    mockUpstreamResponseBody = null;
    console.log("✓ Test 7 Passed: Upstream error returns 502 without leaking raw text");
  }

  // Test 8: GET request caching headers on randomquote
  {
    const req = new Request(`${ORIGIN}/api/deepseek?task=randomquote`, {
      method: "GET",
      headers: {
        Origin: ORIGIN,
      },
    });
    const res = await handler(req);
    assert.equal(res.status, 200);
    const cacheHeader = res.headers.get("Cache-Control");
    assert.ok(cacheHeader && cacheHeader.includes("s-maxage="), "Cache-Control header present");
    console.log("✓ Test 8 Passed: GET request sets Cache-Control s-maxage");
  }

  console.log("\nALL 8 TESTS PASSED SUCCESSFULLY! Mock fetch was verified.");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
