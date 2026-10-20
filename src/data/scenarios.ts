import { IncidentScenario } from '../types/incident';

export const ENTERPRISE_SCENARIOS: IncidentScenario[] = [
  {
    id: 'auth-jwt-bypass',
    title: 'JWT Secret Bypass & Missing Key Verification',
    service: 'auth-service',
    category: 'Security & DevSecOps',
    status: 'CRITICAL',
    environment: 'production',
    description: 'Authentication token parser accepts empty algorithm or unsigned header, causing unauthorized privilege escalation.',
    expectedFile: 'src/services/auth_service.py',
    expectedLine: 42,
    sampleLogs: `2026-10-19T21:14:02.194Z [CRITICAL] [auth-service] [worker-pool-3]
SecurityException: Insecure token parsing detected on /api/v1/user/elevate
Traceback (most recent call last):
  File "/app/src/api/routes.py", line 118, in handle_request
    claims = verify_bearer_token(request.headers.get("Authorization"))
  File "/app/src/services/auth_service.py", line 42, in verify_bearer_token
    payload = jwt.decode(token, key="", algorithms=["none", "HS256"], options={"verify_signature": False if allow_unsigned else True})
jwt.exceptions.InvalidTokenError: Signature verification bypassed via insecure algorithm flag. Attacker exploited CVE-pattern token manipulation.
  File "/app/src/middleware/guard.py", line 33, in dispatch
    return await next(ctx)
2026-10-19T21:14:02.199Z [ALERT] [WAF-GCP] Anomalous privilege escalation attempt from IP 198.51.100.44 targeted /admin/billing`
  },
  {
    id: 'pg-pool-exhaustion',
    title: 'PostgreSQL Connection Pool Starvation & Timeout',
    service: 'billing-api',
    category: 'Cloud Microservices',
    status: 'CRITICAL',
    environment: 'production',
    description: 'Database connection leaks in payment webhook handler exhaust client pool, causing 504 Gateway Timeouts across billing.',
    expectedFile: 'src/db/connection_pool.ts',
    expectedLine: 74,
    sampleLogs: `2026-10-19T21:18:44.201Z [ERROR] [billing-api] [pid:4812] [trace:7a9f82bc]
Error: Connection pool timeout after 10000ms. All 50 connections checked out and unreleased.
    at Pool.acquire (/app/node_modules/pg-pool/index.js:312:19)
    at Object.executeTransaction (/app/src/db/connection_pool.ts:74:28)
    at PaymentService.processStripeWebhook (/app/src/services/payment.ts:189:22)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
2026-10-19T21:18:44.305Z [WARN] [Kubernetes-kubelet] Pod billing-api-7c4d8b9d64-x9qzp readiness probe failed: HTTP 503 Service Unavailable
2026-10-19T21:18:44.890Z [ERROR] [Nginx-Ingress] upstream timed out (110: Connection timed out) while connecting to upstream, client: 203.0.113.195, request: "POST /webhook/stripe HTTP/1.1", upstream: "http://10.244.2.14:3000/webhook/stripe"`
  },
  {
    id: 'k8s-oom-leak',
    title: 'Kubernetes OOMKilled Pod & Batch Memory Leak',
    service: 'data-pipeline-worker',
    category: 'Cloud Microservices',
    status: 'CRITICAL',
    environment: 'production',
    description: 'Pandas data aggregator builds unbounded global in-memory buffer without batch clearing, leading to kernel OOM kill.',
    expectedFile: 'src/services/data_worker.py',
    expectedLine: 128,
    sampleLogs: `2026-10-19T21:20:11.890Z [INFO] [k8s-controller] Pod data-worker-batch-86bf547d-m2kqw container 'worker' terminated with exit code 137 (OOMKilled)
2026-10-19T21:20:10.144Z [WARNING] [data-worker] Memory usage at 98.4% (3.94GB / 4.00GB limit)
Traceback (most recent call last):
  File "/app/src/main.py", line 45, in consume_kafka_topic
    process_batch_records(records)
  File "/app/src/services/data_worker.py", line 128, in process_batch_records
    GLOBAL_EVENT_CACHE.extend([r.to_dict() for r in records]) # Unbounded cache accumulation without eviction
MemoryError: Unable to allocate 256 MiB for array with shape (16384, 2048) and data type float64
2026-10-19T21:20:12.002Z [ERROR] [kubelet] Restarting container worker in pod data-worker-batch-86bf547d-m2kqw (restart count: 4)`
  },
  {
    id: 'sql-injection-vuln',
    title: 'SQL Injection via Unsanitized Query Parameter',
    service: 'user-management-svc',
    category: 'Security & DevSecOps',
    status: 'CRITICAL',
    environment: 'production',
    description: 'Raw SQL query string interpolation allows SQL injection in account search endpoint.',
    expectedFile: 'src/repositories/user_repo.py',
    expectedLine: 63,
    sampleLogs: `2026-10-19T21:22:15.654Z [ERROR] [user-svc] psycopg2.errors.SyntaxError: syntax error at or near "UNION"
LINE 1: SELECT * FROM accounts WHERE tenant_id = 't_99' AND username = '' UNION SELECT id, password_hash, token FROM superadmins--'
Traceback (most recent call last):
  File "/app/src/controllers/account.py", line 87, in search_users
    users = user_repo.find_by_username(tenant_id, query_str)
  File "/app/src/repositories/user_repo.py", line 63, in find_by_username
    cursor.execute(f"SELECT * FROM accounts WHERE tenant_id = '{tenant_id}' AND username = '{query_str}'")
psycopg2.errors.SyntaxError: unescaped SQL syntax injection detected in cursor execution.
2026-10-19T21:22:15.659Z [SECURITY-AGENT] High severity exploit payload pattern detected matching OWASP A03:2021-Injection.`
  },
  {
    id: 'checkout-null-pointer',
    title: 'Unhandled Null Reference in Payment Totals Calculation',
    service: 'checkout-gateway',
    category: 'REST API 500',
    status: 'WARNING',
    environment: 'production',
    description: 'Missing optional chaining on promotion discounts throws unhandled TypeError, failing 12% of customer checkouts.',
    expectedFile: 'src/controllers/checkout.ts',
    expectedLine: 114,
    sampleLogs: `2026-10-19T21:24:33.002Z [ERROR] [checkout-gateway] [HTTP 500] POST /api/v2/orders/calculate-total
TypeError: Cannot read properties of undefined (reading 'discountAmount')
    at calculateTaxAndDiscounts (/app/src/controllers/checkout.ts:114:48)
    at OrderController.submitOrder (/app/src/controllers/checkout.ts:165:19)
    at Layer.handle [as handle_request] (/app/node_modules/express/lib/router/layer.js:95:5)
    at next (/app/node_modules/express/lib/router/route.js:144:13)
2026-10-19T21:24:33.010Z [WARN] [Datadog-APM] Synthetic test 'Checkout Flow EU-West' reported 500 Internal Server Error (Duration: 84ms)`
  },
  {
    id: 'asyncio-deadlock',
    title: 'Python Asyncio Lock Starvation & Thread Deadlock',
    service: 'order-dispatcher',
    category: 'Cloud Microservices',
    status: 'WARNING',
    environment: 'staging',
    description: 'Non-reentrant async lock acquired recursively in retry block blocks the event loop indefinitely.',
    expectedFile: 'src/workers/dispatch.py',
    expectedLine: 95,
    sampleLogs: `2026-10-19T21:25:01.321Z [WARNING] [order-dispatcher] Event loop heartbeat blocked for 12.8 seconds!
Traceback (most recent call last):
  File "/app/src/workers/dispatch.py", line 95, in process_dispatch_queue
    async with self._lock:  # Re-acquiring non-reentrant asyncio.Lock within retry loop
TimeoutError: Task <Task pending name='dispatch_task_902' coro=<process_dispatch_queue() running at /app/src/workers/dispatch.py:95>> wait for <Lock [locked, waiters:14]> took longer than 10.0s
2026-10-19T21:25:02.100Z [CRITICAL] [Prometheus] Alert 'MicroserviceEventLoopBlocked' firing for service order-dispatcher (cluster: us-central1-k8s)`
  }
];

