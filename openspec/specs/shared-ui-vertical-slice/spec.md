# app-owned-portfolio-components Specification

## Purpose
Define the app-owned portfolio component contract after retiring the local UI package abstraction.

## Requirements

### Requirement: App-owned portfolio components
The system SHALL keep portfolio-specific components in `apps/web`.

#### Scenario: A portfolio component is authored
- **WHEN** a component exists only to render the portfolio app
- **THEN** it lives under `apps/web/src`
- **AND** it does not require a reusable workspace package API

#### Scenario: Typography assumptions are considered
- **WHEN** a portfolio component is authored for app use
- **THEN** it avoids `prose` and Fumadocs-specific typography assumptions

### Requirement: App-local class composition utility
The system SHALL expose class composition from the web app.

#### Scenario: Classes are composed
- **WHEN** app components merge caller-provided or conditional classes
- **THEN** they use `apps/web/src/lib/cn.ts` backed by `clsx` and `tailwind-merge`

### Requirement: Variant API restraint
The system SHALL defer CVA until a component has real variant complexity.

#### Scenario: A static component is extracted
- **WHEN** the component has no meaningful variant axis
- **THEN** it does not introduce CVA or a variant abstraction

### Requirement: Resume section header slice
The system SHALL keep the resume section header in the web app.

#### Scenario: Resume section headers render
- **WHEN** the web app renders resume sections
- **THEN** the section header UI comes from `apps/web/src/components/resume/SectionHeader.tsx`
- **AND** the rendered visual structure remains equivalent to the previous implementation

### Requirement: Semantic token usage
The system SHALL keep semantic Tailwind utility names as the authoring model.

#### Scenario: The extracted slice styles color
- **WHEN** the app component needs color styling
- **THEN** it uses semantic token-backed Tailwind classes instead of raw color literals where a token exists
