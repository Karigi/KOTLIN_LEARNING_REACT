import { hero, panel, teachingTask } from './contentBuilders';

export const masteryViews = [
  {
    id: 'self-check-lab',
    title: 'Self-check lab',
    navLabel: 'Self-check lab',
    group: 'Mastery lab',
    level: 'Review',
    time: '14 min',
    sampleSource: 'course synthesis',
    summary: 'Interactive self-check prompts with model answers so you can test whether you truly understand the patterns instead of only recognizing them while reading.',
    sections: [
      hero(
        'Use self-check prompts to turn passive reading into active understanding',
        ['Stage 1 diagnose', 'Model answers', 'Spot confusion early'],
        `
          <p>One of the fastest ways to see whether you truly understand DI is to ask yourself what you would do in a concrete design situation <strong>before</strong> reading the explanation.</p>
          <div class="good">
            <div class="callout-title">How to use this page</div>
            <div>Read the question first. Try answering in your own words. Then open the explanation and compare your reasoning with the model answer.</div>
          </div>
        `
      ),
      panel('Mastery path: how these pages now work as a challenge ladder', `
        <div class="timeline">
          <div class="step"><strong>Stage 1 — Diagnose:</strong> use <strong>Self-check lab</strong> to prove you can explain the core concepts without looking.</div>
          <div class="step"><strong>Stage 2 — Untangle confusion:</strong> use <strong>Confusion hotspots</strong> to separate concepts that often get mixed together.</div>
          <div class="step"><strong>Stage 3 — Translate to platforms:</strong> use <strong>Spring end-to-end map</strong> and <strong>Android end-to-end map</strong> to redraw one full feature in backend and Android language.</div>
          <div class="step"><strong>Stage 4 — Review like an architect:</strong> use <strong>Architecture review checklists</strong> and the capstone challenge to critique your own feature designs.</div>
        </div>
        <div class="note">
          <div class="callout-title">Best way to use the mastery track</div>
          <div>Do not race through all the pages in one sitting. Treat each page like a checkpoint you should be able to explain aloud or sketch on paper before moving to the next one.</div>
        </div>
      `),
      panel('DI basics self-checks', `
        <details open>
          <summary>1. Why is creating dependencies inside a business class usually a design smell?</summary>
          <p><strong>Model answer:</strong> Because it mixes business coordination with construction policy. The class becomes tightly coupled to concrete implementations, harder to test, and harder to change. Constructor injection keeps the class focused on behavior while allowing the composition root to choose implementations.</p>
        </details>
        <details>
          <summary>2. What is the difference between a dependency and an implementation?</summary>
          <p><strong>Model answer:</strong> A dependency is the collaborator a class needs conceptually. An implementation is one concrete way of fulfilling that need. DI becomes most powerful when the consuming class depends on the abstraction of the dependency rather than on one fixed implementation.</p>
        </details>
        <details>
          <summary>3. If constructor injection is so important, why do people still use factories and containers?</summary>
          <p><strong>Model answer:</strong> Because constructor injection explains how classes receive dependencies, but factories and containers explain how those dependencies get chosen and assembled at the edge of the app. They solve different layers of the creation problem.</p>
        </details>
        <details>
          <summary>4. Why does <code>WelcomeService</code> depend on <code>NotificationSender</code> instead of directly depending on <code>SendingFeature</code>?</summary>
          <p><strong>Model answer:</strong> Because the service should receive the narrowest role it truly needs. <code>WelcomeService</code> only needs the ability to send. The broader <code>SendingFeature</code> bundle is useful to setup code or demos that also want to inspect sent-message history afterward.</p>
        </details>
      `),
      panel('Factory and container self-checks', `
        <details open>
          <summary>5. When should you prefer an explicit factory instead of a DI container?</summary>
          <p><strong>Model answer:</strong> Prefer an explicit factory when the main problem is selecting or validating one product or one implementation policy. A container becomes more useful when many objects, registrations, and lifetimes must be coordinated together.</p>
        </details>
        <details>
          <summary>6. Why is a service locator considered an anti-pattern in most business code?</summary>
          <p><strong>Model answer:</strong> Because it hides dependencies again. Instead of seeing what a class needs in its constructor, you only discover it at runtime when the class starts pulling things from a global container or application context.</p>
        </details>
        <details>
          <summary>7. What is the practical difference between an allowlist and a hidden private boundary?</summary>
          <p><strong>Model answer:</strong> An allowlist is a policy mechanism that must be enforced somewhere. A hidden boundary is a stronger design restriction because outside code cannot casually implement or inject the hidden sensitive type at all.</p>
        </details>
      `),
      panel('Platform and lifetime self-checks', `
        <details open>
          <summary>8. Why can a correctly injected dependency still be architecturally wrong?</summary>
          <p><strong>Model answer:</strong> Because the lifetime may be wrong. A singleton can leak screen/request/job state, and a transient can accidentally break shared history. DI correctness includes both dependency selection and lifetime choice.</p>
        </details>
        <details>
          <summary>9. In Android, when should state live in a ViewModel instead of a singleton repository?</summary>
          <p><strong>Model answer:</strong> When the state is specific to one screen or one short-lived UI flow. A singleton repository should usually own long-lived shared data access and coordination, not temporary per-screen UI state.</p>
        </details>
        <details>
          <summary>10. In Spring Boot, why is it risky to put request-specific data inside a singleton bean field?</summary>
          <p><strong>Model answer:</strong> Because singleton beans are reused across requests. Request-specific state can leak between users or requests, causing incorrect behavior and even security issues.</p>
        </details>
      `),
      panel('Hands-on mastery drills', teachingTask({
        task: 'Solve three mastery drills as one architecture exercise: (1) redraw the billing request pipeline from boundary to persistence, (2) diagnose why a ViewModel that constructs Retrofit and chooses sandbox vs production is badly placed, and (3) translate the same composition-root idea into both Spring Boot and Android vocabulary.',
        thinkFirst: [
          'Can you name the boundary, public API, hidden adapters, shared state owner, and assembly stage without naming the framework first?',
          'If a ViewModel owns provider choice and Retrofit construction, which responsibilities are now mixed together?',
          'How would the same composition job appear in Spring configuration and in a Hilt/manual Android graph?'
        ],
        codeId: 'mastery-drills-solution',
        codeTitle: 'One solved architecture sketch covering backend pipeline, Android smell diagnosis, and platform translation',
        code: `@RestController
class BillingController(
    private val billingFeature: BillingFeature,
) {
    fun charge(body: ChargeHttpRequest): ChargeHttpResponse {
        // Boundary maps transport input into a public business request.
        val receipt = billingFeature.checkoutService.charge(body.toDomain())
        return ChargeHttpResponse.from(receipt)
    }
}

@Configuration
class BillingModule {
    @Bean
    fun billingFeature(
        gateway: PaymentGateway,
        repository: ReceiptRepository,
        logger: BillingLogger,
    ): BillingFeature {
        // Spring composition root: wiring happens here.
        return createBillingFeature(gateway, repository, logger)
    }
}

@Module
@InstallIn(SingletonComponent::class)
object CheckoutModule {
    @Provides
    fun provideCheckoutRepository(
        api: CheckoutApi,
        dao: ReceiptDao,
    ): CheckoutRepository = DefaultCheckoutRepository(api, dao)
}

@HiltViewModel
class CheckoutViewModel @Inject constructor(
    private val chargeCheckout: ChargeCheckoutUseCase,
) : ViewModel() {
    fun onPayClicked(request: ChargeRequest) {
        // Android boundary calls a public business action.
        viewModelScope.launch { chargeCheckout(request) }
    }
}`,
        explanation: [
          {
            title: 'Drill 1: billing request pipeline',
            body: 'The controller is the boundary, the feature/use case is the public business API, the repository/gateway/logger are hidden collaborators, persistence stores shared state, and response mapping returns public output. The composition root lives beside the runtime flow as the assembly stage.'
          },
          {
            title: 'Drill 2: ViewModel smell diagnosis',
            body: 'If the ViewModel constructs Retrofit, owns mutable cache, and chooses sandbox vs production, then UI state, infrastructure wiring, provider policy, and data coordination have all collapsed into one layer.'
          },
          {
            title: 'Drill 3: composition-root translation',
            body: 'In Spring Boot, composition root often appears as <code>@Configuration</code> or startup wiring. In Android, it appears as Hilt modules, manual app graphs, or feature assembly objects that build the ViewModel/use-case/repository stack.'
          }
        ],
        pipeline: [
          'Boundary maps raw input into a business request.',
          'Public API/use case expresses the business action.',
          'Hidden adapters coordinate persistence, providers, and logging.',
          'Composition root chooses implementations and lifetimes outside the business flow.',
          'Different platforms rename the pieces, but the architectural job remains the same.'
        ],
        spring: [
          'Controller = boundary, <code>@Configuration</code> = composition root, repository/gateway adapters = hidden infrastructure.',
          'Use-case code should stay understandable even without Spring annotations everywhere.',
          'The same pipeline should work for HTTP boundaries, jobs, and message listeners.'
        ],
        android: [
          'Composable/Fragment event = boundary, ViewModel = screen orchestrator, use case = business action, repository = data coordinator.',
          'Hilt module or manual app graph = composition root equivalent.',
          'Retrofit/Room/DAO remain hidden behind repository boundaries.'
        ],
        mistakes: [
          'Treating composition root as if it were the same concept as constructor injection.',
          'Letting the screen layer decide providers, caches, and network clients directly.',
          'Forgetting that shared state and lifetime choice are part of DI correctness too.'
        ],
        better: 'This solved drill is better than a short model answer because it shows the same concept as code, as a runtime pipeline, and as a platform translation. That makes the architectural language easier to reuse in your own projects.'
      }))
    ]
  },
  {
    id: 'confusion-hotspots',
    title: 'Confusion hotspots',
    navLabel: 'Confusion hotspots',
    group: 'Mastery lab',
    level: 'Review',
    time: '12 min',
    sampleSource: 'course synthesis',
    summary: 'A detailed guide to the places learners most often get confused, with side-by-side explanations and concrete examples.',
    sections: [
      panel('Common concept confusions explained carefully', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>People often confuse...</th><th>Actually means...</th><th>Concrete example</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Constructor injection vs composition root</td>
                <td>Constructor injection is how a class receives dependencies. A composition root is where those dependencies are chosen and created.</td>
                <td><code>WelcomeService(messageBuilder, sender)</code> uses constructor injection; <code>main()</code> or <code>@Configuration</code> is the composition root.</td>
              </tr>
              <tr>
                <td>Factory vs container</td>
                <td>A factory usually selects one product. A container stores many creation rules and assembles larger graphs.</td>
                <td><code>SecretVaultFactory.create(...)</code> vs <code>createSecretLessonContainer()</code>.</td>
              </tr>
              <tr>
                <td>Abstraction vs implementation</td>
                <td>An abstraction says what behavior is needed; an implementation says how it is done concretely.</td>
                <td><code>NotificationSender</code> vs <code>EmailNotificationSender</code>.</td>
              </tr>
              <tr>
                <td>Narrow dependency vs broader feature bundle</td>
                <td>A business class should usually receive the smallest role it truly needs; setup code may still keep a richer bundle for convenience.</td>
                <td><code>WelcomeService</code> needs <code>NotificationSender</code>; the composition root may still hold a <code>SendingFeature</code>.</td>
              </tr>
              <tr>
                <td>Singleton vs shared state</td>
                <td>Singleton is a lifetime rule. Shared state is a consequence if the singleton owns mutable data that multiple services use.</td>
                <td>A singleton receipt store means the write side and read side can share history.</td>
              </tr>
              <tr>
                <td>Private constructor factory vs DI</td>
                <td>Private constructor factory protects one value object's validity. DI handles collaboration and graph assembly between many objects.</td>
                <td><code>ApiKey.fromRaw(...)</code> vs wiring <code>CheckoutService</code>.</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Concrete confusing example: same interface, many choices', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>What beginners often think</h3>
            <p>“If I use an interface, I solved flexibility.”</p>
          </div>
          <div class="compare-card dont">
            <h3>What is still missing</h3>
            <p>You still need a place to choose which implementation is used, how long it lives, and whether it is safe to expose at all.</p>
          </div>
          <div class="compare-card do">
            <h3>What to remember</h3>
            <p>Interfaces help substitution. They do not by themselves solve construction policy, lifetime, or security boundaries.</p>
          </div>
        </div>
      `),
      panel('Concrete confusing example: one object, two interface views', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>What sample 8 is showing</h3>
            <p>One recorder object can be viewed as <code>NotificationSender</code> for writing and as <code>SentMessages</code> for reading history afterward.</p>
          </div>
          <div class="compare-card dont">
            <h3>What beginners often assume</h3>
            <p>That if there are two interfaces, there must also be two separate underlying objects. That is not required.</p>
          </div>
          <div class="compare-card do">
            <h3>What to remember</h3>
            <p>An interface describes a role or capability. The same concrete object can satisfy multiple roles when that design makes sense.</p>
          </div>
        </div>
      `),
      panel('Confusion checklist you can reuse', `
        <ul>
          <li>Am I confusing “who uses this” with “who creates this”?</li>
          <li>Am I treating visibility, policy, and lifetime as if they were the same concept?</li>
          <li>Am I assuming a container automatically fixes poor boundaries?</li>
          <li>Am I using “more abstract” as a substitute for “better designed”?</li>
          <li>Can I explain this design without naming the framework first?</li>
        </ul>
      `),
      panel('Challenge checkpoint: separate DAO, repository, and ViewModel in one sentence each', `
        <div class="good">
          <div class="callout-title">Try before opening</div>
          <div>Explain these three Android roles in one sentence each: <code>DAO</code>, <code>Repository</code>, and <code>ViewModel</code>.</div>
        </div>
        <details>
          <summary>Open the model answer</summary>
          <ul>
            <li><strong>DAO:</strong> the Room-facing query object that reads and writes entities.</li>
            <li><strong>Repository:</strong> the data coordinator that decides how DAO, API, mapping, cache policy, and sync work together.</li>
            <li><strong>ViewModel:</strong> the screen-facing state holder that turns user intents into use-case calls and renders results into UI state.</li>
          </ul>
        </details>
      `)
    ]
  },
  {
    id: 'spring-end-to-end-map',
    title: 'Spring end-to-end map',
    navLabel: 'Spring end-to-end map',
    group: 'Mastery lab',
    level: 'Applied',
    time: '16 min',
    sampleSource: 'course synthesis',
    summary: 'A full end-to-end feature map showing how one Spring Boot feature should be structured from controller to configuration to infrastructure and tests.',
    sections: [
      hero(
        'One full Spring Boot feature map from HTTP boundary to infrastructure',
        ['Stage 3 translate', 'Controller', 'Use case', 'Repository', 'Config', 'Tests'],
        `
          <p>This page turns the course ideas into one full feature story: request enters through HTTP, flows through a use case, touches hidden adapters, and returns a public response model.</p>
        `
      ),
      panel('Full feature pipeline', `
        <div class="timeline">
          <div class="step"><strong>1.</strong> HTTP request hits a controller.</div>
          <div class="step"><strong>2.</strong> Controller maps transport DTOs to public request models.</div>
          <div class="step"><strong>3.</strong> Controller calls a feature or use case.</div>
          <div class="step"><strong>4.</strong> Use case coordinates repository, gateway, logger, clock, and config dependencies.</div>
          <div class="step"><strong>5.</strong> Repository and gateway adapters perform infrastructure work.</div>
          <div class="step"><strong>6.</strong> Use case returns a public model; controller maps it back to HTTP response.</div>
        </div>
      `),
      panel('Where each responsibility belongs', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Layer</th><th>Put here</th><th>Do not put here</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Controller</td>
                <td>Request mapping, auth context, response mapping</td>
                <td>Gateway choice, repository construction, business policy</td>
              </tr>
              <tr>
                <td>Application service/use case</td>
                <td>Business coordination and policy</td>
                <td>Spring MVC details, JPA-specific annotations if avoidable</td>
              </tr>
              <tr>
                <td>Configuration</td>
                <td>Object graph wiring, bean choice, environment policy</td>
                <td>Per-request logic</td>
              </tr>
              <tr>
                <td>Infrastructure</td>
                <td>JPA, HTTP clients, SDK wrappers, persistence mapping</td>
                <td>Leaking provider-specific shapes into business-facing contracts</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('End-to-end starter sketch', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Full feature sketch</div><strong>Spring feature flow</strong></div>
            <button class="copy-btn" data-copy-target="spring-full-feature-code">Copy snippet</button>
          </div>
          <pre id="spring-full-feature-code">@RestController
@RequestMapping("/billing")
class BillingController(
    private val billingFeature: BillingFeature,
) {
    @PostMapping("/charge")
    fun charge(@RequestBody body: ChargeHttpRequest): ChargeHttpResponse {
        val receipt = billingFeature.checkoutService.charge(
            ChargeRequest(body.customerId, body.paymentToken, body.amountInCents)
        )
        return ChargeHttpResponse.from(receipt)
    }
}

@Configuration
class BillingModule {
    @Bean
    fun billingFeature(
        repository: ReceiptRepository,
        gateway: PaymentGateway,
        logger: BillingLogger,
        clock: Clock,
    ): BillingFeature = createBillingFeature(repository, gateway, logger, clock)
}</pre>
        </div>
      `),
      panel('Practice translation: map your own backend feature to this shape', teachingTask({
        task: 'Take a backend feature such as orders, subscriptions, reports, or notifications and map it into four boxes: boundary, application/use case, hidden adapters, and configuration. The stricter version below uses payment reconciliation as the concrete worked solution.',
        thinkFirst: [
          'Where does raw web or message input first enter the system?',
          'What is the business sentence the rest of the app should be allowed to say?',
          'Which collaborators are implementation details that should stay hidden?',
          'Where do you choose implementations and scopes?'
        ],
        codeId: 'mastery-backend-translation-solution',
        codeTitle: 'Worked backend translation using a reconciliation feature',
        code: `@RestController
@RequestMapping("/payments")
class PaymentReconciliationController(
    private val reconcilePayments: ReconcilePaymentsUseCase,
) {
    @PostMapping("/reconcile")
    fun reconcile(@RequestBody body: ReconcileHttpRequest): ReconcileHttpResponse {
        val result = reconcilePayments(
            ReconcilePaymentRequest(
                paymentId = body.paymentId,
                providerStatus = body.providerStatus,
            )
        )
        return ReconcileHttpResponse.from(result)
    }
}

class ReconcilePaymentsUseCase(
    private val paymentRepository: PaymentRepository,
    private val providerAuditClient: ProviderAuditClient,
    private val logger: BillingLogger,
) {
    operator fun invoke(request: ReconcilePaymentRequest): ReconcileResult {
        val payment = paymentRepository.findById(request.paymentId)
        providerAuditClient.recordReconciliation(request.paymentId, request.providerStatus)
        val updated = paymentRepository.updateStatus(payment.id, request.providerStatus)
        logger.log("reconciled payment=" + updated.id)
        return ReconcileResult(updated.id, updated.status)
    }
}

@Configuration
class PaymentModule {
    @Bean
    fun reconcilePaymentsUseCase(
        paymentRepository: PaymentRepository,
        providerAuditClient: ProviderAuditClient,
        logger: BillingLogger,
    ): ReconcilePaymentsUseCase {
        return ReconcilePaymentsUseCase(paymentRepository, providerAuditClient, logger)
    }
}`,
        explanation: [
          {
            title: 'Boundary',
            body: 'The controller receives raw HTTP data and translates it into a business request object. That is all boundary code should do.'
          },
          {
            title: 'Application/use case',
            body: 'The use case speaks in business language: reconcile payments. It coordinates repository, provider audit, and logging without exposing provider or persistence details to callers.'
          },
          {
            title: 'Hidden adapters and configuration',
            body: 'Repository and audit client are infrastructure seams, while <code>@Configuration</code> is the composition-root equivalent that chooses implementations and scopes.'
          }
        ],
        pipeline: [
          'HTTP boundary parses request data.',
          'Boundary maps transport DTO to application request model.',
          'Use case coordinates repository, provider, and logger adapters.',
          'Result returns as a public model and maps back to HTTP response.',
          'Configuration wires the whole graph.'
        ],
        spring: [
          'This is a direct Spring Boot mapping of the four-box exercise.',
          'You can reuse the same shape for jobs, consumers, and scheduled tasks by swapping the boundary type.',
          'Tests can focus on the use case with fake adapters first.'
        ],
        android: [
          'The Android translation uses ViewModel as boundary, use case as business action, repository as hidden data coordinator, and Hilt module as graph assembly.',
          'The four-box thinking stays the same even though the framework words change.',
          'DTO/entity/domain/UI separation is the Android equivalent of transport/domain/persistence separation here.'
        ],
        mistakes: [
          'Stuffing provider-specific DTOs and persistence details into controller code.',
          'Treating configuration as business logic instead of assembly logic.',
          'Skipping a public use case and making controllers talk to raw adapters directly.'
        ],
        better: 'This solution is better because it turns the translation exercise into a repeatable blueprint. You can now take almost any backend feature and place it into the same architecture boxes deliberately.'
      }))
    ]
  },
  {
    id: 'android-end-to-end-map',
    title: 'Android end-to-end map',
    navLabel: 'Android end-to-end map',
    group: 'Mastery lab',
    level: 'Applied',
    time: '16 min',
    sampleSource: 'course synthesis',
    summary: 'A full Android feature map showing how UI, ViewModel, use cases, repositories, local/remote sources, and workers fit together in one coherent architecture.',
    sections: [
      hero(
        'One full Android feature map from UI intent to repository and worker reuse',
        ['Stage 3 translate', 'Compose/UI', 'ViewModel', 'Use case', 'Repository', 'WorkManager'],
        `
          <p>This page shows the whole Android flow in one place so the boundaries stop feeling abstract.</p>
        `
      ),
      panel('Full Android feature pipeline', `
        <div class="timeline">
          <div class="step"><strong>1.</strong> User triggers a UI intent from a screen.</div>
          <div class="step"><strong>2.</strong> ViewModel translates the intent into use-case calls.</div>
          <div class="step"><strong>3.</strong> Use cases coordinate repository behavior.</div>
          <div class="step"><strong>4.</strong> Repository coordinates Room, Retrofit, cache, and mapping.</div>
          <div class="step"><strong>5.</strong> DAO executes concrete Room queries and updates; it is the local database boundary, not the full data-policy owner.</div>
          <div class="step"><strong>6.</strong> Worker/background sync reuses repository or use-case logic instead of rewriting it.</div>
          <div class="step"><strong>7.</strong> UI observes state updates and renders them.</div>
        </div>
      `),
      panel('Where each Android responsibility belongs', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Layer</th><th>Put here</th><th>Do not put here</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Composable / Fragment / Activity</td>
                <td>Rendering, event dispatch, lifecycle-aware binding</td>
                <td>Network calls, DB coordination, business policy</td>
              </tr>
              <tr>
                <td>ViewModel</td>
                <td>UI state orchestration, intent handling</td>
                <td>Direct Retrofit + Room + SDK glue all at once</td>
              </tr>
              <tr>
                <td>Use case</td>
                <td>Focused business action orchestration</td>
                <td>UI rendering logic</td>
              </tr>
              <tr>
                <td>Repository</td>
                <td>Local/remote coordination and data ownership</td>
                <td>Screen-specific UI state</td>
              </tr>
              <tr>
                <td>DAO</td>
                <td>Room queries, inserts, updates, entity flows, table-shaped persistence work</td>
                <td>Sync policy, screen orchestration, feature-level business rules</td>
              </tr>
              <tr>
                <td>Worker</td>
                <td>Background execution entry point</td>
                <td>Duplicated business logic that should live in repository/use case</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('End-to-end starter sketch', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Full feature sketch</div><strong>Android feature flow</strong></div>
            <button class="copy-btn" data-copy-target="android-full-feature-code">Copy snippet</button>
          </div>
          <pre id="android-full-feature-code">@HiltViewModel
class CheckoutViewModel @Inject constructor(
    private val chargeCheckout: ChargeCheckoutUseCase,
    private val loadReceipts: LoadReceiptsUseCase,
) : ViewModel() {
    private val _state = MutableStateFlow(CheckoutUiState())
    val state: StateFlow&lt;CheckoutUiState&gt; = _state

    fun onPayClicked(request: ChargeRequest) {
        viewModelScope.launch {
            val receipt = chargeCheckout(request)
            _state.update { it.copy(lastReceipt = receipt) }
        }
    }
}

class DefaultCheckoutRepository(
    private val api: CheckoutApi,
    private val dao: ReceiptDao,
) : CheckoutRepository { /* local + remote coordination */ }</pre>
        </div>
      `),
      panel('Practice translation: map your own Android feature to this shape', teachingTask({
        task: 'Pick one Android feature and map it into UI, ViewModel, use case, repository, local/remote data sources, and worker/background reuse. The worked solution below uses offline order tracking so you can see DTO/entity/domain/UI separation concretely.',
        thinkFirst: [
          'Which data is temporary screen state vs stable app-facing data?',
          'Which actions deserve their own use cases?',
          'Where do Room, DAO, Retrofit, mapping, and worker reuse each belong?'
        ],
        codeId: 'mastery-android-translation-solution',
        codeTitle: 'Worked Android translation using an offline order-tracking feature',
        code: `data class OrderFilterUiState(
    val selectedStatus: String? = null,
)

@HiltViewModel
class OrderTrackingViewModel @Inject constructor(
    private val observeOrders: ObserveOrdersUseCase,
    private val refreshOrders: RefreshOrdersUseCase,
) : ViewModel() {
    private val _state = MutableStateFlow(OrderTrackingUiState())
    val state: StateFlow<OrderTrackingUiState> = _state

    init {
        viewModelScope.launch {
            observeOrders().collect { orders ->
                _state.update { it.copy(orders = orders) }
            }
        }
    }

    fun onPullToRefresh() {
        viewModelScope.launch { refreshOrders() }
    }
}

class DefaultOrderRepository(
    private val api: OrderApi,
    private val dao: OrderDao,
) : OrderRepository {
    override fun observeOrders(): Flow<List<Order>> {
        return dao.observeAll().map { entities -> entities.map { it.toDomain() } }
    }

    override suspend fun refreshOrders() {
        val dtos = api.loadOrders()
        dao.replaceAll(dtos.map { it.toEntity() })
    }
}

@HiltWorker
class OrderRefreshWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted params: WorkerParameters,
    private val repository: OrderRepository,
) : CoroutineWorker(appContext, params) {
    override suspend fun doWork(): Result {
        repository.refreshOrders()
        return Result.success()
    }
}`,
        explanation: [
          {
            title: 'UI/ViewModel layer',
            body: 'The ViewModel owns screen-facing orchestration and state updates. It does not know Retrofit endpoints or DAO SQL details.'
          },
          {
            title: 'Use cases and repository',
            body: 'Use cases express actions such as observing or refreshing orders, while the repository coordinates local/remote data and mapping boundaries.'
          },
          {
            title: 'DAO, Retrofit, and worker reuse',
            body: 'DAO owns Room operations, Retrofit owns transport, and the worker reuses repository logic rather than rebuilding the data path separately.'
          }
        ],
        pipeline: [
          'UI event enters ViewModel.',
          'ViewModel calls use case.',
          'Use case delegates to repository.',
          'Repository coordinates Retrofit + DAO + mapping.',
          'Worker reuses the same repository refresh path for background sync.'
        ],
        spring: [
          'The backend analogue is controller/job boundary → use case → repository/gateway → configuration.',
          'Transport/domain/persistence separation in Spring mirrors UI/domain/entity/DTO separation in Android.',
          'The same architecture language works across both stacks.'
        ],
        android: [
          'This is the exact Android mapping the course wants you to internalize: UI → ViewModel → use case → repository → DAO/Retrofit → worker reuse.',
          'Room entities stay local, Retrofit DTOs stay remote, domain models stay app-facing, and UI state stays screen-facing.',
          'Hilt acts as the composition root host, not as the source of the architecture itself.'
        ],
        mistakes: [
          'Letting the ViewModel call DAO and Retrofit directly together.',
          'Treating entities or DTOs as if they were already UI state.',
          'Writing a separate worker-only sync pipeline instead of reusing repository logic.'
        ],
        better: 'This worked translation is better than a checklist because it gives you a concrete code skeleton you can adapt. It also makes the Android pipeline comparable to the backend pipeline using the same underlying architecture language.'
      })),
      panel('Mapper placement checkpoint: can you separate DTO, entity, and domain clearly?', teachingTask({
        task: 'Model an Android receipt feature so that transport, persistence, domain, and presentation each keep their own type. You must place <code>ReceiptResponseDto</code>, <code>ReceiptEntity</code>, <code>PaymentReceipt</code>, and <code>CheckoutUiState</code> in the correct layer, then show exactly which mapper functions connect them.',
        thinkFirst: [
          'Which type exists only because of HTTP transport?',
          'Which type exists only because of Room table storage?',
          'Which type should the rest of the feature speak in business language?',
          'Which type belongs purely to the screen state that Compose or XML rendering consumes?'
        ],
        codeId: 'mastery-mapper-placement-solution',
        codeTitle: 'DTO → entity → domain → UI state with explicit mapper functions',
        code: `data class ReceiptResponseDto(
    val id: String,
    val amountInCents: Int,
    val gatewayName: String,
)

@Entity(tableName = "receipts")
data class ReceiptEntity(
    @PrimaryKey val id: String,
    val amountInCents: Int,
    val gatewayName: String,
    val cachedAtMillis: Long,
)

data class PaymentReceipt(
    val receiptId: String,
    val amountInCents: Int,
    val gatewayName: String,
)

data class CheckoutUiState(
    val items: List<ReceiptRowUi> = emptyList(),
    val isRefreshing: Boolean = false,
)

data class ReceiptRowUi(
    val title: String,
    val subtitle: String,
)

fun ReceiptResponseDto.toEntity(cachedAtMillis: Long): ReceiptEntity {
    // Remote DTO is translated into a Room-shaped persistence object.
    return ReceiptEntity(
        id = id,
        amountInCents = amountInCents,
        gatewayName = gatewayName,
        cachedAtMillis = cachedAtMillis,
    )
}

fun ReceiptEntity.toDomain(): PaymentReceipt {
    // Persistence shape becomes a business-facing domain model.
    return PaymentReceipt(
        receiptId = id,
        amountInCents = amountInCents,
        gatewayName = gatewayName,
    )
}

fun PaymentReceipt.toUi(): ReceiptRowUi {
    // ViewModel/presentation mapping converts domain meaning into screen wording.
    return ReceiptRowUi(
        title = "Receipt " + receiptId,
        subtitle = gatewayName + " • " + amountInCents + " cents",
    )
}

class CheckoutViewModel(
    private val observeReceipts: ObserveReceiptsUseCase,
) : ViewModel() {
    val state: StateFlow<CheckoutUiState> = observeReceipts()
        .map { receipts ->
            // Screen state is built from domain models, not from DTOs or entities directly.
            CheckoutUiState(items = receipts.map { it.toUi() })
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), CheckoutUiState())
}`,
        explanation: [
          {
            title: 'DTO is transport-only',
            body: '<code>ReceiptResponseDto</code> exists because the server sends JSON. It should not become the app\'s universal truth type because its shape is owned by the network boundary.'
          },
          {
            title: 'Entity is persistence-only',
            body: '<code>ReceiptEntity</code> exists because Room needs a table-oriented representation. It is allowed to contain cache timestamps or storage-only details that the UI should never depend on directly.'
          },
          {
            title: 'Domain model is the feature-facing middle language',
            body: '<code>PaymentReceipt</code> is the clean business model the rest of the feature can understand without knowing Retrofit or Room details.'
          },
          {
            title: 'UI state is presentation-specific',
            body: '<code>CheckoutUiState</code> and <code>ReceiptRowUi</code> exist because the screen needs rendering-friendly data. That is a different concern from transport or persistence.'
          }
        ],
        pipeline: [
          'Retrofit returns <code>ReceiptResponseDto</code> objects from the remote boundary.',
          'Repository maps DTOs into <code>ReceiptEntity</code> for Room persistence.',
          'DAO exposes entities, and repository maps them into domain <code>PaymentReceipt</code> models.',
          'ViewModel maps domain models into <code>CheckoutUiState</code> for rendering.',
          'Each mapping step preserves one clean boundary instead of leaking one type everywhere.'
        ],
        spring: [
          'This is symmetrical with Spring Boot: HTTP DTO at the controller edge, entity at the persistence edge, domain model in the middle, response/view model at the outbound edge.',
          'Use similarly named functions like <code>toDomain()</code>, <code>toEntity()</code>, and <code>from(...)</code> so the shape transitions stay obvious.',
          'If a JPA repository returns controller DTOs directly, the same boundary leak is happening in backend form.'
        ],
        android: [
          'Retrofit owns DTOs, Room owns entities, the repository owns mapping/orchestration, and the ViewModel owns UI state.',
          'This is the cleanest Room/DAO/Retrofit/repository separation to internalize for real projects.',
          'Keeping explicit <code>toEntity</code>, <code>toDomain</code>, and <code>toUi</code> functions makes debugging and future refactors much easier.'
        ],
        mistakes: [
          'Returning DTOs from the repository because it feels quicker.',
          'Letting the DAO return UI-state objects directly.',
          'Skipping the domain model and forcing the screen to understand cache/storage details.',
          'Naming everything “ReceiptModel” so the boundaries become impossible to read.'
        ],
        better: 'This solution is better because it removes ambiguity. Each type now has one reason to exist, one owner boundary, and one obvious next mapping step. That makes the data path teachable, debuggable, and scalable.'
      })),
      panel('Android challenge: draw the DAO-aware data path', teachingTask({
        task: 'Implement the full “load saved receipts” path using these boxes deliberately: UI, ViewModel, use case, repository, DAO, Room database, API, and worker refresh. Your solution must show where each call goes and must reuse repository logic from the worker instead of creating a second sync path.',
        thinkFirst: [
          'Which layer should expose a flow for the screen to observe?',
          'Which layer should decide when network refresh happens?',
          'Which layer should perform concrete Room queries?',
          'How can the worker refresh data without bypassing the repository boundary?'
        ],
        codeId: 'mastery-android-dao-data-path-solution',
        codeTitle: 'DAO-aware load path with repository-owned refresh and worker reuse',
        code: `@Dao
interface ReceiptDao {
    @Query("SELECT * FROM receipts ORDER BY cachedAtMillis DESC")
    fun observeAll(): Flow<List<ReceiptEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(receipts: List<ReceiptEntity>)
}

interface CheckoutApi {
    @GET("billing/receipts")
    suspend fun loadReceipts(): List<ReceiptResponseDto>
}

class CheckoutRepository(
    private val api: CheckoutApi,
    private val dao: ReceiptDao,
    private val clock: TimeProvider,
) {
    fun observeReceipts(): Flow<List<PaymentReceipt>> {
        // Repository turns DAO entity flow into domain flow for the rest of the app.
        return dao.observeAll().map { entities -> entities.map { it.toDomain() } }
    }

    suspend fun refreshReceipts() {
        // Repository owns the remote call and the persistence write-back.
        val remote = api.loadReceipts()
        val entities = remote.map { dto -> dto.toEntity(clock.nowMillis()) }
        dao.insertAll(entities)
    }
}

class ObserveReceiptsUseCase(
    private val repository: CheckoutRepository,
) {
    operator fun invoke(): Flow<List<PaymentReceipt>> = repository.observeReceipts()
}

class RefreshReceiptsUseCase(
    private val repository: CheckoutRepository,
) {
    suspend operator fun invoke() {
        repository.refreshReceipts()
    }
}

@HiltViewModel
class CheckoutViewModel @Inject constructor(
    observeReceipts: ObserveReceiptsUseCase,
    private val refreshReceipts: RefreshReceiptsUseCase,
) : ViewModel() {
    val state: StateFlow<CheckoutUiState> = observeReceipts()
        .map { receipts -> CheckoutUiState(items = receipts.map { it.toUi() }) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), CheckoutUiState())

    fun onPullToRefresh() {
        // Screen event triggers the refresh use case instead of touching DAO/API directly.
        viewModelScope.launch { refreshReceipts() }
    }
}

@HiltWorker
class ReceiptRefreshWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted params: WorkerParameters,
    private val refreshReceipts: RefreshReceiptsUseCase,
) : CoroutineWorker(appContext, params) {
    override suspend fun doWork(): Result {
        // Worker reuses the same use case/repository path as the foreground flow.
        refreshReceipts()
        return Result.success()
    }
}`,
        explanation: [
          {
            title: 'DAO owns local query and insert mechanics',
            body: 'The DAO is where SQL-like Room operations belong. It does not decide sync policy or screen behavior.'
          },
          {
            title: 'Repository owns the full data story',
            body: 'The repository decides how API responses become stored entities and how stored entities become domain models observed by the rest of the app.'
          },
          {
            title: 'Use cases give names to the actions',
            body: '<code>ObserveReceiptsUseCase</code> and <code>RefreshReceiptsUseCase</code> let the ViewModel and worker ask for business-level actions rather than data-source mechanics.'
          },
          {
            title: 'Worker reuse protects architecture consistency',
            body: 'The worker does not invent its own “API then DAO” sequence. It reuses the same repository-owned refresh flow, so foreground and background behavior stay aligned.'
          }
        ],
        pipeline: [
          'UI starts observing screen state from the ViewModel.',
          'ViewModel observes a use case, which observes repository domain data.',
          'Repository observes DAO entity flow and maps entities into domain receipts.',
          'Refresh use case tells the repository to call the API, map DTOs to entities, and write through the DAO.',
          'Worker uses the same refresh use case, preserving one consistent sync path.'
        ],
        spring: [
          'This mirrors backend architecture: a scheduled job should call the same application service used by controllers instead of bypassing the service and poking repositories directly.',
          'The repository/adapter boundary in Spring plays the same role the repository/DAO/API split plays here.',
          'A second ad hoc job-only persistence path in Spring is the backend equivalent of the Android anti-pattern fixed here.'
        ],
        android: [
          'This is the Android path to memorize: UI → ViewModel → use case → repository → DAO/API → Room, with WorkManager reusing the same use case.',
          'Room entities stay local, Retrofit DTOs stay remote, and the screen only sees domain/UI mappings.',
          'Hilt provides the graph, but the repository still owns the coordination logic.'
        ],
        mistakes: [
          'Calling DAO from the ViewModel because it is “already local”.',
          'Letting the worker call Retrofit and DAO directly in parallel to the repository path.',
          'Treating refresh as only a UI concern instead of a reusable data action.',
          'Letting Room entities leak all the way to the UI layer.'
        ],
        better: 'This solution is better because it gives you one stable mental movie for the feature. Every read and refresh path passes through the same core architecture, so the app stays teachable and maintainable even after background sync is added.'
      }))
    ]
  },
  {
    id: 'architecture-review-checklists',
    title: 'Architecture review checklists',
    navLabel: 'Architecture review checklists',
    group: 'Mastery lab',
    level: 'Review',
    time: '11 min',
    sampleSource: 'course synthesis',
    summary: 'Practical checklists you can use while building your own features in backend or Android to catch design problems before they spread.',
    sections: [
      panel('General architecture review checklist', `
        <ul class="lesson-checklist">
          <li>Can I describe the public API in business language instead of infrastructure language?</li>
          <li>Are the dependencies explicit in constructors?</li>
          <li>Is creation policy kept at the edge?</li>
          <li>Do hidden/sensitive adapters stay hidden enough?</li>
          <li>Does the lifetime of each dependency match the lifetime of the data it owns?</li>
          <li>Can I test the business logic without booting the whole framework?</li>
        </ul>
      `),
      panel('Spring Boot review checklist', `
        <ul class="lesson-checklist">
          <li>Are controllers thin boundaries instead of policy centers?</li>
          <li>Does the application layer stay understandable without Spring annotations everywhere?</li>
          <li>Are request-specific values kept out of singleton bean fields?</li>
          <li>Are repositories and adapters hiding provider/framework-specific details properly?</li>
          <li>Do the tests match the right level: unit, slice, integration, or end-to-end?</li>
        </ul>
      `),
      panel('Android review checklist', `
        <ul class="lesson-checklist">
          <li>Is the ViewModel coordinating UI state instead of doing raw data-source wiring?</li>
          <li>Does the repository own local/remote merge rules?</li>
          <li>Is screen-specific state kept out of app-wide singletons?</li>
          <li>Do workers reuse repository/use-case logic instead of duplicating background flows?</li>
          <li>Would a new developer quickly know where a change belongs?</li>
        </ul>
      `),
      panel('Smell detector', `
        <div class="compare-grid">
          <div class="compare-card dont">
            <h3>Likely smell</h3>
            <p>“This class needs the whole application context/container because it might need many things.”</p>
          </div>
          <div class="compare-card do">
            <h3>Healthier alternative</h3>
            <p>List the concrete dependencies the class really needs and inject those explicitly. If there are too many, split responsibilities or move creation policy outward.</p>
          </div>
          <div class="compare-card dont">
            <h3>Likely smell</h3>
            <p>“This singleton stores user/screen/job state because it is convenient.”</p>
          </div>
          <div class="compare-card do">
            <h3>Healthier alternative</h3>
            <p>Move that state into request, ViewModel, feature, or worker scope—whichever matches the true lifetime of the data.</p>
          </div>
        </div>
      `),
      panel('Final mastery rubric', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>If you can do this...</th><th>Your understanding level</th><th>Next move</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Recognize constructor injection and explain it</td>
                <td>Foundation</td>
                <td>Practice translating it into your own backend/mobile features</td>
              </tr>
              <tr>
                <td>Choose between factory, manual root, and container with reasons</td>
                <td>Applied</td>
                <td>Review trade-offs using a real feature from work or a side project</td>
              </tr>
              <tr>
                <td>Place state in the right scope and debug scope bugs</td>
                <td>Strong</td>
                <td>Stress-test your design with concurrent requests, screen changes, and jobs</td>
              </tr>
              <tr>
                <td>Add production concerns without breaking boundaries</td>
                <td>Mastery</td>
                <td>Design with retries, redaction, idempotency, metrics, and deterministic tests on purpose</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Capstone progressive challenge path', teachingTask({
        task: 'Build one capstone feature in a way that proves mastery instead of recognition only. The feature is “payment reconciliation with offline receipt review”: backend receives webhook updates and exposes receipt history, Android shows receipt history offline and refreshes in the background. Solve it with one clean architecture story that keeps boundaries, scopes, mapping, and operational concerns in the right place.',
        thinkFirst: [
          'What is the public capability on the backend, and what is the public capability on Android?',
          'Which parts are boundary-only, which parts are business/application logic, and which parts are infrastructure adapters?',
          'Where should idempotency, redaction, and retry concerns live without collapsing the architecture?',
          'How will the Android worker reuse the same repository/use-case path instead of bypassing it?'
        ],
        codeId: 'mastery-capstone-worked-solution',
        codeTitle: 'Cross-platform capstone worked solution with Spring Boot and Android symmetry',
        code: `@RestController
class PaymentWebhookController(
    private val reconcilePayment: ReconcilePaymentUseCase,
) {
    @PostMapping("/payments/webhook")
    fun handle(@RequestBody request: PaymentWebhookRequest): ResponseEntity<Unit> {
        // Boundary maps provider transport into a business request object.
        reconcilePayment(request.toCommand())
        return ResponseEntity.accepted().build()
    }
}

class ReconcilePaymentUseCase(
    private val repository: PaymentRepository,
    private val auditLogger: BillingLogger,
    private val idempotencyChecker: IdempotencyChecker,
) {
    operator fun invoke(command: ReconcilePaymentCommand) {
        // Business layer owns idempotency and orchestration, not the controller.
        if (idempotencyChecker.hasProcessed(command.eventId)) return

        repository.updatePaymentStatus(command.paymentId, command.newStatus)
        auditLogger.log("payment_reconciled paymentId=" + command.paymentId + ", status=" + command.newStatus)
    }
}

@Configuration
class BillingModule {
    @Bean
    fun reconcilePaymentUseCase(
        repository: PaymentRepository,
        auditLogger: BillingLogger,
        idempotencyChecker: IdempotencyChecker,
    ): ReconcilePaymentUseCase {
        // Spring hosts the composition root; it does not replace the architecture.
        return ReconcilePaymentUseCase(repository, auditLogger, idempotencyChecker)
    }
}

@HiltViewModel
class ReceiptHistoryViewModel @Inject constructor(
    observeReceipts: ObserveReceiptsUseCase,
    private val refreshReceipts: RefreshReceiptsUseCase,
) : ViewModel() {
    val state: StateFlow<CheckoutUiState> = observeReceipts()
        .map { receipts -> CheckoutUiState(items = receipts.map { it.toUi() }) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), CheckoutUiState())

    fun onRefresh() {
        // Screen boundary triggers business action instead of orchestrating Retrofit/Room itself.
        viewModelScope.launch { refreshReceipts() }
    }
}

class RefreshReceiptsUseCase @Inject constructor(
    private val repository: CheckoutRepository,
) {
    suspend operator fun invoke() {
        // Use case names the action and keeps the ViewModel small.
        repository.refreshReceipts()
    }
}

class CheckoutRepository @Inject constructor(
    private val api: CheckoutApi,
    private val dao: ReceiptDao,
    private val clock: TimeProvider,
) {
    fun observeReceipts(): Flow<List<PaymentReceipt>> =
        dao.observeAll().map { entities -> entities.map { it.toDomain() } }

    suspend fun refreshReceipts() {
        // Repository owns remote fetch, entity mapping, and DAO persistence.
        val remote = api.loadReceipts()
        dao.insertAll(remote.map { dto -> dto.toEntity(clock.nowMillis()) })
    }
}

@HiltWorker
class ReceiptSyncWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted params: WorkerParameters,
    private val refreshReceipts: RefreshReceiptsUseCase,
) : CoroutineWorker(appContext, params) {
    override suspend fun doWork(): Result {
        // Worker reuses the same use-case path as the foreground refresh flow.
        refreshReceipts()
        return Result.success()
    }
}`,
        explanation: [
          {
            title: 'The backend boundary remains thin',
            body: 'The webhook controller only translates provider input into a business command and delegates. It does not own idempotency, repository coordination, or logging policy.'
          },
          {
            title: 'Operational concerns stay in sensible owners',
            body: 'Idempotency checking and audit logging belong near the business use case because they are part of application-level correctness, not view rendering or transport parsing.'
          },
          {
            title: 'Android symmetry matters',
            body: 'The Android flow mirrors the backend language: boundary at the edge, named use case in the middle, repository/adapters below, and worker reuse for background execution.'
          },
          {
            title: 'Repository and DAO stay sharply separated',
            body: 'The repository owns the data story, while the DAO owns the concrete Room operations. That is the same separation you want to reproduce repeatedly in real Android features.'
          }
        ],
        pipeline: [
          'Backend webhook boundary receives provider event and maps it to a command.',
          'Backend use case performs idempotency check, updates repository state, and records safe audit logs.',
          'Android screen boundary observes state through the ViewModel and triggers refresh through a use case.',
          'Android repository coordinates API fetch, DTO → entity mapping, DAO writes, and entity → domain reads.',
          'Android worker reuses the same refresh use case, proving one shared architecture rather than two competing paths.'
        ],
        spring: [
          'Use a controller or message listener as the boundary, a plain application/use-case class for reconciliation logic, and <code>@Configuration</code> to assemble the graph.',
          'Keep idempotency, logging, and repository orchestration out of the controller so the feature remains testable.',
          'Provider DTOs should stop at the boundary and be translated into command/domain shapes before they reach the business layer.'
        ],
        android: [
          'Use ViewModel for screen state, use case for named actions, repository for data coordination, DAO for Room operations, and Retrofit for transport.',
          'Keep DTO/entity/domain/UI shapes separate and map them deliberately.',
          'Use Hilt workers or manual worker graphs to reuse the same refresh use case instead of building a parallel sync implementation.'
        ],
        mistakes: [
          'Letting the webhook controller own idempotency and repository decisions directly.',
          'Letting the Android ViewModel call Retrofit and DAO together because it “already knows the screen”.',
          'Treating worker sync as a separate feature that can bypass repository/use-case boundaries.',
          'Mixing provider transport models, persistence entities, and UI state into one shared mega-model.'
        ],
        better: 'This capstone is better than a challenge list alone because it gives you one full reference solution you can compare your own designs against. It ties together the whole course: boundaries, constructor injection, factories/modules, state ownership, Android DAO separation, and production concerns all in one architecture story.'
      })),
      panel('Exam-style capstone levels', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Level</th><th>Prompt style</th><th>What you must deliver</th><th>What a strong answer includes</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Level 1 — Identify</td>
                <td>Spot the boundary, public API, hidden adapters, and likely smells in a short snippet or scenario.</td>
                <td>A labeled explanation in plain language.</td>
                <td>Correct role names, explicit dependency reasoning, and at least one anti-pattern called out accurately.</td>
              </tr>
              <tr>
                <td>Level 2 — Design</td>
                <td>Design a small feature for backend or Android.</td>
                <td>Boundary, use case, repository/adapter split, creation policy, and scope choices.</td>
                <td>Clear separation of responsibilities plus a justified choice of factory/manual root/container as needed.</td>
              </tr>
              <tr>
                <td>Level 3 — Translate</td>
                <td>Map the same feature into both Spring Boot and Android language.</td>
                <td>Two parallel architecture descriptions.</td>
                <td>Accurate mapping of controller vs ViewModel, configuration vs Hilt module, repository vs DAO/Retrofit, and worker/job boundaries.</td>
              </tr>
              <tr>
                <td>Level 4 — Production hardening</td>
                <td>Add retries, idempotency, redaction, metrics, and deterministic testing.</td>
                <td>An evolved design that keeps boundaries intact.</td>
                <td>Correct ownership of operational concerns without shoving them into screens/controllers/business internals randomly.</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Expected-solution rubric you can grade yourself with', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Criterion</th><th>0 points</th><th>1 point</th><th>2 points</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Boundary clarity</td>
                <td>Boundary is missing or mixed with business/data logic</td>
                <td>Boundary exists but still owns too much policy</td>
                <td>Boundary is thin and clearly translated from raw input into business request</td>
              </tr>
              <tr>
                <td>Dependency placement</td>
                <td>Dependencies are hidden or constructed inline</td>
                <td>Some dependencies are explicit, but important ones are misplaced</td>
                <td>Dependencies are explicit and placed in the correct layer</td>
              </tr>
              <tr>
                <td>State and scope reasoning</td>
                <td>No clear state owner or lifetime choice</td>
                <td>Some scope choices are correct but key state-sharing or leak risks remain</td>
                <td>State owner and lifetime decisions are deliberate and justified</td>
              </tr>
              <tr>
                <td>Android data boundary clarity</td>
                <td>Repository/DAO/Retrofit responsibilities are blurred</td>
                <td>Some separation exists but query-flow or mapping ownership is unclear</td>
                <td>Repository, DAO, entity, Retrofit, and ViewModel roles are sharply separated</td>
              </tr>
              <tr>
                <td>Production realism</td>
                <td>Retries/redaction/idempotency/testing are ignored</td>
                <td>Mentions concerns but places them weakly</td>
                <td>Operational concerns are assigned to sensible owners without collapsing architecture</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p><strong>Suggested grading:</strong> 0–3 = still shaky, 4–6 = improving, 7–8 = strong, 9–10 = mastery-ready. Use the rubric to critique your own design before you compare it with the course examples.</p>
      `),
      panel('Capstone prompt bank', `
        <details>
          <summary>Prompt A — Spring Boot payment reconciliation</summary>
          <p>Design a reconciliation feature that receives webhook events, updates payment state, exposes a query API, and records safe audit logs. Include boundary, use case, repository, provider adapter, configuration, and testing seam.</p>
        </details>
        <details>
          <summary>Prompt B — Android offline order tracking</summary>
          <p>Design an order-tracking feature with a screen, ViewModel, use cases, Room entities, DAO queries, Retrofit refresh, and WorkManager sync. Explain the exact query flow and where mapping lives.</p>
        </details>
        <details>
          <summary>Prompt C — Cross-platform translation</summary>
          <p>Take one domain like invoices, subscriptions, or chat and explain how you would structure it in both Spring Boot and Android while keeping the public API, hidden adapters, and shared-state story consistent.</p>
        </details>
      `)
    ]
  }
];

