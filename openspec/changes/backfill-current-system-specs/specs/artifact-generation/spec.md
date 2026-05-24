## ADDED Requirements

### Requirement: Public artifact generation
The system SHALL generate public resume artifacts from sanitized profile data.

#### Scenario: Resume artifacts are built
- **WHEN** `pnpm run resume:build` is run
- **THEN** the system writes sanitized public resume JSON, Markdown, PDF, and named PDF artifacts under `packages/profile/public/`

### Requirement: Web artifact mirroring
The system SHALL mirror public artifacts into the web app public directory for static serving.

#### Scenario: Artifact build completes
- **WHEN** public profile artifacts are built
- **THEN** `apps/web/public/` contains mirrored public resume, PDF, Markdown, and Raindrop snapshot artifacts

### Requirement: CLI artifact mirroring
The system SHALL mirror public artifacts and shared profile source modules into the CLI package.

#### Scenario: CLI mirrors are built
- **WHEN** public profile artifacts are built
- **THEN** `packages/cli/profile/public/` and `packages/cli/profile/src/` match their corresponding public artifacts and shared source modules

### Requirement: Agent discovery artifact
The system SHALL maintain `llms.txt` as a public agent discovery artifact.

#### Scenario: Agent discovery is served
- **WHEN** agents read `apps/web/public/llms.txt`
- **THEN** they can discover canonical site URLs, the public MCP endpoint, the npm package, curated public links, and suggested public-profile prompts

### Requirement: Raindrop snapshot artifact
The system SHALL treat `raindrops.json` as a generated sanitized public artifact.

#### Scenario: Public artifacts are mirrored
- **WHEN** public artifacts are built
- **THEN** the sanitized Raindrop snapshot is mirrored for website and CLI package consumption

### Requirement: Verification
The artifact generation contract SHALL be protected by build and smoke checks.

#### Scenario: Artifact verification runs
- **WHEN** maintainers verify generated artifacts
- **THEN** they run `pnpm run resume:build`, `pnpm run public:smoke`, and `pnpm run llms:smoke`
