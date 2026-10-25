// Comprehensive Automated Verification Suite for RouteVector
async function runTests() {
  const BASE_URL = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  console.log('\n--- RouteVector Automated Verification Suite ---\n');

  // Test 1: Fetch links
  try {
    const res = await fetch(`${BASE_URL}/api/links`);
    const json = await res.json();
    assert(json.success === true && Array.isArray(json.data), 'GET /api/links returns valid links array');
  } catch (e) {
    assert(false, `GET /api/links failed: ${e.message}`);
  }

  // Test 2: Validation - missing URL
  try {
    const res = await fetch(`${BASE_URL}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination_url: '' }),
    });
    const json = await res.json();
    assert(res.status === 400 && json.success === false, 'POST /api/links rejects empty URL (400)');
  } catch (e) {
    assert(false, `Empty URL test failed: ${e.message}`);
  }

  // Test 3: Validation - dangerous protocol
  try {
    const res = await fetch(`${BASE_URL}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination_url: 'javascript:alert(1)' }),
    });
    const json = await res.json();
    assert(res.status === 400 && json.error.includes('unsafe'), 'POST /api/links rejects javascript: protocol (400)');
  } catch (e) {
    assert(false, `Protocol check failed: ${e.message}`);
  }

  // Test 4: Create valid short link with generated code
  let generatedCode = '';
  try {
    const res = await fetch(`${BASE_URL}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination_url: 'https://news.ycombinator.com' }),
    });
    const json = await res.json();
    generatedCode = json.data?.code;
    assert(
      res.status === 201 && json.success === true && generatedCode && generatedCode.length >= 6,
      `POST /api/links creates short link with random code "${generatedCode}"`
    );
  } catch (e) {
    assert(false, `Create link failed: ${e.message}`);
  }

  // Test 5: Create short link with custom code
  const customCode = `demo-${Date.now().toString().slice(-4)}`;
  let customLinkId = '';
  try {
    const res = await fetch(`${BASE_URL}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination_url: 'https://supabase.com',
        custom_code: customCode,
        title: 'Supabase Website',
      }),
    });
    const json = await res.json();
    customLinkId = json.data?.id;
    assert(
      res.status === 201 && json.data?.code === customCode && json.data?.clicks_count === 0,
      `POST /api/links creates link with custom code "${customCode}"`
    );
  } catch (e) {
    assert(false, `Custom slug creation failed: ${e.message}`);
  }

  // Test 6: Duplicate code collision prevention
  try {
    const res = await fetch(`${BASE_URL}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination_url: 'https://google.com',
        custom_code: customCode,
      }),
    });
    const json = await res.json();
    assert(
      res.status === 409 && json.success === false && json.error.includes('already'),
      'POST /api/links detects collision and returns 409 Conflict'
    );
  } catch (e) {
    assert(false, `Collision detection failed: ${e.message}`);
  }

  // Test 7: Redirect route /go/:code returns 307 to destination and sets no-cache
  try {
    const res = await fetch(`${BASE_URL}/go/${customCode}`, {
      redirect: 'manual',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://twitter.com/supabase/status/12345',
      },
    });

    const location = res.headers.get('location');
    const cacheControl = res.headers.get('cache-control');
    const trackingStatus = res.headers.get('x-tracking-status');

    assert(
      res.status === 307 && location === 'https://supabase.com/' && cacheControl?.includes('no-cache'),
      `GET /go/${customCode} returns HTTP 307 redirect to "${location}" with no-cache header`
    );
    assert(
      trackingStatus === 'recorded',
      `Click tracking status header is "${trackingStatus}"`
    );
  } catch (e) {
    assert(false, `Redirect test failed: ${e.message}`);
  }

  // Test 8: Verify click was recorded and details reflect metadata
  try {
    const res = await fetch(`${BASE_URL}/api/links/${customLinkId}`);
    const json = await res.json();
    const link = json.data?.link;
    const clicks = json.data?.clicks;
    const firstClick = clicks?.[0];

    assert(
      link?.clicks_count === 1,
      `Link clicks_count atomically incremented to 1 (was ${link?.clicks_count})`
    );
    assert(
      firstClick?.referer === 'X / Twitter' && firstClick?.device === 'Desktop' && firstClick?.browser === 'Google Chrome',
      `Click event recorded metadata: Referrer="${firstClick?.referer}", Device="${firstClick?.device}", Browser="${firstClick?.browser}"`
    );
  } catch (e) {
    assert(false, `Click audit verification failed: ${e.message}`);
  }

  // Test 9: Unknown short code returns 303 to /not-found?code=...
  try {
    const res = await fetch(`${BASE_URL}/go/nonexistent-code-999`, {
      redirect: 'manual',
    });
    const loc = res.headers.get('location');
    assert(
      res.status === 303 && loc?.includes('/not-found?code=nonexistent-code-999'),
      `Unknown code gracefully redirects to /not-found (HTTP ${res.status}, Location: ${loc})`
    );
  } catch (e) {
    assert(false, `Unknown code 404 test failed: ${e.message}`);
  }

  // Test 10: Aggregated analytics API reflects recorded clicks
  try {
    const res = await fetch(`${BASE_URL}/api/analytics`);
    const json = await res.json();
    const analytics = json.data;

    assert(
      analytics?.totalClicks >= 1 && analytics?.clicksTrend?.length === 7 && analytics?.referrers?.length > 0,
      `GET /api/analytics returns 7-day trend (${analytics?.clicksTrend?.length} days) and real totals (Total Clicks: ${analytics?.totalClicks})`
    );
  } catch (e) {
    assert(false, `Analytics verification failed: ${e.message}`);
  }

  // Test 11: Delete link removes record and its clicks
  try {
    const res = await fetch(`${BASE_URL}/api/links/${customLinkId}`, {
      method: 'DELETE',
    });
    const json = await res.json();
    assert(res.status === 200 && json.success === true, `DELETE /api/links/${customLinkId} successfully removed link`);

    // Verify it is now gone
    const checkRes = await fetch(`${BASE_URL}/api/links/${customLinkId}`);
    assert(checkRes.status === 404, 'Deleted link now returns 404');
  } catch (e) {
    assert(false, `Delete link verification failed: ${e.message}`);
  }

  console.log(`\n========================================`);
  console.log(`Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
