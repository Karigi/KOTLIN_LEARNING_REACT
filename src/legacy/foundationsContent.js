import { hero, panel, teachingTask } from './contentBuilders';

export const foundationViews = [
  {
    id: 'learning-path',
    title: 'Learning path',
    navLabel: 'Learning path',
    group: 'Foundations',
    level: 'Beginner',
    time: '8 min',
    summary: 'A study roadmap that shows how to move from first-principles DI to richer backend and Android feature design.',
    sections: [
      hero(
        'A roadmap from first-principles DI to real production architecture',
        ['Foundation first', 'Progressive depth', 'Backend ready', 'Android ready'],
        `
          <p>This course is designed to take you from <strong>simple constructor injection</strong> all the way to <strong>feature bundles, composition roots, container lifetimes, Spring Boot modules, and Android architecture</strong>.</p>
          <div class="good">
            <div class="callout-title">Recommended study order</div>
            <div>Start with the welcome-message lessons first. They teach the DI mechanics with low complexity. Then move into the billing lessons, which add stronger boundaries, shared state, hidden adapters, and real-world assembly trade-offs.</div>
          </div>
        `
      ),
      panel('Roadmap for mastering the course', `
        <div class="roadmap-grid">
          <div class="roadmap-step">
            <div class="roadmap-number">1</div>
            <div>
              <h3>Understand dependencies</h3>
              <p>Learn what a dependency is, why hidden construction causes tight coupling, and how constructor injection makes dependencies explicit.</p>
            </div>
          </div>
          <div class="roadmap-step">
            <div class="roadmap-number">2</div>
            <div>
              <h3>Practice swappability and testability</h3>
              <p>Swap email for SMS, or a real sender for a fake sender. That is the first practical payoff of DI.</p>
            </div>
          </div>
          <div class="roadmap-step">
            <div class="roadmap-number">3</div>
            <div>
              <h3>Learn composition roots</h3>
              <p>Move object creation to the program edge and wire classes together in one place.</p>
            </div>
          </div>
          <div class="roadmap-step">
            <div class="roadmap-number">4</div>
            <div>
              <h3>Learn container basics</h3>
              <p>Understand registrations, resolutions, and lifetimes. A container stores the wiring rules; it does not replace good boundaries.</p>
            </div>
          </div>
          <div class="roadmap-step">
            <div class="roadmap-number">5</div>
            <div>
              <h3>Move to richer feature design</h3>
              <p>Graduate to billing-style examples with shared store state, public feature bundles, hidden adapters, and environment-aware assembly.</p>
            </div>
          </div>
          <div class="roadmap-step">
            <div class="roadmap-number">6</div>
            <div>
              <h3>Map it to real platforms</h3>
              <p>Apply the same concepts in Spring Boot modules, Android ViewModel/use-case/repository flows, and production-ready operational design.</p>
            </div>
          </div>
        </div>
      `),
      panel('Choose a study track', `
        <div class="tabs" data-tab-group="study-track">
          <button class="tab-btn active" data-tab="first-pass">First pass</button>
          <button class="tab-btn" data-tab="backend">Backend focus</button>
          <button class="tab-btn" data-tab="android">Android focus</button>
          <button class="tab-btn" data-tab="mastery">Mastery pass</button>
        </div>
        <div class="tab-content active" data-tab-panel="first-pass">
          <ol class="lesson-checklist">
            <li>Read <strong>Learning path</strong>.</li>
            <li>Study the welcome-message lessons: no DI, constructor DI, fakes, and container basics.</li>
            <li>Move into <strong>Public API</strong>, <strong>Hidden internals</strong>, and <strong>Container and roots</strong>.</li>
            <li>Finish with <strong>Pipelines</strong> and <strong>Decision guide</strong>.</li>
          </ol>
        </div>
        <div class="tab-content" data-tab-panel="backend">
          <ol class="lesson-checklist">
            <li>Master the welcome-message lessons first.</li>
            <li>Focus heavily on <strong>Decision guide</strong>, <strong>Real-life scenarios</strong>, <strong>Spring Boot</strong>, and <strong>Production readiness</strong>.</li>
            <li>Pay extra attention to shared state, retries, redaction, configuration, and idempotency.</li>
          </ol>
        </div>
        <div class="tab-content" data-tab-panel="android">
          <ol class="lesson-checklist">
            <li>Master constructor injection and fake-based testing.</li>
            <li>Study <strong>Decision guide</strong>, <strong>Android</strong>, and <strong>Real-life scenarios</strong>.</li>
            <li>Focus on ViewModel boundaries, repository ownership, cache scope, and WorkManager/background coordination.</li>
          </ol>
        </div>
        <div class="tab-content" data-tab-panel="mastery">
          <ol class="lesson-checklist">
            <li>Revisit the course as a design system rather than a set of examples.</li>
            <li>Compare the welcome sample and billing sample side by side.</li>
            <li>Use the mastery pages as a <strong>progressive challenge path</strong>: diagnose, untangle confusion, translate to backend/Android, then review like an architect.</li>
            <li>Translate one real feature from your own backend or Android app into these boundaries.</li>
            <li>For Android specifically, pay close attention to <strong>repository vs DAO</strong> responsibilities and worker reuse.</li>
            <li>Review anti-patterns and production-readiness before implementation.</li>
          </ol>
        </div>
      `),
      panel('Glossary you will keep using', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>Dependency</h3>
            <p>A collaborator one class needs in order to do its job.</p>
          </div>
          <div class="compare-card do">
            <h3>Constructor injection</h3>
            <p>Passing dependencies into the constructor instead of constructing them internally.</p>
          </div>
          <div class="compare-card do">
            <h3>Composition root</h3>
            <p>The program edge where objects are created and wired together.</p>
          </div>
          <div class="compare-card do">
            <h3>Registration / binding</h3>
            <p>Telling a container what to build for a given type.</p>
          </div>
          <div class="compare-card do">
            <h3>Resolution</h3>
            <p>Asking a container to return an object according to stored rules.</p>
          </div>
          <div class="compare-card do">
            <h3>Lifetime</h3>
            <p>How long created objects live: singleton, transient, or scoped.</p>
          </div>
        </div>
      `)
    ]
  },
  {
    id: 'welcome-foundations',
    title: 'Welcome foundations',
    navLabel: 'Welcome foundations',
    group: 'Foundations',
    level: 'Beginner',
    time: '15 min',
      sampleSource: 'sample10.txt + sample9.txt',
      summary: 'A simpler welcome-message domain that teaches dependencies, hidden construction, abstractions, constructor injection, and why setup code should stay separate from business flow, now reinforced with a much more detailed password-reset example.',
    sections: [
      hero(
        'Learn DI in a simpler domain before the richer billing example',
        ['Beginner-friendly', 'No DI vs DI', 'Simple domain'],
        `
          <p>The welcome-message sample is intentionally easier than the billing sample. It strips away payment security, hidden gateway rules, and larger object graphs so you can stare directly at the core DI question: <strong>who should create the collaborators, and who should simply use them?</strong></p>
          <p>If the billing course ever feels like too many moving pieces at once, come back here. This lesson reduces the idea down to one user, one message, one sender, and one service that coordinates the flow.</p>
          <div class="note">
            <div class="callout-title">Why this matters</div>
            <div>If you fully understand the welcome sample, the billing sample will feel like an expansion of the same ideas rather than a completely different topic. The domain changes, but the DI mechanics stay the same.</div>
          </div>
        `
      ),
      panel('The domain model and dependencies', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3><code>UserProfile</code></h3>
            <p>A plain domain object containing the user name and a generic contact destination.</p>
          </div>
          <div class="compare-card do">
            <h3><code>WelcomeMessageBuilder</code></h3>
            <p>The thing responsible for turning a user into welcome-message text.</p>
          </div>
          <div class="compare-card do">
            <h3><code>NotificationSender</code></h3>
            <p>The thing responsible for delivering the message, whether email, SMS, or a fake test sender.</p>
          </div>
          <div class="compare-card do">
            <h3><code>WelcomeService</code></h3>
            <p>The coordinator. It should orchestrate the work, not secretly decide which builder or sender gets created.</p>
          </div>
        </div>
        <div class="good">
          <div class="callout-title">Tiny but important mental model</div>
          <div>Think in <strong>jobs</strong>, not in code syntax first. One object represents the user, one object writes the message text, one object delivers it, and one object coordinates the flow. DI becomes clearer when you first understand those jobs in plain English.</div>
        </div>
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 8 concept</div><strong>Small domain model</strong></div>
            <button class="copy-btn" data-copy-target="welcome-userprofile-code">Copy snippet</button>
          </div>
          <pre id="welcome-userprofile-code">data class UserProfile(
    val name: String,
    val contact: String,
)</pre>
        </div>
      `),
      panel('Analogy: a greeting-card desk in a shop', `
        <div class="grid grid-2">
          <div class="card">
            <div class="key">Who is who?</div>
            <ul>
              <li><strong>UserProfile</strong> is the customer card with a name and destination.</li>
              <li><strong>WelcomeMessageBuilder</strong> is the staff member who writes the greeting text.</li>
              <li><strong>NotificationSender</strong> is the courier/email system that actually delivers it.</li>
              <li><strong>WelcomeService</strong> is the front-desk coordinator who tells the right helper what to do next.</li>
            </ul>
          </div>
          <div class="card">
            <div class="key">Where DI enters</div>
            <p>The front-desk coordinator should <strong>not</strong> walk to the back room and hire a writer and courier every time a customer arrives. A manager or setup step should decide which writer and courier are available, then hand them to the coordinator.</p>
            <p>That manager/setup step is the same idea you later call the <strong>composition root</strong>.</p>
          </div>
        </div>
      `),
      panel('No DI version: what goes wrong', `
        <div class="tabs" data-tab-group="welcome-no-di">
          <button class="tab-btn active" data-tab="code">Code</button>
          <button class="tab-btn" data-tab="problem">Problem</button>
          <button class="tab-btn" data-tab="symptoms">Symptoms in real apps</button>
        </div>
        <div class="tab-content active" data-tab-panel="code">
          <pre>class WelcomeServiceNoDi {
    private val messageBuilder = DefaultWelcomeMessageBuilder()
    private val sender = ConsoleEmailSender()

    fun welcome(user: UserProfile) {
        val message = messageBuilder.build(user)
        sender.send(user.contact, message)
    }
}</pre>
        </div>
        <div class="tab-content" data-tab-panel="problem">
          <ul>
            <li>The service is tightly coupled to one concrete builder and one concrete sender.</li>
            <li>You cannot swap email for SMS without editing the service itself.</li>
            <li>You cannot easily inject a fake sender in tests because the sender is hidden inside the class.</li>
            <li>The class mixes <strong>business coordination</strong> with <strong>construction policy</strong>.</li>
            <li>The workflow is small here, but the same mistake becomes much more expensive in larger features.</li>
          </ul>
        </div>
        <div class="tab-content" data-tab-panel="symptoms">
          <ul>
            <li>In Spring Boot, controllers or services often start hardcoding helper objects directly.</li>
            <li>In Android, ViewModels or Fragments start directly constructing Retrofit clients, DAOs, and mappers.</li>
            <li>Refactoring becomes risky because changing one dependency means editing business classes instead of the wiring edge.</li>
            <li>Tests become awkward because the only way to change collaborators is to edit production code.</li>
          </ul>
        </div>
      `),
      panel('Separate the workflow from the setup choice', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>The workflow itself is fine</h3>
            <p>Build a message, then send it. That sequence is not the problem.</p>
          </div>
          <div class="compare-card dont">
            <h3>The setup location is wrong</h3>
            <p>The problem is <strong>where</strong> the builder and sender are chosen and created. In the no-DI version, that choice is trapped inside the business class.</p>
          </div>
          <div class="compare-card do">
            <h3>The DI goal</h3>
            <p>Keep the workflow in <code>WelcomeService</code>, but move the choice of builder and sender to the edge of the app.</p>
          </div>
        </div>
      `),
      panel('Pipeline comparison: no DI vs DI', `
        <div class="diagram" data-diagram-group="welcome-foundation-pipeline">
          <div class="diagram-stage">
            <div class="kicker">Tap a mode</div>
            <div class="diagram-grid cols-2">
              <button class="diagram-node active" data-diagram-target="nodi"><strong>No DI</strong><small>construction is hidden inside the class</small></button>
              <button class="diagram-node" data-diagram-target="di"><strong>Constructor DI</strong><small>construction moves outside the class</small></button>
            </div>
          </div>
          <div class="diagram-info">
            <div class="diagram-panel active" data-diagram-panel="nodi">
              <h3>No DI flow</h3>
              <div class="flow">
                <div class="node main">WelcomeServiceNoDi</div>
                <div class="arrow">creates</div>
                <div class="node private">DefaultWelcomeMessageBuilder</div>
                <div class="arrow">and</div>
                <div class="node private">ConsoleEmailSender</div>
              </div>
              <p>Because the service creates its own collaborators, the class is locked to those choices.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="di">
              <h3>Constructor DI flow</h3>
              <div class="flow">
                <div class="node root">composition root / caller</div>
                <div class="arrow">creates</div>
                <div class="node factory">builder + sender</div>
                <div class="arrow">injects into</div>
                <div class="node public">WelcomeService</div>
              </div>
              <p>The service now only coordinates work. Swapping implementations happens outside the service, where assembly belongs.</p>
            </div>
          </div>
        </div>
      `),
      panel('Practice task: redesign a password-reset flow using the same DI idea', teachingTask({
        task: 'Use the richer <code>sample9</code> approach to redesign password reset properly. The service should no longer only generate a token and send a message. It should coordinate a fuller reset pipeline: generate token, store token, build reset link, build message, choose destination through a clear rule, send the message, and return a safe summary instead of leaking the secret token. Your answer should also show how a separate read-side query service can inspect stored records without turning the write-side service into a giant god object.',
        thinkFirst: [
          'Which responsibilities are being mixed if one class both generates the token and formats the final message?',
          'What is the difference between generating a token and storing a token, and why should those be separate collaborators?',
          'Where should the decision “email destination vs SMS destination” live: inside the sender, inside the service, or near the user reset profile?',
          'Why is returning a raw token or raw reset link dangerous even in a teaching app?',
          'If you later want to inspect stored records, should you force the write-side service to expose that method, or create a dedicated read-side query object?'
        ],
        codeId: 'foundation-password-reset-solution',
        codeTitle: 'Sample 9–style password reset with constructor injection, safe token handling, storage, query side, and explicit composition',
        code: `data class UserAccountResetProfile(
    val name: String,
    val email: String,
    val phoneNumber: String? = null,
) {
    init {
        // Fail fast so invalid user reset data does not enter the flow.
        require(name.isNotBlank()) { "name must not be blank" }
        require(email.isNotBlank()) { "email must not be blank" }
    }

    fun destinationFor(channel: ResetChannel): String {
        // This lesson keeps the channel -> destination rule on the reset-focused user profile.
        return when (channel) {
            ResetChannel.EMAIL -> email
            ResetChannel.SMS -> requireNotNull(phoneNumber) {
                "User '$name' does not have a phone number, so SMS reset cannot be used."
            }
        }
    }
}

enum class ResetChannel {
    EMAIL,
    SMS,
}

data class PasswordResetToken private constructor(
    private val rawValue: String,
) {
    init {
        // Even secret values should still be validated.
        require(rawValue.isNotBlank()) { "rawValue must not be blank" }
    }

    fun valueForLink(): String = rawValue

    fun preview(): String = rawValue.take(8) + "..."

    override fun toString(): String {
        // Printing the whole object never reveals the secret.
        return "PasswordResetToken(value=<redacted>)"
    }

    companion object {
        fun fromRaw(rawValue: String): PasswordResetToken {
            return PasswordResetToken(rawValue = rawValue)
        }
    }
}

data class StoredResetTokenRecord(
    val userEmail: String,
    val issuedAt: Instant,
    val expiresAt: Instant,
    private val token: PasswordResetToken,
) {
    override fun toString(): String {
        // Stored records can be inspected safely without exposing the secret token.
        return "StoredResetTokenRecord(userEmail=$userEmail, issuedAt=$issuedAt, expiresAt=$expiresAt, token=<redacted>)"
    }
}

data class PasswordResetDispatch(
    val userEmail: String,
    val channel: ResetChannel,
    val destination: String,
    val tokenPreview: String,
    val redactedResetLink: String,
)

interface ResetTokenGenerator {
    fun generate(user: UserAccountResetProfile): PasswordResetToken
}

interface ResetTokenStore {
    fun save(
        user: UserAccountResetProfile,
        token: PasswordResetToken,
        issuedAt: Instant,
        expiresAt: Instant,
    )

    fun findByEmail(email: String): StoredResetTokenRecord?

    fun allResetRecords(): Map<String, StoredResetTokenRecord>
}

interface ResetRecordQueryService {
    fun showStoredTokenRecord(email: String): StoredResetTokenRecord?

    fun showAllStoredTokenRecords(): Map<String, StoredResetTokenRecord>
}

interface ResetLinkBuilder {
    fun build(token: PasswordResetToken): String
}

interface ResetMessageBuilder {
    fun build(user: UserAccountResetProfile, resetLink: String): String
}

interface ResetMessageSender {
    val channel: ResetChannel

    fun send(destination: String, message: String)
}

class PasswordResetService(
    // Every collaborator is visible in the constructor, so nothing important is hidden.
    private val tokenGenerator: ResetTokenGenerator,
    private val tokenStore: ResetTokenStore,
    private val linkBuilder: ResetLinkBuilder,
    private val messageBuilder: ResetMessageBuilder,
    private val messageSender: ResetMessageSender,
    private val clock: Clock = Clock.systemUTC(),
    private val tokenTtl: Duration = Duration.ofMinutes(15),
) {
    init {
        // A zero or negative TTL would make the feature logically broken.
        require(!tokenTtl.isNegative && !tokenTtl.isZero) {
            "tokenTtl must be greater than zero"
        }
    }

    fun requestPasswordReset(user: UserAccountResetProfile): PasswordResetDispatch {
        // 1) Generate the secret token.
        val token = tokenGenerator.generate(user)

        // 2) Define the time window in which the token is valid.
        val issuedAt = Instant.now(clock)
        val expiresAt = issuedAt.plus(tokenTtl)

        // 3) Persist the token before sending anything.
        tokenStore.save(
            user = user,
            token = token,
            issuedAt = issuedAt,
            expiresAt = expiresAt,
        )

        // 4) Convert the token into a link the user can follow.
        val resetLink = linkBuilder.build(token)

        // 5) Turn that link into human-readable content.
        val message = messageBuilder.build(user, resetLink)

        // 6) Resolve the destination that matches the sender's channel.
        val destination = user.destinationFor(messageSender.channel)

        // 7) Send the final message through the side-effect boundary.
        messageSender.send(destination = destination, message = message)

        // 8) Return a safe summary rather than the raw token or raw link.
        return PasswordResetDispatch(
            userEmail = user.email,
            channel = messageSender.channel,
            destination = destination,
            tokenPreview = token.preview(),
            redactedResetLink = redactResetLink(resetLink),
        )
    }

    private fun redactResetLink(link: String): String {
        val tokenParameter = "token="
        val tokenIndex = link.indexOf(tokenParameter)

        if (tokenIndex == -1) {
            return "<redacted-link>"
        }

        val prefix = link.substring(0, tokenIndex + tokenParameter.length)
        return "$prefix<redacted>"
    }
}

class UuidResetTokenGenerator : ResetTokenGenerator {
    override fun generate(user: UserAccountResetProfile): PasswordResetToken {
        // The token-generation policy is replaceable because it is injected.
        return PasswordResetToken.fromRaw(UUID.randomUUID().toString())
    }
}

class InMemoryResetTokenStore : ResetTokenStore {
    private val recordsByEmail = mutableMapOf<String, StoredResetTokenRecord>()

    override fun save(
        user: UserAccountResetProfile,
        token: PasswordResetToken,
        issuedAt: Instant,
        expiresAt: Instant,
    ) {
        recordsByEmail[user.email] = StoredResetTokenRecord(
            userEmail = user.email,
            issuedAt = issuedAt,
            expiresAt = expiresAt,
            token = token,
        )
    }

    override fun findByEmail(email: String): StoredResetTokenRecord? = recordsByEmail[email]

    override fun allResetRecords(): Map<String, StoredResetTokenRecord> = recordsByEmail.toMap()
}

class StoreBackedResetRecordQueryService(
    private val tokenStore: ResetTokenStore,
) : ResetRecordQueryService {
    override fun showStoredTokenRecord(email: String): StoredResetTokenRecord? {
        return tokenStore.findByEmail(email)
    }

    override fun showAllStoredTokenRecords(): Map<String, StoredResetTokenRecord> {
        return tokenStore.allResetRecords()
    }
}

class DefaultResetLinkBuilder(
    private val baseResetUrl: String,
) : ResetLinkBuilder {
    override fun build(token: PasswordResetToken): String {
        return "$baseResetUrl?token=\${token.valueForLink()}"
    }
}

class EmailResetMessageBuilder : ResetMessageBuilder {
    override fun build(user: UserAccountResetProfile, resetLink: String): String {
        return """
            Hello \${user.name},
            We received a request to reset the password for your account.
            Use the secure link below to choose a new password:
            $resetLink
        """.trimIndent()
    }
}

class ConsoleEmailResetMessageSender : ResetMessageSender {
    override val channel: ResetChannel = ResetChannel.EMAIL

    override fun send(destination: String, message: String) {
        println("sending password reset to $destination")
        println(message)
    }
}

fun createEmailPasswordResetService(
    tokenStore: ResetTokenStore,
    baseResetUrl: String = "https://example.com/reset-password",
    clock: Clock = Clock.systemUTC(),
): PasswordResetService {
    // Composition root: choose implementations here, not inside PasswordResetService.
    return PasswordResetService(
        tokenGenerator = UuidResetTokenGenerator(),
        tokenStore = tokenStore,
        linkBuilder = DefaultResetLinkBuilder(baseResetUrl = baseResetUrl),
        messageBuilder = EmailResetMessageBuilder(),
        messageSender = ConsoleEmailResetMessageSender(),
        clock = clock,
    )
}

fun createResetRecordQueryService(
    tokenStore: ResetTokenStore,
): ResetRecordQueryService {
    // Dedicated read side: inspect stored history without bloating the write-side service.
    return StoreBackedResetRecordQueryService(tokenStore)
}`,
        explanation: [
          {
            title: '<code>UserAccountResetProfile</code> is intentionally feature-specific, not a pretend universal user model',
            body: 'This is one of the biggest improvements from <code>sample9</code>. The code no longer uses a vague user type. It uses a reset-focused profile that owns the data the reset flow actually needs, such as email, optional phone number, and the small rule for resolving a destination from a channel.'
          },
          {
            title: '<code>ResetChannel</code> names possibilities, but does not own routing logic',
            body: 'The enum says <em>what kind of channel exists</em>, not <em>how a particular user should be routed</em>. That distinction is important. A channel enum should describe choices like email vs SMS. It should not quietly become a god object that also knows every user destination rule.'
          },
          {
            title: '<code>PasswordResetToken</code> is a value object with controlled secret access',
            body: 'This is far stronger than using a raw <code>String</code> token everywhere. The raw token value stays private, the link builder can deliberately ask for it through <code>valueForLink()</code>, and <code>toString()</code> is redacted so accidental printing does not leak the secret.'
          },
          {
            title: '<code>ResetTokenGenerator</code> and <code>ResetTokenStore</code> are separate because generation and persistence are different jobs',
            body: 'Generating a token answers “how do I make a new token?” Storing a token answers “where do I keep it so later verification or inspection can happen?” When one class tries to do both without clarity, the design becomes harder to swap, harder to test, and harder to reason about.'
          },
          {
            title: '<code>PasswordResetService</code> now coordinates an eight-step pipeline instead of a tiny three-line flow',
            body: 'The service does more than the old example: it generates the token, computes the validity window, persists the token, builds the reset link, builds the final message, resolves the correct destination, sends the message, and returns a safe summary. This is much closer to what a real password-reset use case actually coordinates.'
          },
          {
            title: '<code>clock</code> and <code>tokenTtl</code> are injected because time is also a dependency',
            body: 'This is a subtle but very important DI lesson. Time is not “free.” If your service depends on the current time to calculate expiry, then time is part of the behavior. Injecting the clock makes tests deterministic, and injecting TTL makes validity policy explicit instead of hidden deep inside the service.'
          },
          {
            title: '<code>ResetRecordQueryService</code> is the read side, separate from the write side',
            body: 'This is one of the strongest teaching points in <code>sample9</code>. Instead of forcing <code>PasswordResetService</code> to also expose record history, the design creates a dedicated query service backed by the same store. That keeps write responsibilities and read responsibilities separated while still allowing shared history.'
          },
          {
            title: 'The composition root chooses concrete implementations and shared state deliberately',
            body: 'The function <code>createEmailPasswordResetService(...)</code> makes the implementation choices at the edge: UUID token generator, in-memory store, link builder, message builder, sender, and clock. Because the store is passed in, the caller can decide whether different services should share one store or use separate stores.'
          }
        ],
        pipeline: [
          'Boundary layer receives reset input and turns it into a clean <code>UserAccountResetProfile</code> or request model.',
          'The boundary calls <code>PasswordResetService.requestPasswordReset(...)</code> as the public business capability.',
          'The service asks <code>ResetTokenGenerator</code> for a new token object.',
          'The service calculates <code>issuedAt</code> and <code>expiresAt</code> using the injected <code>Clock</code> and <code>Duration</code>.',
          'The service stores the token through <code>ResetTokenStore</code> before sending anything outward.',
          'The service builds the reset link, then builds the final user-facing message, then resolves the destination for the sender channel.',
          'The service hands the final destination and message to <code>ResetMessageSender</code>, which performs the side effect.',
          'The service returns <code>PasswordResetDispatch</code>, a safe summary object that exposes useful confirmation data without leaking the full token or raw link.',
          'If a caller later wants to inspect stored records, it should ask <code>ResetRecordQueryService</code>, not overload the write-side service with a second responsibility.'
        ],
        spring: [
          'Map the reset endpoint to a thin controller that validates HTTP input and translates it into a reset request or reset profile, then calls <code>PasswordResetService</code>.',
          'Wire <code>PasswordResetService</code>, token generator, store, link builder, message builder, sender, and clock inside a <code>@Configuration</code> class rather than constructing them inside the service.',
          'Model the token store as a repository or persistence adapter, and keep email/SMS provider SDK details behind <code>ResetMessageSender</code> implementations.',
          'If you need admin or support tooling to inspect reset history, expose a separate query use case or facade instead of stuffing query methods into the write-side service.',
          'For production, store hashed tokens rather than raw tokens, but keep the same DI boundaries and pipeline ownership.'
        ],
        android: [
          'Treat the screen or ViewModel as the boundary that gathers email/username/channel input and calls a reset-password use case.',
          'Keep token request/network delivery logic in a repository or gateway wrapper, not inside the ViewModel. The ViewModel should coordinate UI state, not generate tokens or construct senders.',
          'If the app locally remembers reset attempts or drafts, keep that state in the correct owner: ViewModel for screen state, repository/data source for durable data.',
          'If you later show reset-attempt history in the app, mirror the same idea from <code>sample9</code>: one read-side query abstraction instead of bloating the write-side use case.',
          'Map the sender boundary to a repository/remote data source, and map the injected <code>Clock</code> idea to deterministic dispatchers/time providers in tests when time-sensitive behavior exists.'
        ],
        mistakes: [
          'Letting <code>PasswordResetService</code> secretly construct the token generator, sender, or store, which hides important dependencies again.',
          'Using one raw <code>String</code> token everywhere so it leaks into logs, summaries, and debug printing accidentally.',
          'Combining token generation, token storage, link building, and message formatting into one oversized helper or service.',
          'Making the sender figure out a user destination by inspecting the whole user object, which mixes transport behavior with routing/domain rules.',
          'Returning the raw reset link or raw token to callers when a safe summary would communicate success without leaking secrets.',
          'Adding “show all records” directly to <code>PasswordResetService</code> instead of using a separate query service backed by the same store.'
        ],
        better: 'This <code>sample9</code>-style solution is better than the earlier smaller reset example because it teaches the whole architecture job, not only the first DI step. It shows explicit collaborators, secret handling, time control, read/write separation, safe return models, destination resolution, and store-sharing decisions. In other words, it teaches constructor DI as a real design tool instead of as a tiny constructor-only trick.'
      })),
      panel('Sample 9 symbol map: what every reset-password piece is doing', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Type / function</th><th>Main responsibility</th><th>Why it exists separately</th><th>Common confusion to avoid</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>UserAccountResetProfile</code></td>
                <td>Carry reset-specific user data and resolve a destination for a channel</td>
                <td>Keeps reset-focused routing knowledge near the reset-focused user data</td>
                <td>Do not assume every user model in the whole app must expose <code>destinationFor(...)</code></td>
              </tr>
              <tr>
                <td><code>ResetChannel</code></td>
                <td>Name the allowed delivery channels</td>
                <td>Separates “which channel exists” from “how to route a user”</td>
                <td>Do not turn the enum into a hidden god object with all routing rules</td>
              </tr>
              <tr>
                <td><code>PasswordResetToken</code></td>
                <td>Represent the secret token as a controlled value object</td>
                <td>Protects raw token access and redacts accidental printing</td>
                <td>Do not pass raw token strings everywhere without protection</td>
              </tr>
              <tr>
                <td><code>StoredResetTokenRecord</code></td>
                <td>Represent what the store keeps</td>
                <td>Makes stored history explicit and inspectable without exposing the secret value casually</td>
                <td>Do not print stored records as if their secret fields are harmless</td>
              </tr>
              <tr>
                <td><code>PasswordResetDispatch</code></td>
                <td>Return a safe summary after the reset request is handled</td>
                <td>Callers often need confirmation, not the raw secret</td>
                <td>Do not return the full token or full link unless absolutely necessary</td>
              </tr>
              <tr>
                <td><code>ResetTokenGenerator</code></td>
                <td>Create new tokens</td>
                <td>Generation policy should be swappable and testable</td>
                <td>Do not merge generation with message formatting</td>
              </tr>
              <tr>
                <td><code>ResetTokenStore</code></td>
                <td>Persist and query issued tokens</td>
                <td>Storage is a different job from generation and sending</td>
                <td>Do not hide persistence inside the service as an afterthought</td>
              </tr>
              <tr>
                <td><code>ResetRecordQueryService</code></td>
                <td>Provide read-side access to stored reset records</td>
                <td>Keeps record inspection separate from the write-side use case</td>
                <td>Do not force every writer service to also expose history methods</td>
              </tr>
              <tr>
                <td><code>ResetLinkBuilder</code></td>
                <td>Turn a token into a reset URL</td>
                <td>Separates transport formatting from service orchestration</td>
                <td>Do not hardcode environment URL rules deep inside the service</td>
              </tr>
              <tr>
                <td><code>ResetMessageBuilder</code></td>
                <td>Turn the reset link into human-facing text</td>
                <td>Message wording is a separate concern from token creation and delivery</td>
                <td>Do not make the sender also own message wording</td>
              </tr>
              <tr>
                <td><code>ResetMessageSender</code></td>
                <td>Perform the delivery side effect</td>
                <td>Transport should stay swappable at the edge</td>
                <td>Do not make the sender responsible for user-domain routing logic</td>
              </tr>
              <tr>
                <td><code>PasswordResetService</code></td>
                <td>Coordinate the full write-side reset pipeline</td>
                <td>One place owns workflow order while collaborators own narrower jobs</td>
                <td>Do not let it become a god class that also stores, formats, routes, queries, and transports everything itself</td>
              </tr>
              <tr>
                <td><code>createEmailPasswordResetService(...)</code></td>
                <td>Manual composition root for the email variant</td>
                <td>Implementation choices belong at the edge of the app</td>
                <td>Do not hide those choices inside the service constructor</td>
              </tr>
              <tr>
                <td><code>createResetRecordQueryService(...)</code></td>
                <td>Attach a read-side object to a specific store instance</td>
                <td>Makes shared-store vs separate-store behavior explicit</td>
                <td>Do not assume creating the query object early copies the store state; it keeps a reference to the same store</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="note">
          <div class="callout-title">Three confusing but important ideas from sample 9</div>
          <ul>
            <li><strong>Write side vs read side:</strong> requesting a reset and inspecting stored reset records are related, but still different jobs.</li>
            <li><strong>Shared store vs separate stores:</strong> if two services and one query object receive the same store instance, they share history; if they receive different store instances, they do not.</li>
            <li><strong>Domain rule vs universal contract:</strong> putting <code>destinationFor(...)</code> on <code>UserAccountResetProfile</code> is a local design choice for this reset-specific lesson, not a command that every user model everywhere must do the same.</li>
          </ul>
        </div>
      `)
    ]
  },
  {
    id: 'constructor-injection',
    title: 'Constructor injection',
    navLabel: 'Constructor injection',
    group: 'Foundations',
    level: 'Beginner',
    time: '14 min',
    sampleSource: 'sample10.txt',
    summary: 'Learn how abstractions, narrow contracts, and constructor injection make the welcome flow swappable without changing the service itself.',
    sections: [
      panel('Public contracts make swappability possible', `
        <pre>interface WelcomeMessageBuilder {
    fun build(user: UserProfile): String
}

interface NotificationSender {
    fun send(destination: String, message: String)

}

interface SentMessages {
    fun showAllMessages(): List&lt;String&gt;
}</pre>
        <p>The service depends on these abstractions, not on one fixed implementation. That is what makes replacement possible.</p>
        <p><strong>Notice the split:</strong> <code>NotificationSender</code> answers “can this object send?”, while <code>SentMessages</code> answers “can this object show message history?”. Sample 8 intentionally keeps those as separate responsibilities.</p>
        <div class="good">
          <div class="callout-title">Key lesson</div>
          <div>DI is not magic. It becomes useful when the consuming class depends on a stable abstraction and receives the implementation from outside. Interfaces help you describe the job, while constructor injection helps you supply the worker.</div>
        </div>
      `),
      panel('The constructor-injected service', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 8 concept</div><strong>The clean orchestrator</strong></div>
            <button class="copy-btn" data-copy-target="welcome-service-code">Copy snippet</button>
          </div>
          <pre id="welcome-service-code">class WelcomeService(
    private val messageBuilder: WelcomeMessageBuilder,
    private val sender: NotificationSender,
) {
    fun welcome(user: UserProfile) {
        val message = messageBuilder.build(user)
        sender.send(user.contact, message)
    }
}</pre>
        </div>
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>What this class now does</h3>
            <ul>
              <li>Coordinates the welcome workflow.</li>
              <li>Uses abstractions instead of concrete infrastructure.</li>
              <li>Stays focused on business flow.</li>
            </ul>
          </div>
          <div class="compare-card dont">
            <h3>What this class no longer does</h3>
            <ul>
              <li>Chooses email vs SMS.</li>
              <li>Decides how message text is built internally.</li>
              <li>Constructs collaborators.</li>
            </ul>
          </div>
        </div>
        <p>A good analogy is a stage manager. The stage manager does not personally sew the costumes or drive the lighting truck. The stage manager coordinates the show using specialized helpers that were assigned beforehand.</p>
      `),
      panel('Why <code>SendingFeature</code> is not the dependency of <code>WelcomeService</code>', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 8 concept</div><strong>Narrow dependency vs broader bundle</strong></div>
            <button class="copy-btn" data-copy-target="sending-feature-contracts-code">Copy snippet</button>
          </div>
          <pre id="sending-feature-contracts-code">interface SentMessages {
    fun showAllMessages(): List&lt;String&gt;
}

interface SendingFeature {
    val notificationSender: NotificationSender
    val allSentMessages: SentMessages
}</pre>
        </div>
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>What <code>WelcomeService</code> truly needs</h3>
            <p>Only the narrow write-side role: <code>NotificationSender</code>.</p>
          </div>
          <div class="compare-card do">
            <h3>What setup code may want</h3>
            <p>A richer bundle like <code>SendingFeature</code>, so it can both send messages and inspect what happened afterward.</p>
          </div>
          <div class="compare-card dont">
            <h3>Common confusion</h3>
            <p>Beginners often think the bigger bundle must also be the dependency of the business service. It does not. The business service should still receive the smallest role it actually uses.</p>
          </div>
        </div>
        <div class="note">
          <div class="callout-title">Analogy</div>
          <div><code>NotificationSender</code> is like “the dispatch desk” that can send a package. <code>SendingFeature</code> is like the whole shipping office, which has both the dispatch desk and the audit notebook for checking what was sent later.</div>
        </div>
      `),
      panel('One underlying object can be viewed through two interfaces', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 8 concept</div><strong>Recording feature bundle</strong></div>
            <button class="copy-btn" data-copy-target="recording-feature-code">Copy snippet</button>
          </div>
          <pre id="recording-feature-code">class RecordingSendingFeature : SendingFeature {
    private val recordingNotificationSender = RecordingNotificationSender()

    override val notificationSender: NotificationSender = recordingNotificationSender
    override val allSentMessages: SentMessages = recordingNotificationSender
}</pre>
        </div>
        <p>This is one of the easiest places to get confused, so read it slowly: there is <strong>one concrete recorder object</strong>, but setup code exposes it through <strong>two interface views</strong>.</p>
        <ul>
          <li><code>notificationSender</code> is the write-side view.</li>
          <li><code>allSentMessages</code> is the read-side inspection view.</li>
          <li>Both point at the same underlying recorder, so what one side writes, the other side can later inspect.</li>
        </ul>
      `),
      panel('Manual wiring at the edge', `
        <div class="tabs" data-tab-group="manual-wiring-welcome">
          <button class="tab-btn active" data-tab="email">Email</button>
          <button class="tab-btn" data-tab="sms">SMS</button>
          <button class="tab-btn" data-tab="why">Why this is powerful</button>
        </div>
        <div class="tab-content active" data-tab-panel="email">
          <pre>val messageBuilder: WelcomeMessageBuilder = FriendlyWelcomeMessageBuilder()
val emailSender: NotificationSender = EmailNotificationSender()

val emailWelcomeService = WelcomeService(
    messageBuilder = messageBuilder,
    sender = emailSender,
)</pre>
        </div>
        <div class="tab-content" data-tab-panel="sms">
          <pre>val smsSender: NotificationSender = SmsNotificationSender()
val smsWelcomeService = WelcomeService(
    messageBuilder = messageBuilder,
    sender = smsSender,
)</pre>
        </div>
        <div class="tab-content" data-tab-panel="why">
          <ul>
            <li>The same service class works with multiple senders.</li>
            <li>Business logic stays stable while infrastructure changes.</li>
            <li>This is exactly the mindset used later for billing gateways, repositories, and loggers.</li>
          </ul>
        </div>
      `),
      panel('What to use / what not to use', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Question</th><th>Use</th><th>Do not use</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>How should a service receive collaborators?</td>
                <td>Constructor parameters</td>
                <td>Hardcoded construction inside the service</td>
              </tr>
              <tr>
                <td>Where should implementation choice happen?</td>
                <td>Caller / composition root</td>
                <td>Inside business methods</td>
              </tr>
              <tr>
                <td>How should a class express needs?</td>
                <td>Through abstractions and explicit parameters</td>
                <td>Through hidden global lookups or static helpers</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Practice task: refactor a report sender into constructor injection', teachingTask({
        task: 'Refactor a <code>MonthlyReportService</code> that currently constructs <code>CsvReportBuilder()</code> and <code>EmailReportSender()</code> internally. The stricter goal is to let the service describe the workflow only, while setup code chooses CSV vs PDF and email vs SFTP deliberately.',
        thinkFirst: [
          'What is the stable business workflow regardless of output format or delivery channel?',
          'Which roles should become constructor parameters because they are replaceable?',
          'Where should concrete format and delivery choices live so callers do not duplicate them?'
        ],
        codeId: 'foundation-report-refactor-solution',
        codeTitle: 'Report sending flow refactored into constructor-injected collaborators',
        code: `interface ReportBuilder {
    fun build(accountId: String): String
}

interface ReportSender {
    fun send(destination: String, content: String)
}

class MonthlyReportService(
    // The service receives the two jobs it needs instead of constructing them.
    private val reportBuilder: ReportBuilder,
    private val reportSender: ReportSender,
) {
    fun sendMonthlyReport(accountId: String, destination: String) {
        // Build the report first.
        val report = reportBuilder.build(accountId)

        // Deliver the built content through the chosen adapter.
        reportSender.send(destination, report)
    }
}

class CsvReportBuilder : ReportBuilder {
    override fun build(accountId: String): String {
        return "csv-report-for-" + accountId
    }
}

class EmailReportSender : ReportSender {
    override fun send(destination: String, content: String) {
        println("emailing report to " + destination)
        println(content)
    }
}

fun createMonthlyReportService(): MonthlyReportService {
    val builder = CsvReportBuilder()
    val sender = EmailReportSender()

    return MonthlyReportService(
        reportBuilder = builder,
        reportSender = sender,
    )
}`,
        explanation: [
          {
            title: 'The service declares two roles and nothing more',
            body: 'It needs one collaborator to create report content and another to deliver it. That separation makes the business flow visible in one glance.'
          },
          {
            title: 'The concrete format is no longer trapped in the service',
            body: 'Because the service depends on <code>ReportBuilder</code>, the same workflow can later use CSV, PDF, or XLSX without editing the business class.'
          },
          {
            title: 'The delivery channel is also replaceable',
            body: 'Email, SFTP, message bus, or a recording fake sender can all satisfy the same role. This is the testing and evolution payoff of constructor injection.'
          }
        ],
        pipeline: [
          'Boundary or job runner decides the report request and destination.',
          'It calls <code>MonthlyReportService.sendMonthlyReport()</code> as the public business action.',
          'The service asks <code>ReportBuilder</code> to create content, then asks <code>ReportSender</code> to deliver it.',
          'Assembly code chooses concrete builder and sender implementations outside the service.'
        ],
        spring: [
          'A controller, scheduler, or batch job can call the service after mapping request data.',
          'A Spring <code>@Configuration</code> class or bean wiring can choose CSV vs PDF and Email vs SFTP adapters.',
          'Use fake builders/senders in unit tests instead of booting the whole Spring context.'
        ],
        android: [
          'A ViewModel or Worker should call a report/export use case rather than constructing exporters inline.',
          'Repository or adapter layers should own storage/network/export details instead of the UI layer.',
          'If report state is screen-specific, keep progress/error state in the ViewModel, not in a singleton exporter.'
        ],
        mistakes: [
          'Assuming interfaces alone solve the problem while still constructing implementations inside the service.',
          'Letting the ViewModel/controller branch on every format and sender combination.',
          'Merging report formatting and delivery logic into one class that becomes hard to test.'
        ],
        better: 'This version is better because it stabilizes the workflow while moving policy choices outward. The service becomes easier to test, easier to swap, and easier to map to backend jobs or Android flows without rewriting the orchestration every time a format or destination changes.'
      }))
    ]
  },
  {
    id: 'testability-with-fakes',
    title: 'Testability with fakes',
    navLabel: 'Testability with fakes',
    group: 'Foundations',
    level: 'Beginner',
    time: '13 min',
    sampleSource: 'sample10.txt',
    summary: 'Use a recording fake sender to understand why constructor injection makes business code easier to test, inspect, and reason about safely.',
    sections: [
      panel('A fake sender replaces real infrastructure', `
        <pre>class RecordingNotificationSender : NotificationSender, SentMessages {
    private val sentMessages = mutableListOf<String>()

    override fun send(destination: String, message: String) {
        sentMessages += "to=$destination | message=$message"
    }

    override fun showAllMessages(): List&lt;String&gt; {
        return sentMessages.toList()
    }
}</pre>
        <p>This fake sender does not talk to real infrastructure. It stores what happened in memory so the test or lesson can inspect it later.</p>
        <div class="good">
          <div class="callout-title">Why this version is better than exposing the list directly</div>
          <div><code>sentMessages</code> stays <code>private</code>, and callers inspect the result through <code>showAllMessages()</code>. That keeps the fake easy to inspect without exposing mutable internal state carelessly.</div>
        </div>
      `),
      panel('Why <code>SentMessages</code> is separate from <code>NotificationSender</code>', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3><code>NotificationSender</code></h3>
            <p>Represents the ability to perform the action: send a message.</p>
          </div>
          <div class="compare-card do">
            <h3><code>SentMessages</code></h3>
            <p>Represents the ability to inspect recorded history afterward.</p>
          </div>
          <div class="compare-card dont">
            <h3>Why not merge them automatically?</h3>
            <p>Because many real senders can send but should not also expose in-memory history. Sample 8 separates the write responsibility and the inspection responsibility on purpose.</p>
          </div>
        </div>
        <p>Analogy: a courier can deliver parcels, but that does not automatically mean the courier personally owns the public audit log. Those are related concerns, but not identical responsibilities.</p>
      `),
      panel('Why fake dependencies matter', `
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>What you gain</h3>
            <ul>
              <li>Tests run without real email/SMS providers.</li>
              <li>You can inspect behavior after the method call.</li>
              <li>Failures become easier to reproduce and isolate.</li>
            </ul>
          </div>
          <div class="compare-card do">
            <h3>What you avoid</h3>
            <ul>
              <li>Network dependence in unit tests.</li>
              <li>Unreliable console/manual verification.</li>
              <li>Having to expose internals publicly just to make tests possible.</li>
            </ul>
          </div>
        </div>
      `),
      panel('End-to-end learning flow', `
        <div class="timeline">
          <div class="step"><strong>1.</strong> Create a fake sender that stores sent messages in memory.</div>
          <div class="step"><strong>2.</strong> Inject it into <code>WelcomeService</code>.</div>
          <div class="step"><strong>3.</strong> Call <code>welcome(user)</code>.</div>
          <div class="step"><strong>4.</strong> Inspect the fake sender to verify what happened.</div>
          <div class="step"><strong>5.</strong> Notice that you verified behavior without real infrastructure.</div>
        </div>
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 8 concept</div><strong>Fake-based verification</strong></div>
            <button class="copy-btn" data-copy-target="fake-test-code">Copy snippet</button>
          </div>
          <pre id="fake-test-code">val recordingSender = RecordingNotificationSender()
val testableWelcomeService = WelcomeService(
    messageBuilder = FriendlyWelcomeMessageBuilder(),
    sender = recordingSender,
)

testableWelcomeService.welcome(user)
println("Recorded messages: \${recordingSender.showAllMessages()}")</pre>
        </div>
      `),
      panel('Feature bundle for demos, tests, and inspections', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 8 concept</div><strong>RecordingSendingFeature in action</strong></div>
            <button class="copy-btn" data-copy-target="recording-feature-usage-code">Copy snippet</button>
          </div>
          <pre id="recording-feature-usage-code">val recordingFeature = RecordingSendingFeature()

val featureBasedWelcomeService = WelcomeService(
    messageBuilder = FriendlyWelcomeMessageBuilder(),
    sender = recordingFeature.notificationSender,
)

featureBasedWelcomeService.welcome(user)
println(recordingFeature.allSentMessages.showAllMessages())</pre>
        </div>
        <p>This teaches a subtle but powerful point: composition/setup code can keep a richer bundle for convenience, while business code still receives the narrow dependency it actually needs.</p>
      `),
      panel('How this scales to real apps', `
        <ul>
          <li><strong>Spring Boot:</strong> fake repositories, fake gateways, stub event publishers, fake clocks.</li>
          <li><strong>Android:</strong> fake repositories, fake remote data sources, fake dispatchers, fake local stores.</li>
          <li><strong>Billing lesson:</strong> sandbox gateway and in-memory store are the same teaching pattern in a richer domain.</li>
        </ul>
      `)
    ]
  },
  {
    id: 'container-basics',
    title: 'Container basics',
    navLabel: 'Container basics',
    group: 'Foundations',
    level: 'Intermediate',
    time: '18 min',
    sampleSource: 'sample10.txt',
    summary: 'Learn registrations, resolutions, singleton vs transient lifetimes, KClass-based lookup, and why containers help with wiring but do not replace good boundaries.',
    sections: [
      hero(
        'A DI container stores wiring rules and turns them into object graphs',
        ['Registrations', 'Resolution', 'Lifetimes', 'Composition root'],
        `
          <p>Manual DI is the foundation. A container becomes useful when wiring grows repetitive. It centralizes the rules for creating and reusing objects.</p>
          <p>Sample 8 is especially useful here because the domain is still small enough to understand by eye. You can see exactly what the container stores, what it builds, and why lifetime rules matter.</p>
          <div class="warn">
            <div class="callout-title">Critical caution</div>
            <div>A container is a wiring tool. It should stay near the app edge. If business classes start calling it directly, it turns into a service locator and hides dependencies again.</div>
          </div>
        `
      ),
      panel('Register vs resolve', `
        <div class="tabs" data-tab-group="register-resolve">
          <button class="tab-btn active" data-tab="register">Register</button>
          <button class="tab-btn" data-tab="resolve">Resolve</button>
          <button class="tab-btn" data-tab="meaning">Meaning</button>
        </div>
        <div class="tab-content active" data-tab-panel="register">
          <pre>container.registerSingleton(WelcomeMessageBuilder::class) {
    FriendlyWelcomeMessageBuilder()
}

container.registerSingleton(NotificationSender::class) {
    EmailNotificationSender()
}</pre>
        </div>
        <div class="tab-content" data-tab-panel="resolve">
          <pre>val service = container.resolve(WelcomeService::class)</pre>
        </div>
        <div class="tab-content" data-tab-panel="meaning">
          <ul>
            <li><strong>Register</strong> means: store the recipe.</li>
            <li><strong>Resolve</strong> means: execute the recipe and give me the object according to the lifetime rules.</li>
            <li>The container does not become useful because it is magical. It becomes useful because it centralizes and repeats these decisions consistently.</li>
          </ul>
        </div>
      `),
      panel('What <code>KClass</code> and the three maps are doing', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 8 concept</div><strong>The tiny container internals</strong></div>
            <button class="copy-btn" data-copy-target="container-maps-code">Copy snippet</button>
          </div>
          <pre id="container-maps-code">private val singletonProviders = mutableMapOf&lt;KClass&lt;*&gt;, () -&gt; Any&gt;()
private val singletonInstances = mutableMapOf&lt;KClass&lt;*&gt;, Any&gt;()
private val transientProviders = mutableMapOf&lt;KClass&lt;*&gt;, () -&gt; Any&gt;()</pre>
        </div>
        <div class="compare-grid">
          <div class="compare-card do">
            <h3><code>KClass</code></h3>
            <p>Kotlin’s runtime type reference. It lets the container use types like <code>WelcomeService::class</code> as keys instead of fragile string names.</p>
          </div>
          <div class="compare-card do">
            <h3>Provider map</h3>
            <p>A provider is a recipe card. It explains <em>how</em> to create the object later, but does not necessarily create it yet.</p>
          </div>
          <div class="compare-card do">
            <h3>Instance map</h3>
            <p>This is the cupboard of already-cooked singleton objects. Once built, they are reused instead of rebuilt.</p>
          </div>
        </div>
      `),
      panel('Singleton vs transient vs scoped thinking', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Lifetime</th><th>Meaning</th><th>Welcome sample example</th><th>Spring Boot / Android analogy</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Singleton</td>
                <td>Create once, reuse afterward</td>
                <td><code>FriendlyWelcomeMessageBuilder</code>, <code>EmailNotificationSender</code></td>
                <td>Singleton bean, app-scoped repository/client</td>
              </tr>
              <tr>
                <td>Transient</td>
                <td>Create a new object every time</td>
                <td><code>WelcomeService</code></td>
                <td>Fresh wrapper/use case instance, lightweight per-use object</td>
              </tr>
              <tr>
                <td>Scoped</td>
                <td>Reuse one object within a request/session/screen scope</td>
                <td>Not implemented in the tiny sample, but important to understand</td>
                <td>Request scope in backend, ViewModel scope or feature scope in Android</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('Analogy: recipe cards vs cooked meals', `
        <div class="grid grid-2">
          <div class="card">
            <div class="key">Provider</div>
            <p>A provider is like a recipe card in a kitchen binder. It tells you how to make the dish, but the dish may not exist yet.</p>
          </div>
          <div class="card">
            <div class="key">Singleton instance</div>
            <p>A singleton instance is like one cooked pot of soup already on the stove. Everyone gets servings from the same pot until you decide to make a new one.</p>
          </div>
          <div class="card">
            <div class="key">Transient instance</div>
            <p>A transient is like making one fresh sandwich every time someone orders. No sandwich is stored for reuse.</p>
          </div>
          <div class="card">
            <div class="key">Why the analogy matters</div>
            <p>Container confusion usually drops when you stop thinking “framework magic” and instead think “recipes, stored instances, and lifetime rules.”</p>
          </div>
        </div>
      `),
      panel('Container assembly pipeline', `
        <div class="diagram" data-diagram-group="container-assembly">
          <div class="diagram-stage">
            <div class="kicker">Tap each stage</div>
            <div class="diagram-grid cols-3">
              <button class="diagram-node active" data-diagram-target="empty"><strong>Empty container</strong><small>knows nothing yet</small></button>
              <button class="diagram-node" data-diagram-target="register"><strong>Registrations</strong><small>store providers</small></button>
              <button class="diagram-node" data-diagram-target="graph"><strong>Graph assembly</strong><small>providers resolve other providers</small></button>
              <button class="diagram-node" data-diagram-target="resolve"><strong>Resolution</strong><small>give me the object</small></button>
              <button class="diagram-node" data-diagram-target="lifetimes"><strong>Lifetimes</strong><small>reuse or recreate</small></button>
              <button class="diagram-node" data-diagram-target="boundary"><strong>Boundary rule</strong><small>stay at the edge</small></button>
            </div>
          </div>
          <div class="diagram-info">
            <div class="diagram-panel active" data-diagram-panel="empty">
              <h3>Empty container</h3>
              <p>Before registration, the container cannot build anything. It has no rules yet.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="register">
              <h3>Registrations</h3>
              <p>You bind types to provider recipes. This is configuration, not yet object creation.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="graph">
              <h3>Graph assembly</h3>
              <p>The provider for <code>WelcomeService</code> resolves <code>WelcomeMessageBuilder</code> and <code>NotificationSender</code>. That is how larger object graphs form.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="resolve">
              <h3>Resolution</h3>
              <p>When you call <code>resolve(WelcomeService::class)</code>, the container executes the relevant providers and returns the built object.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="lifetimes">
              <h3>Lifetimes</h3>
              <p>The container decides whether a provider result is reused or recreated based on how it was registered.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="boundary">
              <h3>Boundary rule</h3>
              <p>The clean style is still to configure the container at the application edge, resolve a root object there, and keep constructor injection explicit inside the graph.</p>
            </div>
          </div>
        </div>
      `),
      panel('Tiny container sample', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 10 concept</div><strong>WelcomeLessonContainer in action</strong></div>
            <button class="copy-btn" data-copy-target="welcome-container-code">Copy snippet</button>
          </div>
          <pre id="welcome-container-code">// STEP 1: create the container
val container = WelcomeLessonContainer()

// STEP 2: register the message builder as a singleton (stateless, safe to reuse)
container.registerSingleton(WelcomeMessageBuilder::class) {
    FriendlyWelcomeMessageBuilder()
}

// STEP 3: register the sender as a singleton (stateless in this lesson)
container.registerSingleton(NotificationSender::class) {
    EmailNotificationSender()
}

// STEP 4: register the service as transient (cheap coordinator, no shared state needed)
container.registerTransient(WelcomeService::class) {
    WelcomeService(
        messageBuilder = container.resolve(WelcomeMessageBuilder::class),
        sender = container.resolve(NotificationSender::class),
    )
}

// STEP 5: resolve the ROOT object only — container assembles supporting dependencies inside
val serviceA = container.resolve(WelcomeService::class) // transient: fresh
val serviceB = container.resolve(WelcomeService::class) // transient: fresh again

val senderA = container.resolve(NotificationSender::class) // singleton: same
val senderB = container.resolve(NotificationSender::class) // singleton: same

println(serviceA !== serviceB)  // true — transient = different each time
println(senderA === senderB)    // true — singleton = same instance</pre>
        </div>
        <p>Read those final lines carefully. <code>WelcomeService</code> is transient so each resolution creates a new instance. <code>NotificationSender</code> is singleton so both resolutions return the exact same object. This lifetime difference is the clearest teaching point the container provides.</p>
        <div class="note">
          <div class="callout-title">Why we resolve only WelcomeService in a real app</div>
          <div>In a real application flow the composition root resolves the root object only: <code>container.resolve(WelcomeService::class)</code>. The container builds the nested builder and sender as part of that. Resolving <code>NotificationSender</code> separately here is done only for inspection and teaching purposes.</div>
        </div>
      `),
      panel('Container configured by a private helper function', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 10 concept</div><strong>createEmailWelcomeContainerByHand()</strong></div>
            <button class="copy-btn" data-copy-target="container-by-hand-code">Copy snippet</button>
          </div>
          <pre id="container-by-hand-code">// This private helper centralizes the container configuration.
// The composition root calls it; callers do not wire the container themselves.
private fun createEmailWelcomeContainerByHand(
    sharedWelcomeMessageBuilder: WelcomeMessageBuilder = FriendlyWelcomeMessageBuilder(),
): WelcomeLessonContainer {
    val container = WelcomeLessonContainer()

    container.registerSingleton(WelcomeMessageBuilder::class) {
        sharedWelcomeMessageBuilder
    }
    container.registerSingleton(NotificationSender::class) {
        EmailNotificationSender()
    }
    container.registerTransient(WelcomeService::class) {
        WelcomeService(
            messageBuilder = container.resolve(WelcomeMessageBuilder::class),
            sender = container.resolve(NotificationSender::class),
        )
    }
    return container
}

// SMS variant follows the same pattern, only the sender implementation changes.
private fun createSmsWelcomeContainerByHand(
    sharedWelcomeMessageBuilder: WelcomeMessageBuilder = FriendlyWelcomeMessageBuilder(),
): WelcomeLessonContainer { /* ... same shape, SmsNotificationSender() ... */ }</pre>
        </div>
        <p>The important lesson here is that <strong>registrations are still assembly code</strong>, not business logic. Moving them into a private helper keeps the composition root concise while making the configuration visible in one dedicated place.</p>
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>What changed in sample 10</h3>
            <ul>
              <li>Container setup is extracted into <code>createEmailWelcomeContainerByHand()</code> and <code>createSmsWelcomeContainerByHand()</code>.</li>
              <li>A shared <code>WelcomeMessageBuilder</code> instance can be passed in or defaults to a fresh one.</li>
              <li>The factory object can call these helpers to pre-configure containers for callers.</li>
            </ul>
          </div>
          <div class="compare-card dont">
            <h3>What did NOT change</h3>
            <ul>
              <li><code>WelcomeService</code> constructor injection is identical.</li>
              <li>Lifetime reasoning is identical.</li>
              <li>The composition root still resolves the root object.</li>
            </ul>
          </div>
        </div>
      `),
      panel('Practice task: choose the right lifetimes for a shared draft feature', teachingTask({
        task: 'Choose lifetimes for a note-drafting feature with <code>DraftEditorService</code>, <code>DraftPreviewService</code>, <code>DraftStore</code>, and <code>SpellChecker</code>. The editor and preview must see the same draft text while the feature is open, so the real teaching goal is to identify which object should own the mutable state and which objects can be recreated safely.',
        thinkFirst: [
          'Which object owns mutable draft text and therefore must be shared?',
          'Which objects are mostly wrappers around behavior and can be rebuilt?',
          'Would making the store too long-lived leak draft state between users or screens?',
          'Would making the store too short-lived break shared preview/editor behavior?'
        ],
        codeId: 'foundation-draft-lifetime-solution',
        codeTitle: 'Container registration that preserves shared draft state deliberately',
        code: `container.registerSingleton(DraftStore::class) {
    // Shared state owner: one store keeps the current draft visible to both services.
    InMemoryDraftStore()
}

container.registerSingleton(SpellChecker::class) {
    // Stateless and reusable helper: safe to share when it has no feature-local mutable state.
    DictionarySpellChecker()
}

container.registerTransient(DraftEditorService::class) {
    // Fresh editor wrapper, but it depends on the shared draft store underneath.
    DraftEditorService(
        draftStore = container.resolve(DraftStore::class),
        spellChecker = container.resolve(SpellChecker::class),
    )
}

container.registerTransient(DraftPreviewService::class) {
    // Fresh preview wrapper, but it reads from the exact same shared draft store.
    DraftPreviewService(
        draftStore = container.resolve(DraftStore::class),
    )
}`,
        explanation: [
          {
            title: '<code>DraftStore</code> is the state owner',
            body: 'This is the most important lifetime choice. Editor and preview must both observe the same mutable draft, so they must resolve the same underlying store object.'
          },
          {
            title: '<code>DraftEditorService</code> and <code>DraftPreviewService</code> can stay transient',
            body: 'These services are orchestration wrappers. Recreating them is fine as long as they point to the same shared store.'
          },
          {
            title: '<code>SpellChecker</code> is shared for cost, not for state',
            body: 'A stateless expensive helper is often a good singleton because it does not own per-feature mutable business data.'
          }
        ],
        pipeline: [
          'Container registers the draft store as the shared state owner.',
          'Editor and preview services resolve that same store while remaining lightweight transient wrappers.',
          'Editor writes draft text into the store.',
          'Preview reads from the same store, so the two flows stay connected.',
          'If the store lifetime is wrong, shared state either disappears or leaks too far.'
        ],
        spring: [
          'In backend code, the shared draft state is often request-scoped or feature-scoped rather than app-wide singleton state.',
          'Controllers should not decide lifetime; configuration or composition-root code should.',
          'The main risk is leaking one user\'s temporary draft into another request if the store lives too long.'
        ],
        android: [
          'On Android, a ViewModel or feature-scoped repository/cache is often the right draft-state owner.',
          'Use cases or helper services can be rebuilt while still reading the same ViewModel or repository-backed draft state.',
          'The main risk is losing screen state on recreation or sharing one screen\'s draft globally by accident.'
        ],
        mistakes: [
          'Registering <code>DraftStore</code> as transient so editor and preview silently see different drafts.',
          'Making draft state app-wide singleton when it should only live for one request, screen, or feature.',
          'Confusing “expensive helper” with “state owner” and giving both the same lifetime without thought.'
        ],
        better: 'This solution is better because it aligns object lifetime with data lifetime. The shared mutable state lives in one deliberate owner, while thin services stay cheap and replaceable. That is the core lifetime lesson behind containers, ViewModels, and request-scoped backend collaborators.'
      }))
    ]
  },
  {
    id: 'factories-and-composition-helpers',
    title: 'Factories and composition helpers',
    navLabel: 'Factories & composition',
    group: 'Foundations',
    level: 'Intermediate',
    time: '22 min',
    sampleSource: 'sample10.txt',
    summary: 'Learn how factories and composition helpers automate known assembly recipes, how to combine factories with containers, the full five-approach pipeline comparison, and the lifetime strategy for the welcome domain.',
    sections: [
      hero(
        'Factories and containers are tools — the composition root is still in charge',
        ['Factory helpers', 'Container + factory combo', 'Five-approach pipeline', 'Lifetime strategy'],
        `
          <p>By the time you reach this lesson you know that <strong>constructor injection</strong> is how the service receives dependencies and that the <strong>composition root</strong> is where assembly decisions live. This lesson adds two optional helpers that can make the composition root less repetitive: <strong>factories</strong> and <strong>containers</strong>.</p>
          <div class="good">
            <div class="callout-title">One sentence each</div>
            <div>
              <strong>Factory</strong> — a helper that encodes one known wiring recipe so callers do not have to repeat it.<br/>
              <strong>Container</strong> — a helper that stores many wiring rules and applies lifetime policies so the composition root only needs to configure rules once and then resolve a root object.
            </div>
          </div>
          <div class="warn">
            <div class="callout-title">Neither replaces the composition root</div>
            <div>Somebody still decides which registrations to add, which implementation to use in this environment, and which root object to resolve first. That somebody is always the composition root.</div>
          </div>
        `
      ),
      panel('The five assembly approaches at a glance', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>#</th><th>Approach</th><th>Who assembles?</th><th>Where wiring lives</th><th>Best when</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>No DI</td>
                <td>The service constructs its own collaborators</td>
                <td>Hidden inside the class</td>
                <td>Never — it is the anti-example</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Manual constructor DI</td>
                <td>Composition root calls constructors directly</td>
                <td>Inline in <code>main()</code> or startup</td>
                <td>Small apps, learning fundamentals</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Factory</td>
                <td>Composition root asks factory for a pre-wired object</td>
                <td>Named factory methods</td>
                <td>Repeated known recipes, named entry points</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Container by hand</td>
                <td>Composition root configures container then resolves root</td>
                <td>Registration lambdas in a helper function</td>
                <td>Multiple registrations with lifetime control</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Factory + container</td>
                <td>Composition root asks factory for a pre-configured container</td>
                <td>Factory calls private container helper</td>
                <td>Named environments (email vs SMS) with container benefits</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="note">
          <div class="callout-title">What never changes across all five</div>
          <div><code>WelcomeService</code> still uses constructor injection in every approach. The service itself does not change. Only <strong>who assembles the graph</strong> and <strong>where the wiring knowledge lives</strong> changes.</div>
        </div>
      `),
      panel('Full pipeline diagram: five approaches side by side', `
        <div class="diagram" data-diagram-group="five-approach-pipeline">
          <div class="diagram-stage">
            <div class="kicker">Tap an approach</div>
            <div class="diagram-grid cols-3">
              <button class="diagram-node active" data-diagram-target="nodi"><strong>1 — No DI</strong><small>hidden construction</small></button>
              <button class="diagram-node" data-diagram-target="manualDi"><strong>2 — Manual DI</strong><small>composition root calls constructors</small></button>
              <button class="diagram-node" data-diagram-target="factory"><strong>3 — Factory</strong><small>composition root asks factory</small></button>
              <button class="diagram-node" data-diagram-target="containerByHand"><strong>4 — Container by hand</strong><small>composition root configures container</small></button>
              <button class="diagram-node" data-diagram-target="factoryContainer"><strong>5 — Factory + container</strong><small>factory prepares container</small></button>
            </div>
          </div>
          <div class="diagram-info">
            <div class="diagram-panel active" data-diagram-panel="nodi">
              <h3>1 — No DI: hidden construction</h3>
              <div class="flow">
                <div class="node main">WelcomeServiceNoDi</div>
                <div class="arrow">internally creates</div>
                <div class="node private">DefaultWelcomeMessageBuilder</div>
                <div class="arrow">+</div>
                <div class="node private">ConsoleEmailSender</div>
              </div>
              <p>The class controls its own wiring. You cannot swap email for SMS without editing the class, and you cannot inject a fake sender in tests.</p>
              <div class="warn"><div class="callout-title">Anti-example</div><div>This approach is shown so you can recognise the problem, not as a design to copy.</div></div>
            </div>
            <div class="diagram-panel" data-diagram-panel="manualDi">
              <h3>2 — Manual constructor DI at the composition root</h3>
              <div class="flow">
                <div class="node root">main() — composition root</div>
                <div class="arrow">creates</div>
                <div class="node factory">FriendlyWelcomeMessageBuilder()</div>
                <div class="arrow">creates</div>
                <div class="node factory">EmailNotificationSender() or SmsNotificationSender()</div>
                <div class="arrow">injects into</div>
                <div class="node public">WelcomeService(builder, sender)</div>
                <div class="arrow">calls</div>
                <div class="node main">welcome(user)</div>
              </div>
              <p><code>main()</code> is the composition root. It writes every constructor call. The service is clean because assembly is outside it.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="factory">
              <h3>3 — Factory / composition helper</h3>
              <div class="flow">
                <div class="node root">main() — composition root</div>
                <div class="arrow">calls</div>
                <div class="node factory">WelcomeLessonFactory.createEmailWelcomeService()</div>
                <div class="arrow">which creates internally</div>
                <div class="node private">sharedWelcomeMessageBuilder + EmailNotificationSender()</div>
                <div class="arrow">wired into</div>
                <div class="node public">WelcomeService(builder, sender)</div>
              </div>
              <p>The composition root is still <code>main()</code>. The factory is a helper that encodes one known recipe. The factory object is a Kotlin <code>object</code> singleton, but each call to <code>createEmailWelcomeService()</code> returns a fresh transient service.</p>
              <div class="note"><div class="callout-title">Singleton factory ≠ singleton produced objects</div><div>The factory <code>object</code> itself is a singleton. The services it creates are fresh transient instances each time unless the recipe explicitly reuses an instance.</div></div>
            </div>
            <div class="diagram-panel" data-diagram-panel="containerByHand">
              <h3>4 — Container configured by hand at the composition root</h3>
              <div class="flow">
                <div class="node root">main() — composition root</div>
                <div class="arrow">calls</div>
                <div class="node factory">createEmailWelcomeContainerByHand()</div>
                <div class="arrow">which registers</div>
                <div class="node private">WelcomeMessageBuilder → singleton provider</div>
                <div class="arrow">+</div>
                <div class="node private">NotificationSender → singleton provider</div>
                <div class="arrow">+</div>
                <div class="node private">WelcomeService → transient provider</div>
                <div class="arrow">returns configured container; root calls</div>
                <div class="node public">container.resolve(WelcomeService::class)</div>
                <div class="arrow">container resolves builder + sender internally, then creates</div>
                <div class="node public">WelcomeService(builder, sender)</div>
              </div>
              <p>The composition root decides which helper to call. The container stores rules and applies lifetime policies. The root resolves only the root object — the container assembles nested dependencies automatically.</p>
            </div>
            <div class="diagram-panel" data-diagram-panel="factoryContainer">
              <h3>5 — Factory + container combined</h3>
              <div class="flow">
                <div class="node root">main() — composition root</div>
                <div class="arrow">calls</div>
                <div class="node factory">WelcomeLessonFactory.createContainerWithEmailSender()</div>
                <div class="arrow">which delegates to</div>
                <div class="node factory">createEmailWelcomeContainerByHand(sharedWelcomeMessageBuilder)</div>
                <div class="arrow">registers rules, returns</div>
                <div class="node private">WelcomeLessonContainer (fully configured)</div>
                <div class="arrow">root then calls</div>
                <div class="node public">container.resolve(WelcomeService::class)</div>
                <div class="arrow">container assembles</div>
                <div class="node public">WelcomeService(builder, sender)</div>
              </div>
              <p>The stack is: <strong>composition root → factory → container → resolved service</strong>. The factory helps prepare the container. The container performs the resolution. The composition root still chooses both.</p>
            </div>
          </div>
        </div>
      `),
      panel('WelcomeLessonFactory — the composition helper object', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 10 concept</div><strong>Factory methods at a glance</strong></div>
            <button class="copy-btn" data-copy-target="welcome-factory-code">Copy snippet</button>
          </div>
          <pre id="welcome-factory-code">internal object WelcomeLessonFactory {
    // Shared stateless builder — safe to reuse across all factory methods.
    private val sharedWelcomeMessageBuilder: WelcomeMessageBuilder = FriendlyWelcomeMessageBuilder()

    // Named email recipe
    fun createEmailWelcomeService(): WelcomeService =
        WelcomeService(
            messageBuilder = sharedWelcomeMessageBuilder,
            sender = EmailNotificationSender(),
        )

    // Named SMS recipe
    fun createSmsWelcomeService(): WelcomeService =
        WelcomeService(
            messageBuilder = sharedWelcomeMessageBuilder,
            sender = SmsNotificationSender(),
        )

    // Richer recording scenario — returns a bundle of service + read-side inspection handle
    fun createRecordingWelcomeScenario(): RecordingWelcomeScenario {
        val recordingFeature = RecordingSendingFeature()
        return RecordingWelcomeScenario(
            welcomeService = WelcomeService(
                messageBuilder = sharedWelcomeMessageBuilder,
                sender = recordingFeature.notificationSender,
            ),
            sentMessages = recordingFeature.allSentMessages,
        )
    }

    // Factory that pre-configures and returns a container for email
    fun createContainerWithEmailSender(): WelcomeLessonContainer =
        createEmailWelcomeContainerByHand(sharedWelcomeMessageBuilder)

    // Factory that pre-configures and returns a container for SMS
    fun createContainerWithSmsSender(): WelcomeLessonContainer =
        createSmsWelcomeContainerByHand(sharedWelcomeMessageBuilder)
}</pre>
        </div>
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>Shared builder is a private singleton inside the factory</h3>
            <p><code>sharedWelcomeMessageBuilder</code> is a <code>private val</code> on the factory <code>object</code>. Because the factory object is itself a Kotlin singleton, this builder is created once and reused. It is stateless, so sharing it is safe.</p>
          </div>
          <div class="compare-card do">
            <h3>Each call to createEmailWelcomeService() returns a new service</h3>
            <p>The factory method creates a fresh <code>WelcomeService</code> each time. The factory itself being a singleton does not make its output a singleton. Those are independent decisions.</p>
          </div>
          <div class="compare-card dont">
            <h3>Common confusion to avoid</h3>
            <p>Students often assume that because the factory is a singleton, everything it creates is also a singleton. That is incorrect. The factory provides a named recipe. Lifetime is still a separate choice made inside that recipe.</p>
          </div>
        </div>
      `),
      panel('RecordingWelcomeScenario — bundle returned by the factory', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 10 concept</div><strong>Scenario bundle and its usage</strong></div>
            <button class="copy-btn" data-copy-target="recording-scenario-code">Copy snippet</button>
          </div>
          <pre id="recording-scenario-code">// Bundle data class
data class RecordingWelcomeScenario(
    val welcomeService: WelcomeService,
    val sentMessages: SentMessages,
)

// Factory method creates both pieces together
fun createRecordingWelcomeScenario(): RecordingWelcomeScenario {
    val recordingFeature = RecordingSendingFeature()
    return RecordingWelcomeScenario(
        welcomeService = WelcomeService(
            messageBuilder = sharedWelcomeMessageBuilder,
            sender = recordingFeature.notificationSender,
        ),
        sentMessages = recordingFeature.allSentMessages,
    )
}

// Usage at the composition root
val scenario = WelcomeLessonFactory.createRecordingWelcomeScenario()
scenario.welcomeService.welcome(UserProfile(name = "Ola", contact = "ola@example.com"))
println(scenario.sentMessages.showAllMessages())</pre>
        </div>
        <p>This bundle is a small but important teaching pattern. The factory creates multiple related objects together and hands the caller just the pieces they need. The caller does not need to know about <code>RecordingSendingFeature</code> or <code>RecordingNotificationSender</code> internally.</p>
        <div class="note">
          <div class="callout-title">When a factory should return a bundle</div>
          <div>A factory method returning a bundle is useful when several related objects must be created together, but the write side and read side must be exposed separately. It avoids leaking internal wiring while keeping the scenario convenient to use from the composition root.</div>
        </div>
      `),
      panel('Private container configuration helpers', `
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 10 concept</div><strong>createEmailWelcomeContainerByHand()</strong></div>
            <button class="copy-btn" data-copy-target="container-by-hand-code">Copy snippet</button>
          </div>
          <pre id="container-by-hand-code">// Private helper — callers go through WelcomeLessonFactory, not directly here.
private fun createEmailWelcomeContainerByHand(
    sharedWelcomeMessageBuilder: WelcomeMessageBuilder = FriendlyWelcomeMessageBuilder(),
): WelcomeLessonContainer {
    val container = WelcomeLessonContainer()

    // Singleton: stateless builder is safe to share
    container.registerSingleton(WelcomeMessageBuilder::class) {
        sharedWelcomeMessageBuilder
    }

    // Singleton: email sender is also stateless in this lesson
    container.registerSingleton(NotificationSender::class) {
        EmailNotificationSender()
    }

    // Transient: lightweight coordinator, no shared state needed
    container.registerTransient(WelcomeService::class) {
        WelcomeService(
            messageBuilder = container.resolve(WelcomeMessageBuilder::class),
            sender = container.resolve(NotificationSender::class),
        )
    }

    return container
}

// SMS variant follows the same shape — only the sender implementation differs
private fun createSmsWelcomeContainerByHand(
    sharedWelcomeMessageBuilder: WelcomeMessageBuilder = FriendlyWelcomeMessageBuilder(),
): WelcomeLessonContainer {
    val container = WelcomeLessonContainer()
    container.registerSingleton(WelcomeMessageBuilder::class) { sharedWelcomeMessageBuilder }
    container.registerSingleton(NotificationSender::class) { SmsNotificationSender() }
    container.registerTransient(WelcomeService::class) {
        WelcomeService(
            messageBuilder = container.resolve(WelcomeMessageBuilder::class),
            sender = container.resolve(NotificationSender::class),
        )
    }
    return container
}</pre>
        </div>
        <p>These private helpers are the configuration step. They register rules — they do not yet run the resolution. Keeping them private enforces that callers go through the factory's public API instead of wiring the container themselves.</p>
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>This is still assembly code, not business logic</h3>
            <p>Container configuration belongs at the assembly boundary. Moving it into a private helper keeps the composition root concise while keeping the configuration visible in one dedicated place.</p>
          </div>
          <div class="compare-card do">
            <h3>The shared builder flows through</h3>
            <p>The factory passes its own <code>sharedWelcomeMessageBuilder</code> into the container helper. So both the email and SMS containers share the same stateless builder instance, no matter which container type the composition root chooses.</p>
          </div>
        </div>
      `),
      panel('Resolution pipeline inside the container', `
        <div class="diagram" data-diagram-group="resolution-pipeline">
          <div class="diagram-stage">
            <div class="kicker">Follow the resolution decision tree</div>
            <div class="diagram-grid cols-4">
              <button class="diagram-node active" data-diagram-target="step1"><strong>Request</strong><small>ask for a type</small></button>
              <button class="diagram-node" data-diagram-target="step2"><strong>Singleton cache</strong><small>already built?</small></button>
              <button class="diagram-node" data-diagram-target="step3"><strong>Singleton provider</strong><small>build + cache it</small></button>
              <button class="diagram-node" data-diagram-target="step4"><strong>Transient provider</strong><small>build fresh, no cache</small></button>
            </div>
          </div>
          <div class="diagram-info">
            <div class="diagram-panel active" data-diagram-panel="step1">
              <h3>Step 1 — Request a type</h3>
              <p>The composition root (or a nested registration provider) calls <code>container.resolve(SomeType::class)</code>. The container begins the resolution pipeline.</p>
              <pre>container.resolve(WelcomeService::class)</pre>
            </div>
            <div class="diagram-panel" data-diagram-panel="step2">
              <h3>Step 2 — Check singleton instance cache</h3>
              <p>The container first checks <code>singletonInstances</code>. If an already-built object exists for this type, it is returned immediately. This is why singleton resolution is fast after the first call.</p>
              <pre>singletonInstances[type]?.let { return it as T }</pre>
            </div>
            <div class="diagram-panel" data-diagram-panel="step3">
              <h3>Step 3 — Check singleton provider</h3>
              <p>If no cached instance exists, the container checks <code>singletonProviders</code>. If a provider is found, it is called once, the result is cached in <code>singletonInstances</code>, and the object is returned. All future calls skip here and hit step 2.</p>
              <pre>singletonProviders[type]?.let { provider ->
    val instance = provider()
    singletonInstances[type] = instance  // cache for reuse
    return instance as T
}</pre>
            </div>
            <div class="diagram-panel" data-diagram-panel="step4">
              <h3>Step 4 — Transient provider or error</h3>
              <p>If neither singleton map has the type, the container checks <code>transientProviders</code>. The provider is called but the result is NOT stored. Each call re-runs the provider, returning a fresh object. If nothing is found, the container throws a readable error listing the unregistered type.</p>
              <pre>transientProviders[type]?.let { provider ->
    return provider() as T  // no caching — fresh each time
}
error("No registration found for \${type.simpleName}")</pre>
            </div>
          </div>
        </div>
      `),
      panel('Lifetime strategy: singleton vs transient choices for each class', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Object</th><th>Lifetime</th><th>Reason</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>FriendlyWelcomeMessageBuilder</code></td>
                <td>Singleton</td>
                <td>Stateless. No per-user mutable fields. Safe and cheap to share.</td>
              </tr>
              <tr>
                <td><code>EmailNotificationSender</code></td>
                <td>Singleton</td>
                <td>Stateless in this lesson. No per-call mutable state. One shared instance is fine.</td>
              </tr>
              <tr>
                <td><code>SmsNotificationSender</code></td>
                <td>Singleton</td>
                <td>Same reasoning as email sender.</td>
              </tr>
              <tr>
                <td><code>WelcomeService</code></td>
                <td>Transient</td>
                <td>Lightweight coordinator. Does not own shared mutable state. Creating fresh ones is cheap and keeps lifetime reasoning simple.</td>
              </tr>
              <tr>
                <td><code>RecordingNotificationSender</code></td>
                <td>Transient (usually)</td>
                <td>Each demo or test wants its own isolated message history. Only use singleton if you intentionally want one shared recording history across callers.</td>
              </tr>
              <tr>
                <td><code>RecordingSendingFeature</code></td>
                <td>Transient (usually)</td>
                <td>Same reason as above — usually you want fresh recording state per scenario.</td>
              </tr>
              <tr>
                <td><code>WelcomeLessonFactory</code></td>
                <td>Singleton (Kotlin object)</td>
                <td>Stateless namespace for creation methods. Holds no mutable per-run state.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="good">
          <div class="callout-title">Practical lifetime decision rule</div>
          <div>
            <ol>
              <li>Does the object carry mutable state that should NOT be shared? If yes, transient is often safer.</li>
              <li>Is the object stateless and cheap/safe to reuse? If yes, singleton is often reasonable.</li>
              <li>Does sharing it create surprising coupling between callers? If yes, avoid singleton.</li>
              <li>Is it a lightweight coordinator with no identity worth sharing? Transient is often the natural default.</li>
            </ol>
          </div>
        </div>
      `),
      panel('Composition root → factory → container: the delegation chain', `
        <div class="timeline">
          <div class="step"><strong>1.</strong> The composition root is the outermost place that decides how objects are wired. It is always present in every approach.</div>
          <div class="step"><strong>2.</strong> The factory is an optional helper. The composition root calls it when a known recipe exists. The factory calls the container helper or the constructors directly.</div>
          <div class="step"><strong>3.</strong> The container is an optional tool. The composition root or the factory configures it. The composition root then resolves the root object and lets the container assemble nested dependencies.</div>
          <div class="step"><strong>4.</strong> The composition root resolves the ROOT object only — not every nested dependency separately. The container handles the rest internally.</div>
          <div class="step"><strong>5.</strong> The business class (<code>WelcomeService</code>) never changes regardless of which helper is used. Constructor injection is always the mechanism. Only the assembly layer changes.</div>
        </div>
        <div class="code-card">
          <div class="code-head">
            <div><div class="kicker">Sample 10 concept</div><strong>All five approaches shown in main()</strong></div>
            <button class="copy-btn" data-copy-target="full-main-code">Copy snippet</button>
          </div>
          <pre id="full-main-code">val user = UserProfile(name = "Mila", contact = "mila@example.com")

// 1) NO DI -------------------------------------------------------
val noDiService = WelcomeServiceNoDi()
noDiService.welcome(user)

// 2) MANUAL CONSTRUCTOR DI ----------------------------------------
val messageBuilder: WelcomeMessageBuilder = FriendlyWelcomeMessageBuilder()
val emailSender: NotificationSender = EmailNotificationSender()
val emailWelcomeService = WelcomeService(messageBuilder = messageBuilder, sender = emailSender)
emailWelcomeService.welcome(user)

// 3) FACTORY ------------------------------------------------------
val factoryEmailService = WelcomeLessonFactory.createEmailWelcomeService()
val factorySmsService   = WelcomeLessonFactory.createSmsWelcomeService()
factoryEmailService.welcome(user)
factorySmsService.welcome(UserProfile(name = "Iris", contact = "+1555000123"))

// Factory produces fresh services; shared builder is reused inside
val factoryEmailServiceA = WelcomeLessonFactory.createEmailWelcomeService()
val factoryEmailServiceB = WelcomeLessonFactory.createEmailWelcomeService()
println(factoryEmailServiceA !== factoryEmailServiceB)  // true — transient

// 4) CONTAINER CONFIGURED BY HAND ---------------------------------
val emailContainer = createEmailWelcomeContainerByHand()
val serviceA = emailContainer.resolve(WelcomeService::class)  // transient: fresh
val serviceB = emailContainer.resolve(WelcomeService::class)  // transient: fresh again
val senderA  = emailContainer.resolve(NotificationSender::class)  // singleton
val senderB  = emailContainer.resolve(NotificationSender::class)  // same instance
println(serviceA !== serviceB)  // true
println(senderA === senderB)    // true

val smsContainer = createSmsWelcomeContainerByHand()
val smsService = smsContainer.resolve(WelcomeService::class)
smsService.welcome(UserProfile(name = "Timothy", contact = "timothy@example.com"))

// 5) FACTORY + CONTAINER ------------------------------------------
val fcEmailContainer = WelcomeLessonFactory.createContainerWithEmailSender()
val fcSmsContainer   = WelcomeLessonFactory.createContainerWithSmsSender()

val fcEmailService = fcEmailContainer.resolve(WelcomeService::class)
val fcSmsService   = fcSmsContainer.resolve(WelcomeService::class)

fcEmailService.welcome(UserProfile(name = "Nora", contact = "nora@example.com"))
fcSmsService.welcome(UserProfile(name = "Philo", contact = "philo@example.com"))</pre>
        </div>
      `),
      panel('Key vocabulary summary', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Term</th><th>One-sentence meaning</th><th>In this lesson</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>Dependency</td>
                <td>A collaborator another class needs to do its job</td>
                <td><code>WelcomeMessageBuilder</code> and <code>NotificationSender</code> are the two dependencies of <code>WelcomeService</code></td>
              </tr>
              <tr>
                <td>Abstraction / contract</td>
                <td>An interface describing behavior without fixing an implementation</td>
                <td><code>WelcomeMessageBuilder</code>, <code>NotificationSender</code>, <code>SentMessages</code>, <code>SendingFeature</code></td>
              </tr>
              <tr>
                <td>Factory</td>
                <td>A helper whose job is to create and wire objects for a known scenario</td>
                <td><code>WelcomeLessonFactory</code> with named methods for email, SMS, recording, and container variants</td>
              </tr>
              <tr>
                <td>Composition root</td>
                <td>The outermost place where objects are created and wired together</td>
                <td><code>main()</code> in the sample — it calls factory or container and resolves the root object</td>
              </tr>
              <tr>
                <td>DI container</td>
                <td>A helper that stores wiring rules and lifetime policies and creates objects on demand</td>
                <td><code>WelcomeLessonContainer</code> with <code>registerSingleton</code>, <code>registerTransient</code>, <code>resolve</code></td>
              </tr>
              <tr>
                <td>Registration / binding</td>
                <td>Telling the container what to build for a given type</td>
                <td><code>container.registerSingleton(NotificationSender::class) { EmailNotificationSender() }</code></td>
              </tr>
              <tr>
                <td>Resolution</td>
                <td>Asking the container to apply rules and give you an object right now</td>
                <td><code>container.resolve(WelcomeService::class)</code></td>
              </tr>
              <tr>
                <td>Lifetime</td>
                <td>How long a created object lives — singleton reuses, transient always creates fresh</td>
                <td>Builder and senders are singleton; <code>WelcomeService</code> is transient</td>
              </tr>
            </tbody>
          </table>
        </div>
      `)
    ]
  },
  {
    id: 'welcome-to-billing-bridge',
    title: 'Welcome to billing bridge',
    navLabel: 'Welcome → Billing bridge',
    group: 'Foundations',
    level: 'Intermediate',
    time: '9 min',
    summary: 'A bridge page that shows how the simple welcome example grows into the richer billing design with hidden adapters, shared state, and feature bundles.',
    sections: [
      panel('Same core idea, richer domain', `
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Welcome sample</th><th>Billing sample</th><th>What stayed the same</th><th>What became richer</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><code>WelcomeService</code></td>
                <td><code>CheckoutService</code></td>
                <td>Business service coordinates collaborators</td>
                <td>Billing introduces more hidden infrastructure and stronger public boundaries</td>
              </tr>
              <tr>
                <td><code>WelcomeMessageBuilder</code></td>
                <td>Receipt creation + hidden gateway result translation</td>
                <td>Business-facing output is still built from collaborator results</td>
                <td>Billing adds mapping from low-level gateway output to public receipt output</td>
              </tr>
              <tr>
                <td><code>NotificationSender</code></td>
                <td><code>ApprovedPaymentGateway</code></td>
                <td>Both are infrastructure collaborators</td>
                <td>Billing hides the gateway contract more aggressively because it is more sensitive</td>
              </tr>
              <tr>
                <td><code>SendingFeature</code> bundle</td>
                <td><code>BillingFeature</code> bundle</td>
                <td>Setup code may hold a broader package while business classes still depend on narrower contracts</td>
                <td>Billing makes the shared-state reason for bundling much stronger</td>
              </tr>
              <tr>
                <td>Recording fake sender</td>
                <td>Sandbox gateway, in-memory store</td>
                <td>Swappable dependencies still help with tests and safe demos</td>
                <td>Billing adds environment choice, state sharing, and more sensitive adapters</td>
              </tr>
              <tr>
                <td>Tiny container registrations</td>
                <td>Billing composition roots and feature bundle registrations</td>
                <td>Container still stores wiring rules</td>
                <td>Billing adds the idea that multiple services must share the same hidden store</td>
              </tr>
            </tbody>
          </table>
        </div>
      `),
      panel('When the simple sample stops being enough', `
        <div class="timeline">
          <div class="step"><strong>1.</strong> At first, one service with swappable implementations is enough.</div>
          <div class="step"><strong>2.</strong> Then the domain grows and read/write concerns split into separate public capabilities.</div>
          <div class="step"><strong>3.</strong> Shared hidden state becomes important, so wiring must guarantee both services share one graph.</div>
          <div class="step"><strong>4.</strong> Sensitive adapters need stronger visibility boundaries, so private/internal contracts become more important.</div>
          <div class="step"><strong>5.</strong> At that point you need the richer patterns taught by the billing course: feature bundles, composition roots, and environment-specific policy.</div>
        </div>
      `),
      panel('Practical takeaway', `
        <div class="good">
          <div class="callout-title">Use both examples together</div>
          <div>The welcome sample teaches the mechanics of DI clearly. The billing sample teaches how those same mechanics scale when the business domain has hidden adapters, shared state, security concerns, and multiple public capabilities. Treat the welcome sample as the tutorial mode, and the billing sample as the applied architecture mode.</div>
        </div>
        <div class="compare-grid">
          <div class="compare-card do">
            <h3>Use the welcome sample when</h3>
            <ul>
              <li>You are still learning what a dependency is.</li>
              <li>You want to understand constructor injection without domain noise.</li>
              <li>You want simple mental models for fake-based testing and lifetime basics.</li>
            </ul>
          </div>
          <div class="compare-card do">
            <h3>Use the billing sample when</h3>
            <ul>
              <li>You need to reason about public vs hidden boundaries.</li>
              <li>You need multiple services to share state safely.</li>
              <li>You want backend/mobile architecture patterns closer to real production code.</li>
            </ul>
          </div>
        </div>
      `)
    ]
  }
];

