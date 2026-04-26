import { hero, panel } from './contentBuilders';

export const advancedViews = [
  {
    id: 'decision-guide',
    title: 'Decision guide',
    navLabel: 'Decision guide',
    sections: [
      hero(
        'Choose the right design tool for the job',
        ['Granular', 'Interactive', 'Spring Boot ready', 'Android ready'],
        `
          <p>This page answers the practical questions teams ask during implementation: <strong>where should this object live?</strong>, <strong>who should create it?</strong>, <strong>which parts should be public?</strong>, and <strong>which parts should stay hidden?</strong></p>
          <div class="good">
            <div class="callout-title">Mental model</div>
            <div>Use public APIs to describe business capabilities. Use composition roots and DI modules to decide assembly. Use hidden adapters and stores to keep risky details behind the boundary.</div>
          </div>
        `
      ),
      panel('Interactive pipeline: where each decision belongs', `
        <p>Tap each node to see <strong>what belongs there</strong>, <strong>how it should be used</strong>, and <strong>what not to put there</strong>.</p>
        <div class="diagram" data-diagram-group="decision-pipeline">
          <div class="diagram-stage">
            <div class="kicker">Implementation pipeline</div>
            <div class="diagram-grid cols-3">
              <button class="diagram-node active" data-diagram-target="boundary"><strong>Boundary input</strong><small>controller / route / UI event</small></button>
              <button class="diagram-node" data-diagram-target="public-api"><strong>Public API</strong><small>use case / service interface</small></button>
              <button class="diagram-node" data-diagram-target="feature"><strong>Feature bundle</strong><small>shared graph entry point</small></button>
              <button class="diagram-node" data-diagram-target="root"><strong>Composition root</strong><small>manual assembly</small></button>
              <button class="diagram-node" data-diagram-target="container"><strong>DI module / container</strong><small>lifetime rules</small></button>
              <button class="diagram-node" data-diagram-target="adapters"><strong>Adapters</strong><small>gateway / repository / logger</small></button>
              <button class="diagram-node" data-diagram-target="state"><strong>State + storage</strong><small>shared store / db / cache</small></button>
              <button class="diagram-node" data-diagram-target="testing"><strong>Testing seam</strong><small>replace at the edge</small></button>
              <button class="diagram-node" data-diagram-target="dont"><strong>What not to do</strong><small>service locator / leaking internals</small></button>
            </div>
          </div>
          <div class="diagram-info">
            <div class="diagram-panel active" data-diagram-panel="boundary">
              <h3>Boundary input</h3>
              <p>This is where controllers, HTTP handlers, message listeners, or UI click handlers receive raw input and convert it into a clean request model. Concretely: turn JSON, form data, click events, or worker input into a business-shaped request object.</p>
              <p><strong>Backend mapping:</strong> <code>@RestController</code>, Kafka listener, scheduled job entry point. <strong>Android mapping:</strong> Composable click handler, Fragment callback, deep-link entry, or Worker input adapter.</p>
              <ul>
                <li><strong>Put here:</strong> validation, request mapping, authentication context, DTO-to-domain translation.</li>
                <li><strong>Do not put here:</strong> gateway construction, database wiring, container lookups, low-level retry logic.</li>
              </ul>
            </div>
            <div class="diagram-panel" data-diagram-panel="public-api">
              <h3>Public API</h3>
              <p>The public API should express a business action such as <code>charge(request)</code>, <code>placeOrder()</code>, or <code>showReceipts()</code>. Read this as the sentence the rest of the app is allowed to say.</p>
              <p><strong>Backend mapping:</strong> application service or use-case interface. <strong>Android mapping:</strong> use case/interactor called from a ViewModel or feature facade.</p>
              <ul>
                <li><strong>Use when:</strong> you want callers to ask for a business capability, not infrastructure.</li>
                <li><strong>Avoid:</strong> public methods that require callers to pass repositories, gateways, or secret-bearing clients.</li>
              </ul>
            </div>
            <div class="diagram-panel" data-diagram-panel="feature">
              <h3>Feature bundle</h3>
              <p>Bundle multiple public capabilities together when they must share the same hidden graph, such as one write side and one read side backed by the same store. The bundle is the safe package the caller receives, not the hidden machinery itself.</p>
              <p><strong>Backend mapping:</strong> a facade bean exposing related use cases from one module. <strong>Android mapping:</strong> a feature-scoped API/facade used by a navigation graph, screen flow, or module boundary.</p>
              <ul>
                <li><strong>Great for:</strong> checkout + receipt history, send message + load thread, create order + query order history.</li>
                <li><strong>Do not use for:</strong> unrelated services that happen to live in the same project.</li>
              </ul>
            </div>
            <div class="diagram-panel" data-diagram-panel="root">
              <h3>Composition root</h3>
              <p>This is the program edge where you choose implementations and connect dependencies together. It is the best place to learn DI because the graph is visible: one local variable here, one shared object there, one policy choice in the middle.</p>
              <p><strong>Backend mapping:</strong> startup wiring or <code>@Configuration</code> module. <strong>Android mapping:</strong> Hilt module, manual app graph, or feature-assembly object.</p>
              <ul>
                <li><strong>Put here:</strong> environment decisions, factory calls, assembly order, feature creation.</li>
                <li><strong>Do not put here:</strong> request-specific business logic that belongs in use cases.</li>
              </ul>
            </div>
            <div class="diagram-panel" data-diagram-panel="container">
              <h3>DI module / container</h3>
              <p>Use a container when graph size, repetition, and lifetime rules are becoming hard to manage manually. Think of it as a registry of recipes and reuse rules rather than as magic object teleportation.</p>
              <p><strong>Backend mapping:</strong> Spring bean registrations, scopes, and modules. <strong>Android mapping:</strong> Hilt/Koin bindings plus component scopes like singleton, activity, or ViewModel.</p>
              <ul>
                <li><strong>Good for:</strong> singleton vs transient, platform modules, test swapping, consistent wiring.</li>
                <li><strong>Bad if:</strong> business classes call it directly everywhere and hide their dependencies again.</li>
              </ul>
            </div>
            <div class="diagram-panel" data-diagram-panel="adapters">
              <h3>Adapters</h3>
              <p>Gateways, repositories, HTTP clients, SDK wrappers, and loggers belong behind the public API. They translate business intent into infrastructure calls such as SQL, HTTP, SDK commands, file access, or telemetry writes.</p>
              <p><strong>Backend mapping:</strong> JPA repositories, provider SDK wrappers, HTTP clients, outbox publishers. <strong>Android mapping:</strong> Retrofit APIs, DAOs, Room mappers, SDK wrappers, notification/channel adapters.</p>
              <ul>
                <li><strong>Keep hidden when possible:</strong> payment gateways, cloud SDK details, ORM-specific code.</li>
                <li><strong>Expose publicly only if:</strong> the outside world truly needs the abstraction.</li>
              </ul>
            </div>
            <div class="diagram-panel" data-diagram-panel="state">
              <h3>State + storage</h3>
              <p>Shared state is often the real reason features need careful DI. If two services must observe the same history, they must share the same repository, store, transaction, or cache context. This is where many “why do I need a bundle?” questions finally become concrete.</p>
              <p><strong>Backend mapping:</strong> transaction-bound repository, shared cache, outbox, persistent store. <strong>Android mapping:</strong> Room database, DAO-backed cache, DataStore, in-memory feature cache, or ViewModel-held draft state.</p>
              <ul>
                <li><strong>Watch for:</strong> accidental duplicate stores, scope mismatch, stale caches, multi-threaded access.</li>
                <li><strong>Design question:</strong> should this state be request-scoped, feature-scoped, singleton, or persistent?</li>
              </ul>
            </div>
            <div class="diagram-panel" data-diagram-panel="testing">
              <h3>Testing seam</h3>
              <p>The best seam is usually the composition root edge. Swap adapters there, not deep inside business classes. In practice, that means replacing the repository, gateway, logger, clock, or dispatcher before the feature graph is handed to the code under test.</p>
              <p><strong>Backend mapping:</strong> fake repository/gateway in unit tests or module overrides in Spring slices. <strong>Android mapping:</strong> fake repository, fake DAO/API, fake dispatcher, and test Hilt modules for ViewModel/use-case tests.</p>
              <ul>
                <li><strong>Use:</strong> fake repositories, sandbox gateways, test modules, stub clocks, fake dispatchers.</li>
                <li><strong>Avoid:</strong> hidden container lookups that make tests patch global state.</li>
              </ul>
            </div>
            <div class="diagram-panel" data-diagram-panel="dont">
              <h3>What not to do</h3>
              <p><strong>Backend smell:</strong> controller reaches for Spring context or raw SDK clients. <strong>Android smell:</strong> ViewModel/Composable reaches for Retrofit, DAO, or the whole DI graph directly.</p>
              <ul>
                <li>Do not let controllers choose gateway implementations.</li>
                <li>Do not inject the whole container or application context into use cases.</li>
                <li>Do not make sensitive extension points public just because mocking is convenient.</li>
                <li>Do not bundle unrelated services into one mega-feature.</li>
                <li>Do not assume “singleton” is always correct for stateful objects.</li>
              </ul>
            </div>
          </div>
        </div>
      `),
      panel('Which tool solves which problem?', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Tool</th><th>Use it when</th><th>Why it helps</th><th>Do not use it when</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>data class</code> request/response</td>
                <td>You need stable input/output models</td>
                <td>Separates transport/data from behavior</td>
                <td>You are trying to hide infrastructure or behavior inside it</td>
              </tr>
              <tr>
                <td>Public service interface</td>
                <td>Callers need one business capability</td>
                <td>Protects callers from implementation churn</td>
                <td>The implementation detail is actually the thing callers should never touch</td>
              </tr>
              <tr>
                <td>Feature bundle</td>
                <td>Several public capabilities must share one hidden graph</td>
                <td>Makes shared state explicit and safe</td>
                <td>The services are unrelated and only grouped for convenience</td>
              </tr>
              <tr>
                <td>Manual composition root</td>
                <td>The graph is still readable by hand</td>
                <td>Best for learning, clarity, small/medium graphs</td>
                <td>You keep copy-pasting the same wiring across many modules</td>
              </tr>
              <tr>
                <td>DI container / module</td>
                <td>You need repeatable registrations and lifetimes</td>
                <td>Centralizes assembly policy</td>
                <td>It turns into a service locator used directly from business code</td>
              </tr>
              <tr>
                <td>Private/internal adapter</td>
                <td>The plug-in point is sensitive or easy to misuse</td>
                <td>Harder to bypass with arbitrary implementations</td>
                <td>Third parties genuinely need to implement it across module boundaries</td>
              </tr>
              <tr>
                <td>Repository / store abstraction</td>
                <td>Read/write code should not know storage details</td>
                <td>Lets you swap DB/cache/file/in-memory storage at the edge</td>
                <td>The abstraction adds no value and only mirrors one concrete class</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Questions to ask before coding', `
        <div class="tabs" data-tab-group="decision-questions">
          <button class="tab-btn active" data-tab="all">All platforms</button>
          <button class="tab-btn" data-tab="spring">Spring Boot</button>
          <button class="tab-btn" data-tab="android">Android</button>
        </div>
        <div class="tab-content active" data-tab-panel="all">
          <ul>
            <li>Which types are safe to expose publicly, and which must stay hidden?</li>
            <li>What state must be shared, and for how long?</li>
            <li>Will callers need one capability or a bundle of related capabilities?</li>
            <li>Where will I swap real adapters for sandbox, fake, or test adapters?</li>
            <li>Which parts should be easy to inspect in logs, and which values must be redacted?</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="spring">
          <ul>
            <li>Should this bean be singleton, request-scoped, prototype, or transaction-bound?</li>
            <li>Does this service actually need Spring, or can it stay plain Kotlin/Java?</li>
            <li>Should the controller receive a feature facade instead of several infrastructure beans?</li>
            <li>Is the repository boundary expressing business needs or leaking ORM details?</li>
            <li>How will I test this without loading the whole application context?</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="android">
          <ul>
            <li>Does this belong in a ViewModel, use case, repository, or data source?</li>
            <li>What should survive configuration changes, and what should be recreated?</li>
            <li>Should this dependency live in the app graph, activity graph, or ViewModel graph?</li>
            <li>Is the UI state holder depending on an abstraction or directly on Retrofit/Room?</li>
            <li>How will offline cache, sync, and background work share data safely?</li>
          </ul>
        </div>
      `),
      panel('Architecture design studio: solve the scenario before reading the answer', `
        <div class="tabs" data-tab-group="architecture-studio">
          <button class="tab-btn active" data-tab="backend">Backend fraud-review feature</button>
          <button class="tab-btn" data-tab="android">Android order-tracking feature</button>
          <button class="tab-btn" data-tab="solution">Worked solution</button>
        </div>
        <div class="tab-content active" data-tab-panel="backend">
          <p>You need a backend fraud-review feature with these needs: an HTTP controller, a review use case, a case repository, a provider adapter, and an audit log. Reviews and later history queries must share the same stored state.</p>
          <ul>
            <li>Which parts should be public?</li>
            <li>Which parts should stay hidden?</li>
            <li>Where should provider choice live?</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="android">
          <p>You need an Android order-tracking feature with a screen, ViewModel, tracking use case, repository, Room cache, Retrofit API, and a background refresh worker.</p>
          <ul>
            <li>What state belongs in the ViewModel?</li>
            <li>What logic belongs in the repository?</li>
            <li>What should the worker reuse instead of duplicating?</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="solution">
          <div class="timeline">
            <div class="step"><strong>1.</strong> Public side: expose a business capability such as <code>ReviewCaseService</code> or <code>TrackOrderFeature</code>, not provider SDKs or database details.</div>
            <div class="step"><strong>2.</strong> Hidden side: keep repositories, provider adapters, Room/Retrofit details, and logging implementations behind the application boundary.</div>
            <div class="step"><strong>3.</strong> Shared state side: if write and read flows must agree, they should share one repository/store graph deliberately.</div>
            <div class="step"><strong>4.</strong> Assembly side: provider choice belongs in the composition root, factory, or DI module, not in controllers, Composables, or ViewModels.</div>
            <div class="step"><strong>5.</strong> Reuse side: the Android worker should reuse repository or use-case logic, while the backend should reuse the same application service from controllers and jobs where appropriate.</div>
          </div>
          <div class="note">
            <div class="callout-title">Mastery takeaway</div>
            <div>If you can redraw both features as boundary → public API → hidden adapters → shared state → composition root, you are no longer memorizing DI terms. You are using them as an architecture language.</div>
          </div>
        </div>
      `)
    ]
  },
  {
    id: 'real-life-scenarios',
    title: 'Real-life scenarios',
    navLabel: 'Real-life scenarios',
    sections: [
      panel('Where these patterns fit in production', `
        <div class="grid grid-3">
          <div class="card">
            <div class="key">Payments backend</div>
            <p>Use a public payment use case, hide payment-provider adapters, and keep idempotency, persistence, and logging policy at the edge.</p>
          </div>
          <div class="card">
            <div class="key">Order management</div>
            <p>Expose <code>PlaceOrder</code> and <code>OrderHistoryQuery</code> as separate use cases that share the same repository and transaction boundaries.</p>
          </div>
          <div class="card">
            <div class="key">Messaging</div>
            <p>Bundle <code>SendMessage</code> and <code>LoadConversation</code> when they must share the same local cache, sync policy, and identity context.</p>
          </div>
          <div class="card">
            <div class="key">Notifications</div>
            <p>Hide FCM/APNs/provider SDK details behind a public notification feature that decides channels, retries, and redaction internally.</p>
          </div>
          <div class="card">
            <div class="key">Subscriptions</div>
            <p>Use a feature bundle for billing write side, entitlement read side, and webhook reconciliation so the same business rules are reused.</p>
          </div>
          <div class="card">
            <div class="key">Offline-first mobile</div>
            <p>Share one repository between local cache, network sync, and ViewModel-facing queries so the UI sees a consistent state story.</p>
          </div>
        </div>
      `),
      panel('Scenario workshop', `
        <div class="tabs" data-tab-group="scenario-workshop">
          <button class="tab-btn active" data-tab="checkout">Checkout API</button>
          <button class="tab-btn" data-tab="subscription">Subscription platform</button>
          <button class="tab-btn" data-tab="android-offline">Android offline sync</button>
          <button class="tab-btn" data-tab="worker">Background worker</button>
        </div>
        <div class="tab-content active" data-tab-panel="checkout">
          <div class="good">
            <div class="callout-title">Best fit</div>
            <div>Controller → public use case → hidden gateway/repository/logger → response mapper.</div>
          </div>
          <ul>
            <li><strong>Use:</strong> when external provider choice, retries, and secrets must be centralized.</li>
            <li><strong>Share:</strong> request validation, idempotency key handling, transaction boundary, receipt persistence.</li>
            <li><strong>Avoid:</strong> letting the controller decide Stripe vs PayPal vs sandbox.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="subscription">
          <div class="good"><div class="callout-title">Best fit</div><div>Bundle recurring billing commands, entitlement queries, and webhook reconciliation under one feature boundary.</div></div>
          <ul>
            <li><strong>Use:</strong> when several flows must agree on the same subscription state and billing rules.</li>
            <li><strong>Share:</strong> store, clock, event publisher, and provider mapping logic.</li>
            <li><strong>Avoid:</strong> duplicating entitlement logic inside mobile, backend, and admin jobs separately.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="android-offline">
          <div class="good"><div class="callout-title">Best fit</div><div>ViewModel → use case → repository → local cache + remote data source + sync coordinator.</div></div>
          <ul>
            <li><strong>Use:</strong> when the UI must keep working while offline.</li>
            <li><strong>Share:</strong> one repository abstraction, conflict strategy, and cache invalidation policy.</li>
            <li><strong>Avoid:</strong> having the ViewModel call Room and Retrofit directly with duplicated mapping logic.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="worker">
          <div class="good"><div class="callout-title">Best fit</div><div>Job runner / scheduler → application service → hidden adapters for external systems and durable state.</div></div>
          <ul>
            <li><strong>Use:</strong> for webhook retries, nightly reconciliation, report generation, email digests.</li>
            <li><strong>Share:</strong> configuration, retry policy, repository, event publisher, metrics.</li>
            <li><strong>Avoid:</strong> packing every job into one giant “UtilitiesService”.</li>
          </ul>
        </div>
      `),
      panel('Applicability matrix', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Real-life case</th><th>Public API should look like</th><th>Hidden internals should include</th><th>Why a feature bundle may help</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Checkout + receipts</td>
                <td><code>CheckoutService</code> + <code>ReceiptQueryService</code></td>
                <td>Gateway, receipt repository, logger, id generator</td>
                <td>Shared store/history must stay consistent</td>
              </tr>
              <tr>
                <td>Orders + order history</td>
                <td><code>PlaceOrder</code> + <code>OrderHistoryQuery</code></td>
                <td>Inventory adapter, payment adapter, order store</td>
                <td>One business graph owns order state</td>
              </tr>
              <tr>
                <td>Chat send + thread load</td>
                <td><code>SendMessage</code> + <code>ConversationQuery</code></td>
                <td>Socket/api adapter, cache, sync engine</td>
                <td>Send + read must share cache and sync policy</td>
              </tr>
              <tr>
                <td>Admin reports</td>
                <td><code>ReportGenerator</code></td>
                <td>Repository, exporter, scheduler adapter</td>
                <td>Usually no bundle needed unless several report views share state</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Build-it-yourself scenario set', `
        <p>Use these as practice prompts for your own codebase. The idea is to force translation, not just recognition.</p>
        <details>
          <summary>Scenario 1: shipping backend</summary>
          <p><strong>Task:</strong> Design a shipping feature with <code>CreateShipment</code> and <code>ShipmentHistoryQuery</code>. Decide what should be public, what should be hidden, and whether a feature bundle helps.</p>
          <p><strong>Suggested answer:</strong> Publicly expose the two business capabilities or a small shipping feature facade. Hide carrier clients, label printers, persistence, and telemetry adapters. Use a feature bundle if creation and history must share the same shipment store and policy graph.</p>
        </details>
        <details>
          <summary>Scenario 2: Android chat feature</summary>
          <p><strong>Task:</strong> Design a chat screen with send-message and load-thread flows, offline cache, and background sync.</p>
          <p><strong>Suggested answer:</strong> UI renders state, ViewModel orchestrates, use cases express send/load actions, repository owns local/remote sync, and the worker reuses that repository logic. A feature facade can help if multiple entry points must share one chat graph.</p>
        </details>
        <details>
          <summary>Scenario 3: admin reporting job</summary>
          <p><strong>Task:</strong> Decide whether you need only a factory, or a broader feature/container approach.</p>
          <p><strong>Suggested answer:</strong> If the main issue is picking one exporter implementation, a factory may be enough. If the reporting job also needs repositories, clocks, metrics, retry policy, and shared writer state, you have moved into composition-root/container territory.</p>
        </details>
      `),
      panel('Quick exercise: translate one scenario into backend and Android language', `
        <p>Pick any scenario above and answer these two questions before reading on:</p>
        <ol>
          <li>What is the <strong>backend boundary</strong>, public API, hidden adapter set, and shared state owner?</li>
          <li>What is the <strong>Android boundary</strong>, ViewModel/use-case/repository chain, DAO/API boundary, and worker/background reuse story?</li>
        </ol>
        <details>
          <summary>Why this exercise matters</summary>
          <p>If you can translate the same feature into both backend and Android architecture words, you are learning the underlying design job instead of memorizing framework vocabulary only.</p>
        </details>
      `)
    ]
  },
  {
    id: 'anti-patterns',
    title: 'Mistakes and anti-patterns',
    navLabel: 'Anti-patterns',
    sections: [
      panel('Common mistakes that make DI feel harder than it is', `
        <div class="grid grid-3">
          <div class="warn">
            <div class="callout-title">Service locator creep</div>
            <div>Business classes start reaching into the container directly. Dependencies become hidden again and tests become harder.</div>
          </div>
          <div class="warn">
            <div class="callout-title">Leaking sensitive adapters</div>
            <div>External callers can choose or implement payment/cloud adapters that should have remained hidden.</div>
          </div>
          <div class="warn">
            <div class="callout-title">One giant god service</div>
            <div>Reads, writes, orchestration, mapping, caching, retries, and platform glue all end up in one class.</div>
          </div>
          <div class="warn">
            <div class="callout-title">Wrong lifetime</div>
            <div>A stateful store or cache is made transient by accident, so one action writes data another action cannot see.</div>
          </div>
          <div class="warn">
            <div class="callout-title">Mocking by exposing internals</div>
            <div>A dangerous type becomes public only to make tests easier, which weakens the design boundary.</div>
          </div>
          <div class="warn">
            <div class="callout-title">Framework-first thinking</div>
            <div>The team designs around annotations and container tricks before they even agree on the business API.</div>
          </div>
        </div>
      `),
      panel('What to do / what not to do', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Situation</th><th>Prefer</th><th>Avoid</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Choosing implementations</td>
                <td>Composition root, DI module, factory</td>
                <td>Controller, activity, fragment, ViewModel, entity</td>
              </tr>
              <tr>
                <td>Swapping test adapters</td>
                <td>Test module / fake at the edge</td>
                <td>Publicly exposing secret-bearing internals for convenience</td>
              </tr>
              <tr>
                <td>Sharing state between read and write paths</td>
                <td>Feature bundle or clearly shared repository/store</td>
                <td>Independent factory methods that silently build different state graphs</td>
              </tr>
              <tr>
                <td>Logging</td>
                <td>Structured safe fields, redaction, correlation IDs</td>
                <td>Printing whole secret-bearing requests or auth codes</td>
              </tr>
              <tr>
                <td>Android UI logic</td>
                <td>ViewModel + use cases + repository</td>
                <td>UI directly calling Retrofit, Room, and SDKs together</td>
              </tr>
              <tr>
                <td>Spring Boot assembly</td>
                <td><code>@Configuration</code> or module wiring at startup</td>
                <td>Beans pulling <code>ApplicationContext</code> just to find collaborators dynamically</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Failure pipeline: how bugs usually appear', `
        <div class="timeline">
          <div class="step"><strong>1.</strong> A feature starts simple, so wiring is done ad hoc inside controllers or activities.</div>
          <div class="step"><strong>2.</strong> A second environment or provider is introduced, and implementation choices spread to multiple call sites.</div>
          <div class="step"><strong>3.</strong> Shared state stops lining up because different graphs create different repositories or caches.</div>
          <div class="step"><strong>4.</strong> Tests become brittle, so the team exposes internals publicly “just for mocking”.</div>
          <div class="step"><strong>5.</strong> Logs leak too much because request/response models were never reviewed for redaction.</div>
          <div class="step"><strong>6.</strong> The solution is not “use more framework magic”; it is usually to redraw the boundaries and move assembly back to the edge.</div>
        </div>
        <div class="note">
          <div class="callout-title">Rule of thumb</div>
          <div>If your design is getting hard to explain without mentioning the framework first, step back and restate the public business API in plain English.</div>
        </div>
      `),
      panel('Quick anti-pattern exercise', `
        <div class="good">
          <div class="callout-title">Try first</div>
          <div>A ViewModel calls Retrofit directly, stores raw DTOs in UI state, and also decides retry policy. Name the anti-patterns before opening the answer.</div>
        </div>
        <details>
          <summary>Open the diagnosis</summary>
          <ul>
            <li>UI layer is owning infrastructure work.</li>
            <li>Transport shapes are leaking into presentation state.</li>
            <li>Retry policy is misplaced in the screen-facing layer.</li>
            <li>Repository/use-case boundaries are missing or too weak.</li>
          </ul>
        </details>
      `)
    ]
  },
  {
    id: 'spring-boot-mapping',
    title: 'Spring Boot mapping',
    navLabel: 'Spring Boot',
    sections: [
      hero(
        'Map the lesson to Spring Boot backend design',
        ['Controllers', 'Configuration', 'Bean scopes', 'Testing'],
        `
          <p>If you plan to use this design in Spring Boot, think of the framework as a convenient way to host your composition root — not as the source of your architecture.</p>
          <div class="good">
            <div class="callout-title">Best default</div>
            <div>Keep business services plain. Let Spring wire them at the edge using <code>@Configuration</code>, constructor injection, and environment-specific beans or modules.</div>
          </div>
        `
      ),
      panel('Spring structure mapping', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Lesson concept</th><th>Spring Boot equivalent</th><th>Where it belongs</th><th>Watch out for</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Boundary input</td>
                <td><code>@RestController</code>, message listener, scheduled job entry point</td>
                <td>Web, messaging, or job adapter layer</td>
                <td>Do not make controllers choose provider implementations</td>
              </tr>
              <tr>
                <td>Public service interface</td>
                <td>Application service / use case interface</td>
                <td>Application layer</td>
                <td>Do not mix it with JPA/web annotations unless necessary</td>
              </tr>
              <tr>
                <td>Composition root</td>
                <td><code>@Configuration</code> class or module config</td>
                <td>Startup/bootstrap edge</td>
                <td>Do not hide important assembly in scattered bean methods across the app</td>
              </tr>
              <tr>
                <td>Feature bundle</td>
                <td>Facade bean exposing related use cases</td>
                <td>Application layer</td>
                <td>Do not create giant “everything” facades</td>
              </tr>
              <tr>
                <td>Hidden adapter</td>
                <td>Provider client, repository impl, SDK wrapper</td>
                <td>Infrastructure layer</td>
                <td>Do not leak provider DTOs into controllers and domain objects</td>
              </tr>
              <tr>
                <td>Shared store</td>
                <td>Repository, transaction-managed persistence, cache, outbox</td>
                <td>Infrastructure with clear app-layer abstraction</td>
                <td>Scope mismatch and accidental duplicate caches</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Interactive Spring pipeline', `
        <div class="tabs" data-tab-group="spring-pipeline">
          <button class="tab-btn active" data-tab="api">Web API</button>
          <button class="tab-btn" data-tab="worker">Worker / scheduler</button>
          <button class="tab-btn" data-tab="modular">Modular monolith</button>
          <button class="tab-btn" data-tab="tests">Testing</button>
        </div>
        <div class="tab-content active" data-tab-panel="api">
          <div class="timeline">
            <div class="step"><strong>1.</strong> Controller receives request DTO and security context.</div>
            <div class="step"><strong>2.</strong> Controller maps DTO to a request model and calls a public use case.</div>
            <div class="step"><strong>3.</strong> Use case coordinates hidden adapters such as repository, gateway, event publisher, and logger.</div>
            <div class="step"><strong>4.</strong> Use case returns a public result model; controller maps it to HTTP response.</div>
          </div>
          <div class="warn"><div class="callout-title">Do not</div><div>Inject payment-provider SDK clients directly into controllers and let web code decide fallback rules.</div></div>
        </div>
        <div class="tab-content" data-tab-panel="worker">
          <p>Scheduled jobs and consumers are also boundaries. Treat them like controllers without HTTP.</p>
          <ul>
            <li>Entry point receives raw message/job input.</li>
            <li>Maps input to a request model.</li>
            <li>Calls a public application service.</li>
            <li>Retries, dead-letter rules, and metrics stay in the adapter layer.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="modular">
          <p>For a modular monolith, use package/module boundaries the same way this lesson uses hidden internals.</p>
          <ul>
            <li>Expose feature facades between modules.</li>
            <li>Keep provider-specific implementations inside the owning module.</li>
            <li>Avoid letting every module depend on every repository implementation directly.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="tests">
          <ul>
            <li><strong>Unit test:</strong> instantiate the use case manually with fake adapters.</li>
            <li><strong>Slice test:</strong> test controllers with mocked application services.</li>
            <li><strong>Integration test:</strong> load Spring config for one module/feature.</li>
            <li><strong>End-to-end:</strong> hit the real boundary with sandbox or testcontainers-backed adapters.</li>
          </ul>
        </div>
      `),
      panel('Spring Boot sample wiring', `
        <div class="code-card">
          <div class="code-head">
            <div>
              <div class="kicker">Kotlin Spring example</div>
              <strong>Feature wiring in <code>@Configuration</code></strong>
            </div>
            <button class="copy-btn" data-copy-target="spring-config-code">Copy snippet</button>
          </div>
          <pre id="spring-config-code">@Configuration
class BillingModule {
    @Bean
    fun billingFeature(
        receiptRepository: ReceiptRepository,
        billingLogger: BillingLogger,
        paymentGateway: ApprovedPaymentGateway,
    ): BillingFeature {
        val checkoutService = DefaultCheckoutService(
            gateway = paymentGateway,
            receiptStore = receiptRepository,
            auditLogger = billingLogger,
        )
        val receiptQueryService = DefaultReceiptQueryService(
            receiptStore = receiptRepository,
            auditLogger = billingLogger,
        )
        return DefaultBillingFeature(
            checkoutService = checkoutService,
            receiptQueryService = receiptQueryService,
        )
    }
}</pre>
        </div>
        <div class="note">
          <div class="callout-title">Scope guidance</div>
          <div>Most application services in Spring are singleton beans. Stateful request-specific data usually belongs in method parameters, transactions, or clearly scoped collaborators — not hidden mutable fields on singleton services.</div>
        </div>
      `),
      panel('Quick Spring mapping exercise', `
        <div class="good">
          <div class="callout-title">Scenario</div>
          <div>You are adding a CSV export endpoint. Decide what belongs in the controller, what belongs in the application service, and what belongs in the exporter adapter.</div>
        </div>
        <details>
          <summary>Open the worked answer</summary>
          <p>The controller should parse request parameters and call a public export use case. The application service should coordinate business rules such as authorization or report scope. The exporter adapter should own CSV library details, file streaming, and formatting mechanics.</p>
        </details>
      `)
    ]
  },
  {
    id: 'android-studio-mapping',
    title: 'Android Studio mapping',
    navLabel: 'Android',
    sections: [
      hero(
        'Map the lesson to Android Studio app architecture',
        ['ViewModel', 'Repository', 'Hilt/Koin/manual DI', 'Offline-first'],
        `
          <p>On Android, this lesson maps especially well to a layered setup like <strong>UI → ViewModel → use cases → repository → local/remote data sources</strong>.</p>
          <div class="good">
            <div class="callout-title">Best default</div>
            <div>Keep Retrofit, Room, WorkManager, and SDK details behind repositories and use cases. Let the ViewModel speak in UI state and user intents, not infrastructure APIs.</div>
          </div>
        `
      ),
      panel('Android structure mapping', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Lesson concept</th><th>Android equivalent</th><th>Where it belongs</th><th>Avoid</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Boundary input</td>
                <td>Compose event, Fragment action, Activity callback</td>
                <td>UI layer</td>
                <td>Putting business rules directly in Composables/Fragments</td>
              </tr>
              <tr>
                <td>Public service interface</td>
                <td>Use case / interactor</td>
                <td>Domain or application layer</td>
                <td>ViewModel calling provider SDKs directly</td>
              </tr>
              <tr>
                <td>Feature bundle</td>
                <td>Feature-scoped facade or module object</td>
                <td>Feature module/application layer</td>
                <td>One global singleton object for every feature interaction</td>
              </tr>
              <tr>
                <td>Shared store</td>
                <td>Repository backed by Room/DataStore/in-memory cache</td>
                <td>Data layer</td>
                <td>Duplicated cache logic in each ViewModel</td>
              </tr>
              <tr>
                <td>Hidden adapter</td>
                <td>Retrofit API, SDK wrapper, database DAO adapter</td>
                <td>Data/infrastructure layer</td>
                <td>Leaking transport DTOs into UI state</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Room entity vs DAO vs Retrofit vs repository', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Android piece</th><th>Main responsibility</th><th>Typical shape</th><th>What should stay out of it</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Room entity</td>
                <td>Represent one database row/table-shaped persistence object</td>
                <td><code>@Entity</code> data class</td>
                <td>UI state concerns and sync timing policy</td>
              </tr>
              <tr>
                <td>DAO</td>
                <td>Run Room queries/inserts/updates and expose entity flows</td>
                <td><code>@Dao</code> interface</td>
                <td>Remote fetch strategy or screen logic</td>
              </tr>
              <tr>
                <td>Retrofit API</td>
                <td>Declare HTTP endpoints and DTO transport</td>
                <td>interface with <code>@GET</code>/<code>@POST</code></td>
                <td>Room access, UI orchestration, cache ownership</td>
              </tr>
              <tr>
                <td>Repository</td>
                <td>Coordinate DAO + Retrofit + mapping + refresh policy</td>
                <td>Domain-facing abstraction/implementation</td>
                <td>Composable rendering details</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>This is one of the most important Android design separations in the course: Room entities and DAOs are local persistence tools, Retrofit is remote transport, and the repository is the coordinator that turns them into one coherent feature-facing data story.</p>
      `),
      panel('Interactive Android pipeline', `
        <div class="tabs" data-tab-group="android-pipeline">
          <button class="tab-btn active" data-tab="screen">Screen flow</button>
          <button class="tab-btn" data-tab="offline">Offline-first</button>
          <button class="tab-btn" data-tab="feature-module">Feature module</button>
          <button class="tab-btn" data-tab="testing">Testing</button>
        </div>
        <div class="tab-content active" data-tab-panel="screen">
          <div class="timeline">
            <div class="step"><strong>1.</strong> UI emits an intent like “Pay now” or “Refresh receipts”.</div>
            <div class="step"><strong>2.</strong> ViewModel maps the intent into a use case call.</div>
            <div class="step"><strong>3.</strong> Use case coordinates repository/gateway/logger dependencies.</div>
            <div class="step"><strong>4.</strong> ViewModel maps the result into UI state.</div>
          </div>
          <div class="warn"><div class="callout-title">Do not</div><div>Let Compose screens instantiate Retrofit clients, DAOs, or provider SDKs directly.</div></div>
        </div>
        <div class="tab-content" data-tab-panel="offline">
          <ul>
            <li>One repository should own merge rules between local cache and remote source.</li>
            <li>Use cases should depend on repository abstractions, not on Room + Retrofit together.</li>
            <li>DAOs should expose the local query surface; Retrofit should expose the remote query surface; the repository chooses how they cooperate.</li>
            <li>WorkManager sync jobs should reuse the same repository/business logic when possible.</li>
            <li>Scope your cache carefully: app-wide, account-wide, screen-specific, or temporary.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="feature-module">
          <p>When you split Android into feature modules, expose a small feature API rather than letting modules reach into each other's concrete repositories.</p>
          <ul>
            <li>Use a feature facade for navigation entry points or shared use cases.</li>
            <li>Hide implementation details inside the owning module.</li>
            <li>Prefer dependency inversion over cross-feature concrete imports.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="testing">
          <ul>
            <li><strong>ViewModel tests:</strong> fake use cases + deterministic dispatchers.</li>
            <li><strong>Use case tests:</strong> fake repositories/adapters with no Android framework required.</li>
            <li><strong>Repository tests:</strong> fake/real Room database plus stub API.</li>
            <li><strong>UI tests:</strong> verify state rendering, not infrastructure behavior.</li>
          </ul>
        </div>
      `),
      panel('Hilt-friendly example', `
        <div class="code-card">
          <div class="code-head">
            <div>
              <div class="kicker">Android example</div>
              <strong>ViewModel depending on use cases, not infrastructure</strong>
            </div>
            <button class="copy-btn" data-copy-target="android-hilt-code">Copy snippet</button>
          </div>
          <pre id="android-hilt-code">@HiltViewModel
class CheckoutViewModel @Inject constructor(
    private val chargeCheckout: ChargeCheckoutUseCase,
    private val loadReceipts: LoadReceiptsUseCase,
) : ViewModel() {
    fun onPayClicked(request: ChargeRequest) {
        viewModelScope.launch {
            chargeCheckout(request)
        }
    }

    fun refreshReceipts() {
        viewModelScope.launch {
            loadReceipts()
        }
    }
}</pre>
        </div>
        <div class="note">
          <div class="callout-title">Scope guidance</div>
          <div>Use app-singleton scope for expensive shared infrastructure, ViewModel scope for screen logic, and method parameters for request-specific values. If two screens should not share mutable state, do not hide that state in a singleton repository by accident.</div>
        </div>
      `),
      panel('Quick Android mapping exercise with DAO detail', `
        <div class="good">
          <div class="callout-title">Scenario</div>
          <div>You are adding a “saved invoices” screen. Decide what belongs in the Composable, ViewModel, use case, repository, DAO, and worker.</div>
        </div>
        <details>
          <summary>Open the worked answer</summary>
          <ul>
            <li><strong>Composable:</strong> render list state and send user actions upward.</li>
            <li><strong>ViewModel:</strong> hold filter/loading/error state and trigger use cases.</li>
            <li><strong>Use case:</strong> express actions like <code>observeSavedInvoices()</code> or <code>refreshSavedInvoices()</code>.</li>
            <li><strong>Repository:</strong> decide when to use network, cache, and mapping.</li>
            <li><strong>DAO:</strong> perform concrete Room queries/inserts/updates; it should not decide sync policy or screen behavior.</li>
            <li><strong>Worker:</strong> reuse repository refresh logic instead of bypassing the repository to call DAO/API directly in a new way.</li>
          </ul>
        </details>
      `),
      panel('Quick Android data-path exercise with Retrofit and DAO', `
        <div class="good">
          <div class="callout-title">Scenario</div>
          <div>A user opens a receipt list screen, then pulls to refresh. Explain which steps belong to ViewModel, use case, repository, Retrofit, DAO, and Room.</div>
        </div>
        <details>
          <summary>Open the worked answer</summary>
          <p>The ViewModel reacts to the UI event and calls a use case or repository-facing action. The repository decides to trigger Retrofit refresh, maps remote DTOs, persists entities through the DAO, then observes Room-backed local state and maps it into domain/UI-facing models. The DAO performs local database operations; Retrofit performs transport; the repository coordinates both.</p>
        </details>
      `)
    ]
  },
  {
    id: 'production-readiness',
    title: 'Production readiness',
    navLabel: 'Production readiness',
    sections: [
      panel('Things you may not have considered yet', `
        <div class="grid grid-3">
          <div class="card"><div class="key">Persistence lifetime</div><p>In-memory stores teach sharing, but real systems need durable persistence, transactions, and migration strategy.</p></div>
          <div class="card"><div class="key">Idempotency</div><p>Payment-style operations often need duplicate-request protection so retries do not create duplicate charges.</p></div>
          <div class="card"><div class="key">Concurrency</div><p>If multiple threads, requests, or workers touch the same state, lifetime and locking rules become architecture concerns.</p></div>
          <div class="card"><div class="key">Redaction</div><p>Safe <code>toString()</code>, structured logs, and scrubbed telemetry matter as much as the feature boundary itself.</p></div>
          <div class="card"><div class="key">Retries + timeouts</div><p>External gateways fail. Decide which layer owns retry, timeout, backoff, and circuit-breaker policy.</p></div>
          <div class="card"><div class="key">Events / outbox</div><p>Many backends need to publish events after persistence. That adds transaction and consistency questions.</p></div>
          <div class="card"><div class="key">Observability</div><p>Metrics, traces, and correlation IDs belong in the operational design, not only in debugging emergencies.</p></div>
          <div class="card"><div class="key">Configuration</div><p>Secrets, provider modes, feature flags, and environment-specific assembly should stay outside business code.</p></div>
          <div class="card"><div class="key">Evolution</div><p>Design for adding a second provider, migrating storage, or splitting modules later without breaking public APIs.</p></div>
        </div>
      `),
      panel('Operational pipeline beyond the lesson', `
        <div class="timeline">
          <div class="step"><strong>1.</strong> Validate request shape and authentication context at the boundary.</div>
          <div class="step"><strong>2.</strong> Check idempotency/replay rules if the action must not run twice.</div>
          <div class="step"><strong>3.</strong> Call the public use case or feature service.</div>
          <div class="step"><strong>4.</strong> Use hidden adapters to talk to external providers or persistence.</div>
          <div class="step"><strong>5.</strong> Persist state and maybe write to an outbox/event table.</div>
          <div class="step"><strong>6.</strong> Emit logs, metrics, and traces using safe structured fields.</div>
          <div class="step"><strong>7.</strong> Return a public result model or update local UI state.</div>
        </div>
        <div class="warn">
          <div class="callout-title">Often-missed design question</div>
          <div>Should retries happen in the adapter, the use case, the job runner, or the network client? Pick one owner deliberately so you do not multiply retries across layers.</div>
        </div>
      `),
      panel('Testing and observability strategy', `
        <div class="tabs" data-tab-group="prod-quality">
          <button class="tab-btn active" data-tab="unit">Unit</button>
          <button class="tab-btn" data-tab="integration">Integration</button>
          <button class="tab-btn" data-tab="contract">Contract</button>
          <button class="tab-btn" data-tab="ops">Operations</button>
        </div>
        <div class="tab-content active" data-tab-panel="unit">
          <ul>
            <li>Instantiate business services manually with fake adapters.</li>
            <li>Assert business outcomes, not framework wiring.</li>
            <li>Use deterministic clock/UUID/dispatcher abstractions when time/order matters.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="integration">
          <ul>
            <li>Exercise one feature graph with real persistence and sandbox adapters.</li>
            <li>Check that shared state actually stays shared.</li>
            <li>Verify transactions, configuration, and scope behavior.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="contract">
          <ul>
            <li>Pin the behavior of external-provider adapters with provider-specific tests.</li>
            <li>Check DTO mapping, error mapping, retries, and timeout behavior.</li>
            <li>Use testcontainers, mock servers, or sandbox environments where useful.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="ops">
          <ul>
            <li>Add counters/timers around public use cases and gateway calls.</li>
            <li>Use correlation IDs or trace IDs from the boundary inward.</li>
            <li>Redact secrets before logs, traces, analytics, and crash reports leave the process.</li>
          </ul>
        </div>
      `),
      panel('Safe logging and redaction', `
        <div class="code-card">
          <div class="code-head">
            <div>
              <div class="kicker">Security-oriented lesson</div>
              <strong>Safe <code>toString()</code> for printable results</strong>
            </div>
            <button class="copy-btn" data-copy-target="redaction-code">Copy snippet</button>
          </div>
          <pre id="redaction-code">data class PaymentReceipt(
    val receiptId: String,
    val customerId: String,
    val amountInCents: Int,
    val gatewayName: String,
    val authorizationCode: String,
) {
    override fun toString(): String {
        return "PaymentReceipt(receiptId=$receiptId, customerId=$customerId, amountInCents=$amountInCents, gatewayName=$gatewayName, authorizationCode=<redacted>)"
    }
}</pre>
        </div>
        <div class="good">
          <div class="callout-title">Good default rules</div>
          <ul>
            <li>Never log raw payment tokens, passwords, or API secrets.</li>
            <li>Think about <code>toString()</code> on models that may be printed during debugging.</li>
            <li>Prefer structured log fields over giant free-form debug strings.</li>
            <li>Review analytics, crash reporting, and tracing with the same redaction standard.</li>
          </ul>
        </div>
      `),
      panel('Production exercise: add one more real-world concern', `
        <p>Pick one feature from your own project and run this mini design review:</p>
        <ol>
          <li>Where would idempotency or duplicate-event protection live?</li>
          <li>Where would timeout and retry ownership live?</li>
          <li>Which layer owns structured logging and redaction?</li>
          <li>Which dependencies should be deterministic in tests: clock, IDs, dispatcher, config?</li>
        </ol>
        <details>
          <summary>Why this exercise matters</summary>
          <p>Many designs look clean until production concerns arrive. The strongest architectures are the ones where these concerns can be added <strong>without collapsing the boundaries</strong>. If adding retries or redaction forces you to rewrite controllers, screens, or use cases radically, the boundaries probably need another pass.</p>
        </details>
      `)
    ]
  }
];


