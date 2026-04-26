import { hero, panel, teachingTask } from './contentBuilders';

export const platformStarterViews = [
  {
    id: 'spring-boot-starter-kit',
    title: 'Spring Boot starter kit',
    navLabel: 'Spring Boot starter kit',
    group: 'Platform starters',
    level: 'Applied',
    time: '16 min',
    sampleSource: 'samplecode.txt + advanced curriculum',
    summary: 'Copyable starter snippets for structuring a Kotlin Spring Boot feature with controllers, use cases, hidden adapters, configuration, and tests.',
    sections: [
      hero(
        'A practical Spring Boot starter built from the course architecture ideas',
        ['Controllers', 'Use cases', 'Configuration', 'Tests'],
        `
          <p>This starter kit is meant to be <strong>copy-adaptable</strong>, not framework magic. The idea is to keep the architecture visible: boundary → use case → hidden adapters → result model.</p>
          <div class="good">
            <div class="callout-title">Recommended baseline</div>
            <div>Keep your business/use-case layer plain Kotlin. Let Spring provide assembly and transport entry points at the edges.</div>
          </div>
        `
      ),
      panel('Suggested package layout', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Package layout</div><strong>Feature-oriented Spring module</strong></div>
            <button class="copy-btn" data-copy-target="spring-layout-code">Copy snippet</button>
          </div>
          <pre id="spring-layout-code">billing/
  api/
    BillingController.kt
    BillingRequests.kt
    BillingResponses.kt
  application/
    CheckoutService.kt
    ReceiptQueryService.kt
    BillingFeature.kt
    ChargeRequest.kt
    PaymentReceipt.kt
  infrastructure/
    gateway/
      StripePaymentGateway.kt
      SandboxPaymentGateway.kt
    persistence/
      ReceiptRepository.kt
      JpaReceiptRepository.kt
    logging/
      BillingLogger.kt
      StructuredBillingLogger.kt
  config/
    BillingConfiguration.kt</pre>
        </div>
      `),
      panel('Spring data model path: HTTP DTO vs domain model vs persistence entity', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Shape</th><th>Example type</th><th>Lives where</th><th>Main job</th><th>Do not confuse it with</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>HTTP request/response DTO</td>
                <td><code>ChargeHttpRequest</code>, <code>ChargeHttpResponse</code></td>
                <td>API/transport layer</td>
                <td>Match the web boundary and JSON contract</td>
                <td>Application/domain models or JPA entities</td>
              </tr>
              <tr>
                <td>Domain/application model</td>
                <td><code>ChargeRequest</code>, <code>PaymentReceipt</code></td>
                <td>Application layer</td>
                <td>Express business meaning in framework-light language</td>
                <td>Controller DTOs or persistence rows</td>
              </tr>
              <tr>
                <td>Persistence entity</td>
                <td><code>ReceiptEntity</code></td>
                <td>Infrastructure/persistence layer</td>
                <td>Represent table/ORM shape for storage</td>
                <td>Stable public API or business model</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>For symmetry with the Android lessons, use the same mental model here too: web DTOs belong to the HTTP edge, domain models belong to the use-case layer, and persistence entities belong to the database edge.</p>
      `),
      panel('Spring naming convention for mapping-heavy features', `
        <ul>
          <li><strong>Transport:</strong> <code>*HttpRequest</code>, <code>*HttpResponse</code></li>
          <li><strong>Domain:</strong> plain business names like <code>ChargeRequest</code> and <code>PaymentReceipt</code></li>
          <li><strong>Persistence:</strong> <code>*Entity</code> such as <code>ReceiptEntity</code></li>
          <li><strong>Mapping helpers:</strong> <code>toDomain()</code>, <code>toEntity()</code>, <code>from(...)</code></li>
        </ul>
        <p>This naming rule gives Spring Boot the same clarity we now use in Android. You can see transport, domain, and persistence boundaries directly from the names.</p>
      `),
      panel('Spring mapper files: a realistic way to organize them', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Project organization</div><strong>Mapping files that scale cleanly</strong></div>
            <button class="copy-btn" data-copy-target="spring-mapper-files-code">Copy snippet</button>
          </div>
          <pre id="spring-mapper-files-code">billing/
  api/
    BillingRequests.kt          // ChargeHttpRequest, RefundHttpRequest
    BillingResponses.kt         // ChargeHttpResponse, RefundHttpResponse
    BillingDtoMappers.kt        // ChargeHttpRequest.toDomain(), ChargeHttpResponse.from(...)
  application/
    ChargeRequest.kt
    PaymentReceipt.kt
  infrastructure/persistence/
    ReceiptEntity.kt
    ReceiptEntityMappers.kt     // PaymentReceipt.toEntity(), ReceiptEntity.toDomain()
    JpaReceiptRepository.kt</pre>
        </div>
        <p>This file split is useful because it keeps each mapping concern near its boundary. HTTP DTO mappers stay near the controller layer, persistence mappers stay near the persistence layer, and domain models stay framework-light in the middle.</p>
      `),
      panel('Spring mapping anti-patterns to avoid', `
        <div class="compare-grid">
          <div class="compare-card dont">
            <h3>Anti-pattern: controller returns JPA entity directly</h3>
            <p>Your web API is now tied to persistence shape. A database-driven field change can accidentally become a public API change.</p>
          </div>
          <div class="compare-card dont">
            <h3>Anti-pattern: service methods know JSON or HTTP field names</h3>
            <p>The application layer now depends on transport concerns, which makes it harder to reuse the same use case from jobs, tests, or other boundaries.</p>
          </div>
          <div class="compare-card dont">
            <h3>Anti-pattern: mapping logic duplicated in every controller method</h3>
            <p>Field-copy code drifts over time, and one endpoint eventually forgets validation or defaulting rules that another endpoint still applies.</p>
          </div>
          <div class="compare-card do">
            <h3>Healthier pattern</h3>
            <p>HTTP DTOs map to domain models at the web edge, domain models map to entities at the persistence edge, and the application layer stays in business language between those boundaries.</p>
          </div>
        </div>
      `),
      panel('Interactive Spring starter snippets', `
        <div class="tabs" data-tab-group="spring-starters">
          <button class="tab-btn active" data-tab="controller">Controller</button>
          <button class="tab-btn" data-tab="usecase">Use case + models</button>
          <button class="tab-btn" data-tab="config">Configuration</button>
          <button class="tab-btn" data-tab="adapter">Adapter boundary</button>
          <button class="tab-btn" data-tab="tests">Testing</button>
        </div>

        <div class="tab-content active" data-tab-panel="controller">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">HTTP boundary</div><strong><code>@RestController</code> starter</strong></div>
              <button class="copy-btn" data-copy-target="spring-controller-code">Copy snippet</button>
            </div>
            <pre id="spring-controller-code">data class ChargeHttpRequest(
    val customerId: String,
    val paymentToken: String,
    val amountInCents: Int,
)

data class ChargeHttpResponse(
    val receiptId: String,
    val customerId: String,
    val amountInCents: Int,
    val gatewayName: String,
)

fun ChargeHttpRequest.toDomain(): ChargeRequest = ChargeRequest(
    customerId = customerId,
    paymentToken = paymentToken,
    amountInCents = amountInCents,
)

fun ChargeHttpResponse.Companion.from(receipt: PaymentReceipt): ChargeHttpResponse = ChargeHttpResponse(
    receiptId = receipt.receiptId,
    customerId = receipt.customerId,
    amountInCents = receipt.amountInCents,
    gatewayName = receipt.gatewayName,
)

@RestController
@RequestMapping("/billing")
class BillingController(
    private val billingFeature: BillingFeature,
) {
    @PostMapping("/charge")
    fun charge(@RequestBody body: ChargeHttpRequest): ChargeHttpResponse {
        val receipt = billingFeature.checkoutService.charge(body.toDomain())
        return ChargeHttpResponse.from(receipt)
    }
}</pre>
          </div>
          <p>The controller is the boundary. It maps HTTP input into the public use-case model and maps the result back into a transport response.</p>
        </div>

        <div class="tab-content" data-tab-panel="usecase">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Application layer</div><strong>Use case contracts + models</strong></div>
              <button class="copy-btn" data-copy-target="spring-usecase-code">Copy snippet</button>
            </div>
            <pre id="spring-usecase-code">data class ChargeRequest(
    val customerId: String,
    val paymentToken: String,
    val amountInCents: Int,
)

data class PaymentReceipt(
    val receiptId: String,
    val customerId: String,
    val amountInCents: Int,
    val gatewayName: String,
)

interface CheckoutService {
    fun charge(request: ChargeRequest): PaymentReceipt
}

interface ReceiptQueryService {
    fun showReceipts(): List&lt;PaymentReceipt&gt;
}

interface BillingFeature {
    val checkoutService: CheckoutService
    val receiptQueryService: ReceiptQueryService
}</pre>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="config">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Composition root</div><strong>Feature wiring in configuration</strong></div>
              <button class="copy-btn" data-copy-target="spring-config-starter-code">Copy snippet</button>
            </div>
            <pre id="spring-config-starter-code">@Configuration
class BillingConfiguration {
    @Bean
    fun billingFeature(
        paymentGateway: ApprovedPaymentGateway,
        receiptRepository: ReceiptRepository,
        billingLogger: BillingLogger,
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
          <p>This is the Spring-hosted composition root. The business graph is still visible.</p>
        </div>

        <div class="tab-content" data-tab-panel="adapter">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Infrastructure boundary</div><strong>Repository / adapter starter</strong></div>
              <button class="copy-btn" data-copy-target="spring-adapter-code">Copy snippet</button>
            </div>
            <pre id="spring-adapter-code">@Entity(tableName = "receipts")
class ReceiptEntity(
    @Id val receiptId: String,
    val customerId: String,
    val amountInCents: Int,
    val gatewayName: String,
)

fun PaymentReceipt.toEntity(): ReceiptEntity = ReceiptEntity(
    receiptId = receiptId,
    customerId = customerId,
    amountInCents = amountInCents,
    gatewayName = gatewayName,
)

fun ReceiptEntity.toDomain(): PaymentReceipt = PaymentReceipt(
    receiptId = receiptId,
    customerId = customerId,
    amountInCents = amountInCents,
    gatewayName = gatewayName,
)

interface ReceiptRepository {
    fun save(receipt: PaymentReceipt)
    fun findAll(): List&lt;PaymentReceipt&gt;
}

@Component
class JpaReceiptRepository(
    private val springDataRepository: SpringReceiptJpaRepository,
) : ReceiptRepository {
    override fun save(receipt: PaymentReceipt) {
        springDataRepository.save(receipt.toEntity())
    }

    override fun findAll(): List&lt;PaymentReceipt&gt; {
        return springDataRepository.findAll().map { it.toDomain() }
    }
}</pre>
          </div>
          <p>Expose a business-shaped abstraction and hide the JPA-specific details inside the adapter implementation.</p>
        </div>

        <div class="tab-content" data-tab-panel="tests">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Focused testing</div><strong>Use-case unit test starter</strong></div>
              <button class="copy-btn" data-copy-target="spring-test-code">Copy snippet</button>
            </div>
            <pre id="spring-test-code">class DefaultCheckoutServiceTest {
    @Test
    fun \`charge saves receipt and returns public model\`() {
        val gateway = FakePaymentGateway()
        val store = InMemoryReceiptStore()
        val logger = RecordingBillingLogger()
        val service = DefaultCheckoutService(gateway, store, logger)

        val receipt = service.charge(
            ChargeRequest("cust-1", "tok-demo", 2500)
        )

        assertEquals("cust-1", receipt.customerId)
        assertEquals(1, store.allReceipts().size)
    }
}</pre>
          </div>
        </div>
      `),
      panel('Spring Boot pipeline to follow', `
        <p>Use this as a concrete request story, not just as a checklist. Imagine one HTTP request entering your backend and follow where each responsibility moves next.</p>
        <div class="timeline">
          <div class="step"><strong>1.</strong> Controller receives DTO, auth context, and request metadata. This is the transport boundary: raw web data enters here first.</div>
          <div class="step"><strong>2.</strong> The controller maps that transport data to public request models. This is the translation from HTTP language into business language.</div>
          <div class="step"><strong>3.</strong> The controller calls the feature or use case. At this point the controller stops making business decisions and simply asks for a business capability.</div>
          <div class="step"><strong>4.</strong> The use case coordinates hidden gateway/repository/logger/event publisher dependencies. This is where the real business workflow lives.</div>
          <div class="step"><strong>5.</strong> The repository adapter maps the domain model into a persistence entity when saving, and maps entities back into domain models when loading.</div>
          <div class="step"><strong>6.</strong> Configuration or module wiring chooses implementations and lifetimes. This is the backstage wiring room, not part of the request-specific business flow itself.</div>
          <div class="step"><strong>7.</strong> Tests instantiate the use case manually or load a focused slice, proving that the workflow is understandable and replaceable without booting the whole world.</div>
        </div>
        <div class="note">
          <div class="callout-title">Concrete analogy</div>
          <div>The controller is the receptionist, the use case is the office coordinator, the repository/gateway are specialist departments, and the configuration class is the manager who decided which departments exist and how they are staffed before the day started.</div>
        </div>
      `),
      panel('Practice task: extend the Spring starter with a refund flow', teachingTask({
        task: 'Add a refund capability to the Spring Boot starter without letting the controller talk directly to the payment gateway. The stricter goal is to preserve the same architecture shape: HTTP boundary → public use case → hidden adapters → configuration wiring.',
        thinkFirst: [
          'What should the controller receive and return?',
          'Which new business capability should become public?',
          'Which infrastructure details must stay behind the refund use case?',
          'Should refund wiring reuse the existing feature graph or create a controller shortcut?'
        ],
        codeId: 'platform-spring-refund-solution',
        codeTitle: 'Refund flow added as a new application capability, not a controller shortcut',
        code: `data class RefundRequest(
    val receiptId: String,
    val reason: String,
)

data class RefundReceipt(
    val refundId: String,
    val receiptId: String,
    val status: String,
)

interface RefundService {
    fun refund(request: RefundRequest): RefundReceipt
}

interface BillingFeature {
    val checkoutService: CheckoutService
    val receiptQueryService: ReceiptQueryService
    val refundService: RefundService
}

@RestController
@RequestMapping("/billing")
class BillingController(
    private val billingFeature: BillingFeature,
) {
    @PostMapping("/refunds")
    fun refund(@RequestBody body: RefundHttpRequest): RefundHttpResponse {
        // Controller only maps HTTP input into the public request model.
        val receipt = billingFeature.refundService.refund(
            RefundRequest(
                receiptId = body.receiptId,
                reason = body.reason,
            )
        )

        return RefundHttpResponse.from(receipt)
    }
}

class DefaultRefundService(
    private val gateway: PaymentGateway,
    private val receiptRepository: ReceiptRepository,
    private val logger: BillingLogger,
) : RefundService {
    override fun refund(request: RefundRequest): RefundReceipt {
        val existingReceipt = receiptRepository.findByReceiptId(request.receiptId)
        val gatewayResult = gateway.refund(existingReceipt, request.reason)
        logger.log("refund_completed receipt=" + request.receiptId)

        return RefundReceipt(
            refundId = gatewayResult.refundId,
            receiptId = request.receiptId,
            status = gatewayResult.status,
        )
    }
}

@Configuration
class BillingConfiguration {
    @Bean
    fun billingFeature(
        paymentGateway: PaymentGateway,
        receiptRepository: ReceiptRepository,
        billingLogger: BillingLogger,
    ): BillingFeature {
        val checkoutService = DefaultCheckoutService(paymentGateway, receiptRepository, billingLogger)
        val receiptQueryService = DefaultReceiptQueryService(receiptRepository, billingLogger)
        val refundService = DefaultRefundService(paymentGateway, receiptRepository, billingLogger)

        return DefaultBillingFeature(checkoutService, receiptQueryService, refundService)
    }
}`,
        explanation: [
          {
            title: 'The controller stays thin',
            body: 'It receives HTTP data, maps to <code>RefundRequest</code>, calls the public feature, and maps the result back out. It does not talk to the gateway or repository directly.'
          },
          {
            title: '<code>RefundService</code> becomes a first-class business capability',
            body: 'Refund logic belongs beside checkout and receipt query in the application layer, which keeps the feature boundary coherent.'
          },
          {
            title: 'Configuration extends the same feature graph',
            body: 'Wiring refund inside the existing feature graph means the new capability deliberately reuses the same repository, gateway, and logger dependencies rather than inventing a second hidden path.'
          }
        ],
        pipeline: [
          'HTTP boundary receives refund input.',
          'Controller maps transport DTO to <code>RefundRequest</code>.',
          'Refund use case looks up the receipt, calls the gateway, logs the event, and returns a public result.',
          'Configuration assembles refund with the rest of the billing feature graph.'
        ],
        spring: [
          'This is the canonical Spring mapping: controller as boundary, use case as business API, gateway/repository/logger as hidden adapters, configuration as composition root.',
          'Add tests at the use-case layer first, then controller slice tests if needed.',
          'Keep gateway/provider DTOs hidden behind the refund service interface.'
        ],
        android: [
          'The Android analogue is a <code>CancelPaymentUseCase</code> or <code>RefundUseCase</code> called from a ViewModel, not Retrofit from the screen.',
          'A repository would coordinate local/remote changes and mapping behind the use case.',
          'Workers or background reconciliation can reuse the same repository/use-case path if refunds must sync later.'
        ],
        mistakes: [
          'Injecting the gateway into the controller because refund feels “small”.',
          'Creating a second refund-only repository path that bypasses the feature boundary.',
          'Returning provider-specific gateway data directly to the web layer.'
        ],
        better: 'This solution is better because it keeps the architecture symmetrical. Adding refund does not break the existing mental model; it strengthens it by showing how new business capabilities fit into the same boundary/use-case/adapter structure.'
      }))
    ]
  },
  {
    id: 'android-starter-kit',
    title: 'Android starter kit',
    navLabel: 'Android starter kit',
    group: 'Platform starters',
    level: 'Applied',
    time: '16 min',
    sampleSource: 'sample8.txt + samplecode.txt + advanced curriculum',
    summary: 'Copyable starter snippets for structuring Android features with Hilt, ViewModels, use cases, repositories, Room/Retrofit boundaries, and WorkManager reuse.',
    sections: [
      hero(
        'An Android starter that keeps UI, use cases, repositories, and data sources in the right places',
        ['ViewModel', 'Hilt', 'Repository', 'WorkManager'],
        `
          <p>This starter kit translates the course ideas into an Android-friendly shape: <strong>UI intent → ViewModel → use case → repository → local/remote data sources</strong>.</p>
          <div class="good">
            <div class="callout-title">Recommended baseline</div>
            <div>Keep Retrofit, Room, and background workers behind repository and use-case boundaries so your ViewModel stays focused on UI state and user actions.</div>
          </div>
        `
      ),
      panel('Suggested Android package layout', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Package layout</div><strong>Feature-oriented Android module</strong></div>
            <button class="copy-btn" data-copy-target="android-layout-code">Copy snippet</button>
          </div>
          <pre id="android-layout-code">checkout/
  ui/
    CheckoutViewModel.kt
    CheckoutUiState.kt
    CheckoutScreen.kt
  domain/
    ChargeCheckoutUseCase.kt
    LoadReceiptsUseCase.kt
    ChargeRequest.kt
    PaymentReceipt.kt
  data/
    CheckoutRepository.kt
    DefaultCheckoutRepository.kt
    local/
      ReceiptDao.kt
    remote/
      CheckoutApi.kt
  di/
    CheckoutModule.kt
  worker/
    ReceiptSyncWorker.kt</pre>
        </div>
      `),
      panel('Android data model path: domain model vs entity vs network DTO', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Shape</th><th>Example type</th><th>Lives where</th><th>Job</th><th>Do not confuse it with</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Domain/app model</td>
                <td><code>PaymentReceipt</code></td>
                <td>Domain/application layer</td>
                <td>The stable app-facing receipt shape the rest of the feature wants to use</td>
                <td>Database table rows or raw Retrofit response DTOs</td>
              </tr>
              <tr>
                <td>Room entity</td>
                <td><code>ReceiptEntity</code></td>
                <td>Local data layer</td>
                <td>The table-shaped persistence model optimized for Room queries and storage</td>
                <td>UI state or business-facing models</td>
              </tr>
              <tr>
                <td>Retrofit DTO</td>
                <td><code>ReceiptResponseDto</code></td>
                <td>Remote data layer</td>
                <td>The raw network payload shape coming from or going to the server</td>
                <td>Room entities or stable domain models</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>One of the biggest Android architecture confusions is treating these three shapes as if they were the same thing. They are related, but they serve different boundaries: network transport, database persistence, and app-facing business meaning.</p>
        <div class="note">
          <div class="callout-title">Concrete naming convention that keeps teams sane</div>
          <div>Use names that reveal the boundary on sight: <code>ChargeRequestDto</code> / <code>ReceiptResponseDto</code> for Retrofit transport, <code>ReceiptEntity</code> for Room persistence, and <code>PaymentReceipt</code> for the stable domain/app-facing model. When a file name or type name already tells you the boundary, architecture mistakes become easier to spot during code review.</div>
        </div>
        <div class="good">
          <div class="callout-title">Mapper-function rule of thumb</div>
          <div>Try to make conversion points visible with functions like <code>toRequestDto()</code>, <code>toEntity()</code>, and <code>toDomain()</code> rather than scattering field-copy code inside ViewModels, DAOs, or random call sites.</div>
        </div>
      `),
      panel('Recommended Android naming rules for mapping-heavy features', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Layer</th><th>Recommended suffix/pattern</th><th>Example</th><th>Why this helps</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Retrofit request/response</td>
                <td><code>*Dto</code>, <code>*RequestDto</code>, <code>*ResponseDto</code></td>
                <td><code>ChargeRequestDto</code>, <code>ReceiptResponseDto</code></td>
                <td>Signals transport-only shape and prevents remote payloads from pretending to be domain truth</td>
              </tr>
              <tr>
                <td>Room persistence</td>
                <td><code>*Entity</code></td>
                <td><code>ReceiptEntity</code></td>
                <td>Signals table/storage shape and discourages leaking DB details upward</td>
              </tr>
              <tr>
                <td>Domain/application model</td>
                <td>Plain business name</td>
                <td><code>PaymentReceipt</code></td>
                <td>Keeps use cases and UI speaking business language instead of storage or transport language</td>
              </tr>
              <tr>
                <td>Mapper helpers</td>
                <td><code>toDomain()</code>, <code>toEntity()</code>, <code>toDto()</code></td>
                <td><code>ReceiptEntity.toDomain()</code></td>
                <td>Makes conversion points explicit rather than invisible ad hoc field-copying</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Android mapper files: a realistic feature-module layout', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Project organization</div><strong>Mapping files that keep Room and Retrofit separate</strong></div>
            <button class="copy-btn" data-copy-target="android-mapper-files-code">Copy snippet</button>
          </div>
          <pre id="android-mapper-files-code">checkout/
  domain/
    ChargeRequest.kt
    PaymentReceipt.kt
  data/remote/
    CheckoutApi.kt
    CheckoutDtos.kt             // ChargeRequestDto, ReceiptResponseDto
    CheckoutDtoMappers.kt       // ChargeRequest.toRequestDto(), ReceiptResponseDto.toDomain(...)
  data/local/
    ReceiptDao.kt
    ReceiptEntity.kt
    ReceiptEntityMappers.kt     // PaymentReceipt.toEntity(), ReceiptEntity.toDomain()
  data/
    DefaultCheckoutRepository.kt</pre>
        </div>
        <p>This layout helps teams answer a practical question fast: “Is this file about transport, persistence, or business meaning?” If the folder and filename reveal the boundary immediately, mapper mistakes are easier to catch before they spread.</p>
      `),
      panel('Android mapper anti-patterns to avoid', `
        <div class="compare-grid">
          <div class="compare-card dont">
            <h3>Anti-pattern: one giant <code>Mappers.kt</code> for the whole app</h3>
            <p>All conversions get mixed together, boundary ownership becomes fuzzy, and future developers stop knowing which mappings are transport-related vs persistence-related.</p>
          </div>
          <div class="compare-card dont">
            <h3>Anti-pattern: Composable or ViewModel creates DTOs and entities directly</h3>
            <p>Presentation code starts owning transport and persistence shapes, which weakens the repository boundary and increases coupling.</p>
          </div>
          <div class="compare-card dont">
            <h3>Anti-pattern: entity becomes the universal model</h3>
            <p>Room-specific columns, SQL-oriented defaults, or local-only flags leak into domain and UI code that should not care about them.</p>
          </div>
          <div class="compare-card do">
            <h3>Healthier pattern</h3>
            <p>Keep DTO mappers near Retrofit, entity mappers near Room, and repository code as the coordinator that decides when each mapper is used.</p>
          </div>
        </div>
      `),
      panel('Interactive Android starter snippets', `
        <div class="tabs" data-tab-group="android-starters">
          <button class="tab-btn active" data-tab="viewmodel">ViewModel</button>
          <button class="tab-btn" data-tab="state">UI state</button>
          <button class="tab-btn" data-tab="repo">Repository</button>
          <button class="tab-btn" data-tab="entity">Entity</button>
          <button class="tab-btn" data-tab="dao">DAO</button>
          <button class="tab-btn" data-tab="retrofit">Retrofit</button>
          <button class="tab-btn" data-tab="hilt">Hilt module</button>
          <button class="tab-btn" data-tab="worker">WorkManager</button>
        </div>

        <div class="tab-content active" data-tab-panel="viewmodel">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Screen orchestrator</div><strong><code>@HiltViewModel</code> starter</strong></div>
              <button class="copy-btn" data-copy-target="android-viewmodel-code">Copy snippet</button>
            </div>
            <pre id="android-viewmodel-code">@HiltViewModel
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

    fun refreshReceipts() {
        viewModelScope.launch {
            _state.update { it.copy(receipts = loadReceipts()) }
        }
    }
}</pre>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="state">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">UI state holder</div><strong>Screen state starter</strong></div>
              <button class="copy-btn" data-copy-target="android-state-code">Copy snippet</button>
            </div>
            <pre id="android-state-code">data class CheckoutUiState(
    val receipts: List&lt;PaymentReceipt&gt; = emptyList(),
    val lastReceipt: PaymentReceipt? = null,
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
)</pre>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="repo">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Data boundary</div><strong>Repository starter</strong></div>
              <button class="copy-btn" data-copy-target="android-repo-code">Copy snippet</button>
            </div>
            <pre id="android-repo-code">fun ChargeRequest.toRequestDto(): ChargeRequestDto = ChargeRequestDto(
    customerId = customerId,
    paymentToken = paymentToken,
    amountInCents = amountInCents,
)

fun ReceiptResponseDto.toDomain(nowMillis: Long): PaymentReceipt = PaymentReceipt(
    receiptId = receiptId,
    customerId = customerId,
    amountInCents = amountInCents,
    gatewayName = gatewayName,
    createdAtMillis = nowMillis,
)

fun PaymentReceipt.toEntity(): ReceiptEntity = ReceiptEntity(
    receiptId = receiptId,
    customerId = customerId,
    amountInCents = amountInCents,
    gatewayName = gatewayName,
    createdAtMillis = createdAtMillis,
)

interface CheckoutRepository {
    suspend fun charge(request: ChargeRequest): PaymentReceipt
    suspend fun loadReceipts(): List&lt;PaymentReceipt&gt;
}

class DefaultCheckoutRepository(
    private val api: CheckoutApi,
    private val receiptDao: ReceiptDao,
    private val timeProvider: TimeProvider,
) : CheckoutRepository {
    override suspend fun charge(request: ChargeRequest): PaymentReceipt {
        val receipt = api.charge(request.toRequestDto())
            .toDomain(timeProvider.nowMillis())
        receiptDao.insert(receipt.toEntity())
        return receipt
    }

    override suspend fun loadReceipts(): List&lt;PaymentReceipt&gt; {
        return receiptDao.getAll().map { it.toDomain() }
    }
}</pre>
          </div>
          <p>The repository owns the local/remote coordination. The ViewModel should not do this work directly.</p>
          <p><strong>Repository rule of thumb:</strong> repositories should <em>call</em> mapper functions and choose <em>when</em> to use them, but the mapper functions themselves do not need to live inside the ViewModel or every call site. Keep mapping visible and reusable without smearing it everywhere.</p>
        </div>

        <div class="tab-content" data-tab-panel="entity">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Persistence model</div><strong>Room entity starter</strong></div>
              <button class="copy-btn" data-copy-target="android-entity-code">Copy snippet</button>
            </div>
            <pre id="android-entity-code">@Entity(tableName = "receipts")
data class ReceiptEntity(
    @PrimaryKey val receiptId: String,
    val customerId: String,
    val amountInCents: Int,
    val gatewayName: String,
    val createdAtMillis: Long,
)

fun ReceiptEntity.toDomain(): PaymentReceipt = PaymentReceipt(
    receiptId = receiptId,
    customerId = customerId,
    amountInCents = amountInCents,
    gatewayName = gatewayName,
    createdAtMillis = createdAtMillis,
)</pre>
          </div>
          <p>The entity is the Room-facing table shape. It exists so the database layer can store/query efficiently. It is not automatically the best shape for UI or business rules, which is why mapping to a domain model still matters.</p>
          <p><strong>Important detail:</strong> if you later add local-only columns like <code>isFavorite</code>, <code>lastViewedAtMillis</code>, or sync metadata, that is a strong sign the entity should stay separate from the domain model. The domain model should not silently inherit every DB concern.</p>
        </div>

        <div class="tab-content" data-tab-panel="dao">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Local persistence boundary</div><strong>Room DAO starter</strong></div>
              <button class="copy-btn" data-copy-target="android-dao-code">Copy snippet</button>
            </div>
            <pre id="android-dao-code">@Dao
interface ReceiptDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(receipt: ReceiptEntity)

    @Query("SELECT * FROM receipts ORDER BY createdAtMillis DESC")
    suspend fun getAll(): List&lt;ReceiptEntity&gt;

    @Query("SELECT * FROM receipts ORDER BY createdAtMillis DESC")
    fun observeAll(): Flow&lt;List&lt;ReceiptEntity&gt;&gt;

    @Query("DELETE FROM receipts")
    suspend fun clearAll()
}</pre>
          </div>
          <p>The DAO is the <strong>database access tool</strong>, not the full data-policy owner. Its job is to run Room queries and persistence operations. It should not decide when to sync, how to merge remote and local data, or what the screen should render next. Those larger decisions belong in the repository and use cases.</p>
        </div>

        <div class="tab-content" data-tab-panel="retrofit">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Remote boundary</div><strong>Retrofit API starter</strong></div>
              <button class="copy-btn" data-copy-target="android-retrofit-code">Copy snippet</button>
            </div>
            <pre id="android-retrofit-code">data class ChargeRequestDto(
    val customerId: String,
    val paymentToken: String,
    val amountInCents: Int,
)

data class ReceiptResponseDto(
    val receiptId: String,
    val customerId: String,
    val amountInCents: Int,
    val gatewayName: String,
)

interface CheckoutApi {
    @POST("billing/charge")
    suspend fun charge(@Body request: ChargeRequestDto): ReceiptResponseDto

    @GET("billing/receipts")
    suspend fun loadReceipts(): List<ReceiptResponseDto>
}</pre>
          </div>
          <p>Retrofit is the network transport boundary. It knows routes, HTTP verbs, serialization, and remote DTO shapes. It should not know Room queries, UI state, or which screen is currently open. The repository stands between Retrofit and the rest of the app so that transport concerns do not leak upward.</p>
          <p><strong>Naming rule:</strong> if a type is shaped by the server contract, let the name admit it with a <code>Dto</code> suffix. That makes it much harder to accidentally push server payloads into UI state or Room unchanged without thinking.</p>
        </div>

        <div class="tab-content" data-tab-panel="hilt">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Dependency graph</div><strong>Hilt module starter</strong></div>
              <button class="copy-btn" data-copy-target="android-hilt-starter-code">Copy snippet</button>
            </div>
            <pre id="android-hilt-starter-code">@Module
@InstallIn(SingletonComponent::class)
object CheckoutModule {
    @Provides
    fun provideCheckoutRepository(
        api: CheckoutApi,
        receiptDao: ReceiptDao,
    ): CheckoutRepository = DefaultCheckoutRepository(api, receiptDao)

    @Provides
    fun provideChargeCheckoutUseCase(
        repository: CheckoutRepository,
    ): ChargeCheckoutUseCase = ChargeCheckoutUseCase(repository)
}</pre>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="worker">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Background reuse</div><strong>WorkManager starter</strong></div>
              <button class="copy-btn" data-copy-target="android-worker-code">Copy snippet</button>
            </div>
            <pre id="android-worker-code">@HiltWorker
class ReceiptSyncWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted params: WorkerParameters,
    private val repository: CheckoutRepository,
) : CoroutineWorker(appContext, params) {
    override suspend fun doWork(): Result {
        return try {
            repository.loadReceipts()
            Result.success()
        } catch (t: Throwable) {
            Result.retry()
        }
    }
}</pre>
          </div>
          <p>Workers should reuse your repository/use-case logic when possible instead of reimplementing networking and storage glue.</p>
        </div>
      `),
      panel('Android pipeline to follow', `
        <p>Read this as one screen interaction moving through the Android stack. The goal is to make each handoff visible: who receives user intent, who translates it, who owns data coordination, and who may reuse that data logic later.</p>
        <div class="timeline">
          <div class="step"><strong>1.</strong> UI emits user intent. Example: the user taps “Pay” or “Refresh receipts.”</div>
          <div class="step"><strong>2.</strong> ViewModel maps the intent into a use-case call and updates UI state. This is the screen-facing orchestration layer.</div>
          <div class="step"><strong>3.</strong> Use case coordinates repository behavior. This is where business intent is expressed without tying the screen directly to Retrofit or Room.</div>
          <div class="step"><strong>4.</strong> Repository owns local/remote data coordination. It decides whether this action should call Retrofit, read Room first, write Room after a network call, or combine both sources.</div>
          <div class="step"><strong>5.</strong> Retrofit performs the concrete HTTP request/response work using transport DTOs. That is remote IO, not UI or cache policy.</div>
          <div class="step"><strong>6.</strong> The repository maps remote DTOs into entities or domain models, then decides what should be persisted locally.</div>
          <div class="step"><strong>7.</strong> The DAO performs the concrete Room query or insert. This is the SQL/Room boundary, not the place where product policy is decided.</div>
          <div class="step"><strong>8.</strong> Hilt/manual graph chooses long-lived dependencies. This is where object lifetime and reuse policy are decided.</div>
          <div class="step"><strong>9.</strong> Workers and background sync reuse repository logic where appropriate, so background jobs do not reimplement the same network/storage glue badly in a second place.</div>
        </div>
        <div class="note">
          <div class="callout-title">Important Android distinction</div>
          <div>A DAO is like a database clerk: it knows how to read and write rows. Retrofit is like the courier desk that talks to a remote office. The repository is the coordinator that decides <strong>when</strong> to ask the clerk, <strong>when</strong> to call the courier desk, and <strong>how</strong> to combine both sources into one app-level story.</div>
        </div>
      `),
      panel('Android query flow you should be able to trace exactly', `
        <div class="timeline">
          <div class="step"><strong>Query flow A — local-first observe:</strong> ViewModel → use case → repository → DAO <code>observeAll()</code> → Room emits entity flow → repository maps to domain models → ViewModel exposes UI state.</div>
          <div class="step"><strong>Query flow B — refresh then observe:</strong> ViewModel/worker → use case or refresh entry → repository → Retrofit <code>loadReceipts()</code> → <code>ReceiptResponseDto</code> mapping → DAO <code>replaceAll()</code> with <code>ReceiptEntity</code> → Room emits updated entities → repository maps to <code>PaymentReceipt</code> → UI updates.</div>
          <div class="step"><strong>Write flow:</strong> UI pay action → ViewModel → use case → repository → <code>ChargeRequest.toRequestDto()</code> → Retrofit <code>charge()</code> → <code>ReceiptResponseDto.toDomain()</code> → <code>PaymentReceipt.toEntity()</code> → DAO <code>insert()</code> → Room emits updated list → ViewModel sees fresh local state.</div>
        </div>
        <p>If you can trace those three flows clearly, Room/Retrofit/repository relationships stop feeling magical. You can point to the exact layer that owns network transport, SQL access, mapping, and screen state.</p>
        <div class="good">
          <div class="callout-title">What to memorize less, and understand more</div>
          <div>Do not try to memorize every function name. Instead, master the pattern: <strong>boundary-specific shape in, mapper conversion, boundary-specific shape out</strong>. The names may change by project, but the architectural job stays the same.</div>
        </div>
      `),
      panel('Android anti-pattern examples for mapping confusion', `
        <div class="compare-grid">
          <div class="compare-card dont">
            <h3>Anti-pattern: ViewModel stores <code>ReceiptResponseDto</code> directly</h3>
            <p>The screen is now coupled to server payload shape. If the backend adds a field, renames one, or returns transport-specific oddities, your UI state contract shifts for the wrong reason.</p>
          </div>
          <div class="compare-card dont">
            <h3>Anti-pattern: random field-copy mappers scattered everywhere</h3>
            <p>If every screen, repository, and worker copies the same fields manually in slightly different ways, mapping bugs and inconsistent defaults appear quickly. Central mapper functions make the conversion contract easier to review.</p>
          </div>
          <div class="compare-card dont">
            <h3>Anti-pattern: DAO returns domain models directly</h3>
            <p>This looks convenient at first, but it hides where storage shape ends and business shape begins. The repository loses a clean place to coordinate mapping and local/remote merge rules.</p>
          </div>
          <div class="compare-card dont">
            <h3>Anti-pattern: Retrofit DTO inserted into Room unchanged</h3>
            <p>This often means server transport concerns leak into your local schema. A separate entity lets you keep local-only columns and evolve persistence independently.</p>
          </div>
          <div class="compare-card do">
            <h3>Healthier pattern</h3>
            <p>Retrofit DTO → repository mapping → Room entity and/or domain model → repository emits stable domain model → ViewModel maps to UI state.</p>
          </div>
        </div>
      `),
      panel('Practice task: extend the Android starter with a cancel-payment action', teachingTask({
        task: 'Add a cancel-payment action triggered by the Android UI. The stricter design goal is to keep the ViewModel screen-facing, the use case business-facing, and the repository responsible for local/remote coordination and mapping.',
        thinkFirst: [
          'What should happen immediately in the ViewModel when the button is tapped?',
          'Which part should express the business action “cancel payment”?',
          'Which layer should coordinate Retrofit, Room, and cache updates after cancellation?'
        ],
        codeId: 'platform-android-cancel-solution',
        codeTitle: 'Cancel-payment flow with ViewModel → use case → repository separation',
        code: `data class CancelResult(
    val paymentId: String,
    val status: String,
)

class CancelPaymentUseCase @Inject constructor(
    private val repository: CheckoutRepository,
) {
    suspend operator fun invoke(paymentId: String): CancelResult {
        // Use case expresses one business action clearly.
        return repository.cancelPayment(paymentId)
    }
}

@HiltViewModel
class CheckoutViewModel @Inject constructor(
    private val cancelPayment: CancelPaymentUseCase,
) : ViewModel() {
    private val _state = MutableStateFlow(CheckoutUiState())
    val state: StateFlow<CheckoutUiState> = _state

    fun onCancelClicked(paymentId: String) {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }

            runCatching { cancelPayment(paymentId) }
                .onSuccess { result ->
                    _state.update {
                        it.copy(
                            isLoading = false,
                            errorMessage = null,
                            statusMessage = "cancelled " + result.paymentId,
                        )
                    }
                }
                .onFailure { error ->
                    _state.update { it.copy(isLoading = false, errorMessage = error.message) }
                }
        }
    }
}

class DefaultCheckoutRepository(
    private val api: CheckoutApi,
    private val dao: ReceiptDao,
) : CheckoutRepository {
    override suspend fun cancelPayment(paymentId: String): CancelResult {
        // Repository owns remote call + local persistence update.
        val response = api.cancelPayment(paymentId)
        dao.updateStatus(paymentId, response.status)
        return CancelResult(paymentId = paymentId, status = response.status)
    }
}`,
        explanation: [
          {
            title: 'ViewModel owns UI state transitions',
            body: 'Loading and error flags belong in the ViewModel because they are screen-facing concerns tied to user interaction and rendering.'
          },
          {
            title: 'The use case gives the action a business name',
            body: 'A named use case such as <code>CancelPaymentUseCase</code> keeps the ViewModel from depending directly on repository details or data-source mechanics.'
          },
          {
            title: 'Repository coordinates Retrofit and Room',
            body: 'Cancellation is not only a network call. The repository also updates local state so the rest of the feature observes one coherent data story.'
          }
        ],
        pipeline: [
          'UI button tap enters the ViewModel as a screen event.',
          'ViewModel calls <code>CancelPaymentUseCase</code> and manages loading/error UI state.',
          'Use case delegates to the repository as the data coordinator.',
          'Repository calls Retrofit, updates Room, maps the result, and returns a stable domain result.'
        ],
        spring: [
          'The backend analogue is a controller calling a public cancel/refund use case instead of a raw provider client.',
          'The use case should coordinate repository and gateway work while the controller remains thin.',
          'The same separation makes controller tests and service tests much easier.'
        ],
        android: [
          'This is the recommended Hilt-friendly Android path: Composable → ViewModel → use case → repository → Retrofit/Room.',
          'If a worker later needs to refresh cancelled payments, it should reuse repository logic instead of duplicating network/storage glue.',
          'Keep transient button/loading state in the ViewModel, not in the repository.'
        ],
        mistakes: [
          'Letting the ViewModel call Retrofit directly because it is “just one endpoint”.',
          'Updating Room from the screen layer instead of the repository.',
          'Skipping the use case so the ViewModel becomes a mixed UI/data orchestration class.'
        ],
        better: 'This solution is better because every layer keeps one job: screen state in the ViewModel, business intention in the use case, and data coordination in the repository. That is easier to maintain and much easier to reuse in background work later.'
      })),
      panel('Practice task: place the DAO in the right spot', teachingTask({
        task: 'You are building an offline receipt list. Decide which layer should own <code>observeAllReceipts()</code>, <code>fetchLatestReceipts()</code>, <code>insertReceiptEntity()</code>, and the decision about whether stale data should trigger sync.',
        thinkFirst: [
          'Which operations are concrete database queries vs higher-level data coordination?',
          'Which layer should understand staleness and sync policy?',
          'What should the ViewModel see: entities, domain models, or UI state only?'
        ],
        codeId: 'platform-android-dao-placement-solution',
        codeTitle: 'DAO stays at the Room boundary while repository owns coordination',
        code: `@Dao
interface ReceiptDao {
    @Query("SELECT * FROM receipts ORDER BY createdAtMillis DESC")
    fun observeAll(): Flow<List<ReceiptEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(receipts: List<ReceiptEntity>)
}

class DefaultCheckoutRepository(
    private val api: CheckoutApi,
    private val dao: ReceiptDao,
    private val clock: TimeProvider,
) : CheckoutRepository {
    fun observeAllReceipts(): Flow<List<PaymentReceipt>> {
        // Repository exposes domain-facing observation but uses DAO internally.
        return dao.observeAll().map { entities -> entities.map { it.toDomain() } }
    }

    suspend fun fetchLatestReceipts() {
        // Repository owns remote + local coordination.
        val remoteReceipts = api.loadReceipts()
        dao.insertAll(remoteReceipts.map { dto -> dto.toEntity(clock.nowMillis()) })
    }

    fun shouldTriggerSync(lastRefreshMillis: Long): Boolean {
        // Staleness policy belongs here, not in the DAO.
        return clock.nowMillis() - lastRefreshMillis > 60_000
    }
}`,
        explanation: [
          {
            title: 'DAO owns Room queries and inserts',
            body: 'The DAO is the local database boundary. It should expose entity flows and concrete persistence operations, not sync strategy or screen policy.'
          },
          {
            title: 'Repository owns local/remote cooperation',
            body: 'Fetching latest receipts, mapping DTOs to entities, and deciding when to refresh are coordination responsibilities, so they belong in the repository.'
          },
          {
            title: 'Domain-facing observation should come from the repository',
            body: 'The repository can expose stable domain models while still using the DAO internally. That prevents Room entities from leaking upward.'
          }
        ],
        pipeline: [
          'ViewModel or worker asks repository for data or refresh.',
          'Repository decides whether refresh is needed.',
          'DAO performs local observe/insert operations.',
          'Repository maps entities to domain models before the UI sees them.'
        ],
        spring: [
          'The Spring analogue is that a JPA repository adapter owns database access, while the application service owns orchestration and policy.',
          'Do not move business staleness/retry policy into raw persistence interfaces just because they are convenient to reach.',
          'Keep domain models distinct from persistence entities just as Android keeps domain distinct from Room entities.'
        ],
        android: [
          'This is the heart of Room/DAO/repository separation: DAO for queries, repository for policy and mapping.',
          'ViewModel should consume domain/UI state only, not Room entities directly.',
          'Workers should call repository refresh logic, not invent a second DAO-only sync path.'
        ],
        mistakes: [
          'Making DAO the owner of sync timing or cache invalidation policy.',
          'Letting ViewModels call DAO and Retrofit directly together.',
          'Returning entities to the UI and treating them as the universal model.'
        ],
        better: 'This solution is better because it gives each Android layer a clean boundary. DAO remains a local persistence tool, while the repository becomes the place where the feature\'s data story is coordinated deliberately.'
      })),
      panel('Practice task: place Retrofit, entity mapping, and DAO work correctly', teachingTask({
        task: 'Implement <code>refreshReceipts()</code> and place each responsibility correctly: call the server, parse DTOs, map DTOs to entities, write to Room, expose domain models to the screen, and decide whether refresh should happen now or later.',
        thinkFirst: [
          'Which layer knows HTTP transport details?',
          'Which layer knows Room insert/query details?',
          'Which layer should decide whether refresh happens now or later?',
          'Where should DTO → entity → domain conversions be orchestrated?'
        ],
        codeId: 'platform-android-refresh-placement-solution',
        codeTitle: 'Refresh pipeline showing Retrofit, repository, mapper, DAO, and ViewModel roles clearly',
        code: `interface CheckoutApi {
    @GET("billing/receipts")
    suspend fun loadReceipts(): List<ReceiptResponseDto>
}

class DefaultCheckoutRepository(
    private val api: CheckoutApi,
    private val dao: ReceiptDao,
    private val timeProvider: TimeProvider,
) : CheckoutRepository {
    override suspend fun refreshReceipts(force: Boolean) {
        if (!force && !shouldRefreshNow()) return

        // Retrofit performs the remote call and deserializes DTOs.
        val dtos = api.loadReceipts()

        // Repository coordinates mapping and persistence strategy.
        val entities = dtos.map { dto -> dto.toEntity(timeProvider.nowMillis()) }
        dao.replaceAll(entities)
    }

    override fun observeReceipts(): Flow<List<PaymentReceipt>> {
        return dao.observeAll().map { entities -> entities.map { it.toDomain() } }
    }

    private fun shouldRefreshNow(): Boolean = true
}

@HiltViewModel
class CheckoutViewModel @Inject constructor(
    private val refreshReceipts: RefreshReceiptsUseCase,
) : ViewModel() {
    fun onPullToRefresh() {
        viewModelScope.launch {
            refreshReceipts(force = true)
        }
    }
}`,
        explanation: [
          {
            title: 'Retrofit owns transport',
            body: 'The API interface declares endpoints and deserializes DTOs. It should not know Room, UI state, or cache timing policy.'
          },
          {
            title: 'Repository owns coordination and mapping strategy',
            body: 'The repository decides whether to refresh, calls Retrofit, maps DTOs to entities, writes them through the DAO, and later exposes domain models by observing Room.'
          },
          {
            title: 'ViewModel only triggers the action and exposes screen state',
            body: 'It does not manually build DTOs or entities. That keeps the UI layer focused on rendering and interaction.'
          }
        ],
        pipeline: [
          'UI emits pull-to-refresh intent.',
          'ViewModel triggers a refresh use case or repository-facing action.',
          'Repository decides if refresh should run.',
          'Retrofit loads DTOs.',
          'Repository maps DTOs to entities and writes them through the DAO.',
          'Repository observes Room and maps entities to domain models for the UI.'
        ],
        spring: [
          'The backend analogue is controller DTO → application service → repository/entity mapping → persistence.',
          'HTTP DTOs stay at the transport edge, entities stay at the persistence edge, and domain models stay in the middle.',
          'The shared lesson is boundary-specific shapes with explicit mapping points.'
        ],
        android: [
          'This is the concrete Retrofit/Room/repository flow the course wants you to master.',
          'DTOs belong to remote transport, entities belong to Room, domain models belong to the app-facing middle layer.',
          'Hilt wires the collaborators, but the repository still owns the data story.'
        ],
        mistakes: [
          'Letting the ViewModel or Composable map DTOs and insert entities directly.',
          'Returning DTOs or entities straight to the UI as if they were domain truth.',
          'Hiding refresh timing rules inside DAO code or Retrofit declarations.'
        ],
        better: 'This solution is better because it makes the query flow traceable. You can point to exactly where transport ends, where persistence begins, and where the repository joins them into one coherent feature-facing pipeline.'
      })),
      panel('Android feature pipeline', `
        <p>This is the mobile version of the same architectural story: user input enters, the screen-facing layer translates it, business logic coordinates, data logic persists/loads, and background work reuses the same core path.</p>
        <div class="timeline">
          <div class="step"><strong>1.</strong> The user triggers an intent from the screen, such as tapping Pay or opening a receipt list.</div>
          <div class="step"><strong>2.</strong> The ViewModel maps that intent to a use-case call. This is the handoff from UI language into business-action language.</div>
          <div class="step"><strong>3.</strong> The use case calls a repository abstraction. The use case expresses policy; it does not manually coordinate Room and Retrofit itself.</div>
          <div class="step"><strong>4.</strong> The repository coordinates Retrofit, Room, mapping, timestamps, and refresh rules. This is the data pipeline layer where local and remote concerns meet.</div>
          <div class="step"><strong>5.</strong> Retrofit performs transport work with request/response DTOs. It is the HTTP client boundary, not the screen or cache policy owner.</div>
          <div class="step"><strong>6.</strong> The repository maps remote DTOs into entities or domain models, then chooses whether to persist, merge, or emit results immediately.</div>
          <div class="step"><strong>7.</strong> The DAO executes the concrete Room operations such as observe, insert, replace, or query-by-id. That is storage access, not full sync policy.</div>
          <div class="step"><strong>8.</strong> The ViewModel updates UI state with the result, turning repository/use-case output back into something the screen can render.</div>
          <div class="step"><strong>9.</strong> A Hilt worker reuses repository logic for background refresh and sync, preventing the app from duplicating data coordination rules in a second background-only implementation.</div>
        </div>
      `),
      panel('Room + Retrofit + repository: one comparison table', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Piece</th><th>Main job</th><th>Input/Output shape</th><th>What it should not own</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Retrofit API</td>
                <td>HTTP transport and DTO serialization</td>
                <td>Request DTOs / response DTOs</td>
                <td>UI state, Room query rules, cache staleness policy</td>
              </tr>
              <tr>
                <td>DAO</td>
                <td>Room queries and persistence operations</td>
                <td>Entities / entity flows</td>
                <td>Sync timing, network decisions, screen orchestration</td>
              </tr>
              <tr>
                <td>Repository</td>
                <td>Coordinate Retrofit + DAO + mapping + refresh policy</td>
                <td>Domain/app-facing models and flows</td>
                <td>Composable rendering or direct Room SQL details everywhere else</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Concrete naming convention for larger Android teams', `
        <ul>
          <li><strong>Remote:</strong> <code>ReceiptResponseDto</code>, <code>ChargeRequestDto</code></li>
          <li><strong>Local:</strong> <code>ReceiptEntity</code></li>
          <li><strong>Domain:</strong> <code>PaymentReceipt</code>, <code>ChargeRequest</code></li>
          <li><strong>Mapping:</strong> <code>toEntity()</code>, <code>toDomain()</code>, <code>toRequestDto()</code></li>
        </ul>
        <p>This naming pattern is not mandatory law, but it is a very effective team convention because it reveals which layer owns each type before you even open the file.</p>
      `),
      panel('Spring vs Android mapper symmetry at a glance', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Architectural role</th><th>Spring Boot example</th><th>Android example</th><th>Shared lesson</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Transport shape</td>
                <td><code>ChargeHttpRequest</code>, <code>ChargeHttpResponse</code></td>
                <td><code>ChargeRequestDto</code>, <code>ReceiptResponseDto</code></td>
                <td>Boundary-specific types should stay near the boundary that owns them</td>
              </tr>
              <tr>
                <td>Domain shape</td>
                <td><code>ChargeRequest</code>, <code>PaymentReceipt</code></td>
                <td><code>ChargeRequest</code>, <code>PaymentReceipt</code></td>
                <td>Business meaning should stay readable and stable in the middle layer</td>
              </tr>
              <tr>
                <td>Persistence shape</td>
                <td><code>ReceiptEntity</code></td>
                <td><code>ReceiptEntity</code></td>
                <td>Storage-facing types should stay at the persistence edge</td>
              </tr>
              <tr>
                <td>Mapper ownership</td>
                <td>HTTP mappers near API layer, entity mappers near JPA layer</td>
                <td>DTO mappers near Retrofit layer, entity mappers near Room layer</td>
                <td>Keep conversion logic near the boundary that forces the shape change</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Practice task: extend the Android starter with a receipt reconciliation feature', teachingTask({
        task: 'Add a background reconciliation feature that fetches receipts from the server and updates the local database. The strict design goal is to make the worker a background boundary only, while the repository continues to own Retrofit, Room, mapping, and refresh policy.',
        thinkFirst: [
          'Should the worker know Retrofit and Room details directly, or should it reuse existing repository logic?',
          'Which layer should decide retries and refresh behavior?',
          'How will Room updates flow back to the UI after the worker completes?'
        ],
        codeId: 'platform-android-reconciliation-solution',
        codeTitle: 'Worker reusing repository refresh logic instead of duplicating data coordination',
        code: `@HiltWorker
class ReceiptSyncWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted params: WorkerParameters,
    private val repository: CheckoutRepository,
) : CoroutineWorker(appContext, params) {
    override suspend fun doWork(): Result {
        return try {
            // Worker is only the background entry point.
            repository.refreshReceipts(force = true)
            Result.success()
        } catch (error: Throwable) {
            Result.retry()
        }
    }
}

class DefaultCheckoutRepository(
    private val api: CheckoutApi,
    private val dao: ReceiptDao,
    private val timeProvider: TimeProvider,
) : CheckoutRepository {
    override suspend fun refreshReceipts(force: Boolean) {
        val dtos = api.loadReceipts()
        val entities = dtos.map { dto -> dto.toEntity(timeProvider.nowMillis()) }
        dao.replaceAll(entities)
    }
}`,
        explanation: [
          {
            title: 'The worker is a boundary, not a second repository',
            body: 'WorkManager should trigger background work, not reimplement the whole data pipeline. Reusing the repository prevents the app from having two separate refresh stories.'
          },
          {
            title: 'Repository remains the coordinator',
            body: 'Retrofit loading, DTO mapping, entity persistence, and refresh policy still belong in the repository. That keeps data rules consistent whether refresh comes from UI or background sync.'
          },
          {
            title: 'Room remains the shared local state source',
            body: 'When the worker writes new entities through the DAO, any UI observing Room-backed repository flows can react naturally.'
          }
        ],
        pipeline: [
          'WorkManager starts the worker as a background boundary.',
          'Worker calls repository refresh logic.',
          'Repository uses Retrofit to load DTOs, maps them, and writes entities through the DAO.',
          'Room emits updated local state, which the repository maps to domain models for the UI.'
        ],
        spring: [
          'The backend analogue is a scheduled job or consumer calling the same application service that controllers use when appropriate.',
          'Job runners should not bypass the application layer and talk directly to raw adapters unless there is a deliberate reason.',
          'The shared lesson is reuse of business/data coordination across multiple boundaries.'
        ],
        android: [
          'This is the recommended Hilt + WorkManager pattern: worker depends on repository/use-case abstractions, not raw Retrofit/Room glue.',
          'DAO stays local, Retrofit stays remote, repository stays the coordinator.',
          'This prevents offline-first and sync logic from drifting apart over time.'
        ],
        mistakes: [
          'Putting Retrofit and DAO calls directly in the worker in a brand-new flow.',
          'Treating WorkManager as permission to ignore repository boundaries.',
          'Making background refresh write data differently from foreground refresh.'
        ],
        better: 'This solution is better because it keeps one source of truth for data coordination. UI refreshes and background reconciliation now follow the same repository-managed pipeline instead of diverging into separate implementations.'
      }))
    ]
  },
  {
    id: 'spring-boot-complete-feature',
    title: 'Spring Boot complete feature',
    navLabel: 'Spring Boot complete feature',
    group: 'Platform starters',
    level: 'Advanced',
    time: '18 min',
    sampleSource: 'course synthesis',
    summary: 'One complete Kotlin Spring Boot billing feature with idempotent checkout, receipt history, configuration wiring, adapters, and focused tests.',
    sections: [
      hero(
        'One complete Spring Boot billing feature from HTTP boundary to hidden adapters',
        ['Complete feature', 'Idempotency', 'Configuration', 'Tests'],
        `
          <p>This lesson turns the architecture into one cohesive backend feature instead of isolated snippets. The example is a <strong>billing checkout + receipt history</strong> feature with an <strong>idempotency check</strong>, public APIs, hidden adapters, Spring configuration, and tests.</p>
          <div class="good">
            <div class="callout-title">Recommended backend shape</div>
            <div>Keep controllers thin, keep the application layer framework-light, keep creation policy in configuration, and keep JPA/provider details behind infrastructure adapters.</div>
          </div>
        `
      ),
      panel('Feature pipeline from request to persistence', `
        <p>This is the backend version of “follow the parcel.” One request enters, is translated, processed, persisted, and later read back. The value of good architecture is that every stop in the journey has one clear job.</p>
        <div class="timeline">
          <div class="step"><strong>1.</strong> HTTP request enters <code>BillingController</code>.</div>
          <div class="step"><strong>2.</strong> The controller maps transport data to a public <code>ChargeRequest</code>. Raw HTTP is turned into a business-shaped request object here.</div>
          <div class="step"><strong>3.</strong> The controller calls <code>BillingFeature.checkoutService</code>. This keeps the boundary talking in business capabilities rather than infrastructure details.</div>
          <div class="step"><strong>4.</strong> The checkout service checks idempotency, calls the payment gateway, builds a public receipt, and saves it. This is the heart of the write-side business flow.</div>
          <div class="step"><strong>5.</strong> The receipt query service reads the same shared repository and returns public models. Because the repository is shared, the read side sees the result of the write side.</div>
          <div class="step"><strong>6.</strong> Spring configuration wires the whole graph together and chooses the implementations. This step lives outside the request flow but makes the request flow possible.</div>
        </div>
      `),
      panel('Complete Spring feature code map', `
        <div class="tabs" data-tab-group="spring-complete-feature">
          <button class="tab-btn active" data-tab="api">API layer</button>
          <button class="tab-btn" data-tab="app">Application layer</button>
          <button class="tab-btn" data-tab="infra">Infrastructure</button>
          <button class="tab-btn" data-tab="config">Configuration</button>
          <button class="tab-btn" data-tab="tests">Tests</button>
        </div>

        <div class="tab-content active" data-tab-panel="api">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">HTTP boundary</div><strong>Controller + DTOs</strong></div>
              <button class="copy-btn" data-copy-target="spring-complete-api-code">Copy snippet</button>
            </div>
            <pre id="spring-complete-api-code">@RestController
@RequestMapping("/billing")
class BillingController(
    private val billingFeature: BillingFeature,
) {
    @PostMapping("/charge")
    fun charge(
        @RequestHeader("Idempotency-Key") idempotencyKey: String,
        @RequestBody body: ChargeHttpRequest,
    ): ChargeHttpResponse {
        val receipt = billingFeature.checkoutService.charge(
            ChargeRequest(
                customerId = body.customerId,
                paymentToken = body.paymentToken,
                amountInCents = body.amountInCents,
                idempotencyKey = idempotencyKey,
            )
        )
        return ChargeHttpResponse.from(receipt)
    }

    @GetMapping("/receipts")
    fun receipts(): List&lt;ChargeHttpResponse&gt; {
        return billingFeature.receiptQueryService.showReceipts().map(ChargeHttpResponse::from)
    }
}</pre>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="app">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Application layer</div><strong>Use cases + feature bundle</strong></div>
              <button class="copy-btn" data-copy-target="spring-complete-app-code">Copy snippet</button>
            </div>
            <pre id="spring-complete-app-code">data class ChargeRequest(
    val customerId: String,
    val paymentToken: String,
    val amountInCents: Int,
    val idempotencyKey: String,
)

data class PaymentReceipt(
    val receiptId: String,
    val customerId: String,
    val amountInCents: Int,
    val gatewayName: String,
)

interface CheckoutService {
    fun charge(request: ChargeRequest): PaymentReceipt
}

interface ReceiptQueryService {
    fun showReceipts(): List&lt;PaymentReceipt&gt;
}

interface BillingFeature {
    val checkoutService: CheckoutService
    val receiptQueryService: ReceiptQueryService
}</pre>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="infra">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Infrastructure boundary</div><strong>Repository + gateway + idempotency</strong></div>
              <button class="copy-btn" data-copy-target="spring-complete-infra-code">Copy snippet</button>
            </div>
            <pre id="spring-complete-infra-code">interface ReceiptRepository {
    fun save(receipt: PaymentReceipt, idempotencyKey: String)
    fun findAll(): List&lt;PaymentReceipt&gt;
    fun findByIdempotencyKey(idempotencyKey: String): PaymentReceipt?
}

interface PaymentGateway {
    fun charge(request: ChargeRequest): GatewayChargeResult
}

class DefaultCheckoutService(
    private val gateway: PaymentGateway,
    private val repository: ReceiptRepository,
    private val logger: BillingLogger,
) : CheckoutService {
    override fun charge(request: ChargeRequest): PaymentReceipt {
        repository.findByIdempotencyKey(request.idempotencyKey)?.let { return it }

        val gatewayResult = gateway.charge(request)
        val receipt = PaymentReceipt(
            receiptId = "rcpt-\${request.customerId}-\${request.amountInCents}",
            customerId = request.customerId,
            amountInCents = request.amountInCents,
            gatewayName = gatewayResult.gatewayName,
        )
        repository.save(receipt, request.idempotencyKey)
        logger.log("charge_completed customer=\${receipt.customerId} receipt=\${receipt.receiptId}")
        return receipt
    }
}</pre>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="config">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Composition root</div><strong>Spring configuration</strong></div>
              <button class="copy-btn" data-copy-target="spring-complete-config-code">Copy snippet</button>
            </div>
            <pre id="spring-complete-config-code">@Configuration
class BillingModule {
    @Bean
    fun billingFeature(
        repository: ReceiptRepository,
        gateway: PaymentGateway,
        logger: BillingLogger,
    ): BillingFeature {
        val checkoutService = DefaultCheckoutService(gateway, repository, logger)
        val receiptQueryService = DefaultReceiptQueryService(repository, logger)
        return DefaultBillingFeature(checkoutService, receiptQueryService)
    }

    @Bean
    fun paymentGateway(logger: BillingLogger): PaymentGateway = StripePaymentGateway(logger)
}</pre>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="tests">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Focused tests</div><strong>Use-case and controller tests</strong></div>
              <button class="copy-btn" data-copy-target="spring-complete-tests-code">Copy snippet</button>
            </div>
            <pre id="spring-complete-tests-code">class DefaultCheckoutServiceTest {
    @Test
    fun \`charge is idempotent for the same key\`() {
        val repository = InMemoryReceiptRepository()
        val gateway = FakePaymentGateway()
        val logger = RecordingBillingLogger()
        val service = DefaultCheckoutService(gateway, repository, logger)

        val request = ChargeRequest("cust-1", "tok-1", 2500, "idem-1")
        val first = service.charge(request)
        val second = service.charge(request)

        assertEquals(first, second)
        assertEquals(1, repository.findAll().size)
    }
}</pre>
          </div>
        </div>
      `),
      panel('Confusing places explained', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>Why put idempotency in the application/service flow?</h3>
            <p>Because it is business policy around charging, not a controller-only concern. The boundary receives the key, but the use case owns the decision.</p>
          </div>
          <div class="compare-card do">
            <h3>Why does the controller receive the feature instead of a gateway?</h3>
            <p>The controller should ask for a business capability, not infrastructure. The feature/use case protects the boundary from low-level implementation details.</p>
          </div>
          <div class="compare-card dont">
            <h3>What not to do</h3>
            <p>Do not let the controller choose Stripe vs sandbox or reach into repository/gateway details directly.</p>
          </div>
        </div>
      `),
      panel('Extension task: add webhook reconciliation to the Spring feature', teachingTask({
        task: 'Add a webhook reconciliation flow to the Spring Boot feature. The webhook receives provider events and updates receipt state safely. The main design question is whether the webhook should call a public application use case or bypass the app layer and write directly to the repository.',
        thinkFirst: [
          'Is a webhook just another boundary, or does it deserve a raw repository shortcut?',
          'Which provider-specific DTO fields should be mapped immediately at the edge?',
          'Where should signature validation, business reconciliation, and persistence each live?'
        ],
        codeId: 'platform-spring-webhook-solution',
        codeTitle: 'Webhook boundary calling a public reconciliation use case',
        code: `data class ReconcilePaymentRequest(
    val receiptId: String,
    val providerStatus: String,
)

interface ReconcilePaymentService {
    fun reconcile(request: ReconcilePaymentRequest)
}

@RestController
@RequestMapping("/webhooks/payments")
class PaymentWebhookController(
    private val reconcilePaymentService: ReconcilePaymentService,
) {
    @PostMapping
    fun handle(@RequestBody body: PaymentWebhookDto, @RequestHeader("X-Signature") signature: String) {
        validateSignature(body, signature)

        // Boundary maps provider transport data into a business-shaped request.
        reconcilePaymentService.reconcile(
            ReconcilePaymentRequest(
                receiptId = body.receiptId,
                providerStatus = body.status,
            )
        )
    }
}

class DefaultReconcilePaymentService(
    private val receiptRepository: ReceiptRepository,
    private val logger: BillingLogger,
) : ReconcilePaymentService {
    override fun reconcile(request: ReconcilePaymentRequest) {
        receiptRepository.updateProviderStatus(request.receiptId, request.providerStatus)
        logger.log("payment_reconciled receipt=" + request.receiptId)
    }
}`,
        explanation: [
          {
            title: 'Webhook controller is just another boundary',
            body: 'It validates signatures, parses provider DTOs, and maps them into a business-shaped request. That keeps provider payload details at the edge.'
          },
          {
            title: 'Reconciliation is an application capability',
            body: 'Because it updates business state and logging, it belongs in a public use case or service, not as an ad hoc repository shortcut inside the controller.'
          },
          {
            title: 'Repository remains infrastructure-facing',
            body: 'Persistence still happens through the repository boundary, but the application service decides why and when the update occurs.'
          }
        ],
        pipeline: [
          'Webhook boundary validates provider signature and parses the transport DTO.',
          'Boundary maps provider data into <code>ReconcilePaymentRequest</code>.',
          'Application service updates receipt state and logs the reconciliation.',
          'Repository persists the new provider status.'
        ],
        spring: [
          'This is the preferred Spring shape: web listener/controller boundary → application service → repository/logger adapters.',
          'Provider DTOs should stay in the API or adapter layer, not leak into business code.',
          'You can test the reconciliation use case without booting the whole web layer.'
        ],
        android: [
          'The Android analogue is a push receiver, deep-link boundary, or worker mapping raw payloads into a use-case request.',
          'Background boundaries should still call repositories/use cases rather than bypassing app logic.',
          'The same “boundary → public API → hidden adapters” language applies across both platforms.'
        ],
        mistakes: [
          'Letting the webhook controller update the repository directly because it feels simpler.',
          'Leaking provider webhook DTOs into the application layer.',
          'Mixing signature validation, business reconciliation, and persistence details into one class.'
        ],
        better: 'This solution is better because it treats the webhook as a first-class boundary without collapsing the architecture. That keeps provider-specific concerns at the edge and preserves one coherent business layer.'
      }))
    ]
  },
  {
    id: 'android-hilt-complete-feature',
    title: 'Android Hilt complete feature',
    navLabel: 'Android Hilt complete feature',
    group: 'Platform starters',
    level: 'Advanced',
    time: '18 min',
    sampleSource: 'course synthesis',
    summary: 'One complete Android checkout feature using Hilt, ViewModel, repository, Room/Retrofit, WorkManager sync, and deterministic dependencies.',
    sections: [
      hero(
        'One complete Android feature with Hilt, offline-friendly repository design, and worker reuse',
        ['Complete feature', 'Hilt', 'Offline-first', 'Tests'],
        `
          <p>This lesson turns the architecture into one cohesive Android feature: UI intent flows into a Hilt-injected ViewModel, then through use cases into a repository that coordinates local and remote data, while a worker reuses the same logic for background sync.</p>
          <div class="good">
            <div class="callout-title">Recommended Android shape</div>
            <div>UI renders state, ViewModel orchestrates, use cases model business actions, repositories own local/remote coordination, and workers reuse that data logic rather than duplicating it.</div>
          </div>
        `
      ),
      panel('Android feature pipeline', `
        <p>This is the mobile version of the same architectural story: user input enters, the screen-facing layer translates it, business logic coordinates, data logic persists/loads, and background work reuses the same core path.</p>
        <div class="timeline">
          <div class="step"><strong>1.</strong> The user triggers an intent from the screen, such as tapping Pay or opening a receipt list.</div>
          <div class="step"><strong>2.</strong> The ViewModel maps that intent to a use-case call. This is the handoff from UI language into business-action language.</div>
          <div class="step"><strong>3.</strong> The use case calls a repository abstraction. The use case expresses policy; it does not manually coordinate Room and Retrofit itself.</div>
          <div class="step"><strong>4.</strong> The repository coordinates Retrofit, Room, mapping, timestamps, and refresh rules. This is the data pipeline layer where local and remote concerns meet.</div>
          <div class="step"><strong>5.</strong> Retrofit performs transport work with request/response DTOs. It is the HTTP client boundary, not the screen or cache policy owner.</div>
          <div class="step"><strong>6.</strong> The repository maps remote DTOs into entities or domain models, then chooses whether to persist, merge, or emit results immediately.</div>
          <div class="step"><strong>7.</strong> The DAO executes the concrete Room operations such as observe, insert, replace, or query-by-id. That is storage access, not full sync policy.</div>
          <div class="step"><strong>8.</strong> The ViewModel updates UI state with the result, turning repository/use-case output back into something the screen can render.</div>
          <div class="step"><strong>9.</strong> A Hilt worker reuses repository logic for background refresh and sync, preventing the app from duplicating data coordination rules in a second background-only implementation.</div>
        </div>
      `),
      panel('Complete Android feature code map', `
        <div class="tabs" data-tab-group="android-complete-feature">
          <button class="tab-btn active" data-tab="ui">UI + ViewModel</button>
          <button class="tab-btn" data-tab="domain">Use cases + models</button>
          <button class="tab-btn" data-tab="data">Repository + data sources</button>
          <button class="tab-btn" data-tab="di">Hilt module + worker</button>
          <button class="tab-btn" data-tab="tests">Tests</button>
        </div>

        <div class="tab-content active" data-tab-panel="ui">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">UI orchestration</div><strong>Composable + ViewModel</strong></div>
              <button class="copy-btn" data-copy-target="android-complete-ui-code">Copy snippet</button>
            </div>
            <pre id="android-complete-ui-code">@HiltViewModel
class CheckoutViewModel @Inject constructor(
    private val chargeCheckout: ChargeCheckoutUseCase,
    private val observeReceipts: ObserveReceiptsUseCase,
) : ViewModel() {
    private val _state = MutableStateFlow(CheckoutUiState())
    val state: StateFlow&lt;CheckoutUiState&gt; = _state

    init {
        viewModelScope.launch {
            observeReceipts().collect { receipts ->
                _state.update { it.copy(receipts = receipts) }
            }
        }
    }

    fun onPayClicked(request: ChargeRequest) {
        viewModelScope.launch {
            _state.update { it.copy(isLoading = true) }
            runCatching { chargeCheckout(request) }
                .onSuccess { receipt ->
                    _state.update { it.copy(isLoading = false, lastReceipt = receipt, errorMessage = null) }
                }
                .onFailure { error ->
                    _state.update { it.copy(isLoading = false, errorMessage = error.message) }
                }
        }
    }
}</pre>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="domain">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Domain/application layer</div><strong>Use cases + models</strong></div>
              <button class="copy-btn" data-copy-target="android-complete-domain-code">Copy snippet</button>
            </div>
            <pre id="android-complete-domain-code">data class ChargeRequest(
    val customerId: String,
    val paymentToken: String,
    val amountInCents: Int,
)

data class PaymentReceipt(
    val receiptId: String,
    val customerId: String,
    val amountInCents: Int,
    val gatewayName: String,
    val createdAtMillis: Long,
)

class ChargeCheckoutUseCase @Inject constructor(
    private val repository: CheckoutRepository,
) {
    suspend operator fun invoke(request: ChargeRequest): PaymentReceipt = repository.charge(request)
}

class ObserveReceiptsUseCase @Inject constructor(
    private val repository: CheckoutRepository,
) {
    operator fun invoke(): Flow&lt;List&lt;PaymentReceipt&gt;&gt; = repository.observeReceipts()
}</pre>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="data">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Data layer</div><strong>Repository + data sources</strong></div>
              <button class="copy-btn" data-copy-target="android-complete-data-code">Copy snippet</button>
            </div>
            <pre id="android-complete-data-code">data class ReceiptResponseDto(
    val receiptId: String,
    val customerId: String,
    val amountInCents: Int,
    val gatewayName: String,
)

@Entity(tableName = "receipts")
data class ReceiptEntity(
    @PrimaryKey val receiptId: String,
    val customerId: String,
    val amountInCents: Int,
    val gatewayName: String,
    val createdAtMillis: Long,
)

interface CheckoutRepository {
    suspend fun charge(request: ChargeRequest): PaymentReceipt
    fun observeReceipts(): Flow<List<PaymentReceipt>>
    suspend fun refreshReceipts()
}

class DefaultCheckoutRepository(
    private val api: CheckoutApi,
    private val dao: ReceiptDao,
    private val timeProvider: TimeProvider,
) : CheckoutRepository {
    override suspend fun charge(request: ChargeRequest): PaymentReceipt {
        val remoteReceipt = api.charge(request)
        val receipt = PaymentReceipt(
            receiptId = remoteReceipt.receiptId,
            customerId = remoteReceipt.customerId,
            amountInCents = remoteReceipt.amountInCents,
            gatewayName = remoteReceipt.gatewayName,
            createdAtMillis = timeProvider.nowMillis(),
        )
        dao.insert(receipt.toEntity())
        return receipt
    }

    override fun observeReceipts(): Flow<List<PaymentReceipt>> {
        return dao.observeAll().map { entities -> entities.map { it.toDomain() } }
    }

    override suspend fun refreshReceipts() {
        val latest = api.loadReceipts()
        dao.replaceAll(latest.map { dto ->
            ReceiptEntity(
                receiptId = dto.receiptId,
                customerId = dto.customerId,
                amountInCents = dto.amountInCents,
                gatewayName = dto.gatewayName,
                createdAtMillis = timeProvider.nowMillis(),
            )
        })
    }
}</pre>
          </div>
          <p>This longer example shows the mapping layers on purpose: remote DTOs do not have to be your Room entity, and neither one has to be your stable domain model. The repository is the right place to keep those conversions visible.</p>
        </div>

        <div class="tab-content" data-tab-panel="di">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Dependency graph + worker</div><strong>Hilt module and WorkManager</strong></div>
              <button class="copy-btn" data-copy-target="android-complete-di-code">Copy snippet</button>
            </div>
            <pre id="android-complete-di-code">@Module
@InstallIn(SingletonComponent::class)
object CheckoutModule {
    @Provides
    fun provideCheckoutRepository(
        api: CheckoutApi,
        dao: ReceiptDao,
    ): CheckoutRepository = DefaultCheckoutRepository(api, dao, TimeProvider())

    @Provides
    fun provideChargeCheckoutUseCase(
        repository: CheckoutRepository,
    ): ChargeCheckoutUseCase = ChargeCheckoutUseCase(repository)
}

@HiltWorker
class ReceiptSyncWorker @AssistedInject constructor(
    @Assisted appContext: Context,
    @Assisted params: WorkerParameters,
    private val repository: CheckoutRepository,
) : CoroutineWorker(appContext, params) {
    override suspend fun doWork(): Result {
        return try {
            repository.refreshReceipts()
            Result.success()
        } catch (t: Throwable) {
            Result.retry()
        }
    }
}</pre>
          </div>
        </div>

        <div class="tab-content" data-tab-panel="tests">
          <div class="code-card">
            <div class="code-head">
              <div><div class="kicker">Focused testing</div><strong>ViewModel and use-case tests</strong></div>
              <button class="copy-btn" data-copy-target="android-complete-tests-code">Copy snippet</button>
            </div>
            <pre id="android-complete-tests-code">class CheckoutViewModelTest {
    @Test
    fun \`emits receipt on successful charge\`() = runTest {
        val chargeRequest = ChargeRequest("cust-1", "tok-1", 2500)
        val receipt = PaymentReceipt("rcpt-1", "cust-1", 2500, "stripe", 123456789L)
        val repository = TestCheckoutRepository(chargeResponse = receipt)
        val useCase = ChargeCheckoutUseCase(repository)
        val viewModel = CheckoutViewModel(useCase, ObserveReceiptsUseCase(repository))

        viewModel.state.test {
            viewModel.onPayClicked(chargeRequest)
            advanceUntilIdle()

            val states = awaitItem()
            assertTrue(states.isLoading)
            val updated = awaitItem()
            assertFalse(updated.isLoading)
            assertEquals(receipt, updated.lastReceipt)
        }
    }
}</pre>
          </div>
        </div>
      `),
      panel('Confusing places explained', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>Why put UI state in the ViewModel?</h3>
            <p>Because the ViewModel owns screen orchestration and lifecycle-aware state. The repository should own shared data coordination, not temporary screen rendering state.</p>
          </div>
          <div class="compare-card do">
            <h3>Why does the repository own Room + Retrofit coordination?</h3>
            <p>Because that is the data boundary. If the ViewModel does it directly, your screen starts mixing UI logic with infrastructure policy.</p>
          </div>
          <div class="compare-card do">
            <h3>What exactly is Retrofit doing then?</h3>
            <p>Retrofit is the HTTP client boundary. It knows endpoints, verbs, serialization, and DTO shapes. It should not decide refresh timing, caching strategy, or how Room and UI state line up.</p>
          </div>
          <div class="compare-card do">
            <h3>What exactly is the DAO doing then?</h3>
            <p>The DAO is the Room-facing query surface. It knows how to insert, update, and query entities. It should not decide cache staleness, sync timing, or which screen gets refreshed.</p>
          </div>
          <div class="compare-card do">
            <h3>Why reuse repository logic in the worker?</h3>
            <p>Because WorkManager is only a background entry point. It should not duplicate networking and persistence rules that the repository already owns.</p>
          </div>
          <div class="compare-card dont">
            <h3>What not to do</h3>
            <p>Do not let Composables or Fragments call Retrofit and Room directly just because the app is still small.</p>
          </div>
        </div>
      `),
      panel('DAO deep dive: one responsibility in the bigger Android pipeline', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>DAO job</h3>
            <p>Run Room queries, expose entity flows, insert/update/delete rows, and stay close to database structure.</p>
          </div>
          <div class="compare-card do">
            <h3>Repository job</h3>
            <p>Coordinate DAO + API + mapping + timestamps + cache policy so the rest of the app sees one coherent data contract.</p>
          </div>
          <div class="compare-card dont">
            <h3>Common mistake</h3>
            <p>Treat the DAO as if it were the repository, then let ViewModels call it directly because it looks “simpler.” That skips the place where sync and mapping rules should live.</p>
          </div>
        </div>
      `),
      panel('Retrofit deep dive: one responsibility in the bigger Android pipeline', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>Retrofit job</h3>
            <p>Declare endpoints, request bodies, query params, serialization, and remote DTO shapes for HTTP calls.</p>
          </div>
          <div class="compare-card do">
            <h3>Repository job around Retrofit</h3>
            <p>Decide when to call those endpoints, how to map responses, whether to persist them, and how the rest of the feature should observe results.</p>
          </div>
          <div class="compare-card dont">
            <h3>Common mistake</h3>
            <p>Letting ViewModels or Composables call Retrofit directly because “it is only one endpoint.” That bypasses the place where refresh, cache, and mapping policy should live.</p>
          </div>
        </div>
      `),
      panel('Extension task: add receipt filtering without breaking the Android architecture', teachingTask({
        task: 'Add receipt filtering by date range and payment status without breaking the Android architecture. The goal is to keep selected filters in UI state, represent filtering as a business action, and let the repository decide whether filters are applied locally, remotely, or both.',
        thinkFirst: [
          'Which parts of the filter are temporary screen state?',
          'Which part is the business action of loading filtered receipts?',
          'Who should decide whether the filter becomes a Room query, a Retrofit request, or a combined strategy?'
        ],
        codeId: 'platform-android-filter-solution',
        codeTitle: 'Filtering flow with UI state in ViewModel and query strategy in repository',
        code: `data class ReceiptFilter(
    val dateRange: ClosedRange<Long>?,
    val status: PaymentStatus?,
)

data class CheckoutUiState(
    val selectedFilter: ReceiptFilter = ReceiptFilter(null, null),
    val receipts: List<PaymentReceipt> = emptyList(),
)

class ObserveFilteredReceiptsUseCase @Inject constructor(
    private val repository: CheckoutRepository,
) {
    operator fun invoke(filter: ReceiptFilter): Flow<List<PaymentReceipt>> {
        return repository.observeFilteredReceipts(filter)
    }
}

@HiltViewModel
class CheckoutViewModel @Inject constructor(
    private val observeFilteredReceipts: ObserveFilteredReceiptsUseCase,
) : ViewModel() {
    private val _state = MutableStateFlow(CheckoutUiState())
    val state: StateFlow<CheckoutUiState> = _state

    fun onFilterChanged(filter: ReceiptFilter) {
        _state.update { it.copy(selectedFilter = filter) }

        viewModelScope.launch {
            observeFilteredReceipts(filter).collect { receipts ->
                _state.update { it.copy(receipts = receipts) }
            }
        }
    }
}`,
        explanation: [
          {
            title: 'Selected filter belongs to UI state',
            body: 'The currently chosen chips, date range, or status are screen-specific concerns, so they belong in the ViewModel state.'
          },
          {
            title: 'Filtering still becomes a use case',
            body: 'A named use case such as <code>ObserveFilteredReceiptsUseCase</code> keeps the feature speaking in business actions rather than raw DAO/API calls.'
          },
          {
            title: 'Repository owns query strategy',
            body: 'Only the repository should decide whether the filter becomes a local Room query, a remote API request, or a combined local/remote coordination strategy.'
          }
        ],
        pipeline: [
          'User changes filter controls on the screen.',
          'ViewModel stores the filter in UI state and triggers a filtering use case.',
          'Use case asks the repository for filtered data.',
          'Repository coordinates Room/Retrofit strategy and returns stable domain models.',
          'ViewModel exposes the new filtered list to the UI.'
        ],
        spring: [
          'The backend analogue is query parameters mapped at the controller boundary, then passed into a query use case.',
          'Application services should express filtering in business language while repositories/adapters handle SQL or provider-specific details.',
          'Do not let controllers become the owners of SQL-style filtering logic.'
        ],
        android: [
          'This is the recommended split: filter widgets and current selection in ViewModel state, query strategy in the repository, Room/Retrofit hidden behind repository methods.',
          'DAO may expose local filtered queries, but the repository still decides when that is enough vs when remote refresh is needed.',
          'ViewModel should not construct SQL/Retrofit filter plumbing directly.'
        ],
        mistakes: [
          'Putting selected filter chips or date range into a singleton repository field.',
          'Letting the ViewModel decide Room vs Retrofit strategy directly.',
          'Treating local query syntax as if it were UI logic.'
        ],
        better: 'This solution is better because it keeps screen state, business action, and data strategy separate. That makes filtered queries easier to evolve from local-only to local-plus-remote without rewriting the UI layer.'
      })),
      panel('Extension task: add a DAO-backed favorites flag', teachingTask({
        task: 'Add a “favorite receipt” feature. The strict design goal is to keep the DAO responsible for the concrete Room update, the repository responsible for merge and mapping strategy, the use case responsible for the business action, and the ViewModel responsible for user interaction and UI state.',
        thinkFirst: [
          'Which layer should perform the actual SQL-style favorite update?',
          'Which layer should decide how favorite state interacts with remote refresh and domain mapping?',
          'What should the ViewModel do besides trigger the action and update UI state?'
        ],
        codeId: 'platform-android-favorites-solution',
        codeTitle: 'Favorite toggle with DAO write, repository coordination, and use-case intent',
        code: `@Dao
interface ReceiptDao {
    @Query("UPDATE receipts SET isFavorite = :isFavorite WHERE receiptId = :receiptId")
    suspend fun updateFavorite(receiptId: String, isFavorite: Boolean)
}

class ToggleFavoriteReceiptUseCase @Inject constructor(
    private val repository: CheckoutRepository,
) {
    suspend operator fun invoke(receiptId: String, isFavorite: Boolean) {
        // Business action name stays explicit.
        repository.toggleFavoriteReceipt(receiptId, isFavorite)
    }
}

class DefaultCheckoutRepository(
    private val dao: ReceiptDao,
) : CheckoutRepository {
    override suspend fun toggleFavoriteReceipt(receiptId: String, isFavorite: Boolean) {
        // Repository owns coordination and future merge rules.
        dao.updateFavorite(receiptId, isFavorite)
    }
}

@HiltViewModel
class CheckoutViewModel @Inject constructor(
    private val toggleFavoriteReceipt: ToggleFavoriteReceiptUseCase,
) : ViewModel() {
    fun onFavoriteClicked(receiptId: String, isFavorite: Boolean) {
        viewModelScope.launch {
            toggleFavoriteReceipt(receiptId, isFavorite)
        }
    }
}`,
        explanation: [
          {
            title: 'DAO performs the concrete update',
            body: 'The SQL-like operation belongs to the DAO because it is direct Room persistence work.'
          },
          {
            title: 'Repository keeps the coordination seam',
            body: 'Even if the first version only forwards to the DAO, the repository is still the right place for future merge rules, remote sync policy, and domain mapping consistency.'
          },
          {
            title: 'Use case keeps the action meaningful',
            body: 'A named action like <code>ToggleFavoriteReceiptUseCase</code> makes the ViewModel speak in business intent rather than data-source commands.'
          }
        ],
        pipeline: [
          'User taps the favorite icon.',
          'ViewModel triggers a toggle-favorite use case.',
          'Use case asks repository to perform the business action.',
          'Repository coordinates the change and delegates the Room update to the DAO.',
          'Observed local state updates flow back to the UI.'
        ],
        spring: [
          'The backend analogue is a thin controller calling an application service that updates favorite/bookmark state through a repository.',
          'Repository adapters should own persistence details, while the application service keeps the business action name clear.',
          'Do not let web controllers issue raw persistence commands directly.'
        ],
        android: [
          'This is a concrete DAO/repository/use-case/ViewModel split for a small but realistic feature.',
          'The same pattern scales when favorites later need sync with Retrofit or conflict resolution.',
          'ViewModel should not depend directly on DAO update queries.'
        ],
        mistakes: [
          'Calling DAO updates directly from the ViewModel because the feature seems tiny.',
          'Treating repository as optional and losing the place where sync/merge logic should live later.',
          'Returning Room entities directly to UI logic as if they were already presentation-ready.'
        ],
        better: 'This solution is better because it preserves the architecture even for a small feature. Small features become large features over time, and this structure gives you a safe place to grow without rewiring the UI layer later.'
      }))
    ]
  }
];
