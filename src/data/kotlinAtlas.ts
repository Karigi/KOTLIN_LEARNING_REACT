export interface SourceFileReference {
  note: string
  path: string
}

export interface SourceTrack {
  focus: string[]
  id: string
  summary: string
  status: 'current' | 'planned'
  title: string
  files: SourceFileReference[]
}

export const sourceTracks: SourceTrack[] = [
  {
    id: 'kotlin-core',
    title: 'Kotlin Core Foundations',
    status: 'planned',
    summary:
      'Starter language fluency that grounds the later architecture lessons: variables, ranges, loops, string templates, and simple entry-point structure.',
    focus: [
      'Read Kotlin syntax without friction',
      'Recognize data-oriented patterns quickly',
      'Build confidence before DI-heavy examples',
    ],
    files: [
      {
        path: 'src/main/kotlin/Main.kt',
        note: 'Introduces the entry point, variables, ranges, loops, and basic output formatting.',
      },
    ],
  },
  {
    id: 'coroutines-flow',
    title: 'Coroutines and Flow',
    status: 'planned',
    summary:
      'Concurrency lessons from sequential suspending functions to structured concurrency, dispatcher switching, exception propagation, and cold streams.',
    focus: [
      'Compare sequential and asynchronous coroutine flows',
      'See how async, launch, and dispatcher switching behave in practice',
      'Understand Flow operators through concrete examples',
    ],
    files: [
      {
        path: 'src/main/kotlin/SynchronousCode.kt',
        note: 'Sequential `runBlocking` and delay timing demonstrations.',
      },
      {
        path: 'src/main/kotlin/AsynchronousCode.kt',
        note: '`launch`, nested jobs, cancellation, and synchronization patterns.',
      },
      {
        path: 'src/main/kotlin/AsyncFunction.kt',
        note: '`async`, `Deferred`, and `await` patterns.',
      },
      {
        path: 'src/main/kotlin/ParallelDecomposition.kt',
        note: 'Parallel decomposition with `coroutineScope` and coordinated awaiting.',
      },
      {
        path: 'src/main/kotlin/Dispatchers.kt',
        note: 'Dispatcher switching with `withContext(Dispatchers.Default)`.',
      },
      {
        path: 'src/main/kotlin/Exceptions.kt',
        note: 'Exception propagation and scope cancellation behavior.',
      },
      {
        path: 'src/main/kotlin/Flows.kt',
        note: 'Cold `Flow` streams with `onStart`, `map`, `filter`, `onEach`, and `collect`.',
      },
    ],
  },
  {
    id: 'sealed-and-reflection',
    title: 'Reflection, Visibility, and Controlled APIs',
    status: 'planned',
    summary:
      'The source project also teaches Kotlin reflection, sealed interfaces, opt-in APIs, and implementation allowlists for sensitive boundaries.',
    focus: [
      'Use `KClass` and reflective inspection intentionally',
      'Understand sealed hierarchies as API control tools',
      'See how opt-in and allowlist techniques harden extension points',
    ],
    files: [
      {
        path: 'src/main/kotlin/KClass.kt',
        note: 'Class references, members, properties, and functions via reflection.',
      },
      {
        path: 'src/main/kotlin/sealedExample/SealedInterface.kt',
        note: 'Sealed interface boundary for controlled implementations.',
      },
      {
        path: 'src/main/kotlin/sealedExample/SealedInterfaceImplementation.kt',
        note: 'Valid implementations and fail-fast behaviour around sealed types.',
      },
      {
        path: 'src/main/kotlin/SubclassOptInRequired.kt',
        note: '`@RequiresOptIn` and `@SubclassOptInRequired` for sensitive APIs.',
      },
      {
        path: 'src/main/kotlin/interfaceAllowList/InterfaceAllowList.kt',
        note: 'Allowlist policy using `KClass` checks for approved implementations.',
      },
    ],
  },
  {
    id: 'factories-and-di',
    title: 'Dependency Injection and Containers',
    status: 'current',
    summary:
      'The current live section in the app: private constructors, companion factories, reflection factories, lifetimes, containers, feature bundles, composition roots, and controlled public APIs.',
    focus: [
      'Separate construction policy from business flow',
      'Compare explicit factories with containers and reflection',
      'Understand shared state, composition roots, and testability',
    ],
    files: [
      {
        path: 'src/main/kotlin/di_factory_examples/FactoryHideConstructor.kt',
        note: 'Private constructor plus companion factory validation.',
      },
      {
        path: 'src/main/kotlin/di_factory_examples/FactoryExample.kt',
        note: 'Explicit factories versus reflection-based creation.',
      },
      {
        path: 'src/main/kotlin/di_factory_examples/FactoryContainerComparison.kt',
        note: 'Singleton and transient lifetimes with a factory/container comparison.',
      },
      {
        path: 'src/main/kotlin/di_factory_examples/FactoryMasterSummary.kt',
        note: 'Capstone comparison of construction and DI strategies.',
      },
      {
        path: 'src/main/kotlin/di_factory_examples/DependencyInjectionPractice.kt',
        note: 'Auth/login DI, redacting decorators, and a tiny DI container.',
      },
      {
        path: 'src/main/kotlin/di_factory_examples/DependencyInjection2.kt',
        note: 'Welcome-message domain covering no-DI, constructor DI, factories, containers, fakes, and feature bundles.',
      },
    ],
  },
  {
    id: 'applied-case-studies',
    title: 'Applied Case Studies',
    status: 'planned',
    summary:
      'The most production-shaped lessons, covering password reset, billing, hidden gateway implementations, shared stores, and report-generation architecture planning.',
    focus: [
      'Map DI and hidden boundaries onto real application features',
      'Study safe write/read separation and public API design',
      'Use architecture roadmaps to reason about larger systems',
    ],
    files: [
      {
        path: 'src/main/kotlin/di_factory_examples/PasswordReset.kt',
        note: 'Token generation, storage, safe summaries, delivery strategies, and query separation.',
      },
      {
        path: 'src/main/kotlin/di_factory_examples/FactoryTrojanDefenseRealApp.kt',
        note: 'Billing/checkout case study with hidden sensitive gateways and composition-root control.',
      },
      {
        path: 'src/main/kotlin/di_factory_examples/MonthlyReports.kt',
        note: 'Architecture roadmap for ingesting files and rendering XLSX, DOCX, PDF, and PPTX reports.',
      },
    ],
  },
]