export const CHAOS_SIMULATIONS = [
  {
    id: 'chaos-k8s-pod',
    label: 'Kubernetes Pod OOMKilled Outage',
    icon: 'Cpu',
    severity: 'CRITICAL',
    description: 'Trigger memory saturation in container batch worker to simulate cluster node eviction.',
    scenarioId: 'k8s-oom-leak'
  },
  {
    id: 'chaos-auth-bypass',
    label: 'Zero-Day Auth Token Exploit Injection',
    icon: 'ShieldAlert',
    severity: 'CRITICAL',
    description: 'Simulate high-risk CVE unauthorized JWT payload bypass attacking the core auth gateway.',
    scenarioId: 'auth-jwt-bypass'
  },
  {
    id: 'chaos-pg-pool',
    label: 'Postgres Connection Pool Starvation',
    icon: 'Database',
    severity: 'CRITICAL',
    description: 'Flood connection pool without client release to simulate cascading upstream 504 timeouts.',
    scenarioId: 'pg-pool-exhaustion'
  },
  {
    id: 'chaos-sqli',
    label: 'SQL Injection Breach on User API',
    icon: 'Terminal',
    severity: 'CRITICAL',
    description: 'Inject malicious union-based SQL escape query to trigger immediate WAF & DevSecOps alert.',
    scenarioId: 'sql-injection-vuln'
  },
  {
    id: 'chaos-checkout-500',
    label: 'E-Commerce Checkout 500 Crash',
    icon: 'AlertTriangle',
    severity: 'WARNING',
    description: 'Fire corrupted discount payload to trigger unhandled TypeError in production order flow.',
    scenarioId: 'checkout-null-pointer'
  }
];
