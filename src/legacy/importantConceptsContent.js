import { hero, panel, teachingTask } from './contentBuilders';

export const importantConceptViews = [
  {
    id: 'qualifiers-and-provider-selection',
    title: 'Qualifiers and provider selection',
    navLabel: 'Qualifiers + provider selection',
    group: 'Important concepts',
    level: 'Applied',
    time: '12 min',
    sampleSource: 'additional recommended concepts',
    summary: 'Learn how to handle multiple implementations of the same abstraction without confusion, and when to use qualifiers, factories, or lazy/provider access.',
    sections: [
      hero(
        'When one interface has many valid implementations, you need a selection strategy',
        ['Qualifiers', 'Factories', 'Provider/Lazy', 'Real-world use'],
        `
          <p>As your project grows, a single abstraction often ends up with multiple valid implementations: production vs sandbox, email vs SMS, Stripe vs PayPal, online cache vs offline cache.</p>
          <div class="good">
            <div class="callout-title">Core lesson</div>
            <div>DI does not remove the need to choose. It gives you <strong>better places to make the choice</strong>.</div>
          </div>
        `
      ),
      panel('Three ways to choose between implementations', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Strategy</th><th>Best when</th><th>Why it helps</th><th>Watch out for</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Qualifier / named binding</td>
                <td>You know at wiring time which implementation is required</td>
                <td>Clear and explicit in DI modules</td>
                <td>Too many string-like qualifiers can become hard to follow</td>
              </tr>
              <tr>
                <td>Factory</td>
                <td>The choice depends on environment, mode, tenant, region, or user flow</td>
                <td>Centralizes policy and intent-based creation</td>
                <td>Do not push factory selection logic into controllers or UI</td>
              </tr>
              <tr>
                <td>Provider / Lazy</td>
                <td>You need delayed creation or a fresh instance on demand</td>
                <td>Avoids eager construction and can break some cycles</td>
                <td>Can hide design problems if overused</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Interactive compare: qualifier vs factory vs provider', `
        <div class="tabs" data-tab-group="selection-strategy">
          <button class="tab-btn active" data-tab="qualifier">Qualifier</button>
          <button class="tab-btn" data-tab="factory">Factory</button>
          <button class="tab-btn" data-tab="provider">Provider/Lazy</button>
        </div>
        <div class="tab-content active" data-tab-panel="qualifier">
          <p>Use a qualifier when the graph already knows which implementation is needed. Concretely: the app is already in “production mode,” and all you need is a way to say “inject the production gateway, not the sandbox gateway.”</p>
          <pre>@Bean
fun sandboxGateway(...): PaymentGateway = SandboxGateway(...)

@Bean
fun productionGateway(...): PaymentGateway = StripeGateway(...)

@Service
class CheckoutService(
    @Qualifier("productionGateway") private val gateway: PaymentGateway,
)</pre>
          <p>Analogy: you are not asking a shop assistant to choose a shirt for you dynamically. You are simply saying, “bring me the blue uniform from rack B.” The choice is known at wiring time.</p>
        </div>
        <div class="tab-content" data-tab-panel="factory">
          <p>Use a factory when the caller states intent and the factory chooses the implementation. Concretely: the caller says “production” or “sandbox,” and a central policy object decides which gateway object should be built for that request.</p>
          <pre>fun createGateway(environment: CheckoutEnvironment): PaymentGateway = when (environment) {
    CheckoutEnvironment.PRODUCTION -> StripeGateway(...)
    CheckoutEnvironment.SANDBOX -> SandboxGateway(...)
}</pre>
          <p>Analogy: a travel desk asks where you are going, then chooses the right ticket counter for that destination. The caller gives intent; the factory converts that intent into a concrete choice.</p>
        </div>
        <div class="tab-content" data-tab-panel="provider">
          <p>Use provider/lazy when you need delayed creation or a fresh collaborator each time. Concretely: do not create the expensive or per-run object until the moment the worker actually needs it.</p>
          <pre>class WorkerRunner(
    private val taskProvider: () -> SyncTask,
) {
    fun run() {
        val task = taskProvider()
        task.execute()
    }
}</pre>
          <p>Analogy: instead of keeping one pre-made sandwich on the counter all day, you keep the recipe and make a fresh sandwich only when a customer actually orders one.</p>
        </div>
      `),
      panel('Platform-specific starter snippets', `
        <div class="tabs" data-tab-group="qualifier-platforms">
          <button class="tab-btn active" data-tab="spring">Spring Boot</button>
          <button class="tab-btn" data-tab="android">Android / Hilt</button>
        </div>
        <div class="tab-content active" data-tab-panel="spring">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Spring qualifier starter</div><strong>Named gateway bindings</strong></div>
              <button class="copy-btn" data-copy-target="spring-qualifier-code">Copy snippet</button>
            </div>
            <pre id="spring-qualifier-code">@Configuration
class PaymentGatewayModule {
    @Bean("prodGateway")
    fun prodGateway(logger: BillingLogger): PaymentGateway = StripeGateway(logger)

    @Bean("sandboxGateway")
    fun sandboxGateway(logger: BillingLogger): PaymentGateway = SandboxGateway(logger)
}

@Service
class CheckoutService(
    @Qualifier("prodGateway") private val gateway: PaymentGateway,
)</pre>
          </div>
        </div>
        <div class="tab-content" data-tab-panel="android">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Hilt qualifier starter</div><strong>Qualified repository or dispatcher</strong></div>
              <button class="copy-btn" data-copy-target="android-qualifier-code">Copy snippet</button>
            </div>
            <pre id="android-qualifier-code">@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class IoDispatcher

@Module
@InstallIn(SingletonComponent::class)
object DispatcherModule {
    @IoDispatcher
    @Provides
    fun provideIoDispatcher(): CoroutineDispatcher = Dispatchers.IO
}

class SyncRepository @Inject constructor(
    @IoDispatcher private val ioDispatcher: CoroutineDispatcher,
)</pre>
          </div>
        </div>
      `),
      panel('Where this appears in real projects', `
        <ul>
          <li><strong>Backend:</strong> primary vs replica database access, internal vs external API clients, production vs sandbox providers, different serializers/exporters.</li>
          <li><strong>Android:</strong> IO vs Main dispatchers, online vs offline data sources, analytics providers, media implementations.</li>
          <li><strong>Rule:</strong> use qualifiers for known graph-time choices, factories for policy-driven runtime choices, and providers/lazy only when delayed or repeated creation is actually needed.</li>
        </ul>
      `),
      panel('Practice task: qualifier, factory, or provider?', teachingTask({
        task: 'Choose the right tool for three cases: (1) a Spring Boot app always uses one analytics sink in production and another in local development, (2) an export use case chooses CSV, PDF, or XLSX based on caller intent, and (3) a background sync runner needs a fresh <code>SyncAttempt</code> object every time it starts a run.',
        thinkFirst: [
          'Is the graph already supposed to know the implementation at wiring time?',
          'Or is the caller expressing intent that should be converted into a concrete product choice?',
          'Or do you simply need delayed/fresh creation for each run?'
        ],
        codeId: 'important-selection-tools-solution',
        codeTitle: 'One code sketch showing qualifier, factory, and provider solving different jobs',
        code: `@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class ProdAnalytics

@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class LocalAnalytics

interface AnalyticsSink {
    fun record(event: String)
}

class ExportService(
    private val exporterFactory: ReportExporterFactory,
) {
    fun export(format: ReportFormat, rows: List<String>): ByteArray {
        // Factory converts caller intent into one concrete exporter.
        val exporter = exporterFactory.create(format)
        return exporter.export(rows)
    }
}

class SyncRunner(
    // Provider/lambda gives a fresh attempt object every run.
    private val syncAttemptProvider: () -> SyncAttempt,
) {
    fun run() {
        val attempt = syncAttemptProvider()
        attempt.execute()
    }
}`,
        explanation: [
          {
            title: 'Qualifiers solve known graph-time choices',
            body: 'If the graph already knows which analytics sink belongs in this environment, a qualifier or named binding is the clearest solution.'
          },
          {
            title: 'Factories solve caller-intent selection',
            body: 'When the caller says CSV vs PDF vs XLSX, a factory turns that runtime intent into one exporter implementation.'
          },
          {
            title: 'Providers solve delayed or repeated creation',
            body: 'A provider or lambda is ideal when you need a fresh object every time instead of one eagerly created reusable instance.'
          }
        ],
        pipeline: [
          'Configuration-time choice: qualifier picks the analytics sink.',
          'Runtime caller-intent choice: factory picks the exporter.',
          'Per-run creation choice: provider/lambda creates a new sync attempt.',
          'The lesson is that the tools solve different categories of decision.'
        ],
        spring: [
          'Use qualifiers or profiles when the environment already determines the implementation at wiring time.',
          'Use a factory bean or composition-root helper when business input drives the implementation choice at runtime.',
          'Avoid letting controllers decide both environment policy and runtime selection logic inline.'
        ],
        android: [
          'Use Hilt qualifiers for dispatchers, analytics sinks, or known graph-time variants.',
          'Use factories for media/export/source choices driven by user action or feature mode.',
          'Use providers/lambdas for fresh workers, tasks, or per-run collaborators.'
        ],
        mistakes: [
          'Using qualifiers for runtime caller intent when a factory is the clearer tool.',
          'Using a factory when all you really needed was one known binding at startup.',
          'Reusing stale attempt objects instead of creating fresh ones where needed.'
        ],
        better: 'This solution is better because it trains you to match the tool to the shape of the decision. That prevents both under-design and over-design when graphs grow.'
      }))
    ]
  },
  {
    id: 'scope-and-lifetime-bugs',
    title: 'Scope and lifetime bugs',
    navLabel: 'Scope + lifetime bugs',
    group: 'Important concepts',
    level: 'Applied',
    time: '12 min',
    sampleSource: 'additional recommended concepts',
    summary: 'Learn the most common lifetime mistakes that make DI-based designs fail in real apps, especially around shared state, request data, ViewModel state, and workers.',
    sections: [
      hero(
        'Most DI bugs are not syntax bugs — they are lifetime and scope mistakes',
        ['Singleton traps', 'Request data', 'ViewModel scope', 'Shared state'],
        `
          <p>Many architectures look correct on paper but fail because the <strong>object lifetime does not match the data lifetime</strong>.</p>
          <div class="warn">
            <div class="callout-title">Important warning</div>
            <div>A dependency can be correctly injected and still be wrong if its scope causes stale state, duplicated state, leaked state, or invisible writes.</div>
          </div>
        `
      ),
      panel('Common lifetime bugs', `
        <div class="compare-grid">
          <div class="compare-card dont">
            <h3>Stateful singleton by accident</h3>
            <p>A singleton repository or service quietly keeps mutable state that should have been request-, screen-, or feature-scoped.</p>
          </div>
          <div class="compare-card dont">
            <h3>Shared state lost by transient recreation</h3>
            <p>You create a fresh store/cache every time, so writes are invisible to reads that use another instance.</p>
          </div>
          <div class="compare-card dont">
            <h3>Request data inside long-lived service</h3>
            <p>User, tenant, or correlation info leaks across requests because it is kept on a shared singleton object.</p>
          </div>
          <div class="compare-card dont">
            <h3>ViewModel state hidden in app singleton</h3>
            <p>Two screens accidentally share temporary UI state because the owning object lives too long.</p>
          </div>
        </div>
      `),
      panel('Pipeline of a scope bug', `
        <p>A lifetime bug usually feels mysterious because the code “looks injected correctly.” This timeline makes the failure concrete: the injection syntax is fine, but the <strong>ownership and reuse rules</strong> are wrong.</p>
        <div class="timeline">
          <div class="step"><strong>1.</strong> A dependency is registered with a lifetime that feels convenient, for example “just make it singleton.”</div>
          <div class="step"><strong>2.</strong> Business code starts relying on hidden mutable state inside that dependency, such as cached receipts, current user data, or temporary screen state.</div>
          <div class="step"><strong>3.</strong> Another request, screen, or worker reuses or recreates the dependency in a way the programmer did not mentally model.</div>
          <div class="step"><strong>4.</strong> Data is missing, duplicated, stale, or leaked across contexts. This is the moment where the bug finally becomes visible to users or tests.</div>
          <div class="step"><strong>5.</strong> The fix is usually not “more DI” — it is choosing the right lifetime and making ownership explicit: who owns this state, who may see it, and for how long?</div>
        </div>
        <div class="note">
          <div class="callout-title">Concrete analogy</div>
          <div>If one whiteboard is shared by every team in an office, notes from one team will interfere with another. If every team gets its own whiteboard, notes stay local. Lifetime choice is really about deciding who shares the whiteboard.</div>
        </div>
      `),
      panel('Interactive bug diagnosis', `
        <div class="tabs" data-tab-group="scope-bug-lab">
          <button class="tab-btn active" data-tab="backend">Backend request bug</button>
          <button class="tab-btn" data-tab="billing">Shared store bug</button>
          <button class="tab-btn" data-tab="android">Android screen bug</button>
          <button class="tab-btn" data-tab="worker">Worker bug</button>
        </div>
        <div class="tab-content active" data-tab-panel="backend">
          <p><strong>Symptom:</strong> request-specific user context appears in another request.</p>
          <p><strong>Likely cause:</strong> stateful request data stored in a singleton service or logger helper.</p>
          <p><strong>Fix:</strong> keep request data in method parameters, request-scoped objects, or explicit context carriers.</p>
        </div>
        <div class="tab-content" data-tab-panel="billing">
          <p><strong>Symptom:</strong> charging succeeds but querying receipts shows empty history.</p>
          <p><strong>Likely cause:</strong> checkout and query services do not share the same store instance.</p>
          <p><strong>Fix:</strong> bundle them in one feature graph or reuse the same singleton/feature-scoped store.</p>
        </div>
        <div class="tab-content" data-tab-panel="android">
          <p><strong>Symptom:</strong> two screens unexpectedly share temporary UI state.</p>
          <p><strong>Likely cause:</strong> screen-specific state hidden in an app-wide singleton.</p>
          <p><strong>Fix:</strong> move that state into ViewModel scope or a clearly bounded feature scope.</p>
        </div>
        <div class="tab-content" data-tab-panel="worker">
          <p><strong>Symptom:</strong> background jobs behave inconsistently or reuse stale state.</p>
          <p><strong>Likely cause:</strong> worker-specific execution state stored in a long-lived shared dependency.</p>
          <p><strong>Fix:</strong> keep job execution state local to the worker or a fresh job graph.</p>
        </div>
      `),
      panel('Checklist before choosing a lifetime', `
        <ul>
          <li>Does this object own mutable state?</li>
          <li>If yes, who should see that state, and for how long?</li>
          <li>Will two callers need to observe the same writes?</li>
          <li>Would sharing this object across requests/screens/jobs leak data?</li>
          <li>Is this object expensive enough that recreation matters?</li>
        </ul>
      `),
      panel('Practice task: debug the scope bug like an architect', teachingTask({
        task: 'Fix two lifetime bugs: (1) backend request-scoped fraud data leaks between users because a singleton audit helper stores <code>currentRiskLevel</code> in a mutable field, and (2) an Android coupon-entry screen and checkout screen accidentally share one temporary promo-code value through a singleton repository field.',
        thinkFirst: [
          'Which object currently owns mutable state, and should that state really outlive one request or one screen?',
          'Should the data travel as a parameter, a request-scoped context value, ViewModel state, or long-lived repository state?',
          'How would you write a test that exposes the leak clearly?'
        ],
        codeId: 'important-scope-bug-solution',
        codeTitle: 'Move temporary state to the lifetime boundary that actually owns it',
        code: `class FraudReviewService(
    private val auditLogger: AuditLogger,
) {
    fun review(request: FraudReviewRequest): FraudDecision {
        val riskLevel = calculateRiskLevel(request)

        // Pass request-specific state explicitly instead of storing it on a singleton field.
        auditLogger.logReview(
            customerId = request.customerId,
            riskLevel = riskLevel,
        )

        return FraudDecision(riskLevel)
    }
}

data class CheckoutUiState(
    val promoCodeDraft: String = "",
)

@HiltViewModel
class CouponViewModel @Inject constructor() : ViewModel() {
    private val _state = MutableStateFlow(CheckoutUiState())
    val state: StateFlow<CheckoutUiState> = _state

    fun onPromoCodeChanged(value: String) {
        // Screen-specific temporary state stays in the ViewModel, not a singleton repository.
        _state.update { it.copy(promoCodeDraft = value) }
    }
}`,
        explanation: [
          {
            title: 'Backend fix: request data becomes explicit again',
            body: 'The fraud level is derived during one review and passed to the logger as data. That prevents one request from leaving state behind in a shared singleton helper.'
          },
          {
            title: 'Android fix: promo-code draft moves to ViewModel state',
            body: 'A promo-code draft is temporary screen state, so the ViewModel is the right owner. The repository should keep long-lived data coordination, not per-screen text fields.'
          },
          {
            title: 'The real principle is lifetime alignment',
            body: 'State should live exactly as long as it is needed and no longer. When temporary state lives in a long-lived object, leak bugs follow even if injection syntax looks correct.'
          }
        ],
        pipeline: [
          'Spot the object that is holding mutable state too long.',
          'Move request-specific backend state into parameters or request-scoped objects.',
          'Move screen-specific Android state into ViewModel state or feature scope.',
          'Keep singletons mostly stateless unless they truly own long-lived shared data.',
          'Add tests that simulate multiple requests or multiple screens so leaks become visible.'
        ],
        spring: [
          'Keep request-specific values in method parameters, request-scoped objects, or explicit context carriers instead of singleton bean fields.',
          'A stateless singleton service is usually safe; a singleton mutable field holding request state is usually a smell.',
          'Integration tests should simulate multiple requests to catch leakage.'
        ],
        android: [
          'Temporary UI state belongs in ViewModel state, not in singleton repositories.',
          'Repositories should own long-lived data access, caching, sync, and mapping—not one screen\'s current input text.',
          'UI tests or ViewModel tests can assert that separate screens no longer share temporary values.'
        ],
        mistakes: [
          'Treating singleton as the default for any object that is convenient to access.',
          'Hiding temporary request/screen data in mutable helper fields.',
          'Debugging only the injection syntax instead of the lifetime choice behind it.'
        ],
        better: 'This solution is better because it makes state ownership explicit. Instead of fighting mysterious leak bugs later, the design now matches the true lifetime of the data from the start.'
      }))
    ]
  },
  {
    id: 'async-config-deterministic-deps',
    title: 'Async, config, and deterministic dependencies',
    navLabel: 'Async + config + deterministic deps',
    group: 'Important concepts',
    level: 'Applied',
    time: '13 min',
    sampleSource: 'additional recommended concepts',
    summary: 'Learn why clocks, UUID generators, dispatchers, feature flags, and config readers should often be injected instead of called directly from business code.',
    sections: [
      hero(
        'Inject time, IDs, dispatchers, and config when you need deterministic behavior',
        ['Clock', 'UUID', 'Dispatcher', 'Config'],
        `
          <p>Many subtle bugs come from business code directly calling the current time, random IDs, global dispatchers, or configuration lookups. These are dependencies too.</p>
          <div class="good">
            <div class="callout-title">Simple rule</div>
            <div>If the value affects behavior, testing, retry logic, ordering, or reproducibility, consider making it an injected dependency instead of a hidden global call.</div>
          </div>
        `
      ),
      panel('Examples of deterministic dependencies', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Dependency</th><th>Why inject it</th><th>Typical abstraction</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Clock / time source</td>
                <td>Tests and scheduling logic need predictable time</td>
                <td><code>Clock</code>, <code>TimeProvider</code></td>
              </tr>
              <tr>
                <td>ID / UUID generator</td>
                <td>You may want stable values in tests or specialized formats</td>
                <td><code>IdGenerator</code></td>
              </tr>
              <tr>
                <td>Dispatcher / executor</td>
                <td>Async code needs control over where work runs</td>
                <td><code>CoroutineDispatcher</code>, <code>Executor</code></td>
              </tr>
              <tr>
                <td>Feature flags / config</td>
                <td>Business behavior may change by environment or rollout state</td>
                <td><code>BillingConfig</code>, <code>FeatureFlagService</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Platform-specific starter snippets', `
        <div class="tabs" data-tab-group="deterministic-platforms">
          <button class="tab-btn active" data-tab="spring">Spring Boot</button>
          <button class="tab-btn" data-tab="android">Android</button>
        </div>
        <div class="tab-content active" data-tab-panel="spring">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Spring deterministic starter</div><strong>Inject clock + config</strong></div>
              <button class="copy-btn" data-copy-target="spring-deterministic-code">Copy snippet</button>
            </div>
            <pre id="spring-deterministic-code">@Configuration
class CommonDependenciesModule {
    @Bean
    fun systemClock(): Clock = Clock.systemUTC()

    @Bean
    fun billingConfig(
        @Value("\${billing.retry-enabled}") retryEnabled: Boolean,
    ): BillingConfig = BillingConfig(retryEnabled = retryEnabled)
}

class ReceiptService(
    private val clock: Clock,
    private val config: BillingConfig,
) {
    fun createdAt(): Instant = Instant.now(clock)
}</pre>
          </div>
        </div>
        <div class="tab-content" data-tab-panel="android">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Android deterministic starter</div><strong>Inject dispatcher + clock abstraction</strong></div>
              <button class="copy-btn" data-copy-target="android-deterministic-code">Copy snippet</button>
            </div>
            <pre id="android-deterministic-code">interface TimeProvider {
    fun nowMillis(): Long
}

class SystemTimeProvider @Inject constructor() : TimeProvider {
    override fun nowMillis(): Long = System.currentTimeMillis()
}

class SyncUseCase @Inject constructor(
    @IoDispatcher private val ioDispatcher: CoroutineDispatcher,
    private val timeProvider: TimeProvider,
) {
    suspend operator fun invoke() = withContext(ioDispatcher) {
        val startedAt = timeProvider.nowMillis()
        // perform work deterministically in tests
    }
}</pre>
          </div>
        </div>
      `),
      panel('When direct global access is still okay', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>Usually okay</h3>
            <ul>
              <li>Tiny leaf helpers where deterministic testing is irrelevant</li>
              <li>Throwaway scripts or demos</li>
              <li>Code that does not encode business policy around the value</li>
            </ul>
          </div>
          <div class="compare-card dont">
            <h3>Usually inject instead</h3>
            <ul>
              <li>Retry, timeout, and expiry logic</li>
              <li>Ordering, timestamps, or generated business IDs</li>
              <li>Coroutine/async execution policy</li>
              <li>Feature-flag or environment-sensitive behavior</li>
            </ul>
          </div>
        </div>
        <p>The practical rule is simple: if the value changes the outcome in a way you may want to test, replay, stub, or reason about later, treat it like a real dependency. Time, IDs, dispatchers, and config flags often look “built in,” but architecturally they still influence behavior.</p>
      `),
      panel('Why this matters to your course goals', `
        <p>For Spring Boot and Android alike, these dependencies are easy to overlook because they do not look like classic repositories or gateways. But they still shape behavior and testability. Treat them as first-class dependencies when the business flow depends on them.</p>
      `),
      panel('Practice task: make the feature deterministic on purpose', teachingTask({
        task: 'Design a billing retry flow where the use case decides whether to retry based on current time, generates a retry ID, runs on an IO dispatcher, and calls a gateway. The real goal is to surface hidden globals as explicit dependencies so behavior becomes testable and reproducible.',
        thinkFirst: [
          'Which values influence business behavior or test repeatability even though they often look “built in”?',
          'Which of those values would be painful to control in tests if left global?',
          'Where should async execution policy be chosen: inside the use case or at the wiring edge?'
        ],
        codeId: 'important-deterministic-deps-solution',
        codeTitle: 'Retry use case with injected time, IDs, dispatcher, and gateway',
        code: `class RetryChargeUseCase(
    // Clock is injected so time-dependent behavior is testable.
    private val clock: Clock,
    // ID generation is injected so retry IDs can be deterministic in tests.
    private val idGenerator: IdGenerator,
    // Dispatcher is injected/qualified so async execution policy is explicit.
    @IoDispatcher private val ioDispatcher: CoroutineDispatcher,
    // Gateway stays replaceable because it performs side effects.
    private val gateway: PaymentGateway,
) {
    suspend fun retry(request: RetryRequest): RetryResult = withContext(ioDispatcher) {
        val retryId = idGenerator.nextId()
        val startedAt = Instant.now(clock)

        gateway.retryCharge(
            request = request,
            retryId = retryId,
            startedAt = startedAt,
        )
    }
}`,
        explanation: [
          {
            title: '<code>Clock</code> is a real dependency, not just a convenience',
            body: 'Retry windows, timeouts, and timestamps affect business behavior. Injecting time makes the decision reproducible in tests.'
          },
          {
            title: '<code>IdGenerator</code> turns random output into controllable behavior',
            body: 'Stable test IDs make flows easier to assert and easier to reason about when failures happen.'
          },
          {
            title: 'Dispatcher injection exposes async policy',
            body: 'Execution context matters in coroutine-based logic. Qualifying or injecting the dispatcher keeps that policy at the edge instead of hardcoding it inside the use case.'
          }
        ],
        pipeline: [
          'Boundary calls the retry use case with a business-shaped request.',
          'Use case obtains deterministic dependencies: current time, retry ID, execution context.',
          'Use case runs on the injected dispatcher and calls the side-effecting gateway.',
          'Tests can replace each dependency to prove timing, ID, and async behavior deliberately.'
        ],
        spring: [
          'Inject <code>Clock</code>, config objects, and ID generators through Spring wiring rather than calling globals inside business code.',
          'This is especially important for retry windows, idempotency, timestamps, and scheduled logic.',
          'Configuration remains the right place to choose the concrete clock or feature flags for each environment.'
        ],
        android: [
          'Use Hilt qualifiers for dispatchers and inject time providers or ID generators into repositories/use cases.',
          'Room/Retrofit coordination may also depend on deterministic timestamps or sync IDs controlled by injected helpers.',
          'ViewModels should depend on deterministic use cases, not hardcode dispatchers and clocks everywhere.'
        ],
        mistakes: [
          'Calling <code>Instant.now()</code> and random UUID helpers directly inside logic that must be tested carefully.',
          'Hardcoding <code>Dispatchers.IO</code> throughout business code instead of qualifying it once.',
          'Thinking only repositories and gateways count as dependencies while invisible globals shape behavior too.'
        ],
        better: 'This solution is better because it pulls invisible global decisions into the architecture where they can be controlled, tested, and reasoned about. That is the difference between code that merely runs and code that is dependable.'
      }))
    ]
  }
];

