import { hero, panel, teachingTask } from './contentBuilders';

export const patternViews = [
  {
    id: 'auth-di-redaction',
    title: 'Auth DI and redaction',
    navLabel: 'Auth DI + redaction',
    group: 'Factory & policy track',
    level: 'Intermediate',
    time: '14 min',
    sampleSource: 'sample2.txt',
    summary: 'A login-flow lesson showing no DI vs constructor DI, composition + delegation, and why redacting logs is part of real architecture—not an afterthought.',
    sections: [
      hero(
        'Login flow DI: dependencies, log safety, and decorator-style redaction',
        ['Auth domain', 'Decorator pattern', 'Testability', 'Production safety'],
        `
          <p>This lesson adds an important real-world angle that beginner DI tutorials often miss: <strong>security and observability concerns also flow through your object graph</strong>.</p>
          <div class="good">
            <div class="callout-title">Main lesson</div>
            <div>Dependency injection is not only about swapping classes. It is also about deciding <strong>where safety behavior lives</strong>, such as redacting tokens before logs are written.</div>
          </div>
        `
      ),
      panel('What the auth sample teaches that the welcome sample does not', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>Welcome sample focus</h3>
            <ul>
              <li>What a dependency is</li>
              <li>No DI vs constructor DI</li>
              <li>Fake senders and container basics</li>
            </ul>
          </div>
          <div class="compare-card do">
            <h3>Auth sample added value</h3>
            <ul>
              <li>Tokens and session data make bad logging visible</li>
              <li>Composition + delegation can wrap behavior safely</li>
              <li>The logger itself becomes a dependency boundary</li>
            </ul>
          </div>
        </div>
      `),
      panel('No DI login manager: why it is risky', `
        <div class="tabs" data-tab-group="auth-nodi">
          <button class="tab-btn active" data-tab="code">Code</button>
          <button class="tab-btn" data-tab="risk">Risk</button>
          <button class="tab-btn" data-tab="realworld">Real world</button>
        </div>
        <div class="tab-content active" data-tab-panel="code">
          <pre>class LoginManagerNoDi {
    private val authApi: AuthApi = RealAuthApi()
    private val tokenStore: TokenStore = InMemoryTokenStore()
    private val logger: Logger = InsecureConsoleLogger()

    fun login(username: String, password: String) {
        val session = authApi.login(username, password)
        tokenStore.saveToken(session.accessToken)
        logger.log(session.toString())
        logger.log("User=\${session.username}, token=\${session.accessToken}")
    }
}</pre>
        </div>
        <div class="tab-content" data-tab-panel="risk">
          <ul>
            <li>The login manager chooses its own API, token store, and logger.</li>
            <li>Security-sensitive output is sent through a logger that does not sanitize anything.</li>
            <li>Changing storage or logging policy means editing the business class itself.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="realworld">
          <ul>
            <li><strong>Spring Boot:</strong> this is like a service directly constructing its API client, token repository, and logger policy internally.</li>
            <li><strong>Android:</strong> this is like a ViewModel directly constructing network auth code, token persistence, and log output.</li>
            <li>In both cases, testing and security review become harder because the boundaries are hidden.</li>
          </ul>
        </div>
      `),
      panel('Redacting logger: composition + delegation in practice', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 2 concept</div><strong>Decorator-style logger wrapper</strong></div>
            <button class="copy-btn" data-copy-target="redacting-logger-code">Copy snippet</button>
          </div>
          <pre id="redacting-logger-code">class RedactingLogger(
    private val delegate: Logger2,
) : Logger2 {
    override fun log(message: String) {
        val redacted = message.replace(Regex("token=[^,\\s]+"), "token=<redacted>")
        delegate.log(redacted)
    }
}</pre>
        </div>
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>What this pattern is</h3>
            <ul>
              <li><strong>Composition:</strong> it contains another logger.</li>
              <li><strong>Delegation:</strong> it forwards work after changing the message.</li>
              <li><strong>Decorator pattern:</strong> it adds behavior without modifying the original logger.</li>
            </ul>
          </div>
          <div class="compare-card dont">
            <h3>What not to do</h3>
            <ul>
              <li>Do not spread ad-hoc token replacement logic all over business classes.</li>
              <li>Do not assume logs are harmless debug output.</li>
              <li>Do not make security policy depend on each developer remembering to sanitize manually.</li>
            </ul>
          </div>
        </div>
      `),
      panel('Auth pipeline: where redaction belongs', `
        <p>Read this pipeline like a parcel-checking line. Raw user credentials arrive at the front desk, business flow decides what should happen, infrastructure helpers do their specialized jobs, and the logging layer is where dangerous raw data must be sanitized before records are written.</p>
        <div class="diagram" data-diagram-group="auth-pipeline">
          <div class="diagram-stage">
            <div class="kicker">Tap each layer</div>
            <div class="diagram-grid cols-3">
              <button class="diagram-node active" data-diagram-target="request"><strong>Boundary request</strong><small>username/password input</small></button>
              <button class="diagram-node" data-diagram-target="service"><strong>Login manager</strong><small>business coordination</small></button>
              <button class="diagram-node" data-diagram-target="api"><strong>Auth API</strong><small>real/fake backend auth</small></button>
              <button class="diagram-node" data-diagram-target="store"><strong>Token store</strong><small>save/read token</small></button>
              <button class="diagram-node" data-diagram-target="logger"><strong>Redacting logger</strong><small>safe observability</small></button>
              <button class="diagram-node" data-diagram-target="test"><strong>Recording logger</strong><small>test verification</small></button>
            </div>
          </div>
          <div class="diagram-info">
            <div class="diagram-panel active" data-diagram-panel="request">
              <h3>Boundary request</h3>
              <p>Controllers, HTTP handlers, or UI events should gather user input and call the login use case. Concretely, this is the layer that receives <code>username</code> and <code>password</code> from the outside world.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="service">
              <h3>Login manager</h3>
              <p>The service should coordinate login flow, not decide which logger or token store implementation exists. Its concrete job is: ask the auth API to log in, save the token, and record safe logs about what happened.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="api">
              <h3>Auth API</h3>
              <p>This is a replaceable collaborator. It might be real, fake, sandboxed, or mocked. In plain language, it is the object that talks to the outside authentication system so the business flow does not have to know the transport details.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="store">
              <h3>Token store</h3>
              <p>Persistence policy belongs here, not hidden inside the business class. This is the “where do we keep the session/token after login succeeds?” decision point.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="logger">
              <h3>Redacting logger</h3>
              <p>This is the correct place to centralize safe log transformation when multiple classes need the same policy. Instead of every service remembering to scrub tokens manually, the logger wrapper enforces the safety rule once.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="test">
              <h3>Recording logger</h3>
              <p>Use a fake/recording logger when you want tests to inspect exactly what was logged. That lets you verify both <em>that logging happened</em> and <em>that dangerous values were not leaked</em>.</p>
            </div>
          </div>
        </div>
        <div class="note">
          <div class="callout-title">Concrete analogy</div>
          <div>The redacting logger is like a receptionist who is allowed to write visitor notes into the office logbook, but must black out passport numbers before the note is filed. The receptionist does not change who visited; the receptionist changes how sensitive data is recorded.</div>
        </div>
      `),
      panel('Platform mapping', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Concept</th><th>Spring Boot mapping</th><th>Android mapping</th><th>Lesson takeaway</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Login manager</td>
                <td>Application service / auth use case</td>
                <td>Use case or repository-backed interactor</td>
                <td>Keep orchestration separate from framework entry points</td>
              </tr>
              <tr>
                <td>Token store</td>
                <td>Repository / secure token persistence adapter</td>
                <td>Encrypted DataStore / secure local persistence adapter</td>
                <td>Storage choice belongs at the edge</td>
              </tr>
              <tr>
                <td>Redacting logger</td>
                <td>Decorator around logger/telemetry sink</td>
                <td>Wrapper around logger/crash reporting abstraction</td>
                <td>Safety behavior can be injected and composed</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>Use the table as a translation guide, not as a memorization chart. The lesson is that the <strong>job stays the same</strong> even when the framework vocabulary changes. “Login manager” in one stack becomes “application service” or “use case” in another, but the role is still “coordinate the business flow without doing low-level setup inline.”</p>
      `),
      panel('Practice task: place redaction in the right layer', teachingTask({
        task: 'Build a passwordless login flow that records user email, device info, and one-time-code login results. The teaching goal is to decide where redaction belongs so the business flow can describe what happened without every service method manually scrubbing secrets.',
        thinkFirst: [
          'Which layer should know about the login workflow itself?',
          'Which layer should enforce safe logging policy for tokens and one-time codes?',
          'How would you test that both logging happened and sensitive values were removed?'
        ],
        codeId: 'pattern-redaction-solution',
        codeTitle: 'Decorator-style redaction wrapper around the logging boundary',
        code: `interface LoginLogger {
    fun log(message: String)
}

class ConsoleLoginLogger : LoginLogger {
    override fun log(message: String) {
        println(message)
    }
}

class RedactingLoginLogger(
    // Delegate keeps the real output sink hidden behind one reusable policy wrapper.
    private val delegate: LoginLogger,
) : LoginLogger {
    override fun log(message: String) {
        // Centralize secret scrubbing once instead of repeating it in every use case.
        val redacted = message
            .replace(Regex("code=[^,\\s]+"), "code=<redacted>")
            .replace(Regex("token=[^,\\s]+"), "token=<redacted>")

        delegate.log(redacted)
    }
}

class PasswordlessLoginService(
    private val authApi: AuthApi,
    private val tokenStore: TokenStore,
    private val logger: LoginLogger,
) {
    fun login(email: String, deviceInfo: String, oneTimeCode: String) {
        val session = authApi.login(email, oneTimeCode)
        tokenStore.saveToken(session.accessToken)

        // Business flow states what happened.
        logger.log("passwordless_login email=" + email + ", device=" + deviceInfo + ", code=" + oneTimeCode + ", token=" + session.accessToken)
    }
}`,
        explanation: [
          {
            title: 'The service still logs the event, but it does not own redaction policy',
            body: 'The use case describes the event in business terms. The wrapper logger decides how unsafe fields are transformed before they leave the process.'
          },
          {
            title: 'The redacting logger is composition plus delegation',
            body: 'It contains another logger and forwards work only after applying safety rules. That makes redaction reusable across many callers.'
          },
          {
            title: 'The seam is testable',
            body: 'You can inject a recording logger behind the redactor and assert that the logged output keeps the useful fields while hiding sensitive values.'
          }
        ],
        pipeline: [
          'Boundary receives email, device info, and one-time code.',
          'Login use case coordinates auth API and token persistence.',
          'Use case emits a log event through the logging abstraction.',
          'Redacting wrapper sanitizes code/token values before handing the message to the real sink.',
          'Tests can inspect the final output at the seam.'
        ],
        spring: [
          'Wrap your logger, telemetry sink, or audit publisher in a redacting decorator configured in <code>@Configuration</code>.',
          'Controllers should not manually strip tokens field by field; that spreads security policy into transport code.',
          'Use unit tests or slice tests to verify both event content and redaction behavior.'
        ],
        android: [
          'Wrap analytics, crash-report, or logger abstractions instead of sanitizing secrets inside every ViewModel.',
          'Repositories or use cases can log business events while the wrapper owns safe output rules.',
          'The same pattern works for Retrofit headers, device identifiers, or auth token logging.'
        ],
        mistakes: [
          'Putting token/code replacement logic directly in every service method.',
          'Assuming logs are harmless debug output and printing secrets freely.',
          'Letting controllers or ViewModels become the home of security policy.'
        ],
        better: 'This solution is better because one reusable logging boundary enforces the rule consistently. That makes the design safer, easier to test, and easier to evolve than scattering string cleanup throughout the business layer.'
      }))
    ]
  },
  {
    id: 'private-constructor-factory',
    title: 'Private constructor factory',
    navLabel: 'Private constructor factory',
    group: 'Factory & policy track',
    level: 'Beginner',
    time: '9 min',
    sampleSource: 'sample4.txt',
    summary: 'A focused lesson on validated value objects, compile-time creation restriction, runtime validation, normalization, and why private constructors matter.',
    sections: [
      hero(
        'Use private constructors when an object must only exist in a valid state',
        ['Validated values', 'Fail fast', 'Normalization', 'Factory method'],
        `
          <p>This pattern solves a very specific but very important problem: <strong>how do I ensure an object cannot be created in an invalid state?</strong></p>
          <div class="good">
            <div class="callout-title">Best fit</div>
            <div>Use this for value objects like API keys, IDs, email addresses, slugs, or settings values that must satisfy invariants before the rest of the system trusts them.</div>
          </div>
        `
      ),
      panel('Core idea with <code>ApiKey</code>', `
        <pre>class ApiKey private constructor(
    val value: String,
) {
    companion object {
        fun fromRaw(raw: String): ApiKey {
            val normalized = raw.trim()
            require(normalized.startsWith("sk_")) {
                "API key must start with \"sk_\"."
            }
            return ApiKey(normalized)
        }
    }
}</pre>
        <p>The private constructor blocks direct outside creation. The named factory method becomes the approved path that can normalize and validate input before the object exists.</p>
      `),
      panel('Compile-time restriction vs runtime validation', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>Compile-time restriction</h3>
            <p>Outside code cannot call <code>ApiKey(...)</code> directly because the constructor is private.</p>
          </div>
          <div class="compare-card do">
            <h3>Runtime validation</h3>
            <p>Outside code can call <code>ApiKey.fromRaw(...)</code>, but bad input is rejected by <code>require(...)</code>.</p>
          </div>
        </div>
        <div class="note">
          <div class="callout-title">Small but important concept</div>
          <div>These are two different safeguards. One controls <strong>who may try to create</strong> the object. The other controls <strong>which values are acceptable</strong>.</div>
        </div>
      `),
      panel('When to use and when not to use this pattern', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Use it when</th><th>Avoid it when</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>The object must maintain invariants from the moment it exists.</td>
                <td>You are wiring a larger object graph with many dependencies.</td>
              </tr>
              <tr>
                <td>You want one approved creation path.</td>
                <td>You only need a plain DTO without strong creation rules.</td>
              </tr>
              <tr>
                <td>You need normalization + validation close to the value itself.</td>
                <td>You are trying to solve dependency wiring rather than value-object safety.</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Real-world mapping', `
        <ul>
          <li><strong>Spring Boot:</strong> validated config keys, tenant IDs, external-provider IDs, normalized email/domain values.</li>
          <li><strong>Android:</strong> deep-link IDs, token wrappers, user-entered identifiers, validated route arguments.</li>
          <li><strong>General rule:</strong> use this pattern for <em>safe values</em>, not for whole application graphs.</li>
        </ul>
      `),
      panel('Practice task: decide if this should be a validated value object', teachingTask({
        task: 'Classify these cases: <code>EmailAddress</code> that must be normalized and validated, <code>PaymentGateway</code> with many collaborators, <code>TenantId</code> with a strict prefix format, and <code>CheckoutFeature</code> containing several services. The real learning goal is to separate value-object safety problems from object-graph assembly problems.',
        thinkFirst: [
          'Does the thing mainly need invariant protection from the moment it exists?',
          'Or is the thing a larger graph whose main difficulty is wiring many collaborators together?',
          'Would a private constructor actually protect the right problem, or would it hide composition concerns instead?'
        ],
        codeId: 'pattern-validated-value-solution',
        codeTitle: 'Validated value objects for data invariants, DI for graph assembly',
        code: `class EmailAddress private constructor(
    val value: String,
) {
    companion object {
        fun fromRaw(raw: String): EmailAddress {
            // Normalize first so the rest of the app sees one canonical shape.
            val normalized = raw.trim().lowercase()
            require("@" in normalized) { "Email must contain @" }
            return EmailAddress(normalized)
        }
    }
}

class TenantId private constructor(
    val value: String,
) {
    companion object {
        fun fromRaw(raw: String): TenantId {
            val normalized = raw.trim()
            require(normalized.startsWith("tenant-")) { "TenantId must start with tenant-" }
            return TenantId(normalized)
        }
    }
}

// These are NOT value-object problems. They are graph-assembly problems.
class PaymentGateway(
    private val httpClient: HttpClient,
    private val logger: BillingLogger,
)

interface CheckoutFeature {
    val checkoutService: CheckoutService
    val receiptQueryService: ReceiptQueryService
}`,
        explanation: [
          {
            title: '<code>EmailAddress</code> and <code>TenantId</code> are invariant-heavy values',
            body: 'Their core job is to exist only in a valid, normalized state. A private constructor plus factory method is perfect because the main challenge is value correctness.'
          },
          {
            title: '<code>PaymentGateway</code> is not mainly a value problem',
            body: 'It has collaborators and behavior. The main challenge is injection, configuration, and runtime policy, not just protecting one scalar value.'
          },
          {
            title: '<code>CheckoutFeature</code> is a graph boundary, not a validated scalar',
            body: 'A feature contains multiple services and shared state. Its main problem is composition root or DI-module assembly, not constructor restriction for one simple invariant.'
          }
        ],
        pipeline: [
          'Raw string input enters a value factory such as <code>EmailAddress.fromRaw()</code>.',
          'The factory normalizes and validates before the value object exists.',
          'Larger services and features receive those already-safe values as dependencies or method parameters.',
          'Graph assembly for gateways/features still happens in factories, composition roots, or containers.'
        ],
        spring: [
          'Use validated value objects for config values, external IDs, tenant identifiers, or canonical email/domain types.',
          'Do not confuse bean wiring with value-object validation: Spring config assembles graphs, while value factories protect individual values.',
          'A controller can map raw input to validated values before calling the application service.'
        ],
        android: [
          'Use the same pattern for route arguments, deep-link IDs, tokens, or validated user-entered identifiers.',
          'Keep Hilt or manual DI responsible for wiring repositories and use cases, not for replacing value factories.',
          'ViewModels can call value factories during input validation before triggering use cases.'
        ],
        mistakes: [
          'Using private constructors as a substitute for dependency injection in larger services.',
          'Making a complex feature graph look like a value object problem.',
          'Skipping normalization so many near-duplicate values flow through the app.'
        ],
        better: 'This classification is better because it chooses the smallest tool that matches the real problem. Value factories protect invariants, while DI tools assemble collaborations. Mixing those jobs makes code harder to reason about.'
      }))
    ]
  },
  {
    id: 'factory-method-patterns',
    title: 'Factory method patterns',
    navLabel: 'Factory method patterns',
    group: 'Factory & policy track',
    level: 'Intermediate',
    time: '15 min',
    sampleSource: 'sample6.txt',
    summary: 'A detailed lesson on explicit factories, reflection-based factories, approval rules, and how factories keep creation policy out of the rest of the application.',
    sections: [
      hero(
        'Factories centralize construction policy so business code does not choose implementations everywhere',
        ['Explicit factory', 'Reflection trade-offs', 'Approval rules', 'Policy at the edge'],
        `
          <p>This lesson covers the two factory styles from the secret-vault sample: an <strong>explicit lambda-map factory</strong> and a <strong>reflection-based factory</strong>.</p>
          <div class="warn">
            <div class="callout-title">Default recommendation</div>
            <div>Prefer the explicit factory first. Reflection is an advanced tool, not the default teaching path.</div>
          </div>
        `
      ),
      panel('Explicit factory with approved creators', `
        <pre>object SecretVaultFactory {
    private val approvedCreators: Map<KClass&lt;out SecretVault&gt;, () -&gt; SecretVault> = mapOf(
        FileSecretVault::class to { FileSecretVault() },
        MemorySecretVault::class to { MemorySecretVault() },
    )

    internal fun create(type: KClass&lt;out SecretVault&gt;): SecretVault {
        val creator = approvedCreators[type]
        requireNotNull(creator) {
            "SecretVault type is not approved"
        }
        return creator()
    }
}</pre>
        <p>This is explicit, readable, and debuggable. The approved types and their creation rules live together in one place.</p>
      `),
      panel('Reflection-based factory: what changes', `
        <div class="tabs" data-tab-group="reflection-factory">
          <button class="tab-btn active" data-tab="idea">Idea</button>
          <button class="tab-btn" data-tab="tradeoffs">Trade-offs</button>
          <button class="tab-btn" data-tab="rule">Rule of thumb</button>
        </div>
        <div class="tab-content active" data-tab-panel="idea">
          <p>The reflection-based factory stores approved types, then discovers a no-argument constructor at runtime and calls it dynamically.</p>
          <pre>val noArgConstructor = type.constructors.firstOrNull { it.parameters.isEmpty() }
requireNotNull(noArgConstructor) { "No no-arg constructor" }
return noArgConstructor.call()</pre>
        </div>
        <div class="tab-content" data-tab-panel="tradeoffs">
          <ul>
            <li>More dynamic than an explicit lambda-map factory.</li>
            <li>Less readable for beginners.</li>
            <li>More runtime failure risk if constructors change.</li>
            <li>Can be useful in framework-like tooling, but it is not automatically better.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="rule">
          <div class="good"><div class="callout-title">Practical rule</div><div>Prefer the explicit factory unless you have a strong, real reason to use reflection.</div></div>
        </div>
      `),
      panel('Interactive factory pipeline', `
        <div class="diagram" data-diagram-group="factory-pipeline">
          <div class="diagram-stage">
            <div class="kicker">Choose a factory style</div>
            <div class="diagram-grid cols-3">
              <button class="diagram-node active" data-diagram-target="caller"><strong>Caller</strong><small>asks for vault/service</small></button>
              <button class="diagram-node" data-diagram-target="explicit"><strong>Explicit factory</strong><small>map of creators</small></button>
              <button class="diagram-node" data-diagram-target="reflective"><strong>Reflective factory</strong><small>constructor discovery</small></button>
              <button class="diagram-node" data-diagram-target="policy"><strong>Approval policy</strong><small>which types are allowed</small></button>
              <button class="diagram-node" data-diagram-target="consumer"><strong>Consumer service</strong><small>depends on abstraction</small></button>
              <button class="diagram-node" data-diagram-target="trojan"><strong>Trojan risk</strong><small>policy is not magic enforcement</small></button>
            </div>
          </div>
          <div class="diagram-info">
            <div class="diagram-panel active" data-diagram-panel="caller">
              <h3>Caller</h3>
              <p>The caller should ask a factory for the abstraction or intent it needs instead of scattering constructor calls.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="explicit">
              <h3>Explicit factory</h3>
              <p>Creation rules are visible and easy to audit: type → lambda → object.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="reflective">
              <h3>Reflective factory</h3>
              <p>The factory is more dynamic because it discovers constructors at runtime, but you trade away clarity.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="policy">
              <h3>Approval policy</h3>
              <p>A factory centralizes approved choices, but callers can still bypass it if the underlying types remain broadly visible.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="consumer">
              <h3>Consumer service</h3>
              <p>Factories are most valuable when the rest of the code depends on abstractions and leaves construction policy at the edge.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="trojan">
              <h3>Trojan risk</h3>
              <p>A factory is policy, not total enforcement. Stronger safety often requires visibility boundaries too.</p>
            </div>
          </div>
        </div>
      `),
      panel('Common real-world uses', `
        <ul>
          <li><strong>Spring Boot:</strong> selecting a provider adapter by environment, region, or feature flag.</li>
          <li><strong>Android:</strong> selecting notification channels, media players, analytics sinks, or feature-module implementations.</li>
          <li><strong>Server/backend:</strong> choosing a storage strategy, payment provider, exporter, or credentials wrapper at startup.</li>
        </ul>
      `),
      panel('Practice task: explicit factory or reflection?', teachingTask({
        task: 'Choose how to create one of three exporter implementations: CSV, PDF, or XLSX. The approved set is small, known in advance, and security-sensitive because some exporters can include customer data.',
        thinkFirst: [
          'Is the approved set small enough that readability matters more than runtime discovery?',
          'Would reflection add any real business value, or only indirection?',
          'How important is it that another developer can audit the approved set at a glance?'
        ],
        codeId: 'pattern-factory-vs-reflection-solution',
        codeTitle: 'Explicit factory for a small approved exporter set',
        code: `enum class ReportFormat {
    CSV,
    PDF,
    XLSX,
}

interface ReportExporter {
    fun export(rows: List<String>): ByteArray
}

object ReportExporterFactory {
    fun create(format: ReportFormat): ReportExporter = when (format) {
        // The approved set is visible and easy to audit in one place.
        ReportFormat.CSV -> CsvReportExporter()
        ReportFormat.PDF -> PdfReportExporter()
        ReportFormat.XLSX -> XlsxReportExporter()
    }
}`,
        explanation: [
          {
            title: 'The approved set is explicit and readable',
            body: 'A small <code>when</code> expression makes the factory policy obvious. Security-sensitive creation rules are easier to review when they are not hidden behind reflection.'
          },
          {
            title: 'Reflection would solve a different problem',
            body: 'Reflection helps when constructor discovery must happen dynamically at runtime. That is not the main need here, so it would add complexity without architectural payoff.'
          },
          {
            title: 'The factory centralizes creation policy',
            body: 'Callers ask for a format, and one central place converts that into a concrete exporter. That keeps selection logic out of controllers, screens, or other call sites.'
          }
        ],
        pipeline: [
          'Caller expresses intent by passing a <code>ReportFormat</code>.',
          'The explicit factory maps that intent to one approved exporter implementation.',
          'The caller receives a <code>ReportExporter</code> abstraction and keeps working in business terms.',
          'Policy stays centralized and auditable.'
        ],
        spring: [
          'Use an explicit factory or a small configuration-level selector when the approved set is known and stable.',
          'Avoid scattering <code>when(format)</code> logic across controllers or services.',
          'Reflection is more appropriate in framework-like extension systems, not small business-approved sets.'
        ],
        android: [
          'The same explicit factory works for media/player/export/channel selection when the set is small and clear.',
          'Inject the factory or call it from a composition root/use case rather than making UI code choose implementations everywhere.',
          'Keep the ViewModel focused on user intent, not concrete exporter construction.'
        ],
        mistakes: [
          'Using reflection because it looks advanced, not because the problem needs it.',
          'Letting many callers create exporters directly and drift out of sync.',
          'Assuming a dynamic tool is automatically more flexible in a useful way.'
        ],
        better: 'This solution is better because it matches the size and sensitivity of the problem. One explicit factory is easier to read, audit, and debug than reflection when the approved set is small and known.'
      }))
    ]
  },
  {
    id: 'factory-vs-container',
    title: 'Factory vs container',
    navLabel: 'Factory vs container',
    group: 'Factory & policy track',
    level: 'Intermediate',
    time: '12 min',
    sampleSource: 'sample3.txt',
    summary: 'A focused comparison showing that factories and containers solve different levels of creation problems and often work together rather than competing.',
    sections: [
      panel('The key difference in one sentence', `
        <div class="good">
          <div class="callout-title">Short answer</div>
          <div>A factory usually answers <strong>“How do I create this product?”</strong> while a container usually answers <strong>“How do all these parts get wired together, and which ones are reused?”</strong></div>
        </div>
      `),
      panel('Secret report service makes the difference visible', `
        <pre>internal class SecretReportService(
    private val secretVault: SecretVault,
    private val formatter: SecretFormatter,
) {
    fun buildReport(secretId: String): String {
        val secretValue = secretVault.readSecret(secretId)
        return formatter.format(secretId, secretValue)
    }
}</pre>
        <p>Once a class needs more than one collaborator, the container’s role becomes clearer. It can coordinate the whole object graph rather than only one chosen product.</p>
      `),
      panel('Container can use a factory internally', `
        <pre>container.registerSingleton(SecretVault::class) {
    SecretVaultFactory.createProductionVault()
}

container.registerSingleton(SecretFormatter::class) {
    VerboseSecretFormatter()
}

container.registerTransient(SecretReportService::class) {
    SecretReportService(
        secretVault = container.resolve(SecretVault::class),
        formatter = container.resolve(SecretFormatter::class),
    )
}</pre>
        <div class="note">
          <div class="callout-title">Very important</div>
          <div>Factories and containers are not enemies. A container can store a registration whose provider uses a factory. That means containers often build on top of factory logic rather than replacing it.</div>
        </div>
      `),
      panel('Factory vs container comparison', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Question</th><th>Factory</th><th>DI container</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Main purpose</td>
                <td>Create one chosen product or choose one implementation policy</td>
                <td>Store many creation rules and assemble object graphs</td>
              </tr>
              <tr>
                <td>Best when</td>
                <td>The main problem is object selection</td>
                <td>The main problem is wiring many dependencies and lifetimes</td>
              </tr>
              <tr>
                <td>Lifetime handling</td>
                <td>Usually not its primary job</td>
                <td>Usually central to the design</td>
              </tr>
              <tr>
                <td>Can they cooperate?</td>
                <td>Yes — factories can be used inside container registrations</td>
                <td>Yes — containers can resolve graphs that include factory-based dependencies</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Platform mapping', `
        <ul>
          <li><strong>Spring Boot:</strong> use a factory when one bean needs a carefully chosen implementation; use container/module wiring when many beans and scopes must work together.</li>
          <li><strong>Android:</strong> use a factory when you need to produce a policy-selected object; use Hilt/Koin/manual graphs when an entire feature needs coordinated dependencies.</li>
        </ul>
      `),
      panel('Practice task: factory or container for this feature?', teachingTask({
        task: 'Design a media-upload feature. First, the app chooses one storage provider by region. Then the feature also needs a virus scanner, metadata repository, audit logger, retry policy, and background processor. Decide whether this is a factory problem, a container problem, or both.',
        thinkFirst: [
          'Which part is about selecting one product from several options?',
          'Which part is about wiring many collaborators and lifetimes into one feature graph?',
          'Could one tool solve the entire problem cleanly, or do the tools solve different layers of it?'
        ],
        codeId: 'pattern-factory-container-solution',
        codeTitle: 'Factory for provider selection, container/root for the wider feature graph',
        code: `object StorageProviderFactory {
    fun create(region: Region): StorageProvider = when (region) {
        Region.EU -> S3StorageProvider()
        Region.US -> GcsStorageProvider()
    }
}

fun createMediaUploadFeature(region: Region): MediaUploadFeature {
    // Factory solves the focused selection problem.
    val storageProvider = StorageProviderFactory.create(region)

    // Composition root solves the broader graph problem.
    val virusScanner = ClamVirusScanner()
    val metadataRepository = SqlMetadataRepository()
    val auditLogger = StructuredAuditLogger()
    val retryPolicy = ExponentialRetryPolicy()
    val backgroundProcessor = UploadBackgroundProcessor(retryPolicy)

    val uploadService = UploadService(
        storageProvider = storageProvider,
        virusScanner = virusScanner,
        metadataRepository = metadataRepository,
        auditLogger = auditLogger,
        backgroundProcessor = backgroundProcessor,
    )

    return DefaultMediaUploadFeature(uploadService)
}`,
        explanation: [
          {
            title: 'Factory solves the storage-provider choice',
            body: 'Region-based storage selection is one focused product-choice problem. A factory is the right tool because it centralizes that policy cleanly.'
          },
          {
            title: 'The rest of the feature is a graph assembly problem',
            body: 'Virus scanner, repository, logger, retry policy, and background processor form a wider object graph. That is where a composition root or container becomes useful.'
          },
          {
            title: 'The tools cooperate instead of competing',
            body: 'The composition root can call the factory internally. That is the key lesson: factories often handle one selection inside a bigger DI-wiring story.'
          }
        ],
        pipeline: [
          'Caller provides region or environment intent.',
          'Factory chooses the storage provider implementation.',
          'Composition root/container wires the rest of the upload feature around that chosen provider.',
          'Feature exposes a business-facing upload service while infrastructure remains hidden.'
        ],
        spring: [
          'Use a factory for focused selection such as region/provider choice, then wire the full feature in Spring configuration.',
          'Bean scopes and module wiring become more important once the wider graph grows.',
          'Avoid pushing provider selection into controllers or random services.'
        ],
        android: [
          'Use an explicit factory for provider/source/channel selection and Hilt/manual graphs for the larger repository/use-case/background graph.',
          'Workers should reuse the repository/business logic from the composed feature graph.',
          'The ViewModel should call a use case or feature facade, not assemble the graph itself.'
        ],
        mistakes: [
          'Trying to make one giant factory own every dependency and lifetime in the feature.',
          'Using a container directly from business code so dependencies become hidden again.',
          'Forgetting that provider choice and graph assembly are different architectural jobs.'
        ],
        better: 'This solution is better because it assigns each tool to the problem it actually solves: factory for focused choice, composition root/container for multi-dependency wiring. That produces clearer code and better lifetime reasoning than forcing one tool to do everything.'
      }))
    ]
  },
  {
    id: 'pattern-chooser',
    title: 'Pattern chooser',
    navLabel: 'Pattern chooser',
    group: 'Factory & policy track',
    level: 'Advanced',
    time: '11 min',
    sampleSource: 'sample5.txt',
    summary: 'A compact decision guide comparing private constructor factories, explicit factories, reflection-based factories, DI containers, and real-app hidden-implementation factories.',
    sections: [
      panel('Choose the simplest pattern that solves the real problem', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Pattern</th><th>Best for</th><th>Strengths</th><th>Trade-offs</th><th>Recommendation</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Private constructor + factory method</td>
                <td>Validated value objects</td>
                <td>Protects invariants, communicates intent, blocks bad direct construction</td>
                <td>Not for large object graphs</td>
                <td>Use when the object itself must never exist in an invalid state</td>
              </tr>
              <tr>
                <td>Explicit factory</td>
                <td>Readable approved object creation</td>
                <td>Clear, debuggable, maintainable</td>
                <td>Can become repetitive for bigger graphs</td>
                <td>Usually the default choice before reflection</td>
              </tr>
              <tr>
                <td>Reflection-based factory</td>
                <td>Runtime-driven dynamic creation</td>
                <td>Flexible in framework-like scenarios</td>
                <td>Harder to read, more runtime risk</td>
                <td>Use only with a strong reason</td>
              </tr>
              <tr>
                <td>DI container</td>
                <td>Large wiring + lifetime management</td>
                <td>Centralized registrations, object-graph assembly</td>
                <td>Can hide dependencies if misused</td>
                <td>Use when graph size and repetition justify it</td>
              </tr>
              <tr>
                <td>Hidden-implementation factory</td>
                <td>Sensitive or policy-heavy systems</td>
                <td>Narrow safe API, harder to bypass, good with manual or container-backed roots</td>
                <td>Requires careful visibility design</td>
                <td>Use when security/policy control matters more than open extension</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Suggested learning and implementation order', `
        <div class="timeline">
          <div class="step"><strong>1.</strong> Start with constructor injection and simple classes.</div>
          <div class="step"><strong>2.</strong> Learn private constructor + factory method for validated values.</div>
          <div class="step"><strong>3.</strong> Learn explicit factories for approved creation policy.</div>
          <div class="step"><strong>4.</strong> Learn DI containers when wiring becomes repetitive.</div>
          <div class="step"><strong>5.</strong> Learn reflection as an advanced tool, not your default.</div>
          <div class="step"><strong>6.</strong> For sensitive systems, hide implementations behind narrow public APIs.</div>
        </div>
      `),
      panel('Rule-of-thumb matrix for your projects', `
        <div class="tabs" data-tab-group="pattern-chooser-platforms">
          <button class="tab-btn active" data-tab="backend">Backend</button>
          <button class="tab-btn" data-tab="android">Android</button>
          <button class="tab-btn" data-tab="shared">Shared advice</button>
        </div>
        <div class="tab-content active" data-tab-panel="backend">
          <ul>
            <li>Use private-constructor factories for validated config/credential/value types.</li>
            <li>Use explicit factories for provider selection and environment-aware creation.</li>
            <li>Use Spring configuration/container features for module wiring and scopes.</li>
            <li>Prefer hidden-implementation feature APIs when gateways or secrets are sensitive.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="android">
          <ul>
            <li>Use value factories for validated route IDs, tokens, and canonical arguments.</li>
            <li>Use explicit factories when choosing channel/player/source implementations.</li>
            <li>Use Hilt/Koin/manual graphs for feature-level dependency coordination.</li>
            <li>Prefer narrow feature facades over cross-module concrete dependencies.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="shared">
          <ul>
            <li>Start explicit and readable.</li>
            <li>Add dynamic patterns only when they solve a real problem.</li>
            <li>Keep construction policy at the edge.</li>
            <li>Do not let tools/frameworks erase your understanding of the underlying design.</li>
          </ul>
        </div>
      `),
      panel('Practice ladder: pick the smallest sufficient pattern', teachingTask({
        task: 'Solve four architecture decisions in a stricter way: (1) validate and normalize an API key, (2) choose sandbox vs production gateway, (3) wire a feature with many services and lifetime rules, and (4) protect a sensitive adapter from broad outside implementation. Pick the smallest strong tool for each case and show the code shape that proves why.',
        thinkFirst: [
          'Is the main problem object validity, one focused implementation choice, full graph assembly, or policy plus enforcement?',
          'Would constructor injection alone solve the problem, or do you still need a creation/wiring mechanism at the edge?',
          'If the type is sensitive, do you need mere convenience or a stronger visibility boundary too?'
        ],
        codeId: 'patterns-smallest-sufficient-tool-solution',
        codeTitle: 'One worked solution showing value factory, explicit factory, composition root, and hidden boundary',
        code: `class ApiKey private constructor(
    val value: String,
) {
    companion object {
        fun fromRaw(raw: String): ApiKey {
            // Value factory solves validity and normalization at creation time.
            val normalized = raw.trim()
            require(normalized.startsWith("sk_")) { "API key must start with sk_" }
            return ApiKey(normalized)
        }
    }
}

enum class CheckoutEnvironment {
    SANDBOX,
    PRODUCTION,
}

interface PaymentGateway {
    fun charge(amountInCents: Int)
}

class GatewayFactory(
    private val sandboxGateway: PaymentGateway,
    private val productionGateway: PaymentGateway,
) {
    fun create(environment: CheckoutEnvironment): PaymentGateway {
        // Explicit factory solves one focused runtime policy choice.
        return when (environment) {
            CheckoutEnvironment.SANDBOX -> sandboxGateway
            CheckoutEnvironment.PRODUCTION -> productionGateway
        }
    }
}

class BillingFeature(
    val checkoutService: CheckoutService,
    val receiptQueryService: ReceiptQueryService,
)

class BillingCompositionRoot {
    fun createFeature(environment: CheckoutEnvironment): BillingFeature {
        // Composition root is the correct place for graph assembly and lifetime choices.
        val logger = ConsoleBillingLogger()
        val store = InMemoryReceiptStore()
        val gatewayFactory = GatewayFactory(
            sandboxGateway = SandboxPaymentGateway(logger),
            productionGateway = StripePaymentGateway(logger),
        )
        val gateway = gatewayFactory.create(environment)

        val checkoutService = DefaultCheckoutService(gateway, store, logger)
        val receiptQueryService = DefaultReceiptQueryService(store, logger)
        return BillingFeature(checkoutService, receiptQueryService)
    }
}

private interface ApprovedSecretsAdapter {
    fun send(secret: String)
}

private class VaultSecretsAdapter : ApprovedSecretsAdapter {
    override fun send(secret: String) {
        // Hidden boundary prevents broad external implementation.
    }
}

object SecretsFeatureFactory {
    fun create(): SecretPublisher {
        val adapter: ApprovedSecretsAdapter = VaultSecretsAdapter()
        return DefaultSecretPublisher(adapter)
    }
}`,
        explanation: [
          {
            title: 'Private constructor plus factory is for value correctness',
            body: 'The <code>ApiKey</code> example is not solving a graph problem. It is solving “never let an invalid raw string become a trusted key object.” That is why a private constructor and factory method are the smallest strong tool.'
          },
          {
            title: 'Explicit factory is for one focused choice',
            body: 'The gateway choice is one policy decision driven by environment. A dedicated factory is enough because the main job is “pick one implementation”, not “assemble a whole graph with many scopes.”'
          },
          {
            title: 'Composition root is for graph assembly and lifetime coordination',
            body: 'Once you must create logger, shared store, gateway, write side, and read side together, the problem is no longer a single choice. It is a graph-assembly problem, so the composition root becomes the right tool.'
          },
          {
            title: 'Hidden boundary adds enforcement, not only convenience',
            body: 'The secrets adapter is <code>private</code>, so callers cannot casually implement it from outside. That is stronger than merely documenting approved types in prose.'
          }
        ],
        pipeline: [
          'Raw string enters a value factory and becomes a valid <code>ApiKey</code> or fails fast.',
          'Environment intent reaches the explicit factory, which chooses the gateway implementation.',
          'Composition root assembles the full feature graph and preserves shared state intentionally.',
          'Sensitive adapter stays behind a hidden boundary so the public API remains safe and narrow.'
        ],
        spring: [
          'Use private-constructor factories for validated config/value types before they ever reach Spring services.',
          'Use an explicit factory or small selector bean when runtime policy must choose one gateway implementation.',
          'Use <code>@Configuration</code> or module wiring when many collaborators and scopes must be assembled together.',
          'Keep secrets/provider adapters package-private or internal when the extension point should not be public.'
        ],
        android: [
          'Use value factories for validated route args, IDs, tokens, and config values.',
          'Use explicit factories when the app must choose one player/channel/provider implementation based on mode.',
          'Use Hilt/manual graphs for screen-feature assembly, repository wiring, and lifetime coordination.',
          'Keep sensitive SDK wrappers hidden behind repositories or feature facades instead of exposing them to screens.'
        ],
        mistakes: [
          'Using a DI container just to validate one string value object.',
          'Using reflection or a huge container when one explicit factory would solve the focused choice cleanly.',
          'Treating a visibility/enforcement problem as if it were only a creation-convenience problem.',
          'Letting controllers, ViewModels, or use cases become the place where all four decisions happen at once.'
        ],
        better: 'This solution is better than a flat lookup table because it shows that each tool matches a different problem category. Instead of memorizing “factory vs container”, you can now ask: is this a value-validity problem, a one-choice policy problem, a graph-assembly problem, or a boundary-enforcement problem?'
      }))
    ]
  },
  {
    id: 'allowlist-vs-hidden-boundary',
    title: 'Allowlist vs hidden boundary',
    navLabel: 'Allowlist vs hidden boundary',
    group: 'Factory & policy track',
    level: 'Advanced',
    time: '10 min',
    sampleSource: 'sample7.txt',
    summary: 'A policy lesson showing the difference between ordinary interfaces + allowlists and stronger hidden-boundary designs.',
    sections: [
      hero(
        'Allowlists are policy. Hidden boundaries are stronger design control.',
        ['Policy vs enforcement', 'Sensitive gateways', 'Visibility matters'],
        `
          <p>This lesson captures a subtle but very important idea: an allowlist is useful, but it does nothing unless something actually enforces it.</p>
          <div class="warn">
            <div class="callout-title">Important distinction</div>
            <div>If an interface stays broadly visible, outside code can often still create additional implementations. The allowlist is a policy layer, not total language-level prevention.</div>
          </div>
        `
      ),
      panel('The allowlist example', `
        <pre>internal sealed interface SensitiveGateway {
    fun transmit(secret: String)
}

object SensitivityGatewayAllowlist {
    private val allowedImplementations: Set<KClass&lt;out SensitiveGateway&gt;> = setOf(
        RealSensitiveGateway::class,
        AuditOnlyGateway::class,
    )

    internal fun requireApproved(gateway: KClass&lt;out SensitiveGateway&gt;) {
        require(gateway in allowedImplementations) {
            "Implementation is NOT approved"
        }
    }
}</pre>
        <p>The allowlist knows which implementations are approved, but it still needs an enforcement point such as a factory, DI registration validator, build rule, or test.</p>
      `),
      panel('What an allowlist is good at', `
        <ul>
          <li>Centralizing policy about approved types.</li>
          <li>Validating registrations at the edge.</li>
          <li>Supporting tests or build-time checks.</li>
          <li>Helping document exactly which implementations are allowed.</li>
        </ul>
      `),
      panel('What an allowlist does not solve alone', `
        <div class="compare-grid">
          <div class="compare-card dont">
            <h3>Not enough by itself</h3>
            <ul>
              <li>It does not magically stop code from writing a new implementation if the type is still widely visible.</li>
              <li>It does not enforce anything unless some creation path checks it.</li>
              <li>It is weaker than a fully hidden private/internal sensitive contract.</li>
            </ul>
          </div>
          <div class="compare-card do">
            <h3>Use it with</h3>
            <ul>
              <li>Factories</li>
              <li>Container registration validation</li>
              <li>Tests/build rules</li>
              <li>Stronger visibility boundaries when possible</li>
            </ul>
          </div>
        </div>
      `),
      panel('Decision rule for real projects', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>If your goal is...</th><th>Prefer...</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Documenting approved implementations</td>
                <td>Allowlist policy</td>
                <td>Centralizes the approved set clearly</td>
              </tr>
              <tr>
                <td>Harder-to-bypass internal enforcement</td>
                <td>Hidden private/internal boundary</td>
                <td>Outside code cannot casually implement or inject the type</td>
              </tr>
              <tr>
                <td>Operational safety with external modules</td>
                <td>Allowlist + factory + validation</td>
                <td>Policy and enforcement work together</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="note">
          <div class="callout-title">Bridge to the billing lesson</div>
          <div>The billing sample moves beyond an allowlist-only approach by hiding the sensitive gateway contract itself. That is a stronger boundary when policy-heavy adapters should not be broadly extended.</div>
        </div>
      `),
      panel('Practice task: choose policy only or policy plus enforcement', teachingTask({
        task: 'Your team exposes a payment adapter interface publicly across modules, but only two implementations are approved. Another team can still create its own implementation unless something stops them. Decide whether allowlist policy alone is enough or whether you need stronger enforcement.',
        thinkFirst: [
          'If the type remains public, can another team still implement it outside the approved set?',
          'Which tool is documenting policy, and which tool is actually preventing bypass?',
          'Would hiding the extension point entirely be safer than merely checking it later?'
        ],
        codeId: 'pattern-policy-enforcement-solution',
        codeTitle: 'Allowlist plus enforced creation path for a sensitive adapter',
        code: `internal sealed interface SensitivePaymentGateway {
    fun charge(request: ChargeRequest): GatewayChargeResult
}

private class StripeGateway : SensitivePaymentGateway {
    override fun charge(request: ChargeRequest): GatewayChargeResult = TODO()
}

private class SandboxGateway : SensitivePaymentGateway {
    override fun charge(request: ChargeRequest): GatewayChargeResult = TODO()
}

object ApprovedGatewayFactory {
    fun create(environment: CheckoutEnvironment): SensitivePaymentGateway = when (environment) {
        // Enforcement happens here because outside code cannot provide its own gateway.
        CheckoutEnvironment.PRODUCTION -> StripeGateway()
        CheckoutEnvironment.SANDBOX -> SandboxGateway()
    }
}

interface BillingFeature {
    fun charge(request: ChargeRequest): PaymentReceipt
}`,
        explanation: [
          {
            title: 'Allowlist policy alone is not enough when the type stays broadly visible',
            body: 'A public interface plus an allowlist only documents the approved set unless some creation path validates it. Other teams can still implement the public type unless the design restricts them.'
          },
          {
            title: 'Hidden boundaries add real enforcement',
            body: 'Making the sensitive gateway internal/private prevents casual outside implementation. The public surface becomes a narrower feature API, which is safer for policy-heavy adapters.'
          },
          {
            title: 'The factory now enforces the approved set',
            body: 'Because the concrete implementations are hidden and the factory is the approved creation path, callers cannot bypass the policy as easily.'
          }
        ],
        pipeline: [
          'Caller asks the public feature for a business capability, not for a gateway implementation.',
          'Factory/composition-root code selects one hidden approved gateway.',
          'Business service coordinates the hidden gateway behind a public feature boundary.',
          'Outside modules cannot casually inject unapproved implementations because the extension point is hidden.'
        ],
        spring: [
          'Prefer wiring approved hidden adapters in configuration and exposing only feature/use-case beans publicly.',
          'If the adapter remains public, add factory or registration validation so policy is actually checked.',
          'Avoid letting every module depend directly on raw provider interfaces when the adapter is sensitive.'
        ],
        android: [
          'Hide provider SDK wrappers and expose a repository/feature facade across modules instead.',
          'Use Hilt modules or manual feature assembly to choose implementations at the edge.',
          'Do not let ViewModels or other modules depend on sensitive adapter contracts directly if policy control matters.'
        ],
        mistakes: [
          'Assuming an allowlist automatically prevents unapproved implementations.',
          'Keeping a dangerous extension point public only because mocking feels easier.',
          'Mixing public feature APIs with low-level sensitive adapter contracts.'
        ],
        better: 'This solution is better because it combines policy with enforcement. Instead of merely stating which adapters are approved, it narrows the public surface so the design itself helps prevent misuse.'
      }))
    ]
  }
];

