export type CourseModuleKey = 'core' | 'foundations' | 'patterns' | 'comparisons' | 'importantConcepts' | 'mastery' | 'platformStarters' | 'advanced'

export interface CourseManifestEntry {
  group?: string
  id: string
  level?: string
  moduleKey: CourseModuleKey
  navLabel: string
  sampleSource?: string
  searchText: string
  summary?: string
  time?: string
  title: string
}

export const manifestViews: CourseManifestEntry[] = [
  { id: "home", title: "Start here", navLabel: "Start here", moduleKey: "core", searchText: "start here start here billing di masterclass with the shared receipt pipeline big picture first analogy: restaurant cashier, records clerk, and ledger book how to use the deeper practice-driven version of the app"
  },
  { id: "learning-path", title: "Learning path", navLabel: "Learning path", moduleKey: "foundations", searchText: "learning path learning path foundations beginner 8 min a study roadmap that shows how to move from first-principles di to richer backend and android feature design. a roadmap from first-principles di to real production architecture roadmap for mastering the course choose a study track glossary you will keep using"
    , group: "Foundations"
    , level: "Beginner"
    , time: "8 min"
    , summary: "A study roadmap that shows how to move from first-principles DI to richer backend and Android feature design."
  },
  { id: "welcome-foundations", title: "Welcome foundations", navLabel: "Welcome foundations", moduleKey: "foundations", searchText: "welcome foundations welcome foundations foundations beginner 15 min sample10.txt + sample9.txt a simpler welcome-message domain that teaches dependencies, hidden construction, abstractions, constructor injection, and why setup code should stay separate from business flow, now reinforced with a much more detailed password-reset example. learn di in a simpler domain before the richer billing example the domain model and dependencies analogy: a greeting-card desk in a shop no di version: what goes wrong separate the workflow from the setup choice pipeline comparison: no di vs di practice task: redesign a password-reset flow using the same di idea sample 9 symbol map: what every reset-password piece is doing"
    , group: "Foundations"
    , level: "Beginner"
    , time: "15 min"
    , sampleSource: "sample10.txt + sample9.txt"
    , summary: "A simpler welcome-message domain that teaches dependencies, hidden construction, abstractions, constructor injection, and why setup code should stay separate from business flow, now reinforced with a much more detailed password-reset example."
  },
  { id: "constructor-injection", title: "Constructor injection", navLabel: "Constructor injection", moduleKey: "foundations", searchText: "constructor injection constructor injection foundations beginner 14 min sample10.txt learn how abstractions, narrow contracts, and constructor injection make the welcome flow swappable without changing the service itself. public contracts make swappability possible the constructor-injected service why <code>sendingfeature</code> is not the dependency of <code>welcomeservice</code> one underlying object can be viewed through two interfaces manual wiring at the edge what to use / what not to use practice task: refactor a report sender into constructor injection"
    , group: "Foundations"
    , level: "Beginner"
    , time: "14 min"
    , sampleSource: "sample10.txt"
    , summary: "Learn how abstractions, narrow contracts, and constructor injection make the welcome flow swappable without changing the service itself."
  },
  { id: "testability-with-fakes", title: "Testability with fakes", navLabel: "Testability with fakes", moduleKey: "foundations", searchText: "testability with fakes testability with fakes foundations beginner 13 min sample10.txt use a recording fake sender to understand why constructor injection makes business code easier to test, inspect, and reason about safely. a fake sender replaces real infrastructure why <code>sentmessages</code> is separate from <code>notificationsender</code> why fake dependencies matter end-to-end learning flow feature bundle for demos, tests, and inspections how this scales to real apps"
    , group: "Foundations"
    , level: "Beginner"
    , time: "13 min"
    , sampleSource: "sample10.txt"
    , summary: "Use a recording fake sender to understand why constructor injection makes business code easier to test, inspect, and reason about safely."
  },
  { id: "container-basics", title: "Container basics", navLabel: "Container basics", moduleKey: "foundations", searchText: "container basics container basics foundations intermediate 18 min sample10.txt learn registrations, resolutions, singleton vs transient lifetimes, kclass-based lookup, and why containers help with wiring but do not replace good boundaries. a di container stores wiring rules and turns them into object graphs register vs resolve what <code>kclass</code> and the three maps are doing singleton vs transient vs scoped thinking analogy: recipe cards vs cooked meals container assembly pipeline tiny container sample container configured by a private helper function practice task: choose the right lifetimes for a shared draft feature"
    , group: "Foundations"
    , level: "Intermediate"
    , time: "18 min"
    , sampleSource: "sample10.txt"
    , summary: "Learn registrations, resolutions, singleton vs transient lifetimes, KClass-based lookup, and why containers help with wiring but do not replace good boundaries."
  },
  { id: "factories-and-composition-helpers", title: "Factories and composition helpers", navLabel: "Factories & composition", moduleKey: "foundations", searchText: "factories and composition helpers factories & composition foundations intermediate 22 min sample10.txt learn how factories and composition helpers automate known assembly recipes, how to combine factories with containers, the full five-approach pipeline comparison, and the lifetime strategy for the welcome domain. factories and containers are tools — the composition root is still in charge the five assembly approaches at a glance full pipeline diagram: five approaches side by side welcomelessonfactory — the composition helper object recordingwelcomescenario — bundle returned by the factory private container configuration helpers resolution pipeline inside the container lifetime strategy: singleton vs transient choices for each class composition root → factory → container: the delegation chain key vocabulary summary"
    , group: "Foundations"
    , level: "Intermediate"
    , time: "22 min"
    , sampleSource: "sample10.txt"
    , summary: "Learn how factories and composition helpers automate known assembly recipes, how to combine factories with containers, the full five-approach pipeline comparison, and the lifetime strategy for the welcome domain."
  },
  { id: "welcome-to-billing-bridge", title: "Welcome to billing bridge", navLabel: "Welcome → Billing bridge", moduleKey: "foundations", searchText: "welcome to billing bridge welcome → billing bridge foundations intermediate 9 min a bridge page that shows how the simple welcome example grows into the richer billing design with hidden adapters, shared state, and feature bundles. same core idea, richer domain when the simple sample stops being enough practical takeaway"
    , group: "Foundations"
    , level: "Intermediate"
    , time: "9 min"
    , summary: "A bridge page that shows how the simple welcome example grows into the richer billing design with hidden adapters, shared state, and feature bundles."
  },
  { id: "auth-di-redaction", title: "Auth DI and redaction", navLabel: "Auth DI + redaction", moduleKey: "patterns", searchText: "auth di and redaction auth di + redaction factory & policy track intermediate 14 min sample2.txt a login-flow lesson showing no di vs constructor di, composition + delegation, and why redacting logs is part of real architecture—not an afterthought. login flow di: dependencies, log safety, and decorator-style redaction what the auth sample teaches that the welcome sample does not no di login manager: why it is risky redacting logger: composition + delegation in practice auth pipeline: where redaction belongs platform mapping practice task: place redaction in the right layer"
    , group: "Factory & policy track"
    , level: "Intermediate"
    , time: "14 min"
    , sampleSource: "sample2.txt"
    , summary: "A login-flow lesson showing no DI vs constructor DI, composition + delegation, and why redacting logs is part of real architecture—not an afterthought."
  },
  { id: "private-constructor-factory", title: "Private constructor factory", navLabel: "Private constructor factory", moduleKey: "patterns", searchText: "private constructor factory private constructor factory factory & policy track beginner 9 min sample4.txt a focused lesson on validated value objects, compile-time creation restriction, runtime validation, normalization, and why private constructors matter. use private constructors when an object must only exist in a valid state core idea with <code>apikey</code> compile-time restriction vs runtime validation when to use and when not to use this pattern real-world mapping practice task: decide if this should be a validated value object"
    , group: "Factory & policy track"
    , level: "Beginner"
    , time: "9 min"
    , sampleSource: "sample4.txt"
    , summary: "A focused lesson on validated value objects, compile-time creation restriction, runtime validation, normalization, and why private constructors matter."
  },
  { id: "factory-method-patterns", title: "Factory method patterns", navLabel: "Factory method patterns", moduleKey: "patterns", searchText: "factory method patterns factory method patterns factory & policy track intermediate 15 min sample6.txt a detailed lesson on explicit factories, reflection-based factories, approval rules, and how factories keep creation policy out of the rest of the application. factories centralize construction policy so business code does not choose implementations everywhere explicit factory with approved creators reflection-based factory: what changes interactive factory pipeline common real-world uses practice task: explicit factory or reflection?"
    , group: "Factory & policy track"
    , level: "Intermediate"
    , time: "15 min"
    , sampleSource: "sample6.txt"
    , summary: "A detailed lesson on explicit factories, reflection-based factories, approval rules, and how factories keep creation policy out of the rest of the application."
  },
  { id: "factory-vs-container", title: "Factory vs container", navLabel: "Factory vs container", moduleKey: "patterns", searchText: "factory vs container factory vs container factory & policy track intermediate 12 min sample3.txt a focused comparison showing that factories and containers solve different levels of creation problems and often work together rather than competing. the key difference in one sentence secret report service makes the difference visible container can use a factory internally factory vs container comparison platform mapping practice task: factory or container for this feature?"
    , group: "Factory & policy track"
    , level: "Intermediate"
    , time: "12 min"
    , sampleSource: "sample3.txt"
    , summary: "A focused comparison showing that factories and containers solve different levels of creation problems and often work together rather than competing."
  },
  { id: "pattern-chooser", title: "Pattern chooser", navLabel: "Pattern chooser", moduleKey: "patterns", searchText: "pattern chooser pattern chooser factory & policy track advanced 11 min sample5.txt a compact decision guide comparing private constructor factories, explicit factories, reflection-based factories, di containers, and real-app hidden-implementation factories. choose the simplest pattern that solves the real problem suggested learning and implementation order rule-of-thumb matrix for your projects practice ladder: pick the smallest sufficient pattern"
    , group: "Factory & policy track"
    , level: "Advanced"
    , time: "11 min"
    , sampleSource: "sample5.txt"
    , summary: "A compact decision guide comparing private constructor factories, explicit factories, reflection-based factories, DI containers, and real-app hidden-implementation factories."
  },
  { id: "allowlist-vs-hidden-boundary", title: "Allowlist vs hidden boundary", navLabel: "Allowlist vs hidden boundary", moduleKey: "patterns", searchText: "allowlist vs hidden boundary allowlist vs hidden boundary factory & policy track advanced 10 min sample7.txt a policy lesson showing the difference between ordinary interfaces + allowlists and stronger hidden-boundary designs. allowlists are policy. hidden boundaries are stronger design control. the allowlist example what an allowlist is good at what an allowlist does not solve alone decision rule for real projects practice task: choose policy only or policy plus enforcement"
    , group: "Factory & policy track"
    , level: "Advanced"
    , time: "10 min"
    , sampleSource: "sample7.txt"
    , summary: "A policy lesson showing the difference between ordinary interfaces + allowlists and stronger hidden-boundary designs."
  },
  { id: "architecture-comparisons", title: "Architecture comparisons", navLabel: "Architecture comparisons", moduleKey: "comparisons", searchText: "architecture comparisons architecture comparisons architecture comparisons intermediate 15 min sample2-8 + samplecode.txt a side-by-side interactive comparison of no di, constructor di, explicit factories, manual composition roots, containers, hidden-boundary factories, and the service locator anti-pattern. compare the architecture patterns side by side before choosing one interactive architecture compare mode pipeline comparison: where the creation choice lives real-world mapping matrix practice workshop: choose the architecture before reading the answer"
    , group: "Architecture comparisons"
    , level: "Intermediate"
    , time: "15 min"
    , sampleSource: "sample2-8 + samplecode.txt"
    , summary: "A side-by-side interactive comparison of no DI, constructor DI, explicit factories, manual composition roots, containers, hidden-boundary factories, and the service locator anti-pattern."
  },
  { id: "scope-comparisons", title: "Scope comparisons", navLabel: "Scope comparisons", moduleKey: "comparisons", searchText: "scope comparisons scope comparisons architecture comparisons applied 10 min sample3.txt + sample8.txt + advanced curriculum a granular lesson comparing singleton, transient, request, viewmodel, worker, and feature-scoped lifetimes across backend and android designs. lifetime comparison table interactive lifetime chooser concrete lifetime case studies: backend vs android vs worker quick exercise: choose the scope before reading the answer"
    , group: "Architecture comparisons"
    , level: "Applied"
    , time: "10 min"
    , sampleSource: "sample3.txt + sample8.txt + advanced curriculum"
    , summary: "A granular lesson comparing singleton, transient, request, ViewModel, worker, and feature-scoped lifetimes across backend and Android designs."
  },
  { id: "qualifiers-and-provider-selection", title: "Qualifiers and provider selection", navLabel: "Qualifiers + provider selection", moduleKey: "importantConcepts", searchText: "qualifiers and provider selection qualifiers + provider selection important concepts applied 12 min additional recommended concepts learn how to handle multiple implementations of the same abstraction without confusion, and when to use qualifiers, factories, or lazy/provider access. when one interface has many valid implementations, you need a selection strategy three ways to choose between implementations interactive compare: qualifier vs factory vs provider platform-specific starter snippets where this appears in real projects practice task: qualifier, factory, or provider?"
    , group: "Important concepts"
    , level: "Applied"
    , time: "12 min"
    , sampleSource: "additional recommended concepts"
    , summary: "Learn how to handle multiple implementations of the same abstraction without confusion, and when to use qualifiers, factories, or lazy/provider access."
  },
  { id: "scope-and-lifetime-bugs", title: "Scope and lifetime bugs", navLabel: "Scope + lifetime bugs", moduleKey: "importantConcepts", searchText: "scope and lifetime bugs scope + lifetime bugs important concepts applied 12 min additional recommended concepts learn the most common lifetime mistakes that make di-based designs fail in real apps, especially around shared state, request data, viewmodel state, and workers. most di bugs are not syntax bugs — they are lifetime and scope mistakes common lifetime bugs pipeline of a scope bug interactive bug diagnosis checklist before choosing a lifetime practice task: debug the scope bug like an architect"
    , group: "Important concepts"
    , level: "Applied"
    , time: "12 min"
    , sampleSource: "additional recommended concepts"
    , summary: "Learn the most common lifetime mistakes that make DI-based designs fail in real apps, especially around shared state, request data, ViewModel state, and workers."
  },
  { id: "async-config-deterministic-deps", title: "Async, config, and deterministic dependencies", navLabel: "Async + config + deterministic deps", moduleKey: "importantConcepts", searchText: "async, config, and deterministic dependencies async + config + deterministic deps important concepts applied 13 min additional recommended concepts learn why clocks, uuid generators, dispatchers, feature flags, and config readers should often be injected instead of called directly from business code. inject time, ids, dispatchers, and config when you need deterministic behavior examples of deterministic dependencies platform-specific starter snippets when direct global access is still okay why this matters to your course goals practice task: make the feature deterministic on purpose"
    , group: "Important concepts"
    , level: "Applied"
    , time: "13 min"
    , sampleSource: "additional recommended concepts"
    , summary: "Learn why clocks, UUID generators, dispatchers, feature flags, and config readers should often be injected instead of called directly from business code."
  },
  { id: "self-check-lab", title: "Self-check lab", navLabel: "Self-check lab", moduleKey: "mastery", searchText: "self-check lab self-check lab mastery lab review 14 min course synthesis interactive self-check prompts with model answers so you can test whether you truly understand the patterns instead of only recognizing them while reading. use self-check prompts to turn passive reading into active understanding mastery path: how these pages now work as a challenge ladder di basics self-checks factory and container self-checks platform and lifetime self-checks hands-on mastery drills"
    , group: "Mastery lab"
    , level: "Review"
    , time: "14 min"
    , sampleSource: "course synthesis"
    , summary: "Interactive self-check prompts with model answers so you can test whether you truly understand the patterns instead of only recognizing them while reading."
  },
  { id: "confusion-hotspots", title: "Confusion hotspots", navLabel: "Confusion hotspots", moduleKey: "mastery", searchText: "confusion hotspots confusion hotspots mastery lab review 12 min course synthesis a detailed guide to the places learners most often get confused, with side-by-side explanations and concrete examples. common concept confusions explained carefully concrete confusing example: same interface, many choices concrete confusing example: one object, two interface views confusion checklist you can reuse challenge checkpoint: separate dao, repository, and viewmodel in one sentence each"
    , group: "Mastery lab"
    , level: "Review"
    , time: "12 min"
    , sampleSource: "course synthesis"
    , summary: "A detailed guide to the places learners most often get confused, with side-by-side explanations and concrete examples."
  },
  { id: "spring-end-to-end-map", title: "Spring end-to-end map", navLabel: "Spring end-to-end map", moduleKey: "mastery", searchText: "spring end-to-end map spring end-to-end map mastery lab applied 16 min course synthesis a full end-to-end feature map showing how one spring boot feature should be structured from controller to configuration to infrastructure and tests. one full spring boot feature map from http boundary to infrastructure full feature pipeline where each responsibility belongs end-to-end starter sketch practice translation: map your own backend feature to this shape"
    , group: "Mastery lab"
    , level: "Applied"
    , time: "16 min"
    , sampleSource: "course synthesis"
    , summary: "A full end-to-end feature map showing how one Spring Boot feature should be structured from controller to configuration to infrastructure and tests."
  },
  { id: "android-end-to-end-map", title: "Android end-to-end map", navLabel: "Android end-to-end map", moduleKey: "mastery", searchText: "android end-to-end map android end-to-end map mastery lab applied 16 min course synthesis a full android feature map showing how ui, viewmodel, use cases, repositories, local/remote sources, and workers fit together in one coherent architecture. one full android feature map from ui intent to repository and worker reuse full android feature pipeline where each android responsibility belongs end-to-end starter sketch practice translation: map your own android feature to this shape mapper placement checkpoint: can you separate dto, entity, and domain clearly? android challenge: draw the dao-aware data path"
    , group: "Mastery lab"
    , level: "Applied"
    , time: "16 min"
    , sampleSource: "course synthesis"
    , summary: "A full Android feature map showing how UI, ViewModel, use cases, repositories, local/remote sources, and workers fit together in one coherent architecture."
  },
  { id: "architecture-review-checklists", title: "Architecture review checklists", navLabel: "Architecture review checklists", moduleKey: "mastery", searchText: "architecture review checklists architecture review checklists mastery lab review 11 min course synthesis practical checklists you can use while building your own features in backend or android to catch design problems before they spread. general architecture review checklist spring boot review checklist android review checklist smell detector final mastery rubric capstone progressive challenge path exam-style capstone levels expected-solution rubric you can grade yourself with capstone prompt bank"
    , group: "Mastery lab"
    , level: "Review"
    , time: "11 min"
    , sampleSource: "course synthesis"
    , summary: "Practical checklists you can use while building your own features in backend or Android to catch design problems before they spread."
  },
  { id: "public-api", title: "Public API", navLabel: "Public API", moduleKey: "core", searchText: "public api public api chargerequest paymentreceipt checkoutservice receiptqueryservice billingfeature checkoutenvironment"
  },
  { id: "hidden-internals", title: "Hidden internals", navLabel: "Hidden internals", moduleKey: "core", searchText: "hidden internals hidden internals approvedpaymentgateway gatewaychargeresult loggerdata receiptstore billinglogger inmemoryreceiptstore consolebillinglogger defaultcheckoutservice defaultreceiptqueryservice defaultbillingfeature stripepaymentgateway and sandboxpaymentgateway"
  },
  { id: "roots-and-container", title: "Container and roots", navLabel: "Container and roots", moduleKey: "core", searchText: "container and roots container and roots billinglessoncontainer registersingleton() registertransient() resolve() createbillinglessoncontainer() billingcompositionroot billingcontainercompositionroot checkoutservicefactory"
  },
  { id: "pipelines", title: "Pipelines", navLabel: "Pipelines", moduleKey: "core", searchText: "pipelines pipelines detailed manual pipeline detailed container pipeline detailed shared-store pipeline compare manual vs container"
  },
  { id: "implementation-guide", title: "Implementation guide", navLabel: "Implementation guide", moduleKey: "core", searchText: "implementation guide implementation guide how to apply this in future designs what goes where what not to put where real-world examples"
  },
  { id: "line-by-line", title: "Line-by-line", navLabel: "Line-by-line", moduleKey: "core", searchText: "line-by-line line-by-line line-by-line walkthrough of the new pipeline code"
  },
  { id: "labs", title: "Labs", navLabel: "Labs", moduleKey: "core", searchText: "labs labs copyable experiments"
  },
  { id: "object-graphs", title: "Object graphs", navLabel: "Object graphs", moduleKey: "core", searchText: "object graphs object graphs clickable object graph: full billing feature clickable object graph: manual root vs container root"
  },
  { id: "annotated-code", title: "Annotated code", navLabel: "Annotated code", moduleKey: "core", searchText: "annotated code annotated code line-by-line annotated kotlin walkthrough"
  },
  { id: "spring-boot-starter-kit", title: "Spring Boot starter kit", navLabel: "Spring Boot starter kit", moduleKey: "platformStarters", searchText: "spring boot starter kit spring boot starter kit platform starters applied 16 min samplecode.txt + advanced curriculum copyable starter snippets for structuring a kotlin spring boot feature with controllers, use cases, hidden adapters, configuration, and tests. a practical spring boot starter built from the course architecture ideas suggested package layout spring data model path: http dto vs domain model vs persistence entity spring naming convention for mapping-heavy features spring mapper files: a realistic way to organize them spring mapping anti-patterns to avoid interactive spring starter snippets spring boot pipeline to follow practice task: extend the spring starter with a refund flow"
    , group: "Platform starters"
    , level: "Applied"
    , time: "16 min"
    , sampleSource: "samplecode.txt + advanced curriculum"
    , summary: "Copyable starter snippets for structuring a Kotlin Spring Boot feature with controllers, use cases, hidden adapters, configuration, and tests."
  },
  { id: "android-starter-kit", title: "Android starter kit", navLabel: "Android starter kit", moduleKey: "platformStarters", searchText: "android starter kit android starter kit platform starters applied 16 min sample8.txt + samplecode.txt + advanced curriculum copyable starter snippets for structuring android features with hilt, viewmodels, use cases, repositories, room/retrofit boundaries, and workmanager reuse. an android starter that keeps ui, use cases, repositories, and data sources in the right places suggested android package layout android data model path: domain model vs entity vs network dto recommended android naming rules for mapping-heavy features android mapper files: a realistic feature-module layout android mapper anti-patterns to avoid interactive android starter snippets android pipeline to follow android query flow you should be able to trace exactly android anti-pattern examples for mapping confusion practice task: extend the android starter with a cancel-payment action practice task: place the dao in the right spot practice task: place retrofit, entity mapping, and dao work correctly android feature pipeline room + retrofit + repository: one comparison table concrete naming convention for larger android teams spring vs android mapper symmetry at a glance practice task: extend the android starter with a receipt reconciliation feature"
    , group: "Platform starters"
    , level: "Applied"
    , time: "16 min"
    , sampleSource: "sample8.txt + samplecode.txt + advanced curriculum"
    , summary: "Copyable starter snippets for structuring Android features with Hilt, ViewModels, use cases, repositories, Room/Retrofit boundaries, and WorkManager reuse."
  },
  { id: "spring-boot-complete-feature", title: "Spring Boot complete feature", navLabel: "Spring Boot complete feature", moduleKey: "platformStarters", searchText: "spring boot complete feature spring boot complete feature platform starters advanced 18 min course synthesis one complete kotlin spring boot billing feature with idempotent checkout, receipt history, configuration wiring, adapters, and focused tests. one complete spring boot billing feature from http boundary to hidden adapters feature pipeline from request to persistence complete spring feature code map confusing places explained extension task: add webhook reconciliation to the spring feature"
    , group: "Platform starters"
    , level: "Advanced"
    , time: "18 min"
    , sampleSource: "course synthesis"
    , summary: "One complete Kotlin Spring Boot billing feature with idempotent checkout, receipt history, configuration wiring, adapters, and focused tests."
  },
  { id: "android-hilt-complete-feature", title: "Android Hilt complete feature", navLabel: "Android Hilt complete feature", moduleKey: "platformStarters", searchText: "android hilt complete feature android hilt complete feature platform starters advanced 18 min course synthesis one complete android checkout feature using hilt, viewmodel, repository, room/retrofit, workmanager sync, and deterministic dependencies. one complete android feature with hilt, offline-friendly repository design, and worker reuse android feature pipeline complete android feature code map confusing places explained dao deep dive: one responsibility in the bigger android pipeline retrofit deep dive: one responsibility in the bigger android pipeline extension task: add receipt filtering without breaking the android architecture extension task: add a dao-backed favorites flag"
    , group: "Platform starters"
    , level: "Advanced"
    , time: "18 min"
    , sampleSource: "course synthesis"
    , summary: "One complete Android checkout feature using Hilt, ViewModel, repository, Room/Retrofit, WorkManager sync, and deterministic dependencies."
  },
  { id: "decision-guide", title: "Decision guide", navLabel: "Decision guide", moduleKey: "advanced", searchText: "decision guide decision guide choose the right design tool for the job interactive pipeline: where each decision belongs which tool solves which problem? questions to ask before coding architecture design studio: solve the scenario before reading the answer"
  },
  { id: "real-life-scenarios", title: "Real-life scenarios", navLabel: "Real-life scenarios", moduleKey: "advanced", searchText: "real-life scenarios real-life scenarios where these patterns fit in production scenario workshop applicability matrix build-it-yourself scenario set quick exercise: translate one scenario into backend and android language"
  },
  { id: "anti-patterns", title: "Mistakes and anti-patterns", navLabel: "Anti-patterns", moduleKey: "advanced", searchText: "mistakes and anti-patterns anti-patterns common mistakes that make di feel harder than it is what to do / what not to do failure pipeline: how bugs usually appear quick anti-pattern exercise"
  },
  { id: "spring-boot-mapping", title: "Spring Boot mapping", navLabel: "Spring Boot", moduleKey: "advanced", searchText: "spring boot mapping spring boot map the lesson to spring boot backend design spring structure mapping interactive spring pipeline spring boot sample wiring quick spring mapping exercise"
  },
  { id: "android-studio-mapping", title: "Android Studio mapping", navLabel: "Android", moduleKey: "advanced", searchText: "android studio mapping android map the lesson to android studio app architecture android structure mapping room entity vs dao vs retrofit vs repository interactive android pipeline hilt-friendly example quick android mapping exercise with dao detail quick android data-path exercise with retrofit and dao"
  },
  { id: "production-readiness", title: "Production readiness", navLabel: "Production readiness", moduleKey: "advanced", searchText: "production readiness production readiness things you may not have considered yet operational pipeline beyond the lesson testing and observability strategy safe logging and redaction production exercise: add one more real-world concern"
  },
  { id: "project-files", title: "Project files to edit", navLabel: "Project files", moduleKey: "core", searchText: "project files to edit project files which files matter most in this webapp best editing workflow in intellij"
  }
]
