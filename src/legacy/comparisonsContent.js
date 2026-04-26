import { hero, panel, teachingTask } from './contentBuilders';

export const comparisonViews = [
  {
    id: 'architecture-comparisons',
    title: 'Architecture comparisons',
    navLabel: 'Architecture comparisons',
    group: 'Architecture comparisons',
    level: 'Intermediate',
    time: '15 min',
    sampleSource: 'sample2-8 + samplecode.txt',
    summary: 'A side-by-side interactive comparison of no DI, constructor DI, explicit factories, manual composition roots, containers, hidden-boundary factories, and the service locator anti-pattern.',
    sections: [
      hero(
        'Compare the architecture patterns side by side before choosing one',
        ['Interactive', 'Where/how/when', 'Backend + Android', 'Pattern chooser'],
        `
          <p>This page is your <strong>master comparison lab</strong>. Instead of learning each pattern in isolation, you can now compare how they differ in <strong>creation policy</strong>, <strong>visibility</strong>, <strong>testability</strong>, <strong>shared state</strong>, and <strong>scaling</strong>.</p>
          <div class="good">
            <div class="callout-title">Rule of thumb</div>
            <div>Choose the <strong>simplest pattern that solves the real problem</strong>. Complexity should be earned by a real need, not added because it sounds advanced.</div>
          </div>
        `
      ),
      panel('Interactive architecture compare mode', `
        <div class="tabs" data-tab-group="architecture-compare">
          <button class="tab-btn active" data-tab="nodi">No DI</button>
          <button class="tab-btn" data-tab="constructor">Constructor DI</button>
          <button class="tab-btn" data-tab="factory">Explicit factory</button>
          <button class="tab-btn" data-tab="manual-root">Manual composition root</button>
          <button class="tab-btn" data-tab="container">DI container</button>
          <button class="tab-btn" data-tab="hidden">Hidden-boundary factory</button>
          <button class="tab-btn" data-tab="locator">Service locator smell</button>
        </div>

        <div class="tab-content active" data-tab-panel="nodi">
          <div class="compare-grid">
            <div class="compare-card dont">
              <h3>What it looks like</h3>
              <p>A class creates its own API client, repository, logger, or gateway internally. Concretely, the business class says “I will pick my own helpers,” which immediately mixes business flow with setup policy.</p>
            </div>
            <div class="compare-card dont">
              <h3>Where decisions live</h3>
              <p>Inside business classes, which mixes orchestration with construction and infrastructure choice.</p>
            </div>
            <div class="compare-card dont">
              <h3>Best for</h3>
              <p>Almost never beyond tiny throwaway examples.</p>
            </div>
            <div class="compare-card dont">
              <h3>Main risks</h3>
              <ul>
                <li>Tight coupling</li>
                <li>Hard testing</li>
                <li>Scattered policy</li>
                <li>Hidden dependencies</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="constructor">
          <div class="compare-grid">
            <div class="compare-card do">
              <h3>What it looks like</h3>
              <p>A class receives what it needs via constructor parameters. Concretely, the class says “if you hand me a repository and logger, I can do my job.”</p>
            </div>
            <div class="compare-card do">
              <h3>Where decisions live</h3>
              <p>Outside the class, usually in a caller, builder, root, or framework configuration layer.</p>
            </div>
            <div class="compare-card do">
              <h3>Best for</h3>
              <p>Nearly all business classes. This is your base pattern.</p>
            </div>
            <div class="compare-card do">
              <h3>Main strengths</h3>
              <ul>
                <li>Explicit dependencies</li>
                <li>Easy testing</li>
                <li>Swappable collaborators</li>
                <li>Clear responsibilities</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="factory">
          <div class="compare-grid">
            <div class="compare-card do">
              <h3>What it looks like</h3>
              <p>A dedicated factory chooses and creates one product or adapter according to approved rules. Concretely, the caller says “I need sandbox” and the factory decides which concrete gateway or provider object satisfies that request.</p>
            </div>
            <div class="compare-card do">
              <h3>Where decisions live</h3>
              <p>Centralized in the factory.</p>
            </div>
            <div class="compare-card do">
              <h3>Best for</h3>
              <p>Validated values, provider selection, and approved creation policy.</p>
            </div>
            <div class="compare-card do">
              <h3>Trade-offs</h3>
              <p>Clear and readable, but can become repetitive when wiring full graphs with many parts.</p>
            </div>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="manual-root">
          <div class="compare-grid">
            <div class="compare-card do">
              <h3>What it looks like</h3>
              <p>A composition root manually creates logger, store, gateway, services, and feature bundles in a visible order. Concretely, you can point to one local variable and say, “this exact store instance is shared by both services.”</p>
            </div>
            <div class="compare-card do">
              <h3>Where decisions live</h3>
              <p>At the program edge in one explicit assembly function or module.</p>
            </div>
            <div class="compare-card do">
              <h3>Best for</h3>
              <p>Learning, clarity, and small-to-medium feature graphs.</p>
            </div>
            <div class="compare-card do">
              <h3>Trade-offs</h3>
              <p>Most readable at first, but can grow repetitive as the graph gets larger.</p>
            </div>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="container">
          <div class="compare-grid">
            <div class="compare-card do">
              <h3>What it looks like</h3>
              <p>A container stores many creation rules and resolves full object graphs while managing lifetimes. Concretely, you teach it recipes like “reuse one store” and “create a fresh service wrapper each time.”</p>
            </div>
            <div class="compare-card do">
              <h3>Where decisions live</h3>
              <p>In registrations or DI modules at the app edge.</p>
            </div>
            <div class="compare-card do">
              <h3>Best for</h3>
              <p>Larger graphs, repeated wiring, and lifetime management.</p>
            </div>
            <div class="compare-card dont">
              <h3>Main risk</h3>
              <p>If business code starts resolving from the container directly, the container turns into a service locator smell.</p>
            </div>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="hidden">
          <div class="compare-grid">
            <div class="compare-card do">
              <h3>What it looks like</h3>
              <p>A public safe API hides sensitive adapters and implementation classes entirely behind internal/private boundaries. Concretely, outside code can ask for “charge a customer,” but cannot casually inject its own risky payment gateway implementation.</p>
            </div>
            <div class="compare-card do">
              <h3>Where decisions live</h3>
              <p>Inside a manual or container-backed composition root, plus visibility restrictions.</p>
            </div>
            <div class="compare-card do">
              <h3>Best for</h3>
              <p>Security-sensitive or policy-heavy domains like payments, secrets, auth, and regulated workflows.</p>
            </div>
            <div class="compare-card do">
              <h3>Main strength</h3>
              <p>Stronger than allowlist-only policy because the extension point is not casually exposed to outside code.</p>
            </div>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="locator">
          <div class="compare-grid">
            <div class="compare-card dont">
              <h3>What it looks like</h3>
              <p>Business classes call a global container/application context whenever they need something. Concretely, the constructor no longer tells you the true dependencies because the class pulls them from a hidden global source later.</p>
            </div>
            <div class="compare-card dont">
              <h3>Why it feels attractive</h3>
              <p>It looks flexible because classes can “get anything anytime”.</p>
            </div>
            <div class="compare-card dont">
              <h3>Why it is dangerous</h3>
              <ul>
                <li>Dependencies become hidden</li>
                <li>Tests must patch global state</li>
                <li>Object graphs become harder to reason about</li>
              </ul>
            </div>
            <div class="compare-card do">
              <h3>Corrective move</h3>
              <p>Push dependency resolution back to the edge and make constructor parameters explicit again.</p>
            </div>
          </div>
        </div>
      `),
      panel('Pipeline comparison: where the creation choice lives', `
        <p>This diagram answers one concrete question: <strong>which layer is allowed to make the implementation choice?</strong> If you can answer that clearly, architecture decisions become much less foggy.</p>
        <div class="diagram" data-diagram-group="architecture-chooser">
          <div class="diagram-stage">
            <div class="kicker">Tap a pattern</div>
            <div class="diagram-grid cols-3">
              <button class="diagram-node active" data-diagram-target="boundary"><strong>Boundary</strong><small>controller / UI / worker</small></button>
              <button class="diagram-node" data-diagram-target="factory"><strong>Factory</strong><small>one creation policy</small></button>
              <button class="diagram-node" data-diagram-target="root"><strong>Manual root</strong><small>whole graph wiring</small></button>
              <button class="diagram-node" data-diagram-target="container"><strong>Container</strong><small>registration + resolution</small></button>
              <button class="diagram-node" data-diagram-target="feature"><strong>Feature bundle</strong><small>shared graph entry</small></button>
              <button class="diagram-node" data-diagram-target="anti"><strong>Anti-pattern</strong><small>service locator</small></button>
            </div>
          </div>
          <div class="diagram-info">
            <div class="diagram-panel active" data-diagram-panel="boundary">
              <h3>Boundary</h3>
              <p>Receives raw input and calls a business capability. It should not decide provider implementations or wiring rules. Example: a controller may receive an HTTP request, but it should not decide “Stripe or sandbox?” directly.</p>
              <p><strong>Backend analogue:</strong> controller, message listener, job entry point. <strong>Android analogue:</strong> Composable click handler, Fragment callback, deep-link entry, or Worker boundary.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="factory">
              <h3>Factory</h3>
              <p>Best when the main question is: <em>which one should I create?</em> Example: choose a production exporter vs sandbox exporter based on one policy input.</p>
              <p><strong>Backend analogue:</strong> choose provider/exporter/client implementation by environment or tenant. <strong>Android analogue:</strong> choose player/channel/source implementation by feature mode or capability.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="root">
              <h3>Manual composition root</h3>
              <p>Best when the main question is: <em>how do I wire this whole feature together clearly?</em> Example: create one store, pass it into both a write service and a query service, then return one bundle.</p>
              <p><strong>Backend analogue:</strong> startup module or configuration function that wires the feature graph. <strong>Android analogue:</strong> manual app graph or feature assembler that wires ViewModel/use-case/repository/DAO/API objects.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="container">
              <h3>Container</h3>
              <p>Best when the main question is: <em>how do I keep registrations, lifetimes, and graph assembly consistent at scale?</em> Example: register the store as singleton, the services as transient, and let the container repeat that rule everywhere consistently.</p>
              <p><strong>Backend analogue:</strong> Spring modules and bean scopes. <strong>Android analogue:</strong> Hilt/Koin bindings and component scopes.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="feature">
              <h3>Feature bundle</h3>
              <p>Best when multiple public capabilities must come from the same shared graph and state. Example: checkout + receipt history, or send message + conversation history.</p>
              <p><strong>Backend analogue:</strong> feature facade bean exposing multiple related use cases. <strong>Android analogue:</strong> feature-scoped API/facade shared across one navigation flow or module.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="anti">
              <h3>Service locator anti-pattern</h3>
              <p>Creation choice leaks back into business code again, except now it hides behind a global container call. The class becomes harder to read because the real dependency list is no longer visible at the constructor.</p>
              <p><strong>Backend smell:</strong> business code reaches into application context. <strong>Android smell:</strong> ViewModel or screen reaches into a service locator/global graph for ad hoc dependencies.</p>
            </div>
          </div>
        </div>
      `),
      panel('Real-world mapping matrix', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Pattern</th><th>Spring Boot example</th><th>Android example</th><th>Use when</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Constructor DI</td>
                <td>Application service receives repository, gateway, logger</td>
                <td>Use case receives repository and dispatcher abstractions</td>
                <td>You want the normal default for business classes</td>
              </tr>
              <tr>
                <td>Explicit factory</td>
                <td>Create region-specific exporter or provider client</td>
                <td>Create media/player/channel implementation by environment or capability</td>
                <td>You need centralized approved selection</td>
              </tr>
              <tr>
                <td>Manual composition root</td>
                <td>Feature module config built by hand</td>
                <td>Manual app graph / feature graph wiring</td>
                <td>Clarity matters and the graph is still manageable</td>
              </tr>
              <tr>
                <td>Container</td>
                <td>Spring configuration with scoped beans</td>
                <td>Hilt/Koin modules or a manual container-like registry</td>
                <td>Graph size and lifetime rules justify it</td>
              </tr>
              <tr>
                <td>Hidden-boundary factory</td>
                <td>Payment or secrets module exposes narrow public API only</td>
                <td>Security-sensitive SDK wrapper or policy-heavy feature module</td>
                <td>Open extension is dangerous and policy control matters</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Use this matrix as a translation exercise. Ask yourself: “What is the same architectural job in both platforms?” The framework names change, but the deeper roles stay familiar: orchestrate, choose, assemble, store, and expose safe public entry points.</p>
      `),
      panel('Practice workshop: choose the architecture before reading the answer', teachingTask({
        task: 'Solve two scenarios with explicit architecture choices. Scenario A: a backend checkout API must support sandbox and production gateways, keep shared receipt history, and be easy to unit test. Scenario B: an Android checkout feature must support a ViewModel, repository, local cache, remote API, and WorkManager sync. Choose the right pattern combination and show the code shape that justifies the choice.',
        thinkFirst: [
          'Which pattern is the baseline inside business classes regardless of platform?',
          'Where is there one focused implementation choice, and where is there a full graph-assembly problem?',
          'At what point does a container become useful rather than premature?',
          'Which layers must never behave like a service locator in either platform?'
        ],
        codeId: 'comparisons-practice-workshop-solution',
        codeTitle: 'Worked backend + Android comparative architecture sketch',
        code: `enum class CheckoutEnvironment {
    SANDBOX,
    PRODUCTION,
}

interface PaymentGateway {
    fun charge(request: ChargeRequest): PaymentReceipt
}

class PaymentGatewayFactory(
    private val sandboxGateway: PaymentGateway,
    private val productionGateway: PaymentGateway,
) {
    fun create(environment: CheckoutEnvironment): PaymentGateway {
        // Explicit factory handles the one focused provider choice.
        return when (environment) {
            CheckoutEnvironment.SANDBOX -> sandboxGateway
            CheckoutEnvironment.PRODUCTION -> productionGateway
        }
    }
}

class CheckoutService(
    // Constructor DI remains the default inside the business class itself.
    private val gateway: PaymentGateway,
    private val receiptStore: ReceiptStore,
) {
    fun charge(request: ChargeRequest): PaymentReceipt {
        val receipt = gateway.charge(request)
        receiptStore.save(receipt)
        return receipt
    }
}

class BillingCompositionRoot {
    fun create(environment: CheckoutEnvironment): CheckoutService {
        // Manual root keeps the graph visible while it is still manageable.
        val logger = ConsoleBillingLogger()
        val store = InMemoryReceiptStore()
        val gatewayFactory = PaymentGatewayFactory(
            sandboxGateway = SandboxPaymentGateway(logger),
            productionGateway = StripePaymentGateway(logger),
        )
        val gateway = gatewayFactory.create(environment)
        return CheckoutService(gateway, store)
    }
}

class LoadReceiptsUseCase(
    private val repository: CheckoutRepository,
) {
    suspend operator fun invoke(): List<PaymentReceipt> {
        // Android use case depends on the repository abstraction, not Room/Retrofit directly.
        return repository.loadReceipts()
    }
}

@HiltViewModel
class CheckoutViewModel @Inject constructor(
    private val loadReceipts: LoadReceiptsUseCase,
) : ViewModel() {
    fun refresh() {
        // ViewModel triggers business flow; it does not construct the graph or choose transport/storage tools.
        viewModelScope.launch { loadReceipts() }
    }
}

@Module
@InstallIn(SingletonComponent::class)
object CheckoutModule {
    @Provides
    fun provideCheckoutRepository(
        api: CheckoutApi,
        dao: ReceiptDao,
    ): CheckoutRepository {
        // Container/module becomes useful for repeated wiring and lifetime rules.
        return DefaultCheckoutRepository(api, dao)
    }
}`,
        explanation: [
          {
            title: 'Constructor injection stays the baseline',
            body: 'Both the backend <code>CheckoutService</code> and the Android <code>LoadReceiptsUseCase</code> receive collaborators explicitly. That is the default pattern inside business code regardless of framework.'
          },
          {
            title: 'The backend also needs one focused factory choice',
            body: 'Sandbox vs production gateway is one policy decision, so an explicit factory fits naturally. That is separate from the larger graph-assembly job.'
          },
          {
            title: 'Manual composition root is the first strong answer for a still-readable graph',
            body: 'The backend root keeps shared state visible. You can literally see the logger, store, gateway, and service being assembled in one place.'
          },
          {
            title: 'Android graph coordination leans naturally toward Hilt/manual modules',
            body: 'The Android feature has repeated wiring around API, DAO, repository, use case, ViewModel, and worker reuse. That is where a module/container-style graph host becomes valuable.'
          }
        ],
        pipeline: [
          'Backend: controller boundary receives input and calls a constructor-injected service.',
          'Backend factory chooses sandbox vs production gateway, then the composition root assembles the graph.',
          'Android: UI event reaches ViewModel, ViewModel calls a use case, use case calls a repository.',
          'Android module/Hilt graph wires repository, DAO, API, and other reusable dependencies.',
          'In both platforms, avoid service locator behavior in controllers, ViewModels, and use cases.'
        ],
        spring: [
          'Start with constructor injection in services and controllers.',
          'Add a factory when provider selection is a focused policy decision such as region, tenant, or environment.',
          'Use a visible <code>@Configuration</code> class as the composition root while the graph is still understandable.',
          'Let Spring modules/scopes help once the wiring repeats or lifetimes become harder to manage manually.'
        ],
        android: [
          'Start with constructor injection for ViewModels, use cases, repositories, and data sources.',
          'Use Hilt or a manual graph for repeated repository/API/DAO/dispatcher wiring and scoped lifetimes.',
          'Keep Retrofit and Room behind the repository so the ViewModel never becomes a service locator or graph builder.',
          'Reuse the same repository path from WorkManager rather than inventing a second background-only architecture.'
        ],
        mistakes: [
          'Treating factory, manual root, and container as mutually exclusive competitors rather than tools that can coexist.',
          'Jumping to a container before you understand the graph you are trying to build.',
          'Letting controllers or ViewModels choose providers and construct dependencies inline.',
          'Using service locator lookups from business code because the graph feels “easier” that way.'
        ],
        better: 'This worked comparison is better than a short answer table because it makes the two platforms visibly symmetrical. You can now see which parts are shared architecture ideas and which parts are only framework vocabulary differences.'
      }))
    ]
  },
  {
    id: 'scope-comparisons',
    title: 'Scope comparisons',
    navLabel: 'Scope comparisons',
    group: 'Architecture comparisons',
    level: 'Applied',
    time: '10 min',
    sampleSource: 'sample3.txt + sample8.txt + advanced curriculum',
    summary: 'A granular lesson comparing singleton, transient, request, ViewModel, worker, and feature-scoped lifetimes across backend and Android designs.',
    sections: [
      panel('Lifetime comparison table', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Scope</th><th>Meaning</th><th>Backend mapping</th><th>Android mapping</th><th>Main danger if misused</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Singleton</td>
                <td>One shared instance for a long-lived graph</td>
                <td>Application singleton bean, shared client, repository</td>
                <td>App-wide dependency, expensive client, shared cache owner</td>
                <td>Leaking mutable state too broadly</td>
              </tr>
              <tr>
                <td>Transient</td>
                <td>Fresh instance each resolution</td>
                <td>Lightweight wrappers or ad-hoc service objects</td>
                <td>Fresh use case wrappers or stateless helpers</td>
                <td>Unexpected duplication of expensive resources if used carelessly</td>
              </tr>
              <tr>
                <td>Request-scoped</td>
                <td>One instance per request</td>
                <td>Request context, per-request accumulator, correlation holder</td>
                <td>Closest analogy is screen/session or flow scope, not app scope</td>
                <td>Accidentally holding request data in singleton services</td>
              </tr>
              <tr>
                <td>ViewModel-scoped</td>
                <td>One instance per screen state holder lifecycle</td>
                <td>Not a common backend equivalent</td>
                <td>ViewModel and its feature collaborators</td>
                <td>Sharing screen state globally by accident</td>
              </tr>
              <tr>
                <td>Worker/background scope</td>
                <td>One graph per job/task execution</td>
                <td>Scheduled job or consumer execution graph</td>
                <td>WorkManager job graph</td>
                <td>Reusing screen/UI state in background flows</td>
              </tr>
              <tr>
                <td>Feature scope</td>
                <td>One graph for related public capabilities</td>
                <td>Feature module or bounded-context graph</td>
                <td>Feature module / nav graph / session feature flow</td>
                <td>Accidentally splitting state that should be shared</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Interactive lifetime chooser', `
        <div class="tabs" data-tab-group="lifetime-chooser">
          <button class="tab-btn active" data-tab="shared">Need shared state</button>
          <button class="tab-btn" data-tab="fresh">Need fresh wrappers</button>
          <button class="tab-btn" data-tab="request">Need per-request data</button>
          <button class="tab-btn" data-tab="ui">Need per-screen state</button>
          <button class="tab-btn" data-tab="job">Need per-job state</button>
        </div>
        <div class="tab-content active" data-tab-panel="shared">
          <p>If several services must observe the same history, cache, or hidden mutable data, they probably need a shared singleton or feature-scoped store.</p>
        </div>
        <div class="tab-content" data-tab-panel="fresh">
          <p>If the wrapper itself is cheap and mostly coordinates other shared dependencies, transient can be a good fit.</p>
        </div>
        <div class="tab-content" data-tab-panel="request">
          <p>Keep request-specific values in method parameters or request-scoped collaborators rather than burying them inside singletons.</p>
        </div>
        <div class="tab-content" data-tab-panel="ui">
          <p>On Android, ViewModel scope is often the right place for screen state and orchestration, while repositories remain longer-lived.</p>
        </div>
        <div class="tab-content" data-tab-panel="job">
          <p>Jobs and workers often need a fresh graph that reuses app-level infrastructure but owns its own execution-specific state.</p>
        </div>
      `),
      panel('Concrete lifetime case studies: backend vs Android vs worker', `
        <p>If lifetime rules still feel abstract, compare these three failure stories. Each one uses the same principle: the object lifetime must match the state lifetime.</p>
        <div class="compare-grid">
          <div class="compare-card dont">
            <h3>Backend bug</h3>
            <p>A singleton fraud-check helper stores the current request's customer ID in a field. The next request reuses that same helper and sees the wrong customer data.</p>
          </div>
          <div class="compare-card dont">
            <h3>Android bug</h3>
            <p>A singleton repository stores the currently typed coupon code for one screen. When another screen opens, it sees stale UI state that should have belonged only to the first screen.</p>
          </div>
          <div class="compare-card dont">
            <h3>Worker bug</h3>
            <p>A retry worker reuses an old in-memory execution accumulator, so a new job starts with stale counters and duplicate results.</p>
          </div>
          <div class="compare-card do">
            <h3>Shared fix pattern</h3>
            <p>Move the state into the correct scope: request context for backend request data, ViewModel or feature scope for screen state, and fresh job-local objects for worker execution state.</p>
          </div>
        </div>
        <details>
          <summary>Open the design takeaway</summary>
          <p>Notice that the problem is not “DI failed.” DI successfully provided the dependency. The mistake was architectural: the wrong object was reused across boundaries that should have stayed separate.</p>
          <ul>
            <li>If several collaborators must see the <strong>same</strong> hidden writes, share one state owner deliberately.</li>
            <li>If data must stay <strong>local</strong> to one request, screen, or job, do not park it inside a longer-lived singleton.</li>
            <li>When you debug a mysterious state bug, ask <strong>who else can see this object?</strong> That question usually reveals the scope mistake quickly.</li>
          </ul>
        </details>
      `),
      panel('Quick exercise: choose the scope before reading the answer', `
        <div class="good">
          <div class="callout-title">Scenario A</div>
          <div>A Spring endpoint needs a correlation accumulator that should exist only during one request.</div>
        </div>
        <div class="good">
          <div class="callout-title">Scenario B</div>
          <div>An Android checkout screen needs temporary promo-code state that should survive recomposition but not leak to another screen.</div>
        </div>
        <details>
          <summary>Open the worked answer</summary>
          <p><strong>Scenario A:</strong> request scope or explicit request-local/context parameter is the strong fit, not singleton. <strong>Scenario B:</strong> ViewModel or feature-screen scope is the strong fit, not app singleton.</p>
        </details>
      `)
    ]
  }
];

