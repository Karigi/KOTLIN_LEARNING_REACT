import { hero, panel } from './contentBuilders';
import { foundationViews } from './foundationsContent';
import { patternViews } from './patternsContent';
import { comparisonViews } from './comparisonsContent';
import { platformStarterViews } from './platformStartersContent';
import { importantConceptViews } from './importantConceptsContent';
import { masteryViews } from './masteryContent';
import { advancedViews } from './advancedContent';

export const appMeta = {
  title: 'Billing DI learning webapp',
  description:
    'Interactive masterclass on Kotlin DI foundations, creation patterns, lifetimes, composition roots, feature bundles, mastery checks, Spring Boot and Android mapping, and the shared receipt pipeline.'
};

export const views = [
  {
    id: 'home',
    title: 'Start here',
    navLabel: 'Start here',
    sections: [
      hero(
        'Billing DI masterclass with the shared receipt pipeline',
        [
          'Deep version',
          'Phone friendly',
          'Line-by-line',
          'Future design guide'
        ],
        `
          <p>This webapp is the full local project version of the lesson. It is built as a small multi-view single-page app so you can run it in IntelliJ on localhost without a heavy framework, while still getting strong structure, navigation, and maintainability.</p>
          <div class="good">
            <div class="callout-title">What this app is trying to teach</div>
            <div>You are not only learning what the current Kotlin code does. You are also learning how to design similar systems yourself: what to expose publicly, what to hide, where to create objects, when to use a factory, when to use a container, and how to make write-side and read-side services share the right state.</div>
          </div>
          <div class="note">
            <div class="callout-title">If you feel confused, start smaller on purpose</div>
            <div>Use the <strong>Welcome foundations</strong>, <strong>Constructor injection</strong>, <strong>Testability with fakes</strong>, and <strong>Container basics</strong> lessons as tutorial mode. They teach the same DI ideas with a simpler welcome-message domain before you return to the richer billing architecture.</div>
          </div>
        `
      ),
      panel('Big picture first', `
        <div class="grid grid-3">
          <div class="card">
            <div class="key">Public side</div>
            <p>The rest of the app should mostly see <code>ChargeRequest</code>, <code>PaymentReceipt</code>, <code>CheckoutService</code>, <code>ReceiptQueryService</code>, <code>BillingFeature</code>, and <code>CheckoutServiceFactory</code>.</p>
          </div>
          <div class="card">
            <div class="key">Hidden side</div>
            <p>The gateway contract, concrete gateway implementations, store abstraction, logger abstraction, store implementation, service implementations, and feature implementation stay hidden.</p>
          </div>
          <div class="card">
            <div class="key">Assembly side</div>
            <p>The composition roots and the container configure how the graph is built. That is the program edge where creation policy lives.</p>
          </div>
        </div>
        <div class="flow">
          <div class="node main">Caller</div>
          <div class="arrow">→ asks →</div>
          <div class="node factory">CheckoutServiceFactory</div>
          <div class="arrow">→ delegates →</div>
          <div class="node root">composition root / container root</div>
          <div class="arrow">→ builds →</div>
          <div class="node bundle">BillingFeature</div>
          <div class="arrow">→ exposes →</div>
          <div class="node public">write API + read API</div>
        </div>
      `),
      panel('Analogy: restaurant cashier, records clerk, and ledger book', `
        <ul>
          <li><strong>CheckoutService</strong> is like the cashier taking payment and generating a receipt.</li>
          <li><strong>ReceiptQueryService</strong> is like the records clerk who can later look up receipts.</li>
          <li><strong>ReceiptStore</strong> is the shared ledger book where receipts are written and later read.</li>
          <li><strong>BillingFeature</strong> is the front desk bundle that gives you both the cashier and the clerk from the same office, using the same ledger book.</li>
          <li><strong>Composition root</strong> is the manager deciding which cashier, which clerk, and which ledger book the office uses.</li>
          <li><strong>Container</strong> is the manager’s registry of staffing rules: who is shared, who is fresh, and how roles get assembled.</li>
        </ul>
      `),
      panel('How to use the deeper practice-driven version of the app', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>Foundation mode</h3>
            <p>Start with <strong>Welcome foundations</strong>, <strong>Constructor injection</strong>, <strong>Testability with fakes</strong>, and <strong>Container basics</strong>. These now include concrete tasks plus worked solutions so you can practice before reading the answer.</p>
          </div>
          <div class="compare-card do">
            <h3>Backend mode</h3>
            <p>Move next to <strong>Architecture comparisons</strong>, <strong>Spring Boot starter kit</strong>, <strong>Spring Boot complete feature</strong>, and <strong>Spring end-to-end map</strong>. Read them as one request pipeline: boundary → use case → hidden adapters → persistence → testing.</p>
          </div>
          <div class="compare-card do">
            <h3>Android mode</h3>
            <p>Pair <strong>Scope comparisons</strong>, <strong>Android starter kit</strong>, <strong>Android Hilt complete feature</strong>, and <strong>Android end-to-end map</strong>. Follow one user action all the way from UI intent to ViewModel, repository, local/remote data, and worker reuse.</p>
          </div>
          <div class="compare-card do">
            <h3>Mastery mode</h3>
            <p>Use the self-check, confusion, mapping, and review pages last. Their job is not to introduce concepts for the first time, but to make you translate them into your own backend and Android code deliberately.</p>
          </div>
        </div>
        <div class="note">
          <div class="callout-title">Best study rhythm</div>
          <div>For each concept, try the task first, sketch your own pipeline or architecture on paper, then open the worked solution and compare your reasoning. That is how passive recognition turns into real design skill.</div>
        </div>
        <div class="good">
          <div class="callout-title">New deepest path</div>
          <div>If you want the strictest learning route, use the <strong>Mastery lab</strong> as a challenge ladder and pair it with the Android lessons that now explain <strong>repository vs DAO</strong> boundaries in more detail.</div>
        </div>
      `)
    ]
  },
  ...foundationViews,
  ...patternViews,
  ...comparisonViews,
  ...importantConceptViews,
  ...masteryViews,
  {
    id: 'public-api',
    title: 'Public API',
    navLabel: 'Public API',
    sections: [
      panel('ChargeRequest', `
        <pre>data class ChargeRequest(
    val customerId: String,
    val paymentToken: String,
    val amountInCents: Int,
) {
    init {
        require(customerId.isNotBlank()) { "customerId must not be blank" }
        require(paymentToken.isNotBlank()) { "paymentToken must not be blank" }
        require(amountInCents > 0) { "amountInCents must be greater than 0" }
    }
}</pre>
        <p>This is the public input model for the write-side operation. It is a <code>data class</code>, so it mainly carries data. The constructor properties use <code>val</code>, meaning they become read-only stored properties. The <code>init</code> block runs immediately and prevents invalid requests from existing.</p>
        <div class="impl">
          <h3>Small implementation example</h3>
          <pre>val request = ChargeRequest(
    customerId = "cust-001",
    paymentToken = "tok_demo_123",
    amountInCents = 2500,
)
val receipt = checkoutService.charge(request)</pre>
          <p><strong>Where to use it:</strong> controllers, route handlers, view models, tests.</p>
          <p><strong>What not to put here:</strong> database calls, logging, DI lookups, gateway behavior.</p>
        </div>
      `),
      panel('PaymentReceipt', `
        <pre>data class PaymentReceipt(
    val receiptId: String,
    val customerId: String,
    val amountInCents: Int,
    val gatewayName: String,
    val authorizationCode: String,
)</pre>
        <p>This is the public output model. It is intentionally higher-level than the hidden gateway result type, and it is reused as the read model returned by receipt-history queries.</p>
        <div class="impl">
          <pre>val receipt: PaymentReceipt = checkoutService.charge(request)
println(receipt.receiptId)
println(receipt.gatewayName)</pre>
          <p><strong>Where to use it:</strong> UI rendering, API responses, history lists, printable receipts.</p>
        </div>
      `),
      panel('CheckoutService', `
        <pre>interface CheckoutService {
    fun charge(request: ChargeRequest): PaymentReceipt
}</pre>
        <p>This is the public write-side business API. Callers ask for a business capability, not for a gateway, logger, or store.</p>
        <div class="impl">
          <pre>fun payInvoice(checkoutService: CheckoutService) {
    val receipt = checkoutService.charge(
        ChargeRequest("cust-002", "tok_abc", 5000)
    )
    println("Paid with receipt \${receipt.receiptId}")
}</pre>
        </div>
      `),
      panel('ReceiptQueryService', `
        <pre>interface ReceiptQueryService {
    fun showReceipts(): List&lt;PaymentReceipt&gt;
}</pre>
        <p>This is the public read-side API. The design deliberately separates reading stored receipts from charging customers. That keeps write-side and read-side responsibilities clear.</p>
        <div class="good">
          <div class="callout-title">Key lesson</div>
          <div>If the write-side and read-side services share the same store, querying will see previous writes. If they use different stores, their histories diverge.</div>
        </div>
        <div class="impl">
          <pre>fun renderReceiptHistory(queryService: ReceiptQueryService) {
    val receipts = queryService.showReceipts()
    receipts.forEach { println("\${it.receiptId} -> \${it.amountInCents}") }
}</pre>
        </div>
      `),
      panel('BillingFeature', `
        <pre>interface BillingFeature {
    val checkoutService: CheckoutService
    val receiptQueryService: ReceiptQueryService
}</pre>
        <p>This bundle packages both public capabilities from one shared object graph. Its purpose is to guarantee that both services come from the same composition root and therefore share the same hidden store.</p>
        <div class="impl">
          <pre>val feature = CheckoutServiceFactory.createProductionFeature()

feature.checkoutService.charge(
    ChargeRequest("cust-003", "tok_x", 1200)
)

println(feature.receiptQueryService.showReceipts())</pre>
          <p><strong>What not to do:</strong> use one giant feature bundle as a dumping ground for unrelated services.</p>
        </div>
      `),
      panel('CheckoutEnvironment', `
        <pre>enum class CheckoutEnvironment {
    PRODUCTION,
    SANDBOX,
}</pre>
        <p>The caller says “I want production” or “I want sandbox” without naming hidden gateway implementations directly. This keeps implementation policy centralized.</p>
      `)
    ]
  },
  {
    id: 'hidden-internals',
    title: 'Hidden internals',
    navLabel: 'Hidden internals',
    sections: [
      panel('ApprovedPaymentGateway', `
        <pre>private sealed interface ApprovedPaymentGateway {
    fun charge(request: ChargeRequest): GatewayChargeResult
}</pre>
        <p>This is the sensitive extension point. Because it is <code>private</code>, other files cannot name it, implement it, or pass their own implementations into public APIs. This is the real defense boundary.</p>
        <div class="impl">
          <pre>// Similar future pattern:
public interface EmailFeature { fun sendEmail(...) }

private interface ApprovedEmailProvider { fun sendRaw(...) }

private class SesEmailProvider : ApprovedEmailProvider { ... }
private class SandboxEmailProvider : ApprovedEmailProvider { ... }</pre>
        </div>
      `),
      panel('GatewayChargeResult', `
        <pre>private data class GatewayChargeResult(
    val gatewayName: String,
    val authorizationCode: String,
)</pre>
        <p>This is the internal low-level result returned by the gateway layer. The checkout service translates it into the public <code>PaymentReceipt</code>.</p>
      `),
      panel('LoggerData', `
        <pre>private data class LoggerData(
    val event: String,
    val component: String,
    val customerId: String,
    val amountInCents: Int,
    val receiptId: String? = null,
    val gatewayName: String? = null,
    val isReceiptSaved: Boolean? = null,
)</pre>
        <p>This is a structured log payload. Instead of spreading raw log strings everywhere, the code uses one consistent data shape.</p>
      `),
      panel('ReceiptStore', `
        <pre>private interface ReceiptStore {
    fun save(receipt: PaymentReceipt)
    fun allReceipts(): List&lt;PaymentReceipt&gt;
}</pre>
        <p>This hidden abstraction is the bridge between write-side and read-side behavior. The write side saves receipts into it. The read side asks it for all receipts.</p>
      `),
      panel('BillingLogger', `
        <pre>private interface BillingLogger {
    fun log(loggerData: LoggerData)
}</pre>
        <p>This hidden abstraction lets services and gateways log without caring which concrete logger is used.</p>
      `),
      panel('InMemoryReceiptStore', `
        <pre>private class InMemoryReceiptStore : ReceiptStore {
    private val storedReceipts = mutableListOf&lt;PaymentReceipt&gt;()

    override fun save(receipt: PaymentReceipt) {
        storedReceipts += receipt
    }

    override fun allReceipts(): List&lt;PaymentReceipt&gt; {
        return storedReceipts.toList()
    }
}</pre>
        <p>This implementation owns the actual mutable list where receipts accumulate. Receipt history is tied to the lifetime of this store object. Share the object and you share history. Create a different store and you get a different history.</p>
        <div class="impl">
          <pre>// Good lesson/test store
val store = InMemoryReceiptStore()

// Possible production replacements
DatabaseReceiptStore(...)
RedisReceiptStore(...)
EventSourcedReceiptStore(...)</pre>
        </div>
      `),
      panel('ConsoleBillingLogger', `
        <pre>private class ConsoleBillingLogger : BillingLogger {
    override fun log(loggerData: LoggerData) { ... }
}</pre>
        <p>This concrete logger prints structured lines. In a real app, the same abstraction could be backed by JSON logs, telemetry, or an observability pipeline.</p>
      `),
      panel('DefaultCheckoutService', `
        <pre>private class DefaultCheckoutService(
    private val gateway: ApprovedPaymentGateway,
    private val receiptStore: ReceiptStore,
    private val auditLogger: BillingLogger,
) : CheckoutService {
    override fun charge(request: ChargeRequest): PaymentReceipt { ... }
}</pre>
        <p>This is the write-side service implementation. It uses constructor injection, meaning the gateway, store, and logger are provided from outside instead of being created internally.</p>
        <div class="timeline">
          <div class="step"><strong>1.</strong> Log <code>charge_started</code>.</div>
          <div class="step"><strong>2.</strong> Delegate the low-level charge to the approved gateway.</div>
          <div class="step"><strong>3.</strong> Receive a hidden gateway result.</div>
          <div class="step"><strong>4.</strong> Translate that into a public <code>PaymentReceipt</code>.</div>
          <div class="step"><strong>5.</strong> Save the receipt into the shared hidden store.</div>
          <div class="step"><strong>6.</strong> Log completion and return the receipt.</div>
        </div>
      `),
      panel('DefaultReceiptQueryService', `
        <pre>private class DefaultReceiptQueryService(
    private val receiptStore: ReceiptStore,
    private val auditLogger: BillingLogger,
) : ReceiptQueryService {
    override fun showReceipts(): List&lt;PaymentReceipt&gt; {
        val receipts = receiptStore.allReceipts()
        auditLogger.log(...)
        return receipts
    }
}</pre>
        <p>This is the read-side companion to the checkout service. Its job is narrow: ask the shared store for current receipts, log the query, and return the results as public data.</p>
      `),
      panel('DefaultBillingFeature', `
        <pre>private data class DefaultBillingFeature(
    override val checkoutService: CheckoutService,
    override val receiptQueryService: ReceiptQueryService,
) : BillingFeature</pre>
        <p>This private implementation packages the two public services into one shared feature bundle.</p>
      `),
      panel('StripePaymentGateway and SandboxPaymentGateway', `
        <pre>private class StripePaymentGateway private constructor(...) : ApprovedPaymentGateway {
    companion object {
        fun create(apiKey: String, logger: BillingLogger): StripePaymentGateway { ... }
    }
}

private class SandboxPaymentGateway(
    private val logger: BillingLogger,
) : ApprovedPaymentGateway { ... }</pre>
        <p>The production gateway uses a private constructor plus validated factory method. The sandbox gateway is the safe alternative used for non-production flows.</p>
      `)
    ]
  },
  {
    id: 'roots-and-container',
    title: 'Container and roots',
    navLabel: 'Container and roots',
    sections: [
      panel('BillingLessonContainer', `
        <pre>internal class BillingLessonContainer {
    private val singletonProviders = mutableMapOf&lt;KClass&lt;*&gt;, () -&gt; Any&gt;()
    private val singletonInstances = mutableMapOf&lt;KClass&lt;*&gt;, Any&gt;()
    private val transientProviders = mutableMapOf&lt;KClass&lt;*&gt;, () -&gt; Any&gt;()
}</pre>
        <p>This tiny container is an educational registry of creation rules. It stores recipes for object creation and separates singleton recipes from transient recipes.</p>
        <div class="note">
          <div class="callout-title">Important</div>
          <div>Registration stores the rule. Resolution creates the object according to the rule.</div>
        </div>
      `),
      panel('registerSingleton()', `
        <pre>fun &lt;T : Any&gt; registerSingleton(type: KClass&lt;T&gt;, provider: () -&gt; T) {
    singletonProviders[type] = provider
}</pre>
        <p>This stores a provider recipe that means: create once on first use, then reuse the same instance.</p>
      `),
      panel('registerTransient()', `
        <pre>fun &lt;T : Any&gt; registerTransient(type: KClass&lt;T&gt;, provider: () -&gt; T) {
    transientProviders[type] = provider
}</pre>
        <p>This stores a provider recipe that means: run the provider every time and return a fresh object.</p>
      `),
      panel('resolve()', `
        <pre>@Suppress("UNCHECKED_CAST")
fun &lt;T : Any&gt; resolve(type: KClass&lt;T&gt;): T { ... }</pre>
        <p>This is where configuration becomes a real object. The lookup order is:</p>
        <div class="timeline">
          <div class="step"><strong>1.</strong> cached singleton instance</div>
          <div class="step"><strong>2.</strong> singleton provider</div>
          <div class="step"><strong>3.</strong> transient provider</div>
          <div class="step"><strong>4.</strong> error if nothing is registered</div>
        </div>
      `),
      panel('createBillingLessonContainer()', `
        <pre>container.registerSingleton(BillingLogger::class) { ConsoleBillingLogger() }
container.registerSingleton(ReceiptStore::class) { InMemoryReceiptStore() }
container.registerSingleton(ApprovedPaymentGateway::class) { ... }

container.registerTransient(CheckoutService::class) { ... }
container.registerTransient(ReceiptQueryService::class) { ... }
container.registerTransient(BillingFeature::class) { ... }</pre>
        <p>This is the container configuration function, effectively the container version of the composition root. The critical design choice is that <code>ReceiptStore</code> is singleton while the public services and the bundle are transient wrappers.</p>
      `),
      panel('BillingCompositionRoot', `
        <pre>fun createFeature(environment: CheckoutEnvironment): BillingFeature {
    val auditLogger: BillingLogger = ConsoleBillingLogger()
    val receiptStore: ReceiptStore = InMemoryReceiptStore()
    val gateway: ApprovedPaymentGateway = when (environment) { ... }

    val checkoutService: CheckoutService = DefaultCheckoutService(...)
    val receiptQueryService: ReceiptQueryService = DefaultReceiptQueryService(...)

    return DefaultBillingFeature(...)
}</pre>
        <p>This is the explicit manual object graph assembly. It is one of the best ways to learn DI because you can literally see each dependency being chosen and connected.</p>
      `),
      panel('BillingContainerCompositionRoot', `
        <pre>fun createFeature(environment: CheckoutEnvironment): BillingFeature {
    val container = createBillingLessonContainer(environment)
    return container.resolve(BillingFeature::class)
}</pre>
        <p>This is the container-backed version of the same assembly idea. It is more indirect than the manual root, but scales better as graphs and lifetime rules grow.</p>
      `),
      panel('CheckoutServiceFactory', `
        <pre>fun createFeature(environment: CheckoutEnvironment): BillingFeature = ...
fun createFeatureWithContainer(environment: CheckoutEnvironment): BillingFeature = ...

fun createProductionFeature(): BillingFeature = ...
fun createSandboxFeature(): BillingFeature = ...
fun createProductionFeatureWithContainer(): BillingFeature = ...
fun createSandboxFeatureWithContainer(): BillingFeature = ...</pre>
        <p>This is the public entry point. Callers should usually prefer this level instead of touching roots or container configuration directly.</p>
      `)
    ]
  },
  {
    id: 'pipelines',
    title: 'Pipelines',
    navLabel: 'Pipelines',
    sections: [
      panel('Detailed manual pipeline', `
        <p>Read this like a slow-motion assembly video. The important question is not only <em>what gets created</em>, but also <em>which objects must point at the same shared store</em> so the write side and read side stay connected.</p>
        <div class="timeline">
          <div class="step"><strong>1.</strong> Caller asks <code>CheckoutServiceFactory.createProductionFeature()</code> because the caller wants one safe public entry point instead of manually wiring hidden internals.</div>
          <div class="step"><strong>2.</strong> The public factory delegates to <code>BillingCompositionRoot.createFeature(PRODUCTION)</code>, which is the real assembly room where implementation choices are allowed.</div>
          <div class="step"><strong>3.</strong> The manual root creates one logger and one store first, because both the write side and read side must later reuse those same supporting objects.</div>
          <div class="step"><strong>4.</strong> It chooses the approved production gateway. This is the policy decision point: which concrete gateway should fulfill the payment role for this environment?</div>
          <div class="step"><strong>5.</strong> It creates one checkout service using that shared store. The checkout service will later write receipts into the store.</div>
          <div class="step"><strong>6.</strong> It creates one query service using that very same shared store. The query service will later read receipts out of the store.</div>
          <div class="step"><strong>7.</strong> It packages both services into one <code>BillingFeature</code>, which is the public bundle the caller receives.</div>
          <div class="step"><strong>8.</strong> Caller charges through the write side, then reads through the query side. The caller does not need to know anything about the logger, gateway, or store implementation.</div>
          <div class="step"><strong>9.</strong> Because the same store instance is shared, the query side sees the new receipts. That shared object identity is the whole reason the feature bundle and composition root matter.</div>
        </div>
        <div class="note">
          <div class="callout-title">Concrete analogy</div>
          <div>Imagine one office with one filing cabinet. The cashier writes receipts into that cabinet, and the records clerk later reads from that same cabinet. If they accidentally use different cabinets, the records clerk will say “I cannot find the receipt,” even though the cashier did create one.</div>
        </div>
      `),
      panel('Detailed container pipeline', `
        <p>The container version solves the same problem as the manual root. The difference is that instead of visibly passing one local variable around, you teach the container rules about <strong>what should be reused</strong> and <strong>what should be freshly created</strong>.</p>
        <div class="timeline">
          <div class="step"><strong>1.</strong> Caller asks <code>CheckoutServiceFactory.createProductionFeatureWithContainer()</code>, again using a safe public entry point.</div>
          <div class="step"><strong>2.</strong> The public factory delegates to the container composition root, where registrations are configured before any real feature object is returned.</div>
          <div class="step"><strong>3.</strong> The container is configured with singleton rules for logger, store, and gateway. In plain English: make one of each and keep reusing them.</div>
          <div class="step"><strong>4.</strong> It is configured with transient rules for checkout service, query service, and the feature bundle. In plain English: build a fresh wrapper when asked, but let those fresh wrappers depend on the shared singletons underneath.</div>
          <div class="step"><strong>5.</strong> The root resolves <code>BillingFeature</code>. That kicks off a chain of provider calls inside the container.</div>
          <div class="step"><strong>6.</strong> The feature provider resolves both services. Those service providers then resolve their own dependencies.</div>
          <div class="step"><strong>7.</strong> Both services resolve the same singleton store underneath, so even though the services themselves may be fresh objects, the shared state still lives in one place.</div>
          <div class="step"><strong>8.</strong> Caller uses the write side and read side exactly as in the manual version, which proves that the public API shape can stay stable while the assembly strategy changes behind the scenes.</div>
        </div>
      `),
      panel('Detailed shared-store pipeline', `
        <p>This is the most important pipeline in the whole billing lesson. If this part is clear, the rest of the architecture becomes much easier to reason about.</p>
        <div class="flow">
          <div class="node public">CheckoutService.charge()</div>
          <div class="arrow">creates</div>
          <div class="node public">PaymentReceipt</div>
          <div class="arrow">saves into</div>
          <div class="node data">ReceiptStore</div>
        </div>
        <div class="flow">
          <div class="node query">ReceiptQueryService.showReceipts()</div>
          <div class="arrow">reads from</div>
          <div class="node data">ReceiptStore</div>
          <div class="arrow">returns</div>
          <div class="node public">List&lt;PaymentReceipt&gt;</div>
        </div>
        <div class="good">
          <div class="callout-title">Read this as one story</div>
          <div>The write side creates a receipt and drops it into shared storage. Later, the read side walks to that same shared storage and reads it back out. The read-side service is not magic; it only works because the write side and read side agree on where history lives.</div>
        </div>
        <div class="warn">
          <div class="callout-title">The failure case to remember</div>
          <div>If the two public services do not share the same store instance, you may charge successfully and then query an empty history. That is why the bundle and the composition roots matter so much.</div>
        </div>
      `),
      panel('Compare manual vs container', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Question</th><th>Manual createFeature()</th><th>Container createFeature()</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>How is shared state achieved?</td>
                <td>By explicitly reusing the same local <code>receiptStore</code> variable and passing that one object into both services</td>
                <td>By registering <code>ReceiptStore</code> as singleton so both service providers resolve the exact same underlying store object</td>
              </tr>
              <tr>
                <td>Where is the bundle built?</td>
                <td>Directly inside the composition root</td>
                <td>Inside a transient provider for <code>BillingFeature</code></td>
              </tr>
              <tr>
                <td>Which is easier to read at first?</td>
                <td>Usually manual</td>
                <td>Usually container after you already understand the manual graph</td>
              </tr>
            </tbody>
          </table>
        </div>
      `)
    ]
  },
  {
    id: 'implementation-guide',
    title: 'Implementation guide',
    navLabel: 'Implementation guide',
    sections: [
      panel('How to apply this in future designs', `
        <div class="grid grid-3">
          <div class="card">
            <div class="key">1. Start from public use cases</div>
            <p>First define the business-facing API you actually want callers to use.</p>
          </div>
          <div class="card">
            <div class="key">2. Hide sensitive internals</div>
            <p>Keep risky low-level contracts private or internal if random implementations would be dangerous or confusing.</p>
          </div>
          <div class="card">
            <div class="key">3. Assemble at the edge</div>
            <p>Use a composition root or a container module to decide implementations and lifetimes outside business classes.</p>
          </div>
        </div>
        <div class="impl">
          <pre>public interface OrdersFeature {
    val orderService: OrderService
    val orderHistoryQuery: OrderHistoryQuery
}

private interface ApprovedPaymentGateway { ... }
private interface OrderStore { ... }

private class DefaultOrderService(...) : OrderService
private class DefaultOrderHistoryQuery(...) : OrderHistoryQuery

internal object OrdersCompositionRoot {
    fun createFeature(...): OrdersFeature { ... }
}</pre>
        </div>
      `),
      panel('What goes where', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Layer / place</th><th>What goes there</th><th>Why</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Public API layer</td>
                <td>Request/response models, public service interfaces, feature bundles, environment enums if needed</td>
                <td>Callers need stable, understandable entry points</td>
              </tr>
              <tr>
                <td>Private/internal infrastructure</td>
                <td>Low-level adapters, hidden plug-in points, concrete service implementations, stores, loggers</td>
                <td>These are implementation details and policy boundaries</td>
              </tr>
              <tr>
                <td>Composition root</td>
                <td>Object assembly, implementation selection, environment policy</td>
                <td>Creation decisions should live at the edge</td>
              </tr>
              <tr>
                <td>Container config</td>
                <td>Registration rules, singleton/transient choices, provider composition</td>
                <td>Centralizes graph wiring when graphs grow</td>
              </tr>
              <tr>
                <td>Public factory</td>
                <td>Convenient safe entry points for callers</td>
                <td>Makes call sites simple and hides the assembly details</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('What not to put where', `
        <ul>
          <li>Do not put gateway-construction logic inside public callers.</li>
          <li>Do not put container lookups all over business classes.</li>
          <li>Do not expose hidden mutable infrastructure when public data is enough.</li>
          <li>Do not make every internal contract public “just in case” if you do not actually want broad external implementations.</li>
          <li>Do not force one giant service interface to own every read and write concern if a cleaner split is available.</li>
          <li>Do not bundle unrelated services into one feature bundle; only bundle things that truly belong to the same shared graph.</li>
        </ul>
      `),
      panel('Real-world examples', `
        <div class="grid grid-2">
          <div class="card">
            <div class="key">E-commerce orders</div>
            <p><strong>Write side:</strong> place order. <strong>Read side:</strong> order history. <strong>Shared store:</strong> order repository. <strong>Feature bundle:</strong> order feature with both placement and history querying.</p>
          </div>
          <div class="card">
            <div class="key">Messaging app</div>
            <p><strong>Write side:</strong> send message. <strong>Read side:</strong> conversation history. <strong>Shared store:</strong> message repository. <strong>Feature bundle:</strong> messaging feature with both sending and history access.</p>
          </div>
        </div>
        <div class="card">
          <div class="key">Container analogy</div>
          <p>A container is like a theater backstage manager. Actors should perform on stage. They should not keep running backstage to find costumes, lights, and props on their own. The backstage manager decides what gets reused, what gets freshly prepared, and how the parts come together before the show starts.</p>
        </div>
      `)
    ]
  },
  {
    id: 'line-by-line',
    title: 'Line-by-line',
    navLabel: 'Line-by-line',
    sections: [
      panel('Line-by-line walkthrough of the new pipeline code', `
        <details open>
          <summary>1. Public bundle and query interface</summary>
          <pre>interface ReceiptQueryService {
    fun showReceipts(): List&lt;PaymentReceipt&gt;
}

interface BillingFeature {
    val checkoutService: CheckoutService
    val receiptQueryService: ReceiptQueryService
}</pre>
          <p>These declarations expand the public API. The first adds a read-side query surface. The second ensures the read side and write side can be delivered together from one shared graph.</p>
        </details>

        <details>
          <summary>2. Store contract expanded with read capability</summary>
          <pre>private interface ReceiptStore {
    fun save(receipt: PaymentReceipt)
    fun allReceipts(): List&lt;PaymentReceipt&gt;
}</pre>
          <p>The store used to only support saving. The new <code>allReceipts()</code> method is what makes the read-side service possible.</p>
        </details>

        <details>
          <summary>3. Store implementation now returns snapshots</summary>
          <pre>override fun allReceipts(): List&lt;PaymentReceipt&gt; {
    return storedReceipts.toList()
}</pre>
          <p>This is not a random convenience. Returning a copied/snapshot-style list avoids leaking the mutable internal storage structure to outside callers.</p>
        </details>

        <details>
          <summary>4. New read-side implementation</summary>
          <pre>private class DefaultReceiptQueryService(
    private val receiptStore: ReceiptStore,
    private val auditLogger: BillingLogger,
) : ReceiptQueryService {
    override fun showReceipts(): List&lt;PaymentReceipt&gt; {
        val receipts = receiptStore.allReceipts()
        auditLogger.log(...)
        return receipts
    }
}</pre>
          <p>This class demonstrates read-side composition: a query service uses the same hidden store and logger pattern as the write side, but does not touch gateway behavior.</p>
        </details>

        <details>
          <summary>5. New feature implementation</summary>
          <pre>private data class DefaultBillingFeature(
    override val checkoutService: CheckoutService,
    override val receiptQueryService: ReceiptQueryService,
) : BillingFeature</pre>
          <p>This tiny class packages the two public services together, preserving their shared context.</p>
        </details>

        <details>
          <summary>6. Manual composition root now builds the bundle</summary>
          <pre>val receiptStore: ReceiptStore = InMemoryReceiptStore()

val checkoutService: CheckoutService = DefaultCheckoutService(
    gateway = gateway,
    receiptStore = receiptStore,
    auditLogger = auditLogger,
)

val receiptQueryService: ReceiptQueryService = DefaultReceiptQueryService(
    receiptStore = receiptStore,
    auditLogger = auditLogger,
)

return DefaultBillingFeature(
    checkoutService = checkoutService,
    receiptQueryService = receiptQueryService,
)</pre>
          <p>This is the clearest place to see the shared-store guarantee: the same local variable is passed into both services.</p>
        </details>

        <details>
          <summary>7. Container config now registers the bundle and query side</summary>
          <pre>container.registerTransient(ReceiptQueryService::class) { ... }
container.registerTransient(BillingFeature::class) { ... }</pre>
          <p>The container now knows how to create not just the write-side service but also the read-side service and the bundle.</p>
        </details>

        <details>
          <summary>8. Factory now has feature entry points</summary>
          <pre>fun createFeature(environment: CheckoutEnvironment): BillingFeature = ...
fun createFeatureWithContainer(environment: CheckoutEnvironment): BillingFeature = ...</pre>
          <p>These public entry points make it easy for callers to ask for the richer shared pipeline when they need it.</p>
        </details>
      `)
    ]
  },
  {
    id: 'labs',
    title: 'Labs',
    navLabel: 'Labs',
    sections: [
      panel('Copyable experiments', `
        <div class="tabs" data-tab-group="labs">
          <button class="tab-btn active" data-tab="lab1">Shared store</button>
          <button class="tab-btn" data-tab="lab2">Different stores</button>
          <button class="tab-btn" data-tab="lab3">Singleton vs transient</button>
        </div>

        <div class="tab-content active" data-tab-panel="lab1">
          <pre>class FakeStore {
    private val values = mutableListOf<String>()
    fun save(value: String) { values += value }
    fun all(): List<String> = values.toList()
}

fun main() {
    val store = FakeStore()

    fun writer(v: String) = store.save(v)
    fun reader(): List<String> = store.all()

    writer("A")
    writer("B")
    println(reader()) // [A, B]
}</pre>
          <p>This shows the same basic idea as the billing feature: one shared store means one shared history.</p>
        </div>

        <div class="tab-content" data-tab-panel="lab2">
          <pre>fun main() {
    val storeA = mutableListOf<String>()
    val storeB = mutableListOf<String>()

    storeA += "A"
    println(storeB) // []
}</pre>
          <p>This is the failure case: separate stores mean separate histories.</p>
        </div>

        <div class="tab-content" data-tab-panel="lab3">
          <pre>// Pseudocode idea:
registerSingleton(Store::class) { InMemoryStore() }
registerTransient(Service::class) { Service(resolve(Store::class)) }

// many services, one store underneath</pre>
          <p>This is exactly how the container-backed billing design keeps fresh service wrappers while preserving one shared store.</p>
        </div>
      `)
    ]
  }
,
  {
    id: 'object-graphs',
    title: 'Object graphs',
    navLabel: 'Object graphs',
    sections: [
      panel('Clickable object graph: full billing feature', `
        <p>Tap any node in the diagram to see what that object is, why it exists, and how it should be used. This is the fastest way to understand how the graph fits together.</p>
        <div class="diagram" data-diagram-group="feature-graph">
          <div class="diagram-stage">
            <div class="kicker">Tap a node</div>
            <div class="diagram-grid cols-3">
              <button class="diagram-node active" data-diagram-target="feature"><strong>BillingFeature</strong><small>public bundle</small></button>
              <button class="diagram-node" data-diagram-target="checkout"><strong>CheckoutService</strong><small>write side</small></button>
              <button class="diagram-node" data-diagram-target="query"><strong>ReceiptQueryService</strong><small>read side</small></button>
              <button class="diagram-node" data-diagram-target="store"><strong>ReceiptStore</strong><small>shared hidden state</small></button>
              <button class="diagram-node" data-diagram-target="gateway"><strong>ApprovedPaymentGateway</strong><small>sensitive internal adapter</small></button>
              <button class="diagram-node" data-diagram-target="logger"><strong>BillingLogger</strong><small>shared logger</small></button>
              <button class="diagram-node" data-diagram-target="featureImpl"><strong>DefaultBillingFeature</strong><small>private impl</small></button>
              <button class="diagram-node" data-diagram-target="checkoutImpl"><strong>DefaultCheckoutService</strong><small>private impl</small></button>
              <button class="diagram-node" data-diagram-target="queryImpl"><strong>DefaultReceiptQueryService</strong><small>private impl</small></button>
            </div>
          </div>
          <div class="diagram-info">
            <div class="diagram-panel active" data-diagram-panel="feature">
              <h3>BillingFeature</h3>
              <p>This is the public bundle that safely packages both the write-side and read-side services from one shared graph. Its real purpose is to prevent the caller from accidentally mixing services from different graphs with different stores.</p>
              <p><strong>Use it when</strong> one screen, flow, or integration point needs both charging and receipt-history access from the same shared context.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="checkout">
              <h3>CheckoutService</h3>
              <p>This is the public write-side API. Callers should ask it to charge a request, not build gateways or stores themselves.</p>
              <pre>val receipt = feature.checkoutService.charge(request)</pre>
            </div>
            <div class="diagram-panel" data-diagram-panel="query">
              <h3>ReceiptQueryService</h3>
              <p>This is the public read-side API. It shows current receipt history using the same shared store underneath.</p>
              <pre>val history = feature.receiptQueryService.showReceipts()</pre>
            </div>
            <div class="diagram-panel" data-diagram-panel="store">
              <h3>ReceiptStore</h3>
              <p>This hidden store is the bridge between the write side and the read side. It is the most important node in the new pipeline because writes land here and reads come back out from here.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="gateway">
              <h3>ApprovedPaymentGateway</h3>
              <p>This is the sensitive internal payment adapter contract. It stays hidden so random outside code cannot casually implement it.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="logger">
              <h3>BillingLogger</h3>
              <p>This shared logger is reused by services and gateways so they can log consistently without caring which logger implementation is active.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="featureImpl">
              <h3>DefaultBillingFeature</h3>
              <p>This is the private implementation of the public feature bundle. It simply packages the two public services together while keeping the concrete class hidden.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="checkoutImpl">
              <h3>DefaultCheckoutService</h3>
              <p>This is the real write-side orchestrator. It does not create its own dependencies. It coordinates them.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="queryImpl">
              <h3>DefaultReceiptQueryService</h3>
              <p>This is the real read-side orchestrator. It asks the shared store for a snapshot and returns public receipt data.</p>
            </div>
          </div>
        </div>
      `),
      panel('Clickable object graph: manual root vs container root', `
        <div class="diagram" data-diagram-group="roots-graph">
          <div class="diagram-stage">
            <div class="kicker">Compare assembly styles</div>
            <div class="diagram-grid cols-2">
              <button class="diagram-node active" data-diagram-target="manual"><strong>BillingCompositionRoot</strong><small>manual wiring</small></button>
              <button class="diagram-node" data-diagram-target="container"><strong>BillingContainerCompositionRoot</strong><small>container-backed wiring</small></button>
              <button class="diagram-node" data-diagram-target="factory"><strong>CheckoutServiceFactory</strong><small>public entry point</small></button>
              <button class="diagram-node" data-diagram-target="lessonContainer"><strong>BillingLessonContainer</strong><small>registration + resolution</small></button>
            </div>
          </div>
          <div class="diagram-info">
            <div class="diagram-panel active" data-diagram-panel="manual">
              <h3>BillingCompositionRoot</h3>
              <p>This is the easiest place to learn DI because every object is assembled explicitly in order. You can literally watch the graph being built from top to bottom.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="container">
              <h3>BillingContainerCompositionRoot</h3>
              <p>This is the same idea expressed through container configuration and resolution. It becomes valuable when graphs and lifetime rules grow.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="factory">
              <h3>CheckoutServiceFactory</h3>
              <p>This is the public safe entry point. Callers should normally stop here and not reach directly into the roots or the container.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="lessonContainer">
              <h3>BillingLessonContainer</h3>
              <p>This tiny educational container stores the creation rules. It does not replace good boundaries. It supports them.</p>
            </div>
          </div>
        </div>
      `)
    ]
  },
  {
    id: 'annotated-code',
    title: 'Annotated code',
    navLabel: 'Annotated code',
    sections: [
      panel('Line-by-line annotated Kotlin walkthrough', `
        <p>This page focuses on exact Kotlin snippets and explains each block directly. Use it when you want the code and the explanation close together instead of separated by architecture sections.</p>
        <div class="tabs" data-tab-group="annotated">
          <button class="tab-btn active" data-tab="bundle">Feature bundle code</button>
          <button class="tab-btn" data-tab="manual">Manual root code</button>
          <button class="tab-btn" data-tab="container">Container config code</button>
          <button class="tab-btn" data-tab="main">main() demo code</button>
        </div>

        <div class="tab-content active" data-tab-panel="bundle">
          <div class="code-card">
            <div class="code-head">
              <div>
                <div class="kicker">Exact snippet</div>
                <strong>Public read side + feature bundle</strong>
              </div>
              <button class="copy-btn" data-copy-target="bundle-code">Copy snippet</button>
            </div>
            <pre id="bundle-code">interface ReceiptQueryService {
    fun showReceipts(): List&lt;PaymentReceipt&gt;
}

interface BillingFeature {
    val checkoutService: CheckoutService
    val receiptQueryService: ReceiptQueryService
}</pre>
          </div>
          <div class="annotation-list">
            <div class="annotation-item">
              <h4><code>interface ReceiptQueryService</code></h4>
              <p>This introduces a separate public read-side API. That is a design choice: querying receipts is not the same responsibility as charging a card.</p>
              <p><strong>Use this pattern</strong> when read operations and write operations are conceptually different, even if they share the same underlying store.</p>
            </div>
            <div class="annotation-item">
              <h4><code>fun showReceipts(): List&lt;PaymentReceipt&gt;</code></h4>
              <p>The return type is public data, not the hidden store itself. That keeps storage details encapsulated.</p>
            </div>
            <div class="annotation-item">
              <h4><code>interface BillingFeature</code></h4>
              <p>This packages both capabilities from one graph. The hidden design goal is shared context, not just convenience.</p>
            </div>
            <div class="annotation-item">
              <h4><code>val checkoutService</code> and <code>val receiptQueryService</code></h4>
              <p>These are exposed as properties because the feature bundle is giving callers two long-lived entry points into the same feature graph.</p>
            </div>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="manual">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Exact snippet</div><strong>Manual composition root</strong></div>
              <button class="copy-btn" data-copy-target="manual-code">Copy snippet</button>
            </div>
            <pre id="manual-code">fun createFeature(environment: CheckoutEnvironment): BillingFeature {
    val auditLogger: BillingLogger = ConsoleBillingLogger()
    val receiptStore: ReceiptStore = InMemoryReceiptStore()
    val gateway: ApprovedPaymentGateway = when (environment) { ... }

    val checkoutService: CheckoutService = DefaultCheckoutService(
        gateway = gateway,
        receiptStore = receiptStore,
        auditLogger = auditLogger,
    )

    val receiptQueryService: ReceiptQueryService = DefaultReceiptQueryService(
        receiptStore = receiptStore,
        auditLogger = auditLogger,
    )

    return DefaultBillingFeature(
        checkoutService = checkoutService,
        receiptQueryService = receiptQueryService,
    )
}</pre>
          </div>
          <div class="annotation-list">
            <div class="annotation-item"><h4><code>val auditLogger</code></h4><p>One shared logger is created for the whole feature graph. This is a good example of a reusable infrastructure dependency.</p></div>
            <div class="annotation-item"><h4><code>val receiptStore</code></h4><p>This line is the hidden backbone of the new pipeline. One store object is created here and then passed into both the write side and the read side.</p></div>
            <div class="annotation-item"><h4><code>val gateway = when (environment)</code></h4><p>Implementation policy stays at the composition root. The caller expresses environment intent, but the root chooses the actual hidden gateway implementation.</p></div>
            <div class="annotation-item"><h4><code>DefaultCheckoutService(... receiptStore = receiptStore ...)</code></h4><p>The write side receives the shared store.</p></div>
            <div class="annotation-item"><h4><code>DefaultReceiptQueryService(... receiptStore = receiptStore ...)</code></h4><p>The read side receives the same shared store object. This is the shared-history guarantee.</p></div>
            <div class="annotation-item"><h4><code>return DefaultBillingFeature(...)</code></h4><p>The two services are bundled together and returned as one public feature.</p></div>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="container">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Exact snippet</div><strong>Container configuration</strong></div>
              <button class="copy-btn" data-copy-target="container-code">Copy snippet</button>
            </div>
            <pre id="container-code">container.registerSingleton(BillingLogger::class) { ConsoleBillingLogger() }
container.registerSingleton(ReceiptStore::class) { InMemoryReceiptStore() }
container.registerSingleton(ApprovedPaymentGateway::class) { ... }

container.registerTransient(CheckoutService::class) { ... }
container.registerTransient(ReceiptQueryService::class) { ... }
container.registerTransient(BillingFeature::class) { ... }</pre>
          </div>
          <div class="annotation-list">
            <div class="annotation-item"><h4><code>registerSingleton(BillingLogger::class)</code></h4><p>The logger is shared. This is usually reasonable because it has no feature-local mutable business state.</p></div>
            <div class="annotation-item"><h4><code>registerSingleton(ReceiptStore::class)</code></h4><p>This is the most important lifetime choice in the pipeline. Make this transient and your read/write services may stop sharing history.</p></div>
            <div class="annotation-item"><h4><code>registerTransient(CheckoutService::class)</code></h4><p>This means you can get fresh service wrappers each time while still reusing the shared singleton infrastructure underneath.</p></div>
            <div class="annotation-item"><h4><code>registerTransient(ReceiptQueryService::class)</code></h4><p>Same idea: fresh wrapper, shared store.</p></div>
            <div class="annotation-item"><h4><code>registerTransient(BillingFeature::class)</code></h4><p>This lets the container resolve the whole shared public feature in one go.</p></div>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="main">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Exact snippet</div><strong>main() feature demo</strong></div>
              <button class="copy-btn" data-copy-target="main-code">Copy snippet</button>
            </div>
            <pre id="main-code">val productionFeature: BillingFeature = CheckoutServiceFactory.createProductionFeature()

println("Manual feature receipts before charging: \${productionFeature.receiptQueryService.showReceipts()}")

productionFeature.checkoutService.charge(...)
productionFeature.checkoutService.charge(...)

val manualStoredReceipts = productionFeature.receiptQueryService.showReceipts()</pre>
          </div>
          <div class="annotation-list">
            <div class="annotation-item"><h4><code>createProductionFeature()</code></h4><p>This is the new high-level entry point when you want the full shared pipeline instead of only checkout.</p></div>
            <div class="annotation-item"><h4><code>showReceipts()</code> before charging</h4><p>This demonstrates the initial state of the shared store before any writes.</p></div>
            <div class="annotation-item"><h4><code>checkoutService.charge(...)</code> twice</h4><p>These calls write receipts into the shared store.</p></div>
            <div class="annotation-item"><h4><code>showReceipts()</code> after charging</h4><p>This proves the read side is observing the same store that the write side updated.</p></div>
          </div>
        </div>
      `)
    ]
  },
  ...platformStarterViews,
  ...advancedViews,
  {
    id: 'project-files',
    title: 'Project files to edit',
    navLabel: 'Project files',
    sections: [
      panel('Which files matter most in this webapp', `
        <div class="table-wrap">
          <table class="file-list">
            <thead>
              <tr><th>File</th><th>What it does</th><th>When you edit it</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>index.html</code></td>
                <td>Main HTML shell that loads the app.</td>
                <td>Edit only if you need document-level metadata or top-level mounting changes.</td>
              </tr>
              <tr>
                <td><code>src/main.js</code></td>
                <td>Entry point that imports styles and renders the app.</td>
                <td>Edit rarely; mainly when changing startup behavior.</td>
              </tr>
              <tr>
                <td><code>src/app.js</code></td>
                <td>App shell rendering, sidebar, tabs, drawer behavior, clickable diagrams, copy buttons.</td>
                <td>Edit this when you want to add new interactive behaviors.</td>
              </tr>
              <tr>
                <td><code>src/content.js</code></td>
                <td>All lesson pages, diagrams, snippets, explanations, and page structure.</td>
                <td>This is the main file you will edit most for lesson content.</td>
              </tr>
              <tr>
                <td><code>src/foundationsContent.js</code></td>
                <td>Beginner-friendly DI lessons based on the smaller welcome-message sample, including no DI, constructor DI, test doubles, and container basics.</td>
                <td>Edit this when you want to grow the course foundation before the richer billing lessons.</td>
              </tr>
              <tr>
                <td><code>src/patternsContent.js</code></td>
                <td>Factory, policy, redaction, allowlist, and pattern-selection lessons that bridge the simpler samples to the richer real-app design track.</td>
                <td>Edit this when you want to expand the course with creation-pattern comparisons and policy-heavy examples.</td>
              </tr>
              <tr>
                <td><code>src/comparisonsContent.js</code></td>
                <td>Interactive architecture comparison lessons covering no DI, constructor DI, factories, containers, scopes, and service locator trade-offs.</td>
                <td>Edit this when you want side-by-side pattern comparisons and decision-focused lessons.</td>
              </tr>
              <tr>
                <td><code>src/importantConceptsContent.js</code></td>
                <td>High-value granular lessons for qualifiers, lifetime bugs, async/config dependencies, and other important concepts that are easy to overlook.</td>
                <td>Edit this when you want to add subtle but practical architecture lessons that strengthen real-world understanding.</td>
              </tr>
              <tr>
                <td><code>src/masteryContent.js</code></td>
                <td>Self-check labs, confusion hot-spots, end-to-end feature maps, and architecture review checklists for active mastery.</td>
                <td>Edit this when you want review-heavy material that helps you test your understanding instead of only reading passively.</td>
              </tr>
              <tr>
                <td><code>src/platformStartersContent.js</code></td>
                <td>Platform-specific starter snippets and pipelines for Kotlin Spring Boot and Android Studio architecture.</td>
                <td>Edit this when you want more copyable starter code and practical platform mappings.</td>
              </tr>
              <tr>
                <td><code>src/advancedContent.js</code></td>
                <td>Deeper learning tracks for decision guides, anti-patterns, Spring Boot mapping, Android mapping, and production-readiness content.</td>
                <td>Edit this when you want to expand the advanced curriculum without making <code>content.js</code> harder to scan.</td>
              </tr>
              <tr>
                <td><code>src/contentBuilders.js</code></td>
                <td>Shared content-building helpers like <code>hero()</code> and <code>panel()</code> used across modular lesson files.</td>
                <td>Edit this when you want to evolve the lesson data structure in one shared place.</td>
              </tr>
              <tr>
                <td><code>src/styles.css</code></td>
                <td>All visual styling for layout, cards, diagrams, tabs, and mobile behavior.</td>
                <td>Edit this when changing the look, spacing, colors, or responsive behavior.</td>
              </tr>
              <tr>
                <td><code>src/styles/</code></td>
                <td>Separated immersive and learning-component style modules layered on top of the base stylesheet.</td>
                <td>Edit these files when you want to improve the study experience without crowding the base CSS file.</td>
              </tr>
              <tr>
                <td><code>vite.config.js</code></td>
                <td>Local dev server configuration.</td>
                <td>Edit only when changing host/port or build-level config.</td>
              </tr>
              <tr>
                <td><code>package.json</code></td>
                <td>Scripts and dev dependencies.</td>
                <td>Edit when adding packages or changing scripts.</td>
              </tr>
              <tr>
                <td><code>README.md</code></td>
                <td>Run instructions and project explanation.</td>
                <td>Edit to keep project guidance current for yourself or others.</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Best editing workflow in IntelliJ', `
        <ol>
          <li>Open the project root in IntelliJ.</li>
          <li>Run <code>npm install</code> once.</li>
          <li>Run <code>npm run dev</code>.</li>
          <li>Keep <code>src/content.js</code>, <code>src/foundationsContent.js</code>, <code>src/advancedContent.js</code>, and <code>src/styles.css</code> side by side. Most content and layout work will happen there.</li>
          <li>Edit <code>src/app.js</code> only when you need new UI behavior like tabs, diagrams, copy buttons, or new page switching patterns.</li>
        </ol>
        <div class="good"><div class="callout-title">Recommended editing order</div><div><strong>1.</strong> foundationsContent.js → <strong>2.</strong> patternsContent.js → <strong>3.</strong> comparisonsContent.js → <strong>4.</strong> importantConceptsContent.js → <strong>5.</strong> masteryContent.js → <strong>6.</strong> platformStartersContent.js → <strong>7.</strong> content.js → <strong>8.</strong> advancedContent.js → <strong>9.</strong> styles.css / styles folder → <strong>10.</strong> app.js → <strong>11.</strong> README if you changed usage instructions.</div></div>
      `)
    ]
  }

];

